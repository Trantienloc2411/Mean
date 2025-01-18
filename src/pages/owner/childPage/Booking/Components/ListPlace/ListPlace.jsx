import styles from '../ListPlace/ListPlace.module.scss';
import React from 'react';
import { Card, Divider, Input } from 'antd';
import { BoldOutlined } from '@ant-design/icons';

const ListPlace = () => {
    const locationData = [
        { title: 'Mount Bromo', subtitle: 'Malang, East Java' },
      ];
    return (
        <div className="booking-dashboard__sidebar">
            <h2 className="booking-dashboard__title">Địa điểm đặt phòng</h2>
            <Divider />
            <div className="booking-dashboard__locations">
                <Card size='small' hoverable='true' style={{fontWeight: 'bold' , textAlign: 'center' , marginBottom: 20}}>Tất cả</Card>
                {locationData.map((location, index) => (
                    <Card
                        key={index}
                        hoverable='true'
                        className="booking-dashboard__location-card"
                        bordered={false}
                    >
                        <strong>{location.title}</strong>
                        {location.subtitle && (
                            <p className="booking-dashboard__subtitle">{location.subtitle}</p>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ListPlace;
