import type { CourseId, UserId } from "@aulify/shared-types";

export const firestoreCollections = {
  attendanceRecords: "attendanceRecords",
  attendanceSessions: "attendanceSessions",
  courseMembers: "courseMembers",
  courses: "courses",
  notes: "notes",
  profiles: "profiles",
  taskSubmissions: "taskSubmissions",
  tasks: "tasks",
  users: "users"
} as const;

export function createCourseMemberId(courseId: CourseId, userId: UserId) {
  return `${courseId}_${userId}`;
}

export function userPath(userId: UserId) {
  return `${firestoreCollections.users}/${userId}`;
}

export function profilePath(userId: UserId) {
  return `${firestoreCollections.profiles}/${userId}`;
}

export function coursePath(courseId: CourseId) {
  return `${firestoreCollections.courses}/${courseId}`;
}

export function courseMemberPath(courseId: CourseId, userId: UserId) {
  return `${firestoreCollections.courseMembers}/${createCourseMemberId(courseId, userId)}`;
}

export function notePath(noteId: string) {
  return `${firestoreCollections.notes}/${noteId}`;
}

export function taskPath(taskId: string) {
  return `${firestoreCollections.tasks}/${taskId}`;
}

export function createTaskSubmissionId(taskId: string, studentId: UserId) {
  return `${taskId}_${studentId}`;
}

export function taskSubmissionPath(taskId: string, studentId: UserId) {
  return `${firestoreCollections.taskSubmissions}/${createTaskSubmissionId(taskId, studentId)}`;
}

export function attendanceSessionPath(sessionId: string) {
  return `${firestoreCollections.attendanceSessions}/${sessionId}`;
}

export function createAttendanceRecordId(sessionId: string, studentId: UserId) {
  return `${sessionId}_${studentId}`;
}

export function attendanceRecordPath(sessionId: string, studentId: UserId) {
  return `${firestoreCollections.attendanceRecords}/${createAttendanceRecordId(sessionId, studentId)}`;
}
