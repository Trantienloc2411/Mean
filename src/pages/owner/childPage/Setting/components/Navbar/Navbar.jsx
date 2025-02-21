import { Menu } from "antd";
import styles from "../Navbar/NavBar.module.scss";
import {
  UserOutlined,
  LockOutlined,
  BankOutlined,
  WalletOutlined,
  BookOutlined,
} from "@ant-design/icons";
export default function NavBar(props) {
  const { activeKey, onSelect } = props;

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.title}>Cài đặt</h3>
      <Menu
        mode="vertical"
        selectedKeys={[activeKey]}
        onClick={(e) => onSelect(e.key)}
        className={styles.menu}
        items={[
          {
            key: "accountInfo",
            icon: <UserOutlined />,
            label: "Thông tin tài khoản",
          },
          {
            key: "businessInfo",
            icon: <BookOutlined />,
            label: "Thông tin kinh doanh",
          },
          {
            key: "changePassword",
            icon: <LockOutlined />,
            label: "Đổi mật khẩu",
          },
          {
            key: "bankAccount",
            icon: <BankOutlined />,
            label: "Tài khoản ngân hàng",
          },
          { key: "meanWallet", icon: <WalletOutlined />, label: "Ví Mean" },
        ]}
      />
    </div>
  );
}
