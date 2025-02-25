import { Layout, Skeleton } from "antd";
import styles from "../Setting/Setting.module.scss";
import NavBar from "./components/Navbar/Navbar";
import { useState, useEffect } from "react";
import Information from "./components/Information/Infomation";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import BankAccount from "./components/BankAccount/BankAccount";
import MeanWallet from "./components/Wallet/MeanWallet";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi";
import { useParams } from "react-router-dom";
import BusinessInformation from "./components/BusinessInformation/BusinessInformation";

const { Content } = Layout;

export default function Setting() {
  const [activeComponent, setActiveComponent] = useState("accountInfo");
  const { id } = useParams();
  const {
    data: ownerDetail,
    isLoading: ownerLoading,
    refetch,
  } = useGetOwnerDetailByUserIdQuery(id);

  const [userInfo, setUserInfo] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  console.log(ownerDetail);

  useEffect(() => {
    if (ownerDetail) {
      const userData = ownerDetail?.userId;
      setUserInfo({
        ownerId: ownerDetail?.id,
        userId: userData?.id,
        isApproved: ownerDetail?.isApproved,
        note: ownerDetail?.note,
        fullName: userData?.fullName,
        doB: userData?.doB,
        email: userData?.email,
        phone: userData?.phone,
        avatar:
          userData?.avatarUrl?.[0] ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT_BjEyf_LEpcvb225JX2qFCJcLz5-0RXLg&s",
        isActive: userData?.isActive,
        messageIsActive: userData?.isActive
          ? "Tài khoản đang hoạt thành công "
          : "Tài khoản đang bị khóa",
        isVerifiedEmail: userData?.isVerifiedEmail,
        isVerify: userData?.isVerifiedEmail,
        messageIsVerify: userData?.isVerifiedEmail
          ? "Đã xác thực "
          : "Số điện thoại/Email chưa xác thực",
      });
      setBusinessInfo({
        businessLicensesFile:
          ownerDetail?.businessInformationId.businessLicensesFile,
        citizenIdentification:
          ownerDetail?.businessInformationId.citizenIdentification,
        companyAddress: ownerDetail?.businessInformationId.companyAddress,
        companyName: ownerDetail?.businessInformationId.companyName,
        id: ownerDetail?.businessInformationId.id,
        representativeName:
          ownerDetail?.businessInformationId.representativeName,
        taxID: ownerDetail?.businessInformationId.taxID,
        updatedAt: ownerDetail?.businessInformationId.updatedAt,
        createdAt: ownerDetail?.businessInformationId.createdAt,
      });
    }
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

  const renderComponent = () => {
    switch (activeComponent) {
      case "accountInfo":
        return <Information refetch={refetch} userData={userInfo} />;
      case "businessInfo":
        return (
          <BusinessInformation refetch={refetch} businessData={businessInfo} />
        );
      case "changePassword":
        return <ChangePassword />;
      case "bankAccount":
        return <BankAccount />;
      case "meanWallet":
        return (
          <MeanWallet
            walletData={{
              availableBalance: "900,000 vnd",
              pendingBalance: "20,000 vnd",
              userName: "Alexa Rawles",
            }}
          />
        );
      default:
        return <Information refetch={refetch} userData={userInfo} />;
    }
  };

  return (
    <Layout className={styles.settingsPage}>
      <NavBar activeKey={activeComponent} onSelect={setActiveComponent} />
      <Content
        style={{
          backgroundColor: "white",
          padding: 20,
          boxShadow: "0.02px 3px 2px #CBCBCBFF",
          borderRadius: 10,
        }}
        className={styles.mainContent}
      >
        {renderComponent()}
      </Content>
    </Layout>
  );
}
