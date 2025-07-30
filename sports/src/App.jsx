import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";
// Pages
import Home from "./pages/Home/Home";
import AboutUs from "./pages/AboutUs/AboutUs";
import Venues from "./pages/Venues/Venues.jsx";
import VenueDetails from "./pages/Venues/VenueDetails.jsx"; // Add this import
import Academy from "./pages/Academy/Academy.jsx";
import AcademyDetails from "./pages/Academy/AcademyDetails.jsx";
import PlayTogether from "./pages/PlayTogether/PlayTogether.jsx";
import "./App.css";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venues/:id" element={<VenueDetails />} /> {/* Add this route */}
        <Route path="/academy" element={<Academy />} />
        <Route path="/academy/:id" element={<AcademyDetails />} />
        <Route path="/playtogether" element={<PlayTogether />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
