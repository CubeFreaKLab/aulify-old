import type { Activity, ActivityAttempt } from "./mock/activities";
import { getCurrentStudentActivityAttempt, getPublishedActivities } from "./mock/activities";
import type { Course } from "./mock/courses";
import type { Note } from "./mock/notes";
import { getPublishedNotes } from "./mock/notes";
import type { Task, TaskSubmission } from "./mock/tasks";
import { getCurrentStudentSubmission, getPublishedTasks } from "./mock/tasks";

export type ProgressDataset = {
  activities: Activity[];
  activityAttempts: ActivityAttempt[];
  courses: Course[];
  notes: Note[];
  taskSubmissions: TaskSubmission[];
  tasks: Task[];
};

export type TeacherProgressSummary = {
  activeCourses: number;
  activitiesCompleted: number;
  activityParticipation: number;
  completionRate: number;
  pendingTasks: number;
  publishedTasks: number;
  submissionsReceived: number;
};

export type StudentProgressSummary = {
  activitiesCompleted: number;
  coursesEnrolled: number;
  generalProgress: number;
  tasksSubmitted: number;
};

export type TeacherCourseProgress = {
  activityCount: number;
  courseId: string;
  groupLabel: string;
  groupsCount: number;
  name: string;
  progress: number;
  studentsCount: number;
  taskCount: number;
};

export type StudentCourseProgress = {
  completedActivities: number;
  courseId: string;
  name: string;
  notesCount: number;
  pendingTasks: number;
  progress: number;
};

export type ProgressFeedItem = {
  detail: string;
  id: string;
  label: string;
  submittedAt: string;
  title: string;
};

export type PendingProgressItem = {
  detail: string;
  href: string;
  id: string;
  label: string;
  title: string;
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function percent(part: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return clampPercent((part / total) * 100);
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return clampPercent(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function sortBySubmittedAtDesc<T extends { submittedAt: string }>(items: T[]) {
  return [...items].sort((firstItem, secondItem) => new Date(secondItem.submittedAt).getTime() - new Date(firstItem.submittedAt).getTime());
}

export function formatProgressDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function calculateCourseProgress(
  course: Course,
  tasks: Task[],
  taskSubmissions: TaskSubmission[],
  activities: Activity[],
  activityAttempts: ActivityAttempt[]
) {
  const courseTasks = tasks.filter((task) => task.courseId === course.id && task.status === "published");
  const courseActivities = activities.filter((activity) => activity.courseId === course.id && activity.status === "published");
  const taskCompletion = courseTasks.length
    ? percent(
        courseTasks.filter((task) => taskSubmissions.some((submission) => submission.taskId === task.id)).length,
        courseTasks.length
      )
    : course.progress.value;
  const activityCompletion = courseActivities.length
    ? percent(
        courseActivities.filter((activity) => activityAttempts.some((attempt) => attempt.activityId === activity.id)).length,
        courseActivities.length
      )
    : course.progress.value;

  return average([course.progress.value, taskCompletion, activityCompletion]);
}

export function getTeacherProgressSummary(dataset: ProgressDataset): TeacherProgressSummary {
  const publishedTasks = dataset.tasks.filter((task) => task.status === "published");
  const publishedActivities = dataset.activities.filter((activity) => activity.status === "published");
  const pendingTasks = publishedTasks.filter(
    (task) => !dataset.taskSubmissions.some((submission) => submission.taskId === task.id)
  ).length;

  return {
    activeCourses: dataset.courses.filter((course) => course.status !== "completed").length,
    activitiesCompleted: dataset.activityAttempts.length,
    activityParticipation: percent(dataset.activityAttempts.length, publishedActivities.length),
    completionRate: percent(dataset.taskSubmissions.length + dataset.activityAttempts.length, publishedTasks.length + publishedActivities.length),
    pendingTasks,
    publishedTasks: publishedTasks.length,
    submissionsReceived: dataset.taskSubmissions.length
  };
}

export function getStudentProgressSummary(dataset: ProgressDataset): StudentProgressSummary {
  const publishedTasks = getPublishedTasks(dataset.tasks);
  const publishedActivities = getPublishedActivities(dataset.activities);
  const tasksSubmitted = publishedTasks.filter((task) => getCurrentStudentSubmission(task.id, dataset.taskSubmissions)).length;
  const activitiesCompleted = publishedActivities.filter((activity) =>
    getCurrentStudentActivityAttempt(activity.id, dataset.activityAttempts)
  ).length;
  const courseAverage = average(dataset.courses.map((course) => course.progress.value));
  const taskRate = percent(tasksSubmitted, publishedTasks.length);
  const activityRate = percent(activitiesCompleted, publishedActivities.length);

  return {
    activitiesCompleted,
    coursesEnrolled: dataset.courses.length,
    generalProgress: average([courseAverage, taskRate, activityRate]),
    tasksSubmitted
  };
}

export function getTeacherCourseProgress(dataset: ProgressDataset): TeacherCourseProgress[] {
  return dataset.courses.map((course) => {
    const courseTasks = dataset.tasks.filter((task) => task.courseId === course.id);
    const courseActivities = dataset.activities.filter((activity) => activity.courseId === course.id);

    return {
      activityCount: courseActivities.length,
      courseId: course.id,
      groupLabel: course.groupLabel,
      groupsCount: course.groupsCount,
      name: course.name,
      progress: calculateCourseProgress(course, dataset.tasks, dataset.taskSubmissions, dataset.activities, dataset.activityAttempts),
      studentsCount: course.studentsCount,
      taskCount: courseTasks.length
    };
  });
}

export function getStudentCourseProgress(dataset: ProgressDataset): StudentCourseProgress[] {
  const publishedNotes = getPublishedNotes(dataset.notes);
  const publishedTasks = getPublishedTasks(dataset.tasks);
  const publishedActivities = getPublishedActivities(dataset.activities);

  return dataset.courses.map((course) => {
    const courseTasks = publishedTasks.filter((task) => task.courseId === course.id);
    const courseActivities = publishedActivities.filter((activity) => activity.courseId === course.id);

    return {
      completedActivities: courseActivities.filter((activity) => getCurrentStudentActivityAttempt(activity.id, dataset.activityAttempts)).length,
      courseId: course.id,
      name: course.name,
      notesCount: publishedNotes.filter((note) => note.courseId === course.id).length,
      pendingTasks: courseTasks.filter((task) => !getCurrentStudentSubmission(task.id, dataset.taskSubmissions)).length,
      progress: calculateCourseProgress(course, publishedTasks, dataset.taskSubmissions, publishedActivities, dataset.activityAttempts)
    };
  });
}

export function getTeacherRecentProgress(dataset: ProgressDataset): ProgressFeedItem[] {
  const courseNames = new Map(dataset.courses.map((course) => [course.id, course.name]));
  const taskCourseById = new Map(dataset.tasks.map((task) => [task.id, task.courseId]));
  const activityCourseById = new Map(dataset.activities.map((activity) => [activity.id, activity.courseId]));

  const submissions = dataset.taskSubmissions.map<ProgressFeedItem>((submission) => ({
    detail: `${courseNames.get(taskCourseById.get(submission.taskId) ?? "") ?? "Curso"} · ${submission.studentName}`,
    id: `submission-${submission.id}`,
    label: "Entrega recibida",
    submittedAt: submission.submittedAt,
    title: submission.content
  }));
  const attempts = dataset.activityAttempts.map<ProgressFeedItem>((attempt) => ({
    detail: `${courseNames.get(activityCourseById.get(attempt.activityId) ?? "") ?? "Curso"} · ${attempt.studentName}`,
    id: `attempt-${attempt.id}`,
    label: "Actividad completada",
    submittedAt: attempt.submittedAt,
    title: attempt.score === undefined ? "Respuesta registrada" : `Resultado ${attempt.score}%`
  }));

  return sortBySubmittedAtDesc([...submissions, ...attempts]).slice(0, 6);
}

export function getStudentRecentProgress(dataset: ProgressDataset): ProgressFeedItem[] {
  const currentTaskSubmissions = dataset.taskSubmissions.filter((submission) => getCurrentStudentSubmission(submission.taskId, [submission]));
  const currentActivityAttempts = dataset.activityAttempts.filter((attempt) =>
    getCurrentStudentActivityAttempt(attempt.activityId, [attempt])
  );

  return getTeacherRecentProgress({
    ...dataset,
    activityAttempts: currentActivityAttempts,
    taskSubmissions: currentTaskSubmissions
  });
}

export function getStudentPendingProgress(dataset: ProgressDataset): PendingProgressItem[] {
  const publishedTasks = getPublishedTasks(dataset.tasks);
  const publishedActivities = getPublishedActivities(dataset.activities);
  const courseNames = new Map(dataset.courses.map((course) => [course.id, course.name]));
  const pendingTasks = publishedTasks
    .filter((task) => !getCurrentStudentSubmission(task.id, dataset.taskSubmissions))
    .map<PendingProgressItem>((task) => ({
      detail: `${courseNames.get(task.courseId) ?? "Curso"} · vence ${formatProgressDate(`${task.dueDate}T12:00:00`)}`,
      href: `/student/courses/${task.courseId}/tasks/${task.id}`,
      id: `task-${task.id}`,
      label: "Tarea pendiente",
      title: task.title
    }));
  const pendingActivities = publishedActivities
    .filter((activity) => !getCurrentStudentActivityAttempt(activity.id, dataset.activityAttempts))
    .map<PendingProgressItem>((activity) => ({
      detail: courseNames.get(activity.courseId) ?? "Curso",
      href: `/student/courses/${activity.courseId}/activities/${activity.id}`,
      id: `activity-${activity.id}`,
      label: "Actividad pendiente",
      title: activity.title
    }));

  return [...pendingTasks, ...pendingActivities].slice(0, 8);
}
