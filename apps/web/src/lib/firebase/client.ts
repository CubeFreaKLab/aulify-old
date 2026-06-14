import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { isFirebaseDataSource } from "../config/dataSource";

type RequiredFirebaseOptions = FirebaseOptions & {
  apiKey: string;
  appId: string;
  authDomain: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
};

function getFirebaseOptions(): Partial<RequiredFirebaseOptions> {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  };
}

function hasFirebaseOptions(options: Partial<RequiredFirebaseOptions>): options is RequiredFirebaseOptions {
  return Boolean(
    options.apiKey &&
      options.appId &&
      options.authDomain &&
      options.messagingSenderId &&
      options.projectId &&
      options.storageBucket
  );
}

function createFirebaseApp() {
  const options = getFirebaseOptions();

  if (!hasFirebaseOptions(options)) {
    if (isFirebaseDataSource()) {
      throw new Error("Firebase data source is enabled, but the public Firebase environment variables are incomplete.");
    }

    return null;
  }

  return getApps().length ? getApp() : initializeApp(options);
}

export const firebaseApp: FirebaseApp | null = createFirebaseApp();
export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseStorage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;

export function requireFirebaseServices() {
  if (!firebaseApp || !firebaseAuth || !firebaseDb || !firebaseStorage) {
    throw new Error("Firebase is not configured. Check the NEXT_PUBLIC_FIREBASE_* environment variables.");
  }

  return {
    firebaseApp,
    firebaseAuth,
    firebaseDb,
    firebaseStorage
  };
}
