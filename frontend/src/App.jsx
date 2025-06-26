import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPage/LoginPopup";
import ListButton from "./components/ListButton/ListButton";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

// Pages
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import BuyTicket from "./pages/BuyTicket/BuyTicket";
import TicketConfirmation from "./pages/TicketConfirmation/TicketConfirmation";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import AboutUs from "./pages/AboutUs/AboutUs";
import PlanUpgrade from "./pages/PlanUpgrade/PlanUpgrade";
import Events from "./pages/Events/Events";
import ContactUs from "./pages/ContactUs/ContactUs";
import SearchResults from "./components/SearchResults/SearchResults";
import EventDetails from "./pages/EventDetails/EventDetails";
import EventDirection from "./pages/EventDirection/EventDirection";
import OrganizerInfo from "./pages/OrganizerInfo/OrganizerInfo";
import Profile from "./pages/Profile/Profile";
import Community from "./pages/Community/Community";
import CommunityPage from "./pages/CommunityPage/CommunityPage";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <HelmetProvider>
      <ToastContainer position="top-center" />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/event/:id/buyticket" element={<BuyTicket />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/event" element={<Events />} />
            <Route path="/community" element={<Community />} />;
            <Route path="/community/:id" element={<CommunityPage />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/Profile" element={<Profile />} />
            <Route
              path="/ticket-confirmation"
              element={<TicketConfirmation />}
            />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/plans" element={<PlanUpgrade />} />
            <Route path="/list-event" element={<ListButton />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/event/:id/direction" element={<EventDirection />} />
            <Route path="/organizer-info" element={<OrganizerInfo />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </HelmetProvider>
  );
};

export default App;
