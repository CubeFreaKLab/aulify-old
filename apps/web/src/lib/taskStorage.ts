import { currentStudentSubmissionIdentity, type Task, type TaskStatus, type TaskSubmission } from "./mock/tasks";

const storedTasksKey = "aulify.teacherTasks";
const storedTaskSubmissionsKey = "aulify.taskSubmissions";

export type StoredTaskInput = {
  courseId: string;
  description: string;
  dueDate: string;
  instructions: string;
  points: number;
  relatedNoteId?: string;
  status: Exclude<TaskStatus, "closed">;
  title: string;
};

export type StoredTaskSubmissionInput = {
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
  const task: Task = {
    id: createId(input.title, "tarea"),
    courseId: input.courseId,
    title: input.title.trim(),
    description: input.description.trim(),
    instructions: input.instructions.trim(),
    dueDate: input.dueDate,
    status: input.status,
    points: input.points,
    relatedNoteId: input.relatedNoteId,
    createdAt: now,
    updatedAt: now
  };

  const nextTasks = [task, ...readStoredTeacherTasks()];
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
  const submission: TaskSubmission = {
    id: createId(input.taskId, "entrega"),
    taskId: input.taskId,
    studentName: currentStudentSubmissionIdentity.name,
    studentEmail: currentStudentSubmissionIdentity.email,
    content: input.content.trim(),
    submittedAt: new Date().toISOString(),
    status: "submitted"
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
