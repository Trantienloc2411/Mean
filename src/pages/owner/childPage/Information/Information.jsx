import { useParams } from "react-router-dom"
import AccountInfo from "./Components/AccountInfo/AccountInfo"
import AccountStatus from "./Components/AccountStatus/AccountStatus"
import CompanyInfo from "./Components/CompanyInfo/CompanyInfo"
import { Skeleton, Row, Col, message } from "antd"
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi"
import { useState, useEffect } from "react"
import styles from "./Information.module.scss"

export default function Information() {
  const { id } = useParams()
  const { data: ownerDetail, isLoading: ownerLoading } = useGetOwnerDetailByUserIdQuery(id)

  const [userInfo, setUserInfo] = useState(null)
  const [companyInfo, setCompanyInfo] = useState(null)

  console.log("Owner detail",ownerDetail);
  // Initialize data when it's loaded
  useEffect(() => {
    if (ownerDetail && !ownerLoading) {
      const userData = ownerDetail?.userId

      setUserInfo({
        isApproved: ownerDetail?.isApproved,
        note: ownerDetail?.note,
        fullName: userData?.fullName,
        email: userData?.email,
        phone: userData?.phone,
        avatar:
            userData?.avatarUrl?.[0] ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT_BjEyf_LEpcvb225JX2qFCJcLz5-0RXLg&s",
        isActive: userData?.isActive,
        messageIsActive: userData?.isActive ? "Tài khoản đang hoạt thành công" : "Tài khoản đang bị khóa",
        isVerifiedEmail: userData?.isVerifiedEmail,
        isVerify: userData?.isVerifiedEmail,
        messageIsVerify: userData?.isVerifiedEmail ? "Đã xác thực" : "Số điện thoại/Email chưa xác thực",
      })

      setCompanyInfo({
        businessLicensesFile: ownerDetail?.businessInformationId?.businessLicensesFile,
        citizenIdentification: ownerDetail?.businessInformationId?.citizenIdentification,
        companyAddress: ownerDetail?.businessInformationId?.companyAddress,
        companyName: ownerDetail?.businessInformationId?.companyName,
        representativeName: ownerDetail?.businessInformationId?.representativeName,
        taxCode: ownerDetail?.businessInformationId?.taxID,
      })
    }
  }, [ownerDetail, ownerLoading])

  const handleUpdateUserInfo = async (updatedInfo) => {
    try {
      // Here you would make an API call to update the user info
      // For example:
      // const response = await updateUserInfo(id, updatedInfo);

      // Update local state
      setUserInfo({
        ...userInfo,
        ...updatedInfo,
      })

      message.success("Thông tin tài khoản đã được cập nhật thành công!")
    } catch (error) {
      console.error("Error updating user info:", error)
      message.error("Có lỗi xảy ra khi cập nhật thông tin tài khoản!")
    }
  }

  const handleUpdateCompanyInfo = async (updatedInfo) => {
    try {
      // Here you would make an API call to update the company info
      // For example:
      // const response = await updateCompanyInfo(id, updatedInfo);

      // Update local state
      setCompanyInfo({
        ...companyInfo,
        ...updatedInfo,
      })

      message.success("Thông tin doanh nghiệp đã được cập nhật thành công!")
    } catch (error) {
      console.error("Error updating company info:", error)
      message.error("Có lỗi xảy ra khi cập nhật thông tin doanh nghiệp!")
    }
  }

  if (ownerLoading || !userInfo || !companyInfo) {
    return (
        <div className="loadingContainer" style={{ textAlign: "center", padding: "20px" }}>
          <Skeleton />
        </div>
    )
  }

  return (
      <div className={styles.informationContainer}>
        <Row gutter={[24, 24]}>
          {/* Cột trái: Thông tin tài khoản và trạng thái */}
          <Col xs={24} md={12}>
            <div className={styles.leftColumn}>
              <AccountInfo initialData={userInfo} onUpdate={handleUpdateUserInfo} />
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
          </Col>
          {/* Cột phải: Thông tin công ty */}
          <Col xs={24} md={12}>
            <div className={styles.rightColumn}>
              <CompanyInfo companyInfo={companyInfo} onUpdate={handleUpdateCompanyInfo} />
            </div>
          </Col>
        </Row>
      </div>
  )
}
