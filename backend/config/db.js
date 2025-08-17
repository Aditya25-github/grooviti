import mongoose from "mongoose";
// import{ Slot } from "../models/sports/Turf/turfModel.js";
export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://adityadivate25:0101196625@cluster0.eyk0n.mongodb.net/GROOVITI');
    console.log("✅ MongoDB Connected");
    // await Slot.deleteMany({}); // Clear all slots on startup
    // Keep-alive ping every 5 minutes
    setInterval(async () => {
      try {
        // Replace 'turfs' with any lightweight collection
        const db = mongoose.connection.db;
        await db.collection("turfs").findOne();
        console.log("🔁 Keep-alive ping sent to MongoDB");
      } catch (pingErr) {
        console.error("❌ Keep-alive ping failed:", pingErr.message);
      }
    }, 5 * 60 * 1000); // 5 minutes

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};
