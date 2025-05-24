import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";

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
  const [workbookName, setWorkbookName] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [showCaution, setShowCaution] = useState(false); // 🚨 경고 메시지 상태 추가

  const navigate = useNavigate();

  const { id } = useParams(); // 워크북 ID

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/workbook/${id}`)
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

  const handleNext = () => {
    if (userInput.trim() === "") {
      console.log(userInput);
      console.log(currentIndex);
      setShowCaution(true);
      setTimeout(() => setShowCaution(false), 2000);
      return;
    }

    if (currentIndex >= words.length) {
      return; // 방어 코드: 더 이상 진행하지 않도록
    }

    const currentWord = words[currentIndex];
    console.log("currentword : ", currentWord);
    console.log("userInput : ", userInput);

    if (!currentWord) {
      console.warn("currentWord is undefined at index", currentIndex);
      return;
    }

    const isCorrect =
      userInput.trim().toLowerCase() === currentWord.content.toLowerCase();

    // 단어 내용과 정답 여부를 DTO에 맞게 설정
    setAnswers((prev) => [
      ...prev,
      {
        wordId: currentWord.wordId, // 단어 ID
        content: currentWord.content, // 단어 내용
        answer: isCorrect, // 정답 여부
      },
    ]);

    setUserInput("");
    console.log("currentword2 : ", currentWord);
    console.log("userInput2 : ", userInput);

    // 마지막 단어일 경우 answers를 submit하도록
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log(answers);
      // 마지막 단어였을 때: answers를 업데이트한 후 제출
      // 이 부분에서 제출 처리를 해야 할 수 있습니다.
      // 예를 들어, useEffect를 사용하여 submit을 트리거할 수 있습니다.
    }
  };

  const submitResults = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const wrongAnswers = answers.filter((item) => !item.answer);

      await axios.post(
        `http://localhost:8080/api/workbook/submit?workBookId=${id}`, // workBookId를 쿼리 파라미터로 전달
        wrongAnswers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("제출이 완료되었습니다!");

      navigate("/workbooks");
    } catch (err) {
      console.error("제출 실패", err);
      alert("서버 제출에 실패했습니다.");
    }
  };

  if (words.length === 0) return <div>로딩 중...</div>;

  return (
    <div style={styles.container}>
      {/* 🚨 경고 메시지 표시 */}
      {showCaution && <div style={styles.caution}>⚠️ 단어를 입력해주세요</div>}

      <div style={styles.card}>
        <h2 style={styles.title}>{workbookName || "단어장"}</h2>
        <p style={styles.subtitle}>테스트 모드</p>

        <div style={styles.progress}>
          🏅 {currentIndex + 1}/{words.length}
        </div>

        <div style={styles.meaning}>{words[currentIndex].meaning}</div>

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
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            style={{ ...styles.button, backgroundColor: "#d3d3d3" }}
          >
            이전
          </button>
          <button
            onClick={handleNext}
            style={{
              ...styles.button,
              backgroundColor: "#4CAF50",
              color: "white",
            }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "93vh",
    minWidth: "100vw",
    backgroundColor: "#f0f2f5",
    position: "relative",
  },
  caution: {
    position: "absolute",
    top: "10%",
    backgroundColor: "#ffe5e5",
    color: "#cc0000",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
    zIndex: 999,
    transition: "opacity 0.3s ease-in-out",
  },
  card: {
    width: "400px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#888",
    marginBottom: "20px",
  },
  progress: {
    fontSize: "18px",
    marginBottom: "15px",
  },
  meaning: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "30px 0",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default WordTestPage;
