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
    if (!orderId || !success) {
      setError("Invalid order details.");
      setLoading(false);
      return;
    }
  
    setTimeout(() => {
      navigate(`/ticket-confirmation?orderId=${orderId}`);
    }, 2000); // Delay navigation for smooth UX
  
    setLoading(false);
  }, [orderId, success, navigate]);

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
