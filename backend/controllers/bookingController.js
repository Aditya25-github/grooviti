import bookingModel from "../models/bookingsModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import dotenv from "dotenv";
import ticketModel from "../models/ticketModel.js";
import path from "path";
import dns from "dns";

dotenv.config(); // Load environment variables

const razorpay = new Razorpay({
  key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
  key_secret: process.env.REACT_APP_RAZORPAY_SECRET_KEY,
});



// Force IPv4 first (helps in some cloud environments)
dns.setDefaultResultOrder("ipv4first");

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false, // STARTTLS on 587
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
  requireTLS: true,
  tls: {
    minVersion: "TLSv1.2",
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("✅ SMTP Connected Successfully!");
  }
});


// Book Ticket
// Book Ticket
const bookTicket = async (req, res) => {
  console.log("\n==============================");
  console.log("📥 NEW BOOKING REQUEST RECEIVED");
  console.log("➡️ Full Request Body:", JSON.stringify(req.body, null, 2));
  console.log("==============================\n");

  try {
    const { userId, items, amount, address } = req.body;

    console.log("🧩 Extracted Data:");
    console.log("userId:", userId);
    console.log("items:", items);
    console.log("amount:", amount);
    console.log("address:", address);

    // FIXED VALIDATION
    if (!userId) {
      console.log("❌ Missing userId");
      return res.json({ success: false, message: "Missing userId" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ Missing items array");
      return res.json({ success: false, message: "Missing items" });
    }

    if (amount === undefined || amount === null) {
      console.log("❌ Missing or invalid amount");
      return res.json({ success: false, message: "Missing amount" });
    }

    if (!address) {
      console.log("❌ Missing address object");
      return res.json({ success: false, message: "Missing address" });
    }

    // REQUIRED FIELDS VALIDATION
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "college_name",
      "Branch",
      "Team_name",
      "Team_leader_name",
      "phone",
      "event",
    ];

    for (let field of requiredFields) {
      if (!address[field] || address[field].trim() === "") {
        console.log(`❌ Missing required address field: ${field}`);
        return res.json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // REQUEST PASSED ALL VALIDATIONS
    console.log("✅ All required fields present. Creating Razorpay order...");

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("🧾 Razorpay Order Created Successfully:", order);

    const newTicket = new bookingModel({
      userId,
      items,
      amount,
      address,
      orderId: order.id,
      status: "Ticket booked, Payment verification pending!",
      payment: false,
    });

    await newTicket.save();
    console.log("💾 Booking saved in DB successfully:", newTicket._id);

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log("🛒 Cart cleared for user:", userId);

    res.json({ success: true, order_id: order.id });

  } catch (error) {
    console.error("❌ ERROR while creating booking:", error);
    res.json({ success: false, message: "Error while making payment" });
  }
};


// Verify Payment & Send Email
// const verifyOrder = async (req, res) => {
//   let { orderId, paymentId, success } = req.body;
//   success = success === "true" || success === true;

//   try {
//     const booking = await bookingModel.findOneAndUpdate(
//       { orderId },
//       {
//         $set: {
//           payment: success,
//           paymentId: paymentId,
//           status: success ? "Confirmed" : "Failed",
//         },
//       },
//       { new: true }
//     );

//     if (!booking) {
//       return res.json({ success: false, message: "Order not found" });
//     }

//     if (!success) {
//       await bookingModel.findOneAndDelete({ orderId });
//       return res.json({ success: false, message: "Payment failed, order deleted" });
//     }

//     for (const item of booking.items) {
//       console.log("🔍 Ticket Item:", item);
//       const event = await ticketModel.findById(item._id);
//       if (!event) continue;

//       const newTicketsSold = event.ticketsSold + item.quantity;
//       console.log(`🧮 ${event.name}: ${event.ticketsSold} + ${item.quantity} = ${newTicketsSold}`)
//       if (newTicketsSold > event.totalTickets) {
//         console.log(`❌ Overbooking prevented for ${event.name}`);
//         continue;
//       }

//       // event.ticketsSold = newTicketsSold;
//       console.log("📧 Preparing to send ticket email...");
//       await ticketModel.findByIdAndUpdate(
//   event._id,
//   { $set: { ticketsSold: newTicketsSold } },
//   { runValidators: false }
// );
// console.log("📧 Email sent successfully");
//       console.log(`✅ Updated ticketsSold for ${event.name} to ${event.ticketsSold}`);
//     }

//     if (booking.address.email) {
//       console.log("Sending email to:", booking.address.email);
//       sendBookingEmail(booking.address.email, booking);
//     } else {
//       console.log("❌ User email not found!");
//     }

//     res.json({ success: true, message: "Payment confirmed & email sent", booking });
//   } catch (error) {
//     console.error("Error verifying order:", error);
//     res.json({ success: false, message: "Error verifying payment" });
//   }

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

    for (const item of booking.items) {
      const event = await ticketModel.findById(item._id);
      if (!event) continue;

      const newTicketsSold = event.ticketsSold + item.quantity;

      if (newTicketsSold > event.totalTickets) {
        console.log(`❌ Overbooking prevented for ${event.name}`);
        continue;
      }

      await ticketModel.findByIdAndUpdate(
        event._id,
        { $set: { ticketsSold: newTicketsSold } },
        { runValidators: false }
      );

      console.log(`✅ Updated ticketsSold for ${event.name} to ${newTicketsSold}`);
    }

    if (booking.address.email) {
      console.log("📧 Sending ticket email...");
      sendBookingEmail(booking.address.email, booking); // no await
    }

    res.json({ success: true, message: "Payment confirmed", booking });

  } catch (error) {
    console.error("Error verifying order:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// Send Confirmation Email
// const sendBookingEmail = async (userEmail, booking) => {
//   try {
//     console.log("📄 Generating PDF Ticket...");
//     console.log("📧 Preparing email for:", userEmail);
//     console.log("📎 Ticket Attachment:", booking?.orderId);
//     const pdfTicket = await generateTicketPDF(booking);
//     console.log("✅ PDF Generated Successfully");

//     const mailOptions = {
//       from: `"Grooviti Team" <${process.env.BREVO_USER}>`,
//       to: userEmail,
//       subject: "🎟️ Your Event Ticket",
//       html: `
//         <h2>Thank you for your booking!</h2>
//         <p>Your payment was successful. Here are your booking details:</p>
//         <p><strong>Ticket ID:</strong> ${booking?.orderId}</p>
//         <p><strong>Event Name:</strong> ${booking?.address.event}</p>
//         <p><strong>Total Amount:</strong> ₹${booking?.amount}</p>
//         <p><strong>Status:</strong> Confirmed ✅</p>
//         <p>We look forward to seeing you at the event!</p>
//         <p>Best Regards,</p>
//         <p>Grooviti Team</p>
//       `,
//       attachments: [
//         {
//           filename: `Ticket_${booking?.orderId}.pdf`,
//           content: pdfTicket,
//         },
//       ],
//     };

//     console.log("📧 Sending email to:", userEmail);
//     await transporter.sendMail(mailOptions).catch(async (err) => {
//   console.log("Retrying email...");
//   await transporter.sendMail(mailOptions);
// });
//     console.log("✅ Email Sent Successfully!");
//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//   }
// };

const sendBookingEmail = async (userEmail, booking) => {
  try {
    console.log("📄 Generating PDF Ticket...");
    console.log("📧 Preparing email for:", userEmail);
    console.log("📎 Ticket Attachment:", booking?.orderId);

    const pdfTicket = await generateTicketPDF(booking);
    console.log("✅ PDF Generated Successfully");

    const mailOptions = {
      from: `"Grooviti Team" <groov.iti25@gmail.com>`,
      to: userEmail,
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
        },
      ],
    };

    console.log("📧 Sending email to:", userEmail);

    // ✅ TIMEOUT + SAFE SEND (IMPORTANT FIX)
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout after 15s")), 15000)
      ),
    ]);

    console.log("✅ Email Sent Successfully!", result);

  } catch (error) {
    console.error("❌ Error sending email:", error.message || error);
  }
};

export const generateTicketPDF = async (booking) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [921, 768], margin: 0 });
      const buffer = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));

      // 🖼️ TEMPLATE (NEW 1.png)
      doc.image("./uploads/1.png", 0, 0, {
        width: 921,
        height: 768,
      });

      // 🎯 LEFT SIDE (SHIFTED LIKE YOUR OLD CODE)

      doc.font("Helvetica-Bold").fillColor("black").fontSize(18);

      // Event Name
      doc.text(`${booking?.address.event}`, -150, 168, {
        align: "center",
      });

      // User Details
      doc.fontSize(14);
      doc.text(
        `${booking?.address.firstName} ${booking?.address.lastName}`,
        -150,260,
        { align: "center" }
      );
      doc.text(booking?.address.email, -150, 290, {
        align: "center",
      });
      doc.text(booking?.address.phone, -150, 325, {
        align: "center",
      });

      // Team Details
      doc.text(`${booking?.address.Team_name || "N/A"}`, -150, 410, {
        align: "center",
      });
      doc.text(`${booking?.address.Team_leader_name || "-"}`, -150, 443, {
        align: "center",
      });
      doc.text(`${booking?.address.Team_size || 1}`, -150, 483, {
        align: "center",
      });

      // 💰 Payment
      doc.text(`Rs. ${booking?.amount}`, -150, 520, {
        align: "center",
      });

      // 🎟️ Ticket ID (bottom right)
      doc.fontSize(14).fillColor("black");
      doc.text(booking?.orderId, 591, 520, {
        width: 200,
        align: "center",
      });

      // 📅 RIGHT SIDE DATE (ABOVE APRIL 2026)

      const eventDate = new Date(booking?.date); // using booking date (or replace with event date if available)
      const day = eventDate.getDate();

      doc
        .font("Helvetica-Bold")
        .fontSize(53)
        .fillColor("#2E2E8B")
        .text(day.toString(), 677, 230); // adjust slightly if needed

      // 🔳 QR CODE (BIG)

      const qrImage = await QRCode.toDataURL(booking?.orderId);

      doc.image(qrImage, 620, 350, {
        width: 150,
        height: 150,
      });

      doc.end();
    } catch (err) {
      console.log("❌ PDF Error:", err);
      reject(err);
    }
  });
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
// fetches particular order from event organizers
const listOrders = async (req, res) => {
  try {
    const organizerEmail = req.query.email;

    if (!organizerEmail) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const organizerEvents = await ticketModel.find({ organizerEmail });

    const eventIds = organizerEvents.map((event) => event._id.toString());

    // Step 3: Find bookings that include any of these event IDs
    const orders = await bookingModel.find({
      "items.eventId": { $in: eventIds }
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
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

// Add this function to bookingController.js

const getBuyersByEvent = async (req, res) => {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    // Find all confirmed bookings that contain this eventId
    const bookings = await bookingModel.find({
      "items.eventId": eventId,
      payment: true, // only confirmed/paid bookings
    });

    // Extract buyer details from address field
    const buyers = bookings.map((booking) => ({
      orderId: booking.orderId,
      amount: booking.amount,
      date: booking.date,
      status: booking.status,
      firstName: booking.address?.firstName || "",
      lastName: booking.address?.lastName || "",
      email: booking.address?.email || "",
      phone: booking.address?.phone || "",
      college_name: booking.address?.college_name || "",
      Branch: booking.address?.Branch || "",
      Team_name: booking.address?.Team_name || "",
      Team_leader_name: booking.address?.Team_leader_name || "",
      Team_size: booking.address?.Team_size || 1,
      Team_member_name_1: booking.address?.Team_member_name_1 || "",
      Team_member_name_2: booking.address?.Team_member_name_2 || "",
      Team_member_name_3: booking.address?.Team_member_name_3 || "",
      Team_member_name_4: booking.address?.Team_member_name_4 || "",
      Team_member_name_5: booking.address?.Team_member_name_5 || "",
      Team_member_name_6: booking.address?.Team_member_name_6 || "",
      Team_member_name_7: booking.address?.Team_member_name_7 || "",
      Team_member_name_8: booking.address?.Team_member_name_8 || "",
      Team_member_name_9: booking.address?.Team_member_name_9 || "",
      Team_member_name_10: booking.address?.Team_member_name_10 || "",
      event: booking.address?.event || "",
    }));

    res.json({ success: true, buyers });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(500).json({ success: false, message: "Error fetching buyers" });
  }
};

// Export Controllers
export { bookTicket, verifyOrder, userOrders, listOrders, updateStatus, getOrderDetails, sendBookingEmail, getBuyersByEvent };
