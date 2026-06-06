"use client";

import { useEffect, useId, useState, type FocusEvent, type InputHTMLAttributes } from "react";

type AuthInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "placeholder"> & {
  error?: string;
  label: string;
  shakeKey?: number;
};

export function AuthInput({
  error,
  label,
  onBlur,
  onFocus,
  required,
  shakeKey = 0,
  type = "text",
  value,
  ...props
}: AuthInputProps) {
  const generatedId = useId();
  const inputId = `auth-${generatedId}`;
  const errorId = `${inputId}-error`;
  const isPassword = type === "password";
  const inputValue = typeof value === "string" ? value : value == null ? "" : String(value);
  const hasValue = inputValue.length > 0;
  const hasError = Boolean(error);
  const [isFocused, setIsFocused] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const resolvedType = isPassword && isPasswordVisible ? "text" : type;
  const isFloating = isFocused || hasValue;

  useEffect(() => {
    if (!hasError || shakeKey === 0) {
      return;
    }

    setIsShaking(false);
    const frame = window.requestAnimationFrame(() => setIsShaking(true));
    const timer = window.setTimeout(() => setIsShaking(false), 360);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [hasError, shakeKey]);

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    onBlur?.(event);
  }

  return (
    <div>
      <div className={["relative", isShaking ? "auth-field-shake" : ""].join(" ")}>
        <input
          id={inputId}
          type={resolvedType}
          required={required}
          value={value}
          placeholder=" "
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={[
            "h-16 w-full rounded-full border-[1.5px] bg-neutral-white px-8 py-0 text-base font-medium leading-[64px] text-neutral-black outline-none transition-[border-color,box-shadow] duration-base placeholder:text-transparent disabled:cursor-not-allowed disabled:bg-neutral-offWhite disabled:text-neutral-darkGray",
            isPassword ? "pr-14" : "",
            hasError
              ? "border-[#E5484D] focus:border-[#E5484D] focus:ring-4 focus:ring-[rgba(229,72,77,0.12)]"
              : "border-neutral-lightGray focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
          ].join(" ")}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={[
            "pointer-events-none absolute left-7 z-10 -translate-y-1/2 bg-neutral-white px-1.5 font-medium leading-none transition-[top,transform,font-size,color] duration-base ease-out",
            isFloating ? "top-0 text-xs" : "top-1/2 text-base",
            hasValue && !isFocused ? "text-neutral-darkGray" : "text-neutral-black"
          ].join(" ")}
        >
          <span>{label}</span>
          {required ? (
            <span
              className={[
                "transition-colors duration-base",
                hasError ? "text-[#E5484D]" : isFocused ? "text-brand-green" : "text-neutral-black"
              ].join(" ")}
            >
              {" *"}
            </span>
          ) : null}
        </label>
        {isPassword ? (
          <button
            type="button"
            aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={isPasswordVisible}
            tabIndex={hasValue ? 0 : -1}
            onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
            className={[
              "absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-neutral-darkGray transition duration-base hover:bg-neutral-offWhite hover:text-neutral-black focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
              hasValue ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
            ].join(" ")}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <path
                d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              {isPasswordVisible ? null : (
                <path d="M4 20 20 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
              )}
            </svg>
          </button>
        ) : null}
      </div>
      <div
        id={errorId}
        aria-live="polite"
        className={[
          "overflow-hidden pl-7 text-sm font-medium text-[#E5484D] transition-[max-height,opacity,transform,margin] duration-base ease-out",
          hasError ? "mt-1.5 max-h-9 translate-y-0 opacity-100" : "mt-0 max-h-0 -translate-y-1 opacity-0"
        ].join(" ")}
      >
        {error}
      </div>
    </div>
  );
}
