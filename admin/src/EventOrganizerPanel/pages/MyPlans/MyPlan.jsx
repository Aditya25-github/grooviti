import React, { useContext, useEffect, useState } from "react";
import "./MyPlan.css";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";

const MyPlan = () => {
  const { token } = useContext(StoreContext);
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get("/api/organizer/my-plan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setPlanDetails(res.data.plan);
        } else {
          toast.error("Failed to fetch plan");
        }
      } catch (error) {
        toast.error("Error loading plan details");
      }
    };

    if (token) fetchPlan();
  }, [token]);

  if (!planDetails) return <div className="myplan-page">Loading...</div>;

  return (
    <div className="myplan-page">
      <h2>My Current Plan</h2>

      <div className="plan-card current-plan">
        <h3>{planDetails.planName} Plan</h3>
        <p>Billing: {planDetails.billingCycle}</p>
        <ul>
          {planDetails.features.map((feat, index) => (
            <li key={index}>✅ {feat}</li>
          ))}
        </ul>
        <p className="price">Total Price: ₹{planDetails.price}</p>
      </div>

      {planDetails.planName.toLowerCase() === "basic" && (
        <>
          <hr />
          <h3 className="upgrade-title">Upgrade to Premium</h3>
          <div className="plan-card premium-highlight">
            <h4>Premium Plan Benefits</h4>
            <ul>
              <li>🚀 Priority event listing</li>
              <li>📢 Featured on homepage</li>
              <li>📊 Advanced analytics & reports</li>
              <li>📞 Dedicated support</li>
              <li>🔓 Access to exclusive tools</li>
            </ul>
            <button
              className="upgrade-btn"
              onClick={() => {
                window.location.href = "/upgrade-plan"; // or use navigate()
              }}
            >
              Upgrade Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPlan;
