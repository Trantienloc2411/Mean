import '../dashboard/Dashboard.scss';
import {useState,useEffect} from 'react';

export default function Dashboard() {

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    
    <div className="clock-realtime">
      <p className='clockContent'>{time.toLocaleTimeString()} {time.toLocaleDateString()}</p>
    </div>
  );
}
