import type { NoteBlock, NoteChecklistItem } from "../../lib/repositories/noteRepository";

type NoteBlocksRendererProps = {
  blocks: NoteBlock[];
};

function getStringItems(block: NoteBlock) {
  return (block.items ?? []).filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function getChecklistItems(block: NoteBlock) {
  return (block.items ?? []).filter((item): item is NoteChecklistItem => typeof item !== "string" && item.text.trim().length > 0);
}

export function NoteBlocksRenderer({ blocks }: NoteBlocksRendererProps) {
  return (
    <div className="mt-5 grid max-w-4xl gap-5">
      {blocks.map((block) => {
        if (block.type === "heading") {
          if (!block.text?.trim()) {
            return null;
          }

          return (
            <h3 className="m-0 text-2xl font-extrabold leading-tight text-neutral-black" key={block.id}>
              {block.text}
            </h3>
          );
        }

        if (block.type === "paragraph") {
          if (!block.text?.trim()) {
            return null;
          }

          return (
            <p className="m-0 whitespace-pre-line text-base font-medium leading-8 text-neutral-black" key={block.id}>
              {block.text}
            </p>
          );
        }

        if (block.type === "quote") {
          if (!block.text?.trim()) {
            return null;
          }

          return (
            <blockquote className="m-0 rounded-3xl border-l-4 border-brand-green bg-neutral-offWhite px-5 py-4 text-base font-semibold leading-8 text-neutral-black" key={block.id}>
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "bullet_list") {
          const items = getStringItems(block);

          if (!items.length) {
            return null;
          }

          return (
            <ul className="m-0 grid gap-2 pl-6 text-base font-medium leading-7 text-neutral-black" key={block.id}>
              {items.map((item, index) => (
                <li key={`${block.id}-${index}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "checklist") {
          const items = getChecklistItems(block);

          if (!items.length) {
            return null;
          }

          return (
            <ul className="m-0 grid list-none gap-2 p-0" key={block.id}>
              {items.map((item) => (
                <li className="flex gap-3 rounded-2xl bg-neutral-offWhite px-4 py-3 text-base font-medium text-neutral-black" key={item.id}>
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-brand-green text-xs font-bold text-brand-green">
                    {item.checked ? "✓" : ""}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "resource_link") {
          if (!block.label?.trim() && !block.url?.trim()) {
            return null;
          }

          return (
            <a
              className="block rounded-3xl border border-neutral-lightGray bg-neutral-offWhite px-5 py-4 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
              href={block.url || "#"}
              key={block.id}
              rel="noreferrer"
              target="_blank"
            >
              {block.label || block.url || "Recurso"}
            </a>
          );
        }

        return <hr className="my-2 border-neutral-lightGray" key={block.id} />;
      })}
    </div>
  );
}
