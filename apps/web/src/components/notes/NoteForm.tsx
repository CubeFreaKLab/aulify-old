"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { createEmptyBlock, NoteBlockEditor } from "./NoteBlockEditor";
import {
  createNote,
  getRenderableNoteBlocks,
  hasMeaningfulNoteBlocks,
  updateNote,
  type Note,
  type NoteBlock,
  type NoteStatus
} from "../../lib/repositories/noteRepository";

type NoteFormProps = {
  courseId: string;
  note?: Note;
};

type NoteFormErrors = {
  content: string;
  summary: string;
  title: string;
};

const statusOptions: Array<{ label: string; value: NoteStatus }> = [
  { label: "Borrador", value: "draft" },
  { label: "Publicado", value: "published" }
];

function serializeBlocksToContent(blocks: NoteBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "divider") {
        return "";
      }

      if (block.type === "resource_link") {
        return [block.label, block.url].filter(Boolean).join(" ");
      }

      if (block.items?.length) {
        return block.items.map((item) => (typeof item === "string" ? item : item.text)).join("\n");
      }

      return block.text ?? "";
    })
    .filter((value) => value.trim())
    .join("\n\n");
}

function createInitialBlocks(note?: Note) {
  const noteBlocks = note ? getRenderableNoteBlocks(note) : [];
  return noteBlocks.length ? noteBlocks : [createEmptyBlock("paragraph")];
}

export function NoteForm({ courseId, note }: NoteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title ?? "");
  const [summary, setSummary] = useState(note?.summary ?? "");
  const [blocks, setBlocks] = useState<NoteBlock[]>(() => createInitialBlocks(note));
  const [status, setStatus] = useState<NoteStatus>(note?.status ?? "draft");
  const [errors, setErrors] = useState<NoteFormErrors>({ content: "", summary: "", title: "" });

  function validateForm() {
    return {
      title: title.trim() ? "" : "Ingresa el título de la nota.",
      summary: summary.trim() ? "" : "Ingresa un resumen breve.",
      content: hasMeaningfulNoteBlocks(blocks) ? "" : "Ingresa el contenido de la nota."
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.title || nextErrors.summary || nextErrors.content) {
      return;
    }

    const content = serializeBlocksToContent(blocks);
    const savedNote = note
      ? updateNote({
          id: note.id,
          createdAt: note.createdAt,
          blocks,
          content,
          courseId,
          future: note.future,
          status,
          summary,
          title
        })
      : createNote({ blocks, content, courseId, status, summary, title });

    router.push(`/teacher/courses/${courseId}/notes/${savedNote.id}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Título de la nota *
        <input
          className={[
            "h-14 rounded-2xl border bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.title ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) {
              setErrors((currentErrors) => ({ ...currentErrors, title: event.target.value.trim() ? "" : currentErrors.title }));
            }
          }}
        />
        {errors.title ? <span className="text-sm font-semibold text-[#E5484D]">{errors.title}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Resumen breve *
        <textarea
          className={[
            "min-h-24 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.summary ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
            if (errors.summary) {
              setErrors((currentErrors) => ({ ...currentErrors, summary: event.target.value.trim() ? "" : currentErrors.summary }));
            }
          }}
        />
        {errors.summary ? <span className="text-sm font-semibold text-[#E5484D]">{errors.summary}</span> : null}
      </label>

      <div className="grid gap-2 text-sm font-bold text-neutral-black">
        <p className="m-0">Editor de nota *</p>
        <div className={["rounded-3xl border p-4", errors.content ? "border-[#E5484D]" : "border-neutral-lightGray"].join(" ")}>
          <NoteBlockEditor
            blocks={blocks}
            onChange={(nextBlocks) => {
              setBlocks(nextBlocks);
              if (errors.content) {
                setErrors((currentErrors) => ({
                  ...currentErrors,
                  content: hasMeaningfulNoteBlocks(nextBlocks) ? "" : currentErrors.content
                }));
              }
            }}
          />
        </div>
        {errors.content ? <span className="text-sm font-semibold text-[#E5484D]">{errors.content}</span> : null}
      </div>

      <div className="grid gap-2">
        <p className="m-0 text-sm font-bold text-neutral-black">Estado</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const isSelected = option.value === status;

            return (
              <button
                type="button"
                className={[
                  "min-h-11 rounded-full border px-5 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                  isSelected
                    ? "border-brand-green bg-brand-green text-neutral-white"
                    : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
                ].join(" ")}
                key={option.value}
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Guardar nota
        </button>
      </div>
    </form>
  );
}
