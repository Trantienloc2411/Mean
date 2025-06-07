import { useState, useEffect } from "react";
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
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TagsOutlined,
  NumberOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import styles from "./UpdatePolicyModal.module.scss";
import { useGetAllPolicySystemCategoriesQuery } from "../../../../redux/services/policySystemCategoryApi";
import { useUpdatePolicySystemMutation } from "../../../../redux/services/policySystemApi";
import { useGetStaffByIdQuery } from "../../../../redux/services/staffApi";
import dayjs from "dayjs";
import { Switch } from "antd";

const { Title, Text } = Typography;

const UpdatePolicyModal = ({ isOpen, onCancel, initialValues }) => {
  console.log(initialValues);

  const [form] = Form.useForm();
  const [updatePolicy, { isLoading: isUpdating }] =
    useUpdatePolicySystemMutation();
  const [submitError, setSubmitError] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [unitChanges, setUnitChanges] = useState({});
  const [endDate, setEndDate] = useState(
    initialValues?.endDate ? dayjs(initialValues.endDate) : null
  );
  const [startDate, setStartDate] = useState(
    initialValues?.startDate ? dayjs(initialValues.startDate) : null
  );

  const getToken = () => localStorage.getItem("access_token");
  const getCurrentUser = () => {
    try {
      const userId = localStorage.getItem("user_id");
      const userRole = localStorage.getItem("user_role");

      if (!userId || !userRole) {
        return null;
      }
      return {
        id: userId,
        role: userRole,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const {
    data: staffResponse,
    isLoading: isLoadingStaff,
    error: staffError,
  } = useGetStaffByIdQuery(currentUser?.id, {
    skip: !currentUser?.id,
  });

  useEffect(() => {
    if (staffResponse && !isLoadingStaff) {
      setStaffData(staffResponse.data || staffResponse);
    }
  }, [staffResponse, isLoadingStaff]);

  useEffect(() => {
    if (isOpen && staffData?.id) {
      form.setFieldValue("staffId", staffData.id);
    }
  }, [isOpen, staffData, form]);

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetAllPolicySystemCategoriesQuery();

  const categoryOptions = (() => {
    if (!categoriesResponse) return [];
    const categoriesData = categoriesResponse.data || categoriesResponse;

    if (!Array.isArray(categoriesData)) return [];

    return categoriesData.map((category) => ({
      label: category.name || category.categoryName,
      value: category.id || category._id,
    }));
  })();

  const categoryOptionsNotSystem = (() => {
    if (!categoriesResponse) return [];
    const categoriesData = categoriesResponse.data || categoriesResponse;

    if (!Array.isArray(categoriesData)) return [];

    return categoriesData
      .filter(
        (category) =>
          category.categoryName !== "System" && category.name !== "Không dùng"
      )
      .map((category) => ({
        label: category.name || category.categoryName,
        value: category.id || category._id,
      }));
  })();

  useEffect(() => {
    if (initialValues) {
      const formattedInitialValues = {
        ...initialValues,
        startDate: initialValues.startDate
          ? dayjs(initialValues.startDate, "DD/MM/YYYY HH:mm:ss")
          : null,
        endDate: initialValues.endDate
          ? dayjs(initialValues.endDate, "DD/MM/YYYY HH:mm:ss")
          : null,
        policySystemCategoryId:
          initialValues.policySystemCategoryId?._id ||
          initialValues.policySystemCategoryId,
        isActive: initialValues.isActive,
      };
      form.setFieldsValue(formattedInitialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    setSubmitError(null);

    try {
      const token = getToken();
      if (!token) {
        message.error("Vui lòng đăng nhập để thực hiện thao tác này");
        return;
      }

      if (!staffData) {
        message.error("Không thể xác định thông tin nhân viên");
        return;
      }

      const values = await form.validateFields();

      if (!values.startDate || !values.endDate) {
        throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc hợp lệ");
      }

      const startDateISO = values.startDate
        ? values.startDate.toISOString()
        : null;
      const endDateISO = values.endDate ? values.endDate.toISOString() : null;

      const valuesArray = values.values || [];

      const processedValuesArray = valuesArray.map((item) => {
        return {
          ...item,
          hashTag: item.hashTag || "",
        };
      });

      const formattedValues = {
        id: initialValues._id,
        staffId: staffData.id,
        policySystemCategoryId: values.policySystemCategoryId,
        name: values.name,
        description: values.description || "",
        values: processedValuesArray,
        startDate: startDateISO,
        endDate: endDateISO,
        isActive: values.isActive,
      };

      console.log("Final payload:", formattedValues);

      const response = await updatePolicy(formattedValues).unwrap();
      console.log("API response:", response);

      message.success("Cập nhật chính sách thành công");
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(error.message || "Có lỗi xảy ra khi cập nhật chính sách");
    }
  };

  if (isLoadingStaff) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin nhân viên..." />
      </div>
    );
  }

  if (staffError) {
    return (
      <div
        className="error-container"
        style={{ padding: "20px", textAlign: "center", color: "#ff4d4f" }}
      >
        <Title level={4} style={{ color: "#ff4d4f" }}>
          Lỗi
        </Title>
        <Text>Không thể tải thông tin nhân viên</Text>
      </div>
    );
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

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <PlusOutlined style={{ marginRight: 8 }} />
          <span>Cập nhật chính sách</span>
        </div>
      }
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isUpdating}
        >
          Cập nhật chính sách
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

      <Form
        form={form}
        layout="vertical"
        name="updatePolicyForm"
        className={styles.modalForm}
        requiredMark="optional"
        onValuesChange={handleFormValuesChange}
      >
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
            rules={[
              { required: true, message: "Vui lòng chọn danh mục chính sách" },
            ]}
          >
            {initialValues?.policySystemCategoryId?.categoryName == "System" ? (
              <Select
                placeholder="Chọn danh mục chính sách"
                disabled
                options={categoryOptions}
                loading={isLoadingCategories}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                notFoundContent={
                  isLoadingCategories ? <Spin size="small" /> : null
                }
                style={{ width: "100%" }}
              />
            ) : (
              <Select
                placeholder="Chọn danh mục chính sách"
                options={categoryOptionsNotSystem}
                loading={isLoadingCategories}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                notFoundContent={
                  isLoadingCategories ? <Spin size="small" /> : null
                }
                style={{ width: "100%" }}
              />
            )}
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
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ name: value });
              }}
            />
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
            rules={[
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
              maxLength={3000}
              showCount
              onBlur={(e) => {
                const value = e.target.value.trim();
                form.setFieldsValue({ description: value });
              }}
            />
          </Form.Item>
          {initialValues?.policySystemCategoryId?.categoryName !== "System" && (
            <Form.Item
              name="isActive"
              label="Trạng thái hoạt động"
              valuePropName="checked"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Switch
                checkedChildren="Hoạt động"
                unCheckedChildren="Ngừng hoạt động"
              />
            </Form.Item>
          )}
        </Card>

        {initialValues?.policySystemCategoryId?.categoryName == "System" && (
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Giá trị chính sách</span>
                {/* <Tooltip title="Thêm các giá trị cụ thể cho chính sách này (ví dụ: thời gian mở cửa, mức phụ thu, khuyến mãi)">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, color: "#1890ff" }}
                  />
                </Tooltip> */}
              </div>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
            headStyle={{ backgroundColor: "#f5f5f5", padding: "12px 16px" }}
          >
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
                          Khoảng giá trị #{name + 1}
                          <Tooltip title="Mỗi khoảng giá trị bao gồm giá trị bắt đầu và kết thúc (ví dụ: từ 8:00 đến 22:00)">
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
                          tooltip="Xóa giá trị này"
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
                          { required: true, message: "Vui lòng nhập giá trị" },
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
                                  new Error("Ngày không được nhỏ hơn 1")
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
                            <Tooltip title="Mô tả chi tiết về khoảng giá trị này (ví dụ: Giờ mở cửa buổi sáng, Mức phụ thu ngày lễ)">
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
                          placeholder="Ví dụ: Giờ mở cửa từ 8h sáng đến 10h tối, Phụ thu từ 5% đến 15% vào ngày lễ"
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
                              <Tooltip title="Đơn vị tính cho giá trị này (VND, %, giờ, điểm, phút)">
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
                            disabled
                          >
                            <Select.Option value="percent">
                              Phần trăm (%)
                            </Select.Option>
                            <Select.Option value="vnd">VND</Select.Option>
                            <Select.Option value="point">Điểm</Select.Option>
                            <Select.Option value="min">Phút</Select.Option>
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
                                <InfoCircleOutlined
                                  style={{ color: "#1890ff" }}
                                />
                              </Tooltip>
                            </Space>
                          }
                          style={{ flex: 1, marginBottom: 8 }}
                        >
                          <Input
                            readOnly
                            placeholder="Ví dụ: Thời gian, Phụ thu, Khuyến mãi"
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
                              <Tooltip title="Chọn hoặc nhập hashtag phù hợp với giá trị này">
                                <InfoCircleOutlined
                                  style={{ color: "#1890ff" }}
                                />
                              </Tooltip>
                            </Space>
                          }
                          style={{ flex: 1, marginBottom: 8 }}
                        >
                          <Select
                            placeholder="Chọn hoặc nhập hashtag"
                            allowClear
                            disabled
                            showSearch
                            mode="tags"
                            maxTagCount={1}
                            tokenSeparators={[","]}
                            style={{ width: "100%" }}
                            onChange={(value) => {
                              if (Array.isArray(value) && value.length > 1) {
                                const lastValue = value[value.length - 1];
                                form.setFieldValue(
                                  ["values", name, "hashTag"],
                                  [lastValue]
                                );
                              }
                            }}
                            options={[
                              {
                                value: "thoigianmocua",
                                label: "#thoigianmocua",
                              },
                              {
                                value: "thoigiandongcua",
                                label: "#thoigiandongcua",
                              },
                              { value: "phuthu", label: "#phuthu" },
                              { value: "khuyenmai", label: "#khuyenmai" },
                              { value: "giamgia", label: "#giamgia" },
                              { value: "ngayle", label: "#ngayle" },
                              { value: "cuoituan", label: "#cuoituan" },
                              { value: "ngaythuong", label: "#ngaythuong" },
                              {
                                value: "dichvudacbiet",
                                label: "#dichvudacbiet",
                              },
                            ]}
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
                                <InfoCircleOutlined
                                  style={{ color: "#1890ff" }}
                                />
                              </Tooltip>
                            </Space>
                          }
                          style={{ flex: 1, marginBottom: 8 }}
                        >
                          <Input.TextArea
                            readOnly
                            rows={1}
                            placeholder="Thông tin bổ sung (ví dụ: Áp dụng cho khách hàng VIP)"
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
                // ({ getFieldValue }) => ({
                //   validator(_, value) {
                //     if (!value) return Promise.resolve()

                //     const now = dayjs().startOf("minute")
                //     const selectedDate = dayjs(value)

                //     if (selectedDate.isBefore(now)) {
                //       return Promise.reject(new Error("Ngày bắt đầu phải sau thời điểm hiện tại"))
                //     }
                //     return Promise.resolve()
                //   },
                // }),
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
                  return current && current < dayjs().startOf("day");
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
                      return Promise.resolve();
                    }

                    const startDate = dayjs(getFieldValue("startDate"));
                    const endDate = dayjs(value);

                    console.log("startDate:", startDate.format());
                    console.log("endDate:", endDate.format());
                    console.log(
                      "endDate.isAfter(startDate):",
                      endDate.isAfter(startDate)
                    );

                    if (!endDate.isAfter(startDate)) {
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
                format="DD-MM-YYYY HH:mm:ss"
                showTime={{
                  defaultValue: dayjs().startOf("minute"),
                  format: "HH:mm:ss",
                }}
                placeholder="Chọn ngày và giờ kết thúc"
                disabledDate={(current) => {
                  const startDate = form.getFieldValue("startDate");
                  return (
                    current &&
                    (current < dayjs().startOf("day") ||
                      (startDate && current < dayjs(startDate).startOf("day")))
                  );
                }}
              />
            </Form.Item>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default UpdatePolicyModal;
