import express from "express"
import authMiddleware from "../middleware/auth.js"
import { bookTicket, listOrders, updateStatus, userOrders, verifyOrder, getOrderDetails } from "../controllers/bookingController.js"


const bookingRouter = express.Router();

bookingRouter.post("/ticket", authMiddleware, bookTicket);
bookingRouter.post("/verify", verifyOrder);
bookingRouter.post("/userorders", authMiddleware, userOrders)
bookingRouter.get("/list", listOrders)
bookingRouter.post("/status", updateStatus)
bookingRouter.post("/order-details", getOrderDetails);

export default bookingRouter