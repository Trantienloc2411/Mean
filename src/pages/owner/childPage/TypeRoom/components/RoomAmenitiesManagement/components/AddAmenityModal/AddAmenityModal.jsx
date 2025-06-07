import { Modal, Form, Input, Button, Spin } from 'antd';
import styles from './AddAmenityModal.module.scss';

const { TextArea } = Input;

const AddAmenityModal = ({ isOpen, onCancel, onConfirm, isLoading }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                onConfirm({ ...values, status: 'Active' });
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
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên dịch vụ' },
                            {
                                validator: (_, value) => {
                                    if (value && !value.trim()) {
                                        return Promise.reject(new Error('Tên dịch vụ không được chỉ chứa khoảng trắng!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input 
                            placeholder="Nhập tên dịch vụ" 
                            onBlur={(e) => {
                                const value = e.target.value.trim();
                                form.setFieldsValue({ name: value });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mô tả dịch vụ' },
                            {
                                validator: (_, value) => {
                                    if (value && !value.trim()) {
                                        return Promise.reject(new Error('Mô tả không được chỉ chứa khoảng trắng!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <TextArea 
                            rows={4} 
                            placeholder="Nhập mô tả dịch vụ" 
                            onBlur={(e) => {
                                const value = e.target.value.trim();
                                form.setFieldsValue({ description: value });
                            }}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddAmenityModal;