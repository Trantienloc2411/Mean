import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AccomodationCreate.module.scss";
import {
  Button,
  Input,
  InputNumber,
  Switch,
  Checkbox,
  Row,
  Col,
  Form,
  Select,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
export default function AccommodationCreate() {
  const navigate = useNavigate();

  const { Option } = Select;
  const { Dragger } = Upload;

  const props = {
    name: "file",
    multiple: true,
    action: "/upload.do", // Replace with your upload endpoint
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        console.log(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleSaveAction = (values) => {
    // Here you can submit the form values to your backend
    console.log("Form values: ", values);
  };

  const handleBackNavigate = () => {
    navigate("../location/AccomodationDetail");
  };

  return (
    <div className={styles.content}>
      <div className={styles.btnReturn}>
        <Button onClick={handleBackNavigate} icon={<ArrowLeftOutlined />}>
          Trở về
        </Button>
      </div>
      <h2>Tạo thông tin phòng</h2>
      <Form
        onFinish={handleSaveAction}

      >
        <div className={styles.component}>
          <div className={styles.valueInput}>
            <div className={styles.leftSide}>
              <h3>Tên phòng</h3>
              <Form.Item
                name="roomName"
                rules={[{ required: true, message: "Please input room name!" }]}
              >
                <Input placeholder="Tên phòng" />
              </Form.Item>
              <h3 style={{ marginTop: 20 }}>Loại phòng</h3>
              <Form.Item name="roomType">
                <Select
                  defaultValue="Mô tả về khu vực cho thuê"
                  className={styles.customSelect}
                  dropdownClassName={styles.customDropdown}
                >
                  <Option value="standard">Standard</Option>
                  <Option value="deluxe">Deluxe</Option>
                  <Option value="suite">Suite</Option>
                </Select>
              </Form.Item>
              <div
                className={styles.switchOption}
                style={{ alignItems: "baseline", display: "flex" }}
              >
                <h3 style={{ marginBottom: 0 }}>Trạng thái phòng</h3>
                <Form.Item name="status" valuePropName="checked">
                  <Switch
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Tạm ngưng"
                    defaultChecked
                    className={styles.customSwitch}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={styles.rightSide}>
              <h3>Mô tả</h3>
              <Form.Item name="description">
                <TextArea
                  rows={4}
                  placeholder="maxLength is 255"
                  maxLength={255}
                />
              </Form.Item>
              <div className={styles.maxPeopleDiv}>
                <h3 style={{ marginTop: 20 }}>Số người tối đa ở: </h3>
                <Form.Item name="maxPeople">
                  <InputNumber
                    size="medium"
                    min={1}
                    max={10}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className={styles.price}>
                <h3>Giá tiền: </h3>
                <Form.Item name="price">
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
                    }
                    parser={(value) => value?.replace(/\₫\s?|(,*)/g, "").trim()}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className={styles.amenities}>
            <h3>Dịch vụ của phòng: </h3>
            <div style={{ alignItems: "center" }}>
              <Checkbox.Group style={{ width: "100%" }} name="amenities">
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Checkbox value="Wifi">Wifi</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="AirCondition">Máy điều hoà</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="Kitchen">Bếp</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="TV">TiVi</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="WashingMachine">Máy giặt</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="FreeParking">Đỗ xe miễn phí</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="Pool">Hồ bơi</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="HotTub">Bồn tắm nóng</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="Gym">Gym</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="FreeParking">Miễn phí giữ xe</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </div>
          </div>
          <div className={styles.uploaderContainer}>
            <h3>Accommodation Images</h3>
            <Dragger {...props} className={styles.uploaderDragger}>
              <p className={styles.uploadIcon}>
                <InboxOutlined className="icon" />
              </p>
              <p className={styles.uploadText}>
                Drag and drop images here, or click to select files
              </p>
              <p className={styles.uploadHint}>
                Supported formats: JPG, PNG. Max size: 5MB
              </p>
            </Dragger>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            icon={<SaveOutlined />}
            htmlType="submit"
            size="large"
            style={{
              backgroundColor: "#177EE3",
              color: "#fff",
              marginTop: 20,
              alignContent: "flex-end",
              width: 150,
              height: 40,
            }}
          >
            Lưu lại
          </Button>
        </div>
      </Form>
    </div>
  );
}
