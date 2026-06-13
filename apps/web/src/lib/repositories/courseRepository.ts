import {
  findCourseById,
  studentCourses,
  teacherCourses,
  type Course,
  type CourseRole
} from "../mock/courses";
import { createStoredTeacherCourse, readStoredTeacherCourses, type StoredCourseInput } from "../courseStorage";

export type { Course, CourseRole, StoredCourseInput };

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
