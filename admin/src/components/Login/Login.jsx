import React, { useContext, useEffect } from "react";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContextt";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(url + "/api/user/login", data);

      if (response.data.success) {
        if (response.data.role === "eventHost") {
          setToken(response.data.token);
          setAdmin(true);
          localStorage.setItem("adminToken", response.data.token);
          localStorage.setItem("eventHost", true);

          toast.success("Login Successfully");
          navigate("/add");
        } else {
          toast.error("You are not an admin");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  useEffect(() => {
    // ✅ Fix: Add dependencies
    if (admin && token) {
      navigate("/add");
    }

    // ✅ Optional fallback: if refreshed and context is empty, use localStorage
    const tokenFromStorage = localStorage.getItem("adminToken");
    const isEventHost = localStorage.getItem("eventHost");

    if (tokenFromStorage && isEventHost) {
      setToken(tokenFromStorage);
      setAdmin(true);
      navigate("/add");
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
