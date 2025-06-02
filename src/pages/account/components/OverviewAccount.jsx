import { Flex } from "antd";
import { FaUser, FaUserFriends, FaUserTie, FaUsers } from "react-icons/fa";
import CardDashboard from "../../../components/Card/CardDashboard";

export default function OverviewAccount({
  totalUser,
  countCustomer,
  countAdmin,
  countOwner,
}) {
  return (
    <Flex gap={30} justify="start" wrap="wrap">
      <CardDashboard
        title="Tổng tài khoản"
        value={
          totalUser > 1000 ? `${(totalUser / 1000).toFixed(1)}K` : totalUser
        }
        iconName={<FaUsers />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="25%"
        height={120}
      />
      <CardDashboard
        title="Khách hàng"
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
        title="Chủ cho thuê"
        value={
          countAdmin > 1000 ? `${(countAdmin / 1000).toFixed(1)}K` : countAdmin
        }
        iconName={<FaUser />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="25%"
        height={120}
      />
      <CardDashboard
        title="Quản trị viên"
        value={
          countOwner > 1000 ? `${(countOwner / 1000).toFixed(1)}K` : countOwner
        }
        iconName={<FaUserTie />}
        backgroundColorIcon="#d0cfff"
        colorIcon="#8280FF"
        width="25%"
        height={120}
      />
    </Flex>
  );
}
