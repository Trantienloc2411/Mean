import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";

const defaultCenter = { lat: 10.762622, lng: 106.660172 }; // TP.HCM

export default function OpenStreetMapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMapClick = (e) => {
    setPosition(e.latlng);
    if (onLocationSelect) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: searchQuery,
            format: "json",
            limit: 1,
          },
        }
      );
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPosition);
        if (onLocationSelect) {
          onLocationSelect(newPosition.lat, newPosition.lng);
        }
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm địa điểm:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Tìm kiếm địa điểm..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      />
      <button onClick={handleSearch} style={{ marginBottom: "10px" }}>
        🔍 Tìm kiếm
      </button>

      <div style={{ width: "100%", height: "400px" }}>
        <MapContainer
          key={`${position.lat}-${position.lng}`} // Thêm key để đảm bảo re-render đúng
          center={position}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position} />
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>
    </div>
  );
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}
