// sockets/communityChat.js
import CommunityMessage from "../models/CommunityMessage.js";
import { verifyCommunityAccess } from "../utils/communityAccess.js";

const room = (communityId) => `community:${communityId}`;

export default function registerCommunityChat(io) {
  io.on("connection", (socket) => {
    // join a community room + send recent history
    socket.on("community:join", async ({ token, communityId, limit = 30 }) => {
      try {
        const { user, communityId: safeId } =
          await verifyCommunityAccess(`Bearer ${token}`, communityId);

        socket.data.userId = String(user._id);
        socket.data.communityId = safeId;
        socket.join(room(safeId));

        const recent = await CommunityMessage.find({ community: safeId })
          .sort({ createdAt: -1 })
          .limit(Math.max(1, Math.min(100, Number(limit) || 30)))
          .populate("sender", "name profileImage")
          .lean();

        socket.emit("community:history", recent.reverse());
      } catch (err) {
        socket.emit("community:error", { message: err.message || "Join failed" });
      }
    });

    // create
    socket.on("community:message:create", async ({ text }) => {
      try {
        const { userId, communityId } = socket.data;
        if (!userId || !communityId) throw new Error("Not joined");
        const clean = (text || "").trim();
        if (!clean) return;

        const msg = await CommunityMessage.create({
          community: communityId,
          sender: userId,
          text: clean,
        });
        const populated = await msg.populate("sender", "name profileImage");
        io.to(room(communityId)).emit("community:message:new", populated.toObject());
      } catch (err) {
        socket.emit("community:error", { message: err.message || "Create failed" });
      }
    });

    // update (author only)
    socket.on("community:message:update", async ({ messageId, text }) => {
      try {
        const { userId, communityId } = socket.data;
        const msg = await CommunityMessage.findById(messageId);
        if (!msg || String(msg.community) !== String(communityId))
          throw new Error("Message not found");
        if (String(msg.sender) !== String(userId))
          throw new Error("Not your message");

        msg.text = (text || "").trim();
        msg.editedAt = new Date();
        await msg.save();

        const populated = await msg.populate("sender", "name profileImage");
        io.to(room(communityId)).emit("community:message:updated", populated.toObject());
      } catch (err) {
        socket.emit("community:error", { message: err.message || "Update failed" });
      }
    });

    // delete (author only, soft delete)
    socket.on("community:message:delete", async ({ messageId }) => {
      try {
        const { userId, communityId } = socket.data;
        const msg = await CommunityMessage.findById(messageId);
        if (!msg || String(msg.community) !== String(communityId))
          throw new Error("Message not found");
        if (String(msg.sender) !== String(userId))
          throw new Error("Not your message");

        msg.deletedAt = new Date();
        msg.text = "";
        await msg.save();

        io.to(room(communityId)).emit("community:message:deleted", {
          _id: msg._id,
          deletedAt: msg.deletedAt,
        });
      } catch (err) {
        socket.emit("community:error", { message: err.message || "Delete failed" });
      }
    });
  });
}
