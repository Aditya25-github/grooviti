import React, { useContext, useState, useEffect } from "react";
import "./BuyTicket.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BuyTicket = () => {
  const { getTotalCartAmount, token, myevents_list, url, cartItems } =
    useContext(StoreContext);
  const { eventName } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    college_name: "",
    Branch: "",
    Team_name: "",
    Team_leader_name: "",
    Team_size: "",
    phone: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Find event details by name
    if (myevents_list.length > 0) {
      const foundEvent = myevents_list.find(
        (e) =>
          e.name.toLowerCase() === decodeURIComponent(eventName).toLowerCase()
      );
      setEventData(foundEvent || null);
    }
  }, [eventName, myevents_list]);

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

    let eventItems = [];
    myevents_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
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
        headers: { token },
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

              alert(
                "Payment Successful! Payment ID: " +
                  paymentResponse.razorpay_payment_id
              );
              navigate(
                `/verify?success=true&orderId=${response.data.order_id}`
              );
            } catch (err) {
              console.error("Error verifying payment:", err);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: "#3399cc" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Booking failed", response.data);
        alert("Please Login First to Book your ticket.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert("An error occurred while booking the ticket.");
    }
  };

  return (
    <form onSubmit={buyTicket} className="place-order">
      <div className="place-order-left">
        <p className="title">Ticket Booking Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          name="college_name"
          onChange={onChangeHandler}
          value={data.college_name}
          type="text"
          placeholder="College name"
          required
        />
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
          required
        />
        <div className="multi-fields">
          <input
            name="Branch"
            onChange={onChangeHandler}
            value={data.Branch}
            type="text"
            placeholder="Branch"
            required
          />
          <input
            name="Team_name"
            onChange={onChangeHandler}
            value={data.Team_name}
            type="text"
            placeholder="Team Name"
          />
        </div>
        <div className="multi-fields">
          <input
            name="Team_leader_name"
            onChange={onChangeHandler}
            value={data.Team_leader_name}
            type="text"
            placeholder="Team Leader Name"
          />
          <input
            name="Team_size"
            onChange={onChangeHandler}
            value={data.Team_size}
            type="text"
            placeholder="Team Size"
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone (+91 989-767-0000)"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Oder Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Processing fee</p>
              <p>Rs.0</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <p>Rs.{getTotalCartAmount() + 0}</p>
            </div>
            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BuyTicket;
