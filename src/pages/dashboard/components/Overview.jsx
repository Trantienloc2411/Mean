import { HistoryOutlined, LineChartOutlined, TeamOutlined } from "@ant-design/icons"

import CardDashboard from "../../../components/Card/CardDashboard.jsx" // Assuming this path is correct
import { Flex } from "antd"

export default function Overview(props) {
  const { totalUser, totalTransaction, totalRevenue } = props // Removed pendingBookings
  return (
    <Flex
      gap={40}
      justify="space-between" // This will ensure space is distributed
      style={{
        marginBottom: "20px",
        paddingBottom: "20px",
        width: "100%", // Ensure Flex container takes full width
      }}
    >
      <CardDashboard
        title={"Tổng người dùng"}
        value={totalUser}
        iconName={<TeamOutlined style={{ color: "#8280FF" }} />}
        backgroundColorIcon={"#e5e4ff"}
        colorIcon={"#8280FF"}
        width={"calc((100% - 80px) / 3)"} // Adjusted width
        height={120}
      />

      <CardDashboard
        title={"Tổng giao dịch"}
        value={totalTransaction}
        iconName={<HistoryOutlined style={{ color: "#ff9066" }} />}
        backgroundColorIcon={"#ffded1"}
        colorIcon={"#ff9066"}
        width={"calc((100% - 80px) / 3)"} // Adjusted width
        height={120}
      />

      <CardDashboard
        title={"Tổng doanh thu"}
        value={totalRevenue}
        iconName={<LineChartOutlined style={{ color: "#4ad991" }} />}
        backgroundColorIcon={"#d9f7e8"}
        colorIcon={"#4ad991"}
        width={"calc((100% - 80px) / 3)"} // Adjusted width
        height={120}
      />
    </Flex>
  )
}
