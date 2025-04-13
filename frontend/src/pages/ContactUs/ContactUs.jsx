import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "./ContactUs.css";

const team = [
  {
    name: "Saksham Gawande",
    role: "Customer Success Lead",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/saksham1.jpg",
  },
  {
    name: "Akash Patil",
    role: "VP of Customer Success",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/akash1.jpg",
  },
  {
    name: "Esha",
    role: "Payments Support",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/esha.jpg",
  },
  {
    name: "Diksha",
    role: "Specialized Support",
    image:
      "https://raw.githubusercontent.com/SANNINelite/grooviti-assets/refs/heads/main/diksha.jpg",
  },
];

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ paddingTop: "25px" }}
    >
      <div className="contact-page">
        {/* Hero */}
        <div className="hero-section">
          <p className="small-text">Contact us</p>
          <h1 className="need-help">Need help? We’re here for you 24/7.</h1>
          <p className="description">
            Our dedicated team of growth experts is ready to help around the
            clock. Access 24/7 support through our award-winning network.
          </p>
          <div className="cta-buttons">
            <button className="btn-outline">📞 Book a call</button>
            <button className="btn-solid">Create account</button>
          </div>
        </div>

        {/* Team */}
        <div className="teeam-section">
          <h2 className="section-title">Our Support Team</h2>
          <div className="teeam-grid">
            {team.map((member, i) => (
              <div key={i} className="teeam-card">
                <img
                  src={member.image}
                  alt={member.name}
                  className="teeam-avatar"
                />
                <div className="teeam-info">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-section">
          <form className="contact-form">
            <h3>Contact Our Sales Team</h3>
            <div className="row">
              <input type="text" placeholder="First name *" required />
              <input type="text" placeholder="Last name *" required />
            </div>
            <input type="email" placeholder="Email *" required />
            <input type="tel" placeholder="Phone number" />
            <textarea placeholder="Message" rows="4"></textarea>
            <button type="submit" className="btn-solid">
              Submit
            </button>
          </form>

          <div className="support-info">
            <h3>Other Ways to Reach Us</h3>
            <p>
              <strong>Chat to sales:</strong>{" "}
              <a href="tel:+919404571327">+91 940-457-1327</a>
            </p>
            <p>
              <strong>Email support:</strong>{" "}
              <a href="mailto:groov.iti25@gmail.com">groov.iti25@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
