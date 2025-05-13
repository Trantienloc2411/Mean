import { Table, Tag, Button, message } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useGetRentalLogsByRentalIdQuery } from "../../../../../../redux/services/RentalLogApi";
import { useUpdateRentalLocationMutation } from "../../../../../../redux/services/rentalApi";

const STATUS_LABELS = {
  1: { label: "Chờ duyệt", bgColor: "#6d9ed6", color: "#ffffff" },
  2: { label: "Không hoạt động", bgColor: "#F8D7DA", color: "#721C24" },
  3: { label: "Hoạt động", bgColor: "#D4EDDA", color: "#155724" },
  4: { label: "Tạm dừng", bgColor: "#D1ECF1", color: "#0C5460" },
  5: { label: "Đã xoá", bgColor: "#E2E3E5", color: "#6C757D" },
  6: { label: "Cần cập nhật", bgColor: "#FFF3CD", color: "#856404" },
};

export default function RentalLogHistory({ rentalData }) {
  const {
    data: rentalLogs,
    isLoading,
    refetch,
  } = useGetRentalLogsByRentalIdQuery(rentalData?.id, {
    skip: !rentalData?.id,
  });

  const [updateRentalStatus, { isLoading: isSubmitting }] =
    useUpdateRentalLocationMutation();

  const formattedLogs = useMemo(() => {
    if (!rentalLogs || !Array.isArray(rentalLogs)) return [];

    return rentalLogs.map((log) => ({
      date: dayjs(log.createdAt).format("DD/MM/YYYY HH:mm"),
      status: log.newStatus,
      updatedBy: log.updatedBy?.fullName || "Hệ thống",
      note: log.note || "",
    }));
  }, [rentalLogs]);
  console.log(rentalLogs);

  const handleRequestReview = async () => {
    try {
      await updateRentalStatus({
        id: rentalData.id,
        updatedData: {
          status: 1, // Trạng thái "Cần cập nhật"
        },
      }).unwrap();
      refetch();
      message.success("Đã gửi yêu cầu duyệt lại.");
    } catch (error) {
      message.error("Gửi yêu cầu thất bại.");
    }
  };

  return (
    <div>
      {rentalData?.status === 2 ||
        (rentalData?.status === 6 && (
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={handleRequestReview}
              loading={isSubmitting}
            >
              Yêu cầu duyệt lại
            </Button>
          </div>
        ))}

      <Table
        loading={isLoading}
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
    </div>
  );
}
