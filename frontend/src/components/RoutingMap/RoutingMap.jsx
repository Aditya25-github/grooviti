import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

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
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      lineOptions: {
        styles: [{ color: "#FF5733", weight: 5 }],
      },
      createMarker: () => null, // disable default routing markers
    }).addTo(map);

    map.flyToBounds([L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)], {
      padding: [50, 50],
    });

    return () => {
      map.removeControl(control);
    };
  }, [from, to, map]);

  return null;
};

const RoutingMap = ({ from, to }) => {
  if (!from || !to) return null;

  const center = {
    lat: (from.lat + to.lat) / 2,
    lng: (from.lng + to.lng) / 2,
  };

  return (
    <div
      style={{
        height: "400px",
        marginTop: "20px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={from} icon={markerIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <Marker position={to} icon={markerIcon}>
          <Popup>Event Location</Popup>
        </Marker>
        <RoutingControl from={from} to={to} />
      </MapContainer>
    </div>
  );
};

export default RoutingMap;
