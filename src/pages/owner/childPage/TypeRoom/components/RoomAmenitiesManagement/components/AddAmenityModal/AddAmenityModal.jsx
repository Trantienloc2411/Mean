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
            title="Thêm dịch vụ mới"
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} disabled={isLoading}>
                    Huỷ
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} loading={isLoading}>
                    Thêm dịch vụ
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
                        label="Tên dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
                    >
                        <Input placeholder="Nhập tên dịch vụ" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả dịch vụ" />
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