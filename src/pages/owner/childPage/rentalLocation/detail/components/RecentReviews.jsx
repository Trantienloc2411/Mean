import { useState, useMemo } from "react";
import {
  Card,
  Avatar,
  Rate,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Button,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";
import { useParams } from "react-router-dom";
import {
  useGetFeedbackByRentalIdQuery,
  useUpdateFeedbackReplyMutation,
} from "../../../../../../redux/services/feedbackApi";
import { Flex } from "antd";
import { Image } from "antd";
import { Modal } from "antd";
import { Input } from "antd";
import { message } from "antd";
import { StarFilled } from "@ant-design/icons";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("vi");

const { Text, Title } = Typography;
const { Option } = Select;

const ReviewsComponent = () => {
  const { id } = useParams();
  const { data: feedbackData = [] } = useGetFeedbackByRentalIdQuery(id);
  const [updateFeedbackReply] = useUpdateFeedbackReplyMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReplyContent(review.contentReply || "");
    setIsModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedReview) return;

    try {
      await updateFeedbackReply({
        feedbackId: selectedReview.id,
        contentReply: replyContent,
      }).unwrap();
      message.success("Phản hồi đã được gửi!");
      setIsModalOpen(false);
    } catch (error) {
      message.error("Gửi phản hồi thất bại!");
    }
  };

  // Updated formatDate function to handle DD/MM/YYYY HH:mm:ss
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      // Parse the date string with the specific format
      const date = dayjs(dateString, "DD/MM/YYYY HH:mm:ss");
      return date.isValid() ? date.format("DD/MM/YYYY HH:mm:ss") : "N/A";
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "N/A";
    }
  };

  const stats = useMemo(() => {
    if (!feedbackData.length) return { average: 0, total: 0, distribution: [] };

    const total = feedbackData.length;
    const sum = feedbackData.reduce(
      (acc, review) => acc + (review.rating || 0),
      0
    );
    const average = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;

    const distribution = Array(5).fill(0);
    feedbackData.forEach((review) => {
      const rating = review.rating || 0;
      if (rating >= 1 && rating <= 5) {
        distribution[Math.floor(rating) - 1]++;
      }
    });

    return {
      average,
      total,
      distribution: distribution.map((count) => ({
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : "0",
      })),
    };
  }, [feedbackData]);

  const sortedReviews = useMemo(() => {
    if (!feedbackData) return [];

    const sorted = [...feedbackData];
    return sorted.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            dayjs(b.createdAt, "DD/MM/YYYY HH:mm:ss").valueOf() -
            dayjs(a.createdAt, "DD/MM/YYYY HH:mm:ss").valueOf()
          );
        case "oldest":
          return (
            dayjs(a.createdAt, "DD/MM/YYYY HH:mm:ss").valueOf() -
            dayjs(b.createdAt, "DD/MM/YYYY HH:mm:ss").valueOf()
          );
        case "highest":
          return (b.rating || 0) - (a.rating || 0);
        case "lowest":
          return (a.rating || 0) - (b.rating || 0);
        default:
          return 0;
      }
    });
  }, [feedbackData, sortBy]);

  const formatDate = (dateString) =>
    dateString
      ? dayjs(dateString, 'DD/MM/YYYY HH:mm:ss').format('HH:mm DD/MM/YYYY')
      : 'N/A';

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: "center" }}>
            <Title level={1} style={{ marginBottom: 0 }}>
              {stats.average} <StarFilled style={{ color: "#fadb14" }} />
            </Title>
            <Rate disabled value={Number(stats.average)} allowHalf />
            <Text type="secondary">{stats.total} đánh giá</Text>
          </Col>
          <Col xs={24} sm={16}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {stats?.distribution?.reverse().map((stat, index) => {
                const stars = 5 - index;
                return (
                  <Row key={stars} align="middle">
                    <Col span={4}>
                      <Text>{stars} sao</Text>
                    </Col>
                    <Col span={16}>
                      <div
                        style={{
                          background: "#f0f0f0",
                          borderRadius: 4,
                          height: 8,
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: `${stat.percentage}%`,
                            height: "100%",
                            background: "#1890ff",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </Col>
                    <Col span={4}>
                      <Text type="secondary">{stat.count}</Text>
                    </Col>
                  </Row>
                );
              })}
            </Space>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Space>
          <Text>Sắp xếp theo:</Text>
          <Select value={sortBy} style={{ width: 180 }} onChange={setSortBy}>
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="highest">Đánh giá cao nhất</Option>
            <Option value="lowest">Đánh giá thấp nhất</Option>
          </Select>
        </Space>
      </div>

      <Space direction="vertical" style={{ width: "100%" }}>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => {
            const customer = review.bookingId?.customerId;
            const userName = customer?.userId
              ? customer.userId.fullName
              : "Người dùng ẩn danh";
            const avatar = customer?.userId?.avatarUrl?.[0] || "";

            return (
              <Card key={review.id} style={{ borderRadius: 8 }}>
                <Flex justify="space-between" align="center">
                  <Flex justify="start" gap={10} align="center">
                    <Avatar
                      src={avatar}
                      size={32}
                      style={{
                        backgroundColor: !avatar ? "#1890ff" : undefined,
                      }}
                    >
                      {!avatar && userName[0]?.toUpperCase()}
                    </Avatar>
                    <Text strong>{userName}</Text>
                  </Flex>
                  <Flex align="end" vertical gap={10}>

                    <Rate disabled value={review.rating || 0} />
                    <Text type="secondary">{formatDate(review.createdAt)}</Text>

                  </Flex>
                </Flex>
                <Text
                  style={{
                    display: "block",
                    margin: "8px 20px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {review.content}
                </Text>
                {review.images?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Image.PreviewGroup>
                      {review.images.map((imgSrc, index) => (
                        <Image
                          key={index}
                          src={imgSrc}
                          width={80}
                          height={80}
                          style={{
                            objectFit: "cover",
                            borderRadius: 8,
                            marginRight: 8,
                          }}
                        />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                )}

                {review.contentReply ? (
                  <>
                    <Divider style={{ margin: "12px 0" }} />
                    <Card
                      size="small"
                      style={{ background: "#f5f5f5", borderRadius: 8 }}
                    >
                      <Text strong>Chủ nhà phản hồi:</Text>
                      <Text style={{ display: "block", marginTop: 4 }}>
                        {review.contentReply}
                      </Text>
                    </Card>
                  </>
                ) : (
                  <Flex justify="end">
                    <Button onClick={() => openReplyModal(review)}>
                      Phản hồi
                    </Button>
                  </Flex>
                )}
              </Card>
            );
          })
        ) : (
          <Card>Chưa có đánh giá nào</Card>
        )}
      </Space>
      <Modal
        title="Phản hồi đánh giá"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSendReply}
        okText="Gửi"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Nhập phản hồi của bạn..."
        />
      </Modal>
    </div>
  );
};

export default ReviewsComponent;
