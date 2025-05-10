import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import { AuthFormProvider } from "./context/SignupFormContext";
import NotFound from "./components/NotFound";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/signin",
        element: (
          <AuthFormProvider>
            <SigninPage />
          </AuthFormProvider>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthFormProvider>
            <SignupPage />,
          </AuthFormProvider>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/mypage",
            element: <MyPage />,
          },
        ],
      },
    ],
  },
]);

export const queryClient = new QueryClient();

function App() {
  return (
    <main className="w-full h-screen flex flex-col justify-cetner items-center bg-white">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
