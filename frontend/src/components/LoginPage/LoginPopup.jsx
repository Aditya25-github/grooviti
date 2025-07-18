import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let endpoint =
      currState === "Login" ? "/api/user/login" : "/api/user/register";

    try {
      const response = await axios.post(`${url}${endpoint}`, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        if (response.data.role === "eventHost") {
          window.location.href = "https://grooviti-admin.onrender.com";
        } else {
          setShowLogin(false);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleForgotPassword = () => {
    setShowLogin(false);
    navigate("/forgot-password");
  };

  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     const token = await user.getIdToken();

  //     const response = await axios.post(`${url}/api/user/google-login`, {
  //       email: user.email,
  //       name: user.displayName,
  //       token,
  //     });

  //     if (response.data.success) {
  //       setToken(response.data.token);
  //       localStorage.setItem("token", response.data.token);
  //       localStorage.setItem(
  //         "user",
  //         JSON.stringify({ _id: user._id, token: user.token })
  //       );
  //       setShowLogin(false);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (err) {
  //     toast.error("Google sign-in failed");
  //     console.error(err);
  //   }
  // };

  return (
    <div className="Login-Popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt=""
            onClick={() => setShowLogin(false)}
          />
        </div>

        <div className="login-popup-input">
          {currState === "Login" ? null : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
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
            placeholder="Password"
            required
          />
        </div>

        {currState === "Login" && (
          <p className="forgot-password-link" onClick={handleForgotPassword}>
            Forgot Password?
          </p>
        )}

        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        {/* <div className="divider">or</div> */}

        {/* <button
          type="button"
          onClick={handleGoogleLogin}
          className="social-login google"
        >
          <img src={assets.google_icon} alt="Google" /> Continue with Google
        </button>

        <button
          type="button"
          onClick={() => toast.info("Mobile OTP Login coming soon")}
          className="social-login otp"
        >
          Continue with Mobile OTP
        </button> */}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, you agree to our Terms and Privacy Policy</p>
        </div>

        {currState === "Login" ? (
          <p>
            Don't have an account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Sign up here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
