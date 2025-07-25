import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const DraggableMapPicker = ({ lat, lng, setLatLng, setAddress, url }) => {
  const [position, setPosition] = useState({
    lat: lat || 28.6635,
    lng: lng || 73.7352,
  });

  const reverseGeocode = async ({ lat, lng }) => {
    try {
      const res = await axios.get(
        `${url}/api/reverse-geocode?lat=${lat}&lon=${lng}`
      );
      const addr = res.data.address;
      const fullAddressParts = [
        addr.building,
        addr.house_number,
        addr.road,
        addr.neighbourhood,
        addr.suburb,
        addr.village,
        addr.town,
        addr.city,
        addr.state,
        addr.postcode,
        addr.country,
      ];
      const fullAddress = fullAddressParts.filter(Boolean).join(", ");
      setAddress(fullAddress);
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  // ⚠️ Custom hook to animate map center
  const AnimateMapCenter = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo(position, 16); // Zoom to level 16 with animation
    }, [position]);
    return null;
  };

  const DraggableMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setLatLng(e.latlng);
        reverseGeocode(e.latlng);
      },
    });

    return (
      <Marker
        position={position}
        icon={markerIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const newLatLng = e.target.getLatLng();
            setPosition(newLatLng);
            setLatLng(newLatLng);
            reverseGeocode(newLatLng);
          },
        }}
      />
    );
  };

  useEffect(() => {
    if (lat && lng) {
      const newPos = { lat, lng };
      setPosition(newPos);
      setLatLng(newPos);
      reverseGeocode(newPos);
    }
  }, [lat, lng]);

  return (
    <div
      style={{
        height: "300px",
        margin: "20px 0",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AnimateMapCenter position={position} />
        <DraggableMarker />
      </MapContainer>
    </div>
  );
};

export default DraggableMapPicker;
