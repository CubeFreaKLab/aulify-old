import {
  createStoredTaskSubmission,
  createStoredTeacherTask,
  readStoredTaskSubmissions,
  readStoredTeacherTasks,
  updateStoredTeacherTask,
  type StoredTaskInput,
  type StoredTaskSubmissionAttachmentInput,
  type StoredTaskSubmissionInput,
  type StoredTaskUpdateInput
} from "../taskStorage";
import { isFirebaseDataSource } from "../config/dataSource";
import { courseFirebaseAdapter } from "../firebase/adapters/courseFirebaseAdapter";
import { courseMemberFirebaseAdapter } from "../firebase/adapters/courseMemberFirebaseAdapter";
import { taskFirebaseAdapter } from "../firebase/adapters/taskFirebaseAdapter";
import { taskSubmissionFirebaseAdapter } from "../firebase/adapters/taskSubmissionFirebaseAdapter";
import {
  createTaskExcerptFromBlocks,
  findTaskById,
  formatTaskFileSize,
  getCourseTasks,
  getCurrentStudentSubmission,
  getPublishedTasks,
  getRenderableTaskInstructionBlocks,
  getTaskSummary,
  getTaskSubmissions as getMockTaskSubmissionsByTaskId,
  hasMeaningfulTaskInstructionBlocks,
  mockTaskSubmissions,
  mockTasks,
  serializeTaskInstructionBlocks,
  type StudentTaskState,
  type Task,
  type TaskAttachment,
  type TaskResource,
  type TaskStatus,
  type TaskSubmission,
  type TaskSubmissionAttachment,
  type TaskSubmissionStatus
} from "../mock/tasks";
import { getCurrentSessionAsync } from "./authRepository";

export type {
  StoredTaskInput,
  StoredTaskSubmissionAttachmentInput,
  StoredTaskSubmissionInput,
  StoredTaskUpdateInput,
  StudentTaskState,
  Task,
  TaskAttachment,
  TaskResource,
  TaskStatus,
  TaskSubmission,
  TaskSubmissionAttachment,
  TaskSubmissionStatus
};

type TaskQueryOptions = {
  publishedOnly?: boolean;
};

function filterTasks(tasks: Task[], options?: TaskQueryOptions) {
  return options?.publishedOnly ? getPublishedTasks(tasks) : tasks;
}

function mergeTasks(baseTasks: Task[], storedTasks: Task[]) {
  const tasksById = new Map<string, Task>();

  baseTasks.forEach((task) => tasksById.set(task.id, task));
  storedTasks.forEach((task) => tasksById.set(task.id, task));

  return [...tasksById.values()];
}

export function getTasks(options?: TaskQueryOptions) {
  return filterTasks(mergeTasks(mockTasks, readStoredTeacherTasks()), options);
}

export function getInitialTasks(options?: TaskQueryOptions) {
  return filterTasks(mockTasks, options);
}

export function getTasksByCourseId(courseId: string, options?: TaskQueryOptions) {
  return getCourseTasks(courseId, getTasks(options));
}

export function getInitialTasksByCourseId(courseId: string, options?: TaskQueryOptions) {
  return getCourseTasks(courseId, getInitialTasks(options));
}

export function getTaskById(courseId: string, taskId: string, options?: TaskQueryOptions) {
  return findTaskById(courseId, taskId, getTasks(options));
}

export function getInitialTaskById(courseId: string, taskId: string, options?: TaskQueryOptions) {
  return findTaskById(courseId, taskId, getInitialTasks(options));
}

export function getTaskSubmissionsByTaskId(taskId: string) {
  return getMockTaskSubmissionsByTaskId(taskId, getTaskSubmissions());
}

export function getTaskSubmissions() {
  return [...readStoredTaskSubmissions(), ...mockTaskSubmissions];
}

export function getInitialTaskSubmissions() {
  return mockTaskSubmissions;
}

export function getCurrentStudentTaskSubmission(taskId: string) {
  return getCurrentStudentSubmission(taskId, getTaskSubmissions());
}

export function getInitialCurrentStudentTaskSubmission(taskId: string) {
  return getCurrentStudentSubmission(taskId, getInitialTaskSubmissions());
}

export function createTask(input: StoredTaskInput) {
  return createStoredTeacherTask(input);
}

export function updateTask(input: StoredTaskUpdateInput) {
  return updateStoredTeacherTask(input);
}

export function submitTask(input: StoredTaskSubmissionInput) {
  return createStoredTaskSubmission(input);
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
    throw new Error("Solo los profesores pueden gestionar tareas.");
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
    throw new Error("No tienes permisos para gestionar tareas en este curso.");
  }

  return session;
}

async function requireStudentCourseAccess(courseId: string) {
  const session = await getCurrentRequiredSession();
  const membership = await courseMemberFirebaseAdapter.getCourseMember(courseId, session.id);

  if (session.role !== "student" || membership?.role !== "student" || membership.status !== "active") {
    throw new Error("No tienes permisos para ver tareas de este curso.");
  }

  return session;
}

async function getFirebaseCourseIdsForCurrentSession(options?: TaskQueryOptions) {
  const session = await getCurrentRequiredSession();

  if (session.role === "teacher" && !options?.publishedOnly) {
    const courses = await courseFirebaseAdapter.getCoursesByTeacher(session.id);
    return courses.map((course) => course.id);
  }

  const courses = await courseFirebaseAdapter.getCoursesByStudent(session.id);
  return courses.map((course) => course.id);
}

export async function getTasksAsync(options?: TaskQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getTasks(options);
  }

  const courseIds = await getFirebaseCourseIdsForCurrentSession(options);
  const tasksByCourse = await Promise.all(
    courseIds.map((courseId) => taskFirebaseAdapter.getTasksByCourseId(courseId, { publishedOnly: options?.publishedOnly }))
  );

  return tasksByCourse
    .flat()
    .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime());
}

export async function getTasksByCourseIdAsync(courseId: string, options?: TaskQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getTasksByCourseId(courseId, options);
  }

  if (options?.publishedOnly) {
    await requireStudentCourseAccess(courseId);
  } else {
    await requireTeacherCourseAccess(courseId);
  }

  return taskFirebaseAdapter.getTasksByCourseId(courseId, { publishedOnly: options?.publishedOnly });
}

export async function getTaskByIdAsync(courseId: string, taskId: string, options?: TaskQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getTaskById(courseId, taskId, options);
  }

  if (options?.publishedOnly) {
    await requireStudentCourseAccess(courseId);
  } else {
    await requireTeacherCourseAccess(courseId);
  }

  const task = await taskFirebaseAdapter.getTaskById(taskId);

  if (!task || task.courseId !== courseId || (options?.publishedOnly && task.status === "draft")) {
    return undefined;
  }

  return task;
}

export async function getTaskSubmissionsAsync() {
  if (!isFirebaseDataSource()) {
    return getTaskSubmissions();
  }

  const session = await getCurrentRequiredSession();
  const tasks = await getTasksAsync({ publishedOnly: session.role === "student" });

  if (session.role === "student") {
    const submissions = await Promise.all(
      tasks.map((task) => taskSubmissionFirebaseAdapter.getSubmissionByTaskAndStudent(task.id, session.id))
    );

    return submissions.filter((submission): submission is TaskSubmission => Boolean(submission));
  }

  const submissionsByTask = await Promise.all(tasks.map((task) => taskSubmissionFirebaseAdapter.getSubmissionsByTaskId(task.id)));

  return submissionsByTask.flat();
}

export async function getTaskSubmissionsByTaskIdAsync(taskId: string) {
  if (!isFirebaseDataSource()) {
    return getTaskSubmissionsByTaskId(taskId);
  }

  const task = await taskFirebaseAdapter.getTaskById(taskId);

  if (!task) {
    return [];
  }

  await requireTeacherCourseAccess(task.courseId);

  return taskSubmissionFirebaseAdapter.getSubmissionsByTaskId(taskId);
}

export async function getCurrentStudentTaskSubmissionAsync(taskId: string) {
  if (!isFirebaseDataSource()) {
    return getCurrentStudentTaskSubmission(taskId);
  }

  const session = await getCurrentRequiredSession();
  const task = await taskFirebaseAdapter.getTaskById(taskId);

  if (!task) {
    return undefined;
  }

  await requireStudentCourseAccess(task.courseId);

  return (await taskSubmissionFirebaseAdapter.getSubmissionByTaskAndStudent(taskId, session.id)) ?? undefined;
}

export async function createTaskAsync(input: StoredTaskInput) {
  if (!isFirebaseDataSource()) {
    return createTask(input);
  }

  const session = await requireTeacherCourseAccess(input.courseId);

  return taskFirebaseAdapter.createTask({
    attachments: input.attachments,
    courseId: input.courseId,
    createdBy: session.id,
    description: input.description,
    dueDate: input.dueDate,
    instructions: input.instructions,
    instructionsBlocks: input.instructionsBlocks,
    points: input.points,
    relatedNoteId: input.relatedNoteId,
    resources: input.resources,
    status: input.status,
    summary: input.summary,
    title: input.title
  });
}

export async function updateTaskAsync(input: StoredTaskUpdateInput) {
  if (!isFirebaseDataSource()) {
    return updateTask(input);
  }

  await requireTeacherCourseAccess(input.courseId);

  return taskFirebaseAdapter.updateTask(input.id, {
    attachments: input.attachments,
    courseId: input.courseId,
    description: input.description,
    dueDate: input.dueDate,
    instructions: input.instructions,
    instructionsBlocks: input.instructionsBlocks,
    points: input.points,
    relatedNoteId: input.relatedNoteId,
    resources: input.resources,
    status: input.status,
    summary: input.summary,
    title: input.title
  });
}

export async function submitTaskAsync(input: StoredTaskSubmissionInput) {
  if (!isFirebaseDataSource()) {
    return submitTask(input);
  }

  const session = await getCurrentRequiredSession();

  if (session.role !== "student") {
    throw new Error("Solo los estudiantes pueden enviar entregas.");
  }

  const task = await taskFirebaseAdapter.getTaskById(input.taskId);

  if (!task || task.status === "draft") {
    throw new Error("No pudimos encontrar una tarea publicada.");
  }

  await requireStudentCourseAccess(task.courseId);

  return taskSubmissionFirebaseAdapter.submitTask({
    attachments: input.attachments,
    content: input.content,
    courseId: task.courseId,
    studentEmail: session.email,
    studentId: session.id,
    studentName: session.name,
    taskId: input.taskId
  });
}

export {
  createTaskExcerptFromBlocks,
  formatTaskFileSize,
  getRenderableTaskInstructionBlocks,
  getTaskSummary,
  hasMeaningfulTaskInstructionBlocks,
  serializeTaskInstructionBlocks
};
