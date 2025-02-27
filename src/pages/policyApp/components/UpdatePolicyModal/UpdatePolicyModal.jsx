import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Select, Spin, message } from 'antd';
import styles from './UpdatePolicyModal.module.scss';
import { useGetAllPolicySystemCategoriesQuery } from '../../../../redux/services/policySystemCategoryApi';
import { useGetAllPolicySystemBookingsQuery } from '../../../../redux/services/policySystemBookingApi';
import { useUpdatePolicySystemMutation } from '../../../../redux/services/policySystemApi';
import { useGetStaffByIdQuery } from '../../../../redux/services/staffApi';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const UpdatePolicyModal = ({ isOpen, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicySystemMutation();
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

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories
  } = useGetAllPolicySystemCategoriesQuery();

  const {
    data: bookingsResponse,
    isLoading: isLoadingBookings
  } = useGetAllPolicySystemBookingsQuery();

  useEffect(() => {
    if (staffResponse && !isLoadingStaff) {
      setStaffData(staffResponse.data || staffResponse);
    }
  }, [staffResponse, isLoadingStaff]);

  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const formats = ['DD-MM-YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', 'MM-DD-YYYY HH:mm:ss'];
    for (const format of formats) {
      const parsed = dayjs(dateStr, format);
      if (parsed.isValid()) return parsed;
    }
    return null;
  };

  const extractCategoryId = (initialValue) => {
    if (!initialValue) return null;
        if (initialValue.policySystemCategoryId && initialValue.policySystemCategoryId._id) {
      return initialValue.policySystemCategoryId._id;
    }
        if (initialValue.policySystemCategoryId) {
      return initialValue.policySystemCategoryId;
    }
    
    return null;
  };

  const extractBookingId = (initialValue) => {
    if (!initialValue) return null;
        if (initialValue.policySystemBookingId && initialValue.policySystemBookingId._id) {
      return initialValue.policySystemBookingId._id;
    }
        if (initialValue.policySystemBookingId) {
      return initialValue.policySystemBookingId;
    }
    
    return null;
  };

  useEffect(() => {
    if (
      isOpen &&
      initialValues &&
      categoriesResponse &&
      bookingsResponse
    ) {
      const categoryId = extractCategoryId(initialValues);
      const bookingId = extractBookingId(initialValues);
      
      form.setFieldsValue({
        ...initialValues,
        policySystemCategoryId: categoryId,
        policySystemBookingId: bookingId,
        startDate: parseDateString(initialValues.startDate),
        endDate: parseDateString(initialValues.endDate),
        isActive: initialValues.isActive ? 'active' : 'inactive'
      });
    }
  }, [isOpen, initialValues, categoriesResponse, bookingsResponse, form]);

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
      label: `${booking.value || ''}${booking.unit ? ' ' + booking.unit : ''}`,
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
      const formatDate = (date) => {
        if (!date) return null;
        return date.format('DD-MM-YYYY HH:mm:ss');
      };

      const formattedValues = {
        id: initialValues.id,
        staffId: initialValues.staffId,
        updateBy: staffData.id,
        policySystemCategoryId: values.policySystemCategoryId,
        policySystemBookingId: values.policySystemBookingId || "",
        name: values.name,
        description: values.description || "",
        value: values.value || "",
        unit: values.unit || "",
        startDate: formatDate(values.startDate),
        endDate: formatDate(values.endDate),
        isActive: values.isActive === 'active'
      };

      await updatePolicy(formattedValues).unwrap();
      message.success('Cập nhật chính sách thành công');
      form.resetFields();
      onCancel();

    } catch (error) {
      console.error('Submit error:', error);

      if (error.status === 401 || error.message?.includes('token')) {
        setSubmitError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (!error.status && error.name === 'ValidationError') {
        setSubmitError('Vui lòng kiểm tra lại thông tin nhập vào');
        message.error('Vui lòng kiểm tra lại thông tin nhập vào');
      } else {
        setSubmitError(error.message || 'Đã xảy ra lỗi khi cập nhật chính sách');
        message.error(error.message || 'Đã xảy ra lỗi khi cập nhật chính sách');
      }
    }
  };

  const disabledDate = (current) => {
    return current && current.isBefore(dayjs(), 'day');
  };

  if (isLoadingStaff) {
    return <Spin />;
  }

  if (staffError) {
    return <div>Error: Không thể tải thông tin nhân viên</div>;
  }

  return (
    <Modal
      title="Cập nhật chính sách"
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
          loading={isUpdating}
        >
          Cập nhật
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
        name="updatePolicyForm"
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
            { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD-MM-YYYY HH:mm:ss"
            showTime={{ format: 'HH:mm:ss' }}
            placeholder="Chọn ngày và giờ bắt đầu"
            disabledDate={disabledDate}
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
                if (value.isBefore(getFieldValue('startDate'))) {
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
            showTime={{ format: 'HH:mm:ss' }}
            placeholder="Chọn ngày và giờ kết thúc"
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Radio.Group>
            <Radio value="active">Đang hoạt động</Radio>
            <Radio value="inactive">Không hoạt động</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePolicyModal;