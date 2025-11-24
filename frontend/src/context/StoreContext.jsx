import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const url = "https://grooviti-backend.onrender.com"; // backend URL

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);

  const [cartItems, setCartItems] = useState({});
  const [myevents_list, setmyevents_list] = useState([]);

  // -------------------------------------------------------------
  // 🔹 1. FETCH ALL EVENTS
  // -------------------------------------------------------------
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${url}/api/event/list`);
      setmyevents_list(response.data.data);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
    }
  };

  // -------------------------------------------------------------
  // 🔹 2. LOAD USER FROM TOKEN
  // -------------------------------------------------------------
  const loadUserFromToken = async () => {
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn("⛔ Token expired. Logging out.");
        logout();
        return;
      }

      const res = await axios.get(`${url}/api/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsLoggedIn(true);
      } else {
        logout();
      }
    } catch (err) {
      console.error("⛔ Invalid token:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 🔹 3. FETCH CART FROM BACKEND
  // -------------------------------------------------------------
  const loadCart = async () => {
    if (!user) return;

    try {
      console.log("🛒 Fetching user cart:", user._id);

      const res = await axios.post(
        `${url}/api/cart/get`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (err) {
      console.error("❌ Failed to load cart:", err);
    }
  };

  // -------------------------------------------------------------
  // 🔹 4. ADD TO CART (SAFE)
  // -------------------------------------------------------------
  const addToCart = async (itemId) => {
    console.log("🛒 Add to cart clicked:", itemId);

    if (!isLoggedIn || !user) {
      alert("Please log in to continue.");
      console.error("❌ Add to cart denied — user not logged in.");
      return;
    }

    // Update UI immediately
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("❌ Backend addToCart failed:", err);
    }
  };

  // -------------------------------------------------------------
  // 🔹 5. REMOVE FROM CART (SAFE)
  // -------------------------------------------------------------
  const removeFromCart = async (itemId) => {
    if (!isLoggedIn || !user) return;

    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));

    try {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("❌ Backend removeFromCart failed:", err);
    }
  };

  // -------------------------------------------------------------
  // 🔹 6. GET TOTAL CART AMOUNT
  // -------------------------------------------------------------
  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const event = myevents_list.find((e) => e._id === item);
        if (event) total += event.price * cartItems[item];
      }
    }
    return total;
  };

  // -------------------------------------------------------------
  // 🔹 7. LOGOUT FUNCTION
  // -------------------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setIsLoggedIn(false);
    setCartItems({});
  };

  // -------------------------------------------------------------
  // 🔹 8. EFFECTS
  // -------------------------------------------------------------
  useEffect(() => {
    fetchEvents();
    loadUserFromToken();
  }, [token]);

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  // Sync token across tabs
  useEffect(() => {
    const sync = (e) => {
      if (e.key === "token") setToken(e.newValue || "");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // -------------------------------------------------------------
  // 🔹 9. EXPORT CONTEXT
  // -------------------------------------------------------------
  const contextValue = {
    url,
    token,
    setToken,
    user,
    isLoggedIn,
    isLoading,

    myevents_list,
    cartItems,

    addToCart,
    removeFromCart,
    getTotalCartAmount,

    setUser,
    setCartItems,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {!isLoading && children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
