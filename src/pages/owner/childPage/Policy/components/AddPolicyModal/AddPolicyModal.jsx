"use client"

import { useState, useEffect } from "react"
import { Modal, Input, Form, DatePicker, Button, Space, Select, message, Card, Typography, Tooltip, Tag } from "antd"
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TagsOutlined,
  FileTextOutlined,
  NumberOutlined,
  AppstoreOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import styles from "./AddPolicyModal.module.scss"

const { Title, Text } = Typography
const { TextArea } = Input

const SAMPLE_HASHTAGS = ["#giodongmo", "#giamgia", "#dichvu", "#thanhtoan", "#khuyenmai", "#uudai"]

const AddPolicyModal = ({ isOpen, onCancel, onConfirm }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hashtagOptions, setHashtagOptions] = useState([])

  useEffect(() => {
    // Initialize hashtag options
    setHashtagOptions(SAMPLE_HASHTAGS.map((tag) => ({ label: tag, value: tag })))
  }, [])

  const filterHashtags = (inputValue, fieldName) => {
    const value = inputValue.startsWith("#") ? inputValue : `#${inputValue}`
    const filteredOptions = SAMPLE_HASHTAGS.filter((tag) => tag.toLowerCase().includes(value.toLowerCase())).map(
      (tag) => ({ label: tag, value: tag }),
    )

    setHashtagOptions(filteredOptions)
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      const formattedValues =
        values.values?.filter((value) => value && (value.val1 || value.val2 || value.description)) || []

      await onConfirm({
        ...values,
        values: formattedValues,
        CreatedDate: dayjs().format("HH:mm DD/MM/YYYY"),
        Status: 1,
        isDelete: false,
        updateBy: localStorage.getItem("user_id") || "",
      })
      message.success("Thêm chính sách thành công")
      form.resetFields()
    } catch (error) {
      console.error("Error adding policy:", error)
      message.error("Có lỗi xảy ra khi thêm chính sách")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      className={styles.addPolicyModal}
      title={
        <div className={styles.modalTitle}>
          <AppstoreOutlined className={styles.titleIcon} />
          <span>Thêm Chính Sách Mới</span>
        </div>
      }
      open={isOpen}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields()
            onCancel()
          }}
        >
          Huỷ
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Thêm mới
        </Button>,
      ]}
      width={800}
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: "24px" }}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          ApplyDate: dayjs(),
          EndDate: dayjs().add(30, "day"),
          Status: 1,
          isDelete: false,
          values: [{}],
        }}
        layout="vertical"
        className={styles.policyForm}
        requiredMark="optional"
      >
        <Card
          className={styles.formSection}
          title={
            <div className={styles.sectionTitle}>
              <FileTextOutlined className={styles.sectionIcon} />
              <span>Thông tin cơ bản</span>
            </div>
          }
          bordered={false}
        >
          <Form.Item
            name="Name"
            label={
              <Space>
                <span>Tên chính sách</span>
                <Tooltip title="Nhập tên chính sách ngắn gọn và dễ hiểu">
                  <InfoCircleOutlined className={styles.infoIcon} />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: "Vui lòng nhập tên chính sách!" }]}
          >
            <Input placeholder="Nhập tên chính sách" maxLength={100} showCount />
          </Form.Item>

          <Form.Item
            name="Description"
            label={
              <Space>
                <span>Mô tả</span>
                <Tooltip title="Mô tả chi tiết về chính sách này">
                  <InfoCircleOutlined className={styles.infoIcon} />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả chính sách" maxLength={500} showCount />
          </Form.Item>
        </Card>

        <Card
          className={styles.formSection}
          title={
            <div className={styles.sectionTitle}>
              <CalendarOutlined className={styles.sectionIcon} />
              <span>Thời gian áp dụng</span>
            </div>
          }
          bordered={false}
        >
          <div className={styles.dateContainer}>
            <Form.Item
              name="ApplyDate"
              label={
                <Space>
                  <span>Ngày áp dụng</span>
                  <Tooltip title="Thời điểm bắt đầu áp dụng chính sách">
                    <InfoCircleOutlined className={styles.infoIcon} />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: "Vui lòng chọn ngày áp dụng!" }]}
              className={styles.dateItem}
            >
              <DatePicker
                format="HH:mm DD/MM/YYYY"
                showTime={{ format: "HH:mm" }}
                placeholder="Chọn ngày giờ áp dụng"
                style={{ width: "100%" }}
                className={styles.datePicker}
              />
            </Form.Item>

            <Form.Item
              name="EndDate"
              label={
                <Space>
                  <span>Ngày kết thúc</span>
                  <Tooltip title="Thời điểm kết thúc áp dụng chính sách">
                    <InfoCircleOutlined className={styles.infoIcon} />
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const applyDate = getFieldValue("ApplyDate")
                    if (!value || !applyDate || value.isAfter(applyDate)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error("Ngày kết thúc phải lớn hơn ngày áp dụng (bao gồm cả giờ phút)."))
                  },
                }),
              ]}
              className={styles.dateItem}
            >
              <DatePicker
                format="HH:mm DD/MM/YYYY"
                showTime={{ format: "HH:mm" }}
                placeholder="Chọn ngày giờ kết thúc"
                style={{ width: "100%" }}
                className={styles.datePicker}
              />
            </Form.Item>
          </div>
        </Card>

        <Card
          className={styles.formSection}
          title={
            <div className={styles.sectionTitle}>
              <NumberOutlined className={styles.sectionIcon} />
              <span>Giá trị chính sách</span>
              <Tag color="blue" className={styles.optionalTag}>
                Không bắt buộc
              </Tag>
            </div>
          }
          bordered={false}
        >
          <Form.List name="values">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className={styles.valueCard} bodyStyle={{ padding: "16px" }}>
                    <div className={styles.valueHeader}>
                      <Title level={5} className={styles.valueTitle}>
                        Giá trị {name + 1}
                      </Title>
                      {fields.length > 1 ? (
                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          className={styles.deleteBtn}
                        >
                          Xóa
                        </Button>
                      ) : null}
                    </div>

                    <div className={styles.valueRow}>
                      <Form.Item
                        {...restField}
                        name={[name, "val1"]}
                        label={
                          <Space>
                            <NumberOutlined className={styles.fieldIcon} />
                            <span>Giá trị 1</span>
                          </Space>
                        }
                        className={styles.valueField}
                      >
                        <Input placeholder="Giá trị 1" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "val2"]}
                        label={
                          <Space>
                            <NumberOutlined className={styles.fieldIcon} />
                            <span>Giá trị 2</span>
                          </Space>
                        }
                        className={styles.valueField}
                      >
                        <Input placeholder="Giá trị 2" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label={
                        <Space>
                          <FileTextOutlined className={styles.fieldIcon} />
                          <span>Mô tả</span>
                        </Space>
                      }
                      className={styles.fullWidthField}
                    >
                      <Input placeholder="Mô tả" maxLength={200} showCount />
                    </Form.Item>

                    <div className={styles.valueRow}>
                      <Form.Item
                        {...restField}
                        name={[name, "unit"]}
                        label={
                          <Space>
                            <span>Đơn vị</span>
                            <Tooltip title="Đơn vị tính cho giá trị này">
                              <InfoCircleOutlined className={styles.infoIcon} />
                            </Tooltip>
                          </Space>
                        }
                        className={styles.valueField}
                      >
                        <Select
                          placeholder="Chọn đơn vị"
                          allowClear
                          className={styles.select}
                          options={[
                            { label: "Phần trăm (%)", value: "percent" },
                            { label: "VND", value: "vnd" },
                            { label: "Điểm", value: "point" },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "valueType"]}
                        label={
                          <Space>
                            <span>Loại giá trị</span>
                            <Tooltip title="Phân loại giá trị này thuộc loại nào">
                              <InfoCircleOutlined className={styles.infoIcon} />
                            </Tooltip>
                          </Space>
                        }
                        className={styles.valueField}
                      >
                        <Input placeholder="Loại giá trị" />
                      </Form.Item>
                    </div>

                    <div className={styles.valueRow}>
                      <Form.Item
                        {...restField}
                        name={[name, "hashTag"]}
                        label={
                          <Space>
                            <TagsOutlined className={styles.fieldIcon} />
                            <span>Hashtag</span>
                          </Space>
                        }
                        className={styles.valueField}
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
                          className={styles.select}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "note"]}
                        label={
                          <Space>
                            <FileTextOutlined className={styles.fieldIcon} />
                            <span>Ghi chú</span>
                          </Space>
                        }
                        className={styles.valueField}
                      >
                        <Input placeholder="Ghi chú" maxLength={100} showCount />
                      </Form.Item>
                    </div>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    className={styles.addButton}
                  >
                    Thêm giá trị
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
      </Form>
    </Modal>
  )
}

export default AddPolicyModal

