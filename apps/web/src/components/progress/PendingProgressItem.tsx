import Link from "next/link";
import type { PendingProgressItem as PendingProgressItemType } from "../../lib/progress";

type PendingProgressItemProps = {
  item: PendingProgressItemType;
};

export function PendingProgressItem({ item }: PendingProgressItemProps) {
  return (
    <Link
      href={item.href}
      className="block rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 transition-colors duration-base hover:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
    >
      <p className="m-0 text-sm font-semibold text-brand-green">{item.label}</p>
      <h3 className="m-0 mt-1 text-base font-bold leading-tight text-neutral-black">{item.title}</h3>
      <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">{item.detail}</p>
    </Link>
  );
}
