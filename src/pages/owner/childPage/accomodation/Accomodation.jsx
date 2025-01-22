import { Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
export default function Accommodation(props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("./accomodation-detail");
  };

  const handleCreateNavigate = () => {
    navigate("./accomodation-create");
  };
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
