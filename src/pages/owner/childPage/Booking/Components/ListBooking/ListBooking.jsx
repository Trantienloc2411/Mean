import styles from '../ListBooking/ListBooking.module.scss';
import { Dropdown, Tag, Input, Checkbox, Button } from 'antd';
import TableModify from '../../../../../dashboard/components/Table'
import { BookingData } from '../../data/fakeData';
import {
    FilterOutlined,
    MoreOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Filter from '../../../../../../components/Filter/Filter';
export default function ListBooking(props) {

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(BookingData);
    const [selectedValues, setSelectedValues] = useState({
        status: [],
        payment: []
    });

    const filterGroups = [
        {
            name: 'status',
            title: 'Trạng thái',
            options: [
                {
                    label: <Tag color="blue">Confirmed</Tag>,
                    value: 'Confirmed'
                },
                {
                    label: <Tag color="orange">Pending</Tag>,
                    value: 'Pending'
                },
                {
                    label: <Tag color="green">Complete</Tag>,
                    value: 'Complete'
                },
                {
                    label: <Tag color="red">Canceled</Tag>,
                    value: 'Canceled'
                },
                {
                    label: <Tag color="purple">In Progress</Tag>,
                    value: 'In Progress'
                }
            ]
        },
        {
            name: 'payment',
            title: 'Thanh toán',
            options: [
                {
                    label: <Tag color="blue">Deposited</Tag>,
                    value: 'Deposited'
                },
                {
                    label: <Tag color="green">Fully Paid</Tag>,
                    value: 'Fully Paid'
                },
                {
                    label: <Tag color="orange">Unpaid</Tag>,
                    value: 'Unpaid'
                },
                {
                    label: <Tag color="red">Deposit Returned</Tag>,
                    value: 'Deposit Returned'
                },
                {
                    label: <Tag color="purple">Deposit Forfeited</Tag>,
                    value: 'Deposit Forfeited'
                }
            ]
        }
    ];
    const applyFilters = (filters) => {
        let filtered = [...BookingData];

        if (filters.status.length > 0) {
            filtered = filtered.filter(item => filters.status.includes(item.Status));
        }

        if (filters.payment.length > 0) {
            filtered = filtered.filter(item => filters.payment.includes(item.Payment));
        }

        setFilteredData(filtered);
    };


    const handleFilterChange = (filterName, newValues) => {
        setSelectedValues(prev => ({
            ...prev,
            [filterName]: newValues
        }));

        applyFilters({
            ...selectedValues,
            [filterName]: newValues
        });
    };

    const debouncedSearch = debounce((value) => {
        const filtered = BookingData.filter((item) =>
            item["Customer Name"].toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    }, 1000);

    // Handle search input change
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Clean up debounce on component unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);
    const items = [
        {
            key: '1',
            label: 'Xem chi tiết',
        },
    ];

    const tableColumn = [

        {
            title: <span className="titleTable">No</span>,
            dataIndex: "No",
            key: "No",
        },
        {
            title: <span className="titleTable">Tên Khách Hàng</span>,
            dataIndex: "Customer Name",
            key: "customerName",
        },
        {
            title: <span className="titleTable">Tên Địa Điểm</span>,
            dataIndex: "Location",
            key: "Location",
        },
        {
            title: <span className="titleTable">Thời gian đặt</span>,
            dataIndex: "Booking Time",
            key: "bookingTime",
            sorter: (a, b) => {
                // Convert "Booking Time" strings to Date objects for comparison
                const dateA = new Date(a["Booking Time"]);
                const dateB = new Date(b["Booking Time"]);
                return dateA - dateB; // Compare timestamps
            },
        },
        {
            title: <span className="titleTable">Thời gian sử dụng</span>,
            dataIndex: "Usage Time",
            key: "usageTime",
            sorter: (a, b) => {
                // Convert "Booking Time" strings to Date objects for comparison
                const dateA = new Date(a["Usage Time"]);
                const dateB = new Date(b["Usage Time"]);
                return dateA - dateB; // Compare timestamps
            },
        },
        {
            title: <span className="titleTable">Tổng hoá đơn</span>,
            dataIndex: "Total Amount",
            key: "totalAmount",
            sorter: (a, b) => a["Total Amount"] - b["Total Amount"],
            render: (value) => {
                return `${parseInt(value, 10).toLocaleString("en-US")} vnđ`;
            }
        },
        {
            title: <span className="titleTable">Trạng thái</span>,
            dataIndex: "Status",
            key: "status",
            align: 'center',
            render: (_, { Status }) => {
                // Define status-to-color mapping
                let color = "";
                let text = Status;

                switch (Status) {
                    case "Confirmed":
                        color = "blue"; // Blue for Confirmed
                        text = "Confirmed";
                        break;
                    case "Pending":
                        color = "orange"; // Orange for Pending
                        text = "Pending";
                        break;
                    case "Complete":
                        color = "green"; // Green for Complete
                        text = "Complete";
                        break;
                    case "Canceled":
                        color = "red"; // Red for Cancel
                        text = "Canceled";
                        break;
                    case "In Progress":
                        color = "purple"; // Purple for InProgress
                        text = "In Progress";
                        break;
                    default:
                        color = "default"; // Fallback color for unknown statuses
                        text = "Unknown";
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: <span className="titleTable">Thanh toán</span>,
            dataIndex: "Payment",
            key: "payment",
            align: 'center',
            render: (_, { Payment }) => {
                // Define payment-to-color mapping
                let color = "";
                let text = Payment;

                switch (Payment) {
                    case "Deposited":
                        color = "blue"; // Blue for Deposited
                        text = "Deposited";
                        break;
                    case "Fully Paid":
                        color = "green"; // Green for Fully Paid
                        text = "Fully Paid";
                        break;
                    case "Unpaid":
                        color = "orange"; // Orange for Unpaid
                        text = "Unpaid";
                        break;
                    case "Deposit Returned":
                        color = "red"; // Red for Deposit Returned
                        text = "Deposit Returned";
                        break;
                    case "Deposit Forfeited":
                        color = "purple"; // Purple for Deposit Forfeited
                        text = "Deposit Forfeited";
                        break;
                    default:
                        color = "default"; // Fallback color for unknown payment statuses
                        text = "Unknown";
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },

        {
            title: <span className="titleTable">Action</span>,
            key: "operation",
            render: () =>
            (
                <Dropdown
                    menu={
                        {
                            items
                        }
                    }
                >
                    <MoreOutlined />

                </Dropdown>
            )
        },
    ];

    return (
        <div className='content'>
            <h2>Danh sách đặt phòng:</h2>
            <div className="list-booking">
                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'row' }}>
                    <Input
                        placeholder="Tìm kiếm tên khách hàng"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: '250px' }}
                    />

                    <Dropdown
                        overlay={
                            <Filter
                                filterGroups={filterGroups}
                                selectedValues={selectedValues}
                                onFilterChange={handleFilterChange}
                            />
                        }
                        trigger={['click']}
                        placement="bottomRight"
                        overlayStyle={{
                            padding: '8px'
                        }}
                    >
                        <Button icon={<FilterOutlined />}>
                            Lọc
                            {Object.values(selectedValues).flat().length > 0 &&
                                ` (${Object.values(selectedValues).flat().length})`}
                        </Button>
                    </Dropdown>

                </div>

                <TableModify
                    tableColumn={tableColumn}
                    tableData={filteredData}
                    isPagination={true}
                />
            </div>
        </div>
    );
}