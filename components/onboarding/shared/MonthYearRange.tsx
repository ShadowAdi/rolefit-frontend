"use client";

import { Controller, Control, FieldValues, FieldPath } from "react-hook-form";
import { MonthYearPicker } from "@/components/global/MonthYearPickup";

interface MonthYearRangeProps<TForm extends FieldValues> {
  control: Control<TForm>;
  startMonthName: FieldPath<TForm>;
  startYearName: FieldPath<TForm>;
  endMonthName: FieldPath<TForm>;
  endYearName: FieldPath<TForm>;
  startLabel?: string;
  endLabel?: string;
}

export const MonthYearRange = <TForm extends FieldValues>({
  control,
  startMonthName,
  startYearName,
  endMonthName,
  endYearName,
  startLabel = "Start Date",
  endLabel = "End Date",
}: MonthYearRangeProps<TForm>) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Controller
      control={control}
      name={startMonthName}
      render={({ field: monthField }) => (
        <Controller
          control={control}
          name={startYearName}
          render={({ field: yearField }) => (
            <MonthYearPicker
              label={startLabel}
              selectedMonth={(monthField.value as number | undefined) ?? undefined}
              selectedYear={(yearField.value as number | undefined) ?? undefined}
              onMonthChange={(m) => monthField.onChange(m)}
              onYearChange={(y) => yearField.onChange(y)}
              onClear={() => {
                monthField.onChange(undefined);
                yearField.onChange(undefined);
              }}
            />
          )}
        />
      )}
    />
    <Controller
      control={control}
      name={endMonthName}
      render={({ field: monthField }) => (
        <Controller
          control={control}
          name={endYearName}
          render={({ field: yearField }) => (
            <MonthYearPicker
              label={endLabel}
              selectedMonth={(monthField.value as number | undefined) ?? undefined}
              selectedYear={(yearField.value as number | undefined) ?? undefined}
              onMonthChange={(m) => monthField.onChange(m)}
              onYearChange={(y) => yearField.onChange(y)}
              onClear={() => {
                monthField.onChange(undefined);
                yearField.onChange(undefined);
              }}
            />
          )}
        />
      )}
    />
  </div>
);
