import {
  HistoryOutlined,
  LineChartOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

export default function Overview() {

  return (
    <div>
      <div className="card-list">
        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Tổng người dùng</p>
                <h2>100</h2>
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
                <p>Tổng giao dịch</p>
                <h2>10</h2>
              </div>
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: "#ffded1",
                }}
              >
                <HistoryOutlined style={{ color: "#ff9066" }} />
              </div>
            </div>
          </Card>
        </div>

        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Tổng doanh thu</p>
                <h2>20</h2>
              </div>
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: "#d9f7e8",
                }}
              >
                <LineChartOutlined style={{ color: "#4ad991" }} />
              </div>
            </div>
          </Card>
        </div>
        <div className="card-container">
          <Card style={{ height: 130 }}>
            <div className="card-row">
              <div className="card-content">
                <p>Tổng lợi nhuận</p>
                <h2>100</h2>
              </div>
              <div
                className="icon-wrapper"
                style={{
                  backgroundColor: "#d9f7e8",
                }}
              >
                <RiseOutlined style={{ color: "#4ad991" }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
