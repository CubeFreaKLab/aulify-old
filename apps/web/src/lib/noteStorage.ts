import type { Note, NoteStatus } from "./mock/notes";

const storedNotesKey = "aulify.teacherNotes";

export type StoredNoteInput = {
  content: string;
  courseId: string;
  status: NoteStatus;
  summary: string;
  title: string;
};

function createNoteId(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "nota"}-${Date.now()}`;
}

export function readStoredTeacherNotes(): Note[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(storedNotesKey);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Note[];
  } catch {
    return [];
  }
}

export function createStoredTeacherNote(input: StoredNoteInput) {
  const now = new Date().toISOString();
  const note: Note = {
    id: createNoteId(input.title),
    courseId: input.courseId,
    title: input.title.trim(),
    summary: input.summary.trim(),
    content: input.content.trim(),
    status: input.status,
    createdAt: now,
    updatedAt: now
  };

  const nextNotes = [note, ...readStoredTeacherNotes()];
  window.localStorage.setItem(storedNotesKey, JSON.stringify(nextNotes));

  return note;
}
