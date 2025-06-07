import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  message,
  Space,
  Typography,
  Card,
  Tooltip,
  Spin,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TagsOutlined,
  NumberOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import styles from "./UpdatePolicyModal.module.scss";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Title } = Typography;

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
];

const UpdatePolicyModal = ({
  isOpen,
  onCancel,
  onConfirm,
  initialValues,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hashtagOptions, setHashtagOptions] = useState([]);
  const [customHashtags, setCustomHashtags] = useState([]);
  const [unitChanges, setUnitChanges] = useState({});
  const disabledInput =
    initialValues?.data?.policyTitle == "Preparing Room Policy";

  useEffect(() => {
    const initialOptions = SAMPLE_HASHTAGS.map((tag) => ({
      label: tag,
      value: tag,
    }));
    setHashtagOptions(initialOptions);
  }, []);

  const filterHashtags = (inputValue) => {
    const searchValue = inputValue.toLowerCase();
    const allOptions = [...SAMPLE_HASHTAGS, ...customHashtags];

    let filtered = allOptions.filter((tag) =>
      tag.toLowerCase().includes(searchValue)
    );

    if (inputValue) {
      const formattedTag = inputValue.startsWith("#")
        ? inputValue
        : `#${inputValue}`;
      if (!allOptions.includes(formattedTag)) {
        filtered.push(formattedTag);
      }
    }

    setHashtagOptions(
      filtered.map((tag) => ({
        label: tag,
        value: tag,
      }))
    );
  };

  const handleHashtagChange = (value, name) => {
    if (value) {
      const formattedTag = value.startsWith("#") ? value : `#${value}`;

      if (
        !SAMPLE_HASHTAGS.includes(formattedTag) &&
        !customHashtags.includes(formattedTag)
      ) {
        setCustomHashtags((prev) => [...prev, formattedTag]);
      }

      form.setFieldValue(["values", name, "hashTag"], formattedTag);
    } else {
      form.setFieldValue(["values", name, "hashTag"], undefined);
    }
  };

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
        />
      );
    } else if (unit === "hour") {
      return (
        <Input
          placeholder={placeholder}
          suffix="h"
          type="number"
          min={0}
          max={24}
          step={0.5}
        />
      );
    } else if (unit === "day") {
      return (
        <Input
          placeholder={placeholder}
          suffix="ngày"
          type="number"
          min={1}
          max={31}
          step={1}
        />
      );
    } else if (unit === "vnd") {
      return (
        <Input
          placeholder={placeholder}
          suffix="đ"
          type="number"
          min={0}
          step={1000}
        />
      );
    } else if (unit === "min") {
      return (
        <Input
          placeholder={placeholder}
          suffix="phút"
          type="number"
          min={0}
          max={1440}
          step={1}
        />
      );
    } else {
      return <Input placeholder={placeholder} />;
    }
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    if (changedValues.values) {
      const changedIndex = Object.keys(changedValues.values).find(
        (index) =>
          changedValues.values[index] &&
          changedValues.values[index].unit !== undefined
      );

      if (changedIndex) {
        setUnitChanges((prev) => ({
          ...prev,
          [changedIndex]: Date.now(),
        }));
      }
    }
  };

  const getInitialValues = () => {
    if (!initialValues) return { values: [{}] };

    const policyData = initialValues.data || initialValues;
    console.log("Initial policy data:", policyData);

    const processValues = (values) => {
      if (!Array.isArray(values)) return [{}];
      return values.map((value) => ({
        val: value.val || "",
        description: value.description || "",
        unit: value.unit || "",
        valueType: value.valueType || "",
        hashTag: value.hashTag || "",
        note: value.note || "",
      }));
    };

    let policyValues = [];
    if (Array.isArray(policyData.values)) {
      policyValues = processValues(policyData.values);
    }

    const formValues = {
      Name: policyData.policyTitle || "",
      Description: policyData.policyDescription || "",
      ApplyDate: policyData.startDate
        ? dayjs(policyData.startDate).isValid()
          ? dayjs(policyData.startDate)
          : dayjs(policyData.startDate, "DD/MM/YYYY HH:mm:ss")
        : dayjs(),
      EndDate: policyData.endDate
        ? dayjs(policyData.endDate).isValid()
          ? dayjs(policyData.endDate)
          : dayjs(policyData.endDate, "DD/MM/YYYY HH:mm:ss")
        : dayjs().add(1, "month"),
      Status: policyData.status || 1,
      values: policyValues.length > 0 ? policyValues : [{}],
    };

    console.log("Formatted form values:", formValues);
    return formValues;
  };

  useEffect(() => {
    if (!isLoading && initialValues) {
      console.log("Setting form values with initialValues:", initialValues);
      const values = getInitialValues();
      form.setFieldsValue(values);
    }
  }, [isLoading, initialValues, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log("Form values to submit:", values);

      if (!values.ApplyDate || !values.EndDate) {
        throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc hợp lệ");
      }

      const formattedValues = {
        ...values,
        values: values.values?.filter(
          (value) => value && (value.val || value.description)
        ) || [],
        CreatedDate: initialValues?.CreatedDate || dayjs().format("HH:mm DD/MM/YYYY"),
        Status: values.Status || initialValues?.Status || 1,
        isDelete: initialValues?.isDelete || false,
        updateBy: localStorage.getItem("user_id") || initialValues?.updateBy || "",
        id: initialValues?._id || initialValues?.id,
        startDate: values.ApplyDate ? dayjs(values.ApplyDate).format("DD/MM/YYYY HH:mm:ss") : null,
        endDate: values.EndDate ? dayjs(values.EndDate).format("DD/MM/YYYY HH:mm:ss") : null
      };

      console.log("Formatted values to submit:", formattedValues);

      try {
        await onConfirm(formattedValues);
        // message.success("Cập nhật chính sách thành công");
        onCancel();
      } catch (apiError) {
        console.error("API error:", apiError);
        throw new Error(apiError.message || "Lỗi khi gọi API cập nhật");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      message.error(error.message || "Có lỗi xảy ra khi cập nhật chính sách");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className={styles.updatePolicyModal}
      title={
        <div className={styles.modalTitle}>
          <AppstoreOutlined className={styles.titleIcon} />
          <span>Chỉnh Sửa Chính Sách</span>
        </div>
      }
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            onCancel();
          }}
        >
          Huỷ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Cập nhật
        </Button>,
      ]}
      width={800}
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: "24px" }}
      destroyOnClose
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <p>Đang tải dữ liệu chính sách...</p>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          className={styles.policyForm}
          requiredMark="optional"
          onValuesChange={handleFormValuesChange}
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
              rules={[
                { required: true, message: "Vui lòng nhập tên chính sách" },
                {
                  validator: (_, value) => {
                    if (value && !value.trim()) {
                      return Promise.reject(new Error('Tên chính sách không được chỉ chứa khoảng trắng!'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                placeholder="Nhập tên chính sách"
                maxLength={100}
                showCount
                disabled={disabledInput}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  form.setFieldsValue({ Name: value });
                }}
              />
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
              rules={[
                { required: true, message: "Vui lòng nhập mô tả" },
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
              <Input.TextArea
                rows={3}
                placeholder="Nhập mô tả cho chính sách"
                maxLength={500}
                disabled={disabledInput}
                showCount
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  form.setFieldsValue({ Description: value });
                }}
              />
            </Form.Item>

            {initialValues?.CreatedDate && (
              <Form.Item label="Ngày tạo">
                <Input
                  value={initialValues.CreatedDate}
                  disabled
                  className={styles.disabledInput}
                />
              </Form.Item>
            )}
          </Card>

          {disabledInput && (
            <Card
              className={styles.formSection}
              title={
                <div className={styles.sectionTitle}>
                  <span>Giá trị chính sách</span>
                  <Tooltip title="Thêm các giá trị cụ thể cho chính sách này">
                    <InfoCircleOutlined
                      style={{ marginLeft: 8, color: "#1890ff" }}
                    />
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
                            Giá trị chính sách
                            {/* {name + 1} */}
                            <Tooltip title="Thêm giá trị cho chính sách">
                              <InfoCircleOutlined
                                style={{
                                  marginLeft: 8,
                                  fontSize: 14,
                                  color: "#1890ff",
                                }}
                              />
                            </Tooltip>
                          </Title>
                          {/* <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        /> */}
                        </div>

                        <Form.Item
                          {...restField}
                          name={[name, "val"]}
                          label={
                            <Space>
                              <NumberOutlined />
                              <span>Giá trị</span>
                              <Tooltip title="Nhập giá trị cho chính sách">
                                <InfoCircleOutlined
                                  style={{ color: "#1890ff" }}
                                />
                              </Tooltip>
                            </Space>
                          }
                          style={{ marginBottom: 8 }}
                          dependencies={[["values", name, "unit"]]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập giá trị",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value) return Promise.resolve();
                                const unit = getFieldValue([
                                  "values",
                                  name,
                                  "unit",
                                ]);
                                let numValue;

                                try {
                                  const cleanValue = value
                                    .toString()
                                    .replace(/[^\d.-]/g, "");
                                  numValue = Number.parseFloat(cleanValue);
                                } catch (error) {
                                  return Promise.reject(
                                    new Error("Vui lòng nhập số hợp lệ")
                                  );
                                }

                                if (isNaN(numValue)) {
                                  return Promise.reject(
                                    new Error("Vui lòng nhập số hợp lệ")
                                  );
                                }

                                if (unit === "percent" && numValue < 0) {
                                  return Promise.reject(
                                    new Error("Phần trăm không được nhỏ hơn 0%")
                                  );
                                }
                                if (unit === "hour" && numValue < 0) {
                                  return Promise.reject(
                                    new Error("Giờ không được nhỏ hơn 0")
                                  );
                                }
                                if (unit === "day" && numValue < 1) {
                                  return Promise.reject(
                                    new Error("Ngày không được nhỏ hơn 1")
                                  );
                                }
                                if (unit === "vnd" && numValue < 0) {
                                  return Promise.reject(
                                    new Error("Số tiền không được âm")
                                  );
                                }
                                if (unit === "min" && numValue < 0) {
                                  return Promise.reject(
                                    new Error("Phút không được nhỏ hơn 0")
                                  );
                                }

                                if (unit === "percent" && numValue > 100) {
                                  return Promise.reject(
                                    new Error(
                                      "Phần trăm không được vượt quá 100%"
                                    )
                                  );
                                }
                                if (unit === "hour" && numValue > 24) {
                                  return Promise.reject(
                                    new Error("Giờ không được vượt quá 24")
                                  );
                                }
                                if (unit === "day" && numValue > 31) {
                                  return Promise.reject(
                                    new Error("Ngày không được vượt quá 31")
                                  );
                                }
                                if (unit === "min" && numValue > 1440) {
                                  return Promise.reject(
                                    new Error("Phút không được vượt quá 1440")
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          {renderValueInput(
                            [name, "val"],
                            "Ví dụ: 50.000đ, 5%, 10 điểm",
                            form.getFieldValue(["values", name, "unit"])
                          )}
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          label={
                            <Space>
                              <FileTextOutlined />
                              <span>Mô tả giá trị</span>
                              <Tooltip title="Mô tả chi tiết về giá trị này">
                                <InfoCircleOutlined
                                  style={{ color: "#1890ff" }}
                                />
                              </Tooltip>
                            </Space>
                          }
                          style={{ marginBottom: 8 }}
                        >
                          <Input.TextArea
                            rows={2}
                            placeholder="Ví dụ: Phụ thu 15% vào ngày lễ"
                            maxLength={200}
                            showCount
                          />
                        </Form.Item>

                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            marginBottom: "16px",
                          }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "unit"]}
                            label={
                              <Space>
                                <span>Đơn vị</span>
                                <Tooltip title="Đơn vị tính cho giá trị này">
                                  <InfoCircleOutlined
                                    style={{ color: "#1890ff" }}
                                  />
                                </Tooltip>
                              </Space>
                            }
                            style={{ flex: 1, marginBottom: 8 }}
                          >
                            <Select
                              placeholder="Chọn đơn vị áp dụng"
                              allowClear
                              disabled={disabledInput}
                            >
                              <Select.Option value="percent">
                                Phần trăm (%)
                              </Select.Option>
                              <Select.Option value="vnd">VND</Select.Option>
                              <Select.Option value="point">Điểm</Select.Option>
                              <Select.Option value="hour">Giờ</Select.Option>
                              <Select.Option value="min">Phút</Select.Option>
                              <Select.Option value="day">Ngày</Select.Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "valueType"]}
                            label={
                              <Space>
                                <span>Loại giá trị</span>
                                <Tooltip title="Phân loại giá trị này">
                                  <InfoCircleOutlined
                                    style={{ color: "#1890ff" }}
                                  />
                                </Tooltip>
                              </Space>
                            }
                            style={{ flex: 1, marginBottom: 8 }}
                          >
                            <Input
                              placeholder="Ví dụ: Thời gian, Phụ thu"
                              disabled={disabledInput}
                            />
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
                                <Tooltip title="Chọn hoặc nhập hashtag phù hợp">
                                  <InfoCircleOutlined
                                    style={{ color: "#1890ff" }}
                                  />
                                </Tooltip>
                              </Space>
                            }
                            style={{ flex: 1, marginBottom: 8 }}
                          >
                            <Select
                              disabled={disabledInput}
                              showSearch
                              placeholder="Chọn hoặc nhập hashtag"
                              options={hashtagOptions}
                              onSearch={filterHashtags}
                              filterOption={false}
                              onChange={(value) =>
                                handleHashtagChange(value, name)
                              }
                              onBlur={() => {
                                const currentValue = form.getFieldValue([
                                  "values",
                                  name,
                                  "hashTag",
                                ]);
                                if (
                                  currentValue &&
                                  !currentValue.startsWith("#")
                                ) {
                                  form.setFieldValue(
                                    ["values", name, "hashTag"],
                                    `#${currentValue}`
                                  );
                                }
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "note"]}
                            label={
                              <Space>
                                <FileTextOutlined />
                                <span>Ghi chú</span>
                                <Tooltip title="Thông tin bổ sung">
                                  <InfoCircleOutlined
                                    style={{ color: "#1890ff" }}
                                  />
                                </Tooltip>
                              </Space>
                            }
                            style={{ flex: 1, marginBottom: 8 }}
                          >
                            <Input.TextArea
                              rows={1}
                              disabled={disabledInput}
                              placeholder="Thông tin bổ sung"
                              maxLength={100}
                              showCount
                            />
                          </Form.Item>
                        </div>
                      </Card>
                    ))}
                    {/* <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ height: "40px" }}
                    >
                      Thêm giá trị
                    </Button>
                  </Form.Item> */}
                  </>
                )}
              </Form.List>
            </Card>
          )}

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
                    <Tooltip title="Thời điểm bắt đầu áp dụng">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                style={{ flex: 1 }}
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="HH:mm DD/MM/YYYY"
                  showTime={{ format: "HH:mm" }}
                  placeholder="Chọn ngày và giờ bắt đầu"
                />
              </Form.Item>

              <Form.Item
                name="EndDate"
                label={
                  <Space>
                    <span>Ngày kết thúc</span>
                    <Tooltip title="Thời điểm kết thúc áp dụng">
                      <InfoCircleOutlined style={{ color: "#1890ff" }} />
                    </Tooltip>
                  </Space>
                }
                style={{ flex: 1 }}
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue("ApplyDate"))
                        return Promise.resolve();
                      const startDate = dayjs(getFieldValue("ApplyDate"));
                      const endDate = dayjs(value);
                      if (
                        endDate.isBefore(startDate) ||
                        endDate.isSame(startDate)
                      ) {
                        return Promise.reject(
                          new Error("Ngày kết thúc phải sau ngày bắt đầu")
                        );
                      }
                      return Promise.resolve();
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
                    const startDate = form.getFieldValue("ApplyDate");
                    return (
                      current < dayjs().startOf("day") ||
                      (startDate && current < dayjs(startDate).startOf("day"))
                    );
                  }}
                />
              </Form.Item>
            </div>
          </Card>
        </Form>
      )}
    </Modal>
  );
};

export default UpdatePolicyModal;
