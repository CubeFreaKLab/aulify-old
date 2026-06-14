import type { AuditFields, CourseId, EntityStatus, UserId } from "./common";

export type CourseStatus = Extract<EntityStatus, "draft" | "active" | "archived">;

export type Course = AuditFields & {
  coverImageUrl?: string;
  description: string;
  id: CourseId;
  status: CourseStatus;
  subject: string;
  teacherId: UserId;
  title: string;
};

export type CreateCoursePayload = {
  coverImageUrl?: string;
  description: string;
  status?: CourseStatus;
  subject: string;
  teacherId: UserId;
  title: string;
};

export type UpdateCoursePayload = Partial<Pick<Course, "coverImageUrl" | "description" | "status" | "subject" | "title">>;
