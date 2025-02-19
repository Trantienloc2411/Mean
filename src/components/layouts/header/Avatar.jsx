import { Dropdown, message } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Image } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../../utils/storage";
import { setCredentials, setLogout } from "../../../redux/slices/authSlice";
// import { useLogoutQuery } from "../../../redux/services/authApi";

export default function Avatar({ userData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { logout } = useLogoutQuery();
  const defaultAvatar =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaj0ucKVpTNbey2YUj2f0V_MDQ1G6jBiwt2w&s";

  const handleLogout = async () => {
    // try {
    //   await logout().unwrap();
    dispatch(setLogout()); // Reset auth state
    removeToken();
    navigate("/login");
    message.success("Bạn đã đăng xuất thành công!");
    // } catch (error) {
    // console.error("Logout failed:", error);
    // message.error("Đăng xuất thất bại, vui lòng thử lại!");
    // }
  };

  const items = [
    {
      key: "1",
      label: "Hồ sơ",
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "Ví Mean",
      icon: <WalletOutlined />,
    },
    {
      key: "3",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout, // Gán trực tiếp hàm xử lý logout
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={["click"]}
      arrow
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #ddd",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            preview={false}
            src={userData?.getUser?.avatarUrl?.[0] || defaultAvatar}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
            alt="User Avatar"
          />
        </div>

        <span
          style={{
            textAlign: "end",
            minWidth: 100,
            maxWidth: 150,
            color: "#333",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            flexShrink: 1, // Cho phép thu nhỏ nếu cần
          }}
        >
          {userData?.getUser.fullName}
        </span>
        <DownOutlined style={{ fontSize: "12px", color: "#666" }} />
      </div>
    </Dropdown>
  );
}
