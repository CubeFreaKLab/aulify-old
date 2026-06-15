import {
  createStoredActivityAttempt,
  createStoredTeacherActivity,
  readStoredActivityAttempts,
  readStoredTeacherActivities,
  type StoredActivityAttemptInput,
  type StoredActivityInput
} from "../activityStorage";
import { isFirebaseDataSource } from "../config/dataSource";
import { activityAttemptFirebaseAdapter } from "../firebase/adapters/activityAttemptFirebaseAdapter";
import { activityFirebaseAdapter } from "../firebase/adapters/activityFirebaseAdapter";
import { courseFirebaseAdapter } from "../firebase/adapters/courseFirebaseAdapter";
import { courseMemberFirebaseAdapter } from "../firebase/adapters/courseMemberFirebaseAdapter";
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
import { getCurrentSessionAsync } from "./authRepository";

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
    throw new Error("Solo los profesores pueden gestionar actividades.");
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
    throw new Error("No tienes permisos para gestionar actividades en este curso.");
  }

  return session;
}

async function requireStudentCourseAccess(courseId: string) {
  const session = await getCurrentRequiredSession();
  const membership = await courseMemberFirebaseAdapter.getCourseMember(courseId, session.id);

  if (session.role !== "student" || membership?.role !== "student" || membership.status !== "active") {
    throw new Error("No tienes permisos para ver actividades de este curso.");
  }

  return session;
}

async function getFirebaseCourseIdsForCurrentSession(options?: ActivityQueryOptions) {
  const session = await getCurrentRequiredSession();

  if (session.role === "teacher" && !options?.publishedOnly) {
    const courses = await courseFirebaseAdapter.getCoursesByTeacher(session.id);
    return courses.map((course) => course.id);
  }

  const courses = await courseFirebaseAdapter.getCoursesByStudent(session.id);
  return courses.map((course) => course.id);
}

export async function getActivitiesAsync(options?: ActivityQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getActivities(options);
  }

  const courseIds = await getFirebaseCourseIdsForCurrentSession(options);
  const activitiesByCourse = await Promise.all(
    courseIds.map((courseId) => activityFirebaseAdapter.getActivitiesByCourseId(courseId, { publishedOnly: options?.publishedOnly }))
  );

  return activitiesByCourse
    .flat()
    .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime());
}

export async function getActivitiesByCourseIdAsync(courseId: string, options?: ActivityQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getActivitiesByCourseId(courseId, options);
  }

  if (options?.publishedOnly) {
    await requireStudentCourseAccess(courseId);
  } else {
    await requireTeacherCourseAccess(courseId);
  }

  return activityFirebaseAdapter.getActivitiesByCourseId(courseId, { publishedOnly: options?.publishedOnly });
}

export async function getActivityByIdAsync(courseId: string, activityId: string, options?: ActivityQueryOptions) {
  if (!isFirebaseDataSource()) {
    return getActivityById(courseId, activityId, options);
  }

  if (options?.publishedOnly) {
    await requireStudentCourseAccess(courseId);
  } else {
    await requireTeacherCourseAccess(courseId);
  }

  const activity = await activityFirebaseAdapter.getActivityById(activityId);

  if (!activity || activity.courseId !== courseId || (options?.publishedOnly && activity.status !== "published")) {
    return undefined;
  }

  return activity;
}

export async function getActivityAttemptsAsync() {
  if (!isFirebaseDataSource()) {
    return getActivityAttempts();
  }

  const session = await getCurrentRequiredSession();
  const activities = await getActivitiesAsync({ publishedOnly: session.role === "student" });

  if (session.role === "student") {
    const attempts = await Promise.all(
      activities.map((activity) => activityAttemptFirebaseAdapter.getAttemptByActivityAndStudent(activity.id, session.id))
    );

    return attempts.filter((attempt): attempt is ActivityAttempt => Boolean(attempt));
  }

  const attemptsByActivity = await Promise.all(
    activities.map((activity) => activityAttemptFirebaseAdapter.getAttemptsByActivityId(activity.id))
  );

  return attemptsByActivity.flat();
}

export async function getActivityAttemptsByActivityIdAsync(activityId: string) {
  if (!isFirebaseDataSource()) {
    return getActivityAttemptsByActivityId(activityId);
  }

  const activity = await activityFirebaseAdapter.getActivityById(activityId);

  if (!activity) {
    return [];
  }

  await requireTeacherCourseAccess(activity.courseId);

  return activityAttemptFirebaseAdapter.getAttemptsByActivityId(activityId);
}

export async function getCurrentStudentAttemptAsync(activityId: string) {
  if (!isFirebaseDataSource()) {
    return getCurrentStudentAttempt(activityId);
  }

  const session = await getCurrentRequiredSession();
  const activity = await activityFirebaseAdapter.getActivityById(activityId);

  if (!activity || activity.status !== "published") {
    return undefined;
  }

  await requireStudentCourseAccess(activity.courseId);

  return (await activityAttemptFirebaseAdapter.getAttemptByActivityAndStudent(activityId, session.id)) ?? undefined;
}

export async function createActivityAsync(input: StoredActivityInput) {
  if (!isFirebaseDataSource()) {
    return createActivity(input);
  }

  const session = await requireTeacherCourseAccess(input.courseId);

  return activityFirebaseAdapter.createActivity({
    ...input,
    createdBy: session.id
  });
}

export async function submitActivityAttemptAsync(input: StoredActivityAttemptInput) {
  if (!isFirebaseDataSource()) {
    return submitActivityAttempt(input);
  }

  const session = await getCurrentRequiredSession();

  if (session.role !== "student") {
    throw new Error("Solo los estudiantes pueden enviar respuestas.");
  }

  if (input.activity.status !== "published") {
    throw new Error("No pudimos encontrar una actividad publicada.");
  }

  await requireStudentCourseAccess(input.activity.courseId);

  return activityAttemptFirebaseAdapter.submitAttempt({
    activity: input.activity,
    answers: input.answers,
    studentId: session.id,
    studentName: session.name
  });
}
