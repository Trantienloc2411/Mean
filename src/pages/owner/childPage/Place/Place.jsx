import { Button, Tooltip } from "antd";
import styles from "../Place/Place.module.scss";
import { useNavigate } from "react-router-dom";
export default function Place(props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("./AccomodationDetail");
  };


  const handleCreateNavigate = () => {
    navigate("./AccomodationCreate");
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
