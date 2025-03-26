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
      status: "Ticket booked , Payment verification pending!",
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
  let { orderId, paymentId, success } = req.body;
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

    if (booking.address.email) {
      console.log("Sending email to:", booking.address.email);
      await sendBookingEmail(booking.address.email , booking);
    } else {
      console.log("❌ User email not found!");
    }

    res.json({ success: true, message: "Payment confirmed & email sent", booking });
  } catch (error) {
    console.error("Error verifying order:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// Send Confirmation Email
const sendBookingEmail = async (userEmail,booking) => {
  try {
    console.log("📄 Generating PDF Ticket...");
    console.log("📧 Preparing email for:", booking.address.email);
    console.log("📎 Ticket Attachment:", booking?.orderId);
    const pdfTicket = await generateTicketPDF(booking);
    console.log("✅ PDF Generated Successfully");
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking?.address.email,
      subject: "🎟️ Your Event Ticket",
      html: `
        <h2>Thank you for your booking!</h2>
        <p>Your payment was successful. Here are your booking details:</p>
        <p><strong>Ticket ID:</strong> ${booking?.orderId}</p>
        <p><strong>Event Name:</strong> ${booking?.address.event}</p>
        <p><strong>Total Amount:</strong> ₹${booking?.amount}</p>
        <p><strong>Status:</strong> Confirmed ✅</p>
        <p>We look forward to seeing you at the event!</p>
        <p>Best Regards,</p>
        <p>Grooviti Team</p>
      `,
      attachments: [
        {
          filename: `Ticket_${booking?.orderId}.pdf`,
          content: pdfTicket,
          encoding: "base64",
        },
      ],
    };

    console.log("📧 Sending email to:", booking?.address.email);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

const generateTicketPDF = async (booking) => {
  console.log(booking);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [921, 768], margin: 0 }); // Set size to match ticket template
    const buffer = [];

    doc.on("data", (chunk) => buffer.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffer)));

    // Load the updated ticket template with correct dimensions
    doc.image("./uploads/ticketTemplate1.png", 0, 0, { width: 921, height: 768 });

    // Set font and styling
    doc.font("Helvetica-Bold").fillColor("black").fontSize(18);

    // Event Name
    doc.text(`Technovate-${booking?.address.event}`, -190, 175, { align: "center" });

    // Ticket Holder Details
    doc.fontSize(14);
    doc.text(`${booking?.address.firstName} ${booking?.address.lastName}`, -150, 249, { align: "center" });
    doc.text(booking?.address.email, -150, 278, { align: "center" });
    doc.text(booking?.address.phone, -150, 303, { align: "center" });

    // Team Details
    doc.text(`${booking?.address.Team_name || "N/A"}`, -150, 380, { align: "center" });
    doc.text(`${booking?.address.Team_leader_name}`, -150, 412, { align: "center" }); // Team Leader
    doc.text(`${booking?.address.Team_size || 1}`, -150, 442 , { align:"center" }); // Team Size

    // Payment Details
    doc.text(`Rs. ${booking?.amount}`, -150, 517, { align: "center" });
    doc.text(`No taxes for students`, -150, 547, { align: "center" });
    doc.text(`Rs. ${booking?.amount}`, -150, 575, { align: "center" });

    // Ticket ID & Event Date
    doc.fontSize(20).fillColor("orange");
    doc.text(booking?.orderId, 445, 470, { align: "center" });

    doc.end();
  });
};


// const generateTicketPDF = async (booking) => {
//   console.log(booking)
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ size: "A4", margin: 0 });
//     const buffer = [];

//     doc.on("data", (chunk) => buffer.push(chunk));
//     doc.on("end", () => resolve(Buffer.concat(buffer)));

//     // Load the ticket template
//     doc.image("./uploads/ticketTemplate.png", 0, 0, { width: 595, height: 842 });

//     // Set font and styling
//     doc.font("Helvetica-Bold").fillColor("black").fontSize(18);

//     // Add user name before confirmation message
//     doc.text(`${booking?.address.firstName}`, 50, 200, { align: "left" });
//     doc.font("Helvetica-Bold").fillColor("black").fontSize(14);
//     // Event Details
//     doc.text(`Technovate - ${booking?.address.event}`, 100, 287, { align: "center" });
//     doc.text(`PCCOER`, 100, 317, { align: "center" });
//     doc.text(`3 April 2025`, 100, 346, { align: "center" });

//     // Ticket Holder Details
//     doc.text(`${booking?.address.firstName} ${booking?.address.lastName}`, 100, 449, { align: "center" });
//     doc.text(booking?.address.email, 100, 477, { align: "center" });
//     doc.text(booking?.address.phone,  100, 509, { align: "center" });
//     doc.text(booking?.orderId, 100, 542, { align: "center" });

//     // Payment Details
//     doc.text(`Rs. ${booking?.amount}`, 100, 640, { align: "center" });
//     doc.text("No fees for PCCOER students!!", 100, 680, { align: "center" });
//     doc.text(`Rs. ${booking?.amount}`, 100, 715, { align: "center" });

//     doc.end();
//   });
// };

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
