// import { useState, useEffect, useRef } from "react";
// import { Button, Typography } from "antd";
// import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
// import { Flex } from "antd";
// import styleScroll from "./Notification.module.scss";
// import { useNavigate } from "react-router-dom";
// const { Title, Paragraph } = Typography;

// export default function NotificationPanel({ notifications, onClose }) {
//   const [filter, setFilter] = useState("all");
//   const panelRef = useRef(null);
//   const navigate = useNavigate();
//   // Filter notifications based on 'isRead' state
//   const filteredNotifications = notifications.filter(
//     (notification) => filter === "all" || !notification.isRead
//   );

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Kiểm tra xem người dùng có click vào ngoài panel và không phải là các nút filter
//       if (
//         panelRef.current &&
//         !panelRef.current.contains(event.target) &&
//         !event.target.closest(".ant-btn") // Kiểm tra xem có phải là nút "Unread" hoặc "All" không
//       ) {
//         onClose(); // Đóng panel nếu không phải là nút filter
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside); // Clean up event listener
//     };
//   }, [onClose]);

//   const handleViewAllNotifications = () => {
//     onClose(); // Đóng panel khi nhấn "Tất cả"
//     navigate("/admin/notification"); // Điều hướng tới trang thông báo
//   };

//   return (
//     <div
//       ref={panelRef}
//       style={{
//         position: "absolute",
//         top: "60px",
//         right: 0,
//         height: "80vh",
//         width: "400px",
//         backgroundColor: "#fff",
//         boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
//         zIndex: 9999,
//         padding: 10,
//       }}
//     >
//       <div
//         className={styleScroll.scrollContainer}
//         style={{ height: "100%", background: "#fff", padding: 10 }}
//       >
//         <Flex justify="space-between" style={{ marginBottom: 2 }}>
//           <Title level={4} style={{ margin: 0 }}>
//             Notifications
//           </Title>
//           <Button
//             type="link"
//             onClick={() => handleViewAllNotifications()}
//             style={{
//               fontWeight: "500",
//               textDecoration: "underline",
//               color: "#666",
//             }}
//           >
//             Tất cả
//           </Button>
//         </Flex>
//         <Flex gap={10} style={{ marginBottom: 10 }}>
//           <Button
//             type={filter === "all" ? "primary" : "text"}
//             onClick={() => setFilter("all")}
//             style={{ borderRadius: 10, border: "1px solid #999" }}
//           >
//             Tất cả
//           </Button>
//           <Button
//             type={filter === "unread" ? "primary" : "text"}
//             style={{ borderRadius: 10, border: "1px solid #999" }}
//             onClick={() => setFilter("unread")}
//           >
//             Chưa đọc
//           </Button>
//         </Flex>
//         {filteredNotifications.map((item, index) => (
//           <div
//             key={index} // Dùng key cho mỗi phần tử khi map
//             style={{
//               // borderBottom: "1px solid #f0f0f0",
//               padding: "0px 0px",
//             }}
//           >
//             <Flex>
//               <Flex align="center">
//                 <div style={{ marginRight: "10px" }}>
//                   {item.isRead ? (
//                     <CheckCircleOutlined
//                       style={{
//                         color: "green",
//                         fontSize: "20px",
//                         padding: 10,
//                         background: "#e3e3e3",
//                         borderRadius: 30,
//                       }}
//                     />
//                   ) : (
//                     <BellOutlined
//                       style={{
//                         color: "red",
//                         fontSize: "20px",
//                         padding: 10,
//                         background: "#e3e3e3",
//                         borderRadius: 30,
//                       }}
//                     />
//                   )}
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <Flex align="center" justify="space-between">
//                     <Paragraph
//                       style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}
//                     >
//                       {item.Title}
//                     </Paragraph>
//                     <Paragraph
//                       style={{
//                         color: "#888",
//                         fontSize: "12px",
//                       }}
//                     >
//                       {item.CreateDate}
//                     </Paragraph>
//                   </Flex>
//                   <Paragraph
//                     style={{
//                       fontSize: "14px",
//                       color: "#666",
//                       marginBottom: "0",
//                     }}
//                   >
//                     {item.Content.length > 50
//                       ? `${item.Content.slice(0, 50)}...`
//                       : item.Content}
//                   </Paragraph>
//                 </div>

//                 {!item.isRead && (
//                   <span
//                     style={{
//                       // right: "10px",
//                       // top: "10px",
//                       width: "10px",
//                       height: "10px",
//                       borderRadius: "50%",
//                       backgroundColor: "blue",
//                     }}
//                   ></span>
//                 )}
//               </Flex>
//             </Flex>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Button, Typography } from "antd";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import styleScroll from "./Notification.module.scss";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;
const ITEMS_PER_PAGE = 8;

export default function NotificationPanel({ notifications, onClose }) {
  const [filter, setFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const filteredNotifications = notifications
    .filter((notification) => filter === "all" || !notification.isRead)
    .slice(0, displayCount);

  const hasMore = displayCount < notifications.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !event.target.closest(".ant-btn")
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  const handleViewAllNotifications = () => {
    onClose();
    navigate("/notification");
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: "60px",
        right: 0,
        height: "80vh",
        width: "400px",
        backgroundColor: "#fff",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
        zIndex: 9999,
        padding: 10,
      }}
    >
      <div
        className={styleScroll.scrollContainer}
        style={{ height: "100%", background: "#fff", padding: 10 }}
      >
        <Flex justify="space-between" style={{ marginBottom: 2 }}>
          <Title level={4} style={{ margin: 0 }}>
            Notifications
          </Title>
          <Button
            type="link"
            onClick={handleViewAllNotifications}
            style={{
              fontWeight: "500",
              textDecoration: "underline",
              color: "#666",
            }}
          >
            Tất cả
          </Button>
        </Flex>
        <Flex gap={10} style={{ marginBottom: 10 }}>
          <Button
            type={filter === "all" ? "primary" : "text"}
            onClick={() => setFilter("all")}
            style={{ borderRadius: 10, border: "1px solid #999" }}
          >
            Tất cả
          </Button>
          <Button
            type={filter === "unread" ? "primary" : "text"}
            style={{ borderRadius: 10, border: "1px solid #999" }}
            onClick={() => setFilter("unread")}
          >
            Chưa đọc
          </Button>
        </Flex>

        {filteredNotifications.map((item, index) => (
          <div key={index} style={{ padding: "0px 0px" }}>
            <Flex>
              <Flex align="center">
                <div style={{ marginRight: "10px" }}>
                  {item.isRead ? (
                    <CheckCircleOutlined
                      style={{
                        color: "green",
                        fontSize: "20px",
                        padding: 10,
                        background: "#e3e3e3",
                        borderRadius: 30,
                      }}
                    />
                  ) : (
                    <BellOutlined
                      style={{
                        color: "red",
                        fontSize: "20px",
                        padding: 10,
                        background: "#e3e3e3",
                        borderRadius: 30,
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <Flex align="center" justify="space-between">
                    <Paragraph
                      style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}
                    >
                      {item.Title}
                    </Paragraph>
                    <Paragraph style={{ color: "#888", fontSize: "12px" }}>
                      {item.CreateDate}
                    </Paragraph>
                  </Flex>
                  <Paragraph
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "0",
                    }}
                  >
                    {item.Content.length > 50
                      ? `${item.Content.slice(0, 50)}...`
                      : item.Content}
                  </Paragraph>
                </div>

                {!item.isRead && (
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "blue",
                    }}
                  />
                )}
              </Flex>
            </Flex>
          </div>
        ))}

        {hasMore && (
          <Button
            type="link"
            onClick={handleLoadMore}
            style={{ width: "100%", marginTop: 10 }}
          >
            Xem thêm
          </Button>
        )}
      </div>
    </div>
  );
}
