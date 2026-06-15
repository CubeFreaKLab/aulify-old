import type { Activity, ActivityAttempt } from "./mock/activities";
import { currentStudentActivityIdentity, getPublishedActivities } from "./mock/activities";
import type { AttendanceRecord, AttendanceSession, AttendanceStudent } from "./mock/attendance";
import { calculateAttendancePercentage, countAttendanceStatuses } from "./mock/attendance";
import type { Course } from "./mock/courses";
import type { Task, TaskSubmission } from "./mock/tasks";
import { currentStudentSubmissionIdentity, getPublishedTasks } from "./mock/tasks";

export type AcademicStudent = {
  email?: string;
  id: string;
  name: string;
};

export type CourseRoster = {
  courseId: string;
  students: AttendanceStudent[];
};

export type ProgressDataset = {
  activities: Activity[];
  activityAttempts: ActivityAttempt[];
  attendanceRecords: AttendanceRecord[];
  attendanceRosters: CourseRoster[];
  attendanceSessions: AttendanceSession[];
  courses: Course[];
  currentStudent?: AcademicStudent;
  taskSubmissions: TaskSubmission[];
  tasks: Task[];
};

export type TeacherTrackingSummary = {
  activeCourses: number;
  activityAttemptsReceived: number;
  activityParticipationRate: number;
  averageAttendance: number;
  expectedActivityAttempts: number;
  expectedSubmissions: number;
  submissionsReceived: number;
  taskSubmissionRate: number;
  totalActiveStudents: number;
};

export type TeacherCourseTracking = {
  academicParticipation: number;
  activityCount: number;
  activityParticipationRate: number;
  attendanceRate: number;
  courseId: string;
  name: string;
  studentsCount: number;
  taskCount: number;
  taskSubmissionRate: number;
};

export type RiskStudent = {
  attendancePercentage?: number;
  courseId: string;
  courseName: string;
  detail: string;
  id: string;
  missingActivities: number;
  missingTasks: number;
  signals: string[];
  studentName: string;
};

export type StudentTrackingSummary = {
  academicAdvancement: number;
  activitiesCompleted: number;
  activityCompletionRate: number;
  attendancePercentage: number;
  averagePerformance?: number;
  coursesEnrolled: number;
  publishedActivities: number;
  publishedTasks: number;
  taskCompletionRate: number;
  tasksSubmitted: number;
};

export type StudentCourseTracking = {
  academicAdvancement: number;
  activityCompletionRate: number;
  attendancePercentage: number;
  courseId: string;
  name: string;
  pendingActivities: number;
  pendingTasks: number;
  taskCompletionRate: number;
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

export const emptyProgressDataset: ProgressDataset = {
  activities: [],
  activityAttempts: [],
  attendanceRecords: [],
  attendanceRosters: [],
  attendanceSessions: [],
  courses: [],
  taskSubmissions: [],
  tasks: []
};

export function formatProgressDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function percent(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function average(values: number[]) {
  const usableValues = values.filter((value) => Number.isFinite(value));

  if (!usableValues.length) {
    return 0;
  }

  return Math.round(usableValues.reduce((sum, value) => sum + value, 0) / usableValues.length);
}

function getCourseIds(courses: Course[]) {
  return new Set(courses.map((course) => course.id));
}

function getCourseById(dataset: ProgressDataset, courseId: string) {
  return dataset.courses.find((course) => course.id === courseId);
}

function getPublishedCourseTasks(dataset: ProgressDataset, courseId: string) {
  return getPublishedTasks(dataset.tasks).filter((task) => task.courseId === courseId);
}

function getPublishedCourseActivities(dataset: ProgressDataset, courseId: string) {
  return getPublishedActivities(dataset.activities).filter((activity) => activity.courseId === courseId);
}

function getCourseRoster(dataset: ProgressDataset, course: Course) {
  const roster = dataset.attendanceRosters.find((item) => item.courseId === course.id)?.students ?? [];

  if (roster.length) {
    return roster;
  }

  return Array.from({ length: course.studentsCount }, (_, index) => ({
    email: "",
    id: `${course.id}-student-${index + 1}`,
    name: `Estudiante ${index + 1}`
  }));
}

function getTaskCourseId(taskById: Map<string, Task>, submission: TaskSubmission) {
  return submission.courseId ?? taskById.get(submission.taskId)?.courseId;
}

function getActivityCourseId(activityById: Map<string, Activity>, attempt: ActivityAttempt) {
  return attempt.courseId ?? activityById.get(attempt.activityId)?.courseId;
}

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesStudentIdentity(
  candidate: { studentEmail?: string; studentId?: string; studentName: string },
  student?: AcademicStudent
) {
  if (!student) {
    return (
      normalize(candidate.studentEmail) === currentStudentSubmissionIdentity.email ||
      candidate.studentName === currentStudentSubmissionIdentity.name ||
      candidate.studentName === currentStudentActivityIdentity.name
    );
  }

  return (
    Boolean(candidate.studentId && candidate.studentId === student.id) ||
    Boolean(candidate.studentEmail && normalize(candidate.studentEmail) === normalize(student.email)) ||
    candidate.studentName === student.name
  );
}

function matchesActivityStudent(attempt: ActivityAttempt, student?: AcademicStudent) {
  if (!student) {
    return attempt.studentName === currentStudentActivityIdentity.name || attempt.studentName === currentStudentSubmissionIdentity.name;
  }

  return Boolean(attempt.studentId && attempt.studentId === student.id) || attempt.studentName === student.name;
}

function matchesAttendanceStudent(record: AttendanceRecord, student?: AcademicStudent) {
  if (!student) {
    return record.studentId === "student-demo" || record.studentName === currentStudentSubmissionIdentity.name;
  }

  return record.studentId === student.id || record.studentName === student.name;
}

function getAttendanceRate(records: AttendanceRecord[]) {
  if (!records.length) {
    return 0;
  }

  return calculateAttendancePercentage(countAttendanceStatuses(records));
}

function getStudentAttendanceRecords(dataset: ProgressDataset, courseId?: string) {
  return dataset.attendanceRecords.filter(
    (record) => (!courseId || record.courseId === courseId) && matchesAttendanceStudent(record, dataset.currentStudent)
  );
}

function getCompletedTaskIds(dataset: ProgressDataset, courseId?: string) {
  const taskById = new Map(dataset.tasks.map((task) => [task.id, task]));

  return new Set(
    dataset.taskSubmissions
      .filter((submission) => matchesStudentIdentity(submission, dataset.currentStudent))
      .filter((submission) => !courseId || getTaskCourseId(taskById, submission) === courseId)
      .map((submission) => submission.taskId)
  );
}

function getCompletedActivityIds(dataset: ProgressDataset, courseId?: string) {
  const activityById = new Map(dataset.activities.map((activity) => [activity.id, activity]));

  return new Set(
    dataset.activityAttempts
      .filter((attempt) => matchesActivityStudent(attempt, dataset.currentStudent))
      .filter((attempt) => !courseId || getActivityCourseId(activityById, attempt) === courseId)
      .map((attempt) => attempt.activityId)
  );
}

function getScoreAverage(scores: Array<number | undefined>) {
  const numericScores = scores.filter((score): score is number => typeof score === "number");

  if (!numericScores.length) {
    return undefined;
  }

  return average(numericScores);
}

export function getTeacherTrackingSummary(dataset: ProgressDataset): TeacherTrackingSummary {
  const activeCourses = dataset.courses.filter((course) => course.status !== "completed");
  const taskById = new Map(dataset.tasks.map((task) => [task.id, task]));
  const activityById = new Map(dataset.activities.map((activity) => [activity.id, activity]));
  const courseIds = getCourseIds(activeCourses);
  const publishedTasks = getPublishedTasks(dataset.tasks).filter((task) => courseIds.has(task.courseId));
  const publishedActivities = getPublishedActivities(dataset.activities).filter((activity) => courseIds.has(activity.courseId));
  const totalActiveStudents = activeCourses.reduce((sum, course) => sum + getCourseRoster(dataset, course).length, 0);
  const expectedSubmissions = activeCourses.reduce(
    (sum, course) => sum + getPublishedCourseTasks(dataset, course.id).length * getCourseRoster(dataset, course).length,
    0
  );
  const expectedActivityAttempts = activeCourses.reduce(
    (sum, course) => sum + getPublishedCourseActivities(dataset, course.id).length * getCourseRoster(dataset, course).length,
    0
  );
  const publishedTaskIds = new Set(publishedTasks.map((task) => task.id));
  const publishedActivityIds = new Set(publishedActivities.map((activity) => activity.id));
  const submissionsReceived = dataset.taskSubmissions.filter((submission) => {
    const courseId = getTaskCourseId(taskById, submission);
    return publishedTaskIds.has(submission.taskId) && Boolean(courseId && courseIds.has(courseId));
  }).length;
  const activityAttemptsReceived = dataset.activityAttempts.filter((attempt) => {
    const courseId = getActivityCourseId(activityById, attempt);
    return publishedActivityIds.has(attempt.activityId) && Boolean(courseId && courseIds.has(courseId));
  }).length;

  return {
    activeCourses: activeCourses.length,
    activityAttemptsReceived,
    activityParticipationRate: percent(activityAttemptsReceived, expectedActivityAttempts),
    averageAttendance: getAttendanceRate(dataset.attendanceRecords.filter((record) => courseIds.has(record.courseId))),
    expectedActivityAttempts,
    expectedSubmissions,
    submissionsReceived,
    taskSubmissionRate: percent(submissionsReceived, expectedSubmissions),
    totalActiveStudents
  };
}

export function getTeacherCourseTracking(dataset: ProgressDataset): TeacherCourseTracking[] {
  return dataset.courses.map((course) => {
    const roster = getCourseRoster(dataset, course);
    const publishedTasks = getPublishedCourseTasks(dataset, course.id);
    const publishedActivities = getPublishedCourseActivities(dataset, course.id);
    const taskIds = new Set(publishedTasks.map((task) => task.id));
    const activityIds = new Set(publishedActivities.map((activity) => activity.id));
    const submissions = dataset.taskSubmissions.filter((submission) => taskIds.has(submission.taskId)).length;
    const attempts = dataset.activityAttempts.filter((attempt) => activityIds.has(attempt.activityId)).length;
    const attendanceRecords = dataset.attendanceRecords.filter((record) => record.courseId === course.id);
    const taskSubmissionRate = percent(submissions, publishedTasks.length * roster.length);
    const activityParticipationRate = percent(attempts, publishedActivities.length * roster.length);
    const attendanceRate = getAttendanceRate(attendanceRecords);
    const participationInputs = [
      publishedTasks.length ? taskSubmissionRate : undefined,
      publishedActivities.length ? activityParticipationRate : undefined,
      attendanceRecords.length ? attendanceRate : undefined
    ].filter((value): value is number => typeof value === "number");

    return {
      academicParticipation: average(participationInputs),
      activityCount: publishedActivities.length,
      activityParticipationRate,
      attendanceRate,
      courseId: course.id,
      name: course.name,
      studentsCount: roster.length,
      taskCount: publishedTasks.length,
      taskSubmissionRate
    };
  });
}

export function getRiskStudents(dataset: ProgressDataset): RiskStudent[] {
  return dataset.courses
    .flatMap((course) => {
      const roster = getCourseRoster(dataset, course);
      const publishedTasks = getPublishedCourseTasks(dataset, course.id);
      const publishedActivities = getPublishedCourseActivities(dataset, course.id);
      const taskSubmissionsByStudent = new Map<string, Set<string>>();
      const activityAttemptsByStudent = new Map<string, Set<string>>();

      dataset.taskSubmissions.forEach((submission) => {
        if (!publishedTasks.some((task) => task.id === submission.taskId)) {
          return;
        }

        const studentKey = submission.studentId ?? normalize(submission.studentEmail) ?? submission.studentName;
        const existing = taskSubmissionsByStudent.get(studentKey) ?? new Set<string>();
        existing.add(submission.taskId);
        taskSubmissionsByStudent.set(studentKey, existing);
      });

      dataset.activityAttempts.forEach((attempt) => {
        if (!publishedActivities.some((activity) => activity.id === attempt.activityId)) {
          return;
        }

        const studentKey = attempt.studentId ?? attempt.studentName;
        const existing = activityAttemptsByStudent.get(studentKey) ?? new Set<string>();
        existing.add(attempt.activityId);
        activityAttemptsByStudent.set(studentKey, existing);
      });

      return roster.flatMap((student) => {
        const studentTaskKeys = [student.id, normalize(student.email), student.name];
        const submittedTaskIds = new Set(studentTaskKeys.flatMap((key) => [...(taskSubmissionsByStudent.get(key) ?? [])]));
        const attemptedActivityIds = new Set(studentTaskKeys.flatMap((key) => [...(activityAttemptsByStudent.get(key) ?? [])]));
        const attendanceRecords = dataset.attendanceRecords.filter(
          (record) => record.courseId === course.id && (record.studentId === student.id || record.studentName === student.name)
        );
        const attendancePercentage = attendanceRecords.length ? getAttendanceRate(attendanceRecords) : undefined;
        const missingTasks = Math.max(0, publishedTasks.length - submittedTaskIds.size);
        const missingActivities = Math.max(0, publishedActivities.length - attemptedActivityIds.size);
        const signals = [
          attendancePercentage !== undefined && attendancePercentage < 75 ? "asistencia baja" : "",
          missingTasks > 0 ? "tareas pendientes" : "",
          missingActivities > 0 ? "actividades sin completar" : ""
        ].filter(Boolean);

        if (!signals.length) {
          return [];
        }

        return [
          {
            attendancePercentage,
            courseId: course.id,
            courseName: course.name,
            detail: signals.join(" · "),
            id: `${course.id}-${student.id}`,
            missingActivities,
            missingTasks,
            signals,
            studentName: student.name
          }
        ];
      });
    })
    .slice(0, 8);
}

export function getTeacherRecentProgress(dataset: ProgressDataset): ProgressFeedItem[] {
  const taskById = new Map(dataset.tasks.map((task) => [task.id, task]));
  const activityById = new Map(dataset.activities.map((activity) => [activity.id, activity]));
  const courseById = new Map(dataset.courses.map((course) => [course.id, course]));
  const taskItems = dataset.taskSubmissions.map((submission) => {
    const task = taskById.get(submission.taskId);
    const course = task ? courseById.get(task.courseId) : undefined;

    return {
      detail: `${submission.studentName} · ${course?.name ?? "Curso"}`,
      id: `submission-${submission.id}`,
      label: "Entrega de tarea",
      submittedAt: submission.submittedAt,
      title: task?.title ?? "Tarea"
    };
  });
  const activityItems = dataset.activityAttempts.map((attempt) => {
    const activity = activityById.get(attempt.activityId);
    const course = activity ? courseById.get(activity.courseId) : undefined;

    return {
      detail: `${attempt.studentName} · ${course?.name ?? "Curso"}`,
      id: `attempt-${attempt.id}`,
      label: "Actividad completada",
      submittedAt: attempt.submittedAt,
      title: activity?.title ?? "Actividad"
    };
  });

  return [...taskItems, ...activityItems]
    .sort((first, second) => new Date(second.submittedAt).getTime() - new Date(first.submittedAt).getTime())
    .slice(0, 6);
}

export function getTeacherProgress(dataset: ProgressDataset) {
  return {
    courseTracking: getTeacherCourseTracking(dataset),
    recentProgress: getTeacherRecentProgress(dataset),
    riskStudents: getRiskStudents(dataset),
    summary: getTeacherTrackingSummary(dataset)
  };
}

export function getStudentTrackingSummary(dataset: ProgressDataset): StudentTrackingSummary {
  const courseIds = getCourseIds(dataset.courses);
  const publishedTasks = getPublishedTasks(dataset.tasks).filter((task) => courseIds.has(task.courseId));
  const publishedActivities = getPublishedActivities(dataset.activities).filter((activity) => courseIds.has(activity.courseId));
  const completedTaskIds = getCompletedTaskIds(dataset);
  const completedActivityIds = getCompletedActivityIds(dataset);
  const studentTaskSubmissions = dataset.taskSubmissions.filter((submission) =>
    matchesStudentIdentity(submission, dataset.currentStudent)
  );
  const studentActivityAttempts = dataset.activityAttempts.filter((attempt) => matchesActivityStudent(attempt, dataset.currentStudent));
  const taskCompletionRate = percent(completedTaskIds.size, publishedTasks.length);
  const activityCompletionRate = percent(completedActivityIds.size, publishedActivities.length);
  const advancementInputs = [
    publishedTasks.length ? taskCompletionRate : undefined,
    publishedActivities.length ? activityCompletionRate : undefined
  ].filter((value): value is number => typeof value === "number");
  const performanceScores = [
    ...studentTaskSubmissions.map((submission) => submission.score),
    ...studentActivityAttempts.map((attempt) => attempt.score)
  ];

  return {
    academicAdvancement: average(advancementInputs),
    activitiesCompleted: completedActivityIds.size,
    activityCompletionRate,
    attendancePercentage: getAttendanceRate(getStudentAttendanceRecords(dataset)),
    averagePerformance: getScoreAverage(performanceScores),
    coursesEnrolled: dataset.courses.length,
    publishedActivities: publishedActivities.length,
    publishedTasks: publishedTasks.length,
    taskCompletionRate,
    tasksSubmitted: completedTaskIds.size
  };
}

export function getStudentCourseTracking(dataset: ProgressDataset): StudentCourseTracking[] {
  return dataset.courses.map((course) => {
    const publishedTasks = getPublishedCourseTasks(dataset, course.id);
    const publishedActivities = getPublishedCourseActivities(dataset, course.id);
    const completedTaskIds = getCompletedTaskIds(dataset, course.id);
    const completedActivityIds = getCompletedActivityIds(dataset, course.id);
    const taskCompletionRate = percent(completedTaskIds.size, publishedTasks.length);
    const activityCompletionRate = percent(completedActivityIds.size, publishedActivities.length);
    const advancementInputs = [
      publishedTasks.length ? taskCompletionRate : undefined,
      publishedActivities.length ? activityCompletionRate : undefined
    ].filter((value): value is number => typeof value === "number");

    return {
      academicAdvancement: average(advancementInputs),
      activityCompletionRate,
      attendancePercentage: getAttendanceRate(getStudentAttendanceRecords(dataset, course.id)),
      courseId: course.id,
      name: course.name,
      pendingActivities: Math.max(0, publishedActivities.length - completedActivityIds.size),
      pendingTasks: Math.max(0, publishedTasks.length - completedTaskIds.size),
      taskCompletionRate
    };
  });
}

export function getStudentPendingProgress(dataset: ProgressDataset): PendingProgressItem[] {
  const completedTaskIds = getCompletedTaskIds(dataset);
  const completedActivityIds = getCompletedActivityIds(dataset);
  const courseById = new Map(dataset.courses.map((course) => [course.id, course]));
  const pendingTasks = getPublishedTasks(dataset.tasks)
    .filter((task) => courseById.has(task.courseId) && !completedTaskIds.has(task.id))
    .map((task) => ({
      detail: `${courseById.get(task.courseId)?.name ?? "Curso"} · vence ${formatProgressDate(task.dueDate)}`,
      href: `/student/courses/${task.courseId}/tasks/${task.id}`,
      id: `task-${task.id}`,
      label: "Pendiente",
      title: task.title
    }));
  const pendingActivities = getPublishedActivities(dataset.activities)
    .filter((activity) => courseById.has(activity.courseId) && !completedActivityIds.has(activity.id))
    .map((activity) => ({
      detail: courseById.get(activity.courseId)?.name ?? "Curso",
      href: `/student/courses/${activity.courseId}/activities/${activity.id}`,
      id: `activity-${activity.id}`,
      label: "Pendiente",
      title: activity.title
    }));

  return [...pendingTasks, ...pendingActivities].slice(0, 8);
}

export function getStudentRecentProgress(dataset: ProgressDataset): ProgressFeedItem[] {
  const taskById = new Map(dataset.tasks.map((task) => [task.id, task]));
  const activityById = new Map(dataset.activities.map((activity) => [activity.id, activity]));
  const taskItems = dataset.taskSubmissions
    .filter((submission) => matchesStudentIdentity(submission, dataset.currentStudent))
    .map((submission) => ({
      detail: "Completado",
      id: `submission-${submission.id}`,
      label: "Tarea entregada",
      submittedAt: submission.submittedAt,
      title: taskById.get(submission.taskId)?.title ?? "Tarea"
    }));
  const activityItems = dataset.activityAttempts
    .filter((attempt) => matchesActivityStudent(attempt, dataset.currentStudent))
    .map((attempt) => ({
      detail: typeof attempt.score === "number" ? `Puntaje ${attempt.score}%` : "Completado",
      id: `attempt-${attempt.id}`,
      label: "Actividad completada",
      submittedAt: attempt.submittedAt,
      title: activityById.get(attempt.activityId)?.title ?? "Actividad"
    }));

  return [...taskItems, ...activityItems]
    .sort((first, second) => new Date(second.submittedAt).getTime() - new Date(first.submittedAt).getTime())
    .slice(0, 6);
}

export function getStudentProgress(dataset: ProgressDataset) {
  return {
    courseTracking: getStudentCourseTracking(dataset),
    pendingItems: getStudentPendingProgress(dataset),
    recentProgress: getStudentRecentProgress(dataset),
    summary: getStudentTrackingSummary(dataset)
  };
}
