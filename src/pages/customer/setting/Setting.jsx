import { Layout } from 'antd';
import styles from '../Setting/Setting.module.scss';
import NavBar from './components/Navbar/Navbar'
import { useState } from 'react';
import BankAccount from './components/BankAccount/BankAccount';
import MeanWallet from './components/Wallet/MeanWallet';
const { Content } = Layout;
export default function Setting(props) { 

    const [activeComponent, setActiveComponent] = useState('bankAccount');
    const [userData, setUserData] = useState({
      name: 'Alexa Rowles',
      email: 'example@email.com',
      phone: '08987654321',
      dob: '20/12/2003',
      avatar: null,
    });

    const walletData = {
      availableBalance: "900,000 vnd",
      pendingBalance: "20,000 vnd",
      userName: "Alexa Rawles",
    };
    
    const transactionData = [
      {
        key: "1",
        transactionCode: "200afkjlafasdf",
        type: "Tiền booking",
        createdAt: "14:30:45 21/12/2023",
        amount: "200,000 vnd",
        status: "Expired",
      },
      {
        key: "2",
        transactionCode: "123123dsfsdf",
        type: "Tiền nạp",
        createdAt: "14:30:45 21/12/2023",
        amount: "200,000 vnd",
        status: "Paused",
      },
      {
        key: "3",
        transactionCode: "200afkjl121eafasdf",
        type: "Tiền nạp",
        createdAt: "14:30:45 21/12/2023",
        amount: "200,000 vnd",
        status: "Active",
      },
      {
        key: "4",
        transactionCode: "4dad200afkjlafasdf",
        type: "Tiền nạp",
        createdAt: "14:30:45 21/12/2023",
        amount: "200,000 vnd",
        status: "Active",
      },
    ];


    const renderComponent = () => {
        switch (activeComponent) {
          case 'bankAccount':
            return <BankAccount />;
          case 'meanWallet':
            return <MeanWallet walletData={walletData} transactionData={transactionData} />;
          default:
            return <BankAccount />;
        }
      };
    
      return (
        <Layout className={styles.settingsPage}>
          <NavBar  activeKey={activeComponent} onSelect={setActiveComponent} />
          <Content style={{
            backgroundColor: 'white', 
            padding: 20,
            boxShadow: "0.02px 3px 2px #CBCBCBFF",
            borderRadius: 10
          }} className={styles.mainContent}>{renderComponent()}</Content>
        </Layout>
      );
}