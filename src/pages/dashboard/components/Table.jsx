import { Table } from "antd";

/**
 * 
 * @param {Array} tableColumn - define table column please kindly read docs at: https://ant.design/components/table
 * @param {Array} tableData - is the body of the column 
 * @param {Boolean|Object} isPagination - enable/disable the pagination of table or pagination config object
 * @param {Number} maxItem - slice max item in the list
 * @param {Object} className - additional class name for the table
 * @param {Boolean} loading - loading state for the table
 * 
 * @example
 * 
 * <TableModify
 *   tableColumn={columnPlace}
 *   tableData={placeLove}
 *   isPagination={{
 *     pageSize: 7,
 *     showSizeChanger: false,
 *     className: styles.customPagination,
 *     itemRender: customPaginationRenderer
 *   }}
 *   className={styles.customTable}
 *   loading={isLoading}
 * />
 */
export default function TableModify(props) {
    const {
        tableColumn,
        tableData,
        isPagination,
        maxItem = 0,
        className,
        loading = false
    } = props;

    const dataSource = maxItem < 1 ? tableData : tableData.slice(0, maxItem);

    return (
        <Table
            columns={tableColumn}
            dataSource={dataSource}
            pagination={isPagination}
            className={className}
            loading={loading}
            rowKey={(record) => record.id || record._id || record.key}
        />
    );
}