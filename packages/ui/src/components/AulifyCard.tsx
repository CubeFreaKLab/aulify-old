import { forwardRef, type HTMLAttributes } from "react";
import { classNames } from "../lib/classNames";

export type AulifyCardVariant = "default" | "interactive";

export type AulifyCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AulifyCardVariant;
};

const variantClasses: Record<AulifyCardVariant, string> = {
  default: "border-[#ECECE7] bg-[#FFFFFF]",
  interactive: "border-[#ECECE7] bg-[#FFFFFF] transition-shadow duration-base hover:shadow-card"
};

export const AulifyCard = forwardRef<HTMLDivElement, AulifyCardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={classNames("rounded-lg border p-6 shadow-soft", variantClasses[variant], className)}
      {...props}
    />
  )
);

AulifyCard.displayName = "AulifyCard";
