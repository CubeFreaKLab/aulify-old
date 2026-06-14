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

export {
  createTaskExcerptFromBlocks,
  formatTaskFileSize,
  getRenderableTaskInstructionBlocks,
  getTaskSummary,
  hasMeaningfulTaskInstructionBlocks,
  serializeTaskInstructionBlocks
};
