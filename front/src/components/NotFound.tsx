import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <article className="w-full h-screen flex flex-col justify-center items-center text-white">
      <h1 className="mb-6 text-6xl font-bold">404</h1>
      <p className="m-6 text-6xl">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="m-4 text-xl text-red-700 hover:text-green-600">
        홈으로 돌아가기
      </Link>
    </article>
  );
}
