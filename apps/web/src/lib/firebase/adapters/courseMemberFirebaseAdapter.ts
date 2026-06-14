import type {
  AddCourseMemberPayload,
  CourseId,
  CourseMemberRepositoryContract,
  UpdateCourseMemberPayload,
  UserId
} from "@aulify/shared-types";

function notImplemented(methodName: string): never {
  throw new Error(`Firebase adapter method not implemented yet: ${methodName}`);
}

export const courseMemberFirebaseAdapter: CourseMemberRepositoryContract = {
  async addCourseMember(_payload: AddCourseMemberPayload) {
    return notImplemented("courseMember.addCourseMember");
  },
  async getCourseMember(_courseId: CourseId, _userId: UserId) {
    return notImplemented("courseMember.getCourseMember");
  },
  async getCourseMembers(_courseId: CourseId) {
    return notImplemented("courseMember.getCourseMembers");
  },
  async getCourseMembersByUser(_userId: UserId) {
    return notImplemented("courseMember.getCourseMembersByUser");
  },
  async removeCourseMember(_courseId: CourseId, _userId: UserId) {
    return notImplemented("courseMember.removeCourseMember");
  },
  async updateCourseMember(_courseId: CourseId, _userId: UserId, _payload: UpdateCourseMemberPayload) {
    return notImplemented("courseMember.updateCourseMember");
  }
};
