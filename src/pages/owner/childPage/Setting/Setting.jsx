import { Layout, Skeleton, Tabs } from "antd";
import styles from "../Setting/Setting.module.scss";
import { useMemo } from "react";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi";
import { useParams } from "react-router-dom";
import Information from "./components/Information/Infomation";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import BankAccount from "./components/BankAccount/BankAccount";
import MeanWallet from "./components/Wallet/MeanWallet";
import BusinessInformation from "./components/BusinessInformation/BusinessInformation";

const { Content } = Layout;

export default function Setting() {
  const { id } = useParams();
  const {
    data: ownerDetail,
    isLoading: ownerLoading,
    refetch,
  } = useGetOwnerDetailByUserIdQuery(id);

  const userInfo = useMemo(() => {
    if (!ownerDetail) return null;
    const userData = ownerDetail.userId;
    return {
      ownerId: ownerDetail.id,
      userId: userData?.id,
      fullName: userData?.fullName,
      email: userData?.email,
      phone: userData?.phone,
      avatar:
        userData?.avatarUrl?.[0] ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT_BjEyf_LEpcvb225JX2qFCJcLz5-0RXLg&s",
      isVerifiedEmail: userData?.isVerifiedEmail,
      isActive: userData?.isActive,
      isApproved: ownerDetail?.isApproved,
    };
  }, [ownerDetail]);

  const businessInfo = useMemo(() => {
    if (!ownerDetail) return null;
    return {
      ownerId: ownerDetail.id,
      companyName: ownerDetail?.businessInformationId?.companyName,
      companyAddress: ownerDetail?.businessInformationId?.companyAddress,
      taxID: ownerDetail?.businessInformationId?.taxID,
    };
  }, [ownerDetail]);

  if (ownerLoading || !userInfo) {
    return (
      <div
        className="loadingContainer"
        style={{ textAlign: "center", padding: "20px" }}
      >
        <Skeleton />
      </div>
    );
  }

  const tabItems = [
    {
      key: "accountInfo",
      label: "Thông tin tài khoản",
      children: <Information refetch={refetch} userData={userInfo} />,
    },
    {
      key: "businessInfo",
      label: "Thông tin doanh nghiệp",
      children: (
        <BusinessInformation refetch={refetch} businessData={businessInfo} />
      ),
    },
    {
      key: "changePassword",
      label: "Đổi mật khẩu",
      children: <ChangePassword />,
    },
    {
      key: "bankAccount",
      label: "Tài khoản ngân hàng",
      children: <BankAccount />,
    },
    {
      key: "meanWallet",
      label: "Ví",
      children: (
        <MeanWallet
          walletData={{
            availableBalance: "900,000 vnd",
            pendingBalance: "20,000 vnd",
            userName: "Alexa Rawles",
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Content
        style={{
          padding: 20,
        }}
      >
        <Tabs
          tabPosition="left"
          defaultActiveKey="accountInfo"
          items={tabItems}
        />
      </Content>
    </div>
  );
}
