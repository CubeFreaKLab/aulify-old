import type {
  Course,
  CourseId,
  CourseRepositoryContract,
  CourseStatus,
  CreateCoursePayload,
  TimestampLike,
  UpdateCoursePayload,
  UserId
} from "@aulify/shared-types";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { requireFirebaseServices } from "../client";
import { coursePath, firestoreCollections } from "../firestorePaths";
import { courseMemberFirebaseAdapter } from "./courseMemberFirebaseAdapter";

function createJoinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function normalizeJoinCode(joinCode: string) {
  return joinCode.trim().toUpperCase().replace(/\s+/g, "");
}

function getTimestampValue(value: unknown): TimestampLike {
  if (typeof value === "string" || value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    return value as TimestampLike;
  }

  return new Date().toISOString();
}

function isCourseStatus(value: unknown): value is CourseStatus {
  return value === "draft" || value === "active" || value === "archived";
}

function removeUndefinedValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

function mapCourseDocument(id: string, data: Record<string, unknown>): Course {
  const status = data.status;

  if (!isCourseStatus(status)) {
    throw new Error("Firebase course status is missing or invalid.");
  }

  return {
    coverImageUrl: typeof data.coverImageUrl === "string" ? data.coverImageUrl : undefined,
    createdAt: getTimestampValue(data.createdAt),
    description: typeof data.description === "string" ? data.description : "",
    id: typeof data.id === "string" ? data.id : id,
    joinCode: typeof data.joinCode === "string" ? data.joinCode : undefined,
    status,
    subject: typeof data.subject === "string" ? data.subject : "",
    teacherId: typeof data.teacherId === "string" ? data.teacherId : "",
    title: typeof data.title === "string" ? data.title : "",
    updatedAt: getTimestampValue(data.updatedAt)
  };
}

async function getCourse(courseId: CourseId) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, coursePath(courseId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapCourseDocument(snapshot.id, snapshot.data());
}

async function getCoursesByIds(courseIds: CourseId[]) {
  const uniqueCourseIds = [...new Set(courseIds)];
  const courses = await Promise.all(uniqueCourseIds.map((courseId) => getCourse(courseId)));

  return courses.filter((course): course is Course => Boolean(course && course.status !== "archived"));
}

export const courseFirebaseAdapter: CourseRepositoryContract = {
  async archiveCourse(courseId: CourseId) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(doc(firebaseDb, coursePath(courseId)), {
      status: "archived",
      updatedAt: serverTimestamp()
    });
  },
  async createCourse(payload: CreateCoursePayload) {
    const { firebaseDb } = requireFirebaseServices();
    const courseReference = doc(collection(firebaseDb, firestoreCollections.courses));
    const now = new Date().toISOString();
    const course: Course = {
      coverImageUrl: payload.coverImageUrl,
      createdAt: now,
      description: payload.description.trim(),
      id: courseReference.id,
      joinCode: normalizeJoinCode(payload.joinCode ?? createJoinCode()),
      status: payload.status ?? "active",
      subject: payload.subject.trim(),
      teacherId: payload.teacherId,
      title: payload.title.trim(),
      updatedAt: now
    };

    await setDoc(
      courseReference,
      removeUndefinedValues({
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );

    return course;
  },
  async getCourseById(courseId: CourseId) {
    return getCourse(courseId);
  },
  async getCoursesByStudent(studentId: UserId) {
    const memberships = await courseMemberFirebaseAdapter.getCourseMembersByUser(studentId);
    const courseIds = memberships
      .filter((membership) => membership.role === "student" && membership.status === "active")
      .map((membership) => membership.courseId);

    return getCoursesByIds(courseIds);
  },
  async getCoursesByTeacher(teacherId: UserId) {
    const { firebaseDb } = requireFirebaseServices();
    const snapshot = await getDocs(query(collection(firebaseDb, firestoreCollections.courses), where("teacherId", "==", teacherId)));

    return snapshot.docs
      .map((documentSnapshot) => mapCourseDocument(documentSnapshot.id, documentSnapshot.data()))
      .filter((course) => course.status !== "archived");
  },
  async updateCourse(courseId: CourseId, payload: UpdateCoursePayload) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(
      doc(firebaseDb, coursePath(courseId)),
      removeUndefinedValues({
        ...payload,
        joinCode: payload.joinCode ? normalizeJoinCode(payload.joinCode) : undefined,
        updatedAt: serverTimestamp()
      })
    );

    const course = await getCourse(courseId);

    if (!course) {
      throw new Error("Firebase course not found after update.");
    }

    return course;
  }
};

export async function getCourseByJoinCode(joinCode: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDocs(
    query(collection(firebaseDb, firestoreCollections.courses), where("joinCode", "==", normalizeJoinCode(joinCode)))
  );
  const firstDocument = snapshot.docs[0];

  if (!firstDocument) {
    return null;
  }

  const course = mapCourseDocument(firstDocument.id, firstDocument.data());

  return course.status === "archived" ? null : course;
}
