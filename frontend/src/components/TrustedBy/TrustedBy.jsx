import React from "react";
import "./TrustedBy.css";

const logos = [
  { image: "/images/pccoer_logo.webp", alt: "PCCOER Logo" },
  { image: "/images/pcet_logo.png", alt: "PCET Trust Logo" }
];


const TrustedBy = () => {
  
const repeatedLogos = [...logos, { spacer: true }, ...logos];

  return (
    <div className="trusted-container">
      <h2 className="textt">Trusted by</h2>
      <div className="marquee-wrapper">
        <div className="marquee">
          <div className="marquee-content">
            {repeatedLogos.map((logo, index) =>
              logo.spacer ? (
                <div key={index} style={{ width: "65vw" }}></div>
              ) : (
                <img
                  key={index}
                  src={logo.image}
                  alt={logo.alt}
                  className="trust-logo"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;
