import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { vocaServerNeedAuth } from "../utils/axiosInfo";
import { Medal } from "lucide-react";
import { useToast } from "../context/ToastContext";

type Word = {
  id: number;
  content: string;
  meaning: string;
  partOfSpeech: string;
};

type WorkbookListDetailProps = {
  wrong?: boolean;
};

type WorkbookResponse = {
  title: string;
  wordList: Word[];
};

// Fisher-Yates 알고리즘을 사용한 배열 셔플 함수
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const WorkbookDetail: React.FC<WorkbookListDetailProps> = ({ wrong }) => {
  const { id } = useParams(); // 워크북 ID
  const [words, setWords] = useState<Word[]>([]);
  const [workbookName, setWorkbookName] = useState<string>(""); // 단어장 이름 상태 추가
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const url = wrong
      ? `/api/workbook/${id}?type=wrong`
      : `/api/workbook/${id}`;
    const token = sessionStorage.getItem("accessToken");

    vocaServerNeedAuth
      .get<WorkbookResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWorkbookName(res.data.title);
        // 단어 목록을 랜덤하게 섞어서 저장
        const shuffledWords = shuffleArray(res.data.wordList);
        setWords(shuffledWords);
      })
      .catch((err) => {
        showToast("네트워크 연결을 확인해주세요.", "error");
        console.error("단어장 로딩 실패:", err);
        navigate("/");
      });
  }, [id]);

  const checkInAttendance = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰 없음: 출석 요청 생략");
      return;
    }
    try {
      const response = await vocaServerNeedAuth.post(
        "/api/attendance/check-in",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (data.isSuccess) {
        console.log("출석 체크 성공:", data.message);
      } else {
        console.warn("출석 체크 실패:", data.message);
      }
    } catch (error: any) {
      if (error.response) {
        console.error(
          "출석 요청 오류:",
          error.response.status,
          error.response.data.message
        );
      } else {
        console.error("출석 요청 실패:", error.message);
      }
    }
  };

  const addStudyWordNum = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰 없음: 출석 요청 생략");
      return;
    }
    try {
      await vocaServerNeedAuth.post(
        "/api/workbook/study",
        { correctCount: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const nextWord = async () => {
    await addStudyWordNum();
    await checkInAttendance();
    if (index === words.length - 1) {
      handleComplete();
      return;
    }
    setIndex((prev) => prev + 1);
  };

  const prevWord = () => {
    if (index === 0) return;
    setIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleComplete = () => {
    showToast("학습이 종료되었습니다", "info");
    navigate(`/workbook/${id}`);
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
