import React, { useEffect } from 'react';
import { Modal, Input, Form, DatePicker } from 'antd';
import dayjs from 'dayjs';
import styles from './UpdatePolicyModal.module.scss';
import { Select } from 'antd';

const UpdatePolicyModal = ({ isOpen, onCancel, onConfirm, initialValues }) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();

    const getInitialValues = () => {
        if (!initialValues) return {};

        return {
            ...initialValues,
            ApplyDate: initialValues.ApplyDate ? dayjs(initialValues.ApplyDate, "HH:mm DD/MM/YYYY") : null,
            EndDate: initialValues.EndDate ? dayjs(initialValues.EndDate, "HH:mm DD/MM/YYYY") : null,
        };
    };

    useEffect(() => {
        form.setFieldsValue(getInitialValues());
    }, [initialValues, form]);

    const handleSubmit = (values) => {
        onConfirm({
            ...values,
            CreatedDate: initialValues.CreatedDate
        });
    };

    return (
        <Modal
            className={styles.updatePolicyModal}
            title="Chỉnh sửa Chính Sách"
            open={isOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={getInitialValues()}
            >
                <Form.Item
                    name="Name"
                    label="Tên chính sách"
                    rules={[{ required: true, message: 'Vui lòng nhập tên chính sách!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập mô tả tiện ích" />
                </Form.Item>
                <Form.Item
                    label="Ngày tạo"
                >
                    <Input 
                        value={initialValues?.CreatedDate}
                        disabled
                        style={{ backgroundColor: '#f5f5f5', color: '#000' }}
                    />
                </Form.Item>
                <Form.Item
                    name="ApplyDate"
                    label="Ngày áp dụng"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày áp dụng!' }]}
                >
                    <DatePicker
                        format="HH:mm DD/MM/YYYY"
                        showTime={{ format: 'HH:mm' }}
                    />
                </Form.Item>
                <Form.Item
                    name="EndDate"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker
                        format="HH:mm DD/MM/YYYY"
                        showTime={{ format: 'HH:mm' }}
                    />
                </Form.Item>
                <Form.Item
                    name="Status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Select.Option value="Pending">Đang chờ</Select.Option>
                        <Select.Option value="Approved">Đã duyệt</Select.Option>
                        <Select.Option value="Rejected">Từ chối</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdatePolicyModal;