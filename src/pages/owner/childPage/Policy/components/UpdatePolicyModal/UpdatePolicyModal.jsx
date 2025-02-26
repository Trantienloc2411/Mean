import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import styles from './UpdatePolicyModal.module.scss';

const UpdatePolicyModal = ({ isOpen, onCancel, onConfirm, initialValues }) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const getInitialValues = () => {
        if (!initialValues) return {};
        return {
            ...initialValues,
            ApplyDate: initialValues.ApplyDate
                ? dayjs(initialValues.ApplyDate, "HH:mm DD/MM/YYYY")
                : null,
            EndDate: initialValues.EndDate
                ? dayjs(initialValues.EndDate, "HH:mm DD/MM/YYYY")
                : null,
        };
    };

    useEffect(() => {
        if (isOpen && initialValues) {
            form.setFieldsValue(getInitialValues());
        }
    }, [initialValues, form, isOpen]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            await onConfirm({
                ...values,
                CreatedDate: initialValues?.CreatedDate || dayjs().format('HH:mm DD/MM/YYYY'),
            });
        } catch (error) {
            console.error("Error updating policy:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            className={styles.updatePolicyModal}
            title="Chỉnh sửa Chính Sách"
            open={isOpen}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Cập nhật"
            cancelText="Huỷ"
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={getInitialValues()}
                layout="vertical"
            >
                <Form.Item
                    name="Name"
                    label="Tên chính sách"
                    rules={[{ required: true, message: 'Vui lòng nhập tên chính sách!' }]}
                >
                    <Input placeholder="Nhập tên chính sách" />
                </Form.Item>
                <Form.Item
                    name="Description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập mô tả chính sách" />
                </Form.Item>
                <Form.Item
                    label="Ngày tạo"
                >
                    <Input
                        value={initialValues?.CreatedDate || ''}
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
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    name="EndDate"
                    label="Ngày kết thúc"
                    rules={[
                        { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const applyDate = getFieldValue('ApplyDate');
                                if (!value || !applyDate || value.isAfter(applyDate)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        'Ngày kết thúc phải lớn hơn ngày áp dụng (bao gồm cả giờ phút).'
                                    )
                                );
                            },
                        }),
                    ]}
                >
                    <DatePicker
                        format="HH:mm DD/MM/YYYY"
                        showTime={{ format: 'HH:mm' }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    name="Status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Select.Option value={1}>Đang chờ</Select.Option>
                        <Select.Option value={2}>Đã duyệt</Select.Option>
                        <Select.Option value={3}>Từ chối</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdatePolicyModal;