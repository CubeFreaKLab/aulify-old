import type { CreateProfilePayload, ProfileRepositoryContract, TimestampLike, UpdateProfilePayload, UserId, UserProfile } from "@aulify/shared-types";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { requireFirebaseServices } from "../client";
import { profilePath } from "../firestorePaths";

function getTimestampValue(value: unknown): TimestampLike {
  if (typeof value === "string" || value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    return value as TimestampLike;
  }

  return new Date().toISOString();
}

function removeUndefinedValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

function mapProfileDocument(userId: UserId, data: Record<string, unknown>): UserProfile {
  return {
    avatarConfig: data.avatarConfig as UserProfile["avatarConfig"],
    avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : undefined,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    createdAt: getTimestampValue(data.createdAt),
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    settings: data.settings as UserProfile["settings"],
    updatedAt: getTimestampValue(data.updatedAt),
    userId
  };
}

async function getProfileById(userId: UserId) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, profilePath(userId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapProfileDocument(userId, snapshot.data());
}

export const profileFirebaseAdapter: ProfileRepositoryContract = {
  async createProfile(payload: CreateProfilePayload) {
    const { firebaseDb } = requireFirebaseServices();
    const now = new Date().toISOString();
    const profile: UserProfile = {
      avatarConfig: payload.avatarConfig,
      avatarUrl: payload.avatarUrl,
      bio: payload.bio,
      createdAt: payload.createdAt ?? now,
      displayName: payload.displayName.trim(),
      settings: payload.settings,
      updatedAt: now,
      userId: payload.userId
    };

    await setDoc(
      doc(firebaseDb, profilePath(payload.userId)),
      removeUndefinedValues({
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );

    return profile;
  },
  async getProfile(userId: UserId) {
    return getProfileById(userId);
  },
  async updateProfile(userId: UserId, payload: UpdateProfilePayload) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(
      doc(firebaseDb, profilePath(userId)),
      removeUndefinedValues({
        ...payload,
        updatedAt: serverTimestamp()
      })
    );

    const profile = await getProfileById(userId);

    if (!profile) {
      throw new Error("Firebase profile not found after update.");
    }

    return profile;
  }
};
