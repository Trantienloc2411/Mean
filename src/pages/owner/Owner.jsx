import {Tab, Tabs} from 'antd';
import Overview from './components/Overview/Overview.jsx';
import Booking from './components/Booking/Booking.jsx';
import Information from './components/Information/Information.jsx';
import Place from './components/Place/Place.jsx';
import Policy from './components/Policy/Policy.jsx';
import Setting from './components/Setting/Setting.jsx';
import TypeRoom from './components/TypeRoom/TypeRoom.jsx';


export default function owner() {

  const items = [
    {
      key: '1',
      label: 'Tổng quan',
      children: <Overview/>
    },
    {
      key: '2',
      label: 'Thông tin',
      children: <Information/>
    },
    {
      key : '3',
      label: 'Địa điểm',
      children: <Place/>
    },
    {
      key : '4',
      label: 'Đặt phòng',
      children: <Booking/>
    },
    {
      key : '5',
      label: 'Loại phòng',
      children: <TypeRoom/>
    },
    {
      key : '6',
      label: 'Chính sách',
      children: <Policy/>
    },
    {
      key : '7',
      label: 'Cài đặt',
      children: <Setting/>
    },

  ];



  return (
    <div>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  )
}
