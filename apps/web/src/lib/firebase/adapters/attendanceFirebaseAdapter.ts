import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import {
  calculateAttendancePercentage,
  countAttendanceStatuses,
  type AttendanceRecord,
  type AttendanceSession,
  type AttendanceStatus,
  type CourseAttendanceSummary,
  type StudentAttendanceSummary
} from "../../mock/attendance";
import type { StoredAttendanceRecordInput, StoredAttendanceSessionInput, StoredAttendanceSessionUpdateInput } from "../../attendanceStorage";
import { requireFirebaseServices } from "../client";
import {
  attendanceRecordPath,
  attendanceSessionPath,
  createAttendanceRecordId,
  firestoreCollections
} from "../firestorePaths";

function toIsoTimestamp(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "seconds" in value && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000).toISOString();
  }

  return new Date().toISOString();
}

function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return value === "present" || value === "absent" || value === "late" || value === "excused";
}

function removeUndefinedValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

function mapAttendanceSessionDocument(id: string, data: Record<string, unknown>): AttendanceSession {
  return {
    courseId: typeof data.courseId === "string" ? data.courseId : "",
    createdAt: toIsoTimestamp(data.createdAt),
    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",
    date: typeof data.date === "string" ? data.date : "",
    id: typeof data.id === "string" ? data.id : id,
    title: typeof data.title === "string" ? data.title : "",
    updatedAt: toIsoTimestamp(data.updatedAt)
  };
}

function mapAttendanceRecordDocument(id: string, data: Record<string, unknown>): AttendanceRecord {
  const status = data.status;

  if (!isAttendanceStatus(status)) {
    throw new Error("Firebase attendance record status is missing or invalid.");
  }

  return {
    courseId: typeof data.courseId === "string" ? data.courseId : "",
    id: typeof data.id === "string" ? data.id : id,
    note: typeof data.note === "string" ? data.note : undefined,
    sessionId: typeof data.sessionId === "string" ? data.sessionId : "",
    status,
    studentId: typeof data.studentId === "string" ? data.studentId : "",
    studentName: typeof data.studentName === "string" ? data.studentName : "",
    updatedAt: toIsoTimestamp(data.updatedAt)
  };
}

async function getSession(sessionId: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, attendanceSessionPath(sessionId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapAttendanceSessionDocument(snapshot.id, snapshot.data());
}

async function getRecordsForCourse(courseId: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDocs(
    query(collection(firebaseDb, firestoreCollections.attendanceRecords), where("courseId", "==", courseId))
  );

  return snapshot.docs.map((documentSnapshot) => mapAttendanceRecordDocument(documentSnapshot.id, documentSnapshot.data()));
}

function createCourseSummary(sessions: AttendanceSession[], records: AttendanceRecord[]): CourseAttendanceSummary {
  const counts = countAttendanceStatuses(records);

  return {
    ...counts,
    averageAttendance: calculateAttendancePercentage(counts),
    totalRecords: records.length,
    totalSessions: sessions.length
  };
}

export const attendanceFirebaseAdapter = {
  async createAttendanceSession(courseId: string, payload: Omit<StoredAttendanceSessionInput, "courseId">) {
    const { firebaseDb } = requireFirebaseServices();
    const sessionReference = doc(collection(firebaseDb, firestoreCollections.attendanceSessions));
    const now = new Date().toISOString();
    const session: AttendanceSession = {
      courseId,
      createdAt: now,
      createdBy: payload.createdBy,
      date: payload.date,
      id: sessionReference.id,
      title: payload.title.trim(),
      updatedAt: now
    };

    await setDoc(sessionReference, {
      ...session,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return session;
  },
  async getAttendanceRecordsByCourseId(courseId: string) {
    return getRecordsForCourse(courseId);
  },
  async getAttendanceRecordsBySessionId(sessionId: string) {
    const { firebaseDb } = requireFirebaseServices();
    const snapshot = await getDocs(
      query(collection(firebaseDb, firestoreCollections.attendanceRecords), where("sessionId", "==", sessionId))
    );

    return snapshot.docs.map((documentSnapshot) => mapAttendanceRecordDocument(documentSnapshot.id, documentSnapshot.data()));
  },
  async getAttendanceSessionById(sessionId: string) {
    return getSession(sessionId);
  },
  async getAttendanceSessionsByCourseId(courseId: string) {
    const { firebaseDb } = requireFirebaseServices();
    const snapshot = await getDocs(
      query(collection(firebaseDb, firestoreCollections.attendanceSessions), where("courseId", "==", courseId))
    );

    return snapshot.docs
      .map((documentSnapshot) => mapAttendanceSessionDocument(documentSnapshot.id, documentSnapshot.data()))
      .sort((first, second) => second.date.localeCompare(first.date));
  },
  async getCourseAttendanceSummary(courseId: string) {
    const [sessions, records] = await Promise.all([
      this.getAttendanceSessionsByCourseId(courseId),
      this.getAttendanceRecordsByCourseId(courseId)
    ]);

    return createCourseSummary(sessions, records);
  },
  async getStudentAttendanceSummary(courseId: string, studentId: string): Promise<Omit<StudentAttendanceSummary, "student">> {
    const [sessions, records] = await Promise.all([
      this.getAttendanceSessionsByCourseId(courseId),
      this.getAttendanceRecordsByCourseId(courseId)
    ]);
    const studentRecords = records.filter((record) => record.studentId === studentId);
    const counts = countAttendanceStatuses(studentRecords);

    return {
      ...counts,
      attendancePercentage: calculateAttendancePercentage(counts),
      totalSessions: sessions.length
    };
  },
  async saveAttendanceRecords(sessionId: string, records: StoredAttendanceRecordInput[]) {
    const { firebaseDb } = requireFirebaseServices();
    const now = new Date().toISOString();
    const nextRecords: AttendanceRecord[] = records.map((record) => ({
      courseId: record.courseId,
      id: createAttendanceRecordId(sessionId, record.studentId),
      note: record.note?.trim() || undefined,
      sessionId,
      status: record.status,
      studentId: record.studentId,
      studentName: record.studentName,
      updatedAt: now
    }));

    await Promise.all(
      nextRecords.map((record) =>
        setDoc(
          doc(firebaseDb, attendanceRecordPath(sessionId, record.studentId)),
          removeUndefinedValues({
            ...record,
            updatedAt: serverTimestamp()
          })
        )
      )
    );

    return nextRecords;
  },
  async updateAttendanceSession(payload: StoredAttendanceSessionUpdateInput) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(doc(firebaseDb, attendanceSessionPath(payload.id)), {
      courseId: payload.courseId,
      createdBy: payload.createdBy,
      date: payload.date,
      title: payload.title.trim(),
      updatedAt: serverTimestamp()
    });

    const session = await getSession(payload.id);

    if (!session) {
      throw new Error("Firebase attendance session not found after update.");
    }

    return session;
  }
};
