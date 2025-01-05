import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  DashboardFilled,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

const { Header, Content, Footer, Sider } = Layout;

// Danh sách menu items với đường dẫn
const menuItems = [
  { key: "/dashboard", icon: <DashboardFilled />, label: "Trang quản lý" },
  { key: "/accounts", icon: <TeamOutlined />, label: "Tài khoản" },
  {
    key: "/rental-location",
    icon: <UploadOutlined />,
    label: "Địa điểm cho thuê",
  },
  { key: "/booking", icon: <BarChartOutlined />, label: "Đặt phòng" },
  { key: "/coupon", icon: <BarChartOutlined />, label: "Mã giảm giá" },
  { key: "/transaction", icon: <BarChartOutlined />, label: "Giao dịch" },
  { key: "/report", icon: <BarChartOutlined />, label: "Báo cáo" },
  { key: "/policy", icon: <AppstoreOutlined />, label: "Chính sách" },
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
          className="demo-logo-vertical"
          style={{
            height: 32,
            margin: 16,
            background: "rgba(0, 0, 0, 0.1)",
          }}
        />
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]} // Đặt key dựa trên path hiện tại
          onClick={({ key }) => navigate(key)} // Điều hướng khi click menu
          items={menuItems} // Menu items
        />
      </Sider>
      <Layout
        style={{
          marginInlineStart: collapsed ? 80 : 200, // Điều chỉnh layout khi sidebar thu nhỏ/mở rộng
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
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Copyright © Mean 2025
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
