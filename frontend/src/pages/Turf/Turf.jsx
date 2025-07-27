import "./Turf.css";
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { listTurf } from "../../../../backend/controllers/turfBookingController";

return (  
    <div className="turf-page">
    <h1>Welcome to the Turf Booking Page</h1>
    <p>Here you can find and book turfs for your events.</p>
    <div className="turf-list">
      {turfs.length > 0 ? (
        turfs.map((turf) => (
          <div key={turf.id} className="turf-item">
            <h2>{turf.name}</h2>
            <p>Location: {turf.location}</p>
            <p>Price: ${turf.price}</p>
          </div>
        ))
      ) : (
        <p>No turfs available at the moment.</p>
      )}
      {loading && <p>Loading turfs...</p>}
      {/* You can map through the turfs and display them here */}
    </div>
    </div>
)