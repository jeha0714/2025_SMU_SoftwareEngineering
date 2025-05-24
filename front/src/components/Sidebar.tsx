import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  GraduationCap,
  Globe,
  BookOpen,
  MoreHorizontal,
  Dot,
  Plus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkBookList } from "../utils/funcFetch";

type WorkBookCategory = "SUNEUNG" | "TOEIC" | "TOEFL" | "ETC";

const categoryNameMap: Record<WorkBookCategory, string> = {
  SUNEUNG: "수능",
  TOEIC: "토익",
  TOEFL: "토플",
  ETC: "기타",
};

type WorkBook = {
  id: number;
  title: string;
  description: string;
  category: WorkBookCategory;
  creatorName: string;
};

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string>("");
  const navigate = useNavigate();

  // useQuery로 데이터 패칭
  const { data: workbooks = [], isLoading: loading } = useQuery<WorkBook[]>({
    queryKey: ["workbooks"],
    queryFn: fetchWorkBookList,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleItemClick = (workbook: WorkBook) => {
    setActiveItem(workbook.title);
    navigate(`/workbook/${workbook.id}`);
  };

  const handleCreateWorkbook = () => {
    navigate("/workbook/create");
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case "수능":
        return <GraduationCap size={18} />;
      case "토플":
        return <Globe size={18} />;
      case "토익":
        return <BookOpen size={18} />;
      case "기타":
        return <MoreHorizontal size={18} />;
      default:
        return null;
    }
  };

  // workbooks를 카테고리별로 그룹화
  const groupedWorkbooks = workbooks.reduce<Record<string, WorkBook[]>>(
    (acc, wb) => {
      const category = categoryNameMap[wb.category];
      if (!acc[category]) acc[category] = [];
      acc[category].push(wb);
      return acc;
    },
    {}
  );

  // 모든 카테고리를 항상 메뉴에 표시
  const allCategories = Object.values(categoryNameMap);

  // menuItems를 WorkBook 객체 배열로 변경
  const menuItems = allCategories.map((category) => ({
    name: category,
    submenu: groupedWorkbooks[category] || [],
  }));

  if (loading) return <div className="p-4 text-gray-600">불러오는 중...</div>;

  return (
    <aside className="w-full h-full bg-white shadow-lg overflow-y-auto border border-gray-200 flex flex-col">
      <div className="py-2 flex-1">
        {menuItems.map((item) => (
          <div key={item.name} className="mb-2">
            <button
              onClick={() => toggleMenu(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors text-gray-700`}
            >
              <div className="flex items-center gap-3">
                {renderIcon(item.name)}
                <span>{item.name}</span>
              </div>
              {openMenus[item.name] ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {/* menu 내부 단어장 list */}
            {openMenus[item.name] && (
              <div className="flex flex-col bg-gray-50">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleItemClick(subItem)}
                    className={`w-full flex items-center px-6 py-3 hover:bg-gray-100 transition-colors text-left ${
                      activeItem === subItem.title
                        ? "text-indigo-600 bg-indigo-50 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-4 h-4 items-center justify-center flex-shrink-0">
                        {activeItem === subItem.title ? (
                          <ChevronRight size={16} className="text-indigo-600" />
                        ) : (
                          <Dot className="text-gray-600" />
                        )}
                      </span>
                      <span>{subItem.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 단어장 생성 버튼 */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleCreateWorkbook}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>단어장 생성</span>
        </button>
      </div>
    </aside>
  );
}
