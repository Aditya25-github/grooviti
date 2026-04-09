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
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="color: #2E2E8B; text-align: center; margin-bottom: 10px;">
        🎓 Certificate of Participation
      </h2>

      <p style="font-size: 16px;">
        Dear <strong>${booking.address.firstName} ${booking.address.lastName}</strong>,
      </p>

      <p style="font-size: 15px; line-height: 1.6;">
        Congratulations! 🎉  
        We are pleased to inform you that your <strong>Certificate of Participation</strong> for the event 
        <strong>${eventItem.name}</strong> has been successfully generated.
      </p>

      <p style="font-size: 15px; line-height: 1.6;">
        Your dedication and enthusiasm made this event a success, and we truly appreciate your participation.
      </p>

      <div style="margin: 20px 0; padding: 15px; background: #f1f5ff; border-left: 4px solid #2E2E8B; border-radius: 5px;">
        <p style="margin: 0; font-size: 14px;">
          📎 Your certificate is attached with this email.  
          You can download and keep it for your records.
        </p>
      </div>

      <p style="font-size:14px;">
  🏆 Event: <strong>${eventItem.name}</strong><br/>
  🎓 Participant: <strong>${booking.address.firstName}</strong><br/>
  🏫 College: <strong>${booking.address.college_name}</strong>
</p>

      <p style="font-size: 14px; color: #555;">
        We hope to see you in more events in the future 🚀
      </p>
      
      <p style="margin-top: 25px;">
        Regards,<br/>
        <strong>Grooviti Team</strong><br/>
        <span style="color: #888;">Groove it. Book it. Live it.</span>
      </p>

    </div>

  </div>
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



const generateCertificatePDF = async (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0,
      });

      const buffer = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));

      // 🖼️ BACKGROUND TEMPLATE (VERY IMPORTANT)
      doc.image("./uploads/certificate-1.png", 0, 0, {
        width: 842,
        height: 595,
      });

      const name = `${booking.address.firstName} ${booking.address.lastName}`;
      const college = booking.address.college_name || "Your College";

      // 🎯 NAME (CENTER BIG TEXT)
      doc
        .font("Helvetica-Bold")
        .fontSize(26)
        .fillColor("#000000")
        .text(name, 60, 273, {
          align: "center",
        });

      // 🎯 COLLEGE NAME (RIGHT SIDE "from ______")
      doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#000000")
        .text(college, 150, 304, {
          width: 200,
          align: "center",
        });

      doc.end();
    } catch (err) {
      console.log("❌ Certificate PDF Error:", err);
      reject(err);
    }
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
