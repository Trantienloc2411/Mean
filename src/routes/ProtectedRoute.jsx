import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const userId = useSelector((state) => state.auth.userId);
  const role = useSelector((state) => state.auth.role);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Nếu đăng nhập rồi nhưng không có quyền, chuyển hướng về /403
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
