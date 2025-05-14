import { useState, useEffect } from "react";
import { Tabs } from "antd";
import RoomTypeManagement from "./components/RoomTypeManagement/RoomTypeManagement.jsx";
import RoomAmenitiesManagement from "./components/RoomAmenitiesManagement/RoomAmenitiesManagement.jsx";
import styles from "./TypeRoom.module.scss";
import { useGetOwnerDetailByUserIdQuery } from "../../../../redux/services/ownerApi.js";
import { useParams } from "react-router-dom";
import NotApprove from "../notApprove/NotApprove.jsx";

export default function TypeRoom() {
  const [activeKey, setActiveKey] = useState("1");
  const { id } = useParams();
  const userRole = localStorage.getItem("user_role")?.toLowerCase(); // "owner" | "admin"
  const isAdmin = userRole === `"admin"` || userRole === `"staff"`;
  const isOwner = userRole === `"owner"`;

  const { data: ownerDetailData, isLoading: ownerDetailIsLoading } =
    useGetOwnerDetailByUserIdQuery(id);

  useEffect(() => {}, []);

  const items = [
    {
      key: "1",
      label: "Loại phòng",
      children: <RoomTypeManagement isOwner={isOwner} />,
    },
    {
      key: "2",
      label: "Dịch vụ",
      children: <RoomAmenitiesManagement isOwner={isOwner} />,
    },
  ];

  return (
    <div className={styles.container}>
      {ownerDetailData?.approvalStatus == 2 || isAdmin ? (
        <div className={styles.sidebar}>
          <Tabs
            activeKey={activeKey}
            items={items}
            onChange={setActiveKey}
            className={styles.tabs}
            tabPosition="left"
            destroyInactiveTabPane={true}
          />
        </div>
      ) : (
        <NotApprove />
      )}
    </div>
  );
}
