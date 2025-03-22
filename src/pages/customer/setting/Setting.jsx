import { Layout, Tabs } from "antd";
import styles from "./Setting.module.scss";
import BankAccount from "./components/BankAccount/BankAccount";
import MeanWallet from "./components/Wallet/MeanWallet";
import { useParams } from "react-router-dom";
import { useGetCustomerDetailByUserIdQuery } from "../../../redux/services/customerApi";
import CustomerInformation from "./components/Information/CustomerInformation";

const { Content } = Layout;

export default function Setting() {
  const { id } = useParams();
  console.log(id);
  const {
    data: customerDetail,
    isLoading: customerLoading,
    refetch,
  } = useGetCustomerDetailByUserIdQuery(id);
  console.log(customerDetail);

  const walletData = {
    availableBalance: "900,000 vnd",
    pendingBalance: "20,000 vnd",
    userName: "Alexa Rawles",
  };

  const transactionData = [
    {
      key: "1",
      transactionCode: "200afkjlafasdf",
      type: "Tiền booking",
      createdAt: "14:30:45 21/12/2023",
      amount: "200,000 vnd",
      status: "Expired",
    },
    {
      key: "2",
      transactionCode: "123123dsfsdf",
      type: "Tiền nạp",
      createdAt: "14:30:45 21/12/2023",
      amount: "200,000 vnd",
      status: "Paused",
    },
    {
      key: "3",
      transactionCode: "200afkjl121eafasdf",
      type: "Tiền nạp",
      createdAt: "14:30:45 21/12/2023",
      amount: "200,000 vnd",
      status: "Active",
    },
    {
      key: "4",
      transactionCode: "4dad200afkjlafasdf",
      type: "Tiền nạp",
      createdAt: "14:30:45 21/12/2023",
      amount: "200,000 vnd",
      status: "Active",
    },
  ];

  // Định nghĩa các tab thông qua mảng items
  const tabItems = [
    {
      key: "information",
      label: "Thông tin tài khoản",
      children: (
        <CustomerInformation
          refetch={refetch}
          customerDetail={customerDetail}
        />
      ),
    },
    {
      key: "bankAccount",
      label: "Tài khoản ngân hàng",
      children: <BankAccount />,
    },
    {
      key: "meanWallet",
      label: "Ví Mean",
      children: (
        <MeanWallet walletData={walletData} transactionData={transactionData} />
      ),
    },
  ];

  return (
    <Layout className={styles.settingsPage}>
      <Content
        style={{
          backgroundColor: "white",
          padding: 20,
          boxShadow: "0.02px 3px 2px #CBCBCBFF",
          borderRadius: 10,
        }}
        className={styles.mainContent}
      >
        <Tabs
          items={tabItems}
          defaultActiveKey="information"
          tabPosition="left"
        />
      </Content>
    </Layout>
  );
}
