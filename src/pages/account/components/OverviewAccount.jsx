import { Flex } from "antd";
import styles from "../Account.module.scss";
import { Card } from "antd";
import { FaUserFriends } from "react-icons/fa";
export default function OverviewAccount() {
  return (
    <Flex gap={80} justify="start">
      <Card style={{ height: 130, width: 260 }}>
        <Flex align="start" justify="space-between" gap={50}>
          <Flex vertical>
            <p className={styles.cardTitle}>Tổng </p>
            <p className={styles.cardNumber}>100</p>
          </Flex>
          <div
            className={styles.iconBg}
            style={{
              background: " #d0cfff",
            }}
          >
            <FaUserFriends style={{ fontSize: 30, color: "#8280FF" }} />
          </div>
        </Flex>
      </Card>
      <Card style={{ height: 130, width: 260 }}>
        <Flex align="start" justify="space-between" gap={50}>
          <Flex vertical>
            <p className={styles.cardTitle}>Khách hàng </p>
            <p className={styles.cardNumber}>88</p>
          </Flex>
          <div
            className={styles.iconBg}
            style={{
              background: " #d0cfff",
            }}
          >
            <FaUserFriends style={{ fontSize: 30, color: "#8280FF" }} />
          </div>
        </Flex>
      </Card>
      <Card style={{ height: 130, width: 260 }}>
        <Flex align="start" justify="space-between" gap={50}>
          <Flex vertical>
            <p className={styles.cardTitle}>Đối tác </p>
            <p className={styles.cardNumber}>12</p>
          </Flex>
          <div
            className={styles.iconBg}
            style={{
              background: " #d0cfff",
            }}
          >
            <FaUserFriends style={{ fontSize: 30, color: "#8280FF" }} />
          </div>
        </Flex>
      </Card>
    </Flex>
  );
}
