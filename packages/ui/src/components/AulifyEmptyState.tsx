import { type ReactNode } from "react";
import { classNames } from "../lib/classNames";

export type AulifyEmptyStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  illustration?: ReactNode;
  className?: string;
};

export function AulifyEmptyState({ action, className, description, illustration, title }: AulifyEmptyStateProps) {
  return (
    <div
      className={classNames(
        "grid justify-items-center rounded-lg border border-[#ECECE7] bg-[#FFFFFF] px-6 py-10 text-center shadow-soft",
        className
      )}
    >
      {illustration ? <div className="mb-5 text-[#049A4E]">{illustration}</div> : null}
      <h2 className="m-0 text-xl font-semibold text-[#0F0F0F]">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-[#60615A]">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
