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
  image,
  availableTickets,
}) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const isSoldOut = availableTickets <= 0;

  return (
    <div className="event-item">
      <div className="event-item-img-container">
        <img
          className="event-item-image"
          src={url + "/images/" + image}
          alt=""
        />

        {!isSoldOut && !cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : !isSoldOut ? (
          <div className="event-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        ) : null}
      </div>

      <div className="event-item-info">
        <div className="event-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="event-item-description">{description}</p>
        <p className="event-item-price">Rs.{price}</p>

        <div className="event-item-register">
          <button
            onClick={() => {
              if (!isSoldOut) {
                navigate(`/event/${encodeURIComponent(name)}/buyticket`);
              }
            }}
            disabled={isSoldOut}
            className={isSoldOut ? "sold-out-button" : ""}
          >
            {isSoldOut ? "Sold Out!" : "Buy Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
