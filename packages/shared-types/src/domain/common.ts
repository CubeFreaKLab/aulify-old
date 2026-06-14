export type UserId = string;
export type CourseId = string;
export type CourseMemberId = string;
export type FileId = string;

export type TimestampLike =
  | string
  | Date
  | {
      nanoseconds: number;
      seconds: number;
    };

export type UserRole = "teacher" | "student" | "admin";
export type EntityStatus = "draft" | "active" | "archived";

export type AuditFields = {
  createdAt: TimestampLike;
  updatedAt: TimestampLike;
};
