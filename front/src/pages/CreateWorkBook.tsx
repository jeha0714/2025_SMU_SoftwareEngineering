import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkbook } from "../utils/funcFetch";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";

type WorkBookCategory = "SUNEUNG" | "TOEIC" | "TOEFL" | "ETC";

const reverseCategoryMap: Record<string, WorkBookCategory> = {
  수능: "SUNEUNG",
  토익: "TOEIC",
  토플: "TOEFL",
  기타: "ETC",
};

export default function CreateWorkBook() {
  const [workbookName, setWorkbookName] = useState("");
  const [workbookDescription, setWorkbookDescription] = useState("");
  const [category, setCategory] = useState("토익");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const validateWorkbookName = (name: string) => {
    // 한글, 영어 대소문자, 숫자, 공백, 언더스코어(_)만 허용
    const specialCharRegex = /[^\w\s가-힣a-zA-Z0-9]/;
    return !specialCharRegex.test(name);
  };

  const validateWorkbookDescription = (desc: string) => {
    // 한글, 영어 대소문자, 숫자, 공백, 언더스코어(_), 마침표, 느낌표만 허용
    const specialCharRegex = /[^\w\s가-힣a-zA-Z0-9.!_]/;
    return !specialCharRegex.test(desc);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkbookName(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setWorkbookDescription(e.target.value);
  };

  const handleCreateWorkbook = async () => {
    // 입력값 검증
    if (!workbookName.trim()) {
      setError("단어장 이름을 입력해주세요.");
      return;
    }

    if (!workbookDescription.trim()) {
      setError("단어장 설명을 작성해주세요.");
      return;
    }

    if (!validateWorkbookName(workbookName)) {
      setError(
        "단어장 이름에는 완성된 한글, 언더스코어(_)와 공백 이외의 문자를 사용할 수 없습니다."
      );
      return;
    }

    if (!validateWorkbookDescription(workbookDescription)) {
      setError(
        "단어장 설명에는 완성된 한글, !_와 공백 이외의 문자를 사용할 수 없습니다."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await createWorkbook({
        title: workbookName,
        description: workbookDescription,
        category: reverseCategoryMap[category],
      });

      // 성공 시 폼 초기화
      setWorkbookName("");
      setWorkbookDescription("");
      setCategory("토익");
      setError("");

      // Sidebar의 workbook 목록을 새로고침
      await queryClient.invalidateQueries({ queryKey: ["workbooks"] });

      // 단어장 생성 완료 메시지
      showToast("단어장 생성이 완료되었습니다.", "success");

      // 생성된 단어장 목록으로 이동
      navigate("/");
    } catch (err) {
      setError("단어장 생성에 실패했습니다. 다시 시도해주세요.");
      console.error("단어장 생성 실패:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="w-full h-full p-8 bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-lg">
        {" "}
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          새 단어장 추가
        </h1>
        <div className="space-y-6">
          {/* 단어장 이름 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              단어장 이름
            </label>
            <input
              type="text"
              value={workbookName}
              onChange={handleNameChange}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
              placeholder="단어장 이름을 입력하세요"
            />
          </div>

          {/* 단어장 설명 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              단어장 설명
            </label>
            <textarea
              value={workbookDescription}
              onChange={handleDescriptionChange}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none h-24 overflow-y-auto"
              placeholder="단어장에 대한 설명을 입력하세요"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              카테고리
            </label>
            <div className="flex flex-wrap gap-4">
              {["수능", "토익", "토플", "기타"].map((cat) => (
                <label key={cat} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      category === cat
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {category === cat && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-lg text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 단어장 생성 버튼 */}
          <div className="text-center">
            <button
              onClick={handleCreateWorkbook}
              disabled={isSubmitting}
              className={`px-8 py-3 bg-white border-2 border-purple-400 text-purple-600 rounded-xl font-medium text-lg hover:bg-purple-50 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "생성 중..." : "단어장 생성"}
            </button>

            {/* 오류 메시지 */}
            {error && (
              <div className="mt-3 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
