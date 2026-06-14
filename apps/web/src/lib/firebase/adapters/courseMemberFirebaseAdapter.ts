import type {
  AddCourseMemberPayload,
  CourseId,
  CourseMember,
  CourseMemberRepositoryContract,
  TimestampLike,
  UpdateCourseMemberPayload,
  UserId
} from "@aulify/shared-types";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { requireFirebaseServices } from "../client";
import { courseMemberPath, createCourseMemberId, firestoreCollections } from "../firestorePaths";

function getTimestampValue(value: unknown): TimestampLike {
  if (typeof value === "string" || value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    return value as TimestampLike;
  }

  return new Date().toISOString();
}

function isCourseMemberRole(value: unknown): value is CourseMember["role"] {
  return value === "teacher" || value === "student";
}

function isCourseMemberStatus(value: unknown): value is CourseMember["status"] {
  return value === "active" || value === "invited" || value === "removed";
}

function mapCourseMemberDocument(id: string, data: Record<string, unknown>): CourseMember {
  const role = data.role;
  const status = data.status;

  if (!isCourseMemberRole(role) || !isCourseMemberStatus(status)) {
    throw new Error("Firebase course member role or status is missing or invalid.");
  }

  return {
    courseId: typeof data.courseId === "string" ? data.courseId : "",
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    email: typeof data.email === "string" ? data.email : "",
    id: typeof data.id === "string" ? data.id : id,
    joinedAt: getTimestampValue(data.joinedAt),
    role,
    status,
    userId: typeof data.userId === "string" ? data.userId : ""
  };
}

async function getMember(courseId: CourseId, userId: UserId) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, courseMemberPath(courseId, userId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapCourseMemberDocument(snapshot.id, snapshot.data());
}

export const courseMemberFirebaseAdapter: CourseMemberRepositoryContract = {
  async addCourseMember(payload: AddCourseMemberPayload) {
    const { firebaseDb } = requireFirebaseServices();
    const id = createCourseMemberId(payload.courseId, payload.userId);
    const now = new Date().toISOString();
    const member: CourseMember = {
      courseId: payload.courseId,
      displayName: payload.displayName.trim(),
      email: payload.email.trim().toLowerCase(),
      id,
      joinedAt: now,
      role: payload.role,
      status: payload.status ?? "active",
      userId: payload.userId
    };

    await setDoc(doc(firebaseDb, courseMemberPath(payload.courseId, payload.userId)), {
      ...member,
      joinedAt: serverTimestamp()
    });

    return member;
  },
  async getCourseMember(courseId: CourseId, userId: UserId) {
    return getMember(courseId, userId);
  },
  async getCourseMembers(courseId: CourseId) {
    const { firebaseDb } = requireFirebaseServices();
    const snapshot = await getDocs(query(collection(firebaseDb, firestoreCollections.courseMembers), where("courseId", "==", courseId)));

    return snapshot.docs.map((documentSnapshot) => mapCourseMemberDocument(documentSnapshot.id, documentSnapshot.data()));
  },
  async getCourseMembersByUser(userId: UserId) {
    const { firebaseDb } = requireFirebaseServices();
    const snapshot = await getDocs(
      query(collection(firebaseDb, firestoreCollections.courseMembers), where("userId", "==", userId), where("status", "==", "active"))
    );

    return snapshot.docs.map((documentSnapshot) => mapCourseMemberDocument(documentSnapshot.id, documentSnapshot.data()));
  },
  async removeCourseMember(courseId: CourseId, userId: UserId) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(doc(firebaseDb, courseMemberPath(courseId, userId)), {
      status: "removed"
    });
  },
  async updateCourseMember(courseId: CourseId, userId: UserId, payload: UpdateCourseMemberPayload) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(doc(firebaseDb, courseMemberPath(courseId, userId)), payload);

    const member = await getMember(courseId, userId);

    if (!member) {
      throw new Error("Firebase course member not found after update.");
    }

    return member;
  }
};
