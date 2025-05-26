import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { vocaServerNeedAuth } from "../utils/axiosInfo";
import { Medal } from "lucide-react";

type Word = {
  id: number;
  content: string;
  meaning: string;
  partOfSpeech: string;
};

type WorkbookListDetailProps = {
  wrong?: boolean;
};

const WorkbookDetail: React.FC<WorkbookListDetailProps> = ({ wrong }) => {
  const { id } = useParams(); // 워크북 ID
  const [words, setWords] = useState<Word[]>([]);
  const [workbookName, setWorkbookName] = useState<string>(""); // 단어장 이름 상태 추가
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const url = wrong
      ? `/api/workbook/${id}?type=wrong`
      : `/api/workbook/${id}`;
    const token = sessionStorage.getItem("accessToken");

    vocaServerNeedAuth
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWorkbookName(res.data.title);
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

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-[100%] bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-purple-600 text-lg font-medium">로딩 중...</div>
      </div>
    );
  }

  const word = words[index];

  return (
    <div className="relative flex items-center justify-center h-[100%] p-4 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* 메인 카드 */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {workbookName || "단어장"}
          </h2>
          <p className="text-purple-600 font-medium">
            {!wrong ? "학습 모드" : "오답 모드"}
          </p>
        </div>

        {/* 진행도 */}
        <div className="flex items-center justify-center gap-2 mb-8 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
          <Medal className="w-5 h-5 text-yellow-600" />
          <span className="text-gray-700 font-semibold">
            {index + 1}/{words.length}
          </span>
        </div>

        {/* 단어 표시 */}
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {word.content}
          </div>
          <div className="text-xl text-purple-600 mb-4">
            {word.partOfSpeech}
          </div>
          <div className="text-2xl text-gray-700">{word.meaning}</div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="flex gap-4">
          <button
            onClick={prevWord}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-medium rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            이전
          </button>
          <button
            onClick={nextWord}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkbookDetail;
