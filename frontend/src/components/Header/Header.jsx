import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Header.css";
// import SplashCursor from '../../components/ui/SplashCursor'

const swapWords = [".events", ".sports"];
const title = "Grooviti".split(""); // Split for letter animation

const Header = () => {
  const navigate = useNavigate();
  const [swapIndex, setSwapIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwapIndex((prev) => (prev + 1) % swapWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const letterVariants = {
    hidden: { y: -100, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 12 } },
  };

  return (
    <div className="hero-wrapper">
      {/* <SplashCursor containerSelector=".hero-wrapper" /> */}
      <div className="header-hero">
        <div className="hero-contents">
          {/* Title Wrapper that first appears in center */}
          
          <motion.div
            initial={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              x: 0,
              y: 0,
              left: 0,
              top: "30%", // slight vertical adjustment if needed
              position: "relative",
            }}
            transition={{ delay: 1.5, duration: 1 }}
            style={{ display: "inline-block" }}
          >
            {/* Letter by Letter Animation */}
            <motion.h1
              className="hero-title"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {title.map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}

              {/* Swapping .events / .sports */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={swapIndex}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="dynamic-text"
                >
                  {swapWords[swapIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.h1>
          </motion.div>

          {/* Tagline Animation */}
          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            Groove it! Book it! Live it!
          </motion.p>
          <motion.p className="phrasee">
            Experience the ultimate platform for events, sports, and academy management. Where entertainment meets technology.
          </motion.p>

         
        </div>
      </div>
    </div>
  );
};

export default Header;
