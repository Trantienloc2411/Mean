import React, { useState } from 'react';
import { Layout, Input, Button, Calendar, Badge, Avatar, Card, Tooltip, Typography, Tabs, Divider, Row, Col } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined, CalendarOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './Calendar.module.scss';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data for staff members
const staffMembers = [
  { id: 1, name: 'Nicholas Amazon', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', hours: 8 },
  { id: 2, name: 'Logan Harrington', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', hours: 6 },
  { id: 3, name: 'Leonard Campbell', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', hours: 8 },
];

// Mock data for bookings
const bookings = [
  { 
    id: '#327', 
    title: 'Remodeling', 
    time: '9:30 - 10:00', 
    type: 'Personal Task',
    staff: 1,
    icon: 'tool'
  },
  { 
    id: '#312', 
    title: 'Generate Report', 
    time: '10:00 - 10:30', 
    type: 'Personal Task',
    staff: 1,
    icon: 'file'
  },
  { 
    id: '#296', 
    title: 'Bathroom Remodeling', 
    time: '10:00 - 10:30', 
    type: 'Maintenance Request',
    staff: 2,
    icon: 'tool',
    unitDetails: {
      unitNumber: '5A',
      address: '225 Cherry Street #24 Brooklyn, NY',
      assignee: 'Nicholas Amazon'
    }
  },
  { 
    id: '#318', 
    title: 'Garbage Disposal', 
    time: '10:30 - 11:00', 
    type: 'Personal Task',
    staff: 2,
    icon: 'delete'
  },
  { 
    id: '#332', 
    title: 'Landscaping Services', 
    time: '10:30 - 11:00', 
    type: 'Personal Task',
    staff: 3,
    icon: 'environment'
  },
  { 
    id: '#305', 
    title: 'Chimney Repair', 
    time: '11:00 - 11:30', 
    type: 'Maintenance Request',
    staff: 1,
    icon: 'fire'
  },
  { 
    id: '#294', 
    title: 'Energy Audit', 
    time: '11:30 - 12:00', 
    type: 'Personal Task',
    staff: 2,
    icon: 'thunderbolt'
  },
  { 
    id: '#273', 
    title: 'Garbage Disposal', 
    time: '12:00 - 12:30', 
    type: 'Internal Task',
    staff: 1,
    icon: 'delete'
  },
  { 
    id: '#299', 
    title: 'Painting Services', 
    time: '12:30 - 1:00', 
    type: 'Internal Task',
    staff: 1,
    icon: 'bg-colors'
  },
  { 
    id: '#312', 
    title: 'Generate Report', 
    time: '1:00 - 1:30', 
    type: 'Personal Task',
    staff: 1,
    icon: 'file'
  },
  { 
    id: '#297', 
    title: 'Plumbing Services', 
    time: '1:00 - 1:30', 
    type: 'Internal Task',
    staff: 3,
    icon: 'tool'
  },
];

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date('2021-03-24'));
  const [selectedBooking, setSelectedBooking] = useState(bookings.find(b => b.id === '#296'));
  const [viewMode, setViewMode] = useState('day');

  const getIconForBooking = (iconName) => {
    const iconMap = {
      'tool': <span className={styles.iconTool}>🔧</span>,
      'file': <span className={styles.iconFile}>📄</span>,
      'delete': <span className={styles.iconDelete}>🗑️</span>,
      'environment': <span className={styles.iconEnvironment}>🌳</span>,
      'fire': <span className={styles.iconFire}>🔥</span>,
      'thunderbolt': <span className={styles.iconThunderbolt}>⚡</span>,
      'bg-colors': <span className={styles.iconPaint}>🎨</span>,
    };
    return iconMap[iconName] || <span>📋</span>;
  };

  const renderBookingItem = (booking) => {
    const isMaintenanceRequest = booking.type === 'Maintenance Request';
    
    return (
      <div 
        key={booking.id} 
        className={`${styles.bookingItem} ${isMaintenanceRequest ? styles.maintenanceRequest : styles.personalTask}`}
        onClick={() => setSelectedBooking(booking)}
      >
        <div className={styles.bookingIcon}>
          {getIconForBooking(booking.icon)}
        </div>
        <div className={styles.bookingContent}>
          <div className={styles.bookingHeader}>
            <span className={styles.bookingTitle}>{booking.title}</span>
            <span className={styles.bookingId}>{booking.id}</span>
          </div>
          <div className={styles.bookingDetails}>
            <span className={styles.bookingTime}>{booking.time}</span>
            <span className={styles.bookingType}>{booking.type}</span>
          </div>
        </div>
        <div className={styles.bookingActions}>
          <Button type="text" size="small" className={styles.moreButton}>•••</Button>
        </div>
      </div>
    );
  };

  const renderTimeSlots = () => {
    const timeSlots = [
      '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', 
      '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm'
    ];
    
    return (
      <div className={styles.timelineContainer}>
        {timeSlots.map(time => (
          <div key={time} className={styles.timeSlot}>
            <div className={styles.timeLabel}>{time}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderStaffColumn = (staffMember) => {
    const staffBookings = bookings.filter(booking => booking.staff === staffMember.id);
    
    return (
      <div key={staffMember.id} className={styles.staffColumn}>
        <div className={styles.staffHeader}>
          <Avatar src={staffMember.avatar} className={styles.staffAvatar} />
          <div className={styles.staffInfo}>
            <div className={styles.staffName}>{staffMember.name}</div>
            <div className={styles.staffHours}>{staffMember.hours} hours</div>
          </div>
          <Button 
            type="text" 
            icon={<PlusOutlined />} 
            className={styles.addButton} 
          />
        </div>
        <div className={styles.bookingsList}>
          {staffBookings.map(booking => renderBookingItem(booking))}
        </div>
      </div>
    );
  };

  const renderBookingDetails = () => {
    if (!selectedBooking) return null;
    
    const hasUnitDetails = selectedBooking.unitDetails;
    
    return (
      <div className={styles.bookingDetails}>
        <div className={styles.bookingDetailHeader}>
          <Title level={4} className={styles.bookingDetailTitle}>
            {selectedBooking.title}
          </Title>
          <Button type="text" className={styles.moreButton}>•••</Button>
        </div>
        
        {hasUnitDetails && (
          <>
            <div className={styles.maintenanceTag}>MAINTENANCE REQUEST</div>
            
            <div className={styles.detailSection}>
              <Title level={5} className={styles.sectionTitle}>UNIT INFORMATION</Title>
              <Card className={styles.unitCard}>
                <div className={styles.unitNumber}>Unit {selectedBooking.unitDetails.unitNumber}</div>
                <div className={styles.unitAddress}>{selectedBooking.unitDetails.address}</div>
                <div className={styles.viewMore}>
                  <RightOutlined />
                </div>
              </Card>
            </div>
            
            <div className={styles.detailSection}>
              <Title level={5} className={styles.sectionTitle}>ASSIGNEE INFORMATION</Title>
              <Card className={styles.assigneeCard}>
                <Avatar src={staffMembers[0].avatar} className={styles.assigneeAvatar} />
                <div className={styles.assigneeName}>{selectedBooking.unitDetails.assignee}</div>
              </Card>
            </div>
            
            <div className={styles.detailSection}>
              <Title level={5} className={styles.sectionTitle}>DATE & TIME</Title>
              <Card className={styles.dateTimeCard}>
                <div className={styles.dateRow}>
                  <CalendarOutlined className={styles.dateIcon} />
                  <div className={styles.dateText}>Saturday, 12 March 2021</div>
                </div>
                <div className={styles.timeRow}>
                  <div className={styles.timeIcon}>🕒</div>
                  <div className={styles.timeText}>11:30 AM - 1:30 PM (1 hour)</div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout className={styles.bookingCalendar}>
      <Header className={styles.header}>
        <div className={styles.title}>Calendar</div>
        <div className={styles.searchContainer}>
          <Input
            placeholder="Search properties, tasks, etc"
            prefix={<SearchOutlined className={styles.searchIcon} />}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <div className={styles.userName}>Maurice Robbins</div>
            <div className={styles.userRole}>Manager</div>
          </div>
          <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" className={styles.userAvatar} />
        </div>
      </Header>
      
      <Content className={styles.content}>
        <div className={styles.calendarHeader}>
          <div className={styles.calendarControls}>
            <div className={styles.viewToggle}>
              <Button 
                type="text" 
                icon={<UnorderedListOutlined />} 
                className={styles.viewButton} 
              />
              <Button 
                type="text" 
                icon={<CalendarOutlined />} 
                className={styles.viewButton} 
              />
            </div>
            
            <div className={styles.dateNavigation}>
              <Button 
                type="text" 
                icon={<LeftOutlined />} 
                className={styles.navButton} 
              />
              <div className={styles.currentDate}>
                <span className={styles.dateLabel}>Mar 24, 2021</span>
                <span className={styles.todayLabel}>Today</span>
              </div>
              <Button 
                type="text" 
                icon={<RightOutlined />} 
                className={styles.navButton} 
              />
            </div>
          </div>
          
          <div className={styles.viewOptions}>
            <Button className={`${styles.viewOption} ${styles.active}`}>Today</Button>
            <Button className={styles.viewOption}>Day</Button>
            <Button className={styles.viewOption}>Week</Button>
            <Button className={styles.viewOption}>Month</Button>
            <Button type="primary" icon={<PlusOutlined />} className={styles.workOrderButton}>
              Work Order
            </Button>
          </div>
        </div>
        
        <div className={styles.calendarContent}>
          <div className={styles.allDayLabel}>All Day</div>
          
          <div className={styles.calendarGrid}>
            <div className={styles.timeColumn}>
              {renderTimeSlots()}
            </div>
            
            <div className={styles.bookingsContainer}>
              {staffMembers.map(staff => renderStaffColumn(staff))}
            </div>
            
            <div className={styles.detailsPanel}>
              {renderBookingDetails()}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default BookingCalendar;
