import { createStoredTaskSubmission, createStoredTeacherTask, readStoredTaskSubmissions, readStoredTeacherTasks, type StoredTaskInput, type StoredTaskSubmissionInput } from "../taskStorage";
import {
  findTaskById,
  getCourseTasks,
  getCurrentStudentSubmission,
  getPublishedTasks,
  getTaskSubmissions as getMockTaskSubmissionsByTaskId,
  mockTaskSubmissions,
  mockTasks,
  type StudentTaskState,
  type Task,
  type TaskStatus,
  type TaskSubmission,
  type TaskSubmissionStatus
} from "../mock/tasks";

export type {
  StoredTaskInput,
  StoredTaskSubmissionInput,
  StudentTaskState,
  Task,
  TaskStatus,
  TaskSubmission,
  TaskSubmissionStatus
};

type TaskQueryOptions = {
  publishedOnly?: boolean;
};

function filterTasks(tasks: Task[], options?: TaskQueryOptions) {
  return options?.publishedOnly ? getPublishedTasks(tasks) : tasks;
}

export function getTasks(options?: TaskQueryOptions) {
  return filterTasks([...readStoredTeacherTasks(), ...mockTasks], options);
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

export function submitTask(input: StoredTaskSubmissionInput) {
  return createStoredTaskSubmission(input);
}
