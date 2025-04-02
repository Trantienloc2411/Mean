"use client"

import { useState, useEffect } from "react"
import { Modal, Form, Input, DatePicker, Button, Select, Spin, message, Space, Typography, Card, Tooltip } from "antd"
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TagsOutlined,
  NumberOutlined,
  FileTextOutlined,
} from "@ant-design/icons"
import styles from "./AddPolicyModal.module.scss"
import { useGetAllPolicySystemCategoriesQuery } from "../../../../redux/services/policySystemCategoryApi"
import { useCreatePolicySystemMutation } from "../../../../redux/services/policySystemApi"
import { useGetStaffByIdQuery } from "../../../../redux/services/staffApi"
import dayjs from "dayjs"

const { Title, Text } = Typography

const AddPolicyModal = ({ isOpen, onCancel }) => {
  const [form] = Form.useForm()
  const [createPolicy, { isLoading: isCreating }] = useCreatePolicySystemMutation()
  const [submitError, setSubmitError] = useState(null)
  const [staffData, setStaffData] = useState(null)

  const getToken = () => localStorage.getItem("access_token")
  const getCurrentUser = () => {
    try {
      const userId = localStorage.getItem("user_id")
      const userRole = localStorage.getItem("user_role")

      if (!userId || !userRole) {
        return null
      }
      return {
        id: userId,
        role: userRole,
      }
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  const currentUser = getCurrentUser()
  const {
    data: staffResponse,
    isLoading: isLoadingStaff,
    error: staffError,
  } = useGetStaffByIdQuery(currentUser?.id, {
    skip: !currentUser?.id,
  })

  useEffect(() => {
    if (staffResponse && !isLoadingStaff) {
      setStaffData(staffResponse.data || staffResponse)
    }
  }, [staffResponse, isLoadingStaff])

  useEffect(() => {
    if (isOpen && staffData?.id) {
      form.setFieldValue("staffId", staffData.id)
    }
  }, [isOpen, staffData, form])

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetAllPolicySystemCategoriesQuery()

  const categoryOptions = (() => {
    if (!categoriesResponse) return []
    const categoriesData = categoriesResponse.data || categoriesResponse

    if (!Array.isArray(categoriesData)) return []

    return categoriesData.map((category) => ({
      label: category.name || category.categoryName,
      value: category.id || category._id,
    }))
  })()

  const handleSubmit = async () => {
    setSubmitError(null)

    try {
      const token = getToken()
      if (!token) {
        message.error("Vui lòng đăng nhập để thực hiện thao tác này")
        return
      }

      if (!staffData) {
        message.error("Không thể xác định thông tin nhân viên")
        return
      }

      const values = await form.validateFields()

      if (!values.startDate || !values.endDate) {
        throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc hợp lệ")
      }

      const startDateISO = values.startDate ? values.startDate.toISOString() : null
      const endDateISO = values.endDate ? values.endDate.toISOString() : null

      // Format the values array from form data
      const valuesArray = values.values || []

      // updateBy is completely omitted from the payload
      const formattedValues = {
        staffId: staffData.id,
        policySystemCategoryId: values.policySystemCategoryId,
        name: values.name,
        description: values.description || "",
        values: valuesArray,
        startDate: startDateISO,
        endDate: endDateISO,
        isActive: true,
      }

      console.log("Final payload:", formattedValues)

      const response = await createPolicy(formattedValues).unwrap()
      console.log("API response:", response)

      message.success("Tạo chính sách thành công")
      form.resetFields()
      onCancel()
    } catch (error) {
      console.error("Submit error:", error)
      setSubmitError(error.message || "Có lỗi xảy ra khi tạo chính sách")
    }
  }

  if (isLoadingStaff) {
    return (
      <div
        className="loading-container"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}
      >
        <Spin size="large" tip="Đang tải thông tin nhân viên..." />
      </div>
    )
  }

  if (staffError) {
    return (
      <div className="error-container" style={{ padding: "20px", textAlign: "center", color: "#ff4d4f" }}>
        <Title level={4} style={{ color: "#ff4d4f" }}>
          Lỗi
        </Title>
        <Text>Không thể tải thông tin nhân viên</Text>
      </div>
    )
  }

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <PlusOutlined style={{ marginRight: 8 }} />
          <span>Thêm chính sách mới</span>
        </div>
      }
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={isCreating}>
          Thêm chính sách
        </Button>,
      ]}
      width={800}
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: "24px" }}
      destroyOnClose
    >
      {submitError && (
        <div
          style={{
            color: "#ff4d4f",
            marginBottom: "16px",
            padding: "8px 12px",
            background: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "4px",
          }}
        >
          <Text strong style={{ color: "#ff4d4f" }}>
            Lỗi:{" "}
          </Text>
          {submitError}
        </div>
      )}

      <Form form={form} layout="vertical" name="addPolicyForm" className={styles.modalForm} requiredMark="optional">
        <Form.Item
          name="staffId"
          label="ID nhân viên"
          rules={[{ required: true, message: "ID nhân viên là bắt buộc" }]}
          hidden
        >
          <Input disabled />
        </Form.Item>

        <Card
          title="Thông tin cơ bản"
          bordered={false}
          style={{ marginBottom: 24 }}
          headStyle={{ backgroundColor: "#f5f5f5", padding: "12px 16px" }}
        >
          <Form.Item
            name="policySystemCategoryId"
            label={
              <Space>
                <span>Danh mục chính sách</span>
                <Tooltip title="Chọn danh mục phù hợp cho chính sách này">
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: "Vui lòng chọn danh mục chính sách" }]}
          >
            <Select
              placeholder="Chọn danh mục chính sách"
              options={categoryOptions}
              loading={isLoadingCategories}
              showSearch
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              notFoundContent={isLoadingCategories ? <Spin size="small" /> : null}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label={
              <Space>
                <span>Tên chính sách</span>
                <Tooltip title="Nhập tên chính sách ngắn gọn và dễ hiểu">
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: "Vui lòng nhập tên chính sách" }]}
          >
            <Input placeholder="Nhập tên chính sách" maxLength={100} showCount />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <Space>
                <span>Mô tả</span>
                <Tooltip title="Mô tả chi tiết về chính sách này">
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                </Tooltip>
              </Space>
            }
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả cho chính sách" maxLength={500} showCount />
          </Form.Item>
        </Card>

        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Giá trị chính sách</span>
              <Tooltip title="Thêm các giá trị cụ thể cho chính sách này">
                <InfoCircleOutlined style={{ marginLeft: 8, color: "#1890ff" }} />
              </Tooltip>
            </div>
          }
          bordered={false}
          style={{ marginBottom: 24 }}
          headStyle={{ backgroundColor: "#f5f5f5", padding: "12px 16px" }}
        >
          {/* Values list - dynamic fields */}
          <Form.List name="values">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    style={{
                      marginBottom: 16,
                      borderColor: "#d9d9d9",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                    bodyStyle={{ padding: "16px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: 8,
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        Giá trị #{name + 1}
                      </Title>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        tooltip="Xóa giá trị này"
                      />
                    </div>

                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                      <Form.Item
                        {...restField}
                        name={[name, "val1"]}
                        label={
                          <Space>
                            <NumberOutlined />
                            <span>Giá trị 1</span>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Input placeholder="Nhập giá trị 1" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "val2"]}
                        label={
                          <Space>
                            <NumberOutlined />
                            <span>Giá trị 2</span>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Input placeholder="Nhập giá trị 2" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label={
                        <Space>
                          <FileTextOutlined />
                          <span>Mô tả giá trị</span>
                        </Space>
                      }
                      style={{ marginBottom: 8 }}
                    >
                      <Input.TextArea rows={2} placeholder="Mô tả cho giá trị này" maxLength={200} showCount />
                    </Form.Item>

                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                      <Form.Item
                        {...restField}
                        name={[name, "unit"]}
                        label={
                          <Space>
                            <span>Đơn vị</span>
                            <Tooltip title="Đơn vị tính cho giá trị này">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Select placeholder="Chọn đơn vị" allowClear>
                          <Select.Option value="percent">Phần trăm (%)</Select.Option>
                          <Select.Option value="vnd">VND</Select.Option>
                          <Select.Option value="point">Điểm</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "valueType"]}
                        label={
                          <Space>
                            <span>Loại giá trị</span>
                            <Tooltip title="Phân loại giá trị này thuộc loại nào">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Input placeholder="Nhập loại giá trị" />
                      </Form.Item>
                    </div>

                    <div style={{ display: "flex", gap: "16px" }}>
                      <Form.Item
                        {...restField}
                        name={[name, "hashTag"]}
                        label={
                          <Space>
                            <TagsOutlined />
                            <span>Hashtag</span>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Input placeholder="Nhập hashtag" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "note"]}
                        label={
                          <Space>
                            <FileTextOutlined />
                            <span>Ghi chú</span>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Input.TextArea rows={1} placeholder="Nhập ghi chú" maxLength={100} showCount />
                      </Form.Item>
                    </div>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ height: "40px" }}>
                    Thêm giá trị
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <CalendarOutlined style={{ marginRight: 8 }} />
              <span>Thời gian áp dụng</span>
            </div>
          }
          bordered={false}
          headStyle={{ backgroundColor: "#f5f5f5", padding: "12px 16px" }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="startDate"
              label={
                <Space>
                  <span>Ngày bắt đầu</span>
                  <Tooltip title="Thời điểm bắt đầu áp dụng chính sách">
                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                  </Tooltip>
                </Space>
              }
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve()

                    const now = dayjs().startOf("minute")
                    const selectedDate = dayjs(value)

                    if (selectedDate.isBefore(now)) {
                      return Promise.reject(new Error("Ngày bắt đầu phải sau thời điểm hiện tại"))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY HH:mm:ss"
                showTime={{
                  defaultValue: dayjs().startOf("minute"),
                  format: "HH:mm:ss",
                }}
                placeholder="Chọn ngày và giờ bắt đầu"
                disabledDate={(current) => {
                  return current && current < dayjs().startOf("day")
                }}
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label={
                <Space>
                  <span>Ngày kết thúc</span>
                  <Tooltip title="Thời điểm kết thúc áp dụng chính sách">
                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                  </Tooltip>
                </Space>
              }
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue("startDate")) {
                      return Promise.resolve()
                    }

                    const startDate = dayjs(getFieldValue("startDate"))
                    const endDate = dayjs(value)

                    if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
                      return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu"))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY HH:mm:ss"
                showTime={{
                  defaultValue: dayjs().startOf("minute"),
                  format: "HH:mm:ss",
                }}
                placeholder="Chọn ngày và giờ kết thúc"
                disabledDate={(current) => {
                  const startDate = form.getFieldValue("startDate")
                  return (
                    current &&
                    (current < dayjs().startOf("day") || (startDate && current < dayjs(startDate).startOf("day")))
                  )
                }}
              />
            </Form.Item>
          </div>
        </Card>
      </Form>
    </Modal>
  )
}

export default AddPolicyModal

