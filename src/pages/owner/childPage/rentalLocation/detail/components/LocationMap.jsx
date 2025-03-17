export default function LocationMap({ latitude, longitude }) {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  // Kiểm tra giá trị latitude & longitude
  if (
    latitude == null ||
    longitude == null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    console.error("Invalid latitude or longitude:", latitude, longitude);
    return <p>⚠️ Invalid location data.</p>;
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}`;

  return (
    <div>
      <div
        style={{
          height: "300px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <iframe
          title="Rental Location Map"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
