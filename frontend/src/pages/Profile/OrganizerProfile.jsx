import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Instagram, Facebook, Twitter, Linkedin, Globe } from "lucide-react";
import { motion } from "framer-motion";
import "./OrganizerProfile.css";

const OrganizerProfile = () => {
  const { organizerId } = useParams();
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const res = await axios.get(`/api/organizers/${organizerId}`);
        setOrganizer(res.data);
      } catch (err) {
        console.error("Failed to load organizer profile", err);
      }
    };

    fetchOrganizer();
  }, [organizerId]);

  if (!organizer)
    return <div className="loading-text">Loading organizer profile...</div>;

  const { name, bio, profileImage, socialLinks, organization, address, plan } =
    organizer;

  return (
    <motion.div
      className="organizer-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="organizer-card">
        <div className="organizer-grid">
          <div className="organizer-sidebar">
            <img
              src={profileImage?.url || "/placeholder.png"}
              alt={name}
              className="organizer-avatar"
            />
            <h2 className="organizer-name">{name}</h2>
            <p>{organization}</p>
            <p>
              Plan: {plan.name} ({plan.billingCycle})
            </p>
            <div className="social-links">
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram />
                </a>
              )}
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook />
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin />
                </a>
              )}
              {socialLinks?.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe />
                </a>
              )}
            </div>
          </div>

          <div className="organizer-details">
            <h3>About</h3>
            <p>{bio || "No bio provided."}</p>

            <h4>Location</h4>
            <p>
              {address?.city}, {address?.state}, {address?.country || "India"}
            </p>

            <h4>Contact</h4>
            <p>Email: {organizer.email}</p>
            <p>Phone: {organizer.phone}</p>

            <button className="view-events-btn">View Organized Events</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizerProfile;
