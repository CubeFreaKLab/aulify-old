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

export type MockUserAccount = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  password: string;
  role: MockSessionRole;
};

export type MockUserAccountInput = {
  email: string;
  name: string;
  password: string;
  role: MockSessionRole;
};

const mockSessionKey = "aulify.mockSession";
const mockUsersKey = "aulify-mock-users";

const demoAccounts: MockUserAccount[] = [
  {
    id: "demo-teacher",
    name: "Profesor Demo",
    email: "profesor@aulify.test",
    password: "aulify123",
    role: "teacher",
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "demo-student",
    name: "Estudiante Demo",
    email: "estudiante@aulify.test",
    password: "aulify123",
    role: "student",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

function createSessionId(email: string) {
  const slug = email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "usuario"}-${Date.now()}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getMockUsers(): MockUserAccount[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(mockUsersKey);

  if (!rawValue) {
    return [];
  }

  try {
    const users = JSON.parse(rawValue) as MockUserAccount[];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export function saveMockUser(input: MockUserAccountInput) {
  const email = normalizeEmail(input.email);
  const currentUsers = getMockUsers();
  const existingUser = currentUsers.find((user) => normalizeEmail(user.email) === email);
  const account: MockUserAccount = {
    id: existingUser?.id ?? createSessionId(email),
    name: input.name.trim(),
    email,
    password: input.password,
    role: input.role,
    createdAt: existingUser?.createdAt ?? new Date().toISOString()
  };
  const nextUsers = [account, ...currentUsers.filter((user) => normalizeEmail(user.email) !== email)];

  window.localStorage.setItem(mockUsersKey, JSON.stringify(nextUsers));

  return account;
}

export function resolveMockLogin(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const registeredUser = getMockUsers().find((user) => normalizeEmail(user.email) === normalizedEmail && user.password === password);

  if (registeredUser) {
    return registeredUser;
  }

  return demoAccounts.find((account) => account.email === normalizedEmail && account.password === password) ?? null;
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
