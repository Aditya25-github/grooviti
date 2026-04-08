import organizerModel from "../models/organizerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Booking from "../models/bookingsModel.js";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
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

//  Token creation function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//  Register Organizer
export const registerOrganizer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      organization,
      website,
      planName,
      billingCycle,
      amount,
      bio,
      instagram,
      facebook,
      twitter,
      linkedin,
      city,
      state,
    } = req.body;

    if (!name || !email || !password || !organization || !phone) {
      console.log("❌ Missing required fields");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existing = await organizerModel.findOne({ email });
    if (existing) {
      console.log("❌ Email already exists:", email);
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrganizer = new organizerModel({
      name,
      email,
      password: hashedPassword,
      phone,
      organization,
      profileImage: req.file
        ? { url: req.file.path, public_id: req.file.filename }
        : null,
      bio,
      socialLinks: {
        instagram,
        facebook,
        twitter,
        linkedin,
        website,
      },
      address: {
        city,
        state,
        country: "India",
      },
      role: "host",
      plan: {
        name: planName,
        billingCycle,
        amountPaid: amount,
      },
    });

    console.log("🧾 Organizer about to be saved:", newOrganizer);

    await newOrganizer.save();

    console.log("✅ Organizer saved successfully:", newOrganizer.email);

    res.status(201).json({
      success: true,
      message: "Organizer registered",
      userId: newOrganizer._id,
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Organizer By Email
export const getOrganizerByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const organizer = await organizerModel.findOne({ email });

    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    res.status(200).json({
      success: true,
      organizer: {
        name: organizer.name,
        email: organizer.email,
        profileImage: organizer.profileImage,
        role: organizer.role,
        phone: organizer.phone,
        organization: organizer.organization,
        socialLinks: organizer.socialLinks,
        address: organizer.address,
        plan: organizer.plan,
        bio: organizer.bio,
      },
    });
  } catch (error) {
    console.error("Get Organizer Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login Organizer
export const loginOrganizer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const organizer = await organizerModel.findOne({ email });
    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    const isMatch = await bcrypt.compare(password, organizer.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = createToken(organizer._id);

    res.status(200).json({
      success: true,
      token,
      email: organizer.email,
      role: organizer.role,
      name: organizer.name,
      profileImage: organizer.profileImage,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await organizerModel.findById(req.body.userId);
    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    res.json({ success: true, organizer });
  } catch (error) {
    console.error(" Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔄 Update Organizer Profile (name, phone, profileImage, etc.)
export const updateOrganizerProfile = async (req, res) => {
  try {
    const organizerId = req.body.userId; // from authMiddleware

    const updateFields = {
      name: req.body.name,
      phone: req.body.phone,
      organization: req.body.organizationName,
      // bio: req.body.bio,
      address: req.body.address,
      // "socialLinks.website": req.body.website,
    };

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    const updatedOrganizer = await organizerModel.findByIdAndUpdate(
      organizerId,
      updateFields,
      { new: true },
    );

    if (!updatedOrganizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      organizer: updatedOrganizer,
    });
  } catch (error) {
    console.error(" Profile Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const generateCertificates = async (req, res) => {
  try {
    const { eventId } = req.body;
    const bookings = await Booking.find({
      "items._id": eventId,
      attendance: true,
      certificateSent: false,
    });

    console.log("📦 Total bookings found:", bookings.length);

    if (!bookings.length) {
      console.log("❌ No bookings found for this event");
      return res.json({ success: false, message: "No attendees found" });
    }

    for (let booking of bookings) {

      const eventItem = booking.items.find(
        (item) => item._id.toString() === eventId,
      );

      if (!eventItem) {
        console.log(
          "⚠️ Event not found inside items for booking:",
          booking._id,
        );
        continue;
      }

      console.log("📧 Sending to:", booking.address.email);
      await sendCertificateEmail(booking.address.email, booking, eventItem);

      booking.certificateSent = true;
      await booking.save();
    }

    console.log("🎉 API completed successfully");
    res.json({ success: true });
  } catch (err) {
    console.log("❌ ERROR in generateCertificates:", err);
    res.json({ success: false });
  }
};

const sendCertificateEmail = async (userEmail, booking, eventItem) => {
  try {
    const pdfCertificate = await generateCertificatePDF(booking, eventItem);

    const mailOptions = {
      from: `"Grooviti Team" <groov.iti25@gmail.com>`,
      to: userEmail,
      subject: "🎓 Your Certificate",
      html: `
        <h2>Congratulations!</h2>
        <p>You participated in:</p>
        <p><strong>${eventItem.name}</strong></p>
        <p><strong>Name:</strong> ${booking.address.firstName} ${booking.address.lastName}</p>
        <p>Certificate attached below 🎓</p>
      `,
      attachments: [
        {
          filename: `Certificate_${booking.orderId}.pdf`,
          content: pdfCertificate,
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", result.messageId);
  } catch (error) {
    console.error("❌ Error in sendCertificateEmail:", error);
  }
};

const generateCertificatePDF = async (booking, eventItem) => {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const buffer = [];

    doc.on("data", (chunk) => buffer.push(chunk));

    doc.on("end", () => {
      console.log("📄 PDF generation completed");
      resolve(Buffer.concat(buffer));
    });

    doc.on("error", (err) => {
      console.log("❌ PDF Error:", err);
      reject(err);
    });

    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("Certificate of Participation", {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(20)
      .text(`${booking.address.firstName} ${booking.address.lastName}`, {
        align: "center",
      });

    doc.moveDown();

    doc.text("has successfully participated in", {
      align: "center",
    });

    doc.moveDown();

    doc.font("Helvetica-Bold").text(eventItem.name, {
      align: "center",
    });

    doc.end();
  });
};


export const markAttendance = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("📡 Scanned Order ID:", orderId);

    // 🔍 Find booking
    const booking = await Booking.findOne({ orderId });

    if (!booking) {
      return res.json({
        success: false,
        message: "Invalid ticket ❌",
      });
    }

    // ❗ Already marked
    if (booking.attendance) {
      return res.json({
        success: false,
        message: "Attendance already marked ⚠️",
      });
    }

    // ✅ Mark attendance
    booking.attendance = true;
    await booking.save();

    console.log("✅ Attendance marked for:", orderId);

    res.json({
      success: true,
      message: "Attendance marked successfully ✅",
      user: `${booking.address.firstName} ${booking.address.lastName}`,
      event: booking.address.event,
    });

  } catch (err) {
    console.log("❌ Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};