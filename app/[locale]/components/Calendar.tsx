"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  minDate?: Date;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    // Convert to Monday = 0, Sunday = 6
    return day === 0 ? 6 : day - 1;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i),
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i),
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < minDate;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return selected.getTime() === date.getTime();
  };

  const formatDateForValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calendarDays = generateCalendarDays();
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i
  );

  return (
    <div className="w-full">
      {/* Month/Year Selection */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={currentMonth}
          onChange={handleMonthChange}
          className="flex-1 p-2 text-base border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white"
        >
          {monthNames.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={currentYear}
          onChange={handleYearChange}
          className="flex-1 p-2 text-base border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7  mb-0.5">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-base
             font-semibold text-neutral-600 w-14"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Compact dates */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((dayInfo, index) => {
          const disabled = isDateDisabled(dayInfo.date);
          const selected = isDateSelected(dayInfo.date);
          const isToday =
            dayInfo.date.toDateString() === new Date().toDateString();
          const isWeekend =
            dayInfo.date.getDay() === 0 || dayInfo.date.getDay() === 6; // Sunday or Saturday

          return (
            <button
              key={index}
              onClick={() =>
                !disabled &&
                dayInfo.isCurrentMonth &&
                !isWeekend &&
                onDateSelect(formatDateForValue(dayInfo.date))
              }
              disabled={disabled || !dayInfo.isCurrentMonth || isWeekend}
              className={`
                w-14 h-10 rounded text-center text-base font-medium transition-all flex items-center justify-center
                ${!dayInfo.isCurrentMonth ? "text-gray-300" : ""}
                ${disabled || isWeekend ? "text-gray-300 cursor-not-allowed bg-gray-50" : ""}
                ${selected ? "bg-primary text-white border border-primary" : ""}
                ${!selected && !disabled && dayInfo.isCurrentMonth && !isWeekend ? "border border-gray-200 hover:border-primary text-neural-dark" : ""}
                ${isToday && !selected && !isWeekend ? "border-primary border" : ""}
              `}
            >
              {dayInfo.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
