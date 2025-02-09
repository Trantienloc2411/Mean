import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import Loading from "./components/Loading";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  );
}

export default App;
