import React from "react";
import "./Header.css";


const Header = () => {
  
  return (
    <div style={{ paddingTop: "114px" }}>
      <div className="header">
        <div className="header-contents">
          <h2>Buy Your Favourite Event Tickets Here</h2>
          <p>
          At grooviti.com, we make event ticketing and event listing seamless
          and hassle-free! Whether you're planning an event or looking to attend
          one, our platform is designed to provide a smooth experience. From
          exclusive concerts and thrilling sports matches to insightful
          workshops and community gatherings, we bring you the best events with
          just a few clicks. Groove it. Book it. Live it. - Your next
          unforgettable experience starts here!
          </p>
          <button>
            <a href="#explore-events">View Events</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
