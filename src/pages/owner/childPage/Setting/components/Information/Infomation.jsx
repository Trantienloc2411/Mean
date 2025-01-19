import React, { useState } from "react";
import {
  Layout,
  Avatar,
  Button,
  Form,
  Input,
  Upload,
  message,
  DatePicker,
} from "antd";
import styles from "../Information/Information.module.scss";
import dayjs from "dayjs";

const { Content } = Layout;

export default function Information(props) {
  const { userData, onUpdate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    message.success("Account information updated successfully!");
  };

  return (
    <>
      <h2>Thông tin tài khoản</h2>
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <Avatar
            size={200}
            src={formData.avatar || "profile-placeholder.jpg"}
            className={styles.avatar}
          />
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = () => {
                setFormData((prev) => ({ ...prev, avatar: reader.result }));
              };
              reader.readAsDataURL(file);
              return false;
            }}
          >
            <Button
              style={{
                margin: "20px 20px",
                padding: 10,
              }}
              size="large"
              className={styles.changeAvatar}
            >
              Đổi ảnh đại diện
            </Button>
          </Upload>
        </div>
        <div className={styles.infoForm}>
          <Form layout="vertical" className={styles.infoForm}>
            <Form.Item label="Full Name">
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                readOnly={!isEditing}
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                readOnly={!isEditing}
              />
            </Form.Item>
            <Form.Item label="Phone">
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                readOnly={!isEditing}
              />
            </Form.Item>
            <Form.Item label="Date of birth">
              <DatePicker
                value={formData.dob ? dayjs(formData.dob, "DD/MM/YYYY") : null}
                onChange={(date, dateString) =>
                  setFormData({ ...formData, dob: dateString })
                }
                format="DD/MM/YYYY"
                disabled={!isEditing}
              />
            </Form.Item>
            {isEditing ? (
              <Button
                type="primary"
                onClick={handleSave}
                className={styles.saveButton}
              >
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Chỉnh sửa
              </Button>
            )}
          </Form>
        </div>
      </div>
    </>
  );
}
