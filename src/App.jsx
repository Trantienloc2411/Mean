import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import Loading from "./components/Loading";
import useFetchUserOnLoad from "./hooks/useFetchUserOnLoad";

function App() {
  const router = createBrowserRouter(routes);
  useFetchUserOnLoad(); // Tự động lấy thông tin user khi app mở

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
