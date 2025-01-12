import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import {

  BarChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
  BellOutlined,
  NodeCollapseOutlined,
  DownOutlined,
  LogoutOutlined,
  WalletOutlined
} from "@ant-design/icons";
import {
  Layout, Menu, Input, Image, Button,
  Modal, Badge, Dropdown
} from "antd";

const { Header, Content, Footer, Sider } = Layout;

// Danh sách menu items với đường dẫn
const menuItems = [
  { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/account", icon: <UserOutlined />, label: "Account" },
  { key: "/admin/counpon", icon: <FileTextOutlined />, label: "Counpon" },
  { key: "/admin/booking", icon: <CalendarOutlined />, label: "Booking" },
  {
    key: "/admin/transaction",
    icon: <BarChartOutlined />,
    label: "Transaction",
  },
  { key: "/admin/rental", icon: <ShopOutlined />, label: "Rental Location" },
  { key: "/admin/policy", icon: <SettingOutlined />, label: "Policy" },
];


const AdminLayout = () => {
  const navigate = useNavigate(); // Để điều hướng khi người dùng click Menu
  const location = useLocation(); // Để lấy path hiện tại
  const [collapsed, setCollapsed] = useState(false); // Trạng thái thu nhỏ/mở rộng của sidebar


  const [isModalOpen, setIsModalOpen] = useState(false);

  const notifications = [
    {
      title: "Prepare for Your Adventure!",
      message: "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      date: "2/2/2023"
    },
    {
      title: "Thank You for Your Experience!",
      message: "ther users have provided positive reviews. Share your experience and earn reward points!",
      date: "2/2/2023"
    },
    {
      title: "Weather Forecast for Your Destination",
      message: "Don't forget to check the weather forecast for better travel preparation. Happy exploring!",
      date: "10/1/2023"
    }
  ];

  const items = [
    {
      key: '1',
      label: 'Hồ sơ',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: 'Ví Mean',
      icon: <WalletOutlined />,
    },
    {
      key: '3',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];


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
            backgroundColor: "white"
          }}
        >
          <div className="header-component"
            style={
              {
                padding: 28,
                justifyContent: 'space-between',
                alignItems: 'center',
                display: 'flex',
                height: 100
              }
            }
          >
            <Input size="large" placeholder="Tìm kiếm địa điểm cho thuê" prefix={<SearchOutlined />} style={{ maxWidth: 400 }}></Input>
            <div
              className="userOption"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '15px',
                padding: '0 20px'
              }}
            >
              <Badge count={4}>
                <Button
                  size="large"
                  type="text"
                  icon={
                    <BellOutlined
                      style={{
                        fontSize: 20,
                        color: '#666'
                      }}
                    />
                  }
                  onClick={() => setIsModalOpen(true)}
                />
              </Badge>

              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                trigger={['click']}
                arrow
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: '8px'  // Consistent spacing between elements
                }}>
                  <div style={{
                    width: 35,
                    height: 35,
                    borderRadius: '50%',
                    overflow: 'hidden'  // Ensures the image stays within the circle
                  }}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      preview={false}
                      src='https://s3-alpha-sig.figma.com/img/4920/fcde/8447f632360829a3d6cf6bd47b299bab?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YRDul0LX5qH0qTJ~PYdbbybEnteiXecE7RrpyaJYW3rUifKmkLp4N2Z7LAVMSNvoNY5KXcmwhIqm5UWzcxWGg1waRqqC2uFYrx0jg4WoplYgOuHs9zytpNR7vXQvL-bjCmjuvVzERd36~7DsRQEsIosfV4kIoJkeosNYeCrHNIiikZCN8OKKWofulOhhq5o5klATU0sg-mX409oyDa3WtMkK2Xa7TLmSldHfhx60rkgQ143JPs5EFMTxYkG1kOrrtbQFh6MWQuqiYceftCcpNAo2bTYdrAni5P7IhcA-eSbopVix6NSUahpqvXlGnm7koWuaK3mkWk41Kpt-X53LNQ__'
                    />
                  </div>
                  <span style={{ color: '#333' }}>Nguyễn Lê Vỹ Kha</span>
                  <DownOutlined style={{ fontSize: '12px', color: '#666' }} />
                </div>
              </Dropdown>
            </div>

            <Modal
              title="Notifications"
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
              width={500}
            >
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    borderBottom: index !== notifications.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0 }}>{notification.title}</h4>
                    <span style={{ color: '#999' }}>{notification.date}</span>
                  </div>
                  <p style={{ margin: '10px 0 0 0', color: '#666' }}>{notification.message}</p>
                </div>
              ))}
            </Modal>
          </div>
        </Header>

        <Content
          style={{
            background: "#eef0f2",
            //flex: 1, // Chiếm không gian còn lại giữa Header và Footer
            //overflow: "initial",
            // padding: "24px",
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
