import { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Spin, message, Alert } from "antd";
import { 
  useGetAccommodationTypesByOwnerQuery, 
  useGetAllAccommodationTypesQuery 
} from "../../../../../../../../../redux/services/accommodationTypeApi";
import { useUpdateRentalLocationMutation } from "../../../../../../../../../redux/services/rentalApi";
import { PlusOutlined } from "@ant-design/icons";
import AddNewRoomTypeModal from "../../../../../../TypeRoom/components/RoomTypeManagement/components/AddRoomTypeModal/AddRoomTypeModal";

const AddRoomTypeModal = ({
  isOpen,
  onCancel,
  ownerId,
  rentalLocationId,
  isSubmitting: externalSubmitting,
  existingRoomTypeIds = [],
}) => {
  const [form] = Form.useForm();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddNewRoomTypeModalOpen, setIsAddNewRoomTypeModalOpen] = useState(false);

  const {
    data: accommodationTypes,
    isLoading: isLoadingTypes,
    error: typesError,
    refetch: refetchAccommodationTypes
  } = useGetAccommodationTypesByOwnerQuery(ownerId, {
    skip: !ownerId || !isOpen,
  });

  const {
    refetch: refetchAllAccommodationTypes
  } = useGetAllAccommodationTypesQuery(rentalLocationId, {
    skip: !rentalLocationId,
  });

  const [updateRentalLocation, { isLoading: isUpdating, error: updateError }] =
    useUpdateRentalLocationMutation();

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      setErrorMessage("");
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (typesError) {
      setErrorMessage(
        "Không thể tải danh sách loại phòng. Vui lòng thử lại sau."
      );
    }
  }, [typesError]);

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      setLocalSubmitting(true);
      const values = await form.validateFields();

      if (
        !Array.isArray(values.accommodationTypeIds) ||
        values.accommodationTypeIds.length === 0
      ) {
        throw new Error("Vui lòng chọn ít nhất một loại phòng");
      }

      if (!rentalLocationId) {
        throw new Error("Không tìm thấy ID chỗ ở");
      }

      const currentIds = existingRoomTypeIds || [];
      const newIds = values.accommodationTypeIds.filter(
        (id) => !currentIds.includes(id)
      );
      const mergedIds = [...currentIds, ...newIds];

      const cleanId = String(rentalLocationId).trim();
      const dataUpdate = {
        accommodationTypeIds: mergedIds,
      };
      
      await updateRentalLocation({
        id: cleanId,
        updatedData: dataUpdate,
      }).unwrap();

      await refetchAllAccommodationTypes();

      message.success("Thêm loại phòng thành công");

      // Close the modal
      onCancel();
    } catch (error) {
      console.error("Error updating rental location:", error);

      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin nhập");
      } else if (error.data?.message) {
        setErrorMessage(error.data.message);
        message.error(error.data.message);
      } else if (error.message) {
        setErrorMessage(error.message);
        message.error(error.message);
      } else {
        setErrorMessage("Đã xảy ra lỗi khi thêm loại phòng");
        message.error("Đã xảy ra lỗi khi thêm loại phòng");
      }
    } finally {
      setLocalSubmitting(false);
    }
  };

  const handleAddNewRoomType = async (newRoomTypeData) => {
    try {
      // We're assuming the second modal will handle the actual API call to create the room type
      // After successful creation, we'll refetch the accommodation types
      await refetchAccommodationTypes();
      
      // And we can select the newly created room type
      // This assumes the API response includes the ID of the new room type
      // and that newRoomTypeData contains the created room type's ID
      if (newRoomTypeData && newRoomTypeData._id) {
        const currentSelectedIds = form.getFieldValue('accommodationTypeIds') || [];
        form.setFieldsValue({
          accommodationTypeIds: [...currentSelectedIds, newRoomTypeData._id]
        });
      }
      
      message.success("Tạo loại phòng mới thành công");
      setIsAddNewRoomTypeModalOpen(false);
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tạo loại phòng mới");
      console.error("Error adding new room type:", error);
    }
  };

  const isDisabled =
    externalSubmitting || localSubmitting || isUpdating || isLoadingTypes;

  const isLoading =
    isLoadingTypes || isUpdating || localSubmitting || externalSubmitting;

  return (
    <>
      <Modal
        title="Thêm loại phòng"
        open={isOpen}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel} disabled={isDisabled}>
            Huỷ
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isDisabled}
          >
            Xác nhận
          </Button>,
        ]}
        width={500}
        destroyOnClose
      >
        {errorMessage && (
          <Alert
            message="Lỗi"
            description={errorMessage}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setErrorMessage("")}
          />
        )}

        {isLoadingTypes ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <Form form={form} layout="vertical" preserve={false}>
            <Form.Item
              name="accommodationTypeIds"
              label="Loại phòng"
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
                  const isExisting = existingRoomTypeIds.includes(type._id);
                  return {
                    label: `${type.name}${isExisting ? " (Đã thêm)" : ""}`,
                    value: type._id,
                    disabled: isExisting, 
                  };
                })}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={
                  typesError ? "Lỗi tải dữ liệu" : "Không tìm thấy loại phòng"
                }
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderTop: '1px solid #e8e8e8',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={() => setIsAddNewRoomTypeModalOpen(true)}
                    >
                      <PlusOutlined style={{ marginRight: 8 }} /> Thêm loại phòng mới
                    </div>
                  </>
                )}
              />
            </Form.Item>
          </Form>
        )}

        {isUpdating && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <Spin tip="Đang cập nhật..." />
          </div>
        )}
      </Modal>

      <AddNewRoomTypeModal
        isOpen={isAddNewRoomTypeModalOpen}
        onCancel={() => setIsAddNewRoomTypeModalOpen(false)}
        onConfirm={handleAddNewRoomType}
        ownerId={ownerId}
      />
    </>
  );
};

export default AddRoomTypeModal;