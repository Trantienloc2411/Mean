import {
  HistoryOutlined,
  LineChartOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

import CardModify from "../../../components/Card/Card.jsx";
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
        <CardModify
          title={"Tổng người dùng"}
          value={totalUser}
          iconName={<TeamOutlined />}
          backgroundColorIcon={"#e5e4ff"}
          colorIcon={"#8280FF"}
        ></CardModify>

        <CardModify
          title={"Tổng giao dịch"}
          value={totalTransaction}
          iconName={<HistoryOutlined style={{ color: "#ff9066" }} />}
          backgroundColorIcon={"#ffded1"}
          colorIcon={"#ff9066"}
        ></CardModify>

        <CardModify
          title={"Tổng doanh thu"}
          value={totalRevenue}
          iconName={<LineChartOutlined style={{ color: "#4ad991" }} />}
          backgroundColorIcon={"#d9f7e8"}
          colorIcon={"#4ad991"}
        ></CardModify>
        
        <CardModify
          title={"Tổng lợi nhuận"}
          value={totalProfit}
          iconName={<RiseOutlined style={{ color: "#FEC53D" }} />}
          backgroundColorIcon={"#fff3d6"}
          colorIcon={"#FEC53D"}
        ></CardModify>        
      </div>
    </div>
  );
}
