import { Flex } from "antd";
import { FaUserFriends } from "react-icons/fa";
import CardDashboard from "../../../components/Card/CardDashboard";
export default function OverviewAccount() {
  return (
    <Flex gap={30} justify="start">
      <CardDashboard
        title="Tổng "
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
      <CardDashboard
        title="Khách hàng "
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
      <CardDashboard
        title="Quản lý"
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
    </Flex>
  );
}
