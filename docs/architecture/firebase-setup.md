# Firebase Setup

Last updated: June 14, 2026

This document explains the Firebase foundation for Aulify. The current app still uses mock/localStorage repositories by default. Firebase is not connected to login, courses, notes, tasks, attendance, activities, or progress yet.

## Current State

- Firebase client SDK is installed in `apps/web`.
- Public Firebase environment variables are documented in `.env.example` and `apps/web/.env.example`.
- Firebase client initialization lives in `apps/web/src/lib/firebase/client.ts`.
- Firebase adapter scaffolds exist for auth, profiles, courses, and course members.
- Current UI repositories remain mock/localStorage.
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

Default should remain `mock` until Firebase adapters are implemented and the UI has async loading/error states.

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
- `firebase`: reserved for future adapter wiring.

Do not switch production or demo environments to `firebase` until the relevant adapters are implemented.

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

The first adapter scaffolds are:

- `apps/web/src/lib/firebase/adapters/authFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/profileFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/courseFirebaseAdapter.ts`
- `apps/web/src/lib/firebase/adapters/courseMemberFirebaseAdapter.ts`

They import async repository contracts from `@aulify/shared-types`, but their methods intentionally throw `Firebase adapter method not implemented yet`.

These adapters are not wired into the UI yet.

## Firestore Path Helpers

`apps/web/src/lib/firebase/firestorePaths.ts` contains helpers for:

- `users/{userId}`
- `profiles/{userId}`
- `courses/{courseId}`
- `courseMembers/{courseId}_{userId}`

Path conventions are documented in `docs/architecture/firebase-data-contracts.md`.

## First Migration Order

1. Firebase Auth.
2. `users` and `profiles`.
3. `courses`.
4. `courseMembers`.
5. `notes` and `tasks`.
6. `attendance` and `activities`.
7. `files` and Firebase Storage.
8. Live quiz data.

## Guardrails

- Do not remove mock/localStorage repositories yet.
- Do not change UI behavior until async adapters and loading/error states are ready.
- Do not commit `.env.local`.
- Do not hardcode Firebase config values in source files.
- Do not add Storage uploads before file limits and rules are implemented.
- Do not use production Firebase data before Firestore and Storage rules are tested.
