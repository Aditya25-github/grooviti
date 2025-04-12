import React, { useContext } from "react";
import { motion } from "framer-motion";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = ({ name }) => {
  const { cartItems, myevents_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ paddingTop: "95px" }}
    >
      <div className="cart">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br />
          <hr />
          {myevents_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={url + "/images/" + item.image} alt="" />
                    <p>{item.name}</p>
                    <p>Rs.{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>Rs.{item.price * cartItems[item._id]}</p>
                    <p
                      onClick={() => removeFromCart(item._id)}
                      className="cross"
                    >
                      x
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
          })}
        </div>

        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>Rs.{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Processing fee</p>
                <p>Rs.{getTotalCartAmount() === 0 ? 0 : 0}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <p>
                  Rs.
                  {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 0}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate(`/event/${encodeURIComponent(name)}/buyticket`)
                }
              >
                Proceed To Checkout
              </button>
            </div>
          </div>

          <div className="cart-promocode">
            <div>
              <p>If you have a promocode, Enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="Promo code" />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
