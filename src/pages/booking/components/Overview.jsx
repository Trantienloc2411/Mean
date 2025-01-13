import {
    LoadingOutlined,
    FileDoneOutlined,
    StopOutlined,
    CheckOutlined,
    TeamOutlined,
  } from "@ant-design/icons";
  import { Card } from "antd";
  
export default function Overview(props) {
    const {
        totalUser,
        totalWaiting,
        totalConfirmed,
        totalCompleted,
        totalCanceled
    } = props;


    return(
        <div className="card-list">
        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Tổng</p>
                <h2>{totalUser}</h2>
              </div>
              <div className="icon-wrapper">
                <TeamOutlined />
              </div>
            </div>
          </Card>
        </div>

        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Đang chờ xử lí</p>
                <h2>{totalWaiting}</h2>
              </div>
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: "#D3D0CEFF",
                }}
              >
                <LoadingOutlined spin='true'  style={{ color: "#8F8D8CFF" }} />
              </div>
            </div>
          </Card>
        </div>

        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Đã xác nhận</p>
                <h2>{totalConfirmed}</h2>
              </div>
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: "#d9f7e8",
                }}
              >
                <FileDoneOutlined  style={{ color: "#4ad991" }} />
              </div>
            </div>
          </Card>
        </div>
        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Đã hoàn tất</p>
                <h2>{totalCompleted}</h2>
              </div>
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: "#A3F7F7FF",
                }}
              >
                <CheckOutlined  style={{ color: "#6CCAF0FF" }} />
              </div>
            </div>
          </Card>
        </div>
        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Đã huỷ</p>
                <h2>{totalCanceled}</h2>
              </div>
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: "#ffded1",
                }}
              >
                <StopOutlined  style={{ color: "#ff9066" }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    
);
}