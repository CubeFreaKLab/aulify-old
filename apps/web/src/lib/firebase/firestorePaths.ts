import type { CourseId, UserId } from "@aulify/shared-types";

export const firestoreCollections = {
  courseMembers: "courseMembers",
  courses: "courses",
  profiles: "profiles",
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
