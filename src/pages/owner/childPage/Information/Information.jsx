import { useParams } from "react-router-dom"
import { Skeleton, Row, Col, message } from "antd"
import { useState, useEffect } from "react"
import AccountInfo from "./Components/AccountInfo/AccountInfo"
import AccountStatus from "./Components/AccountStatus/AccountStatus"
import CompanyInfo from "./Components/CompanyInfo/CompanyInfo"
import styles from "./Information.module.scss"
import { notification } from "antd"

import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi"
import { useGetOwnerLogsByOwnerIdQuery } from "../../../../redux/services/ownerLogApi"
import { checkUserExistInSupabase, createOrGetUserProfile } from "../../../../redux/services/supabase"
import { useUpdateUserMutation } from "../../../../redux/services/userApi"

export default function Information() {
  const { id } = useParams()

  // Get owner detail
  const { data: ownerDetail, refetch: refreshOwner, isLoading: ownerLoading } = useGetOwnerDetailByUserIdQuery(id)
  const [updateUser] = useUpdateUserMutation()
  // State
  const [userInfo, setUserInfo] = useState(null)
  const [companyInfo, setCompanyInfo] = useState(null)

  // Get logs (only when owner loaded)
  const ownerId = ownerDetail?._id
  const { data: logsData, refetch: refetchLogs } = useGetOwnerLogsByOwnerIdQuery(ownerId, {
    skip: !ownerId,
  })



  // Setup user profile in supabase
  useEffect(() => {
    const setupSupabaseUser = async () => {
      if (ownerDetail && !ownerLoading && id) {
        try {
          // Check if user exists in Supabase
          const userExistsResult = await checkUserExistInSupabase(id)

          if (!userExistsResult.exists) {
            // User doesn't exist, create a new profile
            const user = ownerDetail.userId || {}
            const userData = {
              userId: id,
              username: user.fullName || user.email || `user_${id}`,
              roleName: "owner", // Assuming this is an owner profile
            }

            const createResult = await createOrGetUserProfile(userData)
          }
        } catch (error) {
          console.error("Error in Supabase user setup:", error)
          notification.error({
            message: "Lỗi khi tạo tài khoản trong Supabase! Chưa thể tạo tài khoản trong Supabase",
            description: error.message,
          })
        }
      }
    }

    setupSupabaseUser()
  }, [ownerDetail, ownerLoading, id])

  // Extract + map data
  useEffect(() => {
    if (ownerDetail && !ownerLoading) {
      const user = ownerDetail.userId || {}
      const business = ownerDetail.businessInformationId || {}

      setUserInfo({
        approvalStatus: ownerDetail?.approvalStatus || 4,
        note: ownerDetail?.note || "",
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar:
          user.avatarUrl?.[0] ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT_BjEyf_LEpcvb225JX2qFCJcLz5-0RXLg&s",
        isActive: user.isActive,
        messageIsActive: user.isActive ? "Tài khoản đang hoạt động" : "Tài khoản đang bị khóa",
        isVerifiedEmail: user.isVerifiedEmail,
        isVerify: user.isVerifiedEmail,
        messageIsVerify: user.isVerifiedEmail ? "Đã xác thực" : "Số điện thoại/Email chưa xác thực",
      })

      setCompanyInfo({
        id: business.id,
        ownerId: ownerId,
        businessLicensesFile: business.businessLicensesFile,
        citizenIdentification: business.citizenIdentification,
        companyAddress: business.companyAddress,
        companyName: business.companyName,
        representativeName: business.representativeName,
        taxCode: business.taxID,
      })
    }
  }, [ownerDetail, ownerLoading])

  // Update info (fake logic)
  const handleUpdateUserInfo = async (updatedInfo) => {
    try {
      // Call the updateUser mutation with the correct payload structure
      const result = await updateUser({
        id: id,
        updatedUser: {
          fullName: updatedInfo.fullName,
          phone: updatedInfo.phone,
          avatarUrl: [updatedInfo.avatar]
        }
      }).unwrap()

      // Update local state after successful API call
      setUserInfo((prev) => ({
        ...prev,
        ...updatedInfo,
      }))

      message.success("Thông tin đã được cập nhật thành công!")
    } catch (error) {
      console.error("Error updating user info:", error)
      message.error("Có lỗi xảy ra khi cập nhật thông tin tài khoản!")
    }
  }

  const handleUpdateCompanyInfo = async (updatedInfo) => {
    try {
      setCompanyInfo((prev) => ({
        ...prev,
        ...updatedInfo,
      }))
    } catch (error) {
      console.error("Error updating company info:", error)
      message.error("Có lỗi xảy ra khi cập nhật thông tin doanh nghiệp!")
    }
  }

  // Loading state
  if (ownerLoading || !userInfo || !companyInfo) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
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
              approvalStatus={userInfo.approvalStatus}
              note={userInfo.note}
              ownerId={ownerId}
              approvalLogs={logsData || []}
              userInfo={userInfo}
              refetchLogs={refetchLogs}
              updateOwner={updateUser}
              refreshOwner={refreshOwner}
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
