import Logo from "../assets/images/logo.png";

export default function LogoHeader() {
  return (
    <div
      className="logo"
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 64,
        margin: "16px",
        overflow: "hidden",
        transition: "all 0.3s",
      }}
    >
      <img
        src={Logo} // Đường dẫn tới logo của bạn
        alt="Mean Logo"
        style={{
          height: "40px",
          width: "40px",
        }}
      />
      <span
        style={{
          marginLeft: "8px",
          fontSize: "26px",
          fontWeight: "500",
          color: "#2F7BEB",
        }}
      >
        Mean
      </span>
    </div>
  );
}
