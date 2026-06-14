import type { AttendanceRecord, AttendanceSession } from "./mock/attendance";

const attendanceSessionsKey = "aulify-attendance-sessions";
const attendanceRecordsKey = "aulify-attendance-records";

export type StoredAttendanceSessionInput = {
  courseId: string;
  createdBy: string;
  date: string;
  title: string;
};

export type StoredAttendanceSessionUpdateInput = StoredAttendanceSessionInput & {
  id: string;
  createdAt: string;
};

export type StoredAttendanceRecordInput = Omit<AttendanceRecord, "id" | "updatedAt"> & {
  id?: string;
};

function createId(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || fallback}-${Date.now()}`;
}

export function readStoredAttendanceSessions(): AttendanceSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(attendanceSessionsKey);

  if (!rawValue) {
    return [];
  }

  try {
    const sessions = JSON.parse(rawValue) as AttendanceSession[];
    return Array.isArray(sessions) ? sessions : [];
  } catch {
    return [];
  }
}

export function readStoredAttendanceRecords(): AttendanceRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(attendanceRecordsKey);

  if (!rawValue) {
    return [];
  }

  try {
    const records = JSON.parse(rawValue) as AttendanceRecord[];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function createStoredAttendanceSession(input: StoredAttendanceSessionInput) {
  const now = new Date().toISOString();
  const session: AttendanceSession = {
    id: createId(`${input.courseId}-${input.date}-${input.title}`, "asistencia"),
    courseId: input.courseId,
    createdBy: input.createdBy,
    createdAt: now,
    date: input.date,
    title: input.title.trim(),
    updatedAt: now
  };

  const nextSessions = [session, ...readStoredAttendanceSessions()];
  window.localStorage.setItem(attendanceSessionsKey, JSON.stringify(nextSessions));

  return session;
}

export function saveStoredAttendanceSession(input: StoredAttendanceSessionUpdateInput) {
  const now = new Date().toISOString();
  const session: AttendanceSession = {
    id: input.id,
    courseId: input.courseId,
    createdBy: input.createdBy,
    createdAt: input.createdAt,
    date: input.date,
    title: input.title.trim(),
    updatedAt: now
  };

  const nextSessions = [
    session,
    ...readStoredAttendanceSessions().filter((storedSession) => storedSession.id !== input.id)
  ];
  window.localStorage.setItem(attendanceSessionsKey, JSON.stringify(nextSessions));

  return session;
}

export function saveStoredAttendanceRecords(sessionId: string, records: StoredAttendanceRecordInput[]) {
  const now = new Date().toISOString();
  const nextRecords: AttendanceRecord[] = records.map((record) => ({
    id: record.id ?? createId(`${sessionId}-${record.studentId}`, "registro"),
    courseId: record.courseId,
    note: record.note?.trim() || undefined,
    sessionId,
    status: record.status,
    studentId: record.studentId,
    studentName: record.studentName,
    updatedAt: now
  }));

  const existingRecords = readStoredAttendanceRecords().filter((record) => record.sessionId !== sessionId);
  window.localStorage.setItem(attendanceRecordsKey, JSON.stringify([...nextRecords, ...existingRecords]));

  return nextRecords;
}
