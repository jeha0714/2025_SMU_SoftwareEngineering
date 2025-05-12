import { useState, useEffect } from "react";
import { BookOpen, User, TrendingUp } from "lucide-react";

export default function MyInfo() {
  // 임시 데이터 (실제로는 API나 상태 관리 라이브러리에서 가져올 예정)
  const [userInfo, setUserInfo] = useState({
    nickname: "영어마스터",
    id: "english_learner_2024",
    todayWords: 45,
    totalWords: 1234,
  });

  return (
    <div className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* 개인 정보 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center space-y-4 transform transition-all duration-300 hover:scale-105">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={48} className="text-blue-500" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {userInfo.nickname}
            </h2>
            <p className="text-gray-500 text-sm">@{userInfo.id}</p>
          </div>
        </div>

        {/* 학습 통계 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center space-y-4 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen size={36} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                오늘의 학습
              </h3>
              <p className="text-gray-600">오늘 학습한 단어</p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
            <span className="text-lg font-bold text-green-700">
              {userInfo.todayWords}개
            </span>
            <TrendingUp size={24} className="text-green-500" />
          </div>
        </div>

        {/* 누적 학습 통계 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center space-y-4 col-span-1 md:col-span-2 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen size={36} className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                총 학습 현황
              </h3>
              <p className="text-gray-600">지금까지 학습한 총 단어 수</p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
            <span className="text-lg font-bold text-purple-700">
              {userInfo.totalWords}개
            </span>
            <TrendingUp size={24} className="text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
