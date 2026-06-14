import type { PartialBlock } from "@blocknote/core";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import type { Task, TaskStatus } from "../../mock/tasks";
import { requireFirebaseServices } from "../client";
import { firestoreCollections, taskPath } from "../firestorePaths";

export type FirebaseTaskInput = {
  attachments?: Task["attachments"];
  courseId: string;
  createdBy: string;
  description?: string;
  dueDate: string;
  instructions?: string;
  instructionsBlocks?: PartialBlock[];
  points?: number;
  relatedNoteId?: string;
  resources?: Task["resources"];
  status: Exclude<TaskStatus, "closed"> | "closed";
  summary?: string;
  title: string;
};

export type FirebaseTaskUpdateInput = Omit<FirebaseTaskInput, "createdBy">;

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

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "draft" || value === "published" || value === "closed";
}

function removeUndefinedValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

function toFirestoreJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mapTaskDocument(id: string, data: Record<string, unknown>): Task {
  const status = data.status;

  if (!isTaskStatus(status)) {
    throw new Error("Firebase task status is missing or invalid.");
  }

  return {
    attachments: Array.isArray(data.attachments) ? (data.attachments as Task["attachments"]) : undefined,
    courseId: typeof data.courseId === "string" ? data.courseId : "",
    createdAt: toIsoTimestamp(data.createdAt),
    createdBy: typeof data.createdBy === "string" ? data.createdBy : undefined,
    description: typeof data.description === "string" ? data.description : "",
    dueDate: typeof data.dueDate === "string" ? data.dueDate : "",
    id: typeof data.id === "string" ? data.id : id,
    instructions: typeof data.instructions === "string" ? data.instructions : "",
    instructionsBlocks: Array.isArray(data.instructionsBlocks) ? (data.instructionsBlocks as PartialBlock[]) : undefined,
    points: typeof data.points === "number" ? data.points : 0,
    relatedNoteId: typeof data.relatedNoteId === "string" ? data.relatedNoteId : undefined,
    resources: Array.isArray(data.resources) ? (data.resources as Task["resources"]) : undefined,
    status,
    summary: typeof data.summary === "string" ? data.summary : undefined,
    title: typeof data.title === "string" ? data.title : "",
    updatedAt: toIsoTimestamp(data.updatedAt)
  };
}

async function getTask(taskId: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, taskPath(taskId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapTaskDocument(snapshot.id, snapshot.data());
}

export const taskFirebaseAdapter = {
  async createTask(payload: FirebaseTaskInput) {
    const { firebaseDb } = requireFirebaseServices();
    const taskReference = doc(collection(firebaseDb, firestoreCollections.tasks));
    const now = new Date().toISOString();
    const task: Task = {
      attachments: payload.attachments ? toFirestoreJsonValue(payload.attachments) : undefined,
      courseId: payload.courseId,
      createdAt: now,
      createdBy: payload.createdBy,
      description: payload.description?.trim() ?? payload.summary?.trim() ?? "",
      dueDate: payload.dueDate,
      id: taskReference.id,
      instructions: payload.instructions?.trim() ?? "",
      instructionsBlocks: payload.instructionsBlocks ? toFirestoreJsonValue(payload.instructionsBlocks) : undefined,
      points: payload.points ?? 0,
      relatedNoteId: payload.relatedNoteId,
      resources: payload.resources ? toFirestoreJsonValue(payload.resources) : undefined,
      status: payload.status,
      summary: payload.summary?.trim(),
      title: payload.title.trim(),
      updatedAt: now
    };

    await setDoc(
      taskReference,
      removeUndefinedValues({
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );

    return task;
  },
  async getTaskById(taskId: string) {
    return getTask(taskId);
  },
  async getTasksByCourseId(courseId: string, options?: { publishedOnly?: boolean }) {
    const { firebaseDb } = requireFirebaseServices();
    const constraints = [where("courseId", "==", courseId)];

    if (options?.publishedOnly) {
      constraints.push(where("status", "in", ["published", "closed"]));
    }

    const snapshot = await getDocs(query(collection(firebaseDb, firestoreCollections.tasks), ...constraints));

    return snapshot.docs
      .map((documentSnapshot) => mapTaskDocument(documentSnapshot.id, documentSnapshot.data()))
      .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime());
  },
  async updateTask(taskId: string, payload: FirebaseTaskUpdateInput) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(
      doc(firebaseDb, taskPath(taskId)),
      removeUndefinedValues({
        attachments: payload.attachments ? toFirestoreJsonValue(payload.attachments) : undefined,
        courseId: payload.courseId,
        description: payload.description?.trim() ?? payload.summary?.trim() ?? "",
        dueDate: payload.dueDate,
        instructions: payload.instructions?.trim() ?? "",
        instructionsBlocks: payload.instructionsBlocks ? toFirestoreJsonValue(payload.instructionsBlocks) : undefined,
        points: payload.points ?? 0,
        relatedNoteId: payload.relatedNoteId,
        resources: payload.resources ? toFirestoreJsonValue(payload.resources) : undefined,
        status: payload.status,
        summary: payload.summary?.trim(),
        title: payload.title.trim(),
        updatedAt: serverTimestamp()
      })
    );

    const task = await getTask(taskId);

    if (!task) {
      throw new Error("Firebase task not found after update.");
    }

    return task;
  }
};
