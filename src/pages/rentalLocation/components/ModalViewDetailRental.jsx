import {
  Modal,
  Tag,
  Typography,
  Tabs,
  Button,
  Table,
  Select,
  message,
} from "antd";
import { FaMapLocationDot } from "react-icons/fa6";
import styles from "./RentalLocationTable.module.scss";
import { useState } from "react";
import { useUpdateRentalLocationMutation } from "../../../redux/services/rentalLocationApi";
import { Space } from "antd";
import { useEffect } from "react";
import { Input } from "antd";
import { useGetRentalLogsByRentalIdQuery } from "../../../redux/services/RentalLogApi";
import { useMemo } from "react";
import dayjs from "dayjs";

const { Link } = Typography;
const { Option } = Select;

const RENTALLOCATION_STATUS = {
  PENDING: 1,
  NEEDS_UPDATE: 6,
  INACTIVE: 2,
  ACTIVE: 3,
  PAUSE: 4,
  DELETED: 5,
};

const STATUS_LABELS = {
  [RENTALLOCATION_STATUS.PENDING]: {
    label: "Chờ duyệt",
    bgColor: "#FFF3CD",
    color: "#856404",
  },
  [RENTALLOCATION_STATUS.NEEDS_UPDATE]: {
    label: "Cần cập nhật",
    bgColor: "#FFF3CD",
    color: "#856404",
  },
  [RENTALLOCATION_STATUS.INACTIVE]: {
    label: "Không hoạt động",
    bgColor: "#F8D7DA",
    color: "#721C24",
  },
  [RENTALLOCATION_STATUS.ACTIVE]: {
    label: "Hoạt động",
    bgColor: "#D4EDDA",
    color: "#155724",
  },
  [RENTALLOCATION_STATUS.PAUSE]: {
    label: "Tạm dừng",
    bgColor: "#D1ECF1",
    color: "#0C5460",
  },
  [RENTALLOCATION_STATUS.DELETED]: {
    label: "Xoá bỏ",
    bgColor: "#E2E3E5",
    color: "#6C757D",
  },
};

export default function ModalViewDetailRental({
  visible,
  onClose,
  data,
  onViewFullDetail,
  onReload,
}) {
  if (!data) return null;
  const [tab, setTab] = useState("info");
  const [updateStatus, { isLoading }] = useUpdateRentalLocationMutation();

  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [note, setNote] = useState("");
  const { data: rentalLogs, refetch: refetchRentalLogs } =
    useGetRentalLogsByRentalIdQuery(data?.id, {
      skip: !data?.id,
    });
  console.log(rentalLogs);

  useEffect(() => {
    setSelectedStatus(data.status);
  }, [data.status]);

  const statusInfo = STATUS_LABELS[data.status] || {
    label: "Không xác định",
    bgColor: "#E0E0E0",
    color: "#000000",
  };

  const businessInfo = data?.ownerId?.businessInformationId;

  const handleViewMap = () => {
    const url =
      data.latitude && data.longitude
        ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            data.address
          )}`;
    window.open(url, "_blank");
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      message.warning("Vui lòng chọn trạng thái mới!");
      return;
    }

    // if (selectedStatus !== data.status && !note.trim()) {
    //   message.warning("Vui lòng nhập ghi chú cập nhật!");
    //   return;
    // }
    const updatedData = {
      status: selectedStatus,
      note: note.trim(),
    };

    try {
      await updateStatus({
        id: data.id,
        updatedData: updatedData,
      }).unwrap();

      message.success("Cập nhật trạng thái thành công!");
      onReload?.();
      onClose();
      setNote("");
      refetchRentalLogs();
    } catch (error) {
      console.error(error);
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const formattedLogs = useMemo(() => {
    if (!rentalLogs || !Array.isArray(rentalLogs)) return [];

    return rentalLogs.map((log) => ({
      date: dayjs(log.createdAt, "DD/MM/YYYY HH:mm:ss").format(
        "DD/MM/YYYY HH:mm"
      ),
      status: log.newStatus,
      updatedBy: log.updatedBy?.fullName || "Hệ thống",
      note: log.note,
    }));
  }, [rentalLogs]);

  const tabItems = [
    {
      key: "info",
      label: "Thông tin địa điểm",
      children: (
        <div className={styles.simpleDetailContainer}>
          {/* Các dòng thông tin địa điểm */}
          <div className={styles.row}>
            <span className={styles.label}>Tên địa điểm:</span>
            <span>{data.name}</span>
            <a onClick={() => onViewFullDetail(data)}>Xem chi tiết</a>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Trạng thái:</span>
            <Tag
              style={{
                backgroundColor: statusInfo.bgColor,
                color: statusInfo.color,
                borderRadius: 4,
              }}
            >
              {statusInfo.label}
            </Tag>
          </div>

          {data.status !== RENTALLOCATION_STATUS.DELETED && (
            <div className={styles.row}>
              <span className={styles.label}>Cập nhật trạng thái:</span>
              <Space>
                <Select
                  placeholder="Chọn trạng thái"
                  style={{ width: 180 }}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  disabled={isLoading}
                >
                  {Object.entries(RENTALLOCATION_STATUS)
                    .filter(
                      ([, value]) => value !== RENTALLOCATION_STATUS.PENDING
                      // value !== RENTALLOCATION_STATUS.DELETED // cũng ẩn luôn "Xoá"
                    )
                    .map(([key, value]) => (
                      <Option key={value} value={value}>
                        {STATUS_LABELS[value].label}
                      </Option>
                    ))}
                </Select>

                {selectedStatus !== data.status && (
                  <div className={styles.row}>
                    <span className={styles.label}>Ghi chú cập nhật:</span>
                    <Input.TextArea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Nhập lý do cập nhật trạng thái..."
                    />
                  </div>
                )}

                <Button
                  type="primary"
                  onClick={handleUpdateStatus}
                  loading={isLoading}
                >
                  Cập nhật
                </Button>
              </Space>
            </div>
          )}

          <div className={styles.row}>
            <span className={styles.label}>Ghi chú từ người kiểm duyệt:</span>
            <span>{data.note || "Không có ghi chú"}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Địa chỉ:</span>
            <span>
              {`${data.address}, ${data.ward}, ${data.district}, ${data.city}`}
              <FaMapLocationDot
                onClick={handleViewMap}
                style={{ marginLeft: 10, cursor: "pointer" }}
              />
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Giờ hoạt động:</span>
            <span>{`${data.openHour} - ${data.closeHour}`}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Qua đêm:</span>
            <span>{data.isOverNight ? "Có" : "Không"}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Mô tả:</span>
            <span>{data.description || "Không có mô tả"}</span>
          </div>

          <hr />

          <div className={styles.row}>
            <span className={styles.label}>Công ty:</span>
            <span>{businessInfo?.companyName || "Chưa cập nhật"}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Người đại diện:</span>
            <span>{businessInfo?.representativeName || "Chưa cập nhật"}</span>
          </div>
          {/*
          <div className={styles.row}>
            <span className={styles.label}>Mã số thuế:</span>
            <span>{businessInfo?.taxID || "Chưa cập nhật"}</span>
          </div>

           <div className={styles.row}>
            <span className={styles.label}>Ngày tạo:</span>
            <span>{data.createdAt}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Lần cập nhật:</span>
            <span>{data.updatedAt}</span>
          </div> */}
        </div>
      ),
    },
    {
      key: "history",
      label: "Lịch sử cập nhật",
      children: (
        <Table
          columns={[
            { title: "Ngày", dataIndex: "date", key: "date" },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              render: (status) => {
                const info = STATUS_LABELS[status];
                return (
                  <Tag
                    style={{
                      backgroundColor: info?.bgColor,
                      color: info?.color,
                      borderRadius: 4,
                    }}
                  >
                    {info?.label || "Không xác định"}
                  </Tag>
                );
              },
            },
            // {
            //   title: "Người thay đổi",
            //   dataIndex: "updatedBy",
            //   key: "updatedBy",
            // },
            {
              title: "Ghi chú",
              dataIndex: "note",
              key: "note",
            },
          ]}
          dataSource={formattedLogs}
          pagination={false}
          rowKey={(record, index) => `rental-log-${index}`}
        />
      ),
    },
  ];

  return (
    <Modal
      title={`Chi tiết địa điểm - ${data.name}`}
      open={visible}
      onCancel={onClose}
      width={"70%"}
      // bodyStyle={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 16 }}
      // afterOpenChange={(isOpen) => {
      // document.body.style.overflow = isOpen ? "hidden" : "auto";
      // }}
      // destroyOnClose
    >
      <Tabs activeKey={tab} onChange={setTab} items={tabItems} />
    </Modal>
  );
}
