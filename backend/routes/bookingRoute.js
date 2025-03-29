import express from "express"
import authMiddleware from "../middleware/auth.js"
import { bookTicket, listOrders, updateStatus, userOrders, verifyOrder, getOrderDetails } from "../controllers/bookingController.js"
import bookingModel from "../models/bookingsModel.js";
const bookingRouter = express.Router();

bookingRouter.get("/event-stats", async (req, res) => {
  try {
    const bookings = await bookingModel.find({}, "payment address.event status");

    const eventStats = bookings.reduce((acc, { address, payment, status }) => {
      const event = address?.event || "Unknown Event";

      if (!acc[event]) {
        acc[event] = { confirmed: 0, pending: 0 };
      }

      // Correctly checking payment status
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


bookingRouter.post("/ticket", authMiddleware, bookTicket);
bookingRouter.post("/verify", verifyOrder);
bookingRouter.post("/userorders", authMiddleware, userOrders)
bookingRouter.get("/list", listOrders)
bookingRouter.post("/status", updateStatus)
bookingRouter.post("/order-details", getOrderDetails);

export default bookingRouter