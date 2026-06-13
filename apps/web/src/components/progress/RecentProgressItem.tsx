import { formatProgressDate, type ProgressFeedItem } from "../../lib/progress";

type RecentProgressItemProps = {
  item: ProgressFeedItem;
};

export function RecentProgressItem({ item }: RecentProgressItemProps) {
  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="m-0 text-sm font-semibold text-brand-green">{item.label}</p>
          <h3 className="m-0 mt-1 text-base font-bold leading-tight text-neutral-black">{item.title}</h3>
          <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">{item.detail}</p>
        </div>
        <p className="m-0 text-sm font-semibold text-neutral-darkGray">{formatProgressDate(item.submittedAt)}</p>
      </div>
    </article>
  );
}
