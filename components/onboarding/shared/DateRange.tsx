"use client";

import {
  Controller,
  Control,
  FieldValues,
  FieldPath,
  useWatch,
} from "react-hook-form";
import { DatePicker } from "@/components/global/DatePicker";

interface DateRangeProps<TForm extends FieldValues> {
  control: Control<TForm>;
  startName: FieldPath<TForm>;
  endName: FieldPath<TForm>;
  startLabel?: string;
  endLabel?: string;
}

export const DateRange = <TForm extends FieldValues>({
  control,
  startName,
  endName,
  startLabel = "Start Date",
  endLabel = "End Date",
}: DateRangeProps<TForm>) => {
  const startVal = useWatch({ control, name: startName }) as
    | string
    | null
    | undefined;
  const endVal = useWatch({ control, name: endName }) as
    | string
    | null
    | undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Controller
        control={control}
        name={startName}
        render={({ field }) => (
          <DatePicker
            label={startLabel}
            value={(field.value as string | null | undefined) ?? undefined}
            onChange={field.onChange}
            placeholder={`Select ${startLabel.toLowerCase()}`}
            maxDate={endVal ?? undefined}
          />
        )}
      />
      <Controller
        control={control}
        name={endName}
        render={({ field, fieldState: { error } }) => (
          <div>
            <DatePicker
              label={endLabel}
              value={(field.value as string | null | undefined) ?? undefined}
              onChange={field.onChange}
              placeholder={`Select ${endLabel.toLowerCase()}`}
              minDate={startVal ?? undefined}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};
