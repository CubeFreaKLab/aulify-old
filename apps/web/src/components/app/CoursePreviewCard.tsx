type CoursePreviewCardProps = {
  description: string;
  meta: string;
  progressLabel: string;
  title: string;
};

export function CoursePreviewCard({ description, meta, progressLabel, title }: CoursePreviewCardProps) {
  return (
    <article className="grid gap-4 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div>
        <p className="m-0 text-sm font-semibold text-brand-green">{meta}</p>
        <h3 className="m-0 mt-2 text-xl font-bold text-neutral-black">{title}</h3>
        <p className="m-0 mt-2 text-sm font-medium leading-6 text-neutral-darkGray">{description}</p>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-offWhite px-4 py-3">
        <span className="text-sm font-semibold text-neutral-black">Progreso</span>
        <span className="text-sm font-bold text-brand-green">{progressLabel}</span>
      </div>
    </article>
  );
}
