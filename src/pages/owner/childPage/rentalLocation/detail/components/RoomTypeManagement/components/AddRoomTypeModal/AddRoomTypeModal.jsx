import { useState, useEffect } from "react"
import { Modal, Form, Select, Button, Spin, message, Alert } from "antd"
import {
  useGetAccommodationTypesByOwnerQuery,
  useGetAllAccommodationTypesQuery,
  useCreateAccommodationTypeMutation,
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
    data: accommodationTypes,
    isLoading: isLoadingTypes,
    error: typesError,
    refetch: refetchAccommodationTypes,
  } = useGetAccommodationTypesByOwnerQuery(ownerId, {
    skip: !ownerId || !isOpen,
  })

  const { refetch: refetchAllAccommodationTypes } = useGetAllAccommodationTypesQuery(rentalLocationId, {
    skip: !rentalLocationId,
  })

  const [updateRentalLocation, { isLoading: isUpdating }] = useUpdateRentalLocationMutation()
  const [createAccommodationType] = useCreateAccommodationTypeMutation()

  useEffect(() => {
    if (isOpen) {
      form.resetFields()
      setErrorMessage("")
    }
  }, [isOpen, form])

  useEffect(() => {
    if (typesError) {
      setErrorMessage("Không thể tải danh sách loại phòng. Vui lòng thử lại sau.")
    }
  }, [typesError])

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

      const currentIds = existingRoomTypeIds || []
      const newIds = values.accommodationTypeIds.filter((id) => !currentIds.includes(id))
      const mergedIds = [...currentIds, ...newIds]

      const cleanId = String(rentalLocationId).trim()
      const dataUpdate = {
        accommodationTypeIds: mergedIds,
      }

      await updateRentalLocation({
        id: cleanId,
        updatedData: dataUpdate,
      }).unwrap()

      await refetchAllAccommodationTypes()

      message.success("Thêm loại phòng thành công")
      onCancel()
    } catch (error) {
      console.error("Error updating rental location:", error)
      const errorMsg = error.data?.message || error.message || "Đã xảy ra lỗi khi thêm loại phòng"
      setErrorMessage(errorMsg)
      message.error(errorMsg)
    } finally {
      setLocalSubmitting(false)
    }
  }

  const handleAddNewRoomType = async (newRoomTypeData) => {
    try {
      setLocalSubmitting(true)
      setErrorMessage("")

      // Create the new room type
      const response = await createAccommodationType({
        ...newRoomTypeData,
        ownerId,
      }).unwrap()

      const createdRoomType = response.data;

      // Refetch to update the room types list
      await refetchAccommodationTypes()

      // Get current selected values
      const currentValues = form.getFieldValue('accommodationTypeIds') || []
      
      // Add the new room type ID to selection
      form.setFieldsValue({
        accommodationTypeIds: [...currentValues, createdRoomType.id]
      })

      message.success("Tạo loại phòng mới thành công")
      setIsAddNewRoomTypeModalOpen(false)
      return Promise.resolve(createdRoomType)
    } catch (error) {
      console.error("Error adding new room type:", error)
      const errorMsg = error.data?.message || error.message || "Đã xảy ra lỗi khi tạo loại phòng mới"
      message.error(errorMsg)
      return Promise.reject(error)
    } finally {
      setLocalSubmitting(false)
    }
  }

  const isDisabled = externalSubmitting || localSubmitting || isUpdating || isLoadingTypes

  const isLoading = isLoadingTypes || isUpdating || localSubmitting || externalSubmitting

  return (
    <>
      <Modal
        title={
          <div className={styles.modalTitle}>
            <AppstoreAddOutlined className={styles.modalIcon} />
            <span>Thêm loại phòng</span>
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

          {isLoadingTypes ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" tip="Đang tải dữ liệu..." />
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
                  placeholder="Chọn loại phòng"
                  loading={isLoadingTypes}
                  options={(accommodationTypes?.data || []).map((type) => {
                    const isExisting = existingRoomTypeIds.includes(type._id)
                    return {
                      label: `${type.name}${isExisting ? " (Đã thêm)" : ""}`,
                      value: type._id,
                      disabled: isExisting,
                    }
                  })}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  notFoundContent={typesError ? "Lỗi tải dữ liệu" : "Không tìm thấy loại phòng"}
                  className={styles.select}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div className={styles.addNewOption} onClick={() => setIsAddNewRoomTypeModalOpen(true)}>
                        <PlusOutlined className={styles.plusIcon} />
                        <span>Thêm loại phòng mới</span>
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            </Form>
          )}

          {isUpdating && (
            <div className={styles.updatingContainer}>
              <Spin tip="Đang cập nhật..." />
            </div>
          )}

          <div className={styles.buttonGroup}>
            <Button onClick={onCancel} disabled={isDisabled} className={styles.cancelButton}>
              Huỷ
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={isDisabled}
              className={styles.confirmButton}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>

      <AddNewRoomTypeModal
        isOpen={isAddNewRoomTypeModalOpen}
        onCancel={() => setIsAddNewRoomTypeModalOpen(false)}
        onConfirm={handleAddNewRoomType}
        ownerId={ownerId}
      />
    </>
  )
}

export default AddRoomTypeModal
