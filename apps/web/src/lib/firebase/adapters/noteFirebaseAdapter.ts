import type { PartialBlock } from "@blocknote/core";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import type { Note, NoteStatus } from "../../mock/notes";
import { requireFirebaseServices } from "../client";
import { firestoreCollections, notePath } from "../firestorePaths";

export type FirebaseNoteInput = {
  content?: string;
  courseId: string;
  createdBy: string;
  documentBlocks?: PartialBlock[];
  status: NoteStatus;
  summary?: string;
  title: string;
};

export type FirebaseNoteUpdateInput = Omit<FirebaseNoteInput, "createdBy">;

function toIsoTimestamp(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "seconds" in value && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString();
  }

  return new Date().toISOString();
}

function isNoteStatus(value: unknown): value is NoteStatus {
  return value === "draft" || value === "published";
}

function removeUndefinedValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

function toFirestoreJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mapNoteDocument(id: string, data: Record<string, unknown>): Note {
  const status = data.status;

  if (!isNoteStatus(status)) {
    throw new Error("Firebase note status is missing or invalid.");
  }

  return {
    content: typeof data.content === "string" ? data.content : undefined,
    courseId: typeof data.courseId === "string" ? data.courseId : "",
    createdAt: toIsoTimestamp(data.createdAt),
    createdBy: typeof data.createdBy === "string" ? data.createdBy : undefined,
    documentBlocks: Array.isArray(data.documentBlocks) ? (data.documentBlocks as PartialBlock[]) : undefined,
    id: typeof data.id === "string" ? data.id : id,
    status,
    summary: typeof data.summary === "string" ? data.summary : "",
    title: typeof data.title === "string" ? data.title : "",
    updatedAt: toIsoTimestamp(data.updatedAt)
  };
}

async function getNote(noteId: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, notePath(noteId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapNoteDocument(snapshot.id, snapshot.data());
}

export const noteFirebaseAdapter = {
  async createNote(payload: FirebaseNoteInput) {
    const { firebaseDb } = requireFirebaseServices();
    const noteReference = doc(collection(firebaseDb, firestoreCollections.notes));
    const now = new Date().toISOString();
    const note: Note = {
      content: payload.content?.trim(),
      courseId: payload.courseId,
      createdAt: now,
      createdBy: payload.createdBy,
      documentBlocks: payload.documentBlocks ? toFirestoreJsonValue(payload.documentBlocks) : undefined,
      id: noteReference.id,
      status: payload.status,
      summary: payload.summary?.trim() ?? "",
      title: payload.title.trim(),
      updatedAt: now
    };

    await setDoc(
      noteReference,
      removeUndefinedValues({
        ...note,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );

    return note;
  },
  async getNoteById(noteId: string) {
    return getNote(noteId);
  },
  async getNotesByCourseId(courseId: string, options?: { publishedOnly?: boolean }) {
    const { firebaseDb } = requireFirebaseServices();
    const constraints = [where("courseId", "==", courseId)];

    if (options?.publishedOnly) {
      constraints.push(where("status", "==", "published"));
    }

    const snapshot = await getDocs(query(collection(firebaseDb, firestoreCollections.notes), ...constraints));

    return snapshot.docs
      .map((documentSnapshot) => mapNoteDocument(documentSnapshot.id, documentSnapshot.data()))
      .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime());
  },
  async updateNote(noteId: string, payload: FirebaseNoteUpdateInput) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(
      doc(firebaseDb, notePath(noteId)),
      removeUndefinedValues({
        content: payload.content?.trim(),
        courseId: payload.courseId,
        documentBlocks: payload.documentBlocks ? toFirestoreJsonValue(payload.documentBlocks) : undefined,
        status: payload.status,
        summary: payload.summary?.trim() ?? "",
        title: payload.title.trim(),
        updatedAt: serverTimestamp()
      })
    );

    const note = await getNote(noteId);

    if (!note) {
      throw new Error("Firebase note not found after update.");
    }

    return note;
  }
};
