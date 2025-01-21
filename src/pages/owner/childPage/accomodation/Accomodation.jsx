import { Button, Tooltip } from "antd";
import styles from "./Accomodation.module.scss";
import { useNavigate } from "react-router-dom";
export default function Accommodation(props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("./accomodation-detail");
  };


  const handleCreateNavigate = () => {
    navigate("./accomodation-create");
  }
  return (
    <>
      <Tooltip title="CurrentPage">
        <Button onClick={handleNavigate}>DetailPage</Button>
      </Tooltip>

      <Tooltip title="CurrentPage">
        <Button onClick={handleCreateNavigate}>CreatePage</Button>
      </Tooltip>
    </>
  );
}
