import { useNavigate, useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkBookMode } from "../utils/funcFetch";
import { useAuth } from "../context/AuthContext";

const SelectMode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // useQuery로 단어장 정보 패칭
  const { data, isLoading } = useQuery({
    queryKey: ["workbook", id],
    queryFn: () => fetchWorkBookMode(id),
    enabled: !!id,
  });

  const handleWorkBookStudy = () => {
    if (data.wordList.length > 0) navigate(`/workbook/${id}/study`);
    else alert("단어장에 단어가 하나이상 존재해야합니다!");
  };

  const handleWorkBookTest = () => {
    if (data.wordList.length > 0) navigate(`/workbook/${id}/test`);
    else alert("단어장에 단어가 하나이상 존재해야합니다!");
  };

  const handleWrongWorkBook = () => {
    if (data.wrong) navigate(`/workbook/${id}/wrong`);
    else alert("테스트에서 틀린 부분이 존재할 시 오답 단어장이 생성됩니다!");
  };

  if (isLoading) return <div>불러오는 중...</div>;

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8">
        {/* 단어장 이름 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {data?.title}
          </h2>
        </div>

        {isAdmin ? (
          // 관리자인 경우 설정 버튼만 표시
          <button
            onClick={() => navigate(`/workbook/${id}/modify`)}
            className="w-full h-32 sm:h-36 md:h-40 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Settings className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-600" />
          </button>
        ) : (
          // 일반 사용자인 경우 기존 버튼들 표시
          <>
            {/* 첫 번째 행: 학습모드, 테스트모드 버튼 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={handleWorkBookStudy}
                className="h-24 sm:h-28 md:h-32 bg-gradient-to-br from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                학습모드
              </button>
              <button
                onClick={handleWorkBookTest}
                className="h-24 sm:h-28 md:h-32 bg-gradient-to-br from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                테스트모드
              </button>
            </div>

            {/* 두 번째 행: 오답모드 버튼 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={handleWrongWorkBook}
                className="w-full h-24 sm:h-28 md:h-32 bg-gradient-to-br from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                오답모드
              </button>
              <button
                onClick={() => navigate(`/workbook/${id}/modify`)}
                className="h-24 sm:h-28 md:h-32 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
              >
                <Settings className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-600" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectMode;
