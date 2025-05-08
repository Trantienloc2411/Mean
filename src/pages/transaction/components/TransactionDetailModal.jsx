import { Modal, Typography, Row, Col, Divider, Tag } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function TransactionDetailModal({
  visible,
  onClose,
  transaction,
}) {
  if (!transaction) return null;

  const formatDate = (date) =>
    date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "N/A";

  return (
    <Modal
      title="Chi tiết giao dịch"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ padding: 20 }}>
        <Title level={4} style={{ marginBottom: 10 }}>
          Thông tin giao dịch
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Mã giao dịch:</Text>
            <br />
            <Text>{transaction.transactionCode || "N/A"}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Mã đặt phòng:</Text>
            <br />
            <Text>{transaction.bookingCode || "N/A"}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Thời gian tạo:</Text>
            <br />
            <Text>{formatDate(transaction.createTime) || "N/A"}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Thời gian kết thúc:</Text>
            <br />
            <Text>{formatDate(transaction.endTime) || "N/A"}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Số tiền:</Text>
            <br />
            <Text style={{ color: "#1890ff", fontWeight: "bold" }}>
              {transaction.price || "N/A"}
            </Text>
          </Col>
        </Row>

        <Divider style={{ margin: "20px 0" }} />

        <Title level={4} style={{ marginBottom: 10 }}>
          Trạng thái giao dịch
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Trạng thái:</Text>
            <br />
            <Tag color="blue">{transaction.status.vi || "N/A"}</Tag>
          </Col>
          <Col span={12}>
            <Text strong>Loại giao dịch:</Text>
            <br />
            <Tag color="green">{transaction.typeTransaction.vi || "N/A"}</Tag>
          </Col>
        </Row>

        <Divider style={{ margin: "20px 0" }} />

        <Title level={4} style={{ marginBottom: 10 }}>
          Ghi chú
        </Title>
        <Text>{transaction.notes || "Không có ghi chú nào."}</Text>
      </div>
    </Modal>
  );
}
