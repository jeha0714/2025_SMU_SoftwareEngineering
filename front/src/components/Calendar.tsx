import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../assets/styles/Calendar.css";

// 로케일라이저 설정
const localizer = momentLocalizer(moment);

// 요일 표시 변경 (한글)
const formats = {
  monthHeaderFormat: (date) => moment(date).format("YYYY년 MM월"),
  dayHeaderFormat: (date) => moment(date).format("YYYY년 MM월 DD일"),
  dayRangeHeaderFormat: ({ start, end }) =>
    `${moment(start).format("YYYY년 MM월 DD일")} - ${moment(end).format(
      "YYYY년 MM월 DD일"
    )}`,
  dayFormat: (date) => moment(date).format("D"),
  weekdayFormat: (date) => moment(date).format("ddd"),
};

export default function CalendarPage() {
  // 현재 날짜 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  // 출석체크 데이터 상태
  const [attendanceDates, setAttendanceDates] = useState([]);
  // 출석체크 연속일 상태
  const [streak, setStreak] = useState(0);

  // API에서 출석체크 데이터를 가져오는 시뮬레이션
  useEffect(() => {
    // 예시 데이터 (실제로는 API에서 가져와야 함)
    const mockAttendanceData = [
      "2025/05/01",
      "2025/05/02",
      "2025/05/03",
      "2025/05/04",
      "2025/05/05",
      "2025/05/08",
      "2025/05/10",
      "2025/05/11",
      "2025/05/12",
    ];

    setAttendanceDates(mockAttendanceData);

    // 연속 출석일 계산
    let maxStreak = 0;
    let currentStreak = 0;
    const sortedDates = [...mockAttendanceData].sort();

    for (let i = 0; i < sortedDates.length; i++) {
      const current = moment(sortedDates[i], "YYYY/MM/DD");
      const prev = i > 0 ? moment(sortedDates[i - 1], "YYYY/MM/DD") : null;

      if (prev && current.diff(prev, "days") === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
    }

    setStreak(maxStreak);
  }, []);

  // 이전 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // 현재 월과 년도 표시
  const formatMonthYear = (date) => {
    return moment(date).format("YYYY년 MM월");
  };

  // 출석체크 날짜인지 확인하는 함수
  const isAttendanceDate = (date) => {
    const formattedDate = moment(date).format("YYYY/MM/DD");
    return attendanceDates.includes(formattedDate);
  };

  // 날짜 셀 커스텀 렌더링
  const dayPropGetter = (date) => {
    if (isAttendanceDate(date)) {
      return {
        className: "attendance-day",
        style: {
          position: "relative",
        },
      };
    }
    return {};
  };

  // 커스텀 날짜 셀 컴포넌트
  const CustomDateCell = ({ date }) => {
    const isToday = moment(date).isSame(moment(), "day");
    const isAttendance = isAttendanceDate(date);

    return (
      <div className={`h-full w-full flex items-center justify-center`}>
        <div
          className={`
            relative flex items-center justify-center
            h-8 w-8 rounded-full font-medium
            ${isToday ? "border-2 border-blue-500" : ""}
            ${isAttendance ? "bg-purple-500 text-white" : ""}
          `}
        >
          {moment(date).format("D")}
          {isAttendance && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col p-4">
      {/* 출석 통계 정보 */}
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div className="text-gray-700">
            <p className="text-xs font-medium">이번 달 출석</p>
            <p className="text-base font-bold">
              {
                attendanceDates.filter((date) =>
                  date.startsWith(`${moment(currentDate).format("YYYY/MM")}`)
                ).length
              }
              일
            </p>
          </div>
          <div className="text-center text-gray-700">
            <p className="text-xs font-medium">연속 출석</p>
            <p className="text-base font-bold">{streak}일</p>
          </div>
          <div className="text-right text-gray-700">
            <p className="text-xs font-medium">전체 출석</p>
            <p className="text-base font-bold">{attendanceDates.length}일</p>
          </div>
        </div>
      </div>

      {/* 월 이동 네비게이션 */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={goToPrevMonth}
          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h2 className="text-base font-bold text-gray-800">
          {formatMonthYear(currentDate)}
        </h2>

        <button
          onClick={goToNextMonth}
          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* 출석체크 캘린더 */}
      <div className="flex-1 overflow-hidden">
        <Calendar
          localizer={localizer}
          formats={formats}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          views={["month"]}
          defaultView="month"
          date={currentDate}
          toolbar={false}
          dayPropGetter={dayPropGetter}
          components={{
            dateCellWrapper: (props) => (
              <div className="h-full w-full">
                <div className="flex items-center justify-center h-full">
                  <CustomDateCell date={props.value} />
                </div>
                {props.children}
              </div>
            ),
          }}
        />
      </div>

      {/* 출석체크 범례 */}
      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-around text-xs text-gray-600">
          <div className="flex items-center">
            <span className="inline-block h-3 w-3 rounded-full bg-purple-500 mr-1"></span>
            <span>출석</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-blue-500 mr-1"></span>
            <span>오늘</span>
          </div>
        </div>
      </div>

      {/* 캘린더 관련 CSS */}
    </div>
  );
}
