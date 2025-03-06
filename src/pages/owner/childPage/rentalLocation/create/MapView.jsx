import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const centerDefault = {
  lat: 10.762622, // Mặc định TPHCM
  lng: 106.660172,
};

export default function MapView({ latitude, longitude }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY, // Thay bằng API Key của bạn
  });

  const [mapCenter, setMapCenter] = useState(centerDefault);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter({ lat: Number(latitude), lng: Number(longitude) });
    }
  }, [latitude, longitude]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
      <Marker position={mapCenter} />
    </GoogleMap>
  );
}
