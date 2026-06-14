import type { AuditFields, UserId, UserRole } from "./common";

export type AulifyUser = AuditFields & {
  email: string;
  id: UserId;
  role: UserRole;
};

export type CreateUserPayload = {
  email: string;
  id: UserId;
  role: UserRole;
};

export type UpdateUserPayload = Partial<Pick<AulifyUser, "email" | "role">>;
