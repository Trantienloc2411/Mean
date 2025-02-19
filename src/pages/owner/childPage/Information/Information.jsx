import { useParams } from "react-router-dom";
import styles from "../Information/Information.module.scss";
import AccountInfo from "./Components/AccountInfo/AccountInfo";
import AccountStatus from "./Components/AccountStatus/AccountStatus";
import CompanyInfo from "./Components/CompanyInfo/CompanyInfo";
import { useGetUserQuery } from "../../../../redux/services/authApi";
import { Skeleton } from "antd";
import { message } from "antd";

export default function Information() {
  const { id } = useParams();
  const { data: userData, isLoading } = useGetUserQuery(id);

  if (isLoading) {
    return (
      <div
        className="loadingContainer"
        style={{ textAlign: "center", padding: "20px" }}
      >
        <Skeleton />
      </div>
    );
  }
  console.log(userData);

  const userInfo = {
    fullName: userData?.getUser.fullName,
    email: userData?.getUser.email,
    phone: userData?.getUser.phone,
    avatar:
      userData?.getUser.avatarUrl?.[0] ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT_BjEyf_LEpcvb225JX2qFCJcLz5-0RXLg&s",
    isActive: userData?.getUser.isActive,
    messageIsActive: userData?.getUser.isActive
      ? "Tài khoản đang hoạt thành công "
      : "Tài khoản đang bị khóa",
    isVerifiedEmail: userData?.getUser.isVerifiedEmail,
    isVerifiedPhone: userData?.getUser.isVerifiedPhone,
    isVerify:
      userData?.getUser.isVerifiedEmail && userData?.getUser.isVerifiedPhone,
    messageIsVerify:
      userData?.getUser.isVerifiedEmail && userData?.getUser.isVerifiedPhone
        ? "Đã xác thực "
        : "Số điện thoại/Email chưa xác thực",
  };

  return (
    <div className="contentContainer">
      <div
        className="infoHorizontal"
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div className="infoVertical" style={{ width: "45%" }}>
          <AccountInfo initialData={userInfo} />
          <AccountStatus
            isAccountActive={userInfo.isActive}
            tooltipAccountStatus={userInfo.messageIsActive}
            isAccountVerified={userInfo.isVerify}
            tooltipAccountVerified={userInfo.messageIsVerify}
            userInfo={userInfo}
          />
        </div>
        <div className="companySection" style={{ width: "45%" }}>
          <CompanyInfo />
        </div>
      </div>
    </div>
  );
}
