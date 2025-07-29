import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Aurora from './components/Aurora/Aurora';
// Pages
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import Venues from './pages/Venues/venues';


function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/Venues" element={<Venues/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
