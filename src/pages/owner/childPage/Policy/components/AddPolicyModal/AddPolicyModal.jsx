import { Modal, Input, Form, DatePicker } from 'antd';
import dayjs from 'dayjs';
import styles from './AddPolicyModal.module.scss';

const AddPolicyModal = ({ isOpen, onCancel, onConfirm }) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        onConfirm({
            ...values,
            CreatedDate: dayjs().format('HH:mm DD/MM/YYYY'),
            Status: 'Pending',
        });
    };

    return (
        <Modal
            className={styles.addPolicyModal}
            title="Thêm Chính Sách Mới"
            open={isOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    ApplyDate: dayjs(),
                    EndDate: dayjs(),
                }}
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
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPolicyModal;
