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
  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  if (error) return <p>Failed to load rental location.</p>;
  const rentalData = rental.data;
  // console.log(rentalData);

  const items = [
    {
      key: "1",
      label: "Thông tin",
      children: (
        <>
          <TitleAndDescription rentalData={rentalData} />
        </>
      ),
    },
    {
      key: "2",
      label: "Hình ảnh",
      children: <ImageSlider images={rentalData?.image || []} />,
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
      children: <SettingRentalLocation rentalData={rentalData} />,
    },
  ];

  return (
    <div
      style={{
        padding: "0px 20px",
        background: "#fff",
        borderRadius: 20,
        minHeight: "100vh",
        margin: "20px 10%",
      }}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
