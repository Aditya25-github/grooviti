// ==============================
// 🌐 Import Modules
// ==============================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import http from "http";
import axios from "axios";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import eventRouter from "./routes/EventRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/CartRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import organizerRoutes from "./routes/organizerRoutes.js";
import reviewRouter from "./routes/ReviewRoute.js";
import communityRoutes from "./routes/communityRoutes.js";
import cloudinary from "./utils/cloudinary.js";
import pccoerRoutes from "./routes/pccoerRoutes.js";
import communityChatRoute from "./routes/communityChatRoute.js";
import registerCommunityChat from "./sockets/communityChat.js";


// ==============================
// 📦 App Configuration
// ==============================
dotenv.config();


const app = express();
const port = process.env.PORT || 4000;

// Ensure uploads folder exists
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}



// ==============================
// 🚀 Create HTTP Server & Socket.io
// ==============================
const server = http.createServer(app); // Create HTTP server manually
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://grooviti.com"], //frontend url to be stored
    methods: ["GET", "POST"],
  },
});

// Export io for controller usage
export { io };

// ==============================
// ⚡ Socket.io Events
// ==============================
io.on("connection", (socket) => {
  socket.on("likePost", (data) => {
    socket.broadcast.emit("postLiked", data);
  });

  socket.on("newComment", (data) => {
    socket.broadcast.emit("commentAdded", data);
  });

  socket.on("newPost", (data) => {
    socket.broadcast.emit("postCreated", data);
  });

  socket.on("disconnect", () => {
  });
});
registerCommunityChat(io);
app.set("io", io);

// ==============================
// 🧩 Middleware
// ==============================
app.use(cors({ exposedHeaders: ["x-rtb-fingerprint-id"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ==============================
// 🔌 Connect MongoDB
// ==============================
connectDB();

import { Slot } from "./models/sports/Turf/turfModel.js";
const SLOT_EXPIRY_INTERVAL = 60 * 5 * 1000; // Check every 5 minutes

const releaseExpiredSlots = async () => {
  try {
    const now = new Date();
    console.log(`Checking for expired slots at ${now.toISOString()}`);
    const expiredSlots = await Slot.updateMany(
      {
        status: "confirming",
        paymentExpiresAt: { $lt: now }
      },
      {
        $set: {
          status: "available",
          userId: null,
          paymentOrderId: null,
          paymentExpiresAt: null,
          confirmingStartedAt: null,
          customerName: null,
          phone: null,
          source: null,
          bookedTickets: 0
        }
      }
    );
    if (expiredSlots.modifiedCount > 0) {
      console.log(`Released ${expiredSlots.modifiedCount} expired slots back to available`);
    }
  } catch (err) {
    console.error("Error releasing expired slots:", err);
  }
};

// Run the cleanup every minute
setInterval(releaseExpiredSlots, SLOT_EXPIRY_INTERVAL);

// ==============================
// 🚏 API Routes
// ==============================
import HalloweenRoutes from "./routes/HalloweenRoutes.js"


app.use("/api/event", eventRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/organizer", organizerRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/community", communityRoutes);
app.use("/api/community", communityChatRoute);
app.use("/api/users", userRouter);
app.use("/api/pccoer", pccoerRoutes);
app.use("/api/pccoer", HalloweenRoutes)

/////////////////////////SPORTS////////////////////////
import academyRoutes from "./routes/Academy/academyRoutes.js"
import turfRoutes from "./routes/sports/Turf/turfRoute.js";
import turfbookingRoute from "./routes/sports/Turf/turfbookingRoute.js"
import slotRoutes from "./routes/sports/Turf/slotRoutes.js";
import staffRoutes from "./routes/sports/Turf/turfStaffRoutes.js";
import academyStudentRoutes from "./routes/Academy/academyStudentRoute.js"
import attendanceRoutes from "./routes/Academy/studentAttendanceRoute.js";
import batchRoutes from "./routes/Academy/batchRoutes.js";
import coachStaffRoutes from "./routes/Academy/coachStaffRoutes.js";

app.use("/api/academy", academyRoutes);
app.use("/api/turfs", turfRoutes);
app.use("/api/turfbookings", turfbookingRoute);
app.use("/api/slots", slotRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/academy-student", academyStudentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/coach-staff", coachStaffRoutes);


// ==============================
// ✅ Test / Utility Routes
// ==============================
app.get("/", (req, res) => {
  res.send("🎉 Grooviti API Working!");
});
//     This will keep backend working without sleeping with Inactivit ///
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get("/api/reverse-geocode", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "GroovitiApp/1.0 (contact@yourdomain.com)",
          "Accept-Language": "en",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Reverse geocode error:", err.response?.data || err.message);
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});



server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
