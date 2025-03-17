import { useState, useEffect } from 'react';
import { Modal, Input, Form, DatePicker, Button, Space, Divider, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './AddPolicyModal.module.scss';

const SAMPLE_HASHTAGS = ['#giodongmo', '#giamgia','#dichvu', '#thanhtoan'];

const AddPolicyModal = ({ isOpen, onCancel, onConfirm }) => {
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [hashtagOptions, setHashtagOptions] = useState([]);
    const filterHashtags = (inputValue, fieldName) => {
        const value = inputValue.startsWith('#') ? inputValue : `#${inputValue}`;
        const filteredOptions = SAMPLE_HASHTAGS.filter(
            tag => tag.toLowerCase().includes(value.toLowerCase())
        ).map(tag => ({ label: tag, value: tag }));

        setHashtagOptions(filteredOptions);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const formattedValues = values.values?.filter(value =>
                value && (value.val1 || value.val2 || value.description)
            ) || [];

            await onConfirm({
                ...values,
                values: formattedValues,
                CreatedDate: dayjs().format('HH:mm DD/MM/YYYY'),
                Status: 1,
                isDelete: false,
                updateBy: localStorage.getItem('user_id') || '',
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
            width={700}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    ApplyDate: dayjs(),
                    EndDate: dayjs().add(30, 'day'),
                    Status: 1,
                    isDelete: false,
                    values: [{}],
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

                <Divider orientation="left">Giá trị (không bắt buộc)</Divider>

                <Form.List name="values">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ marginBottom: 20 }}>
                                    <Space
                                        style={{
                                            display: 'flex',
                                            marginBottom: 8,
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}
                                        align="baseline"
                                    >
                                        <div style={{ fontWeight: 'bold' }}>Giá trị {name + 1}</div>
                                        {fields.length > 1 ? (
                                            <Button
                                                danger
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={() => remove(name)}
                                            >
                                                Xóa
                                            </Button>
                                        ) : null}
                                    </Space>

                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'val1']}
                                            style={{ width: '50%', marginBottom: '8px' }}
                                        >
                                            <Input placeholder="Giá trị 1" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'val2']}
                                            style={{ width: '50%', marginBottom: '8px' }}
                                        >
                                            <Input placeholder="Giá trị 2" />
                                        </Form.Item>
                                    </div>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'description']}
                                        style={{ marginBottom: '8px' }}
                                    >
                                        <Input placeholder="Mô tả" />
                                    </Form.Item>

                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'unit']}
                                            style={{ width: '50%', marginBottom: '8px' }}
                                        >
                                            <Input placeholder="Đơn vị" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'valueType']}
                                            style={{ width: '50%', marginBottom: '8px' }}
                                        >
                                            <Input placeholder="Loại giá trị" />
                                        </Form.Item>
                                    </div>

                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'hashTag']}
                                            style={{ width: '50%', marginBottom: '8px' }}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Nhập hashtag"
                                                options={hashtagOptions}
                                                onSearch={(value) => filterHashtags(value, name)}
                                                filterOption={false}
                                                showArrow={false}
                                                notFoundContent={null}
                                                allowClear
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'note']}
                                            style={{ width: '50%', marginBottom: '8px' }}
                                        >
                                            <Input placeholder="Ghi chú" />
                                        </Form.Item>
                                    </div>
                                </div>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Thêm giá trị
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default AddPolicyModal;