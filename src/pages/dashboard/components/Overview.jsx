import {
  HistoryOutlined,
  LineChartOutlined,
  RiseOutlined,
  TeamOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import CardDashboard from "../../../components/Card/CardDashboard.jsx";
import { Flex } from "antd";
export default function Overview(props) {
  // eslint-disable-next-line react/prop-types
  const { totalUser, totalTransaction, totalRevenue, countViewer } = props;
  return (
    <Flex
      gap={40}
      justify="space-between"
      style={{ marginBottom: "20px", paddingBottom: "20px" }}
    >
      <CardDashboard
        title={"Tổng người dùng"}
        value={
          totalUser > 1000 ? `${(totalUser / 1000).toFixed(1)}K` : totalUser
        }
        iconName={<TeamOutlined />}
        backgroundColorIcon={"#e5e4ff"}
        colorIcon={"#8280FF"}
        width={20}
        height={"120"}
      ></CardDashboard>

      <CardDashboard
        title={"Tổng giao dịch"}
        value={
          totalTransaction > 1000
            ? `${(totalTransaction / 1000).toFixed(1)}K`
            : totalTransaction
        }
        iconName={<HistoryOutlined style={{ color: "#ff9066" }} />}
        backgroundColorIcon={"#ffded1"}
        colorIcon={"#ff9066"}
        width={"20%"}
        height={120}
      ></CardDashboard>

      <CardDashboard
        title={"Tổng doanh thu"}
        value={
          totalRevenue > 1000
            ? `${(totalRevenue / 1000).toFixed(1)}K`
            : totalRevenue
        }
        iconName={<LineChartOutlined style={{ color: "#4ad991" }} />}
        backgroundColorIcon={"#d9f7e8"}
        colorIcon={"#4ad991"}
        width={"20%"}
        height={120}
      ></CardDashboard>

      <CardDashboard
        title={"Lượt truy cập vào hệ thống"}
        value={
          countViewer > 1000
            ? `${(countViewer / 1000).toFixed(1)}K`
            : countViewer
        }
        iconName={<EyeOutlined style={{ color: "#FEC53D" }} />}
        backgroundColorIcon={"#fff3d6"}
        colorIcon={"#FEC53D"}
        width={"20%"}
        height={120}
      ></CardDashboard>
    </Flex>
  );
}
