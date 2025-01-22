import { useState, useMemo } from "react";
import { Card, Avatar, Rate, Select, Space, Typography, Row, Col } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.locale("vi");
dayjs.extend(utc);

const { Text, Title } = Typography;
const { Option } = Select;

const ReviewsComponent = ({ reviews = [] }) => {
  const [sortBy, setSortBy] = useState("newest");

  // Tính toán tổng số đánh giá và điểm trung bình
  const stats = useMemo(() => {
    if (!reviews.length) return { average: 0, total: 0 };

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / total).toFixed(1);

    const distribution = Array(5).fill(0);
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });

    return {
      average,
      total,
      distribution: distribution.map((count) => ({
        count,
        percentage: ((count / total) * 100).toFixed(1),
      })),
    };
  }, [reviews]);

  // Sắp xếp reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "highest":
        return sorted.sort((b, a) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  if (!reviews.length) {
    return <Card>Chưa có đánh giá nào</Card>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      {/* Phần thống kê */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Title level={1} style={{ marginBottom: 0 }}>
                {stats.average}
              </Title>
              <Rate disabled defaultValue={Number(stats.average)} allowHalf />
              <Text type="secondary">{stats.total} đánh giá</Text>
            </div>
          </Col>
          <Col xs={24} sm={16}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {stats.distribution.reverse().map((stat, index) => {
                const stars = 5 - index;
                return (
                  <Space key={stars} align="center" style={{ width: "100%" }}>
                    <Text>{stars} sao</Text>
                    <div
                      style={{
                        width: "60%",
                        height: 8,
                        background: "#f0f0f0",
                        borderRadius: 4,
                        margin: "0 8px",
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
                    <Text type="secondary">{stat.count}</Text>
                  </Space>
                );
              })}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Phần lọc */}
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Space>
          <Text>Sắp xếp theo:</Text>
          <Select
            defaultValue="newest"
            style={{ width: 180, textAlign: "left" }}
            onChange={setSortBy}
          >
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="highest">Đánh giá cao nhất</Option>
            <Option value="lowest">Đánh giá thấp nhất</Option>
          </Select>
        </Space>
      </div>

      {/* Danh sách đánh giá */}
      <Space direction="vertical" style={{ width: "100%" }}>
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <Space align="start" style={{ width: "100%" }}>
              <Avatar
                src={review.avatar}
                size={64}
                style={{
                  backgroundColor: !review.avatar ? "#1890ff" : undefined,
                }}
              >
                {!review.avatar && review.user[0].toUpperCase()}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Space align="baseline">
                  <Text strong>{review.user}</Text>
                  <Rate disabled defaultValue={review.rating} />
                  <Text type="secondary">
                    {dayjs(review.date).format("HH:mm DD/MM/YYYY ")}(
                    {dayjs(review.date).fromNow()})
                  </Text>
                </Space>
                <Text
                  style={{
                    display: "block",
                    margin: "8px 0",
                    whiteSpace: "pre-line",
                  }}
                >
                  {review.comment}
                </Text>
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default ReviewsComponent;
