import { Menu } from "antd";
import styles from "../Navbar/NavBar.module.scss";
import { BankOutlined, WalletOutlined } from "@ant-design/icons";

export default function NavBar(props) {
  const { activeKey, onSelect } = props;

  const menuItems = [
    {
      key: "bankAccount",
      icon: <BankOutlined />,
      label: "Tài khoản ngân hàng",
    },
    {
      key: "meanWallet",
      icon: <WalletOutlined />,
      label: "Ví Mean",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.title}>Cài đặt</h3>
      <Menu
        mode="vertical"
        selectedKeys={[activeKey]}
        onClick={(e) => onSelect(e.key)}
        className={styles.menu}
        items={menuItems}
      />
    </div>
  );
}
