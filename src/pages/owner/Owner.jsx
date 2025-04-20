import { Tabs, ConfigProvider } from "antd";
import { useState, useEffect } from "react";
import Overview from "./childPage/Overview/Overview.jsx";
import Booking from "./childPage/Booking/Booking.jsx";
import Information from "./childPage/Information/Information.jsx";
import Place from "./childPage/accomodation/Accomodation.jsx";
import Policy from "./childPage/Policy/Policy.jsx";
import Setting from "./childPage/Setting/Setting.jsx";
import TypeRoom from "./childPage/TypeRoom/TypeRoom.jsx";
import ChatList from "./childPage/messeges/Messeges.jsx";
import {supabase} from "../../redux/services/supabase";

export default function Owner() {
  const storedKey = localStorage.getItem("ownerActiveTab") || "1";
  const [activeTab, setActiveTab] = useState(storedKey);

  //Check user is exist on supabase/c{hat
  

  const handleTabChange = (key) => {
    setActiveTab(key);
    localStorage.setItem("ownerActiveTab", key);
  };

  const items = [
    { key: "1", label: "Thông tin", children: <Information /> },
    { key: "2", label: "Tổng quan", children: <Overview /> },
    { key: "3", label: "Địa điểm", children: <Place /> },
    { key: "4", label: "Đặt phòng", children: <Booking /> },
    { key: "5", label: "Loại phòng", children: <TypeRoom /> },
    { key: "6", label: "Chính sách", children: <Policy /> },
    { key: "7", label: "Cài đặt", children: <Setting /> },
    {key : "8", label: "Tin nhắn", children: <ChatList />}
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            inkBarColor: "#FF385C",
            itemSelectedColor: "#FF385C",
            itemHoverColor: "#FF385C",
          },
        },
      }}
      getPopupContainer={(node) => node.parentNode || document.body}
    >
      <div className="owner-container">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={items}
          destroyInactiveTabPane={false}
          size="large"
        />
      </div>
    </ConfigProvider>
  );
}
