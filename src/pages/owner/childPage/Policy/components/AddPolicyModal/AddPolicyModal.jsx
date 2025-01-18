import { Modal, Input, Form, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import styles from './AddPolicyModal.module.scss';
import { Select } from 'antd';

const AddPolicyModal = ({ isOpen, onCancel, onConfirm }) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();
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
                onFinish={onConfirm}
                initialValues={{
                    CreatedDate: dayjs(),
                    ApplyDate: dayjs(),
                    EndDate: dayjs(),
                }}
            >
                <Form.Item name="Name" label="Tên chính sách" rules={[{ required: true, message: 'Vui lòng nhập tên chính sách!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="Description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                    <TextArea rows={4} placeholder="Nhập mô tả tiện ích" />
                </Form.Item>
                <Form.Item name="CreatedDate" label="Ngày tạo" rules={[{ required: true, message: 'Vui lòng chọn ngày tạo!' }]}>
                    <DatePicker format="HH:mm DD/MM/YYYY" />
                </Form.Item>
                <Form.Item name="ApplyDate" label="Ngày áp dụng" rules={[{ required: true, message: 'Vui lòng chọn ngày áp dụng!' }]}>
                    <DatePicker format="HH:mm DD/MM/YYYY" />
                </Form.Item>
                <Form.Item name="EndDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}>
                    <DatePicker format="HH:mm DD/MM/YYYY" />
                </Form.Item>
                <Form.Item name="Status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
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

export default AddPolicyModal;
