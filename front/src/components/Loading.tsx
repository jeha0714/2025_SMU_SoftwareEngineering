export default function Loading() {
  return (
    <>
      <article className="w-full h-full mb-4 flex flex-col justify-center items-center">
        <div className="size-15 border-6 border-green-300 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-center">로딩 중...</p>
      </article>
    </>
  );
}
