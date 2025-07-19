import eventModel from "../models/ticketModel.js";
import communityModel from "../models/communityModel.js";
import organizerModel from "../models/organizerModel.js";

const PCCOER_ORG_NAME = "pccoer";

export const getPccoerEvents = async (req, res) => {
  try {
    console.log("Fetching organizer for PCCOER...");
    const organizer = await organizerModel.findOne({
      organization: { $regex: `^${PCCOER_ORG_NAME}$`, $options: "i" }
    });
    console.log("Organizer Found:", organizer);

    if (!organizer) return res.status(404).json({ message: "Organizer not found" });

    const events = await eventModel.find({ organizer: organizer._id });
    console.log("Fetched Events:", events);

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error fetching events", error: err.message });
  }
};

export const getPccoerCommunities = async (req, res) => {
  try {
    console.log("Fetching organizer for PCCOER...");
    const organizer = await organizerModel.findOne({
      organization: { $regex: `^${PCCOER_ORG_NAME}$`, $options: "i" }
    });
    console.log("Organizer Found:", organizer);

    if (!organizer) return res.status(404).json({ message: "Organizer not found" });

    const communities = await communityModel.find({ organizer: organizer._id });
    console.log("Fetched Communities:", communities);

    res.status(200).json(communities);
  } catch (err) {
    console.error("Error fetching communities:", err);
    res.status(500).json({ message: "Server error fetching communities", error: err.message });
  }
};
