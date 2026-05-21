"use client";

import { useMemo, useState } from "react";
import { Popover } from "radix-ui";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MONTH_LABELS = [
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

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
}

const parseISODate = (iso?: string): Date | undefined => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
};

const toISODate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disabled,
}) => {
  const selected = useMemo(() => parseISODate(value), [value]);
  const min = useMemo(() => parseISODate(minDate), [minDate]);
  const max = useMemo(() => parseISODate(maxDate), [maxDate]);

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => selected ?? new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = new Date(year, month, 1).getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const today = new Date();

  const isDisabled = (date: Date) => {
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  const handleSelect = (date: Date) => {
    if (isDisabled(date)) return;
    onChange(toISODate(date));
    setOpen(false);
  };

  const display = selected
    ? `${MONTH_SHORT[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`
    : placeholder;

  return (
    <div>
      {label && (
        <label className="text-gray-700 font-semibold block mb-2">
          {label}
        </label>
      )}
      <Popover.Root
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o && selected) setViewDate(selected);
        }}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3 flex items-center justify-between gap-2 rounded-lg border bg-white text-left transition-all cursor-pointer",
              "border-gray-300 hover:border-gray-400",
              "focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              open && "border-lime-500 ring-2 ring-lime-400/30",
            )}
          >
            <span className="flex items-center gap-2 min-w-0">
              <CalendarIcon
                className={cn(
                  "size-4 shrink-0",
                  selected ? "text-lime-600" : "text-gray-400",
                )}
              />
              <span
                className={cn(
                  "truncate text-sm",
                  selected ? "text-gray-900 font-medium" : "text-gray-400",
                )}
              >
                {display}
              </span>
            </span>
            {selected && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-0.5 rounded"
                aria-label="Clear date"
              >
                <X className="size-3.5" />
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={6}
            align="start"
            className="z-50 w-[280px] rounded-xl border border-gray-200 bg-white shadow-xl p-3 outline-none"
          >
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="text-sm font-semibold text-gray-800">
                {MONTH_LABELS[month]} {year}
              </div>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-[11px] text-gray-400 text-center font-medium py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((d, i) => {
                if (!d) return <div key={`pad-${i}`} className="h-8" />;
                const isSel = selected && isSameDay(d, selected);
                const isToday = isSameDay(d, today);
                const dDisabled = isDisabled(d);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={dDisabled}
                    onClick={() => handleSelect(d)}
                    className={cn(
                      "h-8 w-full text-sm rounded-md transition-all font-medium",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      isSel
                        ? "bg-lime-500 text-white shadow-sm hover:bg-lime-600"
                        : isToday
                          ? "text-lime-700 ring-1 ring-lime-300 hover:bg-lime-50"
                          : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const t = new Date();
                  if (!isDisabled(t)) handleSelect(t);
                  else setViewDate(t);
                }}
                className="text-xs font-medium text-lime-600 hover:text-lime-700 px-2 py-1 rounded-md hover:bg-lime-50 transition-colors"
              >
                Today
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(undefined);
                    setOpen(false);
                  }}
                  className="text-xs font-medium text-gray-500 hover:text-red-500 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
