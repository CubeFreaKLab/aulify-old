import { createStoredTeacherNote, readStoredTeacherNotes, saveStoredTeacherNote, type StoredNoteInput, type StoredNoteUpdateInput } from "../noteStorage";
import {
  findNoteById,
  getCourseNotes,
  getRenderableDocumentBlocks,
  getRenderableNoteBlocks,
  getPublishedNotes,
  hasMeaningfulNoteBlocks,
  mockNotes,
  type Note,
  type NoteBlock,
  type NoteBlockType,
  type NoteChecklistItem,
  type NoteStatus
} from "../mock/notes";

export type { Note, NoteBlock, NoteBlockType, NoteChecklistItem, NoteStatus, StoredNoteInput, StoredNoteUpdateInput };

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

export function updateNote(input: StoredNoteUpdateInput) {
  return saveStoredTeacherNote(input);
}

export { getRenderableDocumentBlocks, getRenderableNoteBlocks, hasMeaningfulNoteBlocks };
