import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { Image } from "antd";
import { Input } from "antd";
import { Badge, Button } from "antd";
import { Modal } from "antd";
import { useState } from "react";

export default function HeaderAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notifications = [
    {
      title: "Prepare for Your Adventure!",
      message:
        "It's time to complete your travel preparations. Check the list and ensure everything is ready!",
      date: "2/2/2023",
    },
    {
      title: "Thank You for Your Experience!",
      message:
        "ther users have provided positive reviews. Share your experience and earn reward points!",
      date: "2/2/2023",
    },
    {
      title: "Weather Forecast for Your Destination",
      message:
        "Don't forget to check the weather forecast for better travel preparation. Happy exploring!",
      date: "10/1/2023",
    },
  ];

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
    },
  ];

  return (
    <div>
      <div
        className="header-component"
        style={{
          // padding: 28,
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          // height: 100,
        }}
      >
        <Input
          size="large"
          placeholder="Tìm kiếm địa điểm cho thuê"
          prefix={<SearchOutlined />}
          style={{ maxWidth: 400 }}
        ></Input>
        <div
          className="userOption"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "15px",
            // padding: "0 20px",
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
                    color: "#666",
                  }}
                />
              }
              onClick={() => setIsModalOpen(true)}
            />
          </Badge>

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
                gap: "8px", // Consistent spacing between elements
              }}
            >
              <div
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: "50%",
                  overflow: "hidden", // Ensures the image stays within the circle
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
                padding: "15px",
                borderBottom:
                  index !== notifications.length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 style={{ margin: 0 }}>{notification.title}</h4>
                <span style={{ color: "#999" }}>{notification.date}</span>
              </div>
              <p style={{ margin: "10px 0 0 0", color: "#666" }}>
                {notification.message}
              </p>
            </div>
          ))}
        </Modal>
      </div>
    </div>
  );
}
