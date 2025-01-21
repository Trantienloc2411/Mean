import  { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Table, Tag, Modal } from "antd";
import { RentalLocationStatusEnum } from "../../../enums/rentalLocationEnums"; // Import enum

export default function RentalLocationTable({ data, loading }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });
  const [currentRecord, setCurrentRecord] = useState(null);

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Người đại diện",
      dataIndex: "representative",
      key: "representative",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số phòng",
      dataIndex: "roomCount",
      key: "roomCount",
      render: (roomCount) => roomCount || "Không có thông tin",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusData = RentalLocationStatusEnum[status];
        return statusData ? (
          <Tag color={statusData.color}>{statusData.label}</Tag>
        ) : (
          <Tag color="default">Không xác định</Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={() => handleViewDetails(record)}>
                Xem chi tiết
              </Menu.Item>
              <Menu.Item key="2" onClick={() => handleChangeStatus(record)}>
                Vô hiệu hóa hoạt động
              </Menu.Item>
              <Menu.Item key="3" onClick={() => handleStopActivity(record)}>
                Dừng hoạt động
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

  const handleViewDetails = (record) => {
    console.log("Xem chi tiết:", record);
  };

  const handleChangeStatus = (record) => {
    setModalContent({
      title: "Xác nhận vô hiệu hóa hoạt động",
      content: `Bạn có chắc chắn muốn vô hiệu hóa hoạt động của địa điểm "${record.name}"?`,
    });
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleStopActivity = (record) => {
    setModalContent({
      title: "Xác nhận dừng hoạt động",
      content: `Bạn có chắc chắn muốn dừng hoạt động của địa điểm "${record.name}"?`,
    });
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    console.log(
      `${modalContent.title} - Thao tác đã được thực hiện cho địa điểm:`,
      currentRecord
    );
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Table
        scroll={{ x: "max-content" }}
        dataSource={data}
        loading={loading}
        columns={columns}
        rowKey="id"
      />
      <Modal
        title={modalContent.title}
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <p>{modalContent.content}</p>
      </Modal>
    </>
  );
}
