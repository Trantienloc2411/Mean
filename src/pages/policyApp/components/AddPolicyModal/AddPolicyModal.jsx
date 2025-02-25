import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Select, Spin, message } from 'antd';
import styles from './AddPolicyModal.module.scss';
import { useGetAllPolicySystemCategoriesQuery } from '../../../../redux/services/policySystemCategoryApi';
import { useGetAllPolicySystemBookingsQuery } from '../../../../redux/services/policySystemBookingApi';
import { useCreatePolicySystemMutation } from '../../../../redux/services/policySystemApi';
import { useGetStaffByIdQuery } from '../../../../redux/services/staffApi';
import dayjs from 'dayjs';

const AddPolicyModal = ({ isOpen, onCancel }) => {
  const [form] = Form.useForm();
  const [createPolicy, { isLoading: isCreating }] = useCreatePolicySystemMutation();
  const [submitError, setSubmitError] = useState(null);
  const [staffData, setStaffData] = useState(null);

  const getToken = () => localStorage.getItem('access_token');
  const getCurrentUser = () => {
    try {
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_role');
      
      if (!userId || !userRole) {
        return null;
      }
      return {
        id: userId,
        role: userRole
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const {
    data: staffResponse,
    isLoading: isLoadingStaff,
    error: staffError
  } = useGetStaffByIdQuery(currentUser?.id, {
    skip: !currentUser?.id
  });

  useEffect(() => {
    if (staffResponse && !isLoadingStaff) {
      setStaffData(staffResponse.data || staffResponse);
    }
  }, [staffResponse, isLoadingStaff]);

  useEffect(() => {
    if (isOpen && staffData?.id) {
      form.setFieldValue('staffId', staffData.id);
    }
  }, [isOpen, staffData, form]);

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories
  } = useGetAllPolicySystemCategoriesQuery();

  const {
    data: bookingsResponse,
    isLoading: isLoadingBookings
  } = useGetAllPolicySystemBookingsQuery();

  const categoryOptions = (() => {
    if (!categoriesResponse) return [];
    const categoriesData = categoriesResponse.data || categoriesResponse;

    if (!Array.isArray(categoriesData)) return [];

    return categoriesData.map(category => ({
      label: category.name || category.categoryName,
      value: category.id || category._id
    }));
  })();

  const bookingOptions = (() => {
    if (!bookingsResponse) return [];
    const bookingsData = bookingsResponse.data || bookingsResponse;
    if (!Array.isArray(bookingsData)) return [];

    return bookingsData.map(booking => ({
      label: `${booking.value}${booking.unit ? ' ' + booking.unit : ''}`,
      value: booking.id || booking._id
    }));
  })();

  const handleSubmit = async () => {
    setSubmitError(null);
    
    try {
      const token = getToken();
      if (!token) {
        message.error('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }
  
      if (!staffData) {
        message.error('Không thể xác định thông tin nhân viên');
        return;
      }
  
      const values = await form.validateFields();
  
      if (!values.startDate || !values.endDate) {
        throw new Error('Vui lòng chọn ngày bắt đầu và kết thúc hợp lệ');
      }
      console.log('Raw form dates:', {
        startDate: values.startDate,
        endDate: values.endDate,
        startDateType: typeof values.startDate,
        startDateIsObject: typeof values.startDate === 'object',
        startDateIsDayjs: dayjs.isDayjs(values.startDate)
      });
      const startDateISO = values.startDate ? values.startDate.toISOString() : null;
      const endDateISO = values.endDate ? values.endDate.toISOString() : null;
      
      const formattedValues = {
        staffId: staffData.id,
        policySystemCategoryId: values.policySystemCategoryId,
        policySystemBookingId: values.policySystemBookingId || "",
        name: values.name,
        description: values.description || "",
        value: values.value || "",
        unit: values.unit || "",
        startDate: startDateISO,
        endDate: endDateISO,
        isActive: true
      };
  
      console.log("Final payload:", formattedValues);
  
      const response = await createPolicy(formattedValues).unwrap();
      console.log("API response:", response);
      
      message.success('Tạo chính sách thành công');
      form.resetFields();
      onCancel();
      
    } catch (error) {
      console.error('Submit error:', error);
    }
  };
  if (isLoadingStaff) {
    return <Spin />;
  }
  if (staffError) {
    return <div>Error: Không thể tải thông tin nhân viên</div>;
  }

  return (
    <Modal
      title="Thêm chính sách mới"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          loading={isCreating}
        >
          Thêm chính sách
        </Button>
      ]}
      width={600}
    >
      {submitError && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          {submitError}
        </div>
      )}
      
      <Form
        form={form}
        layout="vertical"
        name="addPolicyForm"
        className={styles.modalForm}
      >
        <Form.Item
          name="policySystemCategoryId"
          label="Danh mục chính sách"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục chính sách' }]}
        >
          <Select
            placeholder="Chọn danh mục chính sách"
            options={categoryOptions}
            loading={isLoadingCategories}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={isLoadingCategories ? <Spin size="small" /> : null}
          />
        </Form.Item>

        <Form.Item
          name="policySystemBookingId"
          label="Booking"
        >
          <Select
            placeholder="Chọn booking (không bắt buộc)"
            options={bookingOptions}
            loading={isLoadingBookings}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={isLoadingBookings ? <Spin size="small" /> : null}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên chính sách"
          rules={[{ required: true, message: 'Vui lòng nhập tên chính sách' }]}
        >
          <Input placeholder="Nhập tên chính sách" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả cho chính sách" />
        </Form.Item>

        <Form.Item
          name="value"
          label="Giá trị"
        >
          <Input placeholder="Nhập giá trị" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Đơn vị"
        >
          <Radio.Group>
            <Radio value="percent">Phần trăm (%)</Radio>
            <Radio value="vnd">VND</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[
            { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) return Promise.resolve();
                
                const now = dayjs().startOf('minute');
                const selectedDate = dayjs(value);

                if (selectedDate.isBefore(now)) {
                  return Promise.reject(new Error('Ngày bắt đầu phải sau thời điểm hiện tại'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD-MM-YYYY HH:mm:ss"
            showTime={{ 
              defaultValue: dayjs().startOf('minute'),
              format: 'HH:mm:ss'
            }}
            placeholder="Chọn ngày và giờ bắt đầu"
            disabledDate={(current) => {
              return current && current < dayjs().startOf('day');
            }}
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="Ngày kết thúc"
          rules={[
            { required: true, message: 'Vui lòng chọn ngày kết thúc' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue('startDate')) {
                  return Promise.resolve();
                }
                
                const startDate = dayjs(getFieldValue('startDate'));
                const endDate = dayjs(value);

                if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
                  return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD-MM-YYYY HH:mm:ss"
            showTime={{ 
              defaultValue: dayjs().startOf('minute'),
              format: 'HH:mm:ss'
            }}
            placeholder="Chọn ngày và giờ kết thúc"
            disabledDate={(current) => {
              const startDate = form.getFieldValue('startDate');
              return current && (
                current < dayjs().startOf('day') || 
                (startDate && current < dayjs(startDate).startOf('day'))
              );
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPolicyModal;