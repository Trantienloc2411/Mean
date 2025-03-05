import {  ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { Card } from 'antd';
import styles from './QuarterlyUsersChart.module.scss';

export default function QuarterlyUsersChart({ data, year }) {
  return (
    <div className={styles.chartItem}>
      <Card 
        title="Người dùng đăng ký theo quý" 
        className={styles.chartCard}
        bordered={false}
      >
        <div className={styles.chartDescription}>
          Thống kê số lượng người dùng đăng ký mới trong {year}
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="quarter" 
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
                formatter={(value) => [`${value.toLocaleString()} người dùng`, 'Đăng ký']}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
} 