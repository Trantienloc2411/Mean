import UploadFile from "../components/UploadFile";
import CreateUser from "../components/userAPI/CreateUser";
import UserList from "../components/userAPI/UserList";
import { Button } from "antd";

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Ant Design with React</h1>
      <Button type="primary">Click Me</Button>
      <CreateUser />
      <UserList />
      <UploadFile />
    </div>
  );
};

export default App;
