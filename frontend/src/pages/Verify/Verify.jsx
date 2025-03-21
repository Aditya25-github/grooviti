import React, { useEffect, useState } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !success) {
        setError("Invalid order details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${url}/api/booking/verify`, {
          success,
          orderId,
        });

        if (response.data.success) {
          console.log("Email sent successfully!");
          setTimeout(() => {
            navigate(`/ticket-confirmation?orderId=${orderId}`);
          }, 2000); // Adding delay to ensure email is sent
        } else {
          setError("Payment verification failed.");
        }
      } catch (err) {
        setError("Error verifying payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId, success, url, navigate]);

  return (
    <div className="verify">
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : null}
    </div>
  );
};

export default Verify;
