import { Flex } from "antd";
import { FaUserFriends } from "react-icons/fa";
import CardDashboard from "../../../components/Card/CardDashboard";
export default function OverviewAccount({
  totalUser,
  countCustomer,
  countStaff,
}) {
  return (
    <Flex gap={30} justify="start">
      <CardDashboard
        title="Tổng "
        value={
          totalUser > 1000 ? `${(totalUser / 1000).toFixed(1)}K` : totalUser
        }
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="25%"
        height={120}
      />
      <CardDashboard
        title="Khách hàng "
        value={
          countCustomer > 1000
            ? `${(countCustomer / 1000).toFixed(1)}K`
            : countCustomer
        }
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="25%"
        height={120}
      />
      <CardDashboard
        title="Quản lý"
        value={
          countStaff > 1000 ? `${(countStaff / 1000).toFixed(1)}K` : countStaff
        }
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="25%"
        height={120}
      />
    </Flex>
  );
}
