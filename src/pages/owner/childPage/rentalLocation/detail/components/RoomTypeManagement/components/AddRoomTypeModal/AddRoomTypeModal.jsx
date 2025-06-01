import { useState, useEffect } from "react"
import { Modal, Form, Select, Button, Spin, message, Alert } from "antd"
import {
  useGetAccommodationTypesByOwnerQuery,
  useGetAllAccommodationTypesQuery,
} from "../../../../../../../../../redux/services/accommodationTypeApi" 
import { useUpdateRentalLocationMutation } from "../../../../../../../../../redux/services/rentalApi" 
import { PlusOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons"
import AddNewRoomTypeModal from "../../../../../../TypeRoom/components/RoomTypeManagement/components/AddRoomTypeModal/AddRoomTypeModal"
import styles from "./AddRoomTypeModal.module.scss"

const AddRoomTypeModal = ({
  isOpen,
  onCancel,
  ownerId,
  rentalLocationId,
  isSubmitting: externalSubmitting,
  existingRoomTypeIds = [],
}) => {
  const [form] = Form.useForm()
  const [localSubmitting, setLocalSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isAddNewRoomTypeModalOpen, setIsAddNewRoomTypeModalOpen] = useState(false)

  const {
    data: accommodationTypesByOwner,
    isLoading: isLoadingOwnerTypes,
    error: ownerTypesError,
    refetch: refetchAccommodationTypesByOwner,
  } = useGetAccommodationTypesByOwnerQuery(ownerId, {
    skip: !ownerId || !isOpen,
  })

  const { refetch: refetchRentalAccommodationTypes } = useGetAllAccommodationTypesQuery(rentalLocationId, {
    skip: !rentalLocationId,
  })

  const [updateRentalLocation, { isLoading: isUpdatingRental, error: updateError }] = useUpdateRentalLocationMutation()

  useEffect(() => {
    if (isOpen) {
      form.resetFields()
      setErrorMessage("")
      if (ownerId) {
        refetchAccommodationTypesByOwner()
      }
    }
  }, [isOpen, form, ownerId, refetchAccommodationTypesByOwner])

  useEffect(() => {
    if (ownerTypesError) {
      setErrorMessage("Không thể tải danh sách loại phòng của chủ nhà. Vui lòng thử lại sau.")
    }
  }, [ownerTypesError])

  const handleSubmit = async () => {
    try {
      setErrorMessage("")
      setLocalSubmitting(true)
      const values = await form.validateFields()

      if (!Array.isArray(values.accommodationTypeIds) || values.accommodationTypeIds.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một loại phòng")
      }
      if (!rentalLocationId) {
        throw new Error("Không tìm thấy ID chỗ ở")
      }

      const currentIdsInRental = existingRoomTypeIds || []
      const mergedIds = [...new Set([...currentIdsInRental, ...values.accommodationTypeIds])]

      const cleanId = String(rentalLocationId).trim()
      const dataUpdate = {
        accommodationTypeIds: mergedIds,
      }

      await updateRentalLocation({
        id: cleanId,
        updatedData: dataUpdate,
      }).unwrap()

      await refetchRentalAccommodationTypes()
      message.success("Thêm loại phòng vào chỗ ở thành công")
      onCancel() 
    } catch (error) {
      console.error("Error updating rental location:", error)
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin nhập")
      } else if (error.data?.message) {
        setErrorMessage(error.data.message)
      } else if (error.message) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Đã xảy ra lỗi khi thêm loại phòng vào chỗ ở")
      }
    } finally {
      setLocalSubmitting(false)
    }
  }

  const handleAddNewRoomTypeSuccess = async (newlyCreatedRoomType) => {
    try {
      await refetchAccommodationTypesByOwner() 

      if (newlyCreatedRoomType && newlyCreatedRoomType._id) {
        const currentSelectedIds = form.getFieldValue("accommodationTypeIds") || []
        form.setFieldsValue({
          accommodationTypeIds: [...new Set([...currentSelectedIds, newlyCreatedRoomType._id])],
        })
        message.success(`Loại phòng "${newlyCreatedRoomType.name}" đã được tạo và chọn.`)
      } else {
        message.success("Tạo loại phòng mới thành công!")
      }
      setIsAddNewRoomTypeModalOpen(false) 
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xử lý loại phòng mới sau khi tạo.")
      console.error("Error in handleAddNewRoomTypeSuccess:", error)
    }
  }

  const isDisabled = externalSubmitting || localSubmitting || isUpdatingRental || isLoadingOwnerTypes
  const isLoadingOverall = isLoadingOwnerTypes || isUpdatingRental || localSubmitting || externalSubmitting

  return (
    <>
      <Modal
        title={
          <div className={styles.modalTitle}>
            <AppstoreAddOutlined className={styles.modalIcon} />
            <span>Thêm loại phòng vào chỗ ở</span>
          </div>
        }
        open={isOpen}
        onCancel={onCancel}
        footer={null}
        width={520}
        destroyOnClose
        className={styles.styledModal}
        maskClosable={false}
      >
        <div className={styles.modalContent}>
          {errorMessage && (
            <Alert
              message="Lỗi"
              description={errorMessage}
              type="error"
              showIcon
              className={styles.errorAlert}
              closable
              onClose={() => setErrorMessage("")}
            />
          )}

          {isLoadingOwnerTypes && !accommodationTypesByOwner ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" tip="Đang tải dữ liệu loại phòng của chủ nhà..." />
            </div>
          ) : (
            <Form form={form} layout="vertical" preserve={false} className={styles.form}>
              <Form.Item
                name="accommodationTypeIds"
                label={
                  <div className={styles.formLabel}>
                    <HomeOutlined className={styles.labelIcon} />
                    <span>Loại phòng</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ít nhất một loại phòng",
                  },
                ]}
                help="Chọn các loại phòng bạn muốn thêm vào chỗ ở này"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn loại phòng từ danh sách của chủ nhà"
                  loading={isLoadingOwnerTypes}
                  options={(accommodationTypesByOwner?.data || []).map((type) => {
                    const isExistingInCurrentRental = existingRoomTypeIds.includes(type._id)
                    return {
                      label: `${type.name}${isExistingInCurrentRental ? " (Đã có trong chỗ ở này)" : ""}`,
                      value: type._id,
                      disabled: isExistingInCurrentRental,
                    }
                  })}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => String(option.label).toLowerCase().includes(input.toLowerCase())}
                  notFoundContent={ownerTypesError ? "Lỗi tải dữ liệu" : "Không tìm thấy loại phòng"}
                  className={styles.select}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div className={styles.addNewOption} onClick={() => setIsAddNewRoomTypeModalOpen(true)}>
                        <PlusOutlined className={styles.plusIcon} />
                        <span>Tạo và thêm loại phòng mới</span>
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            </Form>
          )}

          {isUpdatingRental && (
            <div className={styles.updatingContainer}>
              <Spin tip="Đang cập nhật chỗ ở..." />
            </div>
          )}

          <div className={styles.buttonGroup}>
            <Button onClick={onCancel} disabled={isDisabled} className={styles.cancelButton}>
              Huỷ
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isLoadingOverall}
              disabled={isDisabled}
              className={styles.confirmButton}
            >
              Xác nhận thêm
            </Button>
          </div>
        </div>
      </Modal>

      <AddNewRoomTypeModal
        isOpen={isAddNewRoomTypeModalOpen}
        onModalCancel={() => setIsAddNewRoomTypeModalOpen(false)}
        onModalSuccess={handleAddNewRoomTypeSuccess}
        ownerId={ownerId} 
        rentalLocationId={rentalLocationId}
        existingRoomTypeIdsForRental={existingRoomTypeIds}
        refetchRentalDataInParent={refetchRentalAccommodationTypes} 
      />
    </>
  )
}

export default AddRoomTypeModal
