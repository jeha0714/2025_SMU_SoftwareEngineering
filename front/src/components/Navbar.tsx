import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GiWhiteBook } from "react-icons/gi";

export default function Navbar() {
  const { isAdmin, isLogin, logout } = useAuth();

  // Login 이전에 보여지는 Navbar
  function BeforeLoginNavbar() {
    return (
      <>
        <Link
          to={"/signin"}
          className="mx-2 py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-700 transition-colors duration-300 shadow-md text-white font-medium"
        >
          로그인
        </Link>
        <Link
          to={"/signup"}
          className="py-2 px-4 rounded-md bg-green-500 hover:bg-green-700 transition-colors duration-300 shadow-md text-white font-medium"
        >
          회원가입
        </Link>
      </>
    );
  }

  // Login 이후 보여지는 Navbar
  function AfterLoginNavbar() {
    if (isAdmin) {
      return (
        <>
          <div className="relative mx-3">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-md blur-sm opacity-60 animate-pulse"></div>
            <div className="relative py-2 px-4 rounded-md bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-bold shadow-2xl flex items-center gap-2 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-yellow-300 animate-bounce drop-shadow-md"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-100 font-bold tracking-wide drop-shadow-lg">
                  관리자
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="py-2 px-4 rounded-md bg-red-500 hover:bg-red-700 transition-colors duration-300 shadow-md text-white font-medium"
          >
            로그아웃
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link
            to={"/mypage"}
            className="mx-2 py-2 px-4 rounded-md bg-purple-500 hover:bg-purple-700 transition-colors duration-300 shadow-md text-white font-medium"
          >
            마이페이지
          </Link>
          <button
            onClick={logout}
            className="py-2 px-4 rounded-md bg-red-500 hover:bg-red-700 transition-colors duration-300 shadow-md text-white font-medium"
          >
            로그아웃
          </button>
        </>
      );
    }
  }

  return (
    <nav className="w-full h-[10vh] py-4 px-6 flex justify-between items-center bg-gradient-to-r from-sky-50 to-blue-50 shadow-md sticky top-0 z-50">
      <Link
        to={"/"}
        className="flex flex-row justify-center items-center text-xl font-bold transition-transform duration-300 hover:scale-105"
      >
        <GiWhiteBook className="w-8 h-8 mr-3 text-blue-600" />
        <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          Campus English
        </span>
      </Link>
      <div className="flex justify-center items-center space-x-2">
        {!isLogin ? <BeforeLoginNavbar /> : <AfterLoginNavbar />}
      </div>
    </nav>
  );
}
