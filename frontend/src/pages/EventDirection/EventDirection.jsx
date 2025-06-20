import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useParams } from "react-router-dom";
import axios from "axios";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const RoutingControl = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to || !map) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: "#0074D9", weight: 5 }],
      },
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [from, to, map]);

  return null;
};

const EventDirection = () => {
  const { id } = useParams();
  const [userPos, setUserPos] = useState(null);
  const [eventLocation, setEventLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserPos({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    // Fetch event by ID
    axios.get(`http://localhost:4000/api/event/${id}`).then((res) => {
      if (res.data.success) {
        const { latitude, longitude } = res.data.data.location;
        setEventLocation({ lat: latitude, lng: longitude });
      }
    });
  }, [id]);

  if (!userPos || !eventLocation) return <p>Loading map...</p>;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={userPos}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={userPos} icon={markerIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <Marker position={eventLocation} icon={markerIcon}>
          <Popup>Event Location</Popup>
        </Marker>
        <RoutingControl from={userPos} to={eventLocation} />
      </MapContainer>
    </div>
  );
};

export default EventDirection;
