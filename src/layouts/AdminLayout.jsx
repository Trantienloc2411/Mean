import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BarChartOutlined,
  CalendarOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Logo from "../assets/images/logo.png";
import { BsBuildings } from "react-icons/bs";
const { Header, Content, Sider } = Layout;

// Danh sách menu items với đường dẫn
const menuItems = [
  { key: "/admin/dashboard", icon: <HomeOutlined />, label: "Trang quản lý" },
  { key: "/admin/account", icon: <UserOutlined />, label: "Tài khoản" },
  { key: "/admin/rental", icon: <BsBuildings />, label: "Địa điểm cho thuê" },

  { key: "/admin/booking", icon: <CalendarOutlined />, label: "Đặt phòng" },
  { key: "/admin/counpon", icon: <TagOutlined />, label: "Mã giảm giá" },
  {
    key: "/admin/transaction",
    icon: <BarChartOutlined />,
    label: "Giao dịch",
  },
  { key: "/admin/report", icon: <InfoCircleOutlined />, label: "Báo cáo" },
  { key: "/admin/policy", icon: <SettingOutlined />, label: "Chính sách" },
];

const AdminLayout = () => {
  const navigate = useNavigate(); // Để điều hướng khi người dùng click Menu
  const location = useLocation(); // Để lấy path hiện tại
  const [collapsed, setCollapsed] = useState(false); // Trạng thái thu nhỏ/mở rộng của sidebar

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed} // Cập nhật trạng thái khi thu nhỏ/mở rộng
        trigger={
          <div style={{ textAlign: "center", background: "#fff" }}>
            {collapsed ? (
              <RightOutlined style={{ fontSize: "16px", color: "#333333" }} />
            ) : (
              <LeftOutlined style={{ fontSize: "16px", color: "#333333" }} />
            )}
          </div>
        }
        style={{
          background: "#ffffff",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          scrollbarWidth: "thin",
        }}
      >
        <div
          className="logo"
          style={{
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
          {!collapsed && (
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
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]} // Đặt key dựa trên path hiện tại
          onClick={({ key }) => navigate(key)} // Điều hướng khi click menu
          items={menuItems}
        />
      </Sider>
      <Layout
        style={{
          marginInlineStart: collapsed ? 80 : 200,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          style={{
            padding: 0,
          }}
        >
          Header
        </Header>

        <Content
          style={{
            background: "#eef0f2",
            flex: 1, // Chiếm không gian còn lại giữa Header và Footer
            overflow: "initial",
            padding: "24px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
