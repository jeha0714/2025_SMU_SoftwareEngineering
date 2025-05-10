import { Link } from "react-router-dom";

interface ErrorPageProps {
  value: number | string | null;
}

export default function ErrorPage({ value }: ErrorPageProps) {
  return (
    <>
      <article className="w-screen h-screen flex flex-col justify-center items-center">
        <h1 className="mb-6 text-6xl font-bold">{value}</h1>
        <p className="m-6 text-6xl">에러가 발생했습니다.🥲</p>
        <Link to="/" className="m-4 text-xl text-red-700 hover:text-green-600">
          홈으로 돌아가기
        </Link>
      </article>
    </>
  );
}
