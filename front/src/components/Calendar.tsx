import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../assets/styles/Calendar.css";
import { vocaServerNeedAuth } from "../utils/axiosInfo";
import { useToast } from "../context/ToastContext";
// import { CSSProperties } from "react";

const localizer = momentLocalizer(moment);

type CustomDateCellProps = {
  date: Date;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    vocaServerNeedAuth
      .get("/api/attendance/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        if (!data.isSuccess) {
          alert(`출석 정보를 불러오지 못했습니다: ${data.message}`);
          return;
        }
        const result = data.result.attendanceDates as Record<
          string,
          Record<string, string[]>
        >;
        const flatDates = Object.values(result)
          .flatMap((months) => Object.values(months).flat())
          .map((date) =>
            moment(date, ["YYYY/M/D", "YYYY/MM/DD"]).format("YYYY/MM/DD")
          );
        setAttendanceDates(flatDates);
      })
      .catch((error) => {
        if (error.response) {
          showToast(`서버 오류: ${error.response.data?.message}`, "error");
          if (error.response.status === 401) {
            sessionStorage.removeItem("accessToken");
            window.location.href = "/signin";
          }
        } else {
          showToast("서버와의 연결에 실패했습니다.", "error");
        }
      });
  }, []);

  const goToPrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
  };

  const formatMonthYear = (date: Date) => moment(date).format("YYYY년 MM월");

  const isAttendanceDate = (date: Date): boolean => {
    const formattedDate = moment(date).format("YYYY/MM/DD");
    return attendanceDates.includes(formattedDate);
  };

  const dayPropGetter = (date: Date): React.HTMLAttributes<HTMLDivElement> => {
    return isAttendanceDate(date)
      ? {
          className: "attendance-day",
          style: { position: "relative" },
        }
      : {};
  };

  const CustomDateCell = ({ date }: CustomDateCellProps) => {
    const isToday = moment(date).isSame(moment(), "day");
    const isAttendance = isAttendanceDate(date);
    return (
      <div className="h-full w-full flex items-center justify-center">
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

  const formats = {
    monthHeaderFormat: (date: Date) => moment(date).format("YYYY년 MM월"),
    dayHeaderFormat: (date: Date) => moment(date).format("YYYY년 MM월 DD일"),
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format("YYYY년 MM월 DD일")} - ${moment(end).format(
        "YYYY년 MM월 DD일"
      )}`,
    dayFormat: (date: Date) => moment(date).format("D"),
    weekdayFormat: (date: Date) => moment(date).format("ddd"),
  };

  return (
    <div className="h-full w-full flex flex-col p-4">
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-sm">
        <div className="flex justify-around items-center text-gray-700">
          <div className="text-center">
            <p className="text-xs font-medium">이번 달 출석</p>
            <p className="text-base font-bold">
              {
                attendanceDates.filter((date) =>
                  date.startsWith(moment(currentDate).format("YYYY/MM"))
                ).length
              }
              일
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">전체 출석</p>
            <p className="text-base font-bold">{attendanceDates.length}일</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={goToPrevMonth}
          className="h-8 w-8 hover:bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg
            className="h-4 w-4 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
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
          className="h-8 w-8 hover:bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg
            className="h-4 w-4 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
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
    </div>
  );
}
