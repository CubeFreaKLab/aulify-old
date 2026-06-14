import type { CourseId, CourseRepositoryContract, CreateCoursePayload, UpdateCoursePayload, UserId } from "@aulify/shared-types";

function notImplemented(methodName: string): never {
  throw new Error(`Firebase adapter method not implemented yet: ${methodName}`);
}

export const courseFirebaseAdapter: CourseRepositoryContract = {
  async archiveCourse(_courseId: CourseId) {
    return notImplemented("course.archiveCourse");
  },
  async createCourse(_payload: CreateCoursePayload) {
    return notImplemented("course.createCourse");
  },
  async getCourseById(_courseId: CourseId) {
    return notImplemented("course.getCourseById");
  },
  async getCoursesByStudent(_studentId: UserId) {
    return notImplemented("course.getCoursesByStudent");
  },
  async getCoursesByTeacher(_teacherId: UserId) {
    return notImplemented("course.getCoursesByTeacher");
  },
  async updateCourse(_courseId: CourseId, _payload: UpdateCoursePayload) {
    return notImplemented("course.updateCourse");
  }
};
