import { Row, Col } from "antd";
import AccountInformation from "./AccountInformation";
import AccountStatus from "./AccountStatus";

export default function UserProfile({ userData, refetch }) {
  return (
    <div>
      <AccountInformation userData={userData} refetch={refetch} />

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <AccountStatus userData={userData} refetch={refetch} />
        </Col>
      </Row>
    </div>
  );
}
