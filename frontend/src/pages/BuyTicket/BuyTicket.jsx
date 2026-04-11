import React, { useContext, useState, useEffect } from "react";
import "./BuyTicket.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

const BuyTicket = () => {
  const {
    getTotalCartAmount,
    token,
    myevents_list,
    url,
    cartItems,
    addToCart,
    user,
  } = useContext(StoreContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamSize, setTeamSize] = useState(1);

  const initialTeamMembers = {};
  for (let i = 1; i <= 10; i++) {
    initialTeamMembers[`Team_member_name_${i}`] = "";
  }

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    college_name: "",
    Branch: "",
    Team_name: "",
    Team_leader_name: "",
    Team_size: 1,
    phone: "",
    event: "",
    ...initialTeamMembers,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (myevents_list.length > 0) {
      const foundEvent = myevents_list.find((e) => e._id === id);
      if (foundEvent) {
        setEventData(foundEvent);
        const limitMin = foundEvent.teamSizeMinLimit || 1;
        setData((prevData) => ({
          ...prevData,
          event: foundEvent.name,
          Team_size: prevData.Team_size === 1 ? limitMin : prevData.Team_size,
        }));
        setTeamSize((prev) => (prev === 1 ? limitMin : prev));
        if (!cartItems[foundEvent._id] || cartItems[foundEvent._id] === 0) {
          addToCart(foundEvent._id);
        }
      }
    }
  }, [id, myevents_list, cartItems, addToCart]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const buyTicket = async (e) => {
    e.preventDefault();
    if (!eventData) {
      alert("Event details not found. Please add at least one event to your cart.");
      return;
    }
    setLoading(true);

    let eventItems = [];
    myevents_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        eventItems.push({ ...item, quantity: cartItems[item._id], eventId: item._id });
      }
    });

    if (!user || !user._id) {
      alert("Please login first before booking.");
      setLoading(false);
      return;
    }

    let orderData = {
      userId: user._id,
      address: data,
      items: eventItems,
      amount: getTotalCartAmount(data.Team_size) + 0,
    };

    try {
      let response = await axios.post(`${url}/api/booking/ticket`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.order_id) {
        orderData.orderId = response.data.order_id;
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Failed to load Razorpay. Check your internet connection.");
          setLoading(false);
          return;
        }

        const options = {
          key: "rzp_live_46Ch3IQvMWEQnp",
          amount: orderData.amount * 100,
          currency: "INR",
          name: "Event Booking",
          description: `Ticket for ${eventData.name}`,
          order_id: response.data.order_id,
          handler: async function (paymentResponse) {
            try {
              await axios.post(`${url}/api/booking/verify`, {
                orderId: paymentResponse.razorpay_order_id,
                paymentId: paymentResponse.razorpay_payment_id,
                success: true,
              });
              navigate(`/verify?success=true&orderId=${response.data.order_id}`);
              alert("Payment Successful! Check your email for the ticket PDF.\nIf not found, check your spam folder.");
            } catch (err) {
              console.error("Payment verification error:", err);
              alert("Payment verification failed. Please contact support.");
            }
            setLoading(false);
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: "#ff6000" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on("payment.failed", () => setLoading(false));
      } else {
        alert("Please login first to book your ticket.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred while booking the ticket.");
    } finally {
      setLoading(false);
    }
  };

  const teamSizeOptions = (() => {
    const min = eventData?.teamSizeMinLimit || 1;
    const max = eventData?.teamSizeLimit || 10;
    return Array.from({ length: Math.max(1, max - min + 1) }, (_, i) => i + min);
  })();

  return (
    <motion.div
      className="booking-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="booking-wrapper">

        {/* Alerts */}
        <div className="alert-row">
          {!token && (
            <div className="warning-message">
              <FiAlertTriangle className="warning-icon" />
              <span>Please sign up before proceeding to payment.</span>
            </div>
          )}
          <div className="certificate-alert">
            <FiInfo className="certificate-alert-icon" />
            <div className="certificate-alert-content">
              <h3>Certificate notice:</h3>
              <p>
                Details entered below will appear on your{" "}
                <strong>official certificate</strong>. Ensure accuracy before paying.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={buyTicket} className="booking-form">

          {/* LEFT — Form fields */}
          <div className="booking-form-left">
            <h2 className="form-title">Booking Information</h2>
            <p className="form-subtitle">All fields marked * are required</p>

            <div className="form-group">
              <div className="form-row">
                <div className="form-field">
                  <label>First Name *</label>
                  <input
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                    type="text"
                    placeholder="e.g. Rahul"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Last Name *</label>
                  <input
                    name="lastName"
                    onChange={onChangeHandler}
                    value={data.lastName}
                    type="text"
                    placeholder="e.g. Sharma"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Email Address *</label>
                <input
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder="Ticket will be sent here"
                  required
                />
              </div>

              <div className="form-field">
                <label>College Name *</label>
                <input
                  name="college_name"
                  onChange={onChangeHandler}
                  value={data.college_name}
                  type="text"
                  placeholder="Your institution"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Branch *</label>
                  <input
                    name="Branch"
                    onChange={onChangeHandler}
                    value={data.Branch}
                    type="text"
                    placeholder="e.g. Computer Engineering"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Phone Number *</label>
                  <input
                    name="phone"
                    onChange={onChangeHandler}
                    value={data.phone}
                    type="tel"
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Team Name *</label>
                  <input
                    name="Team_name"
                    onChange={onChangeHandler}
                    value={data.Team_name}
                    type="text"
                    placeholder="Your team's name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Team Size *</label>
                  <select
                    name="Team_size"
                    value={data.Team_size}
                    onChange={(e) => {
                      const size = parseInt(e.target.value, 10);
                      setTeamSize(size);
                      setData((prev) => ({ ...prev, Team_size: size }));
                    }}
                    className="team-size-select"
                  >
                    {teamSizeOptions.map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? "member" : "members"}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Team Members */}
              <div className="team-member-fields">
                <div className="team-member-header">Team Members</div>
                {[...Array(teamSize)].map((_, index) => (
                  <div className="form-field" key={index}>
                    <label>Member {index + 1} *</label>
                    <input
                      name={`Team_member_name_${index + 1}`}
                      onChange={onChangeHandler}
                      value={data[`Team_member_name_${index + 1}`] || ""}
                      type="text"
                      placeholder={`Full name of member ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="form-field">
                <label>Team Leader Name *</label>
                <input
                  name="Team_leader_name"
                  onChange={onChangeHandler}
                  value={data.Team_leader_name}
                  type="text"
                  placeholder="Leader's full name"
                  required
                />
              </div>

              <div className="form-field">
                <label>Event</label>
                <input
                  name="event"
                  value={data.event}
                  type="text"
                  readOnly
                  className="read-only"
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="booking-summary">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>

              {eventData && (
                <div className="event-card">
                  <img
                    className="event-image"
                    src={
                      eventData.coverImage?.url?.startsWith("https://res.cloudinary.com")
                        ? eventData.coverImage.url
                        : "/default-image.png"
                    }
                    alt={eventData.name || "Event"}
                  />
                  <div className="event-details">
                    <h3>{eventData.name}</h3>
                  </div>
                </div>
              )}

              <div className="price-details">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{getTotalCartAmount(data.Team_size)}</span>
                </div>
                <div className="price-row">
                  <span>Processing fee</span>
                  <span>₹0</span>
                </div>
                <div className="divider" />
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{getTotalCartAmount(data.Team_size)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`payment-btn ${loading ? "loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>

              <div className="payment-message">
                After payment, your ticket will be emailed and available on the website.
              </div>
            </div>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default BuyTicket;