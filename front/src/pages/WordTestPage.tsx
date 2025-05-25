import { useEffect, useState } from "react";
import { Medal, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { vocaServerNeedAuth } from "../utils/axiosInfo";

type Word = {
  wordId: number;
  content: string;
  meaning: string;
  partOfSpeech: string;
  workBookId: number;
};

type AnswerResult = {
  wordId: number;
  content: string;
  answer: boolean;
};

const WordTestPage = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [workbookName, setWorkbookName] = useState<string>("영어 기초 단어장");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [showCaution, setShowCaution] = useState(false);

  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    vocaServerNeedAuth
      .get(`/api/workbook/${id}`, {
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

  useEffect(() => {
    if (answers.length === words.length && words.length > 0) {
      submitResults();
      checkInAttendance();
    }
  }, [answers]);

  const handleNext = () => {
    if (userInput.trim() === "") {
      setShowCaution(true);
      setTimeout(() => setShowCaution(false), 2000);
      return;
    }

    if (currentIndex >= words.length) {
      return;
    }

    const currentWord = words[currentIndex];

    if (!currentWord) {
      console.warn("currentWord is undefined at index", currentIndex);
      return;
    }

    const isCorrect =
      userInput.trim().toLowerCase() === currentWord.content.toLowerCase();

    setAnswers((prev) => [
      ...prev,
      {
        wordId: currentWord.wordId,
        content: currentWord.content,
        answer: isCorrect,
      },
    ]);

    setUserInput("");

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

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

  const submitResults = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const wrongAnswers = answers.filter((item) => !item.answer);
      await vocaServerNeedAuth.post(
        `/api/workbook/submit?workBookId=${id}`, // workBookId를 쿼리 파라미터로 전달
        wrongAnswers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(wrongAnswers);
      // 테스트 완료 로직
      alert("테스트가 완료되었습니다!");
      navigate(`/workbook/${id}`);
    } catch (err) {
      console.error("제출 실패", err);
      alert("서버 제출에 실패했습니다.");
    }
  };

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-[100%] bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-purple-600 text-lg font-medium">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center h-[100%] p-4 bg-gradient-to-br from-blue-100 via-green-50 to-blue-100">
      {/* 경고 메시지 */}
      {showCaution && (
        <div className="absolute top-8 z-50 flex items-center gap-2 px-6 py-3 bg-red-100 border border-red-200 rounded-lg shadow-lg animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">단어를 입력해주세요</span>
        </div>
      )}

      {/* 메인 카드 */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {workbookName || "단어장"}
          </h2>
          <p className="text-purple-600 font-medium">테스트 모드</p>
        </div>

        {/* 진행도 */}
        <div className="flex items-center justify-center gap-2 mb-8 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
          <Medal className="w-5 h-5 text-yellow-600" />
          <span className="text-gray-700 font-semibold">
            {currentIndex + 1}/{words.length}
          </span>
        </div>

        {/* 의미 표시 */}
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="text-3xl font-bold text-gray-800">
            {words[currentIndex].meaning}
          </div>
        </div>

        {/* 입력 필드 */}
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleNext();
            }
          }}
          placeholder="영어 단어 입력"
          className="w-full p-4 text-lg border-2 border-purple-200 rounded-xl outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm mb-6"
        />

        {/* 버튼 컨테이너 */}
        <div className="flex gap-4">
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordTestPage;
