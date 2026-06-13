import { createStoredTeacherNote, readStoredTeacherNotes, type StoredNoteInput } from "../noteStorage";
import {
  findNoteById,
  getCourseNotes,
  getPublishedNotes,
  mockNotes,
  type Note,
  type NoteStatus
} from "../mock/notes";

export type { Note, NoteStatus, StoredNoteInput };

type NoteQueryOptions = {
  publishedOnly?: boolean;
};

function filterNotes(notes: Note[], options?: NoteQueryOptions) {
  return options?.publishedOnly ? getPublishedNotes(notes) : notes;
}

export function getNotes(options?: NoteQueryOptions) {
  return filterNotes([...readStoredTeacherNotes(), ...mockNotes], options);
}

export function getInitialNotes(options?: NoteQueryOptions) {
  return filterNotes(mockNotes, options);
}

export function getNotesByCourseId(courseId: string, options?: NoteQueryOptions) {
  return getCourseNotes(courseId, getNotes(options));
}

export function getInitialNotesByCourseId(courseId: string, options?: NoteQueryOptions) {
  return getCourseNotes(courseId, getInitialNotes(options));
}

export function getNoteById(courseId: string, noteId: string, options?: NoteQueryOptions) {
  return findNoteById(courseId, noteId, getNotes(options));
}

export function getInitialNoteById(courseId: string, noteId: string, options?: NoteQueryOptions) {
  return findNoteById(courseId, noteId, getInitialNotes(options));
}

export function createNote(input: StoredNoteInput) {
  return createStoredTeacherNote(input);
}
