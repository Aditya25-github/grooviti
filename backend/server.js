import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import eventRouter from "./routes/EventRoute.js"
import userRouter from "./routes/userRoute.js"
import "dotenv/config"
import cartRouter from "./routes/CartRoute.js"
import bookingRouter from "./routes/bookingRoute.js"
import reviewRouter from "./routes/ReviewRoute.js";
import axios from "axios";

//app config

const app = express()
const port = process.env.PORT || 4000;


//middle-ware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  exposedHeaders: ["x-rtb-fingerprint-id"],
}))

//db connection 
connectDB()

// API endpoints
app.use("/api/event", eventRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/booking", bookingRouter)
app.use("/api/reviews", reviewRouter)

app.get("/", (req, res) => {
  res.send("API Working")
})

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
          "User-Agent": "GroovitiApp/1.0 (contact@yourdomain.com)", // Customize for your app
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


app.listen(port, () => {
  console.log(`Server Started On http://localhost:${port}`)
})

//mongodb+srv://adityadivate25:0101196625@cluster0.eyk0n.mongodb.net/?