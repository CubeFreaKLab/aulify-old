import {
  getStudentCourseProgress,
  getStudentPendingProgress,
  getStudentProgressSummary,
  getStudentRecentProgress,
  getTeacherCourseProgress,
  getTeacherProgressSummary,
  getTeacherRecentProgress,
  type ProgressDataset
} from "../progress";
import { getActivityAttempts, getActivities, getInitialActivities, getInitialActivityAttempts } from "./activityRepository";
import { getCourses, getInitialCourses } from "./courseRepository";
import { getInitialNotes, getNotes } from "./noteRepository";
import { getInitialTaskSubmissions, getInitialTasks, getTaskSubmissions, getTasks } from "./taskRepository";

export type { ProgressDataset };

export function getTeacherProgressDataset(): ProgressDataset {
  return {
    activities: getActivities(),
    activityAttempts: getActivityAttempts(),
    courses: getCourses("teacher"),
    notes: getNotes(),
    taskSubmissions: getTaskSubmissions(),
    tasks: getTasks()
  };
}

export function getInitialTeacherProgressDataset(): ProgressDataset {
  return {
    activities: getInitialActivities(),
    activityAttempts: getInitialActivityAttempts(),
    courses: getInitialCourses("teacher"),
    notes: getInitialNotes(),
    taskSubmissions: getInitialTaskSubmissions(),
    tasks: getInitialTasks()
  };
}

export function getStudentProgressDataset(): ProgressDataset {
  return {
    activities: getActivities(),
    activityAttempts: getActivityAttempts(),
    courses: getCourses("student"),
    notes: getNotes(),
    taskSubmissions: getTaskSubmissions(),
    tasks: getTasks()
  };
}

export function getInitialStudentProgressDataset(): ProgressDataset {
  return {
    activities: getInitialActivities(),
    activityAttempts: getInitialActivityAttempts(),
    courses: getInitialCourses("student"),
    notes: getInitialNotes(),
    taskSubmissions: getInitialTaskSubmissions(),
    tasks: getInitialTasks()
  };
}

export function getTeacherProgress(dataset: ProgressDataset = getTeacherProgressDataset()) {
  return {
    courseProgress: getTeacherCourseProgress(dataset),
    recentProgress: getTeacherRecentProgress(dataset),
    summary: getTeacherProgressSummary(dataset)
  };
}

export function getStudentProgress(dataset: ProgressDataset = getStudentProgressDataset()) {
  return {
    courseProgress: getStudentCourseProgress(dataset),
    pendingItems: getStudentPendingProgress(dataset),
    recentProgress: getStudentRecentProgress(dataset),
    summary: getStudentProgressSummary(dataset)
  };
}
