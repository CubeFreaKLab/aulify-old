import { type HTMLAttributes } from "react";
import { classNames } from "../lib/classNames";

export type AulifyBadgeVariant = "default" | "success" | "warning" | "danger" | "neutral";

export type AulifyBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: AulifyBadgeVariant;
};

const variantClasses: Record<AulifyBadgeVariant, string> = {
  default: "border-[#049A4E] bg-[#049A4E] text-[#FFFFFF]",
  success: "border-[#049A4E] bg-[#049A4E] text-[#FFFFFF]",
  warning: "border-[#B8FAC6] bg-[#B8FAC6] text-[#0F0F0F]",
  danger: "border-[#0F0F0F] bg-[#0F0F0F] text-[#FFFFFF]",
  neutral: "border-[#ECECE7] bg-[#FAFAF8] text-[#60615A]"
};

export function AulifyBadge({ className, variant = "default", ...props }: AulifyBadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
