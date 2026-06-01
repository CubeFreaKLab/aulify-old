import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { classNames } from "../lib/classNames";

export type AulifyInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helpText?: ReactNode;
  error?: ReactNode;
};

export const AulifyInput = forwardRef<HTMLInputElement, AulifyInputProps>(
  ({ className, error, helpText, id, label, ...props }, ref) => {
    const helpId = id && helpText ? `${id}-help` : undefined;
    const errorId = id && error ? `${id}-error` : undefined;
    const describedBy = [helpId, errorId]
      .filter(Boolean)
      .join(" ");

    return (
      <label className="grid gap-2 text-sm font-medium text-[#0F0F0F]" htmlFor={id}>
        {label ? <span>{label}</span> : null}
        <input
          ref={ref}
          id={id}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error) || undefined}
          className={classNames(
            "min-h-10 rounded-lg border border-[#ECECE7] bg-[#FFFFFF] px-3 text-sm text-[#0F0F0F] outline-none transition-colors duration-180 placeholder:text-[#60615A] focus:border-[#049A4E] disabled:cursor-not-allowed disabled:bg-[#FAFAF8] disabled:text-[#60615A]",
            error ? "border-[#0F0F0F]" : undefined,
            className
          )}
          {...props}
        />
        {helpText ? (
          <span id={helpId} className="text-xs font-normal text-[#60615A]">
            {helpText}
          </span>
        ) : null}
        {error ? (
          <span id={errorId} className="text-xs font-normal text-[#0F0F0F]">
            {error}
          </span>
        ) : null}
      </label>
    );
  }
);

AulifyInput.displayName = "AulifyInput";
