import styles from '../Booking/Booking.module.scss';
import ListBooking from './Components/ListBooking/ListBooking';
import ListPlace from './Components/ListPlace/ListPlace';

export default function Booking(props) {
    return (
      <div className={styles.content}>
        <ListPlace/>
        <ListBooking/>
      </div>  
    );
}