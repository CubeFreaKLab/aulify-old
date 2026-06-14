import type { Course as FirebaseCourse } from "@aulify/shared-types";
import { isFirebaseDataSource } from "../config/dataSource";
import { courseFirebaseAdapter, getCourseByJoinCode } from "../firebase/adapters/courseFirebaseAdapter";
import { courseMemberFirebaseAdapter } from "../firebase/adapters/courseMemberFirebaseAdapter";
import {
  findCourseById,
  studentCourses,
  teacherCourses,
  type Course,
  type CourseRole
} from "../mock/courses";
import { createStoredTeacherCourse, readStoredTeacherCourses, type StoredCourseInput } from "../courseStorage";
import { getCurrentSessionAsync } from "./authRepository";

export type { Course, CourseRole, StoredCourseInput };

function timestampToUpdatedLabel(value: FirebaseCourse["updatedAt"]) {
  if (typeof value === "string") {
    return "Actualizado recientemente";
  }

  if (value instanceof Date) {
    return "Actualizado recientemente";
  }

  return "Actualizado recientemente";
}

function mapFirebaseCourseToUiCourse(course: FirebaseCourse, role: CourseRole, teacherName = "Equipo docente"): Course {
  return {
    activities: [],
    activitiesCount: 0,
    contents: [],
    contentsCount: 0,
    description: course.description,
    groupLabel: course.subject || "Curso",
    groupsCount: 1,
    id: course.id,
    joinCode: course.joinCode,
    name: course.title,
    pendingActivitiesCount: 0,
    pendingTasksCount: 0,
    progress: { label: "0%", value: 0 },
    role,
    status: course.status === "archived" ? "completed" : course.status,
    studentsCount: 0,
    tasks: [],
    tasksCount: 0,
    teacherName,
    updatedAtLabel: timestampToUpdatedLabel(course.updatedAt)
  };
}

async function getCurrentRequiredSession() {
  const session = await getCurrentSessionAsync();

  if (!session) {
    throw new Error("No hay una sesión activa.");
  }

  return session;
}

export function getCourses(role: CourseRole = "teacher") {
  return role === "teacher" ? [...readStoredTeacherCourses(), ...teacherCourses] : [...readStoredTeacherCourses(), ...studentCourses];
}

export function getInitialCourses(role: CourseRole = "teacher") {
  return role === "teacher" ? teacherCourses : studentCourses;
}

export function getCourseById(courseId: string, role: CourseRole = "teacher") {
  return findCourseById(courseId, getCourses(role));
}

export function getInitialCourseById(courseId: string, role: CourseRole = "teacher") {
  return findCourseById(courseId, getInitialCourses(role));
}

export function createCourse(input: StoredCourseInput) {
  return createStoredTeacherCourse(input);
}

export async function getCoursesAsync(role: CourseRole = "teacher") {
  if (!isFirebaseDataSource()) {
    return getCourses(role);
  }

  const session = await getCurrentRequiredSession();

  if (role === "teacher") {
    const courses = await courseFirebaseAdapter.getCoursesByTeacher(session.id);
    return courses.map((course) => mapFirebaseCourseToUiCourse(course, "teacher", session.name));
  }

  const courses = await courseFirebaseAdapter.getCoursesByStudent(session.id);
  return courses.map((course) => mapFirebaseCourseToUiCourse(course, "student"));
}

export async function getCourseByIdAsync(courseId: string, role: CourseRole = "teacher") {
  if (!isFirebaseDataSource()) {
    return getCourseById(courseId, role);
  }

  const session = await getCurrentRequiredSession();
  const course = await courseFirebaseAdapter.getCourseById(courseId);

  if (!course) {
    return undefined;
  }

  if (role === "teacher") {
    if (course.teacherId !== session.id) {
      const membership = await courseMemberFirebaseAdapter.getCourseMember(courseId, session.id);

      if (membership?.role !== "teacher" || membership.status !== "active") {
        return undefined;
      }
    }

    return mapFirebaseCourseToUiCourse(course, "teacher", session.name);
  }

  const membership = await courseMemberFirebaseAdapter.getCourseMember(courseId, session.id);

  if (membership?.role !== "student" || membership.status !== "active") {
    return undefined;
  }

  return mapFirebaseCourseToUiCourse(course, "student");
}

export async function createCourseAsync(input: StoredCourseInput) {
  if (!isFirebaseDataSource()) {
    return createCourse(input);
  }

  const session = await getCurrentRequiredSession();

  if (session.role !== "teacher") {
    throw new Error("Solo los profesores pueden crear cursos.");
  }

  const course = await courseFirebaseAdapter.createCourse({
    description: input.description,
    status: "active",
    subject: input.groupLabel || "General",
    teacherId: session.id,
    title: input.name
  });

  await courseMemberFirebaseAdapter.addCourseMember({
    courseId: course.id,
    displayName: session.name,
    email: session.email,
    role: "teacher",
    status: "active",
    userId: session.id
  });

  return mapFirebaseCourseToUiCourse(course, "teacher", session.name);
}

export async function joinCourseByCode(joinCode: string) {
  if (!isFirebaseDataSource()) {
    throw new Error("La inscripción por código solo está disponible con Firebase.");
  }

  const session = await getCurrentRequiredSession();

  if (session.role !== "student") {
    throw new Error("Solo los estudiantes pueden unirse a cursos por código.");
  }

  const course = await getCourseByJoinCode(joinCode);

  if (!course) {
    throw new Error("No encontramos un curso activo con ese código.");
  }

  await courseMemberFirebaseAdapter.addCourseMember({
    courseId: course.id,
    displayName: session.name,
    email: session.email,
    role: "student",
    status: "active",
    userId: session.id
  });

  return mapFirebaseCourseToUiCourse(course, "student");
}
