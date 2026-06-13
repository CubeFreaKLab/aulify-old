import {
  calculateActivityScore,
  currentStudentActivityIdentity,
  type Activity,
  type ActivityAnswer,
  type ActivityQuestion,
  type ActivityStatus,
  type ActivityType,
  type ActivityAttempt
} from "./mock/activities";

const storedActivitiesKey = "aulify.teacherActivities";
const storedActivityAttemptsKey = "aulify.activityAttempts";

export type StoredActivityInput = {
  courseId: string;
  description: string;
  questions: ActivityQuestion[];
  status: Exclude<ActivityStatus, "closed">;
  title: string;
  type: ActivityType;
};

export type StoredActivityAttemptInput = {
  activity: Activity;
  answers: ActivityAnswer[];
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

export function readStoredTeacherActivities(): Activity[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(storedActivitiesKey);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Activity[];
  } catch {
    return [];
  }
}

export function createStoredTeacherActivity(input: StoredActivityInput) {
  const now = new Date().toISOString();
  const activity: Activity = {
    id: createId(input.title, "actividad"),
    courseId: input.courseId,
    title: input.title.trim(),
    description: input.description.trim(),
    type: input.type,
    status: input.status,
    questions: input.questions,
    createdAt: now,
    updatedAt: now
  };

  const nextActivities = [activity, ...readStoredTeacherActivities()];
  window.localStorage.setItem(storedActivitiesKey, JSON.stringify(nextActivities));

  return activity;
}

export function readStoredActivityAttempts(): ActivityAttempt[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(storedActivityAttemptsKey);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as ActivityAttempt[];
  } catch {
    return [];
  }
}

export function createStoredActivityAttempt(input: StoredActivityAttemptInput) {
  const attempt: ActivityAttempt = {
    id: createId(input.activity.id, "intento"),
    activityId: input.activity.id,
    studentName: currentStudentActivityIdentity.name,
    answers: input.answers,
    score: calculateActivityScore(input.activity, input.answers),
    submittedAt: new Date().toISOString()
  };

  const existingAttempts = readStoredActivityAttempts();
  const nextAttempts = [
    attempt,
    ...existingAttempts.filter(
      (storedAttempt) =>
        storedAttempt.activityId !== input.activity.id || storedAttempt.studentName !== currentStudentActivityIdentity.name
    )
  ];

  window.localStorage.setItem(storedActivityAttemptsKey, JSON.stringify(nextAttempts));

  return attempt;
}
