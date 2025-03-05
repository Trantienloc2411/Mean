import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from 'antd';
import styles from './BookingStatusPieChart.module.scss';

export default function BookingStatusPieChart({ data, total }) {
  return (
    <div className={styles.chartItem}>
      <Card 
        title="Thống kê đặt phòng" 
        className={styles.chartCard}
        bordered={false}
      >
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ 
                        backgroundColor: 'white',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      }}>
                        <p style={{ 
                          margin: '0',
                          color: data.color,
                          fontWeight: 500,
                          fontSize: '12px'
                        }}>
                          {data.name}
                        </p>
                        <p style={{ 
                          margin: '4px 0 0',
                          color: '#64748b',
                          fontSize: '12px'
                        }}>
                          {data.value} ({((data.value / total) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan
                  x="50%"
                  dy="-5"
                  fontSize="20px"
                  fill="#64748b"
                  fontWeight="500"
                >
                  {total}
                </tspan>
                <tspan
                  x="50%"
                  dy="20"
                  fontSize="12px"
                  fill="#94a3b8"
                >
                  Tổng số
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.legendContainer}>
          {data.map((entry, index) => (
            <div key={index} className={styles.legendItem}>
              <span 
                className={styles.legendColor} 
                style={{ backgroundColor: entry.color }}
              />
              <span className={styles.legendText}>
                {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 