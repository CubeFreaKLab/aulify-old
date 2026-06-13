type TaskPreviewItemProps = {
  course: string;
  due: string;
  title: string;
};

export function TaskPreviewItem({ course, due, title }: TaskPreviewItemProps) {
  return (
    <article className="flex items-start justify-between gap-4 rounded-3xl border border-neutral-lightGray bg-neutral-white p-4">
      <div>
        <h3 className="m-0 text-base font-bold text-neutral-black">{title}</h3>
        <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">{course}</p>
      </div>
      <span className="shrink-0 rounded-full bg-neutral-offWhite px-3 py-1 text-sm font-semibold text-neutral-black">{due}</span>
    </article>
  );
}
