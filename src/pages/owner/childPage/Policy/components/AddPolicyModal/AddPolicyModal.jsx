import { useState, useEffect } from "react"
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  Spin,
  message,
  Space,
  Typography,
  Card,
  Tooltip,
  Radio,
} from "antd"
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TagsOutlined,
  NumberOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons"
import styles from "./AddPolicyModal.module.scss"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

const { Title, Text } = Typography

const SAMPLE_HASHTAGS = [
  "#thoigianmocua",
  "#thoigiandongcua",
  "#phuthu",
  "#khuyenmai",
  "#giamgia",
  "#ngayle",
  "#cuoituan",
  "#ngaythuong",
  "#dichvudacbiet",
]

const AddPolicyModal = ({ isOpen, onCancel, onConfirm }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hashtagOptions, setHashtagOptions] = useState([])
  const [unitChanges, setUnitChanges] = useState({})

  useEffect(() => {
    // Initialize hashtag options
    setHashtagOptions(
      SAMPLE_HASHTAGS.map((tag) => ({ label: tag, value: tag }))
    )
  }, [])

  const filterHashtags = (inputValue) => {
    const value = inputValue.startsWith("#") ? inputValue : `#${inputValue}`
    const filteredOptions = SAMPLE_HASHTAGS.filter((tag) =>
      tag.toLowerCase().includes(value.toLowerCase())
    ).map((tag) => ({ label: tag, value: tag }))

    setHashtagOptions(filteredOptions)
  }

  const renderValueInput = (fieldName, placeholder, unit) => {
    if (unit === "percent") {
      return (
        <Input
          placeholder={placeholder}
          suffix="%"
          type="number"
          min={0}
          max={100}
          step={0.01}
          onChange={(e) => {
            const value = Number.parseFloat(e.target.value)
            if (value > 100) {
              form.setFieldValue(fieldName, 100)
            }
          }}
        />
      )
    } else if (unit === "hour") {
      return <Input placeholder={placeholder} suffix="h" type="number" min={0} max={24} step={0.5} />
    } else if (unit === "day") {
      return <Input placeholder={placeholder} suffix="ngày" type="number" min={1} max={31} step={1} />
    } else if (unit === "vnd") {
      return <Input placeholder={placeholder} suffix="đ" type="number" min={0} step={1000} />
    } else {
      return <Input placeholder={placeholder} />
    }
  }

  const handleFormValuesChange = (changedValues, allValues) => {
    if (changedValues.values) {
      const changedIndex = Object.keys(changedValues.values).find(
        (index) => changedValues.values[index] && changedValues.values[index].unit !== undefined
      )

      if (changedIndex) {
        setUnitChanges((prev) => ({
          ...prev,
          [changedIndex]: Date.now(),
        }))
      }
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      if (!values.ApplyDate || !values.EndDate) {
        throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc hợp lệ")
      }

      const formattedValues = {
        ...values,
        values: values.values?.filter((value) => value && (value.val1 || value.val2 || value.description)) || [],
        CreatedDate: dayjs().format("HH:mm DD/MM/YYYY"),
        Status: 1,
        isDelete: false,
        updateBy: localStorage.getItem("user_id") || "",
      }

      await onConfirm(formattedValues)
      message.success("Thêm chính sách thành công")
      form.resetFields()
      onCancel()
    } catch (error) {
      console.error("Error adding policy:", error)
      message.error(error.message || "Có lỗi xảy ra khi thêm chính sách")
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
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Thêm mới
        </Button>,
      ]}
      width={800}
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: "24px" }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.policyForm}
        requiredMark="optional"
        onValuesChange={handleFormValuesChange}
        initialValues={{
          ApplyDate: dayjs(),
          EndDate: dayjs().add(30, "day"),
          Status: 1,
          isDelete: false,
          values: [{}],
        }}
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
            rules={[{ required: true, message: "Vui lòng nhập tên chính sách" }]}
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
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả cho chính sách" maxLength={500} showCount />
          </Form.Item>
        </Card>

        <Card
          className={styles.formSection}
          title={
            <div className={styles.sectionTitle}>
              <span>Giá trị chính sách</span>
              <Tooltip title="Thêm các giá trị cụ thể cho chính sách này (ví dụ: thời gian mở cửa, mức phụ thu, khuyến mãi)">
                <InfoCircleOutlined style={{ marginLeft: 8, color: "#1890ff" }} />
              </Tooltip>
            </div>
          }
          bordered={false}
        >
          <Form.List name="values">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    className={styles.valueCard}
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
                        Khoảng giá trị #{name + 1}
                        <Tooltip title="Mỗi khoảng giá trị bao gồm giá trị bắt đầu và kết thúc (ví dụ: từ 8:00 đến 22:00)">
                          <InfoCircleOutlined style={{ marginLeft: 8, fontSize: 14, color: "#1890ff" }} />
                        </Tooltip>
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
                            <span>Giá trị bắt đầu</span>
                            <Tooltip title="Nhập giá trị bắt đầu (ví dụ: thời gian mở cửa, mức phụ thu tối thiểu)">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                        dependencies={[["values", name, "unit"]]}
                        rules={[
                          { required: true, message: "Vui lòng nhập giá trị bắt đầu" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value) return Promise.resolve()

                              const unit = getFieldValue(["values", name, "unit"])

                              let numValue
                              try {
                                const cleanValue = value.toString().replace(/[^\d.-]/g, "")
                                numValue = Number.parseFloat(cleanValue)
                              } catch (error) {
                                return Promise.reject(new Error("Vui lòng nhập số hợp lệ"))
                              }

                              if (isNaN(numValue)) {
                                return Promise.reject(new Error("Vui lòng nhập số hợp lệ"))
                              }

                              if (unit === "percent" && numValue > 100) {
                                return Promise.reject(new Error("Phần trăm không được vượt quá 100%"))
                              }

                              if (unit === "hour" && numValue > 24) {
                                return Promise.reject(new Error("Giờ không được vượt quá 24"))
                              }

                              if (unit === "day" && numValue > 31) {
                                return Promise.reject(new Error("Ngày không được vượt quá 31"))
                              }

                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        {renderValueInput(
                          [name, "val1"],
                          "Ví dụ: 08:00, 50.000đ, 5%",
                          form.getFieldValue(["values", name, "unit"])
                        )}
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "val2"]}
                        label={
                          <Space>
                            <NumberOutlined />
                            <span>Giá trị kết thúc</span>
                            <Tooltip title="Nhập giá trị kết thúc (ví dụ: thời gian đóng cửa, mức phụ thu tối đa)">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                        dependencies={[["values", name, "unit"]]}
                        rules={[
                          { required: true, message: "Vui lòng nhập giá trị kết thúc" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value) return Promise.resolve()

                              const unit = getFieldValue(["values", name, "unit"])

                              let numValue
                              try {
                                const cleanValue = value.toString().replace(/[^\d.-]/g, "")
                                numValue = Number.parseFloat(cleanValue)
                              } catch (error) {
                                return Promise.reject(new Error("Vui lòng nhập số hợp lệ"))
                              }

                              if (isNaN(numValue)) {
                                return Promise.reject(new Error("Vui lòng nhập số hợp lệ"))
                              }

                              if (unit === "percent" && numValue > 100) {
                                return Promise.reject(new Error("Phần trăm không được vượt quá 100%"))
                              }

                              if (unit === "hour" && numValue > 24) {
                                return Promise.reject(new Error("Giờ không được vượt quá 24"))
                              }

                              if (unit === "day" && numValue > 31) {
                                return Promise.reject(new Error("Ngày không được vượt quá 31"))
                              }

                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        {renderValueInput(
                          [name, "val2"],
                          "Ví dụ: 22:00, 200.000đ, 15%",
                          form.getFieldValue(["values", name, "unit"])
                        )}
                      </Form.Item>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label={
                        <Space>
                          <FileTextOutlined />
                          <span>Mô tả giá trị</span>
                          <Tooltip title="Mô tả chi tiết về khoảng giá trị này (ví dụ: Giờ mở cửa buổi sáng, Mức phụ thu ngày lễ)">
                            <InfoCircleOutlined style={{ color: "#1890ff" }} />
                          </Tooltip>
                        </Space>
                      }
                      style={{ marginBottom: 8 }}
                    >
                      <Input.TextArea
                        rows={2}
                        placeholder="Ví dụ: Giờ mở cửa từ 8h sáng đến 10h tối, Phụ thu từ 5% đến 15% vào ngày lễ"
                        maxLength={200}
                        showCount
                      />
                    </Form.Item>

                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                      <Form.Item
                        {...restField}
                        name={[name, "unit"]}
                        label={
                          <Space>
                            <span>Đơn vị</span>
                            <Tooltip title="Đơn vị tính cho giá trị này (VND, %, giờ, điểm)">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Select placeholder="Chọn đơn vị áp dụng" allowClear>
                          <Select.Option value="percent">Phần trăm (%)</Select.Option>
                          <Select.Option value="vnd">VND</Select.Option>
                          <Select.Option value="point">Điểm</Select.Option>
                          <Select.Option value="hour">Giờ</Select.Option>
                          <Select.Option value="day">Ngày</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "valueType"]}
                        label={
                          <Space>
                            <span>Loại giá trị</span>
                            <Tooltip title="Phân loại giá trị này thuộc loại nào (ví dụ: Thời gian, Tiền, Phần trăm)">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Input placeholder="Ví dụ: Thời gian, Phụ thu, Khuyến mãi" />
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
                            <Tooltip title="Chọn hoặc nhập hashtag phù hợp với giá trị này">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Select
                          placeholder="Chọn hoặc nhập hashtag"
                          allowClear
                          showSearch
                          allowCustomValue={true}
                          style={{ width: "100%" }}
                          options={hashtagOptions}
                          onSearch={filterHashtags}
                          filterOption={false}
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "note"]}
                        label={
                          <Space>
                            <FileTextOutlined />
                            <span>Ghi chú</span>
                            <Tooltip title="Thông tin bổ sung về giá trị này">
                              <InfoCircleOutlined style={{ color: "#1890ff" }} />
                            </Tooltip>
                          </Space>
                        }
                        style={{ flex: 1, marginBottom: 8 }}
                      >
                        <Input.TextArea
                          rows={1}
                          placeholder="Thông tin bổ sung (ví dụ: Áp dụng cho khách hàng VIP)"
                          maxLength={100}
                          showCount
                        />
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
          className={styles.formSection}
          title={
            <div className={styles.sectionTitle}>
              <CalendarOutlined className={styles.sectionIcon} />
              <span>Thời gian áp dụng</span>
            </div>
          }
          bordered={false}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="ApplyDate"
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
                format="HH:mm DD/MM/YYYY"
                showTime={{ format: "HH:mm" }}
                placeholder="Chọn ngày và giờ bắt đầu"
                disabledDate={(current) => {
                  return current && current < dayjs().startOf("day")
                }}
              />
            </Form.Item>

            <Form.Item
              name="EndDate"
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
                    if (!value || !getFieldValue("ApplyDate")) {
                      return Promise.resolve()
                    }

                    const startDate = dayjs(getFieldValue("ApplyDate"))
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
                format="HH:mm DD/MM/YYYY"
                showTime={{ format: "HH:mm" }}
                placeholder="Chọn ngày và giờ kết thúc"
                disabledDate={(current) => {
                  const startDate = form.getFieldValue("ApplyDate")
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