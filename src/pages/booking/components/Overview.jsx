import {
  LoadingOutlined,
  FileDoneOutlined,
  StopOutlined,
  CheckOutlined,
  TeamOutlined
} from "@ant-design/icons";
import React from 'react';
import { Card } from "antd";
import CardDashboard from "../../../components/Card/CardDashboard.jsx";
import styles from '../components/Overview.module.scss';
export default function Overview(props) {
  const {
    totalUser,
    totalWaiting,
    totalConfirmed,
    totalCompleted,
    totalCanceled
  } = props;


  return (
    <div className="cardList" style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    }}>
      <CardDashboard
        title={"Tổng"}
        value={"100"}
        iconName={<TeamOutlined />}
        backgroundColorIcon={"#e5e4ff"}
        colorIcon={"#8280FF"}
        width='300'
        height='120'
      ></CardDashboard>

      <CardDashboard
        title={"Đang chờ xử lí"}
        value={"100"}
        iconName={<LoadingOutlined spin='true' style={{ color: "#8F8D8CFF" }} />}
        backgroundColorIcon={"#D3D0CEFF"}
        colorIcon={"#8F8D8CFF"}
        width='300'
        height='120'
      ></CardDashboard>
      <CardDashboard
        title={"Đã xác nhận"}
        value={"100"}
        iconName={<FileDoneOutlined style={{ color: "#4ad991" }} />}
        backgroundColorIcon={"#d9f7e8"}
        colorIcon={"#4ad991"}
        width='300'
        height='120'
      ></CardDashboard>

      <CardDashboard
        title={"Đã hoàn tất"}
        value={"100"}
        iconName={<CheckOutlined style={{ color: "#6CCAF0FF" }} />}
        backgroundColorIcon={"#A3F7F7FF"}
        colorIcon={"#6CCAF0FF"}
        width='300'
        height='120'
      ></CardDashboard>

      <CardDashboard
        title={"Đã huỷ"}
        value={"100"}
        iconName={<StopOutlined style={{ color: "#ff9066" }} />}
        backgroundColorIcon={"#ffded1"}
        colorIcon={"#ff9066"}
        width='300'
        height='120'
      ></CardDashboard>
    </div>

  );
}