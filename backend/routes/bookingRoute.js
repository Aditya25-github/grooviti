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
import ticketModel from "../models/ticketModel.js";
import "dotenv/config";

const bookingRouter = express.Router();

/* ------------------------------------------------------
   ⬆️ ORGANIZER EVENT STATS
------------------------------------------------------ */
bookingRouter.get("/event-stats", async (req, res) => {
  try {
    const organizerEmail = req.query.email;
    if (!organizerEmail) {
      return res.status(400).json({
        success: false,
        message: "Organizer email required",
      });
    }

    const events = await ticketModel.find({ organizerEmail });
    const eventIdToName = {};

    events.forEach((event) => {
      eventIdToName[event._id.toString()] = event.name;
    });

    const bookings = await bookingModel.find({
      "items._id": { $in: Object.keys(eventIdToName) },
    });

    const eventStats = {};

    for (const booking of bookings) {
      for (const item of booking.items) {
        const id = item._id?.toString();
        if (!eventIdToName[id]) continue;

        const eventName = eventIdToName[id];
        if (!eventStats[eventName]) {
          eventStats[eventName] = { confirmed: 0, pending: 0 };
        }

        if (booking.payment === true || booking.status === "Confirmed") {
          eventStats[eventName].confirmed += 1;
        } else {
          eventStats[eventName].pending += 1;
        }
      }
    }

    return res.json({ success: true, data: eventStats });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* ------------------------------------------------------
   ⬆️ RAZORPAY WEBHOOK
------------------------------------------------------ */
bookingRouter.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    try {
      const secret = "Aditya25@";

      const shasum = crypto.createHmac("sha256", secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest("hex");

      if (digest !== req.headers["x-razorpay-signature"]) {
        console.log("❌ Invalid Webhook Signature");
        return res
          .status(400)
          .json({ success: false, message: "Invalid signature" });
      }

      console.log("✅ Webhook verified:", req.body);

      if (req.body.event === "payment.captured") {
        const paymentDetails = req.body.payload.payment.entity;

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
      console.log("❌ Error in webhook:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

/* ------------------------------------------------------
   ⬆️ BOOKING API (All protected except verify/webhook)
------------------------------------------------------ */

// Create booking (requires userId)
bookingRouter.post("/ticket", authMiddleware, bookTicket);

// Verify order (no auth required - Razorpay returns only order data)
bookingRouter.post("/verify", verifyOrder);

// Fetch user's bookings (protected)
bookingRouter.post("/userorders", authMiddleware, userOrders);

// Fetch order list (protected) ❗ FIXED
bookingRouter.get("/my-orders", authMiddleware, listOrders);

// Change booking status (admin feature, keep open if needed)
bookingRouter.post("/status", updateStatus);

// Order details (protected) ❗ RECOMMENDED FIX
bookingRouter.post("/order-details", authMiddleware, getOrderDetails);

export default bookingRouter;
