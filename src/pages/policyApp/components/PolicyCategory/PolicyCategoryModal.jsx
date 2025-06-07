import { useState, useEffect } from 'react';
import { Form, Modal, Input, Button, message } from 'antd';
import { useGetPolicySystemCategoryByIdQuery } from '../../../../redux/services/policySystemCategoryApi.js';

const { TextArea } = Input;

const modalStyles = {
  header: {
    padding: '20px 24px',
    marginBottom: 0,
    borderBottom: '1px solid #f0f0f0'
  },
  content: {
    padding: 0,
    borderRadius: '8px'
  },
  body: {
    padding: '24px'
  },
  input: {
    borderRadius: '6px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  },
  button: {
    minWidth: '100px',
    height: '36px',
    borderRadius: '6px',
    fontWeight: 500
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a1a1a'
  },
  label: {
    fontWeight: 500,
    color: '#262626'
  }
};

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
      maskClosable={false}
      centered
      styles={{
        header: modalStyles.header,
        content: modalStyles.content,
        body: modalStyles.body,
        title: modalStyles.title
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Form.Item
          label="Mã danh mục"
          name="categoryKey"
          rules={[
            { required: true, message: 'Vui lòng nhập mã danh mục!' },
            { max: 50, message: 'Mã danh mục không được vượt quá 50 ký tự!' },
            {
              validator: (_, value) => {
                if (value && !value.trim()) {
                  return Promise.reject(new Error('Mã danh mục không được chỉ chứa khoảng trắng!'));
                }
                return Promise.resolve();
              }
            }
          ]}
          labelCol={{ style: modalStyles.label }}
        >
          <Input 
            placeholder="Nhập mã danh mục" 
            style={modalStyles.input}
            onBlur={(e) => {
              const value = e.target.value.trim();
              form.setFieldsValue({ categoryKey: value });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Tên danh mục"
          name="categoryName"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { max: 100, message: 'Tên danh mục không được vượt quá 100 ký tự!' },
            {
              validator: (_, value) => {
                if (value && !value.trim()) {
                  return Promise.reject(new Error('Tên danh mục không được chỉ chứa khoảng trắng!'));
                }
                return Promise.resolve();
              }
            }
          ]}
          labelCol={{ style: modalStyles.label }}
        >
          <Input 
            placeholder="Nhập tên danh mục" 
            style={modalStyles.input}
            onBlur={(e) => {
              const value = e.target.value.trim();
              form.setFieldsValue({ categoryName: value });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="categoryDescription"
          rules={[
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' },
            {
              validator: (_, value) => {
                if (value && !value.trim()) {
                  return Promise.reject(new Error('Mô tả không được chỉ chứa khoảng trắng!'));
                }
                return Promise.resolve();
              }
            }
          ]}
          labelCol={{ style: modalStyles.label }}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập mô tả danh mục"
            showCount
            maxLength={500}
            style={modalStyles.input}
            onBlur={(e) => {
              const value = e.target.value.trim();
              form.setFieldsValue({ categoryDescription: value });
            }}
          />
        </Form.Item>

        <div style={modalStyles.buttonGroup}>
          <Button 
            onClick={onCancel}
            disabled={isLoadingSubmit}
            style={modalStyles.button}
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={isLoadingSubmit}
            style={modalStyles.button}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PolicyCategoryModal;