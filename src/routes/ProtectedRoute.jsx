import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const NotAuthRoute = ({ children }) => {
  const { isAuthenticated, role, userId } = useSelector((state) => state.auth);
  const location = useLocation();
  // console.log("Auth Check:", {
  //   isAuthenticated,
  //   role,
  //   path: location.pathname,
  // });

  if (isAuthenticated) {
    if (role === "Staff" || role === "Admin") {
      return (
        <Navigate to="/admin/dashboard" state={{ from: location }} replace />
      );
    }
    if (role === "Owner") {
      return (
        <Navigate
          to={`/owner/${userId}/information`}
          state={{ from: location }}
          replace
        />
      );
    }
  }

  return children;
};
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // console.log("Auth Check:", {
  //   isAuthenticated,
  //   role,
  //   path: location.pathname,
  // });

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // console.log("Admin Check:", {
  //   isAuthenticated,
  //   role,
  //   path: location.pathname,
  // });

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "Staff" && role !== "Admin") {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export const OwnerRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const location = useLocation();

  // console.log("Owner Check:", {
  //   isAuthenticated,
  //   role,
  //   path: location.pathname,
  // });
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "Owner" && role !== "Staff" && role !== "Admin") {
    return <Navigate to="/404" replace />;
  }

  return children;
};
