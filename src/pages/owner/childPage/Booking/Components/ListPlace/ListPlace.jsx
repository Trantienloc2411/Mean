import React from 'react';
import { Card, Divider } from 'antd';

const ListPlace = ({ locations = [], onSelectLocation, selectedLocation }) => {
  return (
    <div className="booking-dashboard__sidebar">
      <h2 className="booking-dashboard__title">Địa điểm đặt phòng</h2>
      <Divider />
      <div className="booking-dashboard__locations">
        <Card 
          size='small' 
          hoverable 
          style={{
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: 20,
            backgroundColor: selectedLocation === 'all' ? '#e6f7ff' : 'white'
          }}
          onClick={() => onSelectLocation('all')}
        >
          Tất cả
        </Card>
        
        {locations && locations.length > 0 ? (
          locations.map((location) => (
            <Card
              key={location._id}
              hoverable
              className="booking-dashboard__location-card"
              bordered={false}
              style={{
                backgroundColor: selectedLocation === location._id ? '#e6f7ff' : 'white'
              }}
              onClick={() => onSelectLocation(location._id)}
            >
              <strong>{location.description || 'Không có mô tả'}</strong>
              <p className="booking-dashboard__subtitle">
                {`ID: ${location._id.substring(location._id.length - 5)}`}
              </p>
            </Card>
          ))
        ) : (
          <p>Không có địa điểm</p>
        )}
      </div>
    </div>
  );
};

export default ListPlace;