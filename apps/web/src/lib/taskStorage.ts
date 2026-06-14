import type { PartialBlock } from "@blocknote/core";
import {
  createTaskExcerptFromBlocks,
  currentStudentSubmissionIdentity,
  serializeTaskInstructionBlocks,
  taskPdfAttachmentMaxSizeBytes,
  type Task,
  type TaskAttachment,
  type TaskResource,
  type TaskStatus,
  type TaskSubmission,
  type TaskSubmissionAttachment
} from "./mock/tasks";

const storedTasksKey = "aulify.teacherTasks";
const storedTaskSubmissionsKey = "aulify.taskSubmissions";

export type StoredTaskInput = {
  courseId: string;
  attachments?: TaskAttachment[];
  description?: string;
  dueDate: string;
  instructions?: string;
  instructionsBlocks?: PartialBlock[];
  points: number;
  relatedNoteId?: string;
  resources?: TaskResource[];
  status: Exclude<TaskStatus, "closed">;
  summary?: string;
  title: string;
};

export type StoredTaskUpdateInput = StoredTaskInput & {
  createdAt: string;
  id: string;
};

export type StoredTaskSubmissionAttachmentInput = {
  name: string;
  size: number;
  type: string;
};

export type StoredTaskSubmissionInput = {
  attachments?: StoredTaskSubmissionAttachmentInput[];
  content: string;
  taskId: string;
};

function createId(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || fallback}-${Date.now()}`;
}

export function readStoredTeacherTasks(): Task[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(storedTasksKey);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Task[];
  } catch {
    return [];
  }
}

export function createStoredTeacherTask(input: StoredTaskInput) {
  const now = new Date().toISOString();
  const instructions = input.instructions?.trim() || serializeTaskInstructionBlocks(input.instructionsBlocks ?? []);
  const summary = input.summary?.trim() || createTaskExcerptFromBlocks(input.instructionsBlocks ?? [], input.description ?? instructions);
  const task: Task = {
    id: createId(input.title, "tarea"),
    courseId: input.courseId,
    title: input.title.trim(),
    description: input.description?.trim() || summary,
    instructions,
    instructionsBlocks: input.instructionsBlocks,
    dueDate: input.dueDate,
    status: input.status,
    points: input.points,
    relatedNoteId: input.relatedNoteId,
    resources: input.resources,
    attachments: input.attachments,
    summary,
    createdAt: now,
    updatedAt: now
  };

  const nextTasks = [task, ...readStoredTeacherTasks()];
  window.localStorage.setItem(storedTasksKey, JSON.stringify(nextTasks));

  return task;
}

export function updateStoredTeacherTask(input: StoredTaskUpdateInput) {
  const now = new Date().toISOString();
  const instructions = input.instructions?.trim() || serializeTaskInstructionBlocks(input.instructionsBlocks ?? []);
  const summary = input.summary?.trim() || createTaskExcerptFromBlocks(input.instructionsBlocks ?? [], input.description ?? instructions);
  const task: Task = {
    id: input.id,
    courseId: input.courseId,
    title: input.title.trim(),
    description: input.description?.trim() || summary,
    instructions,
    instructionsBlocks: input.instructionsBlocks,
    dueDate: input.dueDate,
    status: input.status,
    points: input.points,
    relatedNoteId: input.relatedNoteId,
    resources: input.resources,
    attachments: input.attachments,
    summary,
    createdAt: input.createdAt,
    updatedAt: now
  };

  const nextTasks = [task, ...readStoredTeacherTasks().filter((storedTask) => storedTask.id !== input.id)];
  window.localStorage.setItem(storedTasksKey, JSON.stringify(nextTasks));

  return task;
}

export function readStoredTaskSubmissions(): TaskSubmission[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(storedTaskSubmissionsKey);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as TaskSubmission[];
  } catch {
    return [];
  }
}

export function createStoredTaskSubmission(input: StoredTaskSubmissionInput) {
  const submittedAt = new Date().toISOString();
  const attachments: TaskSubmissionAttachment[] | undefined = input.attachments?.map((attachment) => {
    const isPdf = attachment.type === "application/pdf" || attachment.name.toLowerCase().endsWith(".pdf");

    return {
      id: createId(attachment.name, "adjunto"),
      isPdf,
      name: attachment.name,
      size: attachment.size,
      submittedAt,
      type: attachment.type || "application/octet-stream",
      withinAllowedSize: !isPdf || attachment.size <= taskPdfAttachmentMaxSizeBytes
    };
  });
  const submission: TaskSubmission = {
    id: createId(input.taskId, "entrega"),
    taskId: input.taskId,
    studentName: currentStudentSubmissionIdentity.name,
    studentEmail: currentStudentSubmissionIdentity.email,
    content: input.content.trim(),
    submittedAt,
    status: "submitted",
    attachments
  };

  const existingSubmissions = readStoredTaskSubmissions();
  const nextSubmissions = [
    submission,
    ...existingSubmissions.filter(
      (storedSubmission) =>
        storedSubmission.taskId !== input.taskId || storedSubmission.studentEmail !== currentStudentSubmissionIdentity.email
    )
  ];

  window.localStorage.setItem(storedTaskSubmissionsKey, JSON.stringify(nextSubmissions));

  return submission;
}
