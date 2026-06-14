import type { AulifyUser, UserProfile } from "@aulify/shared-types";
import { isFirebaseDataSource } from "../config/dataSource";
import { authFirebaseAdapter, listenToFirebaseAuthState } from "../firebase/adapters/authFirebaseAdapter";
import { profileFirebaseAdapter } from "../firebase/adapters/profileFirebaseAdapter";
import {
  clearMockSession,
  getDashboardPathForSession as getMockDashboardPathForSession,
  getMockSession,
  getRoleLabel as getMockRoleLabel,
  isStudentSession,
  isTeacherSession,
  resolveMockLogin,
  saveMockUser,
  setMockSession,
  type MockSession,
  type MockSessionInput,
  type MockSessionRole,
  type MockUserAccount,
  type MockUserAccountInput
} from "../mockAuth";

export type { MockSession, MockSessionInput, MockSessionRole, MockUserAccount, MockUserAccountInput };

type SessionListener = (session: MockSession | null) => void;

function timestampToIso(value: AulifyUser["createdAt"]) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value.seconds * 1000).toISOString();
}

function createSessionFromFirebaseUser(user: AulifyUser, profile?: UserProfile | null): MockSession {
  return {
    createdAt: timestampToIso(user.createdAt),
    email: user.email,
    id: user.id,
    name: profile?.displayName || user.email,
    role: user.role === "student" ? "student" : "teacher"
  };
}

async function createFirebaseSession(user: AulifyUser | null) {
  if (!user) {
    return null;
  }

  const profile = await profileFirebaseAdapter.getProfile(user.id);

  return createSessionFromFirebaseUser(user, profile);
}

export function getCurrentSession() {
  return getMockSession();
}

export async function getCurrentSessionAsync() {
  if (!isFirebaseDataSource()) {
    return getMockSession();
  }

  return createFirebaseSession(await authFirebaseAdapter.getCurrentUser());
}

export function setCurrentSession(input: MockSessionInput) {
  return setMockSession(input);
}

export function registerMockUser(input: MockUserAccountInput) {
  const account = saveMockUser(input);

  return setMockSession({
    email: account.email,
    name: account.name,
    role: account.role
  });
}

export async function registerUser(input: MockUserAccountInput) {
  if (!isFirebaseDataSource()) {
    return registerMockUser(input);
  }

  const user = await authFirebaseAdapter.registerWithEmailPassword({
    displayName: input.name,
    email: input.email,
    password: input.password,
    role: input.role
  });

  return createFirebaseSession(user);
}

export function loginWithMockCredentials(email: string, password: string) {
  const account = resolveMockLogin(email, password);

  if (!account) {
    return null;
  }

  return setMockSession({
    email: account.email,
    name: account.name,
    role: account.role
  });
}

export async function loginWithCredentials(email: string, password: string) {
  if (!isFirebaseDataSource()) {
    return loginWithMockCredentials(email, password);
  }

  return createFirebaseSession(await authFirebaseAdapter.loginWithEmailPassword({ email, password }));
}

export function clearCurrentSession() {
  clearMockSession();
}

export async function clearCurrentSessionAsync() {
  if (isFirebaseDataSource()) {
    await authFirebaseAdapter.logout();
    return;
  }

  clearMockSession();
}

export function watchCurrentSession(listener: SessionListener) {
  if (!isFirebaseDataSource()) {
    listener(getMockSession());
    return () => undefined;
  }

  return listenToFirebaseAuthState((user) => {
    void createFirebaseSession(user)
      .then(listener)
      .catch(() => listener(null));
  });
}

export function getDashboardPathForSession(session: MockSession) {
  return getMockDashboardPathForSession(session);
}

export function getRoleLabel(role: MockSessionRole) {
  return getMockRoleLabel(role);
}

function getFirebaseAuthErrorCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    return error.code;
  }

  return "";
}

function getFirebaseAuthErrorText(error: unknown) {
  return error instanceof Error ? error.message : "";
}

export function getAuthErrorMessage(error: unknown) {
  const code = getFirebaseAuthErrorCode(error);
  const message = getFirebaseAuthErrorText(error);

  if (message.includes("Firebase is not configured") || message.includes("environment variables")) {
    return "Firebase no está configurado. Revisa las variables de entorno del proyecto.";
  }

  if (message.includes("profile creation failed")) {
    return "No pudimos crear tu perfil. Intenta nuevamente.";
  }

  if (message.includes("profile not found")) {
    return "No encontramos los datos de tu cuenta. Contacta al administrador.";
  }

  if (code === "auth/email-already-in-use") {
    return "Ya existe una cuenta con este correo electrónico.";
  }

  if (code === "auth/invalid-email") {
    return "Ingresa un correo electrónico válido.";
  }

  if (code === "auth/weak-password") {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password" ||
    code === "auth/too-many-requests"
  ) {
    return "Correo o contraseña incorrectos.";
  }

  return "No pudimos completar la autenticación. Intenta nuevamente.";
}

export { isStudentSession, isTeacherSession };
