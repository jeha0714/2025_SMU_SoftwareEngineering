import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Side from "../components/Side";

export default function RootLayout() {
  const { isLogin } = useAuth();
  // 현재 경로를 확인하기 위해 location 사용
  const location = useLocation();
  const currentPath = location.pathname;

  // 로그인 없이 접근 가능한 경로들
  const publicPaths = ["/welcome", "/signin", "/signup"];
  const isPublicPath = publicPaths.includes(currentPath);

  return (
    <>
      <Navbar />
      <main className="w-full h-[90vh] flex flex-row">
        {!isLogin && !isPublicPath ? (
          // 로그인되지 않고 public 경로가 아닌 경우만 리다이렉트
          <Navigate to="/welcome" replace />
        ) : (
          <>
            {/* Side 컴포넌트는 로그인된 경우에만 표시 */}
            {isLogin && <Side />}
            <Outlet />
          </>
        )}
      </main>
    </>
  );
}
