import { Tabs } from "antd";
import SettingInformation from "./SettingInformation";
import DocumentManagement from "../components/DocumentManagement";

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
