import styles from "./Report.module.scss";
import { useState, useEffect } from "react";
import { Input, Button, Table, Dropdown, message } from "antd";
import { MoreOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import Filter from "./components/Filter/Filter";
import ReportDetail from "./components/ReportDetail/ReportDetail";
import ReplyReport from "./components/ReplyReport/ReplyReport";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { 
  useGetAllReportsQuery, 
  useGetReportByIdQuery, 
  useUpdateReportMutation 
} from "../../redux/services/reportApi";

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

  const { 
    data: reports, 
    isLoading, 
    error, 
    refetch: refetchReports 
  } = useGetAllReportsQuery();

  const { 
    data: reportDetail, 
    isLoading: isDetailLoading 
  } = useGetReportByIdQuery(selectedReportId, { 
    skip: !selectedReportId 
  });

  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

  useEffect(() => {
    if (reports) {
      const transformedData = reports.map((report) => ({
        id: report.id || report._id,
        customerName: report.bookingId?._id || "N/A", 
        bookingInfo: report.bookingId,
        content: report.content,
        createdAt: report.createdAt,
        isReviewed: report.isReviewed,
        reason: report.reason,
        images: report.images,
        hasReply: !!report.contentReply,
        contentReply: report.contentReply,
        replyBy: report.replyBy,
        updatedAt: report.updatedAt,
        originalData: report 
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
        originalData: reportDetail
      };
      setSelectedReport(updatedReport);
    }
  }, [reportDetail]);

  const getMenuItems = (record) => {
    const items = [
      {
        key: "1",
        label: "Chi tiết",
      }
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
      dataIndex: "customerName",
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
      title: "Content",
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
          <span className={`${styles.status} ${isReviewed ? styles.replied : styles.pending}`}>
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
          <MoreOutlined onClick={(e) => e.preventDefault()}  className={styles.actionIcon} />
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
      filtered = filtered.filter(
        (item) =>
          (item.customerName && item.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.reason && item.reason.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedValues.status?.length > 0) {
      filtered = filtered.filter((item) =>
        selectedValues.status.includes(item.status)
      );
    }
    
    if (selectedValues.date) {
      const selectedDate = dayjs(selectedValues.date).format("DD/MM/YYYY");
      filtered = filtered.filter((item) => {
        if (!item.createdAt) return false;
        const itemDate = item.createdAt.split(" ")[0];
        return itemDate === selectedDate;
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

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Đã xảy ra lỗi khi tải dữ liệu: {error.toString()}</div>;

  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.sectionTitle}>Báo cáo</h1>

      <div className={styles.toolBar}>
        <div className={styles.searchFilter}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo booking ID hoặc lý do"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250, marginBottom: 20, marginRight: 20 }}
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
        onClose={() => setIsDetailModalOpen(false)}
        report={selectedReport}
        isLoading={isDetailLoading}
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