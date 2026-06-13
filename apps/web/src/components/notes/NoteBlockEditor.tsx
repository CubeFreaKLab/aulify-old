"use client";

import type { NoteBlock, NoteBlockType, NoteChecklistItem } from "../../lib/repositories/noteRepository";

type NoteBlockEditorProps = {
  blocks: NoteBlock[];
  onChange: (blocks: NoteBlock[]) => void;
};

const blockTypes: Array<{ label: string; value: NoteBlockType }> = [
  { label: "Título", value: "heading" },
  { label: "Párrafo", value: "paragraph" },
  { label: "Lista", value: "bullet_list" },
  { label: "Checklist", value: "checklist" },
  { label: "Cita", value: "quote" },
  { label: "Recurso", value: "resource_link" },
  { label: "Separador", value: "divider" }
];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export function createEmptyBlock(type: NoteBlockType = "paragraph"): NoteBlock {
  if (type === "bullet_list") {
    return { id: createId("block"), type, items: [""] };
  }

  if (type === "checklist") {
    return { id: createId("block"), type, items: [{ checked: false, id: createId("item"), text: "" }] };
  }

  if (type === "resource_link") {
    return { id: createId("block"), type, label: "", url: "" };
  }

  if (type === "divider") {
    return { id: createId("block"), type };
  }

  return { id: createId("block"), type, text: "" };
}

function getStringItems(block: NoteBlock) {
  return (block.items ?? []).filter((item): item is string => typeof item === "string");
}

function getChecklistItems(block: NoteBlock) {
  return (block.items ?? []).filter((item): item is NoteChecklistItem => typeof item !== "string");
}

function createBlockForType(previousBlock: NoteBlock, type: NoteBlockType): NoteBlock {
  const nextBlock = createEmptyBlock(type);

  if (type === "paragraph" || type === "heading" || type === "quote") {
    return { ...nextBlock, text: previousBlock.text ?? "" };
  }

  if (type === "resource_link") {
    return { ...nextBlock, label: previousBlock.label ?? previousBlock.text ?? "", url: previousBlock.url ?? "" };
  }

  return nextBlock;
}

export function NoteBlockEditor({ blocks, onChange }: NoteBlockEditorProps) {
  function updateBlock(blockId: string, nextBlock: NoteBlock) {
    onChange(blocks.map((block) => (block.id === blockId ? nextBlock : block)));
  }

  function addBlock(type: NoteBlockType = "paragraph") {
    onChange([...blocks, createEmptyBlock(type)]);
  }

  function removeBlock(blockId: string) {
    const nextBlocks = blocks.filter((block) => block.id !== blockId);
    onChange(nextBlocks.length ? nextBlocks : [createEmptyBlock()]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {blockTypes.map((blockType) => (
          <button
            type="button"
            className="min-h-10 rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            key={blockType.value}
            onClick={() => addBlock(blockType.value)}
          >
            Agregar {blockType.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {blocks.map((block, index) => (
          <article className="grid gap-3 rounded-3xl border border-neutral-lightGray bg-neutral-offWhite p-4" key={block.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-neutral-darkGray">Bloque {index + 1}</span>
                <select
                  className="h-10 rounded-full border border-neutral-lightGray bg-neutral-white px-3 text-sm font-bold text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-2 focus:ring-[rgba(4,154,78,0.12)]"
                  value={block.type}
                  onChange={(event) => updateBlock(block.id, createBlockForType(block, event.target.value as NoteBlockType))}
                >
                  {blockTypes.map((blockType) => (
                    <option key={blockType.value} value={blockType.value}>
                      {blockType.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="w-fit rounded-full border border-neutral-lightGray bg-neutral-white px-4 py-2 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
                onClick={() => removeBlock(block.id)}
              >
                Eliminar
              </button>
            </div>

            {block.type === "paragraph" || block.type === "heading" || block.type === "quote" ? (
              <textarea
                className="min-h-24 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
                value={block.text ?? ""}
                onChange={(event) => updateBlock(block.id, { ...block, text: event.target.value })}
              />
            ) : null}

            {block.type === "bullet_list" ? (
              <div className="grid gap-2">
                {getStringItems(block).map((item, itemIndex) => (
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]" key={`${block.id}-item-${itemIndex}`}>
                    <input
                      className="h-12 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
                      value={item}
                      onChange={(event) => {
                        const nextItems = getStringItems(block);
                        nextItems[itemIndex] = event.target.value;
                        updateBlock(block.id, { ...block, items: nextItems });
                      }}
                    />
                    <button
                      type="button"
                      className="rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-sm font-bold text-neutral-black hover:border-brand-green hover:text-brand-green"
                      onClick={() => updateBlock(block.id, { ...block, items: getStringItems(block).filter((_, currentIndex) => currentIndex !== itemIndex) })}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-fit rounded-full border border-neutral-lightGray bg-neutral-white px-4 py-2 text-sm font-bold text-neutral-black hover:border-brand-green hover:text-brand-green"
                  onClick={() => updateBlock(block.id, { ...block, items: [...getStringItems(block), ""] })}
                >
                  Agregar ítem
                </button>
              </div>
            ) : null}

            {block.type === "checklist" ? (
              <div className="grid gap-2">
                {getChecklistItems(block).map((item) => (
                  <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto]" key={item.id}>
                    <input
                      aria-label="Marcar ítem"
                      checked={item.checked}
                      className="mt-4 h-4 w-4 accent-brand-green"
                      type="checkbox"
                      onChange={(event) =>
                        updateBlock(block.id, {
                          ...block,
                          items: getChecklistItems(block).map((currentItem) =>
                            currentItem.id === item.id ? { ...currentItem, checked: event.target.checked } : currentItem
                          )
                        })
                      }
                    />
                    <input
                      className="h-12 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
                      value={item.text}
                      onChange={(event) =>
                        updateBlock(block.id, {
                          ...block,
                          items: getChecklistItems(block).map((currentItem) =>
                            currentItem.id === item.id ? { ...currentItem, text: event.target.value } : currentItem
                          )
                        })
                      }
                    />
                    <button
                      type="button"
                      className="rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-sm font-bold text-neutral-black hover:border-brand-green hover:text-brand-green"
                      onClick={() => updateBlock(block.id, { ...block, items: getChecklistItems(block).filter((currentItem) => currentItem.id !== item.id) })}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-fit rounded-full border border-neutral-lightGray bg-neutral-white px-4 py-2 text-sm font-bold text-neutral-black hover:border-brand-green hover:text-brand-green"
                  onClick={() => updateBlock(block.id, { ...block, items: [...getChecklistItems(block), { checked: false, id: createId("item"), text: "" }] })}
                >
                  Agregar ítem
                </button>
              </div>
            ) : null}

            {block.type === "resource_link" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="h-12 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
                  placeholder="Etiqueta del recurso"
                  value={block.label ?? ""}
                  onChange={(event) => updateBlock(block.id, { ...block, label: event.target.value })}
                />
                <input
                  className="h-12 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
                  placeholder="https://"
                  value={block.url ?? ""}
                  onChange={(event) => updateBlock(block.id, { ...block, url: event.target.value })}
                />
              </div>
            ) : null}

            {block.type === "divider" ? (
              <div className="rounded-2xl border border-dashed border-neutral-lightGray bg-neutral-white px-4 py-5 text-sm font-bold text-neutral-darkGray">
                Separador visual
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
