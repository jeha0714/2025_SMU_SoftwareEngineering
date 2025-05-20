import { useState } from "react";
import CalendarPage from "../components/Calendar";
import MyInfo from "../components/MyInfo";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("calendar"); // "calendar" 또는 "info"

  return (
    <article className="w-full h-[90vh] flex flex-col bg-gray-100 p-6">
      {/* 버튼 섹션 */}
      <div className="w-full flex justify-center mb-6">
        <div className="inline-flex rounded-lg shadow-sm bg-white p-1">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === "info"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            내 정보
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === "calendar"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            캘린더
          </button>
        </div>
      </div>

      {/* 콘텐츠 섹션 */}
      <section className="w-full flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
        {activeTab !== "calendar" ? (
          <div className="h-full">
            <MyInfo />
          </div>
        ) : (
          <div className="h-full">
            <CalendarPage />
          </div>
        )}
      </section>
    </article>
  );
}
