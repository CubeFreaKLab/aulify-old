import {
  createStoredActivityAttempt,
  createStoredTeacherActivity,
  readStoredActivityAttempts,
  readStoredTeacherActivities,
  type StoredActivityAttemptInput,
  type StoredActivityInput
} from "../activityStorage";
import {
  findActivityById,
  getActivityAttempts as getMockActivityAttemptsByActivityId,
  getCourseActivities,
  getCurrentStudentActivityAttempt,
  getPublishedActivities,
  mockActivities,
  mockActivityAttempts,
  type Activity,
  type ActivityAnswer,
  type ActivityAttempt,
  type ActivityQuestion,
  type ActivityStatus,
  type ActivityType,
  type StudentActivityState
} from "../mock/activities";

export type {
  Activity,
  ActivityAnswer,
  ActivityAttempt,
  ActivityQuestion,
  ActivityStatus,
  ActivityType,
  StoredActivityAttemptInput,
  StoredActivityInput,
  StudentActivityState
};

type ActivityQueryOptions = {
  publishedOnly?: boolean;
};

function filterActivities(activities: Activity[], options?: ActivityQueryOptions) {
  return options?.publishedOnly ? getPublishedActivities(activities) : activities;
}

export function getActivities(options?: ActivityQueryOptions) {
  return filterActivities([...readStoredTeacherActivities(), ...mockActivities], options);
}

export function getInitialActivities(options?: ActivityQueryOptions) {
  return filterActivities(mockActivities, options);
}

export function getActivitiesByCourseId(courseId: string, options?: ActivityQueryOptions) {
  return getCourseActivities(courseId, getActivities(options));
}

export function getInitialActivitiesByCourseId(courseId: string, options?: ActivityQueryOptions) {
  return getCourseActivities(courseId, getInitialActivities(options));
}

export function getActivityById(courseId: string, activityId: string, options?: ActivityQueryOptions) {
  return findActivityById(courseId, activityId, getActivities(options));
}

export function getInitialActivityById(courseId: string, activityId: string, options?: ActivityQueryOptions) {
  return findActivityById(courseId, activityId, getInitialActivities(options));
}

export function getActivityAttemptsByActivityId(activityId: string) {
  return getMockActivityAttemptsByActivityId(activityId, getActivityAttempts());
}

export function getActivityAttempts() {
  return [...readStoredActivityAttempts(), ...mockActivityAttempts];
}

export function getInitialActivityAttempts() {
  return mockActivityAttempts;
}

export function getCurrentStudentAttempt(activityId: string) {
  return getCurrentStudentActivityAttempt(activityId, getActivityAttempts());
}

export function getInitialCurrentStudentAttempt(activityId: string) {
  return getCurrentStudentActivityAttempt(activityId, getInitialActivityAttempts());
}

export function createActivity(input: StoredActivityInput) {
  return createStoredTeacherActivity(input);
}

export function submitActivityAttempt(input: StoredActivityAttemptInput) {
  return createStoredActivityAttempt(input);
}
