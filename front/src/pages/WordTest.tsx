import React, { useEffect, useState } from "react";
import axios from "axios";

type Word = {
  word: string;
  meaning: string;
};

type AnswerResult = {
  word: string;
  answer: boolean;
};

const WordTestPage = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [answers, setAnswers] = useState<AnswerResult[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const dummyData: Word[] = [
        { word: "complete", meaning: "완화" },
        { word: "achieve", meaning: "성취하다" },
        { word: "understand", meaning: "이해하다" },
        { word: "improve", meaning: "향상하다" },
        { word: "conclude", meaning: "결론을 내리다" }
      ];
      setWords(dummyData);
    };
    fetchWords();
  }, []);

  const handleNext = () => {
    const currentWord = words[currentIndex];
    const isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();

    setAnswers((prev) => [
      ...prev,
      { word: currentWord.word, answer: isCorrect }
    ]);

    setUserInput("");

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitResults();
    }
  };

  const submitResults = async () => {
    try {
      console.log(answers);
    } catch (err) {
      console.error("제출 실패", err);
    }
  };

  if (words.length === 0) return <div>로딩 중...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>토익 기본 단어장</h2>
        <p style={styles.subtitle}>테스트 모드</p>

        <div style={styles.progress}>
          🏅 {currentIndex + 1}/{words.length}
        </div>

        <div style={styles.meaning}>
          {words[currentIndex].meaning}
        </div>

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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
            style={{ ...styles.button, backgroundColor: "#4CAF50", color: "white" }}
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
    backgroundColor: "#f0f2f5"
  },
  card: {
    width: "400px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px"
  },
  subtitle: {
    color: "#888",
    marginBottom: "20px"
  },
  progress: {
    fontSize: "18px",
    marginBottom: "15px"
  },
  meaning: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "30px 0"
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "20px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s"
  }
};

export default WordTestPage;
