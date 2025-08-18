import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // const url = "https://grooviti-backend.onrender.com";
  const url = "http://localhost:4000"; // Change this to your backend URL
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [myevents_list, setmyevents_list] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = myevents_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchmyevents_list = async () => {
    try {
      const response = await axios.get(url + "/api/event/list");
      setmyevents_list(response.data.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchmyevents_list();

      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired. Logging out.");
          localStorage.removeItem("token");
          setUser(null);
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        const res = await axios.get(`${url}/api/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.data.success) {
          setUser(res.data.user);
          setIsLoggedIn(true);
          setToken(storedToken); // now safe to update
          localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ <--- add this
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user"); // ❌ remove stale user if token fails
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Invalid token or failed to fetch user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // ❌ remove stale user if token fails
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [token]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setToken(e.newValue || "");
        if (!e.newValue) {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
    user,
    setUser,
    isLoggedIn,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
