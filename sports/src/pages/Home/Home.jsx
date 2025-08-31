import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import PopularSports from "../../components/PopularSports/PopularSports";
import TurfNearest from "../../components/TurfNearest/TurfNearest";
import AcademyNear from "../../components/AcademyNear/AcademyNear";
import Milestones from "../../components/Milestones/Milestones";
import SayAboutUs from "../../components/SayAboutUs/SayAboutUs";
import ShinyText from "../../components/ShinyText/ShinyText";
import RotatingText from "../../components/RotatingText/RotatingText";

const SportsHomepage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const exploreVenues = () => navigate("/venues");

  return (
    <div className={styles.homepage}>
      <section className={styles.heroSection} aria-label="Grooviti hero">
        {/* Floating ornaments */}
        <div className={styles.floatingElements} aria-hidden="true">
          <div className={styles.floatingCircle1}></div>
          <div className={styles.floatingCircle2}></div>
          <div className={styles.floatingCircle3}></div>
        </div>

        {/* Hero Content */}
        <div
          className={`${styles.heroContent} ${isVisible ? styles.visible : ""}`}
        >
          <h1 className={styles.heroTitle}>
            Book your next{" "}
            <RotatingText
              texts={["game", "event", "training"]}
              mainClassName={styles.rotatingText}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400,
                mass: 0.5,
              }}
              rotationInterval={2000}
              style={{ color: "inherit", fontWeight: 800 }}
            />{" "}
            in minutes
          </h1>

          <h2 className={styles.heroSubtitle}>
            <ShinyText
              text="Grooviti"
              speed={2.5}
              intensity={0.9}
              className={styles.brandName}
            />
          </h2>

          <p className={styles.heroSlogan}>Book it. Groove it. Live it.</p>

          <div className={styles.ctaContainer}>
            <button className={styles.ctaPrimary} onClick={exploreVenues}>
              Explore Now
              <span className={styles.buttonSparkle}></span>
            </button>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Discover more</span>
          <div className={styles.mouse} aria-hidden="true">
            <div className={styles.wheel}></div>
          </div>
        </div>
      </section>

      <PopularSports />
      <TurfNearest />
      <AcademyNear />
      <Milestones />
      <SayAboutUs />
    </div>
  );
};

export default SportsHomepage;