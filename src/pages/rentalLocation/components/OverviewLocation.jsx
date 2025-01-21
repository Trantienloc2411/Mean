import { Flex } from "antd";
import { FaUserFriends } from "react-icons/fa";
import CardDashboard from "../../../components/Card/CardDashboard";
export default function OverviewLocation() {
  return (
    <Flex gap={30} justify="start" wrap>
      <CardDashboard
        title="Tổng "
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
      <CardDashboard
        title="Chờ duyệt "
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
      <CardDashboard
        title="Hoạt động"
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
      <CardDashboard
        title="Tạm Khóa"
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
      <CardDashboard
        title="Ngưng hoạt động"
        value="50"
        iconName={<FaUserFriends />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
      />
    </Flex>
  );
}
