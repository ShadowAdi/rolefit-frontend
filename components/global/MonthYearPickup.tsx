'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTH_LABELS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MonthYearPickerProps {
  label: string;
  selectedMonth?: number;
  selectedYear?: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onClear: () => void;
}



export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  label,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onClear,
}) => {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState(selectedYear ?? currentYear);

  const handleYearChange = (delta: number) => {
    const newYear = displayYear + delta;
    setDisplayYear(newYear);
    if (selectedMonth) {
      onYearChange(newYear);
    }
  };

  const handleMonthClick = (monthIndex: number) => {
    onMonthChange(monthIndex + 1);
    onYearChange(displayYear);
  };

  return (
    <div>
      <label className="text-gray-700 font-semibold block mb-2">{label}</label>

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleYearChange(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
              aria-label="Previous year"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="text-sm font-semibold text-gray-800 w-12 text-center select-none">
              {displayYear}
            </span>
            <button
              type="button"
              onClick={() => handleYearChange(1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
              aria-label="Next year"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {selectedMonth && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1 p-2">
          {MONTH_LABELS.map((m, i) => {
            const isSelected =
              selectedMonth === i + 1 &&
              selectedYear === displayYear;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleMonthClick(i)}
                className={`py-1.5 text-sm rounded-lg transition-all font-medium cursor-pointer ${
                  isSelected
                    ? "bg-lime-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-lime-50 hover:text-lime-700"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        {selectedMonth && selectedYear && (
          <div className="px-3 pb-2.5">
            <span className="inline-flex items-center gap-1.5 bg-lime-50 border border-lime-200 text-lime-700 text-xs font-semibold rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500 inline-block" />
              {MONTH_LABELS_FULL[selectedMonth - 1]} {selectedYear}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
