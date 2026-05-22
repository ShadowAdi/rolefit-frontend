"use client";

import { ReactNode } from "react";
import {
  Controller,
  FieldValues,
  FieldPath,
  Control,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const INPUT_CLASSES =
  "h-11 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all";

const TEXTAREA_CLASSES =
  "min-h-30 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all resize-none";

const SELECT_CLASSES =
  "h-11 border-gray-300 bg-white text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30";

interface FieldLabelProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  required,
  hint,
  children,
}) => (
  <div>
    <label className="text-gray-700 font-semibold block mb-2">
      {label}
      {required && " *"}
    </label>
    {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
    {children}
  </div>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="text-red-500 text-sm mt-1">{message}</p> : null;

interface BaseFieldProps<TForm extends FieldValues> {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  className?: string;
}

export const FormText = <TForm extends FieldValues>({
  control,
  name,
  label,
  required,
  hint,
  placeholder,
  className,
}: BaseFieldProps<TForm>) => (
  <FieldLabel label={label} required={required} hint={hint}>
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <>
          <Input
            placeholder={placeholder}
            {...field}
            value={field.value ?? ""}
            className={cn(INPUT_CLASSES, className)}
          />
          <FieldError message={error?.message} />
        </>
      )}
    />
  </FieldLabel>
);

export const FormTextarea = <TForm extends FieldValues>({
  control,
  name,
  label,
  required,
  hint,
  placeholder,
  className,
}: BaseFieldProps<TForm>) => (
  <FieldLabel label={label} required={required} hint={hint}>
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <>
          <Textarea
            placeholder={placeholder}
            {...field}
            value={field.value ?? ""}
            className={cn(TEXTAREA_CLASSES, className)}
          />
          <FieldError message={error?.message} />
        </>
      )}
    />
  </FieldLabel>
);

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<TForm extends FieldValues>
  extends BaseFieldProps<TForm> {
  options: SelectOption[];
}

export const FormSelect = <TForm extends FieldValues>({
  control,
  name,
  label,
  required,
  hint,
  placeholder,
  options,
}: FormSelectProps<TForm>) => (
  <FieldLabel label={label} required={required} hint={hint}>
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <>
          <Select
            onValueChange={field.onChange}
            value={(field.value as string | undefined) ?? ""}
          >
            <SelectTrigger className={SELECT_CLASSES}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={error?.message} />
        </>
      )}
    />
  </FieldLabel>
);
