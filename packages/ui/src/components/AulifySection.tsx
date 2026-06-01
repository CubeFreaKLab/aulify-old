import { forwardRef, type HTMLAttributes } from "react";
import { classNames } from "../lib/classNames";

export type AulifySectionProps = HTMLAttributes<HTMLElement>;

export const AulifySection = forwardRef<HTMLElement, AulifySectionProps>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={classNames("py-12 sm:py-16 lg:py-20", className)} {...props} />
  )
);

AulifySection.displayName = "AulifySection";
