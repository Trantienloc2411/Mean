import styles from '../Card/Card.module.scss';
import { Card } from "antd";
import React from 'react';
export default function CardModify(props) {
    const {
        title,
        value,
        iconName,
        backgroundColorIcon = "#e5e4ff",
        colorIcon = "#fff"
    } = props;

    const iconStyles = {
        fontSize: '24px',  // You can adjust this as needed
        color: colorIcon
    };

    console.log({ backgroundColorIcon, colorIcon });


    const wrapperStyles = {
        backgroundColor: backgroundColorIcon,
        padding: '10px',  // You can adjust this as needed
        borderRadius: '8px'  // Optional: for rounded corners
    };

    return (
        <div className={styles.cardContainer}>
            <Card style={{ height: 130 }}>
                <div className={styles.cardRow}>
                    <div className={styles.cardContent}>
                        <p>{title}</p>
                        <h2>{value}</h2>
                    </div>
                    <div className={styles.iconWrapper} style={wrapperStyles}>
                        {React.cloneElement(iconName, { style: iconStyles })}
                    </div>
                </div>
            </Card>
        </div>
    );
}