import styles from '../Information/Information.module.scss';
import AccountInfo from './Components/AccountInfo/AccountInfo';
import AccountStatus from './Components/AccountStatus/AccountStatus';
import CompanyInfo from './Components/CompanyInfo/CompanyInfo';
export default function Information() {
    
    const userInfo = {
        fullName: "Alexa Rawles",
        email: "example@email.com",
        phone: "0987654321",
        avatar: "https://s3-alpha-sig.figma.com/img/4920/fcde/8447f632360829a3d6cf6bd47b299bab?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YRDul0LX5qH0qTJ~PYdbbybEnteiXecE7RrpyaJYW3rUifKmkLp4N2Z7LAVMSNvoNY5KXcmwhIqm5UWzcxWGg1waRqqC2uFYrx0jg4WoplYgOuHs9zytpNR7vXQvL-bjCmjuvVzERd36~7DsRQEsIosfV4kIoJkeosNYeCrHNIiikZCN8OKKWofulOhhq5o5klATU0sg-mX409oyDa3WtMkK2Xa7TLmSldHfhx60rkgQ143JPs5EFMTxYkG1kOrrtbQFh6MWQuqiYceftCcpNAo2bTYdrAni5P7IhcA-eSbopVix6NSUahpqvXlGnm7koWuaK3mkWk41Kpt-X53LNQ__"
    }

    return (
        <div className="contentContainer">
            <div className="infoHorizontal" style={{
                display: 'flex',
                justifyContent: 'space-around'
            }}>
                <div className="infoVertical" style={{width: '45%'}}>
                    <AccountInfo
                        initialData={userInfo}
                    />
                    <AccountStatus
                        isAccountActive={true}
                        tooltipAccountStatus='Tài khoản đã được kích hoạt thành công'
                        isAccountVerified={true}
                        tooltipAccountVerified='Tài khoản đã được xác thực'
                    />
                </div>
                <div className="companySection" style={{width: '45%'}}>
                    <CompanyInfo />
                </div>
            </div>
        </div>
    );
}