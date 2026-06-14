export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type AttendanceStudent = {
  email: string;
  id: string;
  name: string;
};

export type AttendanceSession = {
  courseId: string;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  title: string;
  updatedAt: string;
};

export type AttendanceRecord = {
  courseId: string;
  id: string;
  note?: string;
  sessionId: string;
  status: AttendanceStatus;
  studentId: string;
  studentName: string;
  updatedAt: string;
};

export type AttendanceStatusCount = Record<AttendanceStatus, number>;

export type CourseAttendanceSummary = AttendanceStatusCount & {
  averageAttendance: number;
  totalRecords: number;
  totalSessions: number;
};

export type StudentAttendanceSummary = AttendanceStatusCount & {
  attendancePercentage: number;
  student: AttendanceStudent;
  totalSessions: number;
};

export const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  absent: "Ausente",
  excused: "Justificado",
  late: "Tarde",
  present: "Presente"
};

export const attendanceStatusShortLabels: Record<AttendanceStatus, string> = {
  absent: "A",
  excused: "J",
  late: "T",
  present: "P"
};

export const attendanceStudentsByCourse: Record<string, AttendanceStudent[]> = {
  "matematica-aplicada": [
    { id: "student-demo", name: "Estudiante Demo", email: "estudiante@aulify.test" },
    { id: "ana-vargas", name: "Ana Vargas", email: "ana.vargas@aulify.test" },
    { id: "mateo-rivera", name: "Mateo Rivera", email: "mateo.rivera@aulify.test" },
    { id: "lucia-nunez", name: "Lucía Núñez", email: "lucia.nunez@aulify.test" }
  ],
  "historia-contemporanea": [
    { id: "student-demo", name: "Estudiante Demo", email: "estudiante@aulify.test" },
    { id: "valentina-lagos", name: "Valentina Lagos", email: "valentina.lagos@aulify.test" },
    { id: "diego-mamani", name: "Diego Mamani", email: "diego.mamani@aulify.test" },
    { id: "sofia-arias", name: "Sofía Arias", email: "sofia.arias@aulify.test" }
  ],
  "comunicacion-escrita": [
    { id: "student-demo", name: "Estudiante Demo", email: "estudiante@aulify.test" },
    { id: "camila-soto", name: "Camila Soto", email: "camila.soto@aulify.test" },
    { id: "nicolas-paz", name: "Nicolás Paz", email: "nicolas.paz@aulify.test" },
    { id: "elena-rios", name: "Elena Ríos", email: "elena.rios@aulify.test" }
  ]
};

export const mockAttendanceSessions: AttendanceSession[] = [
  {
    id: "matematica-aplicada-sesion-1",
    courseId: "matematica-aplicada",
    title: "Clase de funciones lineales",
    date: "2026-06-03",
    createdBy: "Profesor Demo",
    createdAt: "2026-06-03T13:00:00.000Z",
    updatedAt: "2026-06-03T13:20:00.000Z"
  },
  {
    id: "matematica-aplicada-sesion-2",
    courseId: "matematica-aplicada",
    title: "Práctica guiada",
    date: "2026-06-10",
    createdBy: "Profesor Demo",
    createdAt: "2026-06-10T13:00:00.000Z",
    updatedAt: "2026-06-10T13:18:00.000Z"
  },
  {
    id: "historia-contemporanea-sesion-1",
    courseId: "historia-contemporanea",
    title: "Procesos sociales",
    date: "2026-06-04",
    createdBy: "Profesor Demo",
    createdAt: "2026-06-04T14:00:00.000Z",
    updatedAt: "2026-06-04T14:14:00.000Z"
  },
  {
    id: "comunicacion-escrita-sesion-1",
    courseId: "comunicacion-escrita",
    title: "Taller de ensayo",
    date: "2026-06-05",
    createdBy: "Profesor Demo",
    createdAt: "2026-06-05T15:00:00.000Z",
    updatedAt: "2026-06-05T15:16:00.000Z"
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: "ma1-student-demo", sessionId: "matematica-aplicada-sesion-1", courseId: "matematica-aplicada", studentId: "student-demo", studentName: "Estudiante Demo", status: "present", updatedAt: "2026-06-03T13:20:00.000Z" },
  { id: "ma1-ana-vargas", sessionId: "matematica-aplicada-sesion-1", courseId: "matematica-aplicada", studentId: "ana-vargas", studentName: "Ana Vargas", status: "present", updatedAt: "2026-06-03T13:20:00.000Z" },
  { id: "ma1-mateo-rivera", sessionId: "matematica-aplicada-sesion-1", courseId: "matematica-aplicada", studentId: "mateo-rivera", studentName: "Mateo Rivera", status: "late", note: "Llegó durante la práctica.", updatedAt: "2026-06-03T13:20:00.000Z" },
  { id: "ma1-lucia-nunez", sessionId: "matematica-aplicada-sesion-1", courseId: "matematica-aplicada", studentId: "lucia-nunez", studentName: "Lucía Núñez", status: "excused", updatedAt: "2026-06-03T13:20:00.000Z" },
  { id: "ma2-student-demo", sessionId: "matematica-aplicada-sesion-2", courseId: "matematica-aplicada", studentId: "student-demo", studentName: "Estudiante Demo", status: "late", updatedAt: "2026-06-10T13:18:00.000Z" },
  { id: "ma2-ana-vargas", sessionId: "matematica-aplicada-sesion-2", courseId: "matematica-aplicada", studentId: "ana-vargas", studentName: "Ana Vargas", status: "present", updatedAt: "2026-06-10T13:18:00.000Z" },
  { id: "ma2-mateo-rivera", sessionId: "matematica-aplicada-sesion-2", courseId: "matematica-aplicada", studentId: "mateo-rivera", studentName: "Mateo Rivera", status: "present", updatedAt: "2026-06-10T13:18:00.000Z" },
  { id: "ma2-lucia-nunez", sessionId: "matematica-aplicada-sesion-2", courseId: "matematica-aplicada", studentId: "lucia-nunez", studentName: "Lucía Núñez", status: "absent", updatedAt: "2026-06-10T13:18:00.000Z" },
  { id: "hc1-student-demo", sessionId: "historia-contemporanea-sesion-1", courseId: "historia-contemporanea", studentId: "student-demo", studentName: "Estudiante Demo", status: "present", updatedAt: "2026-06-04T14:14:00.000Z" },
  { id: "hc1-valentina-lagos", sessionId: "historia-contemporanea-sesion-1", courseId: "historia-contemporanea", studentId: "valentina-lagos", studentName: "Valentina Lagos", status: "present", updatedAt: "2026-06-04T14:14:00.000Z" },
  { id: "hc1-diego-mamani", sessionId: "historia-contemporanea-sesion-1", courseId: "historia-contemporanea", studentId: "diego-mamani", studentName: "Diego Mamani", status: "absent", updatedAt: "2026-06-04T14:14:00.000Z" },
  { id: "hc1-sofia-arias", sessionId: "historia-contemporanea-sesion-1", courseId: "historia-contemporanea", studentId: "sofia-arias", studentName: "Sofía Arias", status: "excused", updatedAt: "2026-06-04T14:14:00.000Z" },
  { id: "ce1-student-demo", sessionId: "comunicacion-escrita-sesion-1", courseId: "comunicacion-escrita", studentId: "student-demo", studentName: "Estudiante Demo", status: "present", updatedAt: "2026-06-05T15:16:00.000Z" },
  { id: "ce1-camila-soto", sessionId: "comunicacion-escrita-sesion-1", courseId: "comunicacion-escrita", studentId: "camila-soto", studentName: "Camila Soto", status: "late", updatedAt: "2026-06-05T15:16:00.000Z" },
  { id: "ce1-nicolas-paz", sessionId: "comunicacion-escrita-sesion-1", courseId: "comunicacion-escrita", studentId: "nicolas-paz", studentName: "Nicolás Paz", status: "present", updatedAt: "2026-06-05T15:16:00.000Z" },
  { id: "ce1-elena-rios", sessionId: "comunicacion-escrita-sesion-1", courseId: "comunicacion-escrita", studentId: "elena-rios", studentName: "Elena Ríos", status: "present", updatedAt: "2026-06-05T15:16:00.000Z" }
];

export function formatAttendanceDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export function createEmptyStatusCount(): AttendanceStatusCount {
  return {
    absent: 0,
    excused: 0,
    late: 0,
    present: 0
  };
}

export function getAttendanceRoster(courseId: string) {
  return (
    attendanceStudentsByCourse[courseId] ?? [
      { id: "student-demo", name: "Estudiante Demo", email: "estudiante@aulify.test" },
      { id: `${courseId}-estudiante-1`, name: "Estudiante 1", email: `estudiante1.${courseId}@aulify.test` },
      { id: `${courseId}-estudiante-2`, name: "Estudiante 2", email: `estudiante2.${courseId}@aulify.test` }
    ]
  );
}

export function getAttendanceSessionsByCourse(courseId: string, sessions: AttendanceSession[]) {
  return sessions
    .filter((session) => session.courseId === courseId)
    .sort((first, second) => second.date.localeCompare(first.date));
}

export function getAttendanceRecordsBySession(sessionId: string, records: AttendanceRecord[]) {
  return records.filter((record) => record.sessionId === sessionId);
}

export function countAttendanceStatuses(records: AttendanceRecord[]) {
  return records.reduce((counts, record) => {
    counts[record.status] += 1;
    return counts;
  }, createEmptyStatusCount());
}

export function calculateAttendancePercentage(counts: AttendanceStatusCount) {
  const total = counts.present + counts.absent + counts.late + counts.excused;

  if (!total) {
    return 0;
  }

  return Math.round(((counts.present + counts.late + counts.excused) / total) * 100);
}
