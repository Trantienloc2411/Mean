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
import { useLogoutMutation } from "../../../redux/services/authApi";

export default function Avatar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    // try {
    // await logout().unwrap();
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
            width: 35,
            height: 35,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            preview={false}
            src="https://s3-alpha-sig.figma.com/img/4920/fcde/8447f632360829a3d6cf6bd47b299bab?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YRDul0LX5qH0qTJ~PYdbbybEnteiXecE7RrpyaJYW3rUifKmkLp4N2Z7LAVMSNvoNY5KXcmwhIqm5UWzcxWGg1waRqqC2uFYrx0jg4WoplYgOuHs9zytpNR7vXQvL-bjCmjuvVzERd36~7DsRQEsIosfV4kIoJkeosNYeCrHNIiikZCN8OKKWofulOhhq5o5klATU0sg-mX409oyDa3WtMkK2Xa7TLmSldHfhx60rkgQ143JPs5EFMTxYkG1kOrrtbQFh6MWQuqiYceftCcpNAo2bTYdrAni5P7IhcA-eSbopVix6NSUahpqvXlGnm7koWuaK3mkWk41Kpt-X53LNQ__"
          />
        </div>
        <span style={{ color: "#333" }}>Nguyễn Lê Vỹ Kha</span>
        <DownOutlined style={{ fontSize: "12px", color: "#666" }} />
      </div>
    </Dropdown>
  );
}
