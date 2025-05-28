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
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [testResults, setTestResults] = useState<{
    correctCount: number;
    wrongWords: AnswerResult[];
  } | null>(null);

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
    }
  }, [answers]);

  // Timer effect
  useEffect(() => {
    if (showResults || currentIndex >= words.length || words.length === 0)
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showResults, words.length]);

  const handleTimeout = () => {
    const currentWord = words[currentIndex];
    if (!currentWord) return;

    const newAnswers = [
      ...answers,
      {
        wordId: currentWord.wordId,
        content: currentWord.content,
        answer: false,
      },
    ];
    setAnswers(newAnswers);
    setUserInput("");

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(5);
    } else {
      const correctCount = newAnswers.filter((item) => item.answer).length;
      const wrongWords = newAnswers.filter((item) => !item.answer);
      setTestResults({
        correctCount,
        wrongWords,
      });
      setShowResults(true);
    }
  };

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

    const newAnswers = [
      ...answers,
      {
        wordId: currentWord.wordId,
        content: currentWord.content,
        answer: isCorrect,
      },
    ];
    setAnswers(newAnswers);
    setUserInput("");

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(5);
    } else {
      const correctCount = newAnswers.filter((item) => item.answer).length;
      const wrongWords = newAnswers.filter((item) => !item.answer);
      setTestResults({
        correctCount,
        wrongWords,
      });
      setShowResults(true);
    }
  };

  const submitResults = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const wrongCount = answers.filter((item) => !item.answer).length;
      const wrongWords = answers.filter((item) => !item.answer);

      const correctCount = answers.length - wrongCount;

      // console.log(correctCount);
      // console.log(wrongCount);
      const requestBody = {
        correctCount: correctCount,
        wordList: wrongWords,
      };

      await vocaServerNeedAuth.post(
        `/api/workbook/submit?workBookId=${id}`, // workBookId를 쿼리 파라미터로 전달
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(wrongWords);
      //   alert("제출이 완료되었습니다!");
      //   navigate(`/workbook/${id}`);
    } catch (err) {
      console.error("제출 실패", err);
      alert("서버 제출에 실패했습니다.");
    }
  };

  const handleComplete = async () => {
    await submitResults();
    if (testResults && testResults.wrongWords.length > 0) {
      alert("오답 단어장이 생성되었습니다!");
    } else {
      alert("모든 문제를 맞췄습니다!");
    }
    navigate(`/workbook/${id}`);
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
          <p className="text-purple-600 font-medium">
            {showResults ? "테스트 결과" : "테스트 모드"}
          </p>
        </div>

        {showResults && testResults ? (
          <>
            {/* 정답률 */}
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {Math.round((testResults.correctCount / words.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                맞춘 개수: {testResults.correctCount} / {words.length}
              </div>
            </div>

            {/* 오답 목록 */}
            {testResults.wrongWords.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  오답 단어 목록
                </h3>
                <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                  {testResults.wrongWords.map((word, index) => (
                    <div
                      key={index}
                      className="bg-red-50 rounded-lg p-3 border border-red-100"
                    >
                      <div className="text-base font-semibold text-gray-800">
                        {word.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 완료 버튼 */}
            <button
              onClick={handleComplete}
              className="w-full py-2.5 px-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              완료
            </button>
          </>
        ) : (
          <>
            {/* 진행도와 타이머 */}
            <div className="relative mb-8">
              {/* 진행도 (중앙 정렬) */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <Medal className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700 font-semibold">
                  {currentIndex + 1}/{words.length}
                </span>
              </div>
              {/* 타이머 (우측 정렬) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-700 font-semibold">
                {timeLeft}초
              </div>
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
          </>
        )}
      </div>
    </div>
  );
};

export default WordTestPage;
