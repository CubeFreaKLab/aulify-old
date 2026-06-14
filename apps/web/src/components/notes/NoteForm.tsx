"use client";

import type { PartialBlock } from "@blocknote/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useState } from "react";
import { NoteDocumentEditor } from "./NoteDocumentEditor";
import {
  createNote,
  getRenderableDocumentBlocks,
  getRenderableNoteBlocks,
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

function getInlineText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (item && typeof item === "object" && "text" in item && typeof item.text === "string") {
        return item.text;
      }

      return "";
    })
    .join("");
}

function serializeDocumentToContent(blocks: PartialBlock[]) {
  return blocks
    .map((block) => getInlineText(block.content))
    .filter((value) => value.trim())
    .join("\n\n");
}

function hasMeaningfulDocument(blocks: PartialBlock[]) {
  return blocks.some((block) => getInlineText(block.content).trim() || block.type === "divider" || block.type === "table");
}

function createInitialDocumentBlocks(note?: Note): PartialBlock[] {
  const documentBlocks = note ? getRenderableDocumentBlocks(note) : [];

  return documentBlocks.length ? documentBlocks : [{ content: "", type: "paragraph" }];
}

function serializeLegacyBlocksToContent(blocks: NoteBlock[]) {
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

function createLegacyBlocks(note?: Note) {
  const noteBlocks = note ? getRenderableNoteBlocks(note) : [];
  return noteBlocks.length ? noteBlocks : [];
}

export function NoteForm({ courseId, note }: NoteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title ?? "");
  const [summary, setSummary] = useState(note?.summary ?? "");
  const [documentBlocks, setDocumentBlocks] = useState<PartialBlock[]>(() => createInitialDocumentBlocks(note));
  const [status, setStatus] = useState<NoteStatus>(note?.status ?? "draft");
  const [errors, setErrors] = useState<NoteFormErrors>({ content: "", summary: "", title: "" });
  const legacyBlocks = createLegacyBlocks(note);

  function validateForm() {
    return {
      title: title.trim() ? "" : "Ingresa el título de la nota.",
      summary: summary.trim() ? "" : "Ingresa un resumen breve.",
      content: hasMeaningfulDocument(documentBlocks) ? "" : "Ingresa el contenido de la nota."
    };
  }

  const handleDocumentChange = useCallback(
    (nextBlocks: PartialBlock[]) => {
      setDocumentBlocks(nextBlocks);

      if (errors.content) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          content: hasMeaningfulDocument(nextBlocks) ? "" : currentErrors.content
        }));
      }
    },
    [errors.content]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.title || nextErrors.summary || nextErrors.content) {
      return;
    }

    const content = serializeDocumentToContent(documentBlocks) || serializeLegacyBlocksToContent(legacyBlocks);
    const savedNote = note
      ? updateNote({
          id: note.id,
          createdAt: note.createdAt,
          blocks: legacyBlocks.length ? legacyBlocks : note.blocks,
          content,
          courseId,
          documentBlocks,
          future: note.future,
          status,
          summary,
          title
        })
      : createNote({ content, courseId, documentBlocks, status, summary, title });

    router.push(`/teacher/courses/${courseId}/notes/${savedNote.id}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6">
      <section className="rounded-[32px] border border-neutral-lightGray bg-neutral-white px-5 py-6 sm:px-8 lg:px-10">
        <div className="mb-5 flex flex-col gap-4 border-b border-neutral-lightGray pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="m-0 text-sm font-bold text-brand-green">Documento de clase</p>
            <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">Usa / dentro del editor para insertar títulos, listas, checklist, citas y enlaces.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isSelected = option.value === status;

              return (
                <button
                  type="button"
                  className={[
                    "min-h-10 rounded-full border px-4 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
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

        <label className="sr-only" htmlFor="note-title">
          Título de la nota
        </label>
        <input
          id="note-title"
          className="w-full border-0 bg-transparent p-0 text-4xl font-extrabold leading-tight text-neutral-black outline-none placeholder:text-neutral-darkGray focus:ring-0 sm:text-5xl"
          placeholder="Título de la nota"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) {
              setErrors((currentErrors) => ({ ...currentErrors, title: event.target.value.trim() ? "" : currentErrors.title }));
            }
          }}
        />
        {errors.title ? <span className="mt-2 block text-sm font-semibold text-[#E5484D]">{errors.title}</span> : null}

        <label className="sr-only" htmlFor="note-summary">
          Resumen breve
        </label>
        <textarea
          id="note-summary"
          className="mt-4 min-h-20 w-full resize-none border-0 bg-transparent p-0 text-lg font-medium leading-8 text-neutral-darkGray outline-none placeholder:text-neutral-darkGray focus:ring-0"
          placeholder="Agrega una descripción breve para orientar a tus estudiantes."
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
            if (errors.summary) {
              setErrors((currentErrors) => ({ ...currentErrors, summary: event.target.value.trim() ? "" : currentErrors.summary }));
            }
          }}
        />
        {errors.summary ? <span className="mt-2 block text-sm font-semibold text-[#E5484D]">{errors.summary}</span> : null}

        <div className={["mt-6 rounded-[28px] border bg-neutral-white", errors.content ? "border-[#E5484D]" : "border-neutral-lightGray"].join(" ")}>
          <NoteDocumentEditor initialBlocks={documentBlocks} onChange={handleDocumentChange} />
        </div>
        {errors.content ? <span className="mt-2 block text-sm font-semibold text-[#E5484D]">{errors.content}</span> : null}
      </section>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-full border border-neutral-lightGray bg-neutral-white/95 p-2 shadow-card backdrop-blur sm:flex-row sm:justify-end">
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
