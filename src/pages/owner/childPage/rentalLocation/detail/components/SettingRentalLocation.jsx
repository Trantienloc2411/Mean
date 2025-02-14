import { Tabs } from "antd";
import SettingInformation from "./SettingInformation";
import SettingStatus from "./SettingStatus";
import DocumentManagement from "./DocumentManagement";

const { TabPane } = Tabs;

export default function SettingRentalLocation({item}) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Tabs
        tabPosition="left"
        style={{
          width: "100%",
        }}
      >
        {/* Tab Thông Tin Địa Điểm */}
        <TabPane tab="Thông tin địa điểm" key="1">
          <SettingInformation item={item}/>
        </TabPane>

        {/* Tab Trạng Thái Địa Điểm */}
        <TabPane tab="Trạng thái" key="2">
          <SettingStatus />
        </TabPane>
        <TabPane tab="Danh sách giấy tờ" key="3">
          <DocumentManagement />
        </TabPane>
      </Tabs>
    </div>
  );
}
