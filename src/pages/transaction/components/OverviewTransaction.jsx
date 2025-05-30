import { BiMoneyWithdraw } from "react-icons/bi";
import CardDashboard from "../../../components/Card/CardDashboard";
import { Flex } from "antd";
import { FaMoneyBill } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

export default function OverviewTransaction({ transactionOverviewData }) {
  console.log(transactionOverviewData);

  return (
    <Flex gap={30} justify="space-between" wrap>
      <CardDashboard
        backgroundColorIcon="#e0f7fa"
        colorIcon="#00acc1"
        title="Tổng giao dịch"
        value={transactionOverviewData.totalTransaction}
        iconName={<GrTransaction />}
        width={"20%"}
        height={120}
      />
      {/* <CardDashboard
        backgroundColorIcon="#fff3cd"
        colorIcon="#ffc107"
        title="Thanh toán Momo"
        value={transactionOverviewData.momoPaymentCount}
        iconName={<BiMoneyWithdraw />}
        width={"15%"}
        height={120}
      /> */}
      <CardDashboard
        backgroundColorIcon="#e8f5e9"
        colorIcon="#43a047"
        title="Hoàn thành"
        value={transactionOverviewData.completedCount}
        iconName={<FaMoneyBill />}
        width={"20%"}
        height={120}
      />
      <CardDashboard
        backgroundColorIcon="#e3f2fd"
        colorIcon="#2196f3"
        title="Đang xử lý"
        value={transactionOverviewData.pendingCount}
        iconName={<GiPayMoney />}
        width={"20%"}
        height={120}
      />
      <CardDashboard
        backgroundColorIcon="#ffebee"
        colorIcon="#d32f2f"
        title="Thất bại"
        value={transactionOverviewData.failedCount}
        iconName={<MdCancel />}
        width={"20%"}
        height={120}
      />
    </Flex>
  );
}
