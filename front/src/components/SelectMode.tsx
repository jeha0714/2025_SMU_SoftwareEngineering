import { useParams } from "react-router-dom";

const SelectMode = () => {
  // 예시용 단어장 이름
  const { id } = useParams();
  const wordbookName = decodeURIComponent(id || "");

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8">
        {/* 단어장 이름 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {wordbookName}
          </h2>
        </div>

        {/* 첫 번째 행: 학습모드, 테스트모드 버튼 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button className="h-24 sm:h-28 md:h-32 bg-gradient-to-br from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200">
            학습모드
          </button>
          <button className="h-24 sm:h-28 md:h-32 bg-gradient-to-br from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200">
            테스트모드
          </button>
        </div>

        {/* 두 번째 행: 오답모드 버튼 */}
        <div className="w-full">
          <button className="w-full h-24 sm:h-28 md:h-32 bg-gradient-to-br from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400 text-gray-700 font-semibold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200">
            오답모드
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectMode;
