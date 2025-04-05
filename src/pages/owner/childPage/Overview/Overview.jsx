import styles from "../Overview/Overview.module.scss";
import CardDashboard from "../../../../components/Card/CardDashboard";
import { TeamOutlined } from "@ant-design/icons";
import { reviews } from "./data/fakeData.js";
import ReviewList from "./components/ReviewList.jsx";
import CalendarList from "./components/CalendarList.jsx";
import CardListBooking from "./components/CardListBooking.jsx";
export default function Overview() {
  return (
    <div className={styles.contentContainer}>
      

      <h1>Booking hôm nay: </h1>
      {/* <CalendarList />   */}
      <div className={styles.bookingOverview}>
      <CardListBooking
        stageLevel="1"
        // bookingList={reviews}
        listBookingTypeName="Đặt phòng sắp tới"
      />
      <CardListBooking
        stageLevel="2"
        // bookingList={reviews}
        listBookingTypeName="Đang đặt phòng"
      />
      <CardListBooking
        stageLevel="2"
        // bookingList={reviews}
        listBookingTypeName="Đặt phòng hoàn tất"
      />
      </div>
      
      <h1>Tổng hợp: </h1>
      <div className={styles.rowItems}>
        <CardDashboard
          title="Tổng"
          value="100"
          iconName={<TeamOutlined />}
          backgroundColorIcon="#d0cfff"
          colorIcon="#8280FF"
          height="100"
          width="300"
        />

        <CardDashboard
          title="Hoàn tất"
          value="100"
          iconName={<TeamOutlined />}
          backgroundColorIcon="#d0cfff"
          colorIcon="#8280FF"
          height="100"
          width="300"
        />
        <CardDashboard
          title="Huỷ"
          value="100"
          iconName={<TeamOutlined />}
          backgroundColorIcon="#d0cfff"
          colorIcon="#8280FF"
          height="100"
          width="300"
        />
        <CardDashboard
          title="Lợi nhuận"
          value="100"
          iconName={<TeamOutlined />}
          backgroundColorIcon="#d0cfff"
          colorIcon="#8280FF"
          height="100"
          width="300"
        />
      </div>
      <div className={styles.rowItems}>
        <div className="graph">graph here</div>
        <div className="list">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
