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
  const userRole = localStorage.getItem("user_role")?.toLowerCase();
  const canEdit = userRole === `"owner"`;

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
      doB: userData?.doB,
      avatar:
        userData?.avatarUrl?.[0] ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT_BjEyf_LEpcvb225JX2qFCJcLz5-0RXLg&s",
      isVerifiedEmail: userData?.isVerifiedEmail,
      isActive: userData?.isActive,
      isApproved: ownerDetail?.isApproved,
      note: ownerDetail?.note || null,
    };
  }, [ownerDetail]);

  const businessInfo = useMemo(() => {
    if (!ownerDetail) return null;
    return {
      ownerId: ownerDetail.id,
      businessId: ownerDetail?.businessInformationId?.id || null,
      businessLicensesFile:
        ownerDetail?.businessInformationId?.businessLicensesFile,
      citizenIdentification:
        ownerDetail?.businessInformationId?.citizenIdentification,
      companyAddress: ownerDetail?.businessInformationId?.companyAddress,
      companyName: ownerDetail?.businessInformationId?.companyName,
      representativeName:
        ownerDetail?.businessInformationId?.representativeName,
      taxID: ownerDetail?.businessInformationId?.taxID,
    };
  }, [ownerDetail]);

  const bankInfo = useMemo(() => {
    if (!ownerDetail) return null;
    return {
      ownerId: ownerDetail.id,
      // businessId: ownerDetail?.businessInformationId?.id || null,
      bankId: ownerDetail?.paymentInformationId?.id || null,
      bankName: ownerDetail?.paymentInformationId?.bankName,
      bankNo: ownerDetail?.paymentInformationId?.bankNo,
      bankAccountName: ownerDetail?.paymentInformationId?.bankAccountName,
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
    // {
    //   key: "accountInfo",
    //   label: "Thông tin tài khoản",
    //   children: <Information refetch={refetch} userData={userInfo} />,
    // },
    // {
    //   key: "businessInfo",
    //   label: "Thông tin doanh nghiệp",
    //   children: (
    //     <BusinessInformation refetch={refetch} businessData={businessInfo} />
    //   ),
    // },

    // {
    //   key: "bankAccount",
    //   label: "Tài khoản ngân hàng",
    //   children: <BankAccount refetch={refetch} bankData={bankInfo} />,
    // },
    ...(canEdit
      ? [
          {
            key: "changePassword",
            label: "Đổi mật khẩu",
            children: <ChangePassword />,
          },
        ]
      : []),
    // {
    //   key: "meanWallet",
    //   label: "Ví",
    //   children: (
    //     <MeanWallet
    //       walletData={{
    //         availableBalance: "900,000 vnd",
    //         pendingBalance: "20,000 vnd",
    //         userName: "Alexa Rawles",
    //       }}
    //     />
    //   ),
    // },
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
