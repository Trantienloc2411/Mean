import "../dashboard/Dashboard.scss";
import { useState, useEffect } from "react";
import { Card, Space, Table, List } from "antd";
import {
  TeamOutlined,
  HistoryOutlined,
  LineChartOutlined,
  RiseOutlined,
  StarFilled,
} from "@ant-design/icons";

import { placeLove, reviewList } from "./data/dataFake";
import Overview from "./components/Overview";

export default function Dashboard() {
  const [time, setTime] = useState(new Date());

  const columnPlace = [
    {
      title: <span className="titleTable">SL No</span>,
      dataIndex: "key",
      key: "key",
    },
    {
      title: <span className="titleTable">Tên Địa Điểm</span>,
      dataIndex: "placeName",
      key: "placeName",
    },
    {
      title: <span className="titleTable">Lượt Đặt Phòng</span>,
      dataIndex: "bookedCount",
      key: "bookedCount",
      sorter: (a, b) => a.bookedCount - b.bookedCount,
    },
    {
      title: <span className="titleTable">Đánh Giá Trung Bình</span>,
      dataIndex: "ratingAverage",
      key: "ratingAverage",
      sorter: (a, b) => a.ratingAverage - b.ratingAverage,
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="clock-realtime">
        <p className="clockContent">
          {time.toLocaleTimeString()} {time.toLocaleDateString()}
        </p>
      </div>

      <div className="content-container">
        <h1>Tổng quan</h1>
        <Overview />
        <h1>Hoạt động tuần</h1>
        {/* chart here */}
        <div>
          <p>Chart here</p>
        </div>

        <div className="list-group-container">
          <div className="list-love-place-container">
            <h1 className="section-title">
              Top 5 địa điểm được yêu thích nhất
            </h1>
            <div className="table-container">
              <Table
                columns={columnPlace}
                dataSource={placeLove.slice(0, 5)}
                pagination={false}
              />
            </div>
          </div>

          <div className="list-review-customer-container">
            <h1 className="section-title">Đánh giá khách hàng</h1>
            <List
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 12,
                width: "100%", // Changed to take full width of container
              }}
              itemLayout="horizontal"
              dataSource={reviewList.slice(0, 3)}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                    }
                    description={<div>{item.content}</div>}
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: 4 }}>{item.rating}</span>
                    <StarFilled style={{ color: "#FFD700" }} />
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}
