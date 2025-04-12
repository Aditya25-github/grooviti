import React, { useState, useEffect } from "react";
import "./PlanUpgrade.css";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    monthlyPrice: 49,
    quarterlyPrice: 119,
    annualPrice: 299,
    per: "per month",
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
    per: "per month",
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
    buttonText: "Get Started ",
    highlight: true,
  },
  {
    name: "Custom",
    monthlyPrice: 999,
    quarterlyPrice: 2399,
    annualPrice: 5999,
    per: "per month",
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleButtonClick = () => {
    alert("This feature is coming soon!");
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
          <h2 className="pricing-title">
            Flexible plans for <i>every event</i>
          </h2>
          <p className="pricing-description">
            Affordable and transparent pricing for individual organizers, event
            planners, and businesses.
          </p>
          <div className="toggle-switch">
            <button
              className={billingCycle === "monthly" ? "active" : ""}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={billingCycle === "quarterly" ? "active" : ""}
              onClick={() => setBillingCycle("quarterly")}
            >
              Quarterly
            </button>
            <button
              className={billingCycle === "annual" ? "active" : ""}
              onClick={() => setBillingCycle("annual")}
            >
              Annually
            </button>
          </div>

          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card ${
                  plan.highlight ? "highlighted-card" : ""
                }`}
              >
                {billingCycle === "annual" && (
                  <div className="discount-label">50% Discount</div>
                )}
                {billingCycle === "quarterly" && (
                  <div className="discount-label">20% Discount</div>
                )}

                <div className="plan-name">{plan.name}</div>
                <p className="plan-description">{plan.description}</p>

                <div className="plan-price">
                  {billingCycle === "annual" ? (
                    <>
                      <span className="original-price">
                        ₹{plan.monthlyPrice * 12 + 11}
                      </span>{" "}
                      {/* Original price */}
                      <span className="discounted-price">
                        ₹{plan.annualPrice}
                      </span>{" "}
                      {/* Discounted price */}
                    </>
                  ) : billingCycle === "quarterly" ? (
                    <>
                      <span className="original-price">
                        ₹{plan.monthlyPrice * 3 + 2}
                      </span>{" "}
                      {/* Original price */}
                      <span className="discounted-price">
                        ₹{plan.quarterlyPrice}
                      </span>{" "}
                      {/* Discounted price */}
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

                <button
                  className={`plan-button ${
                    plan.highlight ? "highlighted-button" : "default-button"
                  }`}
                  onClick={handleButtonClick}
                >
                  {plan.buttonText}
                </button>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="feature-item">
                      <Check className="feature-icon" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
