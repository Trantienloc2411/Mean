import { useNavigate, useParams } from "react-router-dom";
import { useGetRentalLocationByIdQuery } from "../../../../../redux/services/rentalApi";
import { Tabs, Spin, Button } from "antd";
import TitleAndDescription from "./components/TitleAndDescription";
import ImageSlider from "./components/ImageSlider";
import RecentReviews from "./components/RecentReviews";
import RoomList from "./components/RoomList";
import SettingRentalLocation from "./settingRentalLocation/SettingRentalLocation";
import { LeftOutlined } from "@ant-design/icons";
import RoomTypeManagement from "./components/RoomTypeManagement/RoomTypeManagement";
import { useEffect } from "react";

export default function RentalLocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: rental, isLoading, error } = useGetRentalLocationByIdQuery(id);

  useEffect(() => {
    if (rental?.data) {
      const ownerId = rental.data?.ownerId?._id || rental.data?.ownerId;
      if (ownerId) {
        localStorage.setItem('ownerId', ownerId);
        console.log('Owner ID saved to localStorage:', ownerId);
      }
    }
  }, [rental]);

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
  const ownerId = rentalData?.ownerId?._id || rentalData?.ownerId;
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
      children: (
        <ImageSlider rentalData={rentalData} images={rentalData?.image || []} />
      ),
    },
    {
      key: "3",
      label: "Phòng",
      children: <RoomList rooms={rental?.rooms || []} />,
    },
    {
      key: "4",
      label: "Loại Phòng",
      children: <RoomTypeManagement ownerId={ownerId} isOwner={true} rentalLocationId={id} />,
    },
    {
      key: "5",
      label: "Đánh giá",
      children: <RecentReviews />,
    },
    {
      key: "6",
      label: "Cài đặt",
      children: <SettingRentalLocation rentalData={rentalData} />,
    },
  ];
  // <Button
  //   type="link"
  //   onClick={() => navigate(-1)}
  //   style={{ marginBottom: 16, display: "flex", alignItems: "center" }}
  // >
  //   <LeftOutlined /> Trở về
  // </Button>;
  function ButtonBack() {
    return (
      <Button
        type="link"
        onClick={() => navigate(-1)}
      // style={{ display: "flex", alignItems: "center" }}
      >
        <LeftOutlined /> Trở về
      </Button>
    );
  }

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
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabBarExtraContent={{
          right: <ButtonBack />,
        }}
      />
    </div>
  );
}