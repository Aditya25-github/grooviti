import React, { useContext } from "react";
import "./EventItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EventItem = ({
  id,
  name,
  price,
  description,
  coverImage,
  availableTickets,
  location,
  isPaid,
  organizerContact,
  organizerPhone,
}) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const isSoldOut = availableTickets <= 0;

  return (
    <div
      className="event-item"
      onClick={() => navigate(`/event/${id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="event-item-img-container">
        <img
          className="event-item-image"
          src={coverImage?.url || "fallback-image.jpg"}
          alt={name || "Event image"}
        />


      </div>

      <div className="event-item-info">
        <div className="event-item-name-rating">
          <p>{name}</p>
        </div>
        <div className="event-item-description">
          <p>{description}</p>
        </div>
        <div className="event-item-price">
          <p>{isPaid === false || price === 0 ? "Free" : `Rs.${price}`}</p>
        </div>
        <div className="event-item-location-button">
          <p className="event-item-location">
            {location?.city || "Location not specified"}
          </p>
          {isPaid === false || price === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!organizerContact && !organizerPhone) {
                  toast.error("Contact number not provided");
                } else {
                  window.location.href = `tel:${organizerContact || organizerPhone}`;
                }
              }}
              disabled={isSoldOut}
              className={`event-item-register-button ${
                isSoldOut ? "sold-out-button" : ""
              }`}
              style={{ whiteSpace: "nowrap", minWidth: "125px" }}
            >
              Call Organizer
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isSoldOut) {
                  navigate(`/event/${id}/buyticket`);
                }
              }}
              disabled={isSoldOut}
              className={`event-item-register-button ${
                isSoldOut ? "sold-out-button" : ""
              }`}
            >
              {isSoldOut ? "Sold Out!" : "Buy Ticket"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventItem;
