import React, { useState, useEffect } from "react";
import "./PlanUpgrade.css";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    monthlyPrice: 49,
    quarterlyPrice: 119,
    annualPrice: 299,
    description: "Ideal for individuals or small event organizers",
    features: [
      "Access to admin panel where event organisers can easily manage their events listed on platform",
      "Upto 100 Registrations per Event",
      "Basic ticket listing options.",
      "Default Templates for Tickets and Events",
      "Email support.",
    ],
    buttonText: "Get started",
    highlight: false,
  },
  {
    name: "Premium",
    monthlyPrice: 499,
    quarterlyPrice: 1199,
    annualPrice: 2999,
    description: "Perfect for growing event organizers",
    features: [
      "Access to admin panel",
      "Upto 350 Registrations per Event",
      "Email support.",
      "Access to personalized emails",
      "Certificate generation",
      "Default Templates",
      "Event Attendance Management",
    ],
    buttonText: "Get Started",
    highlight: true,
  },
  {
    name: "Custom",
    monthlyPrice: 999,
    quarterlyPrice: 2399,
    annualPrice: 5999,
    description: "Designed for large-scale event management",
    features: [
      "Access to admin panel",
      "Upto 3000 Registrations",
      "Access to personalized emails",
      "Certificate generation",
      "24/7 customer support (Phone and Email)",
      "Customizable event pages, certificates and tickets.",
      "Advanced reporting and analytics.",
      "Event Attendance Management.",
      "Event Page Templates",
    ],
    buttonText: "Contact team",
    highlight: false,
  },
];

export default function PricingPlans() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleButtonClick = (plan, billing) => {
    navigate("/organizer-info", {
      state: { planName: plan.name, billingCycle: billing },
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  const listContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const listItem = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div style={{ paddingTop: "95px" }}>
        <div className="pricing-container">
          <motion.h2
            className="pricing-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Flexible plans for <i>every event</i>
          </motion.h2>

          <motion.p
            className="pricing-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Affordable and transparent pricing for individual organizers, event
            planners, and businesses.
          </motion.p>

          {/* Billing Cycle Toggle */}
          <motion.div
            className="toggle-switch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {["monthly", "quarterly", "annual"].map((cycle) => (
              <motion.button
                key={cycle}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={billingCycle === cycle ? "active" : ""}
                onClick={() => setBillingCycle(cycle)}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Plan Cards */}
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`pricing-card ${
                  plan.highlight ? "highlighted-card" : ""
                }`}
              >
                {/* Discount Label */}
                {billingCycle === "annual" && (
                  <div className="discount-label">50% Discount</div>
                )}
                {billingCycle === "quarterly" && (
                  <div className="discount-label">20% Discount</div>
                )}

                <div className="plan-name">{plan.name}</div>
                <p className="plan-description">{plan.description}</p>

                {/* Price */}
                <div className="plan-price">
                  {billingCycle === "annual" ? (
                    <>
                      <span className="original-price">
                        ₹{plan.monthlyPrice * 12 + 11}
                      </span>
                      <span className="discounted-price">
                        ₹{plan.annualPrice}
                      </span>
                    </>
                  ) : billingCycle === "quarterly" ? (
                    <>
                      <span className="original-price">
                        ₹{plan.monthlyPrice * 3 + 2}
                      </span>
                      <span className="discounted-price">
                        ₹{plan.quarterlyPrice}
                      </span>
                    </>
                  ) : (
                    `₹${plan.monthlyPrice}`
                  )}
                  <span className="price-per">
                    {billingCycle === "monthly"
                      ? " per month"
                      : billingCycle === "quarterly"
                      ? " for 3 Months"
                      : " per year"}
                  </span>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`plan-button ${
                    plan.highlight ? "highlighted-button" : "default-button"
                  }`}
                  onClick={() => handleButtonClick(plan, billingCycle)}
                >
                  {plan.buttonText}
                </motion.button>

                {/* Features */}
                <motion.ul
                  className="plan-features"
                  variants={listContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="feature-item"
                      variants={listItem}
                    >
                      <Check className="feature-icon" /> {feature}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
