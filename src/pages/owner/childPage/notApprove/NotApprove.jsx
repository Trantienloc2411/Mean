import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Card, Alert, Typography } from "antd";

const { Title, Text } = Typography;

export default function NotApprove() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 300,
        padding: 16,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 900 }}>
        <Alert
          message={
            <Title level={5} style={{ marginBottom: 0 }}>
              Tài khoản của bạn chưa được phê duyệt
            </Title>
          }
          description="Vui lòng bổ sung các thông tin cần thiết như thông tin doanh nghiệp, tài khoản ngân hàng để sớm được duyệt."
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
        />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text type="secondary">
            Nếu bạn có thắc mắc, vui lòng liên hệ với quản trị viên để hỗ trợ.
          </Text>
        </div>
      </Card>
    </div>
  );
}
