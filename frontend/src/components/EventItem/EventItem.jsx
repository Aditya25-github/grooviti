import React, { useContext } from "react";
import "./EventItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const EventItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className="event-item">
      <div className="event-item-img-container">
        <img
          className="event-item-image"
          src={url + "/images/" + image}
          alt=""
        />

        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
          ></img>
        ) : (
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
        )}
      </div>
      <div className="event-item-info">
        <div className="event-item-name-rating">
          <p>{name}</p>
          <a className="event-item-view" href="">
            View details
          </a>
        </div>
        <p className="event-item-description">{description}</p>
        <p className="event-item-price">
          Rs.{price}{" "}
          <button
            onClick={() =>
              navigate(`/event/${encodeURIComponent(name)}/buyticket`)
            }
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default EventItem;
