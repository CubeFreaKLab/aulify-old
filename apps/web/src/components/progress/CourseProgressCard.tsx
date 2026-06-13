import { ProgressBar } from "./ProgressBar";

type CourseProgressCardProps = {
  detailItems: string[];
  href?: string;
  progress: number;
  title: string;
};

export function CourseProgressCard({ detailItems, progress, title }: CourseProgressCardProps) {
  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="m-0 text-xl font-extrabold leading-tight text-neutral-black">{title}</h3>
          <p className="m-0 mt-2 text-sm font-semibold text-neutral-darkGray">{detailItems.join(" · ")}</p>
        </div>
        <span className="shrink-0 text-lg font-extrabold text-brand-green">{progress}%</span>
      </div>
      <div className="mt-4">
        <ProgressBar value={progress} />
      </div>
    </article>
  );
}
