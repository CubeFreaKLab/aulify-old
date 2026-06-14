import type { CourseId, CourseMemberId, TimestampLike, UserId } from "./common";

export type CourseMemberRole = "teacher" | "student";
export type CourseMemberStatus = "active" | "invited" | "removed";

export type CourseMember = {
  courseId: CourseId;
  displayName: string;
  email: string;
  id: CourseMemberId;
  joinedAt: TimestampLike;
  role: CourseMemberRole;
  status: CourseMemberStatus;
  userId: UserId;
};

export type AddCourseMemberPayload = {
  courseId: CourseId;
  displayName: string;
  email: string;
  role: CourseMemberRole;
  status?: CourseMemberStatus;
  userId: UserId;
};

export type UpdateCourseMemberPayload = Partial<Pick<CourseMember, "displayName" | "email" | "role" | "status">>;
