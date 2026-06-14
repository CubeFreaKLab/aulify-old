import type { AuditFields, TimestampLike, UserId } from "./common";

export type AvatarConfig = {
  backgroundColor?: string;
  initials?: string;
  variant?: string;
};

export type UserProfileSettings = {
  locale?: string;
  theme?: "system" | "light" | "dark";
};

export type UserProfile = AuditFields & {
  avatarConfig?: AvatarConfig;
  avatarUrl?: string;
  bio?: string;
  displayName: string;
  settings?: UserProfileSettings;
  userId: UserId;
};

export type CreateProfilePayload = {
  avatarConfig?: AvatarConfig;
  avatarUrl?: string;
  bio?: string;
  createdAt?: TimestampLike;
  displayName: string;
  settings?: UserProfileSettings;
  userId: UserId;
};

export type UpdateProfilePayload = Partial<Omit<UserProfile, "createdAt" | "updatedAt" | "userId">>;
