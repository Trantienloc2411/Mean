import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "antd";

const ForbiddenPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <AlertCircle style={{ width: "64px", height: "64px", color: "red" }} />
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginTop: "16px" }}>
        403 - Forbidden
      </h1>
      <p style={{ color: "#555", marginTop: "8px" }}>
        Bạn không có quyền truy cập trang này.
      </p>
      <Button
        type="primary"
        style={{ marginTop: "24px", padding: "10px 20px" }}
      >
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default ForbiddenPage;
