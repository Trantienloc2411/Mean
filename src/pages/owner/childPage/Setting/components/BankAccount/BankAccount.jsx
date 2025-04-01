import { useState, useEffect } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import {
  useCreateBankMutation,
  useUpdateBankMutation,
} from "../../../../../../redux/services/paymentInfoApi";
import { useUpdateOwnerMutation } from "../../../../../../redux/services/ownerApi";

export default function BankInfo({ bankData, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateBank] = useUpdateBankMutation();
  const [createBank] = useCreateBankMutation();
  const [updateOwner] = useUpdateOwnerMutation();
  const ownerId = bankData.ownerId;

  console.log(bankData);

  const defaultValue = "Chưa có thông tin";
  const [formData, setFormData] = useState({
    bankName: defaultValue,
    accountNumber: defaultValue,
    accountHolder: defaultValue,
  });

  useEffect(() => {
    if (bankData) {
      setFormData({
        bankName: bankData.bankName || defaultValue,
        accountNumber: bankData.accountNumber || defaultValue,
        accountHolder: bankData.accountHolder || defaultValue,
      });
    }
  }, [bankData]);

  if (bankData.bankId === null) {
    return (
      <NotHaveBank
        ownerId={ownerId}
        updateOwner={updateOwner}
        refetch={refetch}
        createBank={createBank}
      />
    );
  }

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateBank({ id: bankData.id, updatedBank: formData }).unwrap();
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      await refetch();
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setFormData({
      bankName: bankData.bankName || defaultValue,
      accountNumber: bankData.accountNumber || defaultValue,
      accountHolder: bankData.accountHolder || defaultValue,
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h3>Thông tin Tài Khoản Ngân Hàng</h3>
      <BankForm
        formData={formData}
        isEditing={isEditing}
        handleChange={handleChange}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {isEditing ? (
          <>
            <Button type="primary" onClick={handleSave}>
              Lưu
            </Button>
            <Button onClick={handleCancel}>Thoát</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        )}
      </div>
    </div>
  );
}
function BankForm({ formData, isEditing, handleChange }) {
  return (
    <Form layout="vertical">
      <Form.Item label="Tên ngân hàng">
        <Input
          value={formData.bankName}
          disabled={!isEditing}
          onChange={(e) => handleChange("bankName", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Số tài khoản">
        <Input
          value={formData.accountNumber}
          disabled={!isEditing}
          onChange={(e) => handleChange("accountNumber", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Tên chủ tài khoản">
        <Input
          value={formData.accountHolder}
          disabled={!isEditing}
          onChange={(e) => handleChange("accountHolder", e.target.value)}
        />
      </Form.Item>
    </Form>
  );
}

function NotHaveBank({ refetch, createBank, updateOwner, ownerId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async () => {
    const values = await form.validateFields();
    const bankDataSubmit = {
      bankName: values.bankName,
      bankNo: values.accountNumber,
      bankAccountName: values.accountHolder,
    };
    try {
      const bankInfo = await createBank({ data: bankDataSubmit }).unwrap();
      message.success("Tạo tài khoản ngân hàng thành công!");

      try {
        const updatedData = {
          paymentInformationId: bankInfo.id,
        };
        console.log(updatedData);

        const res = await updateOwner({
          id: ownerId,
          updatedData: updatedData,
        }).unwrap();
        console.log(res);
      } catch (error) {
        message.error("Tạo thông cho owner thất bại!");
      }
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      message.error("Tạo tài khoản thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <p>Bạn chưa thêm thông tin tài khoản ngân hàng.</p>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm tài khoản ngân hàng
      </Button>
      <Modal
        title="Thêm tài khoản ngân hàng"
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên ngân hàng"
            name="bankName"
            rules={[
              { required: true, message: "Vui lòng nhập tên ngân hàng!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số tài khoản"
            name="accountNumber"
            rules={[{ required: true, message: "Vui lòng nhập số tài khoản!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên chủ tài khoản"
            name="accountHolder"
            rules={[
              { required: true, message: "Vui lòng nhập tên chủ tài khoản!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
