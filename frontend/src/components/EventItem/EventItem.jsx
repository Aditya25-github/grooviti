import React, { useContext } from "react";
import "./EventItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const EventItem = ({
  id,
  name,
  price,
  description,
  coverImage,
  availableTickets,
  location,
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
          src={url + "/images/" + coverImage}
          alt=""
        />

        {!isSoldOut && !cartItems[id] ? (
          <img
            className="add"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id);
            }}
            src={assets.add_icon_white}
            alt=""
          />
        ) : !isSoldOut ? (
          <div className="event-item-counter">
            <img
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(id);
              }}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={(e) => {
                e.stopPropagation();
                addToCart(id);
              }}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        ) : null}
      </div>

      <div className="event-item-info">
        <div className="event-item-name-rating">
          <p>{name}</p>
        </div>
        <div className="event-item-description">
          <p>{description}</p>
        </div>
        <div className="event-item-price">
          <p>Rs.{price}</p>
        </div>
        <div className="event-item-location-button">
          <p className="event-item-location">
            {location?.city || "Location not specified"}
          </p>
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
        </div>
      </div>
    </div>
  );
};

export default EventItem;
