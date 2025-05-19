import { useState, useEffect } from 'react';
import { Form, Modal, Input, Button, message } from 'antd';
import { useGetPolicySystemCategoryByIdQuery } from '../../../../redux/services/policySystemCategoryApi.js';

const { TextArea } = Input;

const PolicyCategoryModal = ({
  visible,
  isEditing,
  editingId,
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const { data: detailCategory, isLoading: isDetailLoading } = useGetPolicySystemCategoryByIdQuery(
    editingId,
    { skip: !editingId }
  );

  useEffect(() => {
    if (isEditing && detailCategory) {
      form.setFieldsValue({
        categoryKey: detailCategory.categoryKey,
        categoryName: detailCategory.categoryName,
        categoryDescription: detailCategory.categoryDescription
      });
    }
  }, [detailCategory, isEditing, form]);

  const handleSubmit = async (values) => {
    try {
      setIsLoadingSubmit(true);
      await onSubmit(values);
      message.success(`Danh mục ${isEditing ? 'cập nhật' : 'tạo mới'} thành công`);
    } catch (error) {
      message.error(`Có lỗi xảy ra khi ${isEditing ? 'cập nhật' : 'tạo'} danh mục`);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Cập nhật danh mục" : "Tạo danh mục mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      closable={!isLoadingSubmit}
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Mã danh mục"
          name="categoryKey"
          rules={[
            { required: true, message: 'Vui lòng nhập mã danh mục!' },
            { max: 50, message: 'Mã danh mục không được vượt quá 50 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập mã danh mục" />
        </Form.Item>

        <Form.Item
          label="Tên danh mục"
          name="categoryName"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { max: 100, message: 'Tên danh mục không được vượt quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="categoryDescription"
          rules={[
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập mô tả danh mục"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button 
            onClick={onCancel}
            style={{ marginRight: 8 }}
            disabled={isLoadingSubmit}
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={isLoadingSubmit}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PolicyCategoryModal;