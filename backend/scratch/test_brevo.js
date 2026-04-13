import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const testMail = async () => {
    console.log("🔍 Testing Brevo SMTP Connection...");
    console.log("Using User:", process.env.BREVO_USER);
    
    try {
        await transporter.verify();
        console.log("✅ SMTP Credentials are Valid!");

        const info = await transporter.sendMail({
            from: `"Grooviti Test" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER, // Sending to yourself
            subject: "Brevo API Test",
            text: "If you are reading this, your Brevo SMTP integration is working!",
            html: "<b>✅ Brevo SMTP integration is working!</b>",
            headers: {
                "X-Mailin-custom": JSON.stringify({ orderId: "TEST_123" })
            }
        });

        console.log("📧 Test email sent!");
        console.log("Message ID:", info.messageId);
        console.log("Check your inbox at:", process.env.MAIL_USER);
    } catch (error) {
        console.error("❌ Test Failed:", error.message);
    }
};

testMail();
