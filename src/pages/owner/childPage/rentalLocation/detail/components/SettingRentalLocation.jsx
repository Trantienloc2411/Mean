import { Tabs } from "antd";
import SettingInformation from "./SettingInformation";
import SettingStatus from "./SettingStatus";
import DocumentManagement from "./DocumentManagement";

export default function SettingRentalLocation({ rentalData }) {
  const items = [
    {
      key: "1",
      label: "Thông tin địa điểm",
      children: <SettingInformation rentalData={rentalData} />,
    },
    {
      key: "2",
      label: "Trạng thái",
      children: <SettingStatus />,
    },
    {
      key: "3",
      label: "Danh sách giấy tờ",
      children: <DocumentManagement />,
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
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
