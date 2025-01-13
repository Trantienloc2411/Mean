import styles from '../Card/Card.module.scss';

export default function Card(props) {
    const {
        title,
        value,
        iconName,
        backgroundColorIcon,
        colorIcon
    } = props;

    const iconStyles = {
        fontSize: '24px',  // You can adjust this as needed
        color: colorIcon
    };

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