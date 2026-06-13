export type MockSessionRole = "teacher" | "student";

export type MockSession = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: MockSessionRole;
};

export type MockSessionInput = {
  email: string;
  name: string;
  role: MockSessionRole;
};

const mockSessionKey = "aulify.mockSession";

function createSessionId(email: string) {
  const slug = email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "usuario"}-${Date.now()}`;
}

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(mockSessionKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as MockSession;
  } catch {
    return null;
  }
}

export function setMockSession(input: MockSessionInput) {
  const session: MockSession = {
    id: createSessionId(input.email),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    createdAt: new Date().toISOString()
  };

  window.localStorage.setItem(mockSessionKey, JSON.stringify(session));

  return session;
}

export function clearMockSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(mockSessionKey);
}

export function isTeacherSession(session: MockSession | null): session is MockSession & { role: "teacher" } {
  return session?.role === "teacher";
}

export function isStudentSession(session: MockSession | null): session is MockSession & { role: "student" } {
  return session?.role === "student";
}

export function getDashboardPathForSession(session: MockSession) {
  return session.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
}

export function getRoleLabel(role: MockSessionRole) {
  return role === "teacher" ? "Profesor" : "Estudiante";
}
