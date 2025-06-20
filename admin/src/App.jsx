import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/SideBar/SideBar";
import Login from "./components/Login/Login";
import Statistics from "./pages/Statistics/Statistics";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer/Footer";

const App = () => {
  const url = "https://grooviti-backend.onrender.com";
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />

      <div className="app-content">
        {/*  Only show sidebar if not on login page */}
        {!isLoginPage && <Sidebar />}

        <Routes>
          <Route path="/" element={<Login url={url} />} />

          {/*  Protected Routes */}
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <Add url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <List url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Statistics url={url} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
