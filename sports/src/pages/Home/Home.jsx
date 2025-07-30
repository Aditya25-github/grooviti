import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
// import Header from "../../components/Header/Header";
import PopularSports from "../../components/PopularSports/PopularSports";
import TurfNearest from "../../components/TurfNearest/TurfNearest";
import AcademyNear from "../../components/AcademyNear/AcademyNear";
import Milestones from "../../components/Milestones/Milestones";
import Feedback from "../../components/Feedback/Feedback";
import SayAboutUs from "../../components/SayAboutUs/SayAboutUs";
import Aurora from "../../components/Aurora/Aurora";
import ShinyText from "../../components/ShinyText/ShinyText";
import RotatingText from "../../components/RotatingText/RotatingText";

const SportsHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homepage}>
      {/* Hero Section with Aurora Background */}
      <div className={styles.heroSection}>
        {/* Aurora Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden'
        }}>
          <Aurora
            colorStops={["#7bff67", "#b19eef", "#5227ff"]}
            blend={0.4}
            amplitude={2.5}
            speed={0.5}
          />
        </div>
        
        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className={styles.heroTitle}>
            Want to{' '}
            <span style={{ display: 'inline-block' }}>
              <RotatingText
                texts={[' book ', 'manage', 'handle']}
                mainClassName={styles.rotatingText}
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName={styles.rotatingTextSplit}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
                
              />
            </span>{' '}
            turfs?
          </h1>
          <h2 className={styles.heroSubtitle}>
            <ShinyText 
              text="Grooviti " 
              disabled={false} 
              speed={4} 
              className={styles.shinyGrooviti}
            />
            <span>  is the right place!</span>
          </h2>
          <p className={styles.heroSlogan}>Groove it, Book it, Live it</p>
        </div>
      </div>
      
      {/* Rest of your content */}
      {/* <Header /> */}
      <PopularSports />
      <TurfNearest />
      <AcademyNear/>
      <Milestones/>
      <SayAboutUs/>
      <Feedback/>
    </div>
  );
};

export default SportsHomepage;