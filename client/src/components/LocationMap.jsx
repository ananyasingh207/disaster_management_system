import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// India Center Coordinates
const INDIA_CENTER = [20.5937, 78.9629];

// Define colors based on severity
const SEVERITY_COLORS = {
  LOW: "#facc15",      // Yellow
  MEDIUM: "#f97316",   // Orange
  HIGH: "#ef4444",     // Red
  CRITICAL: "#ff0000"  // Bright Red
};

function ClickHandler({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

export default function LocationMap({ onSelect, severity = "LOW" }) {
  const [position, setPosition] = useState(null);

  const handleSelect = (latlng) => {
    setPosition(latlng);
    // Format coordinates for the form
    const locString = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    onSelect(locString);
  };

  // Create custom icon based on severity
  const getIcon = () => {
    const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.LOW;
    const isCritical = severity === "CRITICAL";

    return L.divIcon({
      className: "custom-marker-container",
      html: `<div class="custom-pin ${isCritical ? 'pin-pulse' : ''}" style="--pin-color: ${color}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div style={{ height: "350px", width: "100%", borderRadius: "12px", overflow: "hidden", position: "relative", border: "1px solid var(--glass-border)" }}>
      <MapContainer 
        center={INDIA_CENTER} 
        zoom={5} 
        style={{ height: "100%", width: "100%", background: "#0f172a" }}
        scrollWheelZoom={true}
      >
        {/* Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ClickHandler setLocation={handleSelect} />
        
        {position && <Marker position={position} icon={getIcon()} />}
      </MapContainer>
      
      {/* Tactical Overlay */}
      <div style={{
        position: "absolute", top: 10, right: 10, zIndex: 999,
        background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "4px",
        fontSize: "0.7rem", color: SEVERITY_COLORS[severity], border: `1px solid ${SEVERITY_COLORS[severity]}`
      }}>
        THREAT_LEVEL: {severity}
      </div>
    </div>
  );
}