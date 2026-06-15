import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import type { Activity, ActivityQuestion, ActivityStatus, ActivityType } from "../../mock/activities";
import type { StoredActivityInput } from "../../activityStorage";
import { requireFirebaseServices } from "../client";
import { activityPath, firestoreCollections } from "../firestorePaths";

export type FirebaseActivityInput = StoredActivityInput & {
  createdBy: string;
};

export type FirebaseActivityUpdateInput = StoredActivityInput;

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

function isActivityType(value: unknown): value is ActivityType {
  return value === "quiz" || value === "true_false" || value === "quick_question" || value === "poll";
}

function isActivityStatus(value: unknown): value is ActivityStatus {
  return value === "draft" || value === "published" || value === "closed";
}

function removeUndefinedValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

function toFirestoreJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mapActivityDocument(id: string, data: Record<string, unknown>): Activity {
  const type = data.type;
  const status = data.status;

  if (!isActivityType(type) || !isActivityStatus(status)) {
    throw new Error("Firebase activity type or status is missing or invalid.");
  }

  return {
    courseId: typeof data.courseId === "string" ? data.courseId : "",
    createdAt: toIsoTimestamp(data.createdAt),
    createdBy: typeof data.createdBy === "string" ? data.createdBy : undefined,
    description: typeof data.description === "string" ? data.description : "",
    id: typeof data.id === "string" ? data.id : id,
    questions: Array.isArray(data.questions) ? (data.questions as ActivityQuestion[]) : [],
    status,
    title: typeof data.title === "string" ? data.title : "",
    type,
    updatedAt: toIsoTimestamp(data.updatedAt)
  };
}

async function getActivity(activityId: string) {
  const { firebaseDb } = requireFirebaseServices();
  const snapshot = await getDoc(doc(firebaseDb, activityPath(activityId)));

  if (!snapshot.exists()) {
    return null;
  }

  return mapActivityDocument(snapshot.id, snapshot.data());
}

export const activityFirebaseAdapter = {
  async createActivity(payload: FirebaseActivityInput) {
    const { firebaseDb } = requireFirebaseServices();
    const activityReference = doc(collection(firebaseDb, firestoreCollections.activities));
    const now = new Date().toISOString();
    const activity: Activity = {
      courseId: payload.courseId,
      createdAt: now,
      createdBy: payload.createdBy,
      description: payload.description.trim(),
      id: activityReference.id,
      questions: toFirestoreJsonValue(payload.questions),
      status: payload.status,
      title: payload.title.trim(),
      type: payload.type,
      updatedAt: now
    };

    await setDoc(activityReference, {
      ...activity,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return activity;
  },
  async getActivitiesByCourseId(courseId: string, options?: { publishedOnly?: boolean }) {
    const { firebaseDb } = requireFirebaseServices();
    const constraints = [where("courseId", "==", courseId)];

    if (options?.publishedOnly) {
      constraints.push(where("status", "==", "published"));
    }

    const snapshot = await getDocs(query(collection(firebaseDb, firestoreCollections.activities), ...constraints));

    return snapshot.docs
      .map((documentSnapshot) => mapActivityDocument(documentSnapshot.id, documentSnapshot.data()))
      .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime());
  },
  async getActivityById(activityId: string) {
    return getActivity(activityId);
  },
  async updateActivity(activityId: string, payload: FirebaseActivityUpdateInput) {
    const { firebaseDb } = requireFirebaseServices();

    await updateDoc(
      doc(firebaseDb, activityPath(activityId)),
      removeUndefinedValues({
        courseId: payload.courseId,
        description: payload.description.trim(),
        questions: toFirestoreJsonValue(payload.questions),
        status: payload.status,
        title: payload.title.trim(),
        type: payload.type,
        updatedAt: serverTimestamp()
      })
    );

    const activity = await getActivity(activityId);

    if (!activity) {
      throw new Error("Firebase activity not found after update.");
    }

    return activity;
  }
};
