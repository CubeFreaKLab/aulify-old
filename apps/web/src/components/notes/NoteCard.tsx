import Link from "next/link";
import { formatNoteDate, noteStatusLabels, type Note } from "../../lib/mock/notes";
import { getNoteExcerpt } from "../../lib/repositories/noteRepository";

type NoteCardProps = {
  actionLabel: string;
  courseName: string;
  href: string;
  note: Note;
  showStatus?: boolean;
};

export function NoteCard({ actionLabel, courseName, href, note, showStatus = true }: NoteCardProps) {
  const statusClassName =
    note.status === "published"
      ? "border-brand-green bg-brand-greenLight text-neutral-black"
      : "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";

  return (
    <article className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="m-0 text-sm font-semibold text-brand-green">{courseName}</p>
          {showStatus ? (
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClassName}`}>
              {noteStatusLabels[note.status]}
            </span>
          ) : null}
        </div>
        <h2 className="m-0 mt-2 text-2xl font-extrabold leading-tight text-neutral-black">{note.title}</h2>
        <p className="m-0 mt-2 text-sm font-medium leading-6 text-neutral-darkGray">{getNoteExcerpt(note)}</p>
      </div>

      <p className="m-0 text-sm font-semibold text-neutral-darkGray">Actualizado {formatNoteDate(note.updatedAt)}</p>

      <Link
        href={href}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
      >
        {actionLabel}
      </Link>
    </article>
  );
}
