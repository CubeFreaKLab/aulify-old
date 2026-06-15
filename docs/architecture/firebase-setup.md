# Firebase Setup

Last updated: June 14, 2026

This document explains the Firebase foundation for Aulify. The current app still uses mock/localStorage repositories by default. Firebase-backed modules are enabled only when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.

## Current State

- Firebase client SDK is installed in `apps/web`.
- Public Firebase environment variables are documented in `.env.example` and `apps/web/.env.example`.
- Firebase client initialization lives in `apps/web/src/lib/firebase/client.ts`.
- Firebase auth and profile adapters support registration, login, logout, current user lookup, and auth state listening.
- Course and course member adapters support Firestore-backed course creation, listing, detail access, and student join-by-code.
- Notes, tasks, task submissions, attendance sessions, attendance records, asynchronous activities, and activity attempts are Firebase-backed in firebase mode.
- Progress, files, and live quizzes remain mock/localStorage.
- `NEXT_PUBLIC_AULIFY_DATA_SOURCE` defaults to `mock`.

## Required Firebase Products

Create or enable these products in the Firebase console:

1. Authentication
2. Cloud Firestore
3. Firebase Storage

Live quizzes may later use Firebase Realtime Database, but it is not required for the first migration phase.

## Create a Firebase Project

1. Open the Firebase console.
2. Create a new project for Aulify.
3. Add a Web app to the Firebase project.
4. Copy the public web app config values.
5. Enable Email/Password Authentication for the first auth migration.
6. Create a Firestore database.
7. Create a Storage bucket.

Use separate Firebase projects for local/staging/production once deployment begins.

## Required Environment Variables

The web app expects these public variables:

```bash
NEXT_PUBLIC_AULIFY_DATA_SOURCE=mock
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

`NEXT_PUBLIC_AULIFY_DATA_SOURCE` supports:

- `mock`
- `firebase`

Default should remain `mock` until each Firebase-backed module has been tested with real project data and security rules.

## Local Env Example

Create `apps/web/.env.local` locally when you are ready to test Firebase.

```bash
NEXT_PUBLIC_AULIFY_DATA_SOURCE=mock
NEXT_PUBLIC_FIREBASE_API_KEY=replace-with-local-value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=replace-with-local-value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=replace-with-local-value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=replace-with-local-value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=replace-with-local-value
NEXT_PUBLIC_FIREBASE_APP_ID=replace-with-local-value
```

Do not commit `.env.local`.

Firebase web config values are public identifiers, but they should still be managed through env files so environments stay separate.

## Data Source Switching

The helper at `apps/web/src/lib/config/dataSource.ts` reads `NEXT_PUBLIC_AULIFY_DATA_SOURCE`.

Current behavior:

- `mock`: the app continues using current mock/localStorage repositories.
- `firebase`: auth, `users`, `profiles`, `courses`, `courseMembers`, `notes`, `tasks`, `taskSubmissions`, `attendanceSessions`, `attendanceRecords`, `activities`, and `activityAttempts` use Firebase. Progress, files, and live quizzes still use mock/localStorage data.

Task attachments remain metadata-only in this phase. The app stores file name, type, size, and PDF size status, but does not upload or store real file bytes.

## Firebase Client Initialization

`apps/web/src/lib/firebase/client.ts` exports:

- `firebaseApp`
- `firebaseAuth`
- `firebaseDb`
- `firebaseStorage`
- `requireFirebaseServices`

If Firebase env values are missing and the data source is `mock`, the exported Firebase services are `null` and the current demo app continues to run.

If the data source is `firebase` and env values are incomplete, initialization throws a clear configuration error.

## Adapter Scaffolds

The first adapter files are:

- `apps/web/src/lib/firebase/adapters/authFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/profileFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/courseFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/courseMemberFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/noteFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/taskFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/taskSubmissionFirebaseAdapter.ts`

Auth/profile, courses/course members, notes, tasks, and task submission methods are implemented for the current migration phase.

The auth UI uses the mock or Firebase path based on `NEXT_PUBLIC_AULIFY_DATA_SOURCE`.

## Firestore Path Helpers

`apps/web/src/lib/firebase/firestorePaths.ts` contains helpers for:

- `users/{userId}`
- `profiles/{userId}`
- `courses/{courseId}`
- `courseMembers/{courseId}_{userId}`
- `notes/{noteId}`
- `tasks/{taskId}`
- `taskSubmissions/{taskId}_{studentId}`
- `attendanceSessions/{sessionId}`
- `attendanceRecords/{sessionId}_{studentId}`
- `activities/{activityId}`
- `activityAttempts/{activityId}_{studentId}`

Path conventions are documented in `docs/architecture/firebase-data-contracts.md`.

## First Migration Order

1. Firebase Auth.
2. `users` and `profiles`.
3. `courses`.
4. `courseMembers`.
5. `notes`, `tasks`, and `taskSubmissions`.
6. `attendanceSessions` and `attendanceRecords`.
7. `activities` and `activityAttempts`.
8. `progress` aggregates.
9. `files` and Firebase Storage.
10. Live quiz data.

## Testing Firebase Auth Locally

1. Add Firebase public values to `apps/web/.env.local`.
2. Set the data source to Firebase:

```bash
NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase
```

3. Restart the web dev server:

```bash
pnpm --filter @aulify/web dev
```

4. Open `/auth/register`.
5. Register a teacher account.
6. Confirm the user appears in Firebase Authentication.
7. Confirm `users/{uid}` exists in Firestore.
8. Confirm `profiles/{uid}` exists in Firestore.
9. Log out.
10. Log in with the teacher account and confirm redirect to `/teacher/dashboard`.
11. Register a student account.
12. Log in with the student account and confirm redirect to `/student/dashboard`.

To return to the demo flow, switch back to:

```bash
NEXT_PUBLIC_AULIFY_DATA_SOURCE=mock
```

Then restart the dev server. Mock demo credentials and localStorage behavior remain available only in mock mode.

## Testing Firestore Courses Locally

1. Set `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
2. Restart the web dev server.
3. Log in as a Firebase teacher.
4. Open `/teacher/courses/new`.
5. Create a course.
6. Confirm `courses/{courseId}` exists in Firestore.
7. Confirm `courseMembers/{courseId}_{teacherId}` exists with role `teacher` and status `active`.
8. Confirm the teacher course list shows the Firestore course.
9. Open the teacher course detail and copy the join code.
10. Log in as a Firebase student.
11. Open `/student/courses`.
12. Use the join code in the `Unirse a curso por código` form.
13. Confirm `courseMembers/{courseId}_{studentId}` exists with role `student` and status `active`.
14. Confirm the student course list shows the course.

Notes and tasks created inside Firestore courses now use the same Firestore course IDs. Activities and attendance still use mock/localStorage data.

## Testing Firestore Notes, Tasks, and Submissions Locally

1. Set `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
2. Restart the web dev server.
3. Log in as a Firebase teacher.
4. Create or open a Firestore course.
5. Create a note from the course detail.
6. Confirm `notes/{noteId}` exists in Firestore with `courseId`, `createdBy`, `documentBlocks`, and `status`.
7. Edit the note and confirm `documentBlocks` update.
8. Create a task/practice from the course detail.
9. Confirm `tasks/{taskId}` exists in Firestore with `courseId`, `createdBy`, `instructionsBlocks`, `dueDate`, and `status`.
10. Log in as a Firebase student and join the course by code if needed.
11. Open the published task and submit a response with optional mock attachment metadata.
12. Confirm `taskSubmissions/{taskId}_{studentId}` exists in Firestore.
13. Log back in as the teacher and confirm the submission appears in the task detail.

Attachments are still metadata-only. Firebase Storage, upload validation, download URLs, and real file access rules are future work.

## Testing Firestore Attendance Locally

1. Set `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
2. Restart the web dev server.
3. Log in as a Firebase teacher.
4. Open a Firestore course with at least one active student member.
5. Open `/teacher/courses/{courseId}/attendance`.
6. Create an attendance session.
7. Mark students as `Presente`, `Ausente`, `Tarde`, or `Justificado`.
8. Confirm `attendanceSessions/{sessionId}` exists in Firestore.
9. Confirm `attendanceRecords/{sessionId}_{studentId}` exists for each saved student.
10. Reopen the attendance session and confirm the records load.
11. Export Excel and confirm the report uses the saved Firebase attendance data.
12. Log in as the Firebase student and open `/student/courses/{courseId}/attendance`.
13. Confirm the student sees only their own attendance summary and history.

Excel export uses the active data source, but report styling is not redesigned in this phase.

## Testing Firestore Activities Locally

1. Set `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
2. Restart the web dev server.
3. Log in as a Firebase teacher.
4. Open a Firestore course.
5. Create an asynchronous activity from the course detail.
6. Confirm `activities/{activityId}` exists in Firestore with `courseId`, `createdBy`, `questions`, `type`, and `status`.
7. Log in as a Firebase student and join the course by code if needed.
8. Open the published activity and submit answers.
9. Confirm `activityAttempts/{activityId}_{studentId}` exists in Firestore.
10. Log back in as the teacher and confirm activity results read the Firebase attempts.

Live quiz rooms, room codes, lobbies, rankings, and Realtime Database are future work and are not part of the asynchronous activities migration.

## Guardrails

- Do not remove mock/localStorage repositories yet.
- Do not change UI behavior until async adapters and loading/error states are ready.
- Do not commit `.env.local`.
- Do not hardcode Firebase config values in source files.
- Do not add Storage uploads before file limits and rules are implemented.
- Do not use production Firebase data before Firestore and Storage rules are tested.
- Firestore security rules are still required before production use.
