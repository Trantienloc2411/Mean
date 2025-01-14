import CardDashboard from "../../../components/Card/CardDashboard";
import { Flex } from "antd";
import { FaUserFriends, FaUsers } from "react-icons/fa";

export default function OverviewTransaction() {
  return (
    <Flex gap={30}>
      <CardDashboard
        title="Total Users"
        value="10013213213123"
        iconName={<FaUserFriends />}
      />
      <CardDashboard
        title="Active Users"
        value="50"
        iconName={<FaUsers />}
        backgroundColorIcon="#ffebf4"
        colorIcon="#ff007a"
      />
    </Flex>
  );
}
