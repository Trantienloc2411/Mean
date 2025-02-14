import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";

import { Dropdown, Menu, Table, Tag, Modal } from "antd";
import styles from "./Table.module.scss";
import { useNavigate } from "react-router-dom";
import ModalViewDetailRental from "./ModalViewDetailRental";


export default function RentalLocationTable({ data, loading }) {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const navigate = useNavigate();

  const mapStatus = (status) =>
    status
      ? { label: "Hoạt động", color: "green" }
      : { label: "Ngừng hoạt động", color: "red" };

  const handleViewDetails = (record) => {
    setSelectedRental(record);
    setIsDetailModalVisible(true);
  };

  const handleChangeStatus = (record) => {
    console.log(
      `${record.status ? "Ngưng hoạt động" : "Kích hoạt lại"} địa điểm:`,
      record.name
    );
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    { title: "Tên địa điểm", dataIndex: "name", key: "name" },
    {
      title: "Người đại diện",
      dataIndex: "representative",
      key: "representative",
      render: (rep) => rep || "Chưa cập nhật",
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",

      render: (status) => {
        return (
          <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
                      {status === "Active"
                        ? "Đang hoạt động"
                        : status === "Pending"
                        ? "Chờ xét duyệt"
                        : status === "Suspended"
                        ? "Tạm dừng"
                        : status === "UnderReview" 
                        ? "Đang xét duyệt"
                        : status === "Inactive"
                        ? "Không hoạt động"
                        : status}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={() => handleViewDetails(record)}>
                Xem
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => navigate(`/rental-location/${record.id}`)}
              >
                Xem chi tiết
              </Menu.Item>
              <Menu.Item key="3" onClick={() => handleChangeStatus(record)}>
                {record.status ? "Ngưng hoạt động" : "Hoạt động lại"}
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Table
        scroll={{ x: "max-content" }}
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="id"
      />
      <ModalViewDetailRental
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        data={selectedRental}
      />
    </>
  );
}
