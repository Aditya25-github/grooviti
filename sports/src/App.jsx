import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";
// Pages
import Home from "./pages/Home/Home";
import AboutUs from "./pages/AboutUs/AboutUs";
import Venues from "./pages/Venues/Venues.jsx";
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
