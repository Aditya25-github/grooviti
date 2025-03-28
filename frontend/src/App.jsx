import React from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar/Navbar";
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
import Events from "./pages/Events/Events";
import EventTicketChart from "./pages/EventTicketChart/EventTicketChart";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <HelmetProvider>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/event/:eventName/buyticket" element={<BuyTicket />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/event" element={<Events />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/ticket-confirmation" element={<TicketConfirmation />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/plans" element={<PlanUpgrade />} />
          <Route path="/admin" element={<EventTicketChart />} />
        </Routes>
      </div>
      <Footer />
    </HelmetProvider>
  );
};

export default App;
