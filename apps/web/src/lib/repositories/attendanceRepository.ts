import {
  createStoredAttendanceSession,
  readStoredAttendanceRecords,
  readStoredAttendanceSessions,
  saveStoredAttendanceRecords,
  saveStoredAttendanceSession,
  type StoredAttendanceRecordInput,
  type StoredAttendanceSessionInput,
  type StoredAttendanceSessionUpdateInput
} from "../attendanceStorage";
import { getCourseById, getInitialCourseById } from "./courseRepository";
import {
  attendanceStatusLabels,
  attendanceStatusShortLabels,
  calculateAttendancePercentage,
  countAttendanceStatuses,
  createEmptyStatusCount,
  formatAttendanceDate,
  getAttendanceRecordsBySession,
  getAttendanceRoster,
  getAttendanceSessionsByCourse,
  mockAttendanceRecords,
  mockAttendanceSessions,
  type AttendanceRecord,
  type AttendanceSession,
  type AttendanceStatus,
  type AttendanceStatusCount,
  type AttendanceStudent,
  type CourseAttendanceSummary,
  type StudentAttendanceSummary
} from "../mock/attendance";

export type {
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  AttendanceStatusCount,
  AttendanceStudent,
  CourseAttendanceSummary,
  StoredAttendanceRecordInput,
  StoredAttendanceSessionInput,
  StoredAttendanceSessionUpdateInput,
  StudentAttendanceSummary
};

export { attendanceStatusLabels, attendanceStatusShortLabels, formatAttendanceDate };

function mergeById<T extends { id: string }>(baseItems: T[], overrideItems: T[]) {
  const itemsById = new Map<string, T>();

  baseItems.forEach((item) => itemsById.set(item.id, item));
  overrideItems.forEach((item) => itemsById.set(item.id, item));

  return [...itemsById.values()];
}

function getAttendanceSessions() {
  return mergeById(mockAttendanceSessions, readStoredAttendanceSessions());
}

function getInitialAttendanceSessions() {
  return mockAttendanceSessions;
}

function getAttendanceRecords() {
  return mergeById(mockAttendanceRecords, readStoredAttendanceRecords());
}

function getInitialAttendanceRecords() {
  return mockAttendanceRecords;
}

function getRecordsForCourse(courseId: string, records = getAttendanceRecords()) {
  return records.filter((record) => record.courseId === courseId);
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function applyCounts(records: AttendanceRecord[]) {
  return countAttendanceStatuses(records);
}

function createCourseSummary(sessions: AttendanceSession[], records: AttendanceRecord[]): CourseAttendanceSummary {
  const counts = applyCounts(records);

  return {
    ...counts,
    averageAttendance: calculateAttendancePercentage(counts),
    totalRecords: records.length,
    totalSessions: sessions.length
  };
}

function createDefaultRecordsForSession(session: AttendanceSession) {
  const existingRecords = getAttendanceRecordsBySessionId(session.id);
  const existingRecordByStudentId = new Map(existingRecords.map((record) => [record.studentId, record]));

  return getCourseAttendanceRoster(session.courseId).map((student) => {
    const existingRecord = existingRecordByStudentId.get(student.id);

    return {
      id: existingRecord?.id,
      courseId: session.courseId,
      note: existingRecord?.note ?? "",
      sessionId: session.id,
      status: existingRecord?.status ?? "present",
      studentId: student.id,
      studentName: student.name
    };
  });
}

export function getCourseAttendanceRoster(courseId: string) {
  return getAttendanceRoster(courseId);
}

export function getAttendanceSessionsByCourseId(courseId: string) {
  return getAttendanceSessionsByCourse(courseId, getAttendanceSessions());
}

export function getInitialAttendanceSessionsByCourseId(courseId: string) {
  return getAttendanceSessionsByCourse(courseId, getInitialAttendanceSessions());
}

export function getAttendanceSessionById(sessionId: string) {
  return getAttendanceSessions().find((session) => session.id === sessionId);
}

export function getInitialAttendanceSessionById(sessionId: string) {
  return getInitialAttendanceSessions().find((session) => session.id === sessionId);
}

export function createAttendanceSession(courseId: string, payload: Omit<StoredAttendanceSessionInput, "courseId">) {
  return createStoredAttendanceSession({
    courseId,
    createdBy: payload.createdBy,
    date: payload.date,
    title: payload.title
  });
}

export function updateAttendanceSession(payload: StoredAttendanceSessionUpdateInput) {
  return saveStoredAttendanceSession(payload);
}

export function saveAttendanceRecords(sessionId: string, records: StoredAttendanceRecordInput[]) {
  return saveStoredAttendanceRecords(sessionId, records);
}

export function saveAttendanceSessionWithRecords(
  courseId: string,
  sessionInput: Omit<StoredAttendanceSessionInput, "courseId">,
  records: Array<Omit<StoredAttendanceRecordInput, "courseId" | "sessionId">>,
  existingSession?: AttendanceSession
) {
  const session = existingSession
    ? updateAttendanceSession({
        id: existingSession.id,
        courseId,
        createdAt: existingSession.createdAt,
        createdBy: existingSession.createdBy,
        date: sessionInput.date,
        title: sessionInput.title
      })
    : createAttendanceSession(courseId, sessionInput);

  saveAttendanceRecords(
    session.id,
    records.map((record) => ({
      ...record,
      courseId,
      sessionId: session.id
    }))
  );

  return session;
}

export function getAttendanceRecordsBySessionId(sessionId: string) {
  return getAttendanceRecordsBySession(sessionId, getAttendanceRecords());
}

export function getInitialAttendanceRecordsBySessionId(sessionId: string) {
  return getAttendanceRecordsBySession(sessionId, getInitialAttendanceRecords());
}

export function getEditableAttendanceRecords(session: AttendanceSession) {
  return createDefaultRecordsForSession(session);
}

export function getCourseAttendanceSummary(courseId: string) {
  return createCourseSummary(getAttendanceSessionsByCourseId(courseId), getRecordsForCourse(courseId));
}

export function getInitialCourseAttendanceSummary(courseId: string) {
  return createCourseSummary(getInitialAttendanceSessionsByCourseId(courseId), getRecordsForCourse(courseId, getInitialAttendanceRecords()));
}

export function getSessionAttendanceSummary(sessionId: string) {
  return countAttendanceStatuses(getAttendanceRecordsBySessionId(sessionId));
}

export function getStudentAttendanceSummary(courseId: string, studentId: string): StudentAttendanceSummary | undefined {
  const student = getCourseAttendanceRoster(courseId).find((item) => item.id === studentId);

  if (!student) {
    return undefined;
  }

  const sessions = getAttendanceSessionsByCourseId(courseId);
  const records = getRecordsForCourse(courseId).filter((record) => record.studentId === studentId);
  const counts = applyCounts(records);

  return {
    ...counts,
    attendancePercentage: calculateAttendancePercentage(counts),
    student,
    totalSessions: sessions.length
  };
}

export function getStudentForAttendance(courseId: string, email?: string) {
  const roster = getCourseAttendanceRoster(courseId);

  return roster.find((student) => student.email === email?.trim().toLowerCase()) ?? roster[0];
}

function getStatusCountForStudent(studentId: string, records: AttendanceRecord[]) {
  return records
    .filter((record) => record.studentId === studentId)
    .reduce((counts, record) => {
      counts[record.status] += 1;
      return counts;
    }, createEmptyStatusCount());
}

function formatPercent(value: number) {
  return `${value}%`;
}

export async function exportCourseAttendanceToExcel(courseId: string) {
  const ExcelJS = await import("exceljs");
  const course = getCourseById(courseId, "teacher") ?? getInitialCourseById(courseId, "teacher");
  const courseName = course?.name ?? "Curso";
  const sessions = [...getAttendanceSessionsByCourseId(courseId)].reverse();
  const records = getRecordsForCourse(courseId);
  const roster = getCourseAttendanceRoster(courseId);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Asistencia");
  const summaryColumnCount = 3;
  const totalColumns = Math.max(6, 1 + sessions.length + summaryColumnCount);
  const exportDate = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  workbook.creator = "Aulify";
  workbook.created = new Date();

  worksheet.mergeCells(1, 1, 1, totalColumns);
  worksheet.getCell(1, 1).value = "Reporte de asistencia";
  worksheet.getCell(1, 1).font = { bold: true, color: { argb: "FFFFFFFF" }, size: 18 };
  worksheet.getCell(1, 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF049A4E" } };
  worksheet.getCell(1, 1).alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 30;

  worksheet.mergeCells(2, 1, 2, totalColumns);
  worksheet.getCell(2, 1).value = courseName;
  worksheet.getCell(2, 1).font = { bold: true, color: { argb: "FF0F0F0F" }, size: 13 };
  worksheet.getCell(2, 1).alignment = { horizontal: "center" };

  worksheet.mergeCells(3, 1, 3, totalColumns);
  worksheet.getCell(3, 1).value = `Exportado el ${exportDate}`;
  worksheet.getCell(3, 1).font = { color: { argb: "FF60615A" }, size: 11 };
  worksheet.getCell(3, 1).alignment = { horizontal: "center" };

  const headerRow = worksheet.getRow(5);
  headerRow.values = [
    "Estudiante",
    ...sessions.map((session) => `${formatAttendanceDate(session.date)}\n${session.title}`),
    "Total presentes",
    "Total ausencias",
    "Porcentaje de asistencia"
  ];
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  headerRow.height = 42;

  for (let column = 1; column <= totalColumns; column += 1) {
    const cell = worksheet.getCell(5, column);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF049A4E" } };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFECECE7" } },
      left: { style: "thin", color: { argb: "FFECECE7" } },
      right: { style: "thin", color: { argb: "FFECECE7" } },
      top: { style: "thin", color: { argb: "FFECECE7" } }
    };
  }

  roster.forEach((student, index) => {
    const rowIndex = 6 + index;
    const studentRecords = records.filter((record) => record.studentId === student.id);
    const counts = getStatusCountForStudent(student.id, studentRecords);
    const row = worksheet.getRow(rowIndex);
    const sessionValues = sessions.map((session) => {
      const record = studentRecords.find((item) => item.sessionId === session.id);
      return record ? attendanceStatusLabels[record.status] : "Sin registro";
    });

    row.values = [
      student.name,
      ...sessionValues,
      counts.present,
      counts.absent,
      formatPercent(calculateAttendancePercentage(counts))
    ];
    row.alignment = { vertical: "middle", wrapText: true };

    for (let column = 1; column <= totalColumns; column += 1) {
      const cell = worksheet.getCell(rowIndex, column);
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFECECE7" } },
        left: { style: "thin", color: { argb: "FFECECE7" } },
        right: { style: "thin", color: { argb: "FFECECE7" } },
        top: { style: "thin", color: { argb: "FFECECE7" } }
      };

      if (column > 1 && column <= sessions.length + 1) {
        const value = String(cell.value ?? "");
        if (value === "Presente") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB8FAC6" } };
        } else if (value === "Ausente") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFECECE7" } };
        }
      }
    }
  });

  worksheet.getColumn(1).width = 26;
  for (let column = 2; column <= sessions.length + 1; column += 1) {
    worksheet.getColumn(column).width = 20;
  }
  worksheet.getColumn(sessions.length + 2).width = 16;
  worksheet.getColumn(sessions.length + 3).width = 16;
  worksheet.getColumn(sessions.length + 4).width = 24;
  worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 5 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  const fileName = `aulify-asistencia-${createSlug(courseName)}-${new Date().getFullYear()}.xlsx`;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return { fileName };
}
