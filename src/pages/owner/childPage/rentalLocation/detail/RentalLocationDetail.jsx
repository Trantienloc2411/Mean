import { Tabs } from "antd";
import TitleAndDescription from "./components/TitleAndDescription";
import LocationMap from "./components/LocationMap";
import ImageSlider from "./components/ImageSlider";
import RecentReviews from "./components/RecentReviews";
import { Flex } from "antd";
import { Tag } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import RoomList from "./components/RoomList";
import SettingRentalLocation from "./components/SettingRentalLocation";
export default function RentalLocationDetail() {
  const reviews = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      avatar: "url-to-avatar-1",
      rating: 5,
      comment: "Sản phẩm rất tốt, đóng gói cẩn thận.",
      date: "2025-01-22T01:30:00Z",
    },
    {
      id: 2,
      user: "Trần Thị B",
      avatar: null, // Sẽ hiển thị chữ cái đầu của tên
      rating: 4,
      comment: "Chất lượng ổn, giao hàng hơi chậm.",
      date: "2024-01-19T15:45:00Z",
    },
    {
      id: 33,
      user: "Trần Thị B",
      avatar: null, // Sẽ hiển thị chữ cái đầu của tên
      rating: 4,
      comment: "Chất lượng ổn, giao hàng hơi chậm.",
      date: "2025-01-19T15:45:00Z",
    },
    {
      id: 333333,
      user: "Trần Thị B",
      avatar: null, // Sẽ hiển thị chữ cái đầu của tên
      rating: 4,
      comment: "Chất lượng ổn, giao hàng hơi chậm.",
      date: "2025-01-21T18:45:00Z",
    },
  ];

  const images = [
    "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    "https://upload.wikimedia.org/wikipedia/vi/b/b7/Doraemon1.jpg",
    "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
  ];

  const items = [
    {
      key: "1",
      label: "Thông tin",
      children: (
        <>
          <TitleAndDescription />
          <LocationMap />
        </>
      ),
    },
    {
      key: "2",
      label: "Hình ảnh",
      children: <ImageSlider images={images} />,
    },
    {
      key: "3",
      label: "Phòng",
      children: <RoomList />,
    },
    {
      key: "4",
      label: "Đánh giá",
      children: <RecentReviews reviews={reviews} />,
    },
    {
      key: "5",
      label: "Cài đặt",
      children: <SettingRentalLocation />,
    },
  ];

  return (
    <div
      style={{
        padding: "20px 20px",
        background: "#fff",
        borderRadius: 20,
        minHeight: "100vh",
        margin: "20px 10%",
      }}
    >
      <Flex gap={10} align="center">
        <h1 style={{ fontSize: 28, margin: 0 }}>Rental Location Detail</h1>
        <Tag
          style={{
            // background: RentalLocationStatusEnum[item?.status]?.color,
            background: "green",
            color: "#fff",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            padding: "2px 10px",
          }}
        >
          {/* {RentalLocationStatusEnum[item?.status]?.label || "Không xác định"} */}
          Hoạt động
        </Tag>
      </Flex>
      <Flex align="center" gap={5} style={{ marginTop: 10 }}>
        <FaLocationDot />
        <p style={{ margin: 0 }}>Malang, East java</p>
      </Flex>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
