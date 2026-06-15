import { isFirebaseDataSource } from "../config/dataSource";
import { currentStudentSubmissionIdentity } from "../mock/tasks";
import {
  emptyProgressDataset,
  getStudentProgress as calculateStudentProgress,
  getTeacherProgress as calculateTeacherProgress,
  type AcademicStudent,
  type CourseRoster,
  type ProgressDataset
} from "../progress";
import {
  getActivityAttempts,
  getActivityAttemptsAsync,
  getActivities,
  getActivitiesAsync,
  getInitialActivityAttempts,
  getInitialActivities
} from "./activityRepository";
import {
  getAttendanceRecordsBySessionId,
  getAttendanceRecordsBySessionIdAsync,
  getAttendanceSessionsByCourseId,
  getAttendanceSessionsByCourseIdAsync,
  getCourseAttendanceRoster,
  getCourseAttendanceRosterAsync,
  getInitialAttendanceRecordsBySessionId,
  getInitialAttendanceSessionsByCourseId
} from "./attendanceRepository";
import { getCurrentSession, getCurrentSessionAsync } from "./authRepository";
import { getCourses, getCoursesAsync, getInitialCourses, type Course } from "./courseRepository";
import {
  getInitialTaskSubmissions,
  getInitialTasks,
  getTaskSubmissions,
  getTaskSubmissionsAsync,
  getTasks,
  getTasksAsync
} from "./taskRepository";

export type { ProgressDataset };

function createMockStudent(): AcademicStudent {
  return {
    email: currentStudentSubmissionIdentity.email,
    id: "student-demo",
    name: currentStudentSubmissionIdentity.name
  };
}

function getCurrentAcademicStudent(): AcademicStudent | undefined {
  const session = getCurrentSession();

  if (session?.role === "student") {
    return {
      email: session.email,
      id: session.id,
      name: session.name
    };
  }

  return createMockStudent();
}

async function getCurrentAcademicStudentAsync(): Promise<AcademicStudent | undefined> {
  if (!isFirebaseDataSource()) {
    return getCurrentAcademicStudent();
  }

  const session = await getCurrentSessionAsync();

  if (session?.role !== "student") {
    return undefined;
  }

  return {
    email: session.email,
    id: session.id,
    name: session.name
  };
}

function getInitialAttendanceForCourses(courses: Course[], includeRosters: boolean) {
  const attendanceSessions = courses.flatMap((course) => getInitialAttendanceSessionsByCourseId(course.id));
  const attendanceRecords = attendanceSessions.flatMap((session) => getInitialAttendanceRecordsBySessionId(session.id));
  const attendanceRosters = includeRosters
    ? courses.map((course) => ({
        courseId: course.id,
        students: getCourseAttendanceRoster(course.id)
      }))
    : [];

  return { attendanceRecords, attendanceRosters, attendanceSessions };
}

function getAttendanceForCourses(courses: Course[], includeRosters: boolean) {
  const attendanceSessions = courses.flatMap((course) => getAttendanceSessionsByCourseId(course.id));
  const attendanceRecords = attendanceSessions.flatMap((session) => getAttendanceRecordsBySessionId(session.id));
  const attendanceRosters = includeRosters
    ? courses.map((course) => ({
        courseId: course.id,
        students: getCourseAttendanceRoster(course.id)
      }))
    : [];

  return { attendanceRecords, attendanceRosters, attendanceSessions };
}

async function getAttendanceForCoursesAsync(courses: Course[], includeRosters: boolean) {
  const attendanceSessions = (
    await Promise.all(courses.map((course) => getAttendanceSessionsByCourseIdAsync(course.id).catch(() => [])))
  ).flat();
  const attendanceRecords = (
    await Promise.all(attendanceSessions.map((session) => getAttendanceRecordsBySessionIdAsync(session.id).catch(() => [])))
  ).flat();
  const attendanceRosters: CourseRoster[] = includeRosters
    ? await Promise.all(
        courses.map(async (course) => ({
          courseId: course.id,
          students: await getCourseAttendanceRosterAsync(course.id).catch(() => [])
        }))
      )
    : [];

  return { attendanceRecords, attendanceRosters, attendanceSessions };
}

export function getTeacherProgressDataset(): ProgressDataset {
  const courses = getCourses("teacher");

  return {
    activities: getActivities(),
    activityAttempts: getActivityAttempts(),
    courses,
    ...getAttendanceForCourses(courses, true),
    taskSubmissions: getTaskSubmissions(),
    tasks: getTasks()
  };
}

export function getInitialTeacherProgressDataset(): ProgressDataset {
  const courses = getInitialCourses("teacher");

  return {
    activities: getInitialActivities(),
    activityAttempts: getInitialActivityAttempts(),
    courses,
    ...getInitialAttendanceForCourses(courses, true),
    taskSubmissions: getInitialTaskSubmissions(),
    tasks: getInitialTasks()
  };
}

export async function getTeacherProgressDatasetAsync(): Promise<ProgressDataset> {
  if (!isFirebaseDataSource()) {
    return getTeacherProgressDataset();
  }

  const [courses, tasks, taskSubmissions, activities, activityAttempts] = await Promise.all([
    getCoursesAsync("teacher"),
    getTasksAsync(),
    getTaskSubmissionsAsync(),
    getActivitiesAsync(),
    getActivityAttemptsAsync()
  ]);

  return {
    activities,
    activityAttempts,
    courses,
    ...(await getAttendanceForCoursesAsync(courses, true)),
    taskSubmissions,
    tasks
  };
}

export function getStudentProgressDataset(): ProgressDataset {
  const courses = getCourses("student");

  return {
    activities: getActivities({ publishedOnly: true }),
    activityAttempts: getActivityAttempts(),
    courses,
    currentStudent: getCurrentAcademicStudent(),
    ...getAttendanceForCourses(courses, false),
    taskSubmissions: getTaskSubmissions(),
    tasks: getTasks({ publishedOnly: true })
  };
}

export function getInitialStudentProgressDataset(): ProgressDataset {
  const courses = getInitialCourses("student");

  return {
    activities: getInitialActivities({ publishedOnly: true }),
    activityAttempts: getInitialActivityAttempts(),
    courses,
    currentStudent: createMockStudent(),
    ...getInitialAttendanceForCourses(courses, false),
    taskSubmissions: getInitialTaskSubmissions(),
    tasks: getInitialTasks({ publishedOnly: true })
  };
}

export async function getStudentProgressDatasetAsync(): Promise<ProgressDataset> {
  if (!isFirebaseDataSource()) {
    return getStudentProgressDataset();
  }

  const [courses, tasks, taskSubmissions, activities, activityAttempts, currentStudent] = await Promise.all([
    getCoursesAsync("student"),
    getTasksAsync({ publishedOnly: true }),
    getTaskSubmissionsAsync(),
    getActivitiesAsync({ publishedOnly: true }),
    getActivityAttemptsAsync(),
    getCurrentAcademicStudentAsync()
  ]);

  return {
    activities,
    activityAttempts,
    courses,
    currentStudent,
    ...(await getAttendanceForCoursesAsync(courses, false)),
    taskSubmissions,
    tasks
  };
}

export function getTeacherProgress(dataset: ProgressDataset = emptyProgressDataset) {
  return calculateTeacherProgress(dataset);
}

export function getStudentProgress(dataset: ProgressDataset = emptyProgressDataset) {
  return calculateStudentProgress(dataset);
}
