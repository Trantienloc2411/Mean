import { Modal, Form, Input, Select, Button, Spin } from 'antd';
import styles from './AddAmenityModal.module.scss';

const { TextArea } = Input;

const AddAmenityModal = ({ isOpen, onCancel, onConfirm, isLoading }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                onConfirm(values);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm tiện ích mới"
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} disabled={isLoading}>
                    Huỷ
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} loading={isLoading}>
                    Thêm tiện ích
                </Button>
            ]}
        >
            <Spin spinning={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="addAmenityForm"
                >
                    <Form.Item
                        name="name"
                        label="Tên tiện ích"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tiện ích' }]}
                    >
                        <Input placeholder="Nhập tên tiện ích" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả tiện ích' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả tiện ích" />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        initialValue="Active"
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Select.Option value="Active">Đang hoạt động</Select.Option>
                            <Select.Option value="Inactive">Không hoạt động</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddAmenityModal;