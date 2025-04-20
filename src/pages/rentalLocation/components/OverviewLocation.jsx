import { Flex } from "antd";
import { FaUserFriends } from "react-icons/fa";
import CardDashboard from "../../../components/Card/CardDashboard";
import styles from "../RentalLocation.module.scss";

export default function OverviewLocation(props) {
  const { data } = props;
  return (
    <div className={styles.overviewContainer}>
      <Flex gap={24} wrap style={{ justifyContent: "start" }}>
        <CardDashboard
          title="Tổng số địa điểm"
          value={
            data.total > 1000
              ? `${(data.total / 1000).toFixed(1)}K`
              : data.total
          }
          iconName={<FaUserFriends />}
          backgroundColorIcon="#d0cfff"
          colorIcon="#8280FF"
          height={120}
          width={280}
        />
        <CardDashboard
          title="Chờ duyệt"
          value={
            data.pending > 1000
              ? `${(data.pending / 1000).toFixed(1)}K`
              : data.pending
          }
          iconName={<FaUserFriends />}
          backgroundColorIcon="#fff2d0"
          colorIcon="#ffb020"
          height={120}
          width={280}
        />
        <CardDashboard
          title="Hoạt động"
          value={
            data.active > 1000
              ? `${(data.active / 1000).toFixed(1)}K`
              : data.active
          }
          iconName={<FaUserFriends />}
          backgroundColorIcon="#dcfce7"
          colorIcon="#14b8a6"
          height={120}
          width={280}
        />
        <CardDashboard
          title="Cần cập nhật"
          value={
            data.needUpdate > 1000
              ? `${(data.needUpdate / 1000).toFixed(1)}K`
              : data.needUpdate
          }
          iconName={<FaUserFriends />}
          backgroundColorIcon="#fee2e2"
          colorIcon="#ef4444"
          height={120}
          width={280}
        />
        <CardDashboard
          title="Ngưng hoạt động"
          value={
            data.pause > 1000
              ? `${(data.pause / 1000).toFixed(1)}K`
              : data.pause
          }
          iconName={<FaUserFriends />}
          backgroundColorIcon="#fef3c7"
          colorIcon="#f59e0b"
          height={120}
          width={280}
        />
      </Flex>
    </div>
  );
}
