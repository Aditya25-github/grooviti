import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "/api/organizer/login", data);
      if (response.data.success) {
        if (response.data.role === "host") {
          setToken(response.data.token);
          setAdmin(true);
          localStorage.setItem("adminToken", response.data.token);
          localStorage.setItem("organizerEmail", response.data.email);
          localStorage.setItem("eventHost", response.data.email);
          toast.success("Login Successfully");
          navigate("/add");
        } else {
          toast.error("You are not an admin");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("🔥 AXIOS LOGIN ERROR:", error);
      if (error.response) {
        toast.error(
          error.response.data.message || "Server responded with error"
        );
      } else {
        toast.error("Network or client error");
      }
    }
  };

  useEffect(() => {
    if (admin && token) {
      navigate("/add");
      return;
    }
    const tokenFromStorage = localStorage.getItem("adminToken");
    const emailFromStorage = localStorage.getItem("eventHost");

    if (!token && !admin && tokenFromStorage && emailFromStorage) {
      setToken(tokenFromStorage);
      setAdmin(true);
    }
  }, [admin, token, navigate, setAdmin, setToken]);

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Login</h2>
        </div>
        <div className="login-popup-inputs">
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
