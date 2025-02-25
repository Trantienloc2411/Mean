import { useParams } from "react-router-dom";
import AccountInfo from "./Components/AccountInfo/AccountInfo";
import AccountStatus from "./Components/AccountStatus/AccountStatus";
import CompanyInfo from "./Components/CompanyInfo/CompanyInfo";
import { Skeleton } from "antd";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi";

export default function Information() {
  const { id } = useParams();
  const { data: ownerDetail, isLoading: ownerLoading } =
    useGetOwnerDetailByUserIdQuery(id);
  const userData = ownerDetail?.userId;
  if (ownerLoading) {
    return (
      <div
        className="loadingContainer"
        style={{ textAlign: "center", padding: "20px" }}
      >
        <Skeleton />
      </div>
    );
  }
  const userInfo = {
    isApproved: ownerDetail?.isApproved,
    note: ownerDetail?.note,
    fullName: userData?.fullName,
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
    // isVerifiedPhone: userData?.isVerifiedPhone,
    isVerify:
      // userData?.isVerifiedEmail && userData?.isVerifiedPhone,
      userData?.isVerifiedEmail,
    messageIsVerify:
      // userData?.isVerifiedEmail && userData?.isVerifiedPhone
      userData?.isVerifiedEmail
        ? "Đã xác thực "
        : "Số điện thoại/Email chưa xác thực",
  };
  const companyInfo = {
    businessLicensesFile:
      ownerDetail?.businessInformationId.businessLicensesFile,
    citizenIdentification:
      ownerDetail?.businessInformationId.citizenIdentification,
    companyAddress: ownerDetail?.businessInformationId.companyAddress,
    companyName: ownerDetail?.businessInformationId.companyName,
    representativeName: ownerDetail?.businessInformationId.representativeName,
    taxCode: ownerDetail?.businessInformationId.taxID,
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
            isApproved={userInfo.isApproved}
            note={userInfo.note}
            userInfo={userInfo}
          />
        </div>
        <div className="companySection" style={{ width: "45%" }}>
          <CompanyInfo companyInfo={companyInfo} />
        </div>
      </div>
    </div>
  );
}
