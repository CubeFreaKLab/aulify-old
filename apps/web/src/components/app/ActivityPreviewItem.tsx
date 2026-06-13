type ActivityPreviewItemProps = {
  detail: string;
  label: string;
  title: string;
};

export function ActivityPreviewItem({ detail, label, title }: ActivityPreviewItemProps) {
  return (
    <article className="flex items-start gap-4 rounded-3xl border border-neutral-lightGray bg-neutral-white p-4">
      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand-green" aria-hidden="true" />
      <div>
        <p className="m-0 text-sm font-semibold text-brand-green">{label}</p>
        <h3 className="m-0 mt-1 text-base font-bold text-neutral-black">{title}</h3>
        <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">{detail}</p>
      </div>
    </article>
  );
}
