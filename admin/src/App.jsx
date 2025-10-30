import React, { useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { StoreContext } from "./context/StoreContext";
import ProtectedRoute from "./EventOrganizerPanel/components/ProtectedRoute";

// Sidebars
import SideBar from "./EventOrganizerPanel/components/SideBar/SideBar";
import AcademySideBar from "./AcademyPanel/components/AcademySideBar/AcademySideBar";
import TurfSideBar from "./TurfOwnerPanel/components/TurfSideBar/TurfSideBar";

// Navbars (role-specific)
import AcademyNavbar from "./AcademyPanel/components/AcademyNavbar/AcademyNavbar";
import EventNavbar from "./EventOrganizerPanel/components/EventNavbar/Navbar";
import TurfNavbar from "./TurfOwnerPanel/components/TurfNavbar/TurfNavbar";

// Footers (role-specific)
import AcademyFooter from "./AcademyPanel/components/AcademyFooter/AcademyFooter";
import Footer from "./EventOrganizerPanel/components/Footer/Footer";
import TurfFooter from "./TurfOwnerPanel/components/TurfFooter/TurfFooter";

// Public Pages
import LoginTypeSelector from "./LandingPage/pages/LoginOption/LoginTypeSelector";
import TurfLogin from "./TurfOwnerPanel/pages/TurfLogin/TurfLogin";
import EventHostLogin from "./EventOrganizerPanel/components/Login/EventHostLogin";
import AcademyLogin from "./AcademyPanel/pages/AcademyLogin/AcademyLogin";

// Academy Pages
import Dashboard from "./AcademyPanel/pages/Dashboard/Dashboard";
import AttendanceManagement from "./AcademyPanel/pages/AttendanceManagment/AttendanceManagment";
import FeeCollection from "./AcademyPanel/pages/FeeCollection/FeeCollection";
import PaymentTracking from "./AcademyPanel/pages/PaymentTracking/PaymentTracking";
import BatchSchedule from "./AcademyPanel/pages/BatchSchedule/BatchSchedule";
import CoachStaffRole from "./AcademyPanel/pages/CoachStaffRole/CoachStaffRole";
import StudentOnboarding from "./AcademyPanel/pages/StudentOnboarding/StudentOnboarding";
import PerformanceTracking from "./AcademyPanel/pages/Performancetracking/Performancetracking";
import Reports from "./AcademyPanel/pages/Reports/Reports";
import AcademySettings from "./AcademyPanel/pages/AcademySettings/AcademySettings";

// Turf Owner Pages
import TurfDashboard from "./TurfOwnerPanel/pages/Dashboard/TurfDashboard";
import BookingListPage from "./EventOrganizerPanel/pages/OwnerDashboard/BookingListPage/BookingListPage";
import List from "./EventOrganizerPanel/pages/List/List";
import TurfListing from "./TurfOwnerPanel/pages/TurfListing/TurfListing";
import TurfBooking from "./TurfOwnerPanel/pages/TurfBooking/TurfBooking";
import SlotManagement from "./TurfOwnerPanel/pages/SlotManagment/SlotManagment";
import StaffManagement from "./TurfOwnerPanel/pages/StaffManagment/StaffManagement";
import RevenueExpenses from "./TurfOwnerPanel/pages/Revenue/RevenueExpenses";
import Feedback from "./TurfOwnerPanel/pages/FeedBacks/Feedback";
import RefundsManagement from "./TurfOwnerPanel/pages/RefundsManagement/RefundsManagement";
import Analytics from "./TurfOwnerPanel/pages/Analytics/Analytics";
import Pricing from "./TurfOwnerPanel/pages/Pricing/Pricing";

// Event Host Pages
import ManageEvent from "./EventOrganizerPanel/pages/ManageEvent/ManageEvent";
import AddCandidate from "./EventOrganizerPanel/pages/AddCandidate/AddCandidate";
import Add from "./EventOrganizerPanel/pages/Add/Add";
import MyPlan from "./EventOrganizerPanel/pages/MyPlans/MyPlan";
import Settings from "./EventOrganizerPanel/pages/Settings/Settings";
import Orders from "./EventOrganizerPanel/pages/Orders/Orders";
import Statistics from "./EventOrganizerPanel/pages/Statistics/Statistics";

const App = () => {
  const url = "https://grooviti-backend.onrender.com";
  const location = useLocation();
  const { token, userRole, loading } = useContext(StoreContext);

  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/login/event" ||
    location.pathname === "/login/turf" ||
    location.pathname === "/login/academy";

  if (loading) return null;

  const renderSideBar = () => {
    if (isLoginPage) return null;
    if (userRole === "academy") return <AcademySideBar />;
    if (userRole === "event") return <SideBar />;
    if (userRole === "turfOwner") return <TurfSideBar />;
    return null; // turfOwner or others
  };

  const renderNavbar = () => {
    if (isLoginPage) return null;
    if (userRole === "academy") return <AcademyNavbar url={url} />;
    if (userRole === "event") return <EventNavbar url={url} />;
    if (userRole === "turfOwner") return <TurfNavbar url={url} />;
    return null;
  };

  const renderFooter = () => {
    if (isLoginPage) return null;
    if (userRole === "academy") return <AcademyFooter />;
    if (userRole === "event") return <Footer />;
    if (userRole === "turfOwner") return <TurfFooter />;
    return null;
  };

  return (
    <div>
      <ToastContainer />
      {renderNavbar()}
      <div className="app-content">
        {renderSideBar()}
        <Routes key={token}>
          {/* Public Routes */}
          <Route path="/" element={<LoginTypeSelector url={url} />} />
          <Route path="/login/event" element={<EventHostLogin url={url} />} />
          <Route path="/login/turf" element={<TurfLogin url={url} />} />
          <Route path="/login/academy" element={<AcademyLogin url={url} />} />

          {/* Academy Owner Routes */}
          <Route
            path="/academy/dashboard"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <Dashboard url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/attendance"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <AttendanceManagement url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/fee-collection"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <FeeCollection url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/payment-tracking"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <PaymentTracking url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/batch-schedule"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <BatchSchedule url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/coach-staff"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <CoachStaffRole url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/student-onboarding"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <StudentOnboarding url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/performance-tracking"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <PerformanceTracking url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/reports"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <Reports url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/academy-settings"
            element={
              <ProtectedRoute allowedRoles={["academy"]}>
                <AcademySettings url={url} />
              </ProtectedRoute>
            }
          />

          {/* Turf Owner Routes */}
          <Route
            path="/turf/dashboard"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <TurfDashboard url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/listings"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <TurfListing url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/bookings"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <TurfBooking url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/slot-management"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <SlotManagement url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/staff"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <StaffManagement url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/revenue"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <RevenueExpenses url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/feedback"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <Feedback url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/refunds"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <RefundsManagement url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/analytics"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <Analytics url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turf/pricing"
            element={
              <ProtectedRoute allowedRoles={["turfOwner"]}>
                <Pricing url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/list"
            element={
              <ProtectedRoute>
                <List url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookinglist"
            element={
              <ProtectedRoute>
                <BookingListPage url={url} />
              </ProtectedRoute>
            }
          />

          {/* Event Organizer Routes */}
          <Route
            path="/event/manage-event"
            element={
              <ProtectedRoute>
                <ManageEvent url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/add"
            element={
              <ProtectedRoute>
                <Add url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/add-candidate"
            element={
              <ProtectedRoute>
                <AddCandidate url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/my-plan"
            element={
              <ProtectedRoute>
                <MyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/settings"
            element={
              <ProtectedRoute>
                <Settings url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/orders"
            element={
              <ProtectedRoute>
                <Orders url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/statistics"
            element={
              <ProtectedRoute>
                <Statistics url={url} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {renderFooter()}
    </div>
  );
};

export default App;
