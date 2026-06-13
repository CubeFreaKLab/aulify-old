import type { Note } from "../../lib/mock/notes";
import { NoteCard } from "./NoteCard";

type NotesListProps = {
  actionLabel: string;
  emptyLabel: string;
  getCourseName: (courseId: string) => string;
  getHref: (note: Note) => string;
  notes: Note[];
  showStatus?: boolean;
};

export function NotesList({ actionLabel, emptyLabel, getCourseName, getHref, notes, showStatus }: NotesListProps) {
  if (!notes.length) {
    return (
      <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
        <p className="m-0 text-base font-medium text-neutral-darkGray">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          actionLabel={actionLabel}
          courseName={getCourseName(note.courseId)}
          href={getHref(note)}
          key={`${note.courseId}-${note.id}`}
          note={note}
          showStatus={showStatus}
        />
      ))}
    </section>
  );
}
