type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-2 rounded-full bg-neutral-offWhite" aria-hidden="true">
      <div className="h-2 rounded-full bg-brand-green" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
