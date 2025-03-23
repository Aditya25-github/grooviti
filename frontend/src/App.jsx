import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import BuyTicket from "./pages/BuyTicket/BuyTicket";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import LoginPopup from "./components/LoginPage/LoginPopup";
import TicketConfirmation from "./pages/TicketConfirmation/TicketConfirmation";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import AboutUs from "./pages/AboutUs/AboutUs";
import PlanUpgrade from "./pages/PlanUpgrade/PlanUpgrade";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin}></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/event/:eventName/buyticket" element={<BuyTicket />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/ticket-confirmation" element={<TicketConfirmation />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/plans" element={<PlanUpgrade />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
