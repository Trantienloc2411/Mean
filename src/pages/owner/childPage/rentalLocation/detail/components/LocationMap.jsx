export default function LocationMap() {
  return (
    <div>
      <h2>Location Map</h2>
      <div
        style={{ height: "300px", borderRadius: "10px", overflow: "hidden" }}
      >
        <iframe
          title="Rental Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.882867867889!2d106.65159407432762!3d10.762622592328917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec92a2fbbdf%3A0xf4a8e5cfbdc423db!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1619686741046!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
