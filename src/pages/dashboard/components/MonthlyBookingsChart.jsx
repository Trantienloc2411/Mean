import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { Card } from 'antd';    
import styles from './MonthlyBookingsChart.module.scss';

export default function MonthlyBookingsChart({ data }) {
  return (
    <div className={styles.chartItem}>
      <Card 
        title="Lượt đặt phòng theo tháng" 
        className={styles.chartCard}
        bordered={false}
      >
        <div className={styles.chartDescription}>
          Thống kê số lượt đặt phòng trong 6 tháng gần đây
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dy={5}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dx={-5}
              />
              <Tooltip 
                contentStyle={{
                  background: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  padding: '8px'
                }}
                formatter={(value) => [`${value.toLocaleString()} lượt`, 'Đặt phòng']}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#14b8a6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
} 