import express from "express";
import crypto from "crypto";
import authMiddleware from "../middleware/auth.js";
import {
  bookTicket,
  listOrders,
  updateStatus,
  userOrders,
  verifyOrder,
  getOrderDetails,
} from "../controllers/bookingController.js";
import bookingModel from "../models/bookingsModel.js";
import "dotenv/config"; // Load environment variables

const bookingRouter = express.Router();

// Fetch event stats
bookingRouter.get("/event-stats", async (req, res) => {
  try {
    const bookings = await bookingModel.find({}, "payment address.event status");

    const eventStats = bookings.reduce((acc, { address, payment, status }) => {
      const event = address?.event || "Unknown Event";

      if (!acc[event]) {
        acc[event] = { confirmed: 0, pending: 0 };
      }

      // ✅ Fix Payment Status Check
      if (payment === true || status === "Confirmed") {
        acc[event].confirmed += 1;
      } else {
        acc[event].pending += 1;
      }

      return acc;
    }, {});

    res.json({ success: true, data: eventStats });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Webhook for Razorpay payment verification
bookingRouter.post("/webhook", express.json({ type: "application/json" }), async (req, res) => {
  try {
    const secret = "Aditya25@"; // ✅ Secure Secret Key

    // Validate Razorpay signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      console.log("❌ Invalid Webhook Signature");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    console.log("✅ Webhook verified:", req.body);

    if (req.body.event === "payment.captured") {
      const paymentDetails = req.body.payload.payment.entity;

      // ✅ Update only if paymentId exists
      if (paymentDetails.id) {
        await bookingModel.findOneAndUpdate(
          { paymentId: paymentDetails.id },
          { payment: true, status: "Confirmed" }
        );

        console.log(`✅ Payment confirmed for order: ${paymentDetails.id}`);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error in webhook:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Booking Routes
bookingRouter.post("/ticket", authMiddleware, bookTicket);
bookingRouter.post("/verify", verifyOrder);
bookingRouter.post("/userorders", authMiddleware, userOrders);
bookingRouter.get("/list", listOrders);
bookingRouter.post("/status", updateStatus);
bookingRouter.post("/order-details", getOrderDetails);

export default bookingRouter;
