import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer.jsx';
// Pages
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
