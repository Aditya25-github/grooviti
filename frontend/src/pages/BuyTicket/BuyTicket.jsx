import React, { useContext, useState, useEffect } from "react";
import "./BuyTicket.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiAlertTriangle } from "react-icons/fi";

const BuyTicket = () => {
  const {
    getTotalCartAmount,
    token,
    myevents_list,
    url,
    cartItems,
    addToCart,
    removeFromCart,
  } = useContext(StoreContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamSize, setTeamSize] = useState(1);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    college_name: "",
    Branch: "",
    Team_name: "",
    Team_leader_name: "",
    Team_size: "",
    Team_member_name_1: "",
    Team_member_name_2: "",
    Team_member_name_3: "",
    Team_member_name_4: "",
    phone: "",
    event: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (myevents_list.length > 0) {
      const foundEvent = myevents_list.find((e) => e._id === id);
      if (foundEvent) {
        setEventData(foundEvent);
        setData((prevData) => ({
          ...prevData,
          event: foundEvent.name,
          Team_size: prevData.Team_size || 1,
        }));
        if (!cartItems[foundEvent._id] || cartItems[foundEvent._id] === 0) {
          addToCart(foundEvent._id);
        }
      }
    }
  }, [id, myevents_list, cartItems, addToCart]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const buyTicket = async (event) => {
    event.preventDefault();

    if (!eventData) {
      alert(
        "Event details not found, Please add atleast one event in your Cart."
      );
      return;
    }
    setLoading(true);

    let eventItems = [];
    myevents_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = {
          ...item,
          quantity: cartItems[item._id],
          eventId: item._id,
        };
        eventItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: eventItems,
      amount: getTotalCartAmount() + 0,
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

              navigate(
                `/verify?success=true&orderId=${response.data.order_id}`
              );
              alert(
                "Payment Successful!! Please check your email for ticket pdf!\n !!If not found please check spam !! "
              );
            } catch (err) {
              console.error("Error verifying payment:", err);
              alert("Payment verification failed. Please contact support.");
            }
            setLoading(false);
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: "#6d28d9" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on("payment.failed", function () {
          setLoading(false);
        });
      } else {
        console.error("Booking failed", response.data);
        alert("Please Login First to Book your ticket.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert("An error occurred while booking the ticket.");
    }
  };

  const WarningMessage = ({ isLoggedIn }) => {
    if (isLoggedIn) return null;
    return (
      <div className="warning-message">
        <FiAlertTriangle className="warning-icon" />
        <span>Please sign up before proceeding to payment.</span>
      </div>
    );
  };

  return (
    <motion.div
      className="booking-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="booking-wrapper">
        <WarningMessage isLoggedIn={token} />
        <form onSubmit={buyTicket} className="booking-form">
          <div className="booking-form-left">
            <h2 className="form-title">Ticket Booking Information</h2>
            <p className="form-subtitle">Please fill in your details</p>

            <div className="form-group">
              <div className="form-row">
                <div className="form-field">
                  <label>First Name *</label>
                  <input
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                    type="text"
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
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>College Name *</label>
                <input
                  name="college_name"
                  onChange={onChangeHandler}
                  value={data.college_name}
                  type="text"
                  required
                />
              </div>

              <div className="form-field">
                <label>Email Address *</label>
                <input
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
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
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Team Name *</label>
                  <input
                    name="Team_name"
                    onChange={onChangeHandler}
                    value={data.Team_name}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Team Size *</label>
                <select
                  name="Team_size"
                  value={data.Team_size}
                  onChange={(event) => {
                    const size = parseInt(event.target.value, 10);
                    setTeamSize(size);
                    setData((prevData) => ({
                      ...prevData,
                      Team_size: size,
                    }));
                  }}
                  className="team-size-select"
                >
                  {[...Array(10).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="team-member-fields">
                {[...Array(teamSize)].map((_, index) => (
                  <div className="form-field" key={index}>
                    <label>Team Member {index + 1} *</label>
                    <input
                      name={`Team_member_name_${index + 1}`}
                      onChange={onChangeHandler}
                      value={data[`Team_member_name_${index + 1}`] || ""}
                      type="text"
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
                  placeholder="10 digits only"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/, ""))
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label>Event Name *</label>
                <input
                  name="event"
                  onChange={onChangeHandler}
                  value={data.event}
                  type="text"
                  readOnly
                  className="read-only"
                />
              </div>
            </div>
          </div>

          <div className="booking-summary">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>

              {eventData && (
                <>
                  <div className="event-card">
                    <img
                      className="event-image"
                      src={
                        eventData.coverImage?.url?.startsWith(
                          "https://res.cloudinary.com"
                        )
                          ? eventData.coverImage.url
                          : "/default-image.png"
                      }
                      alt={eventData.name || "Event Image"}
                    />
                    <div className="event-details">
                      <h3>{eventData.name}</h3>
                      <div className="ticket-counter">
                        <button
                          type="button"
                          onClick={() => removeFromCart(eventData._id)}
                          className="counter-btn"
                        >
                          <FiMinus />
                        </button>
                        <span>{cartItems[eventData._id] || 0}</span>
                        <button
                          type="button"
                          onClick={() => addToCart(eventData._id)}
                          className="counter-btn"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="price-details">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>Rs.{getTotalCartAmount()}</span>
                </div>
                <div className="price-row">
                  <span>Processing fee</span>
                  <span>Rs.0</span>
                </div>
                <div className="divider"></div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>Rs.{getTotalCartAmount()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`payment-btn ${loading ? "loading" : ""}`}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  "PROCEED TO PAYMENT"
                )}
              </button>

              <div className="payment-message">
                <p>
                  After successful payment, your ticket will be displayed on
                  this website and emailed to you.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default BuyTicket;
