import React from "react";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import HostedEvents from "./pages/Orders/HostedEvents"; // Updated import
import EventInsights from "./pages/EventInsights/EventInsights"; // New page for event analytics
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/SideBar/SideBar";

const App = () => {
  const url = "https://your-backend-url.com"; // Update with actual backend URL

  return (
    <div>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/admin/add" element={<Add url={url} />} />
        <Route path="/admin/list" element={<List url={url} />} />
        <Route path="/admin/hosted-events" element={<HostedEvents url={url} />} />
        <Route path="/admin/event-insights/:eventId" element={<EventInsights url={url} />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
