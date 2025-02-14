import { Menu } from "antd";
import styles from "../Navbar/NavBar.module.scss";
import { UserOutlined, LockOutlined, BankOutlined, WalletOutlined } from '@ant-design/icons';
export default function NavBar(props) {

    const {activeKey,
        onSelect
    } = props;

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.title}>Cài đặt</h3>
      <Menu
        mode="vertical"
        selectedKeys={[activeKey]}
        onClick={(e) => onSelect(e.key)}
        className={styles.menu}
      >
        <Menu.Item key="bankAccount" icon={<BankOutlined />}>
          Tài khoản ngân hàng
        </Menu.Item>
        <Menu.Item key="meanWallet" icon={<WalletOutlined />}>
          Ví Mean
        </Menu.Item>
      </Menu>
    </div>
  );
}
