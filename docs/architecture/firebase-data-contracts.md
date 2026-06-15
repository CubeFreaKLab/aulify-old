# Firebase Data Contracts

Last updated: June 14, 2026

This document defines the first real data contract layer for the Aulify Firebase migration. It does not change current app behavior. The existing mock/localStorage repositories remain active until Firebase adapters are implemented module by module.

## Scope

Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`:

- `users`
- `profiles`
- `courses`
- `courseMembers`

- `notes`
- `tasks`
- `taskSubmissions`
- `attendanceSessions`
- `attendanceRecords`
- `activities`
- `activityAttempts`

Remaining planning only:

- derived progress aggregates, if later needed for performance
- `files`
- `settings`
- `liveQuizRooms`
- `liveQuizPlayers`
- `liveQuizAnswers`

## Shared Type Source

Stable domain contracts now live in `packages/shared-types`:

- `domain/common.ts`
- `domain/user.ts`
- `domain/profile.ts`
- `domain/course.ts`
- `domain/course-member.ts`
- `contracts/repositories.ts`

The interfaces are async by design because Firebase Auth, Firestore, Storage, and backend calls are asynchronous.

Current UI repositories in `apps/web/src/lib/repositories` should continue using mock/localStorage data for now. Future Firebase adapters should implement the async contracts from `@aulify/shared-types`.

## Collection Conventions

### `users`

Purpose: stable auth-linked user record.

Document ID strategy:

- Use the Firebase Auth UID as the document ID.
- Path: `users/{userId}`.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Same value as Firebase Auth UID. |
| `email` | string | Normalized lowercase email. |
| `role` | `teacher` \| `student` \| `admin` | Global platform role. Course-level role is stored in `courseMembers`. |
| `createdAt` | timestamp | Server timestamp. |
| `updatedAt` | timestamp | Server timestamp. |

Ownership rules:

- A signed-in user can read their own `users/{userId}` document.
- Admins can read/manage users.
- Normal users should not be able to set themselves as `admin`.

Query patterns:

- `users/{currentUserId}` by direct document lookup.
- Admin user search later, probably via backend/admin service.

Likely indexes:

- `role`
- `email`

### `profiles`

Purpose: display profile and user preferences that are safe to show inside course contexts.

Document ID strategy:

- Use the same Firebase Auth UID.
- Path: `profiles/{userId}`.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | string | Firebase Auth UID. |
| `displayName` | string | Required display name. |
| `avatarUrl` | string optional | Storage-backed image URL or controlled download URL later. |
| `avatarConfig` | object optional | Future avatar customization settings. |
| `bio` | string optional | Short profile description. |
| `settings` | object optional | Lightweight profile preferences. |
| `createdAt` | timestamp | Server timestamp. |
| `updatedAt` | timestamp | Server timestamp. |

Ownership rules:

- A signed-in user can read and update their own profile.
- Course members can read limited profile fields for members in the same course.
- Admins can read/manage profiles.

Query patterns:

- `profiles/{currentUserId}` direct lookup.
- Batch lookup by course member IDs for roster display.

Likely indexes:

- None required initially beyond direct document reads.
- Add search-specific indexing later if profile search is introduced.

### `courses`

Purpose: course metadata owned by a teacher.

Document ID strategy:

- Firestore auto ID or slug plus short random suffix.
- Path: `courses/{courseId}`.
- Do not use the course title alone as the ID because titles can change.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Course document ID. |
| `title` | string | Production name for course title. Current UI uses `name`; adapters can map this. |
| `description` | string | Course description. |
| `subject` | string | Subject/category. |
| `teacherId` | string | Primary owner user ID. |
| `status` | `draft` \| `active` \| `archived` | Course lifecycle. |
| `joinCode` | string optional | Short code for the first simple student enrollment flow. |
| `coverImageUrl` | string optional | Future course cover asset. |
| `createdAt` | timestamp | Server timestamp. |
| `updatedAt` | timestamp | Server timestamp. |

Ownership rules:

- Primary teacher can create/update/archive their courses.
- Active course members can read course metadata.
- Students cannot update course metadata.
- Archived courses remain readable to authorized members unless product policy changes.

Query patterns:

- Teacher courses: query `courses` where `teacherId == currentUserId` and `status != archived`.
- Student courses: resolve memberships from `courseMembers`, then fetch course docs.
- Course detail: direct lookup by `courseId` plus membership check.

Likely indexes:

- `teacherId`, `status`, `updatedAt`
- `status`, `updatedAt`

### `courseMembers`

Purpose: membership, roster, and course-level permissions.

Document ID strategy:

- Prefer deterministic ID: `{courseId}_{userId}`.
- Path: `courseMembers/{courseMemberId}`.
- Store `courseId` and `userId` as fields for queries.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Deterministic membership ID. |
| `courseId` | string | Linked course. |
| `userId` | string | Linked user/profile. |
| `role` | `teacher` \| `student` | Course-level role. |
| `displayName` | string | Snapshot for roster display. |
| `email` | string | Snapshot for invitations/roster. |
| `joinedAt` | timestamp | Join/invite accepted date. |
| `status` | `active` \| `invited` \| `removed` | Membership lifecycle. |

Ownership rules:

- Course teachers can list and manage members for their courses.
- Students can read their own membership and active members if product policy allows roster visibility.
- Removed members should not read course content.
- Invited members should have limited access until accepted.

Query patterns:

- Course roster: query `courseMembers` where `courseId == courseId` and `status == active`.
- User enrollments: query `courseMembers` where `userId == currentUserId` and `status == active`.
- Membership check: direct lookup `courseMembers/{courseId}_{userId}`.

Likely indexes:

- `courseId`, `status`, `role`
- `userId`, `status`
- `courseId`, `userId`

## Secondary Collections

### `notes`

Suggested fields:

- `id`
- `courseId`
- `createdBy`
- `title`
- `summary`
- `documentBlocks`
- `status`: `draft` or `published`
- `createdAt`
- `updatedAt`

Query patterns:

- Teacher: by `courseId`, all statuses.
- Student: by `courseId`, `status == published`, membership required.

Migration status:

- Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
- Mock/localStorage remains active when the data source is `mock`.

### `tasks`

Suggested fields:

- `id`
- `courseId`
- `createdBy`
- `title`
- `summary`
- `instructionsBlocks`
- `dueDate`
- `status`: `draft`, `published`, `closed`
- `points`
- `resources`
- `attachments`
- `createdAt`
- `updatedAt`

Query patterns:

- Teacher: by `courseId`, all statuses.
- Student: by `courseId`, published/closed visible based on product policy.

Migration status:

- Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
- Attachments are metadata only. Firebase Storage is not connected yet.

### `taskSubmissions`

Suggested fields:

- `id`
- `taskId`
- `courseId`
- `studentId`
- `studentName`
- `studentEmail`
- `content`
- `attachments`
- `status`: `submitted`, `reviewed`
- `score`
- `feedback`
- `submittedAt`
- `updatedAt`

Query patterns:

- Teacher: by `taskId`.
- Student: by `taskId` and `studentId`.

Document ID strategy:

- Current implementation uses deterministic ID `{taskId}_{studentId}` for one current submission per student per task.

Migration status:

- Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
- Submission attachments are metadata only. File bytes are not stored in Firestore.

### `attendanceSessions`

Suggested fields:

- `id`
- `courseId`
- `title`
- `date`
- `createdBy`
- `createdAt`
- `updatedAt`

Query patterns:

- By `courseId`, ordered by `date`.

Migration status:

- Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
- Excel export reads these sessions from Firestore in firebase mode.

### `attendanceRecords`

Suggested fields:

- `id`
- `sessionId`
- `courseId`
- `studentId`
- `studentName`
- `status`: `present`, `absent`, `late`, `excused`
- `note`
- `updatedAt`

Document ID strategy:

- Prefer deterministic ID: `{sessionId}_{studentId}`.

Query patterns:

- By `sessionId`.
- By `courseId` and `studentId` for student summary.

Migration status:

- Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
- Teacher attendance forms build the roster from active student `courseMembers` in firebase mode.
- Students can read only their own attendance summary in the client flow. Firestore security rules are still required before production.

### `activities`

Suggested fields:

- `id`
- `courseId`
- `createdBy`
- `title`
- `description`
- `type`: `quiz`, `true_false`, `quick_question`, `poll`
- `status`: `draft`, `published`, `closed`
- `questions`
- `createdAt`
- `updatedAt`

Query patterns:

- Teacher: by `courseId`, all statuses.
- Student: by `courseId`, `status == published`, membership required.

Migration status:

- Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
- These are asynchronous course activities, not live room sessions.

### `activityAttempts`

Suggested fields:

- `id`
- `activityId`
- `courseId`
- `studentId`
- `answers`
- `score`
- `submittedAt`
- `updatedAt`

Document ID strategy:

- For one attempt per student: `{activityId}_{studentId}`.
- For multiple attempts later: auto ID plus attempt number.

Migration status:

- Firebase-backed in `apps/web` when `NEXT_PUBLIC_AULIFY_DATA_SOURCE=firebase`.
- Current implementation uses deterministic ID `{activityId}_{studentId}` and preserves one attempt per student per activity.

### Derived progress and academic tracking

Current status:

- No `progress` Firestore collection exists.
- Teacher `Seguimiento académico` and student `Mi avance` are calculated from existing repositories.
- In firebase mode, the calculations read Firebase-backed courses, course members, tasks, task submissions, attendance, activities, and activity attempts.
- Mock/localStorage remains active when the data source is `mock`.

Concept rule:

- Do not store or display a generic course completion percentage until courses have explicit completion requirements, dates, or module criteria.
- Academic advancement should be derived only from submitted tasks and completed asynchronous activities.
- Attendance and performance should remain separate indicators.

Future option:

- Add aggregate documents only if query cost or page latency requires it after production data patterns are known.

### `files`

Suggested fields:

- `id`
- `ownerId`
- `courseId`
- `scope`: `note`, `task`, `submission`, `profile`, `course`
- `storagePath`
- `name`
- `contentType`
- `size`
- `createdAt`
- `updatedAt`

Storage path examples:

- `courses/{courseId}/notes/{noteId}/{fileId}`
- `courses/{courseId}/tasks/{taskId}/{fileId}`
- `courses/{courseId}/submissions/{submissionId}/{fileId}`
- `profiles/{userId}/{fileId}`

### `settings`

Suggested fields:

- `userId`
- `theme`
- `locale`
- `notifications`
- `updatedAt`

Document ID strategy:

- Use `settings/{userId}` or embed in `profiles.settings` until settings grows.

### `liveQuizRooms`

Suggested fields:

- `id`
- `courseId`
- `activityId` optional
- `createdBy`
- `roomCode`
- `status`: `lobby`, `active`, `paused`, `ended`
- `currentQuestionId`
- `startedAt`
- `endedAt`
- `createdAt`

Planning note:

- Active room state may belong in Firebase Realtime Database rather than Firestore if low-latency session updates are required.

### `liveQuizPlayers`

Suggested fields:

- `id`
- `roomId`
- `userId`
- `nickname`
- `avatarConfig`
- `joinedAt`
- `status`
- `score`

### `liveQuizAnswers`

Suggested fields:

- `id`
- `roomId`
- `questionId`
- `playerId`
- `answer`
- `isCorrect`
- `pointsAwarded`
- `submittedAt`
- `lockedAt`

## Repository Contract Migration Strategy

Current state:

- `apps/web/src/lib/repositories` remains the UI-facing boundary.
- Mock arrays and localStorage helpers remain active in `mock` mode.
- Firebase adapters are used behind the data-source switch for migrated modules.
- Progress/academic tracking remains derived from existing repositories instead of persisted as a separate collection.

Future adapter shape:

- Firebase adapters should implement:
  - `AuthRepositoryContract`
  - `ProfileRepositoryContract`
  - `CourseRepositoryContract`
  - `CourseMemberRepositoryContract`
- The UI should migrate only after adapters and loading/error states are ready.

Migration order:

1. Firebase Auth.
2. `users` and `profiles`.
3. `courses`.
4. `courseMembers`.
5. `notes`, `tasks`, and `taskSubmissions`.
6. `attendanceSessions` and `attendanceRecords`.
7. `activities` and `activityAttempts`.
8. Derived progress/academic tracking from existing repositories.
9. `files` and Firebase Storage.
10. `liveQuizRooms`, `liveQuizPlayers`, and `liveQuizAnswers`.

Module-by-module migration rule:

- Keep one repository boundary per domain.
- Swap implementation behind the repository boundary.
- Preserve route behavior during migration.
- Add async loading and error states before replacing synchronous localStorage reads.
- Do not migrate file uploads until storage rules and file limits are documented.

## Security Rules Direction

Initial rules should enforce:

- A user can read their own `users/{userId}` and `profiles/{userId}`.
- A teacher can manage a course when they are the primary `teacherId` or an active teacher member.
- A student can read course content only if they have an active `courseMembers` record.
- Students can create/read their own submissions and attempts.
- Teachers can read submissions/attempts for their courses.
- Attendance records can be written by course teachers only.
- Files can be read only by users with access to the owning course/object.

Security rules should be tested before production data is used.

## Index Planning

Likely early composite indexes:

- `courses`: `teacherId`, `status`, `updatedAt`
- `courseMembers`: `userId`, `status`
- `courseMembers`: `courseId`, `status`, `role`
- `notes`: `courseId`, `status`, `updatedAt`
- `tasks`: `courseId`, `status`, `dueDate`
- `taskSubmissions`: `taskId`, `studentId`
- `attendanceSessions`: `courseId`, `date`
- `attendanceRecords`: `courseId`, `studentId`
- `activities`: `courseId`, `status`, `updatedAt`
- `activityAttempts`: `activityId`, `studentId`

Add indexes only when real queries are implemented and Firestore requires them.
