import type { ReactNode } from "react";
import { NoteDocumentViewer } from "./NoteDocumentViewer";
import { formatNoteDate, noteStatusLabels } from "../../lib/mock/notes";
import { getRenderableDocumentBlocks, type Note } from "../../lib/repositories/noteRepository";

type NoteDetailProps = {
  courseName: string;
  note: Note;
  teacherActions?: ReactNode;
};

export function NoteDetail({ courseName, note, teacherActions }: NoteDetailProps) {
  const statusClassName =
    note.status === "published"
      ? "border-brand-green bg-brand-greenLight text-neutral-black"
      : "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";

  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-neutral-lightGray pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="m-0 text-sm font-semibold text-brand-green">{courseName}</p>
          <h2 className="m-0 mt-2 text-3xl font-extrabold leading-tight text-neutral-black">{note.title}</h2>
          <p className="m-0 mt-3 max-w-3xl text-base font-medium leading-7 text-neutral-darkGray">{note.summary}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClassName}`}>{noteStatusLabels[note.status]}</span>
          {teacherActions}
        </div>
      </div>

      <div className="pt-6">
        <p className="m-0 text-sm font-semibold text-neutral-darkGray">Actualizado {formatNoteDate(note.updatedAt)}</p>
        <NoteDocumentViewer key={`${note.id}-${note.updatedAt}`} blocks={getRenderableDocumentBlocks(note)} />
      </div>
    </article>
  );
}
