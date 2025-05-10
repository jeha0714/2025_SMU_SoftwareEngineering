import { Link } from "react-router-dom";
import humanIcon from "../assets/images/human.svg";
import Magnifier from "../assets/images/Magnifier.svg";

const Side = () => {
  return (
    <aside className="w-[200px] p-3 flex flex-col bg-zinc-900 text-3xl text-white">
      <Link
        to={"/mypage"}
        className="m-2 flex flex-row items-center text-sm hover:text-pink-500 text-left"
      >
        <img src={humanIcon} className="w-[20px] mr-1" />
        마이페이지
      </Link>
      <Link
        to={"/lplist"}
        className="m-2 flex flex-row text-sm hover:text-pink-500 text-left"
      >
        <img src={Magnifier} className="w-[15px] mr-2" />
        LP 목록 조회
      </Link>
    </aside>
  );
};

export default Side;
