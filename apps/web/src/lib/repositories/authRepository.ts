import {
  clearMockSession,
  getDashboardPathForSession,
  getMockSession,
  getRoleLabel,
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

export function getCurrentSession() {
  return getMockSession();
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

export function clearCurrentSession() {
  clearMockSession();
}

export { getDashboardPathForSession, getRoleLabel, isStudentSession, isTeacherSession };
