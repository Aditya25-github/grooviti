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
      {/* Aurora Background - FILLS ENTIRE VIEWPORT */}
      <div className={styles.auroraContainer}>
        <Aurora
          colorStops={["#7bff67", "#b19eef", "#5227ff"]}
          blend={0.4}
          amplitude={2.5}
          speed={0.5}
        />
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className={styles.heroTitle}>
            Want to{' '}
            <RotatingText
              texts={['Book', 'Manage', 'Handle']}
              mainClassName={styles.rotatingText}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 400,
                mass: 0.5
              }}
              rotationInterval={2000}
              style={{ 
                color: '#ffffff',
                fontWeight: 'bold'
              }}
            />{' '}
            venues?
          </h1>
          <h2 className={styles.heroSubtitle}>
            <ShinyText 
              text="Grooviti" 
              speed={2.5} 
              intensity={0.9}
              className={styles.brandName}
            />
            <span>is the right place!</span>
          </h2>
          <p className={styles.heroSlogan}>Groove it, Book it, Live it</p>
        </div>
      </div>
      
      {/* Components Wrapper with Reduced Spacing */}
      <div className={styles.componentsWrapper}>
        <PopularSports />
        <TurfNearest />
        <AcademyNear />
        <Milestones />
        <SayAboutUs />
        {/* <Feedback/> */}
      </div>
    </div>
  );
};

export default SportsHomepage;
