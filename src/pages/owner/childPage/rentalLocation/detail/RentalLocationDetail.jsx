import { useParams } from "react-router-dom";
import { useGetRentalLocationByIdQuery } from "../../../../../redux/services/rentalApi";
import { Tabs, Flex, Tag, Spin } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import TitleAndDescription from "./components/TitleAndDescription";
import LocationMap from "./components/LocationMap";
import ImageSlider from "./components/ImageSlider";
import RecentReviews from "./components/RecentReviews";
import RoomList from "./components/RoomList";
import SettingRentalLocation from "./components/SettingRentalLocation";

export default function RentalLocationDetail() {
  const { id } = useParams(); // Get ID from URL
  const { data: rental, isLoading, error } = useGetRentalLocationByIdQuery(id);

  if (isLoading) return <Spin size="large" />;
  if (error) return <p>Failed to load rental location.</p>;

  const items = [
    {
      key: "1",
      label: "Thông tin",
      children: (
        <>
          <TitleAndDescription item={rental} />
          <LocationMap location={rental?.location} />
        </>
      ),
    },
    {
      key: "2",
      label: "Hình ảnh",
      children: <ImageSlider images={rental?.image || []} />,
    },
    {
      key: "3",
      label: "Phòng",
      children: <RoomList rooms={rental?.rooms || []} />,
    },
    {
      key: "4",
      label: "Đánh giá",
      children: <RecentReviews reviews={rental?.reviews || []} />,
    },
    {
      key: "5",
      label: "Cài đặt",
      children: <SettingRentalLocation item={rental}/>,
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
        <h1 style={{ fontSize: 28, margin: 0 }}>{rental?.name || "Rental Location Detail"}</h1>
        <Tag
          style={{
            background: rental?.status === "active" ? "green" : "red",
            color: "#fff",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            padding: "2px 10px",
          }}
        >
          {rental?.status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      </Flex>
      <Flex align="center" gap={5} style={{ marginTop: 10 }}>
        <FaLocationDot />
        <p style={{ margin: 0 }}>{rental?.address || "Unknown location"}</p>
      </Flex>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
