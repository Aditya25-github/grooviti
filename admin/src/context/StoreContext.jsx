import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [userRole, setUserRole] = useState(""); // NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve userType from localStorage (matches frontend login code)
    const userType = localStorage.getItem("userType");

    // Retrieve token based on userType
    let storedToken = null;
    if (userType === "academy") {
      storedToken = localStorage.getItem("academyToken");
    } else if (userType === "eventHost") {
      storedToken = localStorage.getItem("eventHostToken");
    } else if (userType === "turfOwner") {
      storedToken = localStorage.getItem("turfOwnerToken");
    }

    if (storedToken && userType) {
      setToken(storedToken);
      setUserRole(userType);
      setAdmin(userType === "admin"); // if you have an admin userType
    }

    setLoading(false);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        token,
        setToken,
        admin,
        setAdmin,
        loading,
        userRole,
        setUserRole,
      }}
    >
      {!loading && children}
    </StoreContext.Provider>
  );
};
