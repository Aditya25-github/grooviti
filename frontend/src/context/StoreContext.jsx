import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://grooviti-backend.onrender.com";
  const [token, setToken] = useState("");
  const [myevents_list, setmyevents_list] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = myevents_list.find((product) => product._id === item);
        totalAmmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmmount;
  };

  const fetchmyevents_list = async () => {
    const response = await axios.get(url + "/api/event/list");
    setmyevents_list(response.data.data);
  };

  useEffect(() => {
    async function loadData() {
      await fetchmyevents_list();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    myevents_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
