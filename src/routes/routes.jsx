import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";

// Lazy load pages
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Account = lazy(() => import("../pages/account/Account"));
const Coupon = lazy(() => import("../pages/coupon/Coupon"));
const Booking = lazy(() => import("../pages/booking/Booking"));
const Owner = lazy(() => import("../pages/owner/Owner"));
// const Customer = lazy(() => import("../pages/customer/Customer"));
const PolicyApp = lazy(() => import("../pages/policyApp/PolicyApp"));
const RentalLocation = lazy(() =>
  import("../pages/rentalLocation/RentalLocation")
);
const Report = lazy(() => import("../pages/report/Report"));

const Transaction = lazy(() => import("../pages/transaction/Transaction"));
const NotFound = lazy(() => import("../pages/error/NotFound"));

// Define routes
export const routes = [
  // Trang login (home)
  {
    path: "/",
    element: <Login />,
  },

  // Admin layout routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <Navigate to="/admin/dashboard" replace /> }, // Chuyển hướng từ /admin sang /admin/dashboard
      { path: "dashboard", element: <Dashboard /> },
      { path: "account", element: <Account /> },
      { path: "coupon", element: <Coupon /> },
      { path: "booking", element: <Booking /> },
      { path: "transaction", element: <Transaction /> },
      { path: "rental", element: <RentalLocation /> },
      { path: "policy", element: <PolicyApp /> },
      { path: "report", element: <Report /> },
    ],
  },

  // Owner layout routes
  {
    path: "/owner",
    element: <OwnerLayout />,
    children: [
      { path: "", element: <Navigate to="/owner/dashboard" replace /> }, // Chuyển hướng từ /admin sang /admin/dashboard
      { path: "owners", element: <Owner /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "account", element: <Account /> },
      { path: "coupon", element: <Coupon /> },
      { path: "booking", element: <Booking /> },
      { path: "transaction", element: <Transaction /> },
      { path: "rental", element: <RentalLocation /> },
      { path: "policy", element: <PolicyApp /> },
      { path: "report", element: <Report /> },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Not found route
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
];
