import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import "./ChatRoom.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

// Helper to keep socket URL consistent even if apiBase is http(s)
function socketUrlFromApiBase(apiBase) {
  // If your server accepts ws on same origin/port, you can just return apiBase.
  // Otherwise, map http->ws and https->wss.
  try {
    const u = new URL(apiBase);
    u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
    return u.toString().replace(/\/$/, ""); // no trailing slash
  } catch {
    return apiBase;
  }
}


export default function ChatRoom({ apiBase, communityId, token, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [olderLoading, setOlderLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);

  // Make a dedicated socket connection for chat to avoid clashing with other features
  const socket = useMemo(
    () =>
      io(socketUrlFromApiBase(apiBase), {
        transports: ["websocket"],
      }),
    [apiBase]
  );
const [showEmoji, setShowEmoji] = useState(false);

function onEmojiSelect(emoji) {
  // emoji.native is the actual character
  setText((t) => (t ?? "") + (emoji?.native || ""));
}

  // Auto-scroll to bottom on new messages (when not loading older)
  useEffect(() => {
    if (!olderLoading) {
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, olderLoading]);

  // Load initial history via socket on join (server will emit "community:history")
  useEffect(() => {
    function onHistory(history) {
      setMessages(history);
      setLoading(false);
    }
    function onNew(msg) {
      setMessages((prev) => [...prev, msg]);
    }
    function onUpdated(msg) {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    }
    function onDeleted({ _id, deletedAt }) {
      setMessages((prev) =>
        prev.map((m) => (m._id === _id ? { ...m, deletedAt, text: "" } : m))
      );
    }
    function onError(e) {
      toast.error(e?.message || "Chat error");
    }

    socket.on("connect", () => {
      socket.emit("community:join", { token, communityId, limit: 30 });
    });
    socket.on("community:history", onHistory);
    socket.on("community:message:new", onNew);
    socket.on("community:message:updated", onUpdated);
    socket.on("community:message:deleted", onDeleted);
    socket.on("community:error", onError);

    return () => {
      socket.off("community:history", onHistory);
      socket.off("community:message:new", onNew);
      socket.off("community:message:updated", onUpdated);
      socket.off("community:message:deleted", onDeleted);
      socket.off("community:error", onError);
      socket.disconnect();
    };
  }, [socket, token, communityId]);

  // Optional: fetch older messages via REST for pagination
  async function fetchOlder() {
    if (!hasMore || olderLoading) return;
    try {
      setOlderLoading(true);
      const before = messages[0]?.createdAt;
      const res = await axios.get(
        `${apiBase}/api/community/${communityId}/chat/history`,
        {
          params: { before, limit: 30 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const older = res.data?.messages ?? [];
      if (older.length === 0) setHasMore(false);
      setMessages((prev) => [...older, ...prev]);
    } catch (e) {
      toast.error("Failed to load older messages");
    } finally {
      setOlderLoading(false);
    }
  }

  function sendMessage() {
    const clean = text.trim();
    if (!clean) return;
    socket.emit("community:message:create", { text: clean });
    setText("");
  }

  function requestEdit(messageId, newText) {
    const clean = newText.trim();
    if (!clean) return;
    socket.emit("community:message:update", { messageId, text: clean });
  }

  function requestDelete(messageId) {
    if (!window.confirm("Delete this message?")) return;
    socket.emit("community:message:delete", { messageId });
  }

  // inline editor state
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  function startEdit(m) {
    setEditingId(m._id);
    setEditDraft(m.text || "");
  }

  function submitEdit() {
    requestEdit(editingId, editDraft);
    setEditingId(null);
    setEditDraft("");
  }

  return (
    <div className="chat-wrap">
      <div className="chat-toolbar">
        <button disabled={!hasMore || olderLoading} onClick={fetchOlder}>
          {olderLoading ? "Loading..." : hasMore ? "Load older" : "No more"}
        </button>
      </div>

      <div className="chat-list" ref={listRef}>
        {loading ? (
          <div className="chat-empty">Loading chat…</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">Say hello 👋</div>
        ) : (
          messages.map((m) => {
            const mine = String(m?.sender?._id || m?.sender) === String(currentUserId);
            const deleted = !!m.deletedAt;
            return (
              <div key={m._id} className={`chat-item ${mine ? "mine" : ""} ${deleted ? "deleted" : ""}`}>
                <div className="chat-header">
                  <span className="chat-author">{m?.sender?.name || "User"}</span>
                  <time className="chat-time">
                    {new Date(m.createdAt).toLocaleString()}
                    {m.editedAt ? " · edited" : ""}
                    {deleted ? " · deleted" : ""}
                  </time>
                </div>

                {editingId === m._id ? (
                  <div className="chat-edit">
                    <input
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitEdit();
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditDraft("");
                        }
                      }}
                      placeholder="Edit message"
                    />
                    <button onClick={submitEdit} disabled={!editDraft.trim()}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditDraft("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="chat-text">{deleted ? "Message deleted" : m.text}</div>
                )}

                {!deleted && mine && editingId !== m._id && (
                  <div className="chat-actions">
                    <button onClick={() => startEdit(m)}>Edit</button>
                    <button onClick={() => requestDelete(m._id)}>Delete</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    <div className="chat-composer">
  <button
    type="button"
    className="emoji-btn"
    aria-label="Add emoji"
    onClick={() => setShowEmoji((v) => !v)}
  >
    😊
  </button>

  {/* Emoji popover */}
  {showEmoji && (
    <div className="emoji-popover" onMouseDown={(e) => e.preventDefault()}>
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        theme="dark"
        previewPosition="none"
        skinTonePosition="none"
        searchPosition="sticky"   // keeps search at top
        navPosition="top"
      />
    </div>
  )}

  <input
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Write a message…"
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }}
  />
  <button onClick={sendMessage} disabled={!text.trim()}>
    Send
  </button>
</div>

    </div>
  );
}
