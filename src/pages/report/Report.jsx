import styles from "./Report.module.scss";
import { useState, useEffect } from "react";
import { Input, Button, Table, Dropdown } from "antd";
import { MoreOutlined, FilterOutlined } from "@ant-design/icons";
import Filter from "./components/Filter/Filter";
import ReportDetail from "./components/ReportDetail/ReportDetail";
import ReplyReport from "./components/ReplyReport/ReplyReport";
import { reportData } from "./data/fakeData";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function Report() {
  const [selectedValues, setSelectedValues] = useState({
    status: [],
    date: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(reportData);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const items = [
    {
      key: "1",
      label: "Chi tiết",
    },
    {
      key: "2",
      label: "Trả lời",
    },
  ];

  const handleMenuClick = (key, record) => {
    setSelectedReport(record);
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
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 120,
    },
    {
      title: "Tên địa điểm",
      dataIndex: "locationName",
      key: "locationName",
      width: 150,
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
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
          {status === "Reviewed" ? "Đã xem" : "Chưa xem"}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => handleMenuClick(key, record),
          }}
        >
          <MoreOutlined className={styles.actionIcon} />
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
    let filtered = [...reportData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.locationName.toLowerCase().includes(searchTerm.toLowerCase())
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
        const itemDate = item.createdAt.split(" ")[1];
        return itemDate === selectedDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedValues]);

  const getActiveFiltersCount = () => {
    return selectedValues.status.length + (selectedValues.date ? 1 : 0);
  };

  return (
    <div className={styles.container}>
      <h1>Báo cáo</h1>

      <div className={styles.toolBar}>
        <div className={styles.searchFilter}>
          <Input
            placeholder="Tìm kiếm tên khách hàng"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
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
      />

      <ReplyReport
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        report={selectedReport}
        onSubmit={(reply) => {
          console.log("Reply submitted:", reply);
          setIsReplyModalOpen(false);
        }}
      />
    </div>
  );
}
