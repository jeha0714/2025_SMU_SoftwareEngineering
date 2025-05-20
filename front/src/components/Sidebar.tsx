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
} from "lucide-react";

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const [activeItem, setActiveItem] = useState<string>("");
  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    navigate(`/wordbook/${encodeURIComponent(item)}`);
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

  const menuItems = [
    {
      name: "수능",
      submenu: [
        "토익 기본",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
        "토익 심화",
      ],
    },
    {
      name: "토플",
      submenu: ["토익 기본", "토익 심화"],
    },
    {
      name: "토익",
      submenu: ["토익 기본", "토익 심화"],
    },
    {
      name: "기타",
      submenu: ["비지니스 기본 이래용 과연 그럴까요? 후후하하하", "일상 영어"],
    },
  ];

  return (
    <aside className="w-full h-full bg-white shadow-lg  overflow-y-auto border border-gray-200">
      <div className="py-2">
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
                    key={subItem}
                    onClick={() => handleItemClick(subItem)}
                    className={`w-full flex items-center px-6 py-3 hover:bg-gray-100 transition-colors text-left ${
                      activeItem === subItem
                        ? "text-indigo-600 bg-indigo-50 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-4 h-4 items-center justify-center flex-shrink-0">
                        {activeItem === subItem ? (
                          <ChevronRight size={16} className="text-indigo-600" />
                        ) : (
                          <Dot className="text-gray-600" />
                        )}
                      </span>
                      <span>{subItem}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
