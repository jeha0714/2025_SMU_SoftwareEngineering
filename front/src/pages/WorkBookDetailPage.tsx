import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { vocaServerNeedAuth } from "../utils/axiosInfo";

type Word = {
  id: number;
  content: string;
  meaning: string;
  partOfSpeech: string;
};

type Workbook = {
  name: string; // 단어장 이름
  wordList: Word[];
};

type WorkbookListDetailProps = {
  wrong?: boolean;
};

const WorkbookDetail: React.FC<WorkbookListDetailProps> = ({ wrong }) => {
  const { id } = useParams(); // 워크북 ID
  const [words, setWords] = useState<Word[]>([]);
  const [workbookName, setWorkbookName] = useState<string>(""); // 단어장 이름 상태 추가
  const [index, setIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const token = sessionStorage.getItem("accessToken");

  const url = wrong ? `/api/workbook/${id}?type=wrong` : `/api/workbook/${id}`;
  console.log(url);

  useEffect(() => {
    vocaServerNeedAuth
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setWorkbookName(res.data.title); // 단어장 이름 설정
        setWords(res.data.wordList);
      })
      .catch((err) => console.error("단어장 로딩 실패:", err));
  }, [id]);

  const nextWord = () => {
    setIndex((prev) => (prev + 1) % words.length);
  };

  const prevWord = () => {
    setIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "card" : "list");
  };

  if (words.length === 0)
    return <div className="p-4">단어를 불러오는 중...</div>;

  const word = words[index];

  return (
    <div className="p-6">
      {/* 단어장 이름 표시 */}
      <h1 className="text-3xl font-bold mb-2">{workbookName}</h1>

      {/* 현재 단어 번호 표시 */}
      <div className="text-right text-xl text-gray-600 mb-4">
        {index + 1} / {words.length} 번째 단어
      </div>

      {/* 뷰 모드 버튼 */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        <button
          className={`px-3 py-1 rounded border ${
            viewMode === "list"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
          onClick={() => setViewMode("list")}
        >
          리스트로 보기
        </button>
        <button
          className={`px-3 py-1 rounded border ${
            viewMode === "card"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
          onClick={() => setViewMode("card")}
        >
          카드뷰로 보기
        </button>
      </div>

      {/* 리스트 모드 */}
      {viewMode === "list" ? (
        <div className="max-h-[500px] overflow-y-auto space-y-2 sm:max-h-[400px]">
          {words.map((word) => (
            <div
              key={word.id}
              className="border px-4 py-2 rounded-md shadow-sm bg-white"
            >
              <span className="font-semibold text-blue-700">
                {word.content}
              </span>
              <span className="text-gray-500 ml-1">({word.partOfSpeech})</span>
              <span className="ml-2">- {word.meaning}</span>
            </div>
          ))}
        </div>
      ) : (
        // 카드뷰 모드
        <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[80%] min-w-[80vw] mx-auto overflow-hidden">
          <div className="flex flex-col items-center justify-center space-y-4 flex-1">
            <div className="text-center mb-6 px-4 sm:px-6">
              <h1 className="text-4xl sm:text-6xl font-bold text-blue-700">
                {word.content}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-500 mt-2">
                {word.partOfSpeech}
              </p>
              <p className="text-2xl sm:text-3xl text-gray-800 mt-4">
                {word.meaning}
              </p>
            </div>

            <div className="flex gap-4 sm:gap-6 mt-8">
              <button
                onClick={prevWord}
                className="px-6 py-3 text-lg sm:text-xl bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                이전
              </button>
              <button
                onClick={nextWord}
                className="px-6 py-3 text-lg sm:text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkbookDetail;
