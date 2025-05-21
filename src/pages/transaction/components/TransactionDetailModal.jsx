import { useEffect, useState } from "react";
import { Modal, Typography, Row, Col, Divider, Tag, Spin } from "antd";
import dayjs from "dayjs";
import {
  useGetOwnerByIdQuery,
  useGetOwnerDetailByUserIdQuery,
} from "../../../redux/services/ownerApi"; // Ưu tiên RTK Query

const { Title, Text } = Typography;

export default function TransactionDetailModal({
  visible,
  onClose,
  transaction,
}) {
  const ownerId = transaction?.ownerId;

  // Gọi API nếu có ownerId
  const { data: owner, isLoading: loadingOwner } = useGetOwnerByIdQuery(
    ownerId,
    { skip: !ownerId } // Chỉ fetch nếu có ownerId
  );
  const { data: ownerDetail, isLoading: loadingOwnerDetail } =
    useGetOwnerDetailByUserIdQuery(
      owner?.userId,
      { skip: !owner?.userId } // Chỉ fetch nếu có ownerId
    );
  console.log(ownerDetail);
  if (!transaction) return null;

  // const formatDate = (date) =>
  //   date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "N/A";

  return (
    <Modal
      title="Chi tiết giao dịch"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ padding: 20 }}>
        <Title level={4}>Thông tin giao dịch</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Mã giao dịch:</Text>
            <br />
            <Text>{transaction.transactionCode || "N/A"}</Text>
          </Col>

          {transaction.bookingCode ? (
            <Col span={12}>
              <Text strong>Mã đặt phòng:</Text>
              <br />
              <Text>{transaction.bookingCode}</Text>
            </Col>
          ) : transaction.ownerId ? (
            <Col span={12}>
              <Text strong>Chuyển tiền cho owner</Text>
              <br />
              {/* <Text>Chuyển tiền cho owner</Text> */}
            </Col>
          ) : null}

          <Col span={12}>
            <Text strong>Thời gian tạo:</Text>
            <br />
            <Text>{transaction.createTime}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Số tiền:</Text>
            <br />
            <Text style={{ color: "#1890ff", fontWeight: "bold" }}>
              {transaction.price || "N/A"}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Trạng thái giao dịch</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Trạng thái:</Text>
            <br />
            <Tag color="blue">{transaction.status?.vi || "N/A"}</Tag>
          </Col>
          <Col span={12}>
            <Text strong>Loại giao dịch:</Text>
            <br />
            <Tag color="green">{transaction.typeTransaction?.vi || "N/A"}</Tag>
          </Col>
        </Row>

        {/* Thông tin chuyển khoản Owner */}
        {ownerId && (
          <>
            <Divider />
            <Title level={4}>Thông tin chuyển khoản Owner</Title>
            {loadingOwner ? (
              <Spin />
            ) : ownerDetail ? (
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Tên Owner:</Text>
                  <br />
                  <Text>{ownerDetail?.userId?.fullName || "N/A"}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Số điện thoại:</Text>
                  <br />
                  <Text>{ownerDetail?.userId?.phone || "N/A"}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Ngân hàng:</Text>
                  <br />
                  <Text>
                    {ownerDetail?.paymentInformationId?.bankName || "N/A"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Số tài khoản:</Text>
                  <br />
                  <Text>
                    {ownerDetail?.paymentInformationId?.bankAccountName ||
                      "N/A"}
                  </Text>
                </Col>
              </Row>
            ) : (
              <Text>Không có thông tin Owner.</Text>
            )}
          </>
        )}

        {transaction.notes && (
          <>
            <Divider />
            <Title level={4}>Ghi chú</Title>
            <Text>{transaction.notes}</Text>
          </>
        )}
      </div>
    </Modal>
  );
}
