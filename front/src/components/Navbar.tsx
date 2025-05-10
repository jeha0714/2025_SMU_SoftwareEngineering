import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GiWhiteBook } from "react-icons/gi";

export default function Navbar() {
  const { isLogin, logout } = useAuth();

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

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center bg-gradient-to-r from-sky-50 to-blue-50 shadow-md sticky top-0 z-50">
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
