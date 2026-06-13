import {
  clearMockSession,
  getDashboardPathForSession,
  getMockSession,
  getRoleLabel,
  isStudentSession,
  isTeacherSession,
  setMockSession,
  type MockSession,
  type MockSessionInput,
  type MockSessionRole
} from "../mockAuth";

export type { MockSession, MockSessionInput, MockSessionRole };

export function getCurrentSession() {
  return getMockSession();
}

export function setCurrentSession(input: MockSessionInput) {
  return setMockSession(input);
}

export function clearCurrentSession() {
  clearMockSession();
}

export { getDashboardPathForSession, getRoleLabel, isStudentSession, isTeacherSession };
