import {
  HistoryOutlined,
  LineChartOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import CardDashboard from "../../../components/Card/CardDashboard.jsx";
import { Flex } from "antd";
export default function Overview(props) {
  // eslint-disable-next-line react/prop-types
  const { totalUser, totalTransaction, totalRevenue, totalProfit } = props;
  return (
    <Flex gap={40} wrap justify="flex-start">
      <CardDashboard
        title={"Tổng người dùng"}
        value={totalUser}
        iconName={<TeamOutlined />}
        backgroundColorIcon={"#e5e4ff"}
        colorIcon={"#8280FF"}
      ></CardDashboard>

      <CardDashboard
        title={"Tổng giao dịch"}
        value={totalTransaction}
        iconName={<HistoryOutlined style={{ color: "#ff9066" }} />}
        backgroundColorIcon={"#ffded1"}
        colorIcon={"#ff9066"}
      ></CardDashboard>

      <CardDashboard
        title={"Tổng doanh thu"}
        value={totalRevenue}
        iconName={<LineChartOutlined style={{ color: "#4ad991" }} />}
        backgroundColorIcon={"#d9f7e8"}
        colorIcon={"#4ad991"}
      ></CardDashboard>

      <CardDashboard
        title={"Tổng lợi nhuận"}
        value={totalProfit}
        iconName={<RiseOutlined style={{ color: "#FEC53D" }} />}
        backgroundColorIcon={"#fff3d6"}
        colorIcon={"#FEC53D"}
      ></CardDashboard>
    </Flex>
  );
}
