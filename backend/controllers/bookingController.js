import bookingModel from "../models/bookingsModel.js";
import userModel from "../models/userModel.js"
import Razorpay from "razorpay"


const razorpay = new Razorpay({
  key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
  key_secret: process.env.REACT_APP_RAZORPAY_SECRET_KEY,
});

//placing user order from frontend 
const bookTicket = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items.length || !amount || !address) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Store orderId properly
    const newTicket = new bookingModel({
      userId,
      items,
      amount,
      address,
      orderId: order.id,
      status: "Booked",
      payment: false,
    });

    await newTicket.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, order_id: order.id });
  } catch (error) {
    console.error("Error while making payment:", error);
    res.json({ success: false, message: "Error while making payment" });
  }
};

const verifyOrder = async (req, res) => {
  let { orderId, success, paymentId } = req.body;

  success = success === "true" || success === true; // Convert string to boolean

  try {
    const booking = await bookingModel.findOneAndUpdate(
      { orderId },
      {
        $set: {
          payment: success,
          paymentId: paymentId,
          status: success ? "Confirmed" : "Failed",
        },
      },
      { new: true }
    );

    if (!booking) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (!success) {
      await bookingModel.findOneAndDelete({ orderId });
      return res.json({ success: false, message: "Payment failed, order deleted" });
    }

    res.json({ success: true, message: "Payment confirmed", booking });
  } catch (error) {
    console.error("Error verifying order:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};



const userOrders = async (req, res) => {
  try {
    const orders = await bookingModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

const listOrders = async (req, res) => {
  try {
    const orders = await bookingModel.find({});
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    await bookingModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    const order = await bookingModel.findOne({ orderId });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.json({ success: false, message: "Error fetching order details" });
  }
};



export { bookTicket, verifyOrder, userOrders, listOrders, updateStatus, getOrderDetails };