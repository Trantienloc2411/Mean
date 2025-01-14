import {
  HistoryOutlined,
  LineChartOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

import CardDashboard from "../../../components/Card/CardDashboard.jsx";
export default function Overview(props) {
  const {
    totalUser,
    totalTransaction,
    totalRevenue,
    totalProfit
  } = props;
  return (
    <div>
      <div className="card-list">
        <CardDashboard
          title={"Tổng người dùng"}
          value={totalUser}
          iconName={<TeamOutlined />}
          backgroundColorIcon={"#e5e4ff"}
          colorIcon={"#8280FF"}
          width='400'
          height='150'
        ></CardDashboard>

        <CardDashboard
          title={"Tổng giao dịch"}
          value={totalTransaction}
          iconName={<HistoryOutlined style={{ color: "#ff9066" }} />}
          backgroundColorIcon={"#ffded1"}
          colorIcon={"#ff9066"}
          width='400'
          height='150'
        ></CardDashboard>

        <CardDashboard
          title={"Tổng doanh thu"}
          value={totalRevenue}
          iconName={<LineChartOutlined style={{ color: "#4ad991" }} />}
          backgroundColorIcon={"#d9f7e8"}
          colorIcon={"#4ad991"}
          width='400'
          height='150'
        ></CardDashboard>

        <CardDashboard
          title={"Tổng lợi nhuận"}
          value={totalProfit}
          iconName={<RiseOutlined style={{ color: "#FEC53D" }} />}
          backgroundColorIcon={"#fff3d6"}
          colorIcon={"#FEC53D"}
          width='400'
          height='150'
        ></CardDashboard>
      </div>
    </div>
  );
}
