"use client";

import type { PartialBlock } from "@blocknote/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useState } from "react";
import { AulifyDocumentEditor } from "./AulifyDocumentEditor";
import {
  createNoteExcerptFromBlocks,
  createNote,
  getRenderableDocumentBlocks,
  getRenderableNoteBlocks,
  hasMeaningfulDocumentBlocks,
  serializeDocumentBlocks,
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
  title: string;
};

const statusOptions: Array<{ label: string; value: NoteStatus }> = [
  { label: "Borrador", value: "draft" },
  { label: "Publicado", value: "published" }
];

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
  const [documentBlocks, setDocumentBlocks] = useState<PartialBlock[]>(() => createInitialDocumentBlocks(note));
  const [status, setStatus] = useState<NoteStatus>(note?.status ?? "draft");
  const [errors, setErrors] = useState<NoteFormErrors>({ content: "", title: "" });
  const legacyBlocks = createLegacyBlocks(note);

  function validateForm() {
    return {
      title: title.trim() ? "" : "Ingresa el título de la nota.",
      content: hasMeaningfulDocumentBlocks(documentBlocks) ? "" : "Ingresa el contenido de la nota."
    };
  }

  const handleDocumentChange = useCallback(
    (nextBlocks: PartialBlock[]) => {
      setDocumentBlocks(nextBlocks);

      if (errors.content) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          content: hasMeaningfulDocumentBlocks(nextBlocks) ? "" : currentErrors.content
        }));
      }
    },
    [errors.content]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.title || nextErrors.content) {
      return;
    }

    const content = serializeDocumentBlocks(documentBlocks) || serializeLegacyBlocksToContent(legacyBlocks);
    const summary = createNoteExcerptFromBlocks(documentBlocks, note?.summary ?? content);
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
      <section className="rounded-[32px] bg-neutral-white px-5 py-6 sm:px-8 lg:px-10">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="m-0 text-sm font-bold text-brand-green">Documento de clase</p>
            <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">Escribe el contenido como un documento. Usa / para insertar títulos, listas, checklist, citas y enlaces.</p>
          </div>
          <div className="inline-grid w-fit shrink-0 grid-cols-2 rounded-full border border-neutral-lightGray bg-neutral-white p-1">
            {statusOptions.map((option) => {
              const isSelected = option.value === status;

              return (
                <button
                  type="button"
                  className={[
                    "min-h-10 whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                    isSelected
                      ? "border-brand-green bg-brand-green text-neutral-white"
                      : "border-transparent bg-neutral-white text-neutral-black hover:bg-neutral-offWhite"
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
          className="aulify-note-title-input w-full border-0 bg-transparent p-0 text-4xl font-extrabold leading-tight text-neutral-black outline-none placeholder:text-neutral-darkGray focus:ring-0 sm:text-5xl"
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

        <div className={["mt-4 bg-neutral-white", errors.content ? "rounded-3xl outline outline-2 outline-[#E5484D]" : ""].join(" ")}>
          <AulifyDocumentEditor initialBlocks={documentBlocks} onChange={handleDocumentChange} />
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
