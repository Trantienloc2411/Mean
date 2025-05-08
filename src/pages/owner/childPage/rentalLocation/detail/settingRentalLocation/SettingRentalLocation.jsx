import { Tabs } from "antd";
import SettingInformation from "./SettingInformation";
import DocumentManagement from "../components/DocumentManagement";
import RentalLogHistory from "./RentalLogHistory";

export default function SettingRentalLocation({ rentalData }) {
  const items = [
    {
      key: "1",
      label: "Thông tin địa điểm",
      children: <SettingInformation rentalData={rentalData} />,
    },
    {
      key: "2",
      label: "Danh sách giấy tờ",
      children: <DocumentManagement rentalData={rentalData} />,
    },
    {
      key: "3",
      label: "Lịch sử cập nhật",
      children: <RentalLogHistory rentalData={rentalData} />, // Tab mới
    },
  ];

  return (
    <div style={{ display: "flex", paddingBottom: 30 }}>
      <Tabs
        tabPosition="left"
        style={{
          width: "100%",
        }}
        items={items}
      />
    </div>
  );
}
