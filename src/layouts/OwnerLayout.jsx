import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  BarChartOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Logo from "../assets/images/logo.png";
import { BsBuildings } from "react-icons/bs";
import HeaderSimple from "../components/layouts/header/HeaderSimple";
import { MdChatBubbleOutline, MdOutlinePolicy } from "react-icons/md";

const { Header, Content } = Layout;

const OwnerLayout = () => {
  // useAppInit();
  const { id } = useParams(); // Lấy ID từ URL
  const userRole = localStorage.getItem("user_role"); // "admin" hoặc "owner"

  console.log("id", id);

  const menuItems = [
    {
      key: `/owner/${id}/information`,
      icon: <UserOutlined />,
      label: "Thông tin",
    },

    {
      key: `/owner/${id}/rental-location`,
      icon: <BsBuildings />,
      label: "Địa điểm",
    },
    {
      key: `/owner/${id}/booking`,
      icon: <CalendarOutlined />,
      label: "Đặt phòng",
    },
    {
      key: `/owner/${id}/type-room`,
      icon: <TagOutlined />,
      label: "Loại phòng",
    },
    {
      key: `/owner/${id}/policy`,
      icon: <MdOutlinePolicy />,
      label: "Chính sách",
    },
    {
      key: `/owner/${id}/setting`,
      icon: <BarChartOutlined />,
      label: "Cài đặt",
    },
  ];
  const menuItemsOwner = [
    {
      key: `/owner/${id}/information`,
      icon: <UserOutlined />,
      label: "Thông tin",
    },
    {
      key: `/owner/${id}/dashboard`,
      icon: <HomeOutlined />,
      label: "Tổng quan",
    },
    {
      key: `/owner/${id}/revenue`,
      icon: <DollarCircleOutlined />,
      label: "Doanh thu",
    },
    {
      key: `/owner/${id}/rental-location`,
      icon: <BsBuildings />,
      label: "Địa điểm",
    },
    {
      key: `/owner/${id}/booking`,
      icon: <CalendarOutlined />,
      label: "Đặt phòng",
    },
    {
      key: `/owner/${id}/type-room`,
      icon: <TagOutlined />,
      label: "Loại phòng",
    },
    {
      key: `/owner/${id}/policy`,
      icon: <MdOutlinePolicy />,
      label: "Chính sách",
    },
    {
      key: `/owner/${id}/setting`,
      icon: <BarChartOutlined />,
      label: "Cài đặt",
    },
    {
      key: `/owner/${id}/chat`,
      icon: <MdChatBubbleOutline />,
      label: "Giao tiếp",
    },
  ];
  const navigate = useNavigate(); // Để điều hướng khi người dùng click Menu
  const location = useLocation(); // Để lấy path hiện tại
  const menuItemsToRender = userRole === `"Owner"` ? menuItemsOwner : menuItems;

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
            items={menuItemsToRender}
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
