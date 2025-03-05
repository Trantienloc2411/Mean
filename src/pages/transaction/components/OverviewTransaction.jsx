import { BiMoneyWithdraw } from "react-icons/bi";
import CardDashboard from "../../../components/Card/CardDashboard";
import { Flex } from "antd";
import { FaMoneyBill } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

export default function OverviewTransaction() {
  return (
    <Flex gap={30} justify="space-between" wrap>
      <CardDashboard
        backgroundColorIcon="#e0f7fa"
        colorIcon="#00acc1"
        title="Tổng giao dịch"
        value="50"
        iconName={<GrTransaction />}
        width={"15%"}
        height={120}
      />
      <CardDashboard
        backgroundColorIcon="#fff3cd"
        colorIcon="#ffc107"
        title="Tổng cọc"
        value="50"
        iconName={<BiMoneyWithdraw />}
        width={"15%"}
        height={120}
      />
      <CardDashboard
        backgroundColorIcon="#e8f5e9"
        colorIcon="#43a047"
        title="Tổng trả hoàn toàn"
        value="50"
        iconName={<FaMoneyBill />}
        width={"15%"}
        height={120}
      />
      <CardDashboard
        backgroundColorIcon="#e3f2fd"
        colorIcon="#2196f3"
        title="Tổng hoàn tiền"
        value="50"
        iconName={<GiPayMoney />}
        width={"15%"}
        height={120}
      />
      <CardDashboard
        backgroundColorIcon="#ffebee"
        colorIcon="#d32f2f"
        title="Tổng Hủy"
        value="50"
        iconName={<MdCancel />}
        width={"15%"}
        height={120}
      />
    </Flex>
  );
}
