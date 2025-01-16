import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import Signup from "../pages/auth/signup/SignUp";
import VerifyCode from "../pages/auth/verifyCode/VerifyCode";
import ForgotPassword from "../pages/auth/forgotPassword/ForgotPassword";
import SetNewPassword from "../pages/auth/setNewPassword/SetNewPassword";

// Lazy load pages
const Login = lazy(() => import("../pages/auth/login/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Account = lazy(() => import("../pages/account/Account"));
const Coupon = lazy(() => import("../pages/coupon/Coupon"));
const Booking = lazy(() => import("../pages/booking/Booking"));
const Owner = lazy(() => import("../pages/owner/Owner"));

// owner pages
const TypeRoomOwner = lazy(() => import("../pages/owner/components/TypeRoom/TypeRoom.jsx"));
const BookingOwner = lazy(() => import("../pages/owner/components/Booking/Booking.jsx"));
const InformationOwner = lazy(() => import("../pages/owner/components/Information/Information.jsx"));
const OverviewOwner = lazy(() => import("../pages/owner/components/Overview/Overview.jsx"));
const PlaceOwner  = lazy(() => import("../pages/owner/components/Place/Place.jsx"));
const PolicyOwner  = lazy(() => import("../pages/owner/components/Policy/Policy.jsx"));
const SettingOwner  = lazy(() => import("../pages/owner/components/Setting/Setting.jsx"));

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
    // element: <Login />,
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verifycode",
    element: <VerifyCode />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/set-new-password",
    element: <SetNewPassword />,
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
      { path: "dashboard", element: <OverviewOwner /> },
      { path: "booking", element: <BookingOwner /> },
      { path: "information", element: <InformationOwner /> },
      { path: "location", element: <PlaceOwner /> },
      { path: "type-room", element: <TypeRoomOwner /> },
      { path: "policy", element: <PolicyOwner /> },
      { path: "setting", element: <SettingOwner /> },
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
