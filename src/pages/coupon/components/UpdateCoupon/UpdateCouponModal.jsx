"use client"

import { Modal, Form, Input, DatePicker, Radio, Checkbox, Button, message } from "antd"
import dayjs from "dayjs"
import { useEffect } from "react"

const UpdateCouponModal = ({ isOpen, onCancel, onConfirm, isLoading, initialData }) => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const MAX_VALUE_LIMIT = 1000000 // Define the limit

  useEffect(() => {
    if (initialData && isOpen) {
      form.resetFields()
      form.setFieldsValue({
        name: initialData.name,
        couponCode: initialData.couponCode,
        discountBasedOn: initialData.discountBasedOn,
        amount: initialData.amount,
        maxDiscount: initialData.maxDiscount,
        isActive: initialData.isActive,
        startDate: dayjs(initialData.startDate, "DD/MM/YYYY HH:mm:ss"),
        endDate: dayjs(initialData.endDate, "DD/MM/YYYY HH:mm:ss"),
      })
    }
  }, [initialData, isOpen, form])

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day")
  }

  const disabledDateTime = (date) => {
    if (date && date.isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour()
      const currentMinute = dayjs().minute()
      const currentSecond = dayjs().second()
      return {
        disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
        disabledMinutes: (selectedHour) =>
          selectedHour === currentHour ? Array.from({ length: currentMinute }, (_, i) => i) : [],
        disabledSeconds: (selectedHour, selectedMinute) =>
          selectedHour === currentHour && selectedMinute === currentMinute
            ? Array.from({ length: currentSecond }, (_, i) => i)
            : [],
      }
    }
    return {}
  }

  const handleSubmit = async () => {
    let formValuesFromAntD
    try {
      formValuesFromAntD = await form.validateFields()
    } catch (info) {
      console.log("AntD Validate Failed:", info)
      return
    }

    const { couponCode, ...updatableValues } = formValuesFromAntD

    const formattedValues = {
      ...updatableValues,
      startDate: updatableValues.startDate.format("DD/MM/YYYY HH:mm:ss"),
      endDate: updatableValues.endDate.format("DD/MM/YYYY HH:mm:ss"),
    }

    try {
      await onConfirm(formattedValues)
    } catch (error) {
      console.log("Server update failed, form data preserved in UpdateCouponModal.")
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        title="Cập nhật mã giảm giá"
        open={isOpen}
        onCancel={() => {
          onCancel()
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              onCancel()
            }}
            disabled={isLoading}
          >
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} loading={isLoading}>
            Cập nhật
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical" name="updateCouponForm">
          <Form.Item
            name="name"
            label="Tên mã giảm giá"
            rules={[
              { required: true, message: "Hãy nhập tên mã giảm giá" },
              {
                validator: (_, value) => {
                  if (value && !value.trim()) {
                    return Promise.reject(new Error('Tên mã giảm giá không được chỉ chứa khoảng trắng!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              placeholder="Săn hè đón sale ngay" 
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ name: value });
              }}
            />
          </Form.Item>

          <Form.Item name="couponCode" label="Mã giảm giá (CODE)">
            <Input placeholder="DEAL10P" disabled />
          </Form.Item>

          <Form.Item
            name="discountBasedOn"
            label="Hình thức giảm giá"
            rules={[{ required: true, message: "Hãy chọn hình thức giảm giá" }]}
          >
            <Radio.Group>
              <Radio value="Percentage">Phần trăm (%)</Radio>
              <Radio value="Fixed">Số tiền cố định (VNĐ)</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Giá trị"
            rules={[
              { required: true, message: "Hãy nhập giá trị giảm giá" },
              {
                validator: (_, value) => {
                  if (value === null || value === undefined || value === "") return Promise.resolve()
                  const numberValue = Number(value)
                  if (isNaN(numberValue)) return Promise.reject("Giá trị phải là số")
                  if (numberValue <= 0) return Promise.reject("Giá trị phải lớn hơn 0")
                  const discountType = form.getFieldValue("discountBasedOn")
                  if (discountType === "Percentage") {
                    if (numberValue > 100) return Promise.reject("Phần trăm không được vượt quá 100%")
                  } else if (discountType === "Fixed") {
                    if (numberValue > MAX_VALUE_LIMIT)
                      return Promise.reject(`Giá trị không được vượt quá ${MAX_VALUE_LIMIT.toLocaleString()}đ`)
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Nhập giá trị giảm giá"
              min={0}
              max={form.getFieldValue("discountBasedOn") === "Percentage" ? 100 : MAX_VALUE_LIMIT}
            />
          </Form.Item>

          <Form.Item
            name="maxDiscount"
            label="Giảm giá tối đa (không bắt buộc)"
            rules={[
              {
                validator: (_, value) => {
                  if (value === null || value === undefined || value === "") return Promise.resolve()
                  const numberValue = Number(value)
                  if (isNaN(numberValue)) return Promise.reject("Giá trị phải là số")
                  if (numberValue <= 0) return Promise.reject("Giá trị phải lớn hơn 0")
                  if (numberValue > MAX_VALUE_LIMIT)
                    return Promise.reject(`Giá trị không được vượt quá ${MAX_VALUE_LIMIT.toLocaleString()}đ`)
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input type="number" placeholder="Nhập giá trị giảm giá tối đa" min={0} max={MAX_VALUE_LIMIT} />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: "Hãy chọn thời gian bắt đầu" }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm:ss" }}
              style={{ width: "100%" }}
              format="DD/MM/YYYY HH:mm:ss"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Thời gian kết thúc"
            rules={[
              { required: true, message: "Hãy chọn thời gian kết thúc" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue("startDate")) return Promise.resolve()
                  const startDate = getFieldValue("startDate")
                  const endDate = dayjs(value)
                  const startMoment = dayjs(startDate)
                  if (endDate.isBefore(startMoment) || endDate.isSame(startMoment)) {
                    return Promise.reject(new Error("Thời gian kết thúc phải sau thời gian bắt đầu"))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <DatePicker
              showTime={{ format: "HH:mm:ss" }}
              style={{ width: "100%" }}
              format="DD/MM/YYYY HH:mm:ss"
              disabledDate={(current) => {
                const startDate = form.getFieldValue("startDate")
                return disabledDate(current) || (startDate && current && current.isBefore(startDate, "day"))
              }}
              disabledTime={(date) => {
                const startDate = form.getFieldValue("startDate")
                if (startDate && date && date.isSame(startDate, "day")) {
                  return {
                    disabledHours: () => Array.from({ length: startDate.hour() }, (_, i) => i),
                    disabledMinutes: (selectedHour) =>
                      selectedHour === startDate.hour() ? Array.from({ length: startDate.minute() }, (_, i) => i) : [],
                    disabledSeconds: (selectedHour, selectedMinute) =>
                      selectedHour === startDate.hour() && selectedMinute === startDate.minute()
                        ? Array.from({ length: startDate.second() }, (_, i) => i)
                        : [],
                  }
                }
                return disabledDateTime(date)
              }}
            />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Kích hoạt?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default UpdateCouponModal
