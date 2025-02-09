import { Outlet } from "react-router-dom";

const NotAuthLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NotAuthLayout;
