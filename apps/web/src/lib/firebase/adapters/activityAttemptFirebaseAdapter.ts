import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import {
  calculateActivityScore,
  currentStudentActivityIdentity,
  type Activity,
  type ActivityAnswer,
  type ActivityAttempt
} from "../../mock/activities";
import { requireFirebaseServices } from "../client";
import {
  activityAttemptPath,
  createActivityAttemptId,
  firestoreCollections
} from "../firestorePaths";

export type FirebaseActivityAttemptInput = {
  activity: Activity;
  answers: ActivityAnswer[];
  studentId: string;
  studentName?: string;
};

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

function toFirestoreJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mapActivityAttemptDocument(id: string, data: Record<string, unknown>): ActivityAttempt {
  return {
    activityId: typeof data.activityId === "string" ? data.activityId : "",
    answers: Array.isArray(data.answers) ? (data.answers as ActivityAnswer[]) : [],
    courseId: typeof data.courseId === "string" ? data.courseId : undefined,
    id: typeof data.id === "string" ? data.id : id,
    score: typeof data.score === "number" ? data.score : undefined,
    studentId: typeof data.studentId === "string" ? data.studentId : undefined,
    studentName: typeof data.studentName === "string" ? data.studentName : currentStudentActivityIdentity.name,
    submittedAt: toIsoTimestamp(data.submittedAt),
    updatedAt: toIsoTimestamp(data.updatedAt)
  };
}

async function getAttempt(activityId: string, studentId: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, activityAttemptPath(activityId, studentId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapActivityAttemptDocument(snapshot.id, snapshot.data());
}

export const activityAttemptFirebaseAdapter = {
  async getAttemptByActivityAndStudent(activityId: string, studentId: string) {
    return getAttempt(activityId, studentId);
  },
  async getAttemptsByActivityId(activityId: string) {
    const { firebaseDb } = requireFirebaseServices();
    const snapshot = await getDocs(
      query(collection(firebaseDb, firestoreCollections.activityAttempts), where("activityId", "==", activityId))
    );

    return snapshot.docs
      .map((documentSnapshot) => mapActivityAttemptDocument(documentSnapshot.id, documentSnapshot.data()))
      .sort((first, second) => new Date(second.submittedAt).getTime() - new Date(first.submittedAt).getTime());
  },
  async submitAttempt(payload: FirebaseActivityAttemptInput) {
    const { firebaseDb } = requireFirebaseServices();
    const submittedAt = new Date().toISOString();
    const id = createActivityAttemptId(payload.activity.id, payload.studentId);
    const attempt: ActivityAttempt = {
      activityId: payload.activity.id,
      answers: toFirestoreJsonValue(payload.answers),
      courseId: payload.activity.courseId,
      id,
      score: calculateActivityScore(payload.activity, payload.answers),
      studentId: payload.studentId,
      studentName: payload.studentName || currentStudentActivityIdentity.name,
      submittedAt,
      updatedAt: submittedAt
    };

    await setDoc(doc(firebaseDb, activityAttemptPath(payload.activity.id, payload.studentId)), {
      ...attempt,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return attempt;
  }
};
