import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderSimple from "../components/layouts/header/HeaderSimple";

const { Header, Content } = Layout;

const SimpleLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#eef0f2" }}>
      <Header
        style={{
          position: "fixed",
          top: 0,
          zIndex: 100,
          width: "100%",
          padding: "0 20px",
          backgroundColor: "#fff",
        }}
      >
        <HeaderSimple />
      </Header>
      <Content
        style={{
          marginTop: 50, // Đẩy nội dung xuống dưới header
          padding: "20px",
          background: "#eef0f2",
          flex: 1,
          overflow: "auto", // Hỗ trợ cuộn nếu nội dung dài
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default SimpleLayout;
