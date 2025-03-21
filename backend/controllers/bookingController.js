import bookingModel from "../models/bookingsModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const razorpay = new Razorpay({
  key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
  key_secret: process.env.REACT_APP_RAZORPAY_SECRET_KEY,
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate Ticket PDF
const generateTicketPDF = async (booking) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffer = [];

    doc.on("data", (chunk) => buffer.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffer)));

    doc.fontSize(20).text("🎟️ Event Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Booking ID: ${booking._id}`);
    doc.text(`Event: ${booking.items[0]?.eventName}`);
    doc.text(`Amount: ₹${booking.amount}`);
    doc.text(`Status: Confirmed ✅`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.end();
  });
};

// Send Confirmation Email
const sendBookingEmail = async (userEmail, booking) => {
  try {
    const pdfTicket = await generateTicketPDF(booking);

    const mailOptions = {
      from: "groov.iti25@gmail.com",
      to: userEmail,
      subject: "🎟️ Your Event Ticket",
      html: `
        <h2>Thank you for your booking!</h2>
        <p>Your payment was successful. Here are your booking details:</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Event Name:</strong> ${booking.items[0]?.eventName}</p>
        <p><strong>Total Amount:</strong> ₹${booking.amount}</p>
        <p><strong>Status:</strong> Confirmed ✅</p>
        <p>We look forward to seeing you at the event!</p>
        <p>Best Regards,</p>
        <p>Event Team</p>
      `,
      attachments: [
        {
          filename: `Ticket_${booking._id}.pdf`,
          content: pdfTicket,
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email with PDF sent to:", userEmail);
  } catch (error) {
    console.error("Error sending email with PDF:", error);
  }
};

// Book Ticket
const bookTicket = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    if (!userId || !items.length || !amount || !address) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

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

// Verify Payment & Send Email
const verifyOrder = async (req, res) => {
  let { orderId, success, paymentId } = req.body;
  success = success === "true" || success === true;

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

    // Fetch user email and send confirmation email
    const user = await userModel.findById(booking.userId);
    if (user && user.email) {
      console.log("Sending email to:", user.email);
      await sendBookingEmail(user.email, booking);
    }

    res.json({ success: true, message: "Payment confirmed & email sent", booking });
  } catch (error) {
    console.error("Error verifying order:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// Fetch User Orders
const userOrders = async (req, res) => {
  try {
    const orders = await bookingModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch All Orders
const listOrders = async (req, res) => {
  try {
    const orders = await bookingModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Update Order Status
const updateStatus = async (req, res) => {
  try {
    await bookingModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get Order Details
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

// Export Controllers
export { bookTicket, verifyOrder, userOrders, listOrders, updateStatus, getOrderDetails };
