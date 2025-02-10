import { useState, useCallback } from "react";
import { Button, Input, Select, Table, Upload, Space } from "antd";
import { FilterOutlined, SearchOutlined, PaperClipOutlined, InboxOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";

const { Option } = Select;
const { Dragger } = Upload;

export default function DocumentManagement() {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fileList, setFileList] = useState([]);

  const styles = {
    container: {
      padding: "24px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    searchInput: {
      width: "300px",
    },
    filters: {
      display: "flex",
      gap: "16px",
      marginBottom: "24px",
      flexWrap: "wrap",
    },
    filterSelect: {
      width: "200px",
      "@media (max-width: 768px)": {
        width: "calc(50% - 8px)",
      },
      "@media (max-width: 480px)": {
        width: "100%",
      },
    },
    uploadArea: {
      marginBottom: "24px",
      background: "#fafafa",
      border: "2px dashed #e8e8e8",
      borderRadius: "8px",
      padding: "32px",
    },
    uploadText: {
      margin: "8px 0",
      color: "#666",
    },
    uploadIcon: {
      fontSize: "48px",
      color: "#999",
    },
    statusComplete: {
      background: "#e6f7f0",
      color: "#52c41a",
      padding: "4px 8px",
      borderRadius: "4px",
    },
    table: {
      background: "white",
      borderRadius: "8px",
    },
  }

  // Sample data for the table
  const data = [
    {
      key: "1",
      documentName: "PR_Sales_4561234",
      documentType: "Doc",
      documentDate: "01.05.2020, 14:28",
      staff: "Braun Henry",
      status: "Complete",
      region: "New Hampshire",
    },
    {
      key: "2",
      documentName: "PR_Sales_4572131",
      documentType: "Doc",
      documentDate: "01.05.2020, 14:32",
      staff: "Salih Demirci",
      status: "Complete",
      region: "New Hampshire",
    },
    // Add more sample data as needed
  ]

  // Function to filter data based on search text
  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim()
    const filtered = data.filter((item) =>
      Object.keys(item).some((key) => item[key].toString().toLowerCase().includes(lowercasedValue)),
    )
    setFilteredData(filtered)
  }

  // Debounce the filterData function to avoid excessive filtering on every keystroke
  const debouncedFilterData = useCallback(debounce(filterData, 300), [])

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchText(value)
    debouncedFilterData(value)
  }

  const uploadProps = {
    name: "file",
    multiple: false,
    fileList: fileList,
    beforeUpload: (file) => {
      const isValidType = [".pdf", ".doc", ".docx"].includes(file.name.slice(file.name.lastIndexOf(".")))
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isValidType) {
        message.error("You can only upload PDF or Word documents!")
      }
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!")
      }

      return isValidType && isLt5M
    },
    onChange: (info) => {
      const { status } = info.file
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`)
      }
      setFileList(info.fileList.slice(-1))
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }

  const columns = [
    {
      title: "Tên tài liệu",
      dataIndex: "documentName",
      key: "documentName",
      sorter: (a, b) => a.documentName.localeCompare(b.documentName),
    },
    {
      title: "Loại tài liệu",
      dataIndex: "documentType",
      key: "documentType",
    },
    {
      title: "Document Date",
      dataIndex: "documentDate",
      key: "documentDate",
      sorter: (a, b) => new Date(a.documentDate) - new Date(b.documentDate),
    },
    {
      title: "Người thực hiện",
      dataIndex: "staff",
      key: "staff",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <span style={styles.statusComplete}>{status}</span>,
    },
    {
      title: "Hành động",
      key: "operation",
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<SearchOutlined />} />
          <Button type="text" icon={<FilterOutlined />} />
          <Button type="text" icon={<PaperClipOutlined />} />
        </Space>
      ),
    },
  ]

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Quản lí tài liệu đất</h3>
      </div>

      <div style={styles.container}>
        {/* Search and filters header */}
        <div style={styles.header}>
          <Input
            placeholder="Tìm kiếm tên tài liệu..."
            prefix={<SearchOutlined />}
            style={styles.searchInput}
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        {/* Filter dropdowns */}
        <div style={styles.filters}>
          <Select defaultValue="Document Type" style={styles.filterSelect}>
            <Option value="doc">Doc</Option>
          </Select>
          <Select defaultValue="Document Date" style={styles.filterSelect}>
            <Option value="recent">Recent</Option>
          </Select>
          <Select defaultValue="Staff" style={styles.filterSelect}>
            <Option value="all">All Staff</Option>
          </Select>
        </div>

        {/* Document upload area */}
        <Dragger {...uploadProps} style={styles.uploadArea}>
          <p>   
            <InboxOutlined style={styles.uploadIcon} />
          </p>
          <p style={styles.uploadText}>Thả tài liệu ở đây.  </p>
          <p style={styles.uploadText}>
            <a href="#">Nhấn để chọn tài liệu</a>
          </p>
          <p style={{ marginTop: "8px", fontStyle: "italic" }}>Chỉ nhận các tệp tin có dung lượng dưới 5 MB và đuôi tệp tin có định dạng (*.pdf, *.doc, *.docx ) </p>
        </Dragger>

        {/* Documents table */}
        <Table columns={columns} dataSource={searchText ? filteredData : data} style={styles.table} />
      </div>
    </>
  )
}

