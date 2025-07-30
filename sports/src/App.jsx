import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import StoreContextProvider from "./context/StoreContext";
import Navbar from "./components/NavBar/NavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";
// Pages
import Home from "./pages/Home/Home";
import AboutUs from "./pages/AboutUs/AboutUs";
import Venues from "./pages/Venues/Venues.jsx";
import VenueDetails from "./pages/Venues/VenueDetails.jsx";
import Academy from "./pages/Academy/Academy.jsx";
import AcademyDetails from "./pages/Academy/AcademyDetails.jsx";
import PlayTogether from "./pages/PlayTogether/PlayTogether.jsx";
import PlayTogetherDetails from "./pages/PlayTogether/PlayTogetherDetails.jsx";
import MyProfile from "./pages/Profile/MyProfile.jsx";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <StoreContextProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/:id" element={<AcademyDetails />} />
          <Route path="/playtogether" element={<PlayTogether />} />
          <Route path="/playtogether/:id" element={<PlayTogetherDetails />} />
          <Route path="/profile" element={<MyProfile />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </StoreContextProvider>
  );
}

export default App;
