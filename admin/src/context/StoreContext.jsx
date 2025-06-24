import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedEmail = localStorage.getItem("eventHost");

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setAdmin(true);
    }

    setLoading(false);
  }, []);

  return (
    <StoreContext.Provider
      value={{ token, setToken, admin, setAdmin, loading }}
    >
      {!loading && children}
    </StoreContext.Provider>
  );
};
