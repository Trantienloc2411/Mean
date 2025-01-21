import "../dashboard/Dashboard.scss";
import { useState, useEffect } from "react";
import Table from "./components/Table";
import ReviewList from "./components/List";

import { placeLove, reviewList } from "./data/dataFake";
import Overview from "./components/Overview";

export default function Dashboard() {
  // const [time, setTime] = useState(new Date());

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

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTime(new Date());
  //   }, 1000);

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <>
      {/* <div className="clock-realtime">
        <p className="clockContent">
          {time.toLocaleTimeString()} {time.toLocaleDateString()}
        </p>
      </div> */}

      <div className="content-container">
        <h1>Tổng quan</h1>
        <Overview
          totalUser="100"
          totalTransaction="10"
          totalRevenue="100"
          totalProfit="10"
        />
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
                tableColumn={columnPlace}
                tableData={placeLove}
                isPagination={false}
              />
            </div>
          </div>

          <div className="list-review-customer-container">
            <h1 className="section-title">Đánh giá khách hàng</h1>
            <ReviewList itemLayout={"horizontal"} dataSource={reviewList} />
          </div>
        </div>
      </div>
    </>
  );
}
