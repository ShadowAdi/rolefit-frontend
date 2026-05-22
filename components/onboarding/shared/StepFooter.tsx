"use client";

interface StepFooterProps {
  helperText?: string;
}

export const StepFooter: React.FC<StepFooterProps> = ({ helperText }) =>
  helperText ? (
    <p className="text-center text-sm text-gray-600">{helperText}</p>
  ) : null;
