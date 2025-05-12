"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Spin, message, Alert } from "antd";
import { useGetAccommodationTypesByOwnerQuery } from "../../../../../../../../../redux/services/accommodationTypeApi";
import { useUpdateRentalLocationMutation } from "../../../../../../../../../redux/services/rentalApi";

const AddRoomTypeModal = ({
  isOpen,
  onCancel,
  onConfirm,
  ownerId,
  rentalLocationId,
  isSubmitting: externalSubmitting,
}) => {
  const [form] = Form.useForm();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: accommodationTypes,
    isLoading: isLoadingTypes,
    error: typesError,
  } = useGetAccommodationTypesByOwnerQuery(ownerId, {
    skip: !ownerId || !isOpen,
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

      // Make sure rentalLocationId is a valid string
      const cleanId = String(rentalLocationId).trim();
      // Create the payload with the correct structure
      const dataUpdate = {
        accommodationTypeIds: values.accommodationTypeIds,
      };
      const result = await updateRentalLocation({
        id: cleanId,
        updatedData: dataUpdate,
      }).unwrap();
      console.log("API response:", result);

      message.success("Thêm loại phòng thành công");

      if (onConfirm) {
        // Pass the selected IDs to the parent component
        await onConfirm(values.accommodationTypeIds);
      }

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

  const isDisabled =
    externalSubmitting || localSubmitting || isUpdating || isLoadingTypes;

  const isLoading =
    isLoadingTypes || isUpdating || localSubmitting || externalSubmitting;

  return (
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
              options={(accommodationTypes?.data || []).map((type) => ({
                label: type.name,
                value: type._id,
                disabled: type.isDisabled,
              }))}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={
                typesError ? "Lỗi tải dữ liệu" : "Không tìm thấy loại phòng"
              }
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
  );
};

export default AddRoomTypeModal;
