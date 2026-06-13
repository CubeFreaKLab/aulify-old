type ProgressSummaryCardProps = {
  helper?: string;
  label: string;
  value: string;
};

export function ProgressSummaryCard({ helper, label, value }: ProgressSummaryCardProps) {
  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <p className="m-0 text-sm font-semibold text-neutral-darkGray">{label}</p>
      <p className="m-0 mt-3 text-3xl font-extrabold leading-none text-neutral-black">{value}</p>
      {helper ? <p className="m-0 mt-3 text-sm font-medium text-brand-green">{helper}</p> : null}
    </article>
  );
}
