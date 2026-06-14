import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import {
  currentStudentSubmissionIdentity,
  taskPdfAttachmentMaxSizeBytes,
  type TaskSubmission,
  type TaskSubmissionAttachment,
  type TaskSubmissionStatus
} from "../../mock/tasks";
import type { StoredTaskSubmissionAttachmentInput } from "../../taskStorage";
import { requireFirebaseServices } from "../client";
import {
  createTaskSubmissionId,
  firestoreCollections,
  taskSubmissionPath
} from "../firestorePaths";

export type FirebaseTaskSubmissionInput = {
  attachments?: StoredTaskSubmissionAttachmentInput[];
  content: string;
  courseId: string;
  studentEmail?: string;
  studentId: string;
  studentName?: string;
  taskId: string;
};

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

function isSubmissionStatus(value: unknown): value is TaskSubmissionStatus {
  return value === "submitted" || value === "reviewed";
}

function createAttachmentId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "adjunto"}-${Date.now()}`;
}

function mapAttachment(attachment: StoredTaskSubmissionAttachmentInput, submittedAt: string): TaskSubmissionAttachment {
  const isPdf = attachment.type === "application/pdf" || attachment.name.toLowerCase().endsWith(".pdf");

  return {
    id: createAttachmentId(attachment.name),
    isPdf,
    name: attachment.name,
    size: attachment.size,
    submittedAt,
    type: attachment.type || "application/octet-stream",
    withinAllowedSize: !isPdf || attachment.size <= taskPdfAttachmentMaxSizeBytes
  };
}

function mapSubmissionDocument(id: string, data: Record<string, unknown>): TaskSubmission {
  const status = data.status;

  if (!isSubmissionStatus(status)) {
    throw new Error("Firebase task submission status is missing or invalid.");
  }

  return {
    attachments: Array.isArray(data.attachments) ? (data.attachments as TaskSubmissionAttachment[]) : undefined,
    content: typeof data.content === "string" ? data.content : "",
    courseId: typeof data.courseId === "string" ? data.courseId : undefined,
    feedback: typeof data.feedback === "string" ? data.feedback : undefined,
    id: typeof data.id === "string" ? data.id : id,
    score: typeof data.score === "number" ? data.score : undefined,
    status,
    studentEmail: typeof data.studentEmail === "string" ? data.studentEmail : undefined,
    studentId: typeof data.studentId === "string" ? data.studentId : undefined,
    studentName: typeof data.studentName === "string" ? data.studentName : currentStudentSubmissionIdentity.name,
    submittedAt: toIsoTimestamp(data.submittedAt),
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    updatedAt: toIsoTimestamp(data.updatedAt)
  };
}

async function getSubmission(taskId: string, studentId: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, taskSubmissionPath(taskId, studentId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapSubmissionDocument(snapshot.id, snapshot.data());
}

export const taskSubmissionFirebaseAdapter = {
  async getSubmissionByTaskAndStudent(taskId: string, studentId: string) {
    return getSubmission(taskId, studentId);
  },
  async getSubmissionsByTaskId(taskId: string) {
    const { firebaseDb } = requireFirebaseServices();
    const snapshot = await getDocs(
      query(collection(firebaseDb, firestoreCollections.taskSubmissions), where("taskId", "==", taskId))
    );

    return snapshot.docs
      .map((documentSnapshot) => mapSubmissionDocument(documentSnapshot.id, documentSnapshot.data()))
      .sort((first, second) => new Date(second.submittedAt).getTime() - new Date(first.submittedAt).getTime());
  },
  async submitTask(payload: FirebaseTaskSubmissionInput) {
    const { firebaseDb } = requireFirebaseServices();
    const submittedAt = new Date().toISOString();
    const id = createTaskSubmissionId(payload.taskId, payload.studentId);
    const submission: TaskSubmission = {
      attachments: payload.attachments?.map((attachment) => mapAttachment(attachment, submittedAt)),
      content: payload.content.trim(),
      courseId: payload.courseId,
      id,
      status: "submitted",
      studentEmail: payload.studentEmail,
      studentId: payload.studentId,
      studentName: payload.studentName || currentStudentSubmissionIdentity.name,
      submittedAt,
      taskId: payload.taskId,
      updatedAt: submittedAt
    };

    await setDoc(doc(firebaseDb, taskSubmissionPath(payload.taskId, payload.studentId)), {
      ...submission,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return submission;
  }
};
