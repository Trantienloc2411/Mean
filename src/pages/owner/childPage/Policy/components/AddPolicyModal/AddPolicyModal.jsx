import { useState } from 'react';
import { Modal, Input, Form, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import styles from './AddPolicyModal.module.scss';

const AddPolicyModal = ({ isOpen, onCancel, onConfirm }) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
          setLoading(true);
          await onConfirm({
            ...values,
            CreatedDate: dayjs().format('HH:mm DD/MM/YYYY'),
            Status: 1,
          });
          form.resetFields();
        } catch (error) {
          console.error("Error adding policy:", error);
        } finally {
          setLoading(false);
        }
      };

    return (
        <Modal
            className={styles.addPolicyModal}
            title="Thêm Chính Sách Mới"
            open={isOpen}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Thêm mới"
            cancelText="Huỷ"
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    ApplyDate: dayjs(),
                    EndDate: dayjs().add(30, 'day'),
                }}
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
                    name="ApplyDate"
                    label="Ngày áp dụng"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày áp dụng!' }]}
                >
                    <DatePicker
                        format="HH:mm DD/MM/YYYY"
                        showTime={{ format: 'HH:mm' }}
                        placeholder="Chọn ngày giờ áp dụng"
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
                        placeholder="Chọn ngày giờ kết thúc"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPolicyModal;