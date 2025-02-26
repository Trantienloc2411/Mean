import { Table } from "antd";

/**
 * 
 * @param {Array} tableColumn - define table column please kindly read docs at: https://ant.design/components/table
 * @param {Array} tableData - is the body of the column 
 * @param {Boolean} isPagination - enable/disable the pagination of table
 * @param {Number} maxItem - slice max item in the list
 * 
 * @example
 * 
 * <Table
    tableColumn={columnPlace}
    tableData={placeLove.slice(0,5)}
    isPagination={false}
    />
 * 
 * 
 * const tableColumn = [
    {
      title: <span className="titleTable">SL No</span>,
      dataIndex: "key",
      key: "key",
    },
    {
      title: <span className="titleTable">Tên Địa Điểm</span>,
      dataIndex: "placeName",
      key: "placeName",
    },
    {
      title: <span className="titleTable">Lượt Đặt Phòng</span>,
      dataIndex: "bookedCount",
      key: "bookedCount",
      sorter: (a, b) => a.bookedCount - b.bookedCount,
    },
    {
      title: <span className="titleTable">Đánh Giá Trung Bình</span>,
      dataIndex: "ratingAverage",
      key: "ratingAverage",
      sorter: (a, b) => a.ratingAverage - b.ratingAverage,
    },
  ];

 * 
 * 
 */
export default function TableModify(props) {

    const {
        tableColumn,
        tableData,
        isPagination,
        maxItem = 0,
    } = props;


    return (
        <Table
            columns={tableColumn}
            dataSource={maxItem < 1 ? tableData : tableData.slice(0, maxItem)}
            pagination={isPagination}
            
        />
    );
}