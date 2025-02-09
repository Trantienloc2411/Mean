import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BarChartOutlined,
  CalendarOutlined,
  HomeOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Logo from "../assets/images/logo.png";
import { BsBuildings } from "react-icons/bs";
import HeaderSimple from "../components/layouts/header/HeaderSimple";
import useAppInit from "../hooks/useAppInit";

const { Header, Content } = Layout;

// Danh sách menu items với đường dẫn
const menuItems = [
  { key: "/owner/dashboard", icon: <HomeOutlined />, label: "Tổng quan" },
  { key: "/owner/information", icon: <UserOutlined />, label: "Thông tin" },
  { key: "/owner/rental-location", icon: <BsBuildings />, label: "Địa điểm" },
  { key: "/owner/booking", icon: <CalendarOutlined />, label: "Đặt phòng" },
  { key: "/owner/type-room", icon: <TagOutlined />, label: "Loại phòng" },
  { key: "/owner/policy", icon: <BarChartOutlined />, label: "Chính sách" },
  { key: "/owner/setting", icon: <BarChartOutlined />, label: "Cài đặt" },
];

const OwnerLayout = () => {
  // useAppInit();
  const navigate = useNavigate(); // Để điều hướng khi người dùng click Menu
  const location = useLocation(); // Để lấy path hiện tại

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header với Navbar */}
      <Header
        style={{
          background: "#ffffff",
          padding: "0 16px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <HeaderSimple />
      </Header>
      {/* Content */}
      <Layout
        style={{
          background: "#eef0f2",
          flex: 1,
        }}
      >
        <Content
          style={{
            background: "#fff",
            flex: 1,

            margin: "24px",
            borderRadius: 10,
          }}
        >
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[location.pathname]} // Đặt key dựa trên path hiện tại
            onClick={({ key }) => navigate(key)} // Điều hướng khi click menu
            items={menuItems}
            style={{
              // flex: 1,
              // justifyContent: "center",
              background: "none",
            }}
          />
          <Layout
            style={{
              background: "#fff",
              flex: 1,
              padding: "10px 24px",
            }}
          >
            <Outlet />
          </Layout>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OwnerLayout;
