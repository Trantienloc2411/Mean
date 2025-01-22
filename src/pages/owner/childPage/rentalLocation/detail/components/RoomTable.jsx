import { Tag, Dropdown, Menu, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import {
  RoomApprovalStatusEnum,
  RoomConditionEnum,
} from "../../../../../../enums/roomEnum";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

export default function RoomTable() {
  const navigate = useNavigate();

  const handleMenuClick = (key, record) => {
    if (key === "detail") {
      navigate(`/accomodation/${record.key}`);
    } else if (key === "edit") {
      navigate(`/accomodation/edit/${record.key}`);
    }
  };

  return [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Số người tối đa",
      dataIndex: "maxPeople",
      key: "maxPeople",
    },
    {
      title: "Tiện ích đi kèm",
      dataIndex: "amenities",
      key: "amenities",
      render: (amenities) => (
        <Dropdown
          overlay={
            <Menu>
              {amenities.map((amenity, index) => (
                <Menu.Item key={index}>{amenity}</Menu.Item>
              ))}
            </Menu>
          }
          trigger={["hover"]}
        >
          <Typography>{amenities.length} tiện ích</Typography>
        </Dropdown>
      ),
    },
    {
      title: "Giá phòng ban đầu",
      dataIndex: "initialPrice",
      key: "initialPrice",
    },
    {
      title: "Giá theo giờ",
      dataIndex: "hourlyPrice",
      key: "hourlyPrice",
    },
    {
      title: "Tình trạng",
      dataIndex: "condition",
      align: "center",
      key: "condition",
      render: (condition) => {
        const config = RoomConditionEnum[condition];
        return (
          <Tag
            style={{
              padding: "2px 10px",
              borderRadius: 20,
              color: config?.textColor,
              backgroundColor: config?.backgroundColor,
            }}
          >
            {config?.label}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status) => {
        const config = RoomApprovalStatusEnum[status];
        return (
          <Tag
            style={{
              padding: "2px 10px",
              borderRadius: 20,
              color: config?.textColor,
              backgroundColor: config?.backgroundColor,
            }}
          >
            {config?.label}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => handleMenuClick(key, record)}>
              <Menu.Item key="detail">Xem chi tiết</Menu.Item>
              <Menu.Item key="edit">Sửa</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];
}
