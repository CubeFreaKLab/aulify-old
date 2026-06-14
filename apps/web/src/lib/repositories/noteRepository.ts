import { createStoredTeacherNote, readStoredTeacherNotes, saveStoredTeacherNote, type StoredNoteInput, type StoredNoteUpdateInput } from "../noteStorage";
import { isFirebaseDataSource } from "../config/dataSource";
import { noteFirebaseAdapter } from "../firebase/adapters/noteFirebaseAdapter";
import { courseFirebaseAdapter } from "../firebase/adapters/courseFirebaseAdapter";
import { courseMemberFirebaseAdapter } from "../firebase/adapters/courseMemberFirebaseAdapter";
import {
  findNoteById,
  createNoteExcerptFromBlocks,
  getCourseNotes,
  getNoteExcerpt,
  getRenderableDocumentBlocks,
  getRenderableNoteBlocks,
  getPublishedNotes,
  hasMeaningfulDocumentBlocks,
  hasMeaningfulNoteBlocks,
  mockNotes,
  serializeDocumentBlocks,
  type Note,
  type NoteBlock,
  type NoteBlockType,
  type NoteChecklistItem,
  type NoteStatus
} from "../mock/notes";
import { getCurrentSessionAsync } from "./authRepository";

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

async function getCurrentRequiredSession() {
  const session = await getCurrentSessionAsync();

  if (!session) {
    throw new Error("No hay una sesión activa.");
  }

  return session;
}

async function requireTeacherCourseAccess(courseId: string) {
  const session = await getCurrentRequiredSession();

  if (session.role !== "teacher") {
    throw new Error("Solo los profesores pueden gestionar notas.");
  }

  const course = await courseFirebaseAdapter.getCourseById(courseId);

  if (!course) {
    throw new Error("No pudimos encontrar el curso.");
  }

  if (course.teacherId === session.id) {
    return session;
  }

  const membership = await courseMemberFirebaseAdapter.getCourseMember(courseId, session.id);

  if (membership?.role !== "teacher" || membership.status !== "active") {
    throw new Error("No tienes permisos para gestionar notas en este curso.");
  }

  return session;
}

async function requireStudentCourseAccess(courseId: string) {
  const session = await getCurrentRequiredSession();
  const membership = await courseMemberFirebaseAdapter.getCourseMember(courseId, session.id);

  if (session.role !== "student" || membership?.role !== "student" || membership.status !== "active") {
    throw new Error("No tienes permisos para ver notas de este curso.");
  }

  return session;
}

async function getFirebaseCourseIdsForCurrentSession(options?: NoteQueryOptions) {
  const session = await getCurrentRequiredSession();

  if (session.role === "teacher" && !options?.publishedOnly) {
    const courses = await courseFirebaseAdapter.getCoursesByTeacher(session.id);
    return courses.map((course) => course.id);
  }

  const courses = await courseFirebaseAdapter.getCoursesByStudent(session.id);
  return courses.map((course) => course.id);
}

export async function getNotesAsync(options?: NoteQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getNotes(options);
  }

  const courseIds = await getFirebaseCourseIdsForCurrentSession(options);
  const notesByCourse = await Promise.all(
    courseIds.map((courseId) => noteFirebaseAdapter.getNotesByCourseId(courseId, { publishedOnly: options?.publishedOnly }))
  );

  return notesByCourse
    .flat()
    .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime());
}

export async function getNotesByCourseIdAsync(courseId: string, options?: NoteQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getNotesByCourseId(courseId, options);
  }

  if (options?.publishedOnly) {
    await requireStudentCourseAccess(courseId);
  } else {
    await requireTeacherCourseAccess(courseId);
  }

  return noteFirebaseAdapter.getNotesByCourseId(courseId, { publishedOnly: options?.publishedOnly });
}

export async function getNoteByIdAsync(courseId: string, noteId: string, options?: NoteQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getNoteById(courseId, noteId, options);
  }

  if (options?.publishedOnly) {
    await requireStudentCourseAccess(courseId);
  } else {
    await requireTeacherCourseAccess(courseId);
  }

  const note = await noteFirebaseAdapter.getNoteById(noteId);

  if (!note || note.courseId !== courseId || (options?.publishedOnly && note.status !== "published")) {
    return undefined;
  }

  return note;
}

export async function createNoteAsync(input: StoredNoteInput) {
  if (!isFirebaseDataSource()) {
    return createNote(input);
  }

  const session = await requireTeacherCourseAccess(input.courseId);

  return noteFirebaseAdapter.createNote({
    content: input.content,
    courseId: input.courseId,
    createdBy: session.id,
    documentBlocks: input.documentBlocks,
    status: input.status,
    summary: input.summary,
    title: input.title
  });
}

export async function updateNoteAsync(input: StoredNoteUpdateInput) {
  if (!isFirebaseDataSource()) {
    return updateNote(input);
  }

  await requireTeacherCourseAccess(input.courseId);

  return noteFirebaseAdapter.updateNote(input.id, {
    content: input.content,
    courseId: input.courseId,
    documentBlocks: input.documentBlocks,
    status: input.status,
    summary: input.summary,
    title: input.title
  });
}

export {
  createNoteExcerptFromBlocks,
  getNoteExcerpt,
  getRenderableDocumentBlocks,
  getRenderableNoteBlocks,
  hasMeaningfulDocumentBlocks,
  hasMeaningfulNoteBlocks,
  serializeDocumentBlocks
};
