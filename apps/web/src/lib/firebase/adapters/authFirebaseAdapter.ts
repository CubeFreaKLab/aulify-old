import type {
  AulifyUser,
  AuthRepositoryContract,
  CreateUserPayload,
  EmailPasswordCredentials,
  RegisterUserPayload,
  TimestampLike,
  UserId,
  UserRole
} from "@aulify/shared-types";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { requireFirebaseServices } from "../client";
import { userPath } from "../firestorePaths";
import { profileFirebaseAdapter } from "./profileFirebaseAdapter";

function getTimestampValue(value: unknown): TimestampLike {
  if (typeof value === "string" || value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    return value as TimestampLike;
  }

  return new Date().toISOString();
}

function isUserRole(value: unknown): value is UserRole {
  return value === "teacher" || value === "student" || value === "admin";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapFirebaseAuthUser(firebaseUser: FirebaseUser, fallbackRole: UserRole = "student"): AulifyUser {
  const now = new Date().toISOString();

  return {
    createdAt: now,
    email: normalizeEmail(firebaseUser.email ?? ""),
    id: firebaseUser.uid,
    role: fallbackRole,
    updatedAt: now
  };
}

function mapUserDocument(userId: UserId, data: Record<string, unknown>): AulifyUser {
  const role = data.role;

  if (!isUserRole(role)) {
    throw new Error("Firebase user role is missing or invalid.");
  }

  return {
    createdAt: getTimestampValue(data.createdAt),
    email: typeof data.email === "string" ? normalizeEmail(data.email) : "",
    id: typeof data.id === "string" ? data.id : userId,
    role,
    updatedAt: getTimestampValue(data.updatedAt)
  };
}

async function writeUserDocument(payload: CreateUserPayload): Promise<AulifyUser> {
  const { firebaseDb } = requireFirebaseServices();
  const now = new Date().toISOString();
  const user: AulifyUser = {
    createdAt: now,
    email: normalizeEmail(payload.email),
    id: payload.id,
    role: payload.role,
    updatedAt: now
  };

  await setDoc(doc(firebaseDb, userPath(user.id)), {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return user;
}

async function getFirebaseUserById(userId: UserId) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, userPath(userId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapUserDocument(userId, snapshot.data());
}

export const authFirebaseAdapter: AuthRepositoryContract = {
  async createUser(payload: CreateUserPayload) {
    return writeUserDocument(payload);
  },
  async getCurrentUser() {
    const { firebaseAuth } = requireFirebaseServices();

    if (!firebaseAuth.currentUser) {
      return null;
    }

    return getFirebaseUserById(firebaseAuth.currentUser.uid);
  },
  async getUserById(userId: UserId) {
    return getFirebaseUserById(userId);
  },
  async loginWithEmailPassword(credentials: EmailPasswordCredentials) {
    const { firebaseAuth } = requireFirebaseServices();
    const credential = await signInWithEmailAndPassword(firebaseAuth, normalizeEmail(credentials.email), credentials.password);
    const user = await getFirebaseUserById(credential.user.uid);

    if (!user) {
      throw new Error("Firebase user profile not found.");
    }

    return user;
  },
  async logout() {
    const { firebaseAuth } = requireFirebaseServices();
    await signOut(firebaseAuth);
  },
  async registerWithEmailPassword(payload: RegisterUserPayload) {
    const { firebaseAuth } = requireFirebaseServices();
    const credential = await createUserWithEmailAndPassword(firebaseAuth, normalizeEmail(payload.email), payload.password);
    const authUser = mapFirebaseAuthUser(credential.user, payload.role);
    const user = await writeUserDocument({
      email: authUser.email,
      id: authUser.id,
      role: payload.role
    });

    try {
      await profileFirebaseAdapter.createProfile({
        displayName: payload.displayName,
        userId: user.id
      });
    } catch (error) {
      throw new Error("Firebase profile creation failed.", { cause: error });
    }

    return user;
  },
  async updateUser(userId: UserId, payload) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(doc(firebaseDb, userPath(userId)), {
      ...payload,
      updatedAt: serverTimestamp()
    });

    const user = await getFirebaseUserById(userId);

    if (!user) {
      throw new Error("Firebase user not found after update.");
    }

    return user;
  }
};

export function listenToFirebaseAuthState(callback: (user: AulifyUser | null, error?: unknown) => void) {
  const { firebaseAuth } = requireFirebaseServices();

  return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    void authFirebaseAdapter
      .getUserById(firebaseUser.uid)
      .then((user) => callback(user))
      .catch((error: unknown) => callback(null, error));
  });
}
