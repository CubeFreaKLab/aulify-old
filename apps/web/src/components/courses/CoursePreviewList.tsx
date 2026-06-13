import type { CoursePreviewItem } from "../../lib/mock/courses";

type CoursePreviewListProps = {
  emptyLabel: string;
  items: CoursePreviewItem[];
  title: string;
};

export function CoursePreviewList({ emptyLabel, items, title }: CoursePreviewListProps) {
  return (
    <section className="grid gap-4 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <h2 className="m-0 text-xl font-extrabold text-neutral-black">{title}</h2>
      <div className="grid gap-3">
        {items.length ? (
          items.map((item) => (
            <article className="rounded-2xl bg-neutral-offWhite px-4 py-3" key={`${title}-${item.title}`}>
              <h3 className="m-0 text-base font-bold text-neutral-black">{item.title}</h3>
              <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">{item.detail}</p>
            </article>
          ))
        ) : (
          <p className="m-0 rounded-2xl bg-neutral-offWhite px-4 py-3 text-sm font-medium text-neutral-darkGray">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}
