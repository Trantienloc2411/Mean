import { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "antd";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 10.762622, lng: 106.660172 }; // TP.HCM

export default function GoogleMapPicker({ onLocationSelect }) {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [searchBox, setSearchBox] = useState(null);

  useEffect(() => {
    console.log("Google Maps API Key:", apiKey);
  }, [apiKey]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const handleMarkerDragEnd = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const handlePlaceSelect = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng });
        onLocationSelect(lat, lng);
        map.panTo({ lat, lng });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <Autocomplete onLoad={setSearchBox} onPlaceChanged={handlePlaceSelect}>
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition}
        zoom={15}
        onClick={handleMapClick}
        onLoad={(map) => setMap(map)}
      >
        <Marker
          position={markerPosition}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </LoadScript>
  );
}
