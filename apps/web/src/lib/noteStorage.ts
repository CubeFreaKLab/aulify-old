import type { Note, NoteBlock, NoteStatus } from "./mock/notes";

const storedNotesKey = "aulify.teacherNotes";

export type StoredNoteInput = {
  blocks?: NoteBlock[];
  content?: string;
  courseId: string;
  future?: Note["future"];
  status: NoteStatus;
  summary: string;
  title: string;
};

export type StoredNoteUpdateInput = StoredNoteInput & {
  id: string;
  createdAt: string;
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
    content: input.content?.trim(),
    blocks: input.blocks,
    future: input.future,
    status: input.status,
    createdAt: now,
    updatedAt: now
  };

  const nextNotes = [note, ...readStoredTeacherNotes()];
  window.localStorage.setItem(storedNotesKey, JSON.stringify(nextNotes));

  return note;
}

export function saveStoredTeacherNote(input: StoredNoteUpdateInput) {
  const note: Note = {
    id: input.id,
    courseId: input.courseId,
    title: input.title.trim(),
    summary: input.summary.trim(),
    content: input.content?.trim(),
    blocks: input.blocks,
    future: input.future,
    status: input.status,
    createdAt: input.createdAt,
    updatedAt: new Date().toISOString()
  };

  const nextNotes = [note, ...readStoredTeacherNotes().filter((storedNote) => storedNote.id !== input.id)];
  window.localStorage.setItem(storedNotesKey, JSON.stringify(nextNotes));

  return note;
}
