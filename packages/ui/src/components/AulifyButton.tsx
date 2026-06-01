import { forwardRef, type ButtonHTMLAttributes } from "react";
import { classNames } from "../lib/classNames";

export type AulifyButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type AulifyButtonSize = "sm" | "md" | "lg";

export type AulifyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AulifyButtonVariant;
  size?: AulifyButtonSize;
};

const variantClasses: Record<AulifyButtonVariant, string> = {
  primary: "border-[#049A4E] bg-[#049A4E] text-[#FFFFFF] hover:bg-[#0F0F0F]",
  secondary: "border-[#B8FAC6] bg-[#B8FAC6] text-[#0F0F0F] hover:border-[#049A4E]",
  ghost: "border-transparent bg-transparent text-[#049A4E] hover:bg-[#FAFAF8]",
  danger: "border-[#0F0F0F] bg-[#0F0F0F] text-[#FFFFFF] hover:bg-[#60615A]"
};

const sizeClasses: Record<AulifyButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-12 px-5 text-base"
};

export const AulifyButton = forwardRef<HTMLButtonElement, AulifyButtonProps>(
  ({ className, size = "md", type = "button", variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={classNames(
        "inline-flex items-center justify-center rounded-lg border font-medium transition-colors duration-180 disabled:cursor-not-allowed disabled:opacity-60",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);

AulifyButton.displayName = "AulifyButton";
