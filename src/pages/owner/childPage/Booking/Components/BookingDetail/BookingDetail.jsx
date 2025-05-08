import { Modal, Descriptions, Tag, Spin, message, Row, Col, Card, Image, Typography } from "antd"
import { useEffect, useState } from "react"
import moment from "moment"
import styles from "./BookingDetail.module.scss"

const { Title, Text } = Typography

const ACCOMMODATION_STATUS = Object.freeze({
    AVAILABLE: 1,
    BOOKED: 2,
    CLEANING: 3,
    PREPARING: 4,
    MAINTENANCE: 5,
    CLOSED: 6,
    INUSE: 7
});



const BookingDetail = ({ bookingId, visible, onClose, bookingData, isLoading, isError, bookingStatusCodes, paymentStatusCodes ,paymentMethodCodes  }) => {
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (bookingData) {
      setBooking(bookingData)
    }
  }, [bookingData])

  if (isError) {
    message.error("Failed to load booking details")
    return null
  }

  const getStatusTag = (status) => {
    const statusMap = {
      1: { text: "Đã xác nhận", color: "blue" },      
      2: { text: "Cần check-in", color: "cyan" },       
      3: { text: "Đã check-in", color: "green" },      
      4: { text: "Cần check-out", color: "purple" },     
      5: { text: "Đã check-out", color: "geekblue" },  
      6: { text: "Đã huỷ", color: "red" },             
      7: { text: "Hoàn tất", color: "green" },           
      8: { text: "Chờ xác nhận", color: "orange" },      
      9: { text: "Đã hoàn tiền", color: "volcano" },     
    }
  
    return <Tag color={statusMap[status]?.color || "default"}>{statusMap[status]?.text || "Unknown"}</Tag>
  }

  const getPaymentStatusTag = (status) => {
    const paymentStatusMap = {
      1: { text: "Đã đặt", color: "green" },
      2: { text: "Chờ thanh toán", color: "orange" },
      3: { text: "Đã thanh toán", color: "blue" },
      4: { text: "Đã hoàn tiền", color: "red" },
      5: { text: "Thanh toán thất bại", color: "red" },
    }

    return <Tag color={paymentStatusMap[status]?.color || "default"}>{paymentStatusMap[status]?.text || "Unknown"}</Tag>
  }
  

  const getPaymentMethod = (method) => {
    const methods = {
      [paymentMethodCodes.MOMO]: "Ví MoMo",
    };
    return methods[method] || "Không xác định";
  };
  const getAccommodationStatusTag = (status) => {
    const statusMap = {
      [ACCOMMODATION_STATUS.AVAILABLE]: { text: "Có sẵn", color: "green" },
      [ACCOMMODATION_STATUS.BOOKED]: { text: "Đã đặt", color: "blue" },
      [ACCOMMODATION_STATUS.CLEANING]: { text: "Đang dọn dẹp", color: "orange" },
      [ACCOMMODATION_STATUS.PREPARING]: { text: "Đang chuẩn bị", color: "cyan" },
      [ACCOMMODATION_STATUS.MAINTENANCE]: { text: "Bảo trì", color: "red" },
      [ACCOMMODATION_STATUS.CLOSED]: { text: "Đã đóng", color: "gray" },
      [ACCOMMODATION_STATUS.INUSE]: { text: "Đang sử dụng", color: "purple" },
    }

    return <Tag color={statusMap[status]?.color || "default"}>{statusMap[status]?.text || "Unknown"}</Tag>
  }

  const parseCustomDate = (dateString) => {
    if (!dateString) return null;

    if (dateString.includes('T') || dateString.includes('Z')) {
      return moment(dateString);
    }

    const parts = dateString.split(' ');
    if (parts.length !== 2) return null;

    const dateParts = parts[0].split('/');
    if (dateParts.length !== 3) return null;

    const reformattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${parts[1]}`;
    return moment(reformattedDate, "YYYY-MM-DD HH:mm:ss");
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const parsedDate = parseCustomDate(dateString);
    if (!parsedDate || !parsedDate.isValid()) return "Invalid Date";

    return parsedDate.format("DD/MM/YYYY HH:mm:ss");
  }

  const getNestedValue = (obj, path, defaultValue = "Không xác định") => {
    try {
      const value = path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  return (
    <Modal
      title={<Title level={4}>Chi tiết đặt phòng</Title>}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.bookingDetailModal}
    >
      {isLoading || !booking ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.bookingDetailContent}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card className={styles.bookingCard}>
                <Title level={5}>Thông tin đặt phòng</Title>
                <Descriptions bordered column={1} className={styles.descriptions}>
                  <Descriptions.Item label="Trạng thái đặt phòng">{getStatusTag(booking.status)}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian đặt">{formatDate(booking.createdAt)}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian cập nhật">{formatDate(booking.updatedAt)}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian xác nhận">
                    {booking.confirmDate ? formatDate(booking.confirmDate) : "Chưa xác nhận"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={24}>
              <Card className={styles.customerCard}>
                <Title level={5}>Thông tin khách hàng</Title>
                <Descriptions bordered column={1} className={styles.descriptions}>
                  <Descriptions.Item label="Tên khách hàng">
                    {getNestedValue(booking, 'customerId.userId.fullName')}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={24}>
              <Card className={styles.bookingDetailsCard}>
                <Title level={5}>Chi tiết đặt phòng</Title>
                <Descriptions bordered column={1} className={styles.descriptions}>
                  <Descriptions.Item label="Thời gian check-in">{formatDate(booking.checkInHour)}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian check-out">{formatDate(booking.checkOutHour)}</Descriptions.Item>
                  <Descriptions.Item label="Số giờ thuê">{booking.durationBookingHour} giờ</Descriptions.Item>
                  <Descriptions.Item label="Số người lớn">{booking.adultNumber}</Descriptions.Item>
                  <Descriptions.Item label="Số trẻ em">{booking.childNumber}</Descriptions.Item>
                  <Descriptions.Item label="Mật khẩu phòng">{booking.passwordRoom || "Không có"}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={24}>
              <Card className={styles.accommodationCard}>
                <Title level={5}>Thông tin phòng</Title>
                <Descriptions bordered column={1} className={styles.descriptions}>
                  <Descriptions.Item label="Vị trí">
                    {getNestedValue(booking, 'accommodationId.rentalLocationId.name', "Không xác định")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại phòng">
                    {getNestedValue(booking, 'accommodationId.accommodationTypeId.name', "Không xác định")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {getNestedValue(booking, 'accommodationId.description', "Không có mô tả")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái phòng">
                    {getAccommodationStatusTag(getNestedValue(booking, 'accommodationId.status'))}
                  </Descriptions.Item>
                </Descriptions>

                {booking.accommodationId?.image && booking.accommodationId.image.length > 0 && (
                  <div className={styles.imageSection}>
                    <Title level={5} className={styles.imageTitle}>
                      Hình ảnh phòng
                    </Title>
                    <div className={styles.imageGrid}>
                      {booking.accommodationId.image.map((img, index) => (
                        <Image
                          key={index}
                          src={img || "/placeholder.svg"}
                          alt={`Room ${index + 1}`}
                          className={styles.roomImage}
                          width={150}
                          height={100}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </Col>

            <Col span={24}>
              <Card className={styles.paymentCard}>
                <Title level={5}>Thông tin thanh toán</Title>
                <Descriptions bordered column={1} className={styles.descriptions}>
                  <Descriptions.Item label="Phương thức thanh toán">
                    {getPaymentMethod(booking.paymentMethod)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái thanh toán">
                    {getPaymentStatusTag(booking.paymentStatus)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá cơ bản">
                    {(booking.basePrice || 0).toLocaleString("vi-VN")} VNĐ
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá quá giờ (mỗi giờ)">
                    {(booking.overtimeHourlyPrice || 0).toLocaleString("vi-VN")} VNĐ
                  </Descriptions.Item>
                  <Descriptions.Item label="Chính sách hệ thống">
                    {getNestedValue(booking, 'policySystemBookingId.value', "0")} {getNestedValue(booking, 'policySystemBookingId.unit', "%")}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  )
}

export default BookingDetail