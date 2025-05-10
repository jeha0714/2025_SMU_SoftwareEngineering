import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Side from "../components/Side";

export default function RootLayout() {
  const { isLogin } = useAuth();

  return (
    <>
      <Navbar />
      <main className="w-full h-[90vh] flex flex-row">
        {!isLogin ? <></> : <Side />}
        <Outlet />
      </main>
    </>
  );
}
