import styles from "./Report.module.scss";
import { useState, useEffect } from "react";
import { Input, Button, Table, Dropdown, message } from "antd";
import {
  MoreOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Filter from "./components/Filter/Filter";
import ReportDetail from "./components/ReportDetail/ReportDetail";
import ReplyReport from "./components/ReplyReport/ReplyReport";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  useGetAllReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportMutation,
} from "../../redux/services/reportApi";
import { Spin } from "antd";

dayjs.extend(customParseFormat);

export default function Report() {
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    date: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isReloading, setIsReloading] = useState(false);

  const {
    data: reports,
    isLoading,
    error,
    refetch: refetchReports,
  } = useGetAllReportsQuery();

  const { data: reportDetail, isLoading: isDetailLoading } =
    useGetReportByIdQuery(selectedReportId, {
      skip: !selectedReportId,
    });

  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

  useEffect(() => {
    if (reports) {
      const transformedData = reports.map((report) => ({
        id: report.id || report._id,
        bookingId: report.bookingId?._id || "N/A",
        customerName: report.bookingId?.customerId?.userId?.fullName || "N/A",
        content: report.content,
        createdAt: report.createdAt,
        isReviewed: report.isReviewed,
        reason: report.reason,
        images: report.images,
        hasReply: !!report.contentReply,
        contentReply: report.contentReply,
        replyBy: report.replyBy,
        updatedAt: report.updatedAt,
        originalData: report,
      }));
      setAllReports(transformedData);
      setFilteredData(transformedData);
    }
  }, [reports]);

  useEffect(() => {
    if (reportDetail && selectedReport) {
      const updatedReport = {
        ...selectedReport,
        content: reportDetail.content,
        reason: reportDetail.reason,
        isReviewed: reportDetail.isReviewed,
        images: reportDetail.images,
        hasReply: !!reportDetail.contentReply,
        contentReply: reportDetail.contentReply,
        replyBy: reportDetail.replyBy,
        updatedAt: reportDetail.updatedAt,
        originalData: reportDetail,
      };
      setSelectedReport(updatedReport);

      updateLocalReportData(updatedReport);
    }
  }, [reportDetail]);

  const updateLocalReportData = (updatedReport) => {
    if (!updatedReport) return;

    const updateInArray = (array) =>
      array.map((item) =>
        item.id === updatedReport.id ? { ...item, ...updatedReport } : item
      );

    setAllReports((prev) => updateInArray(prev));
    setFilteredData((prev) => updateInArray(prev));
  };

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await refetchReports();
      message.success("Dữ liệu đã được làm mới");
    } catch (error) {
      message.error("Làm mới dữ liệu thất bại");
    } finally {
      setIsReloading(false);
    }
  };

  const getMenuItems = (record) => {
    const items = [
      {
        key: "1",
        label: "Chi tiết",
      },
    ];

    if (!record.hasReply) {
      items.push({
        key: "2",
        label: "Trả lời",
      });
    }

    return items;
  };

  const handleMenuClick = (key, record) => {
    setSelectedReport(record);
    setSelectedReportId(record.id);

    if (key === "1") {
      setIsDetailModalOpen(true);
    } else if (key === "2") {
      setIsReplyModalOpen(true);
    }
  };

  const handleReportViewed = async (reportId) => {
    try {
      const reportToUpdate = allReports.find(
        (report) => report.id === reportId
      );
      if (reportToUpdate && !reportToUpdate.isReviewed) {
        const updateData = {
          id: reportId,
          isReviewed: true,
        };

        await updateReport(updateData);

        const updatedReport = { ...reportToUpdate, isReviewed: true };
        updateLocalReportData(updatedReport);
      }
    } catch (err) {
      console.error("Error updating report viewed status:", err);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "customerName",
      width: 150,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 120,
    },
    {
      title: "Mô tả",
      dataIndex: "content",
      key: "content",
      width: 300,
      render: (text) => (
        <div className={styles.truncatedContent}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "isReviewed",
      key: "isReviewed",
      width: 120,
      render: (isReviewed) => {
        return (
          <span
            className={`${styles.status} ${
              isReviewed ? styles.replied : styles.pending
            }`}
          >
            {isReviewed ? "Đã xem" : "Chưa xem"}
          </span>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: getMenuItems(record),
            onClick: ({ key }) => handleMenuClick(key, record),
          }}
        >
          <MoreOutlined
            onClick={(e) => e.preventDefault()}
            className={styles.actionIcon}
          />
        </Dropdown>
      ),
    },
  ];

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const handleFilterChange = (filterName, newValue) => {
    setSelectedValues((prev) => ({
      ...prev,
      [filterName]: newValue,
    }));
  };

  useEffect(() => {
    if (!allReports.length) return;

    let filtered = [...allReports];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.bookingId?.toLowerCase().includes(lowerSearch) ||
          item.reason?.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedValues.status?.length > 0) {
      filtered = filtered.filter((item) => {
        return selectedValues.status.some((status) => {
          if (status === "reviewed") return item.isReviewed === true;
          if (status === "pending") return item.isReviewed === false;
          return false;
        });
      });
    }

    if (selectedValues.date) {
      const selectedDate = dayjs(selectedValues.date).startOf("day");
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.createdAt, "DD/MM/YYYY HH:mm:ss").startOf(
          "day"
        );
        return itemDate.isSame(selectedDate);
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedValues, allReports]);

  const getActiveFiltersCount = () => {
    return selectedValues.status.length + (selectedValues.date ? 1 : 0);
  };

  const handleReplySubmit = async (replyData) => {
    try {
      if (replyData) {
        await updateReport(replyData);
        message.success("Báo cáo đã được trả lời thành công");
        refetchReports();
        setIsReplyModalOpen(false);
      }
    } catch (err) {
      message.error("Không thể trả lời báo cáo, vui lòng thử lại");
      console.error("Error submitting reply:", err);
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  if (error)
    return <div>Đã xảy ra lỗi khi tải dữ liệu: {error.toString()}</div>;

  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.sectionTitle}>Báo cáo</h1>

      <div className={styles.toolBar}>
        <div className={styles.searchFilter}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo booking ID hoặc lý do"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250, marginRight: 20 }}
          />

          <Dropdown
            trigger={["click"]}
            dropdownRender={() => (
              <Filter
                selectedValues={selectedValues}
                onFilterChange={handleFilterChange}
              />
            )}
          >
            <Button icon={<FilterOutlined />}>
              Lọc
              {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
            </Button>
          </Dropdown>
          <Button
            icon={<ReloadOutlined spin={isReloading} />}
            onClick={handleReload}
            loading={isReloading}
            style={{ marginLeft: 10 }}
          >
            Làm mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: filteredData.length,
          pageSize: 7,
          showSizeChanger: false,
          className: styles.customPagination,
          itemRender: (page, type, originalElement) => {
            const totalPages = Math.ceil(filteredData.length / 7);

            if (type === "prev") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={page === 0}
                >
                  « Trước
                </button>
              );
            }
            if (type === "next") {
              return (
                <button
                  className={styles.paginationButton}
                  disabled={page >= totalPages}
                >
                  Tiếp »
                </button>
              );
            }
            return originalElement;
          },
        }}
        className={styles.reportTable}
      />

      <ReportDetail
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        report={selectedReport}
        isLoading={isDetailLoading}
        onReportViewed={handleReportViewed}
      />

      <ReplyReport
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        report={selectedReport}
        onSubmit={handleReplySubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
