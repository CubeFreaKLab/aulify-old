import { forwardRef, type HTMLAttributes } from "react";
import { classNames } from "../lib/classNames";

export type AulifyContainerProps = HTMLAttributes<HTMLDivElement>;

export const AulifyContainer = forwardRef<HTMLDivElement, AulifyContainerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />
  )
);

AulifyContainer.displayName = "AulifyContainer";
