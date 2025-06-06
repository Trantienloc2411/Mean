import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";

export default function TransactionModal({
  open,
  onCancel,
  onConfirm,
  isLoading,
  summary,
  ownerBankInfo = {},
  ownerId,
  policyPlatformFee = {},
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        paymentCode: `PAY_OWNER${Date.now()}`,
        description: `Chuyển tiền cho chủ phòng ${
          ownerBankInfo.ownerName
        } trong tháng ${new Date().toLocaleString("vi-VN", {
          month: "2-digit",
          year: "numeric",
        })}`,
        amount: Math.floor(summary?.ownerEarnings || 0),
      });
    }
  }, [open, summary, ownerId]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        Modal.confirm({
          title: "Xác nhận chuyển tiền?",
          content: `Bạn xác nhận đã chuyển ${values.amount.toLocaleString()}₫ cho ${
            ownerBankInfo.ownerName
          }?`,
          onOk: () => {
            onConfirm(values, form.resetFields);
          },
        });
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Tạo giao dịch chuyển tiền"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      confirmLoading={isLoading}
      okText="Tạo giao dịch"
      cancelText="Hủy"
    >
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          background: "#fafafa",
          borderRadius: 8,
          border: "1px solid #f0f0f0",
        }}
      >
        <h4>Thông tin chuyển khoản</h4>
        <p>
          💼 <strong>Chủ tài khoản:</strong>{" "}
          {ownerBankInfo.bankAccount || "Không rõ"}
        </p>
        <p>
          🏦 <strong>Ngân hàng:</strong> {ownerBankInfo.bankName || "Không rõ"}
        </p>
        <p>
          🔢 <strong>Số tài khoản:</strong> {ownerBankInfo.bankNo || "Không rõ"}
        </p>
        <hr style={{ margin: "12px 0" }} />
        <p>
          📦 <strong>Đơn đã hoàn tất: </strong> {summary?.successCount || 0} đơn
        </p>
        <p>
          💰 <strong>Tổng doanh thu: </strong>
          {(summary?.totalRevenue || 0).toLocaleString()} ₫
        </p>
        <p>
          🎯 <strong>Phí nền tảng: </strong>
          {(summary?.platformFeeTotal || 0).toLocaleString()} ₫ (
          {policyPlatformFee?.policyPrice}%)
        </p>
        <p>
          🎯 <strong>Thực nhận: </strong>
          {(summary?.ownerEarnings || 0).toLocaleString()} ₫ (
          {100 - policyPlatformFee?.policyPrice}%)
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã giao dịch"
          name="paymentCode"
          rules={[{ required: true, message: "Vui lòng nhập mã giao dịch" }]}
          readOnly
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Số tiền"
          name="amount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/₫|,/g, "")}
            addonAfter="₫"
            readOnly
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
