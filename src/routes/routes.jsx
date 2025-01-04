// src/routes/routes.jsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const Overview = lazy(() => import("../pages/dashboard/Overview"));
const Analytics = lazy(() => import("../pages/dashboard/Analytics"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "dashboard",
        children: [
          { path: "", element: <Overview /> },
          { path: "analytics", element: <Analytics /> },
        ],
      },
      { path: "profile", element: <Profile /> },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <Navigate to="/404" replace /> },
    ],
  },
];
