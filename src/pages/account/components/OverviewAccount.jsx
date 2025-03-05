import { Flex } from "antd";
import { FaUserFriends } from "react-icons/fa";
import CardDashboard from "../../../components/Card/CardDashboard";
export default function OverviewAccount({totalUser, countCustomer, countStaff}) {
  return (
    <Flex gap={30} justify="space-between">
      <CardDashboard
        title="Tổng "
        value={totalUser} 
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="30%"
        height={120}
      />
      <CardDashboard
        title="Khách hàng "
        value={countCustomer}
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="30%"
        height={120}
        />
      <CardDashboard
        title="Quản lý"
        value={countStaff}
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
          width="30%"
        height={120}
      />
    </Flex>
  );
}
