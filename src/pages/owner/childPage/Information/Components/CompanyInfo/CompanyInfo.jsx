import { useState } from "react";
import { Card, Typography, Form, Space } from "antd";

const { Text } = Typography;

const CompanyInfo = ({ companyInfo }) => {
  // const [isEditing, setIsEditing] = useState(false);
  // const [form] = Form.useForm();

  const defaultData = {
    companyName: companyInfo?.companyName || "Chưa có thông tin",
    representativeName: companyInfo?.representativeName || "Chưa có thông tin",
    representativeId: companyInfo?.citizenIdentification || "Chưa có thông tin",
    companyAddress: companyInfo?.companyAddress || "Chưa có thông tin",
    taxCode: companyInfo?.taxCode || "Chưa có thông tin",
    file: companyInfo?.businessLicensesFile,
  };

  const fields = [
    { name: "companyName", label: "Tên công ty" },
    { name: "representativeName", label: "Tên người đại diện" },
    { name: "representativeId", label: "Căn cước công dân đại diện" },
    { name: "companyAddress", label: "Địa chỉ công ty" },
    { name: "taxCode", label: "Mã số thuế" },
    { name: "file", label: "File giấy phép kinh doanh" },
  ];

  // const toggleEdit = () => {
  //   if (isEditing) {
  //     setIsEditing(false);
  //   } else {
  //     form.setFieldsValue(defaultData);
  //     setIsEditing(true);
  //   }
  // };

  // const onFinish = (values) => {
  //   console.log("Updated values:", values);
  //   setIsEditing(false);
  // };

  const ViewMode = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {fields.map((field) => (
        <div key={field.name}>
          <Text strong>{field.label}</Text>

          {field.name === "file" ? (
            defaultData.file ? (
              <a
                href={defaultData.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  style={{
                    background: "#f5f5f5",
                    width: 130,
                    padding: "4px 12px",
                    borderRadius: 6,
                    border: "1px solid #d9d9d9",
                    textAlign: "center",
                    display: "block",
                    marginTop: 5,
                  }}
                >
                  Xem giấy phép
                </div>
              </a>
            ) : (
              <div
                style={{
                  background: "#f5f5f5",
                  // width: 100,
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid #d9d9d9",
                  textAlign: "center",
                  // display: "block",
                  marginTop: 5,
                }}
              >
                <p>Chưa có giấy phép</p>
              </div>
            )
          ) : (
            <div
              style={{
                background: "#f5f5f5",
                padding: "8px 12px",
                borderRadius: 6,
                marginTop: 4,
              }}
            >
              {defaultData[field.name]}
            </div>
          )}
        </div>
      ))}
    </Space>
  );

  return (
    <Card
      title="Thông tin doanh nghiệp"
      style={{
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        margin: 20,
      }}
    >
      <ViewMode />
    </Card>
  );
};

export default CompanyInfo;
