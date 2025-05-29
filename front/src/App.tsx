import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import NotFound from "./components/NotFound";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WelcomePage from "./pages/WelcomePage";
import SelectMode from "./components/SelectMode";
import WordTestPage from "./pages/WordTestPage";
import WorkBookDetailPage from "./pages/WorkBookDetailPage";
import CreateWorkBook from "./pages/CreateWorkBook";
import ModifyWorkBook from "./pages/ModifyWorkBook";
import { ToastProvider } from "./context/ToastContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/welcome",
        element: <WelcomePage />,
      },
      {
        path: "/signin",
        element: <SigninPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/mypage",
            element: <MyPage />,
          },
          {
            path: "/workbook/create",
            element: <CreateWorkBook />,
          },
          {
            path: "/workbook/:id",
            element: <SelectMode />,
          },
          {
            path: "/workbook/:id/study",
            element: <WorkBookDetailPage wrong={false} />, // ✅ 새로 추가된 부분
          },
          {
            path: "/workbook/:id/test",
            element: <WordTestPage />,
          },
          {
            path: "/workbook/:id/modify",
            element: <ModifyWorkBook />,
          },
          {
            path: "/workbook/:id/wrong",
            element: <WorkBookDetailPage wrong={true} />, // ✅ 새로 추가된 부분
          },
        ],
      },
    ],
  },
]);

export const queryClient = new QueryClient();

function App() {
  return (
    <ToastProvider>
      <main className="max-w-screen max-h-screen flex flex-col justify-cetner items-center bg-white">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </main>
    </ToastProvider>
  );
}

export default App;
