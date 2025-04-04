import { Link } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import styles from "./SetNewSuccess.module.scss";

export default function SetNewSuccess() {
  return (
    <div className={styles["success-container"]}>
      <div className={styles["success-content"]}>
        <CheckCircleOutlined className={styles["success-icon"]} />
        <h2>Đổi mật khẩu thành công!</h2>
        <p>Bạn đã đổi mật khẩu thành công. Hãy đăng nhập để tiếp tục.</p>
        <Link to="/login">
          <Button
            style={{ backgroundColor: "#18243C", color: "#fff" }}
            className={styles["back-login-btn"]}
          >
            Quay lại Đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  );
}
