import React, { useContext, useEffect } from "react";
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
import MyPlan from "./pages/MyPlans/MyPlan";
import Settings from "./pages/Settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer/Footer";
import { StoreContext } from "./context/StoreContext";
import ManageEvent from "./pages/ManageEvent/ManageEvent";
import AddCandidate from "./pages/AddCandidate/AddCandidate";

const App = () => {
  const url = "https://grooviti-backend.onrender.com";
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const { token, admin, loading } = useContext(StoreContext);

  if (loading) return null;

  return (
    <div>
      <ToastContainer />
      <Navbar url={url} />
      <hr />

      <div className="app-content">
        {!isLoginPage && <Sidebar />}

        <Routes key={token}>
          <Route path="/" element={<Login url={url} />} />
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
            path="/manage-event"
            element={
              <ProtectedRoute>
                <ManageEvent url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-candidate"
            element={
              <ProtectedRoute>
                <AddCandidate url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-plan"
            element={
              <ProtectedRoute>
                <MyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings url={url} />
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
