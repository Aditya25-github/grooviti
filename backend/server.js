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
    origin: "https://grooviti.com", //frontend url to be stored
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

// ==============================
// 🚏 API Routes
// ==============================
app.use("/api/event", eventRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/organizer", organizerRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/community", communityRoutes);
app.use("/api/users", userRouter);
app.use("/api/pccoer", pccoerRoutes);

/////////////////////////SPORTS////////////////////////
import academyRoutes from "./routes/Academy/academyRoutes.js"
import turfRoutes from "./routes/sports/Turf/turfRoute.js";
import turfbookingRoute from "./routes/sports/Turf/turfbookingRoute.js"
import slotRoutes from "./routes/sports/Turf/slotRoutes.js";

app.use("/api/academy", academyRoutes);
app.use("/api/turfs", turfRoutes);
app.use("/api/turfbookings", turfbookingRoute);
app.use("/api/slots", slotRoutes);


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
