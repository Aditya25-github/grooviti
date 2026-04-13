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
  sendBookingEmail,
  getBuyersByEvent,
  sendBookingEmailController
} from "../controllers/bookingController.js";

import bookingModel from "../models/bookingsModel.js";
import ticketModel from "../models/ticketModel.js";
import "dotenv/config";

const bookingRouter = express.Router();

/* ------------------------------------------------------
   ⬆️ ORGANIZER EVENT STATS
------------------------------------------------------ */
bookingRouter.post("/test-email", async (req, res) => {
  try {
    const booking = req.body;

    await sendBookingEmail(booking.address.email, booking);

    res.json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Email test failed",
    });
  }
});
// bookingRouter.post("/test-email", async (req, res) => {
//   try {
//     const booking = {
//       orderId: "TEST123456",
//       amount: 150,
//       address: {
//         firstName: "Swaroop",
//         lastName: "Mane",
//         email: "swaroopmane21@gmail.com",
//         phone: "9999999999",
//         Team_name: "Alpha Team",
//         Team_leader_name: "Swaroop Mane",
//         Team_size: 3,
//         event: "Hackathon",
//       },
//     };

//     await sendBookingEmail(booking.address.email, booking);

//     res.json({
//       success: true,
//       message: "Test email sent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.json({
//       success: false,
//       message: "Email test failed",
//     });
//   }
// });

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

// Add this route to bookingRoute.js:
bookingRouter.get("/buyers", getBuyersByEvent);
bookingRouter.post("/send-email",sendBookingEmailController);

/* ======================================================
   EVENT REVENUE - Based on actual payment amounts
   ====================================================== */
bookingRouter.get("/event-revenue", async (req, res) => {
  try {
    const organizerEmail = req.query.email;
    if (!organizerEmail) {
      return res.status(400).json({
        success: false,
        message: "Organizer email required",
      });
    }

    // Get all events for this organizer
    const events = await ticketModel.find({ organizerEmail });
    const eventDetails = {}; // Store event info by ID

    events.forEach((event) => {
      eventDetails[event._id.toString()] = {
        name: event.name,
        price: event.price,
        ticketsSold: event.ticketsSold,
      };
    });

    // Get all confirmed bookings that contain these events
    const bookings = await bookingModel.find({
      "items._id": { $in: Object.keys(eventDetails) },
      payment: true, // Only confirmed/paid bookings
    });

    // Calculate revenue based on actual amounts paid
    const eventRevenue = {};

    for (const booking of bookings) {
      for (const item of booking.items) {
        const eventId = item._id?.toString();
        if (!eventDetails[eventId]) continue;

        const eventName = eventDetails[eventId].name;
        if (!eventRevenue[eventName]) {
          eventRevenue[eventName] = {
            totalRevenue: 0,
            ticketsSold: 0,
          };
        }

        // Add the actual amount paid (not the current price)
        // Apply 2% Razorpay cut (organizer keeps 98%)
        eventRevenue[eventName].totalRevenue += booking.amount * 0.9763;
        eventRevenue[eventName].ticketsSold += 1;
      }
    }

    return res.json({
      success: true,
      data: eventRevenue,
    });
  } catch (error) {
    console.error("Error fetching event revenue:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default bookingRouter;
