import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';

// Pages
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </div>
  );
}

export default App;
