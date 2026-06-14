# Aulify Project Audit and Technical Roadmap

Last audited: June 14, 2026

## 1. Project Overview

Aulify is an educational web platform for organizing courses, class notes, practices/tasks, asynchronous activities, attendance, and progress insights. The product direction is classroom-workflow first, not game-first. The current build is a navigable MVP that demonstrates the core teacher and student experiences without production data services.

Aulify currently solves the problem of fragmented classroom management by putting course materials, structured notes, assignments, activities, attendance, and student progress into one consistent interface. The current implementation is strong enough for internal demos and workflow validation, but it is not production-ready because auth, persistence, permissions, enrollments, files, and real-time systems are still local/mock.

Current technical approach:

- TypeScript monorepo using pnpm workspaces.
- Next.js apps for `apps/landing` and `apps/web`.
- Express scaffolds for gateway and microservices, currently health-check only.
- Shared UI/design-system packages with official Aulify colors and Inter typography.
- `apps/web` uses repositories over typed mock/localStorage helpers.
- BlockNote powers document-style notes and task instructions.
- Attendance Excel export uses client-side `exceljs`.
- Firebase Auth, Firestore, Firebase Storage, backend APIs, and security rules are planned but not connected.

## 2. Current App Structure

| Area | Purpose | Current status |
| --- | --- | --- |
| `apps/landing` | Public website for Aulify. | Next.js app with navbar, hero, auth transition links, official logo assets, local app URL config. Still incomplete as a full public site. |
| `apps/web` | Main authenticated product app. | Most active app. Includes mock auth, teacher/student shells, dashboards, courses, notes, tasks, attendance, activities, and progress. |
| `apps/api-gateway` | Planned public API gateway. | Express scaffold with `GET /health` only. No auth middleware, routing, or business APIs yet. |
| `services/users-service` | Future user/profile/access service. | Express scaffold with `GET /health` only. |
| `services/courses-service` | Future course/enrollment service. | Express scaffold with `GET /health` only. |
| `services/notes-service` | Future notes/content service. | Express scaffold with `GET /health` only. |
| `services/tasks-service` | Future tasks/submissions service. | Express scaffold with `GET /health` only. |
| `services/activities-service` | Future async activities service. | Express scaffold with `GET /health` only. |
| `services/insights-service` | Future dashboards/insights service. | Express scaffold with `GET /health` only. |
| `packages/ui` | Shared reusable React UI primitives. | Basic button, card, input, badge, container, section, and empty state components. Used lightly; many app-level components still use local Tailwind classes. |
| `packages/design-system` | Official tokens and Tailwind theme extension. | Contains colors, typography, radius, shadows, spacing, motion, and CSS variables. |
| `packages/shared-types` | Shared type package. | Minimal scaffold. Domain types currently live mostly in `apps/web/src/lib/mock`. |
| `packages/validation` | Future shared validation package. | Minimal scaffold. Validation currently lives inside forms/components. |
| `packages/firebase-admin` | Future backend Firebase Admin wrapper. | Minimal scaffold. Not connected. |
| `packages/api-client` | Future frontend/backend client package. | Minimal scaffold. `apps/web` currently reads repositories directly. |
| `packages/config` | Shared config package. | Minimal scaffold. App-specific env usage still lives in app code. |
| `docs` | Architecture and product docs. | Initial docs exist. This audit adds the first architecture roadmap. |
| `assets` | Source brand/illustration/icon assets. | Assets exist at repo level and are copied into app public folders where needed. |
| `tests` | Future load/integration tests. | Folder scaffold only. No meaningful test suite yet. |

## 3. Current Routes Map

| Route | App | Role | Purpose | Current status | Notes/debt |
| --- | --- | --- | --- | --- | --- |
| `/` | `apps/landing` | Public | Public landing/home. | Implemented partial page. | Needs full public site content, responsive QA, SEO, analytics, and conversion sections. |
| `/` | `apps/web` | Public/internal | Placeholder authenticated app landing. | Placeholder only. | Should redirect based on session or move to a real app entry decision. |
| `/auth/login` | `apps/web` | Public | Login screen. | Implemented with mock credentials and demo accounts. | No real auth, password reset, OAuth, session cookie, or server guard. |
| `/auth/register` | `apps/web` | Public | Registration screen with role selection. | Implemented with mock user storage. | No duplicate-account handling UI beyond overwrite behavior; no email verification. |
| `/teacher/dashboard` | `apps/web` | Teacher | Teacher overview. | Implemented with mock summaries. | Counts should be connected more deeply to repositories after real data model stabilizes. |
| `/student/dashboard` | `apps/web` | Student | Student overview. | Implemented with mock summaries. | Same aggregation debt as teacher dashboard. |
| `/teacher/courses` | `apps/web` | Teacher | Teacher course list. | Implemented with mock/localStorage courses. | Needs real ownership, enrollment counts, sorting/filtering. |
| `/teacher/courses/new` | `apps/web` | Teacher | Create course. | Implemented localStorage. | No real validation against duplicate courses or backend save. |
| `/teacher/courses/[courseId]` | `apps/web` | Teacher | Teacher course detail. | Implemented. | Integrates notes, tasks, activities, attendance. Needs real membership/permission checks. |
| `/student/courses` | `apps/web` | Student | Student enrolled courses. | Implemented from mock data. | No real enrollment system yet. |
| `/student/courses/[courseId]` | `apps/web` | Student | Student course detail. | Implemented. | Student access is role-gated only, not enrollment-gated. |
| `/teacher/notes` | `apps/web` | Teacher | Teacher notes overview. | Implemented. | Uses localStorage plus mocks. Needs filters/search and backend ownership. |
| `/teacher/courses/[courseId]/notes/new` | `apps/web` | Teacher | Create class note. | Implemented with BlockNote. | No autosave, files, version history, or publish workflow audit. |
| `/teacher/courses/[courseId]/notes/[noteId]` | `apps/web` | Teacher | Teacher note detail. | Implemented. | Rendered from document blocks with legacy fallback. |
| `/teacher/courses/[courseId]/notes/[noteId]/edit` | `apps/web` | Teacher | Edit note. | Implemented. | Same BlockNote/localStorage constraints. |
| `/student/notes` | `apps/web` | Student | Published notes overview. | Implemented. | Publication filtering is local; no real enrollment/auth rules. |
| `/student/courses/[courseId]/notes/[noteId]` | `apps/web` | Student | Read-only note. | Implemented. | Needs real read permissions and file preview later. |
| `/teacher/tasks` | `apps/web` | Teacher | Teacher tasks/practices overview. | Implemented. | LocalStorage data with document instructions. |
| `/teacher/courses/[courseId]/tasks/new` | `apps/web` | Teacher | Create task/practice. | Implemented with document editor. | Attachments are metadata only; no real upload. |
| `/teacher/courses/[courseId]/tasks/[taskId]` | `apps/web` | Teacher | Teacher task detail and submissions. | Implemented. | Teacher actions like publish/close are visual placeholders. |
| `/teacher/courses/[courseId]/tasks/[taskId]/edit` | `apps/web` | Teacher | Edit task/practice. | Implemented. | LocalStorage update only. |
| `/student/tasks` | `apps/web` | Student | Student task overview. | Implemented. | Submission state is based on mock identity. |
| `/student/courses/[courseId]/tasks/[taskId]` | `apps/web` | Student | Read task and submit delivery. | Implemented. | File input stores metadata only, no file upload/download. |
| `/teacher/attendance` | `apps/web` | Teacher | Global attendance. | Not implemented. | Attendance is intentionally course-scoped for now. |
| `/teacher/courses/[courseId]/attendance` | `apps/web` | Teacher | Course attendance overview/export. | Implemented. | Roster is mock; export is client-side. |
| `/teacher/courses/[courseId]/attendance/[sessionId]` | `apps/web` | Teacher | Create/edit attendance session records. | Implemented. | No audit trail, lock, or real roster. |
| `/student/courses/[courseId]/attendance` | `apps/web` | Student | Read-only student attendance. | Implemented. | Uses mock student mapping. |
| `/teacher/activities` | `apps/web` | Teacher | Async activities overview. | Implemented. | No live room/session system. |
| `/teacher/courses/[courseId]/activities/new` | `apps/web` | Teacher | Create async activity. | Implemented. | Builder is simple; no images or advanced scoring. |
| `/teacher/courses/[courseId]/activities/[activityId]` | `apps/web` | Teacher | Activity detail/results. | Implemented. | Results are local/mock attempts. |
| `/student/activities` | `apps/web` | Student | Student async activities overview. | Implemented. | Attempts are localStorage/mock. |
| `/student/courses/[courseId]/activities/[activityId]` | `apps/web` | Student | Answer async activity. | Implemented. | No duplicate prevention beyond local current-student attempt. |
| `/teacher/progress` | `apps/web` | Teacher | Teacher progress/insights. | Implemented. | Aggregates local repositories; no real analytics service. |
| `/student/progress` | `apps/web` | Student | Student progress. | Implemented. | Uses mock/localStorage data and simple calculations. |
| `/profile` | `apps/web` | Teacher/student | Future profile. | Not implemented. | Needed before production demo. |
| `/settings` | `apps/web` | Teacher/student | Future settings/preferences. | Not implemented. | Needed for account/profile controls and dark mode. |

## 4. Current Modules Status

### Auth

What exists:

- Login and register screens with approved Aulify visual style.
- Registration role selector for teacher/student.
- Mock user accounts saved in localStorage under `aulify-mock-users`.
- Mock session saved in localStorage under `aulify.mockSession`.
- Demo credentials:
  - `profesor@aulify.test` / `aulify123`
  - `estudiante@aulify.test` / `aulify123`
- Client-side role route protection through `AppShell`.

What works:

- Register as teacher or student.
- Login with saved mock user or demo account.
- Logout.
- Role mismatch redirects between teacher/student dashboards.

Mock/localStorage:

- All auth and sessions.
- Passwords are stored only for local mock usage.

Needs production migration:

- Firebase Auth or equivalent auth provider.
- Server-side session model or secure token verification through backend.
- Role/profile lookup.
- Password reset, email verification, OAuth handling.
- Route protection that does not depend only on client-side redirects.

Known UX/design issues:

- Forgot password and legal links are placeholders.
- Google login button is disabled.
- No account duplicate/error flow beyond local overwrite behavior.

Suggested next improvements:

- Replace mock auth repository implementation with Firebase Auth adapter.
- Add a `profiles` model tied to auth UID.
- Add route-level guard strategy before moving sensitive data to production.

### Courses

What exists:

- Teacher course list, course creation, and course detail.
- Student course list and course detail.
- Course cards and preview lists.
- Course detail integration with notes, tasks, activities, and attendance.

What works:

- Teacher-created courses persist in localStorage.
- Teacher/student course pages render and navigate.

Mock/localStorage:

- Teacher-created courses.
- Student enrollments and roster counts.

Needs production migration:

- Real course ownership.
- Real course membership/enrollment.
- Course invitations or enrollment flows.
- Course archiving/status model.

Known UX/design issues:

- No search/filtering.
- No real empty-state onboarding for new accounts.
- Student access is not enrollment-enforced.

Suggested next improvements:

- Define `courses` and `courseMembers` Firestore collections.
- Move course membership into repository contracts before backend work.

### Notes

What exists:

- Teacher notes overview, create, detail, and edit.
- Student published notes overview and read-only detail.
- BlockNote-based document editor and viewer.
- Legacy text-note fallback rendering.
- Spanish-ish BlockNote dictionary/theme customization.

What works:

- Create/edit notes with document blocks.
- Save and reload note content from localStorage.
- Render read-only content for students.
- Keep old notes readable.

Mock/localStorage:

- Created/edited notes.
- Published/draft status.

Needs production migration:

- Persistent document JSON storage.
- Versioning or updated-by audit fields.
- Server-side publication permissions.
- Optional future file/resource attachments.

Known UX/design issues:

- BlockNote styling/localization may still need deeper QA across all menus and browsers.
- No autosave, version history, or conflict handling.
- No document-level search.

Suggested next improvements:

- Stabilize a shared `AulifyDocument` data type outside mock files.
- Add editor QA checklist and regression screens.
- Keep document editor reusable for tasks/materials.

### Tasks/Practices

What exists:

- Teacher tasks overview, create, detail, and edit.
- Student tasks overview and detail.
- Document-based assignment instructions using the same editor/viewer system as notes.
- Resources/links and mock attachment metadata.

What works:

- Teacher can create/edit tasks with rich instructions.
- Task cards derive summaries from document blocks.
- Students can view task instructions read-only.

Mock/localStorage:

- Tasks and task updates.
- Resources and attachment metadata.
- Student submission state.

Needs production migration:

- Task lifecycle: draft, published, closed.
- Assignment visibility and due-date enforcement.
- Real submission records and grading.
- File upload/download via storage.

Known UX/design issues:

- Publish/close teacher actions are still placeholders.
- No rubric, grading, comments, or resubmission policy.
- No real file preview.

Suggested next improvements:

- Define task status transitions.
- Add repository support for update/publish/close before backend migration.
- Design grading and feedback workflow.

### Submissions

What exists:

- Student task submission form with text response.
- Mock file metadata collection from browser file input.
- Teacher submissions list.

What works:

- Student can submit once locally.
- Submission persists in localStorage.
- File metadata displays in student and teacher views.

Mock/localStorage:

- All submission content.
- Attachments only store name, type, size, and PDF size status.

Needs production migration:

- Real upload to Firebase Storage.
- Real task submission documents.
- File validation and size limits.
- Virus/malware scanning strategy if required.
- Download permissions.

Known UX/design issues:

- No grading UI.
- No update/resubmit flow.
- No file preview.

Suggested next improvements:

- Add storage limits and file-type policy before implementing upload.
- Add submission detail and grading flow after real auth/user IDs exist.

### Attendance

What exists:

- Course-scoped teacher attendance overview.
- Attendance session create/edit page.
- Student read-only attendance summary.
- Statuses: present, absent, late, excused.
- Course attendance summaries.

What works:

- Teacher can create/edit local attendance sessions and records.
- Student can view summary for mock identity.
- Course detail links to attendance.

Mock/localStorage:

- Sessions and records.
- Roster/student identity.

Needs production migration:

- Real course roster.
- Teacher permissions.
- Attendance edit history.
- Locking or audit workflow if required by schools.

Known UX/design issues:

- No global attendance overview.
- No bulk import.
- Student mapping is mock.

Suggested next improvements:

- Define roster source from `courseMembers`.
- Add attendance repository tests before backend adapter.

### Excel Export

What exists:

- Client-side `.xlsx` export using `exceljs`.
- Styled report with title, course name, export date, status columns, totals, and percentages.

What works:

- Teacher can export course attendance from current local/mock data.

Mock/localStorage:

- Export source data.

Needs production migration:

- Export from backend-authorized data.
- Optional server-side export for large courses.
- Audit/export logs if required.

Known UX/design issues:

- No progress state for long exports.
- No logo embedded yet.

Suggested next improvements:

- Keep current export utility as a client demo path.
- Revisit export performance after real course size targets are known.

### Activities Async

What exists:

- Teacher activities overview, create form, detail/results.
- Student activities overview and answer detail.
- Activity types: quiz, true/false, quick question, poll.
- Local attempts and simple score/confirmation.

What works:

- Create async activities.
- Students submit answers.
- Teacher sees simple results.

Mock/localStorage:

- Activities and attempts.

Needs production migration:

- Real attempts tied to user IDs.
- Attempt limits.
- Scoring rules.
- Activity status transitions.

Known UX/design issues:

- Builder is basic.
- No media in questions.
- No advanced review/feedback flow.

Suggested next improvements:

- Normalize activity question schema before Firestore migration.
- Add consistent status/update functions in repository.

### Live Quizzes Future

What exists:

- Nothing production-like yet.
- Current activities are asynchronous only.

What works:

- Async activity patterns can inform question authoring, scoring, and result displays.

Needs production migration:

- Dedicated live room model.
- Real-time state sync.
- Lobby, player state, room codes, QR join, answer locks, and rankings.

Suggested next improvements:

- Treat live quizzes as a separate module after Firebase Auth, profiles, courses, and async activity persistence are stable.

### Progress/Insights

What exists:

- Teacher and student progress pages.
- Utility functions aggregate courses, notes, tasks, submissions, activities, and attempts.
- Summary cards, course progress cards, pending items, recent activity.

What works:

- Repository-backed local aggregation renders for teacher and student.

Mock/localStorage:

- All source data.
- Calculations are simple and local.

Needs production migration:

- Firestore queries or backend aggregation.
- Clear metrics definitions.
- Attendance integration into progress if desired.
- Historical trend data.

Known UX/design issues:

- No charts library by design.
- Some metrics are approximations over mock data.

Suggested next improvements:

- Define exact metric formulas before backend implementation.
- Decide whether insights are REST, GraphQL, or service-owned materialized summaries.

### Files/Documents

What exists:

- Document editor for notes and task instructions.
- Mock attachment metadata on tasks/submissions.
- No actual file contents are stored.

What works:

- File name/type/size metadata can be displayed.

Mock/localStorage:

- All file references.

Needs production migration:

- Firebase Storage.
- File metadata collection.
- Upload validation.
- Download permission checks.
- PDF preview.

Known UX/design issues:

- No upload progress.
- No preview UI.
- No file management page.

Suggested next improvements:

- Write a storage policy before adding upload code.
- Define PDF preview behavior and max file sizes.

### Profile/Settings Future

What exists:

- App shell can display session name and role.
- No dedicated profile or settings routes.

Needs production migration:

- Profile page.
- Settings page.
- Profile pictures/avatar customization.
- Preferences such as theme and notifications.

Suggested next improvements:

- Add profiles immediately after real auth.

### Landing/Public Site

What exists:

- Public navbar.
- Hero section.
- Logo assets.
- Auth transition links using `NEXT_PUBLIC_APP_URL`.

What works:

- Landing auth buttons route to the configured app URL.

Needs production migration:

- Full public marketing site.
- SEO metadata.
- Legal pages.
- Analytics.
- Production domain configuration.

Known UX/design issues:

- Site is not complete.
- Navbar links point to sections that may not all exist.

Suggested next improvements:

- Finish public site after the product demo flow is stable.

## 5. Data Layer Audit

| Repository/helper | Current responsibility | Persistence today | Firebase readiness | Cleanup before Firebase |
| --- | --- | --- | --- | --- |
| `authRepository.ts` / `mockAuth.ts` | Session, mock users, login/register/logout. | localStorage. | Has a useful boundary. | Replace passwords-in-localStorage with Firebase Auth; add profile lookup. |
| `courseRepository.ts` / `courseStorage.ts` | Courses and teacher-created courses. | Mock arrays plus localStorage. | Simple repository boundary exists. | Add membership/enrollment concepts and async APIs. |
| `noteRepository.ts` / `noteStorage.ts` | Notes, document blocks, publish state. | Mock arrays plus localStorage. | Good boundary for document migration. | Move domain types out of `mock`; decide document JSON schema versioning. |
| `taskRepository.ts` / `taskStorage.ts` | Tasks, document instructions, submissions, attachment metadata. | Mock arrays plus localStorage. | Good boundary but recently expanded. | Add status update functions, submission update/grading functions, and file metadata model. |
| `activityRepository.ts` / `activityStorage.ts` | Async activities and attempts. | Mock arrays plus localStorage. | Useful boundary. | Add update/close/publish functions and normalize question/answer schema. |
| `attendanceRepository.ts` / `attendanceStorage.ts` | Sessions, records, summaries, Excel export. | Mock arrays plus localStorage. | Strong domain boundary. | Split export concern later if server export is needed; connect roster to course members. |
| `progressRepository.ts` / `progress.ts` | Aggregates progress datasets and metrics. | Derived from other repositories. | Good place for future insights adapter. | Define stable formulas and include attendance only after product decision. |

Cross-cutting observations:

- Repositories are synchronous because localStorage and mock arrays are synchronous. Firebase/backend adapters will likely require async functions or React data fetching strategy changes.
- Several domain types still live under `apps/web/src/lib/mock`. Before production, move durable types into `packages/shared-types` or domain-specific app modules.
- Some repositories expose `getInitial...` functions for SSR-safe mock data and client hydration. This pattern is useful in the prototype but should be revisited once real data loads are async.
- Current identity for student submissions/attendance is partly mock/demo-account based. Real user IDs must replace emails/name matching.
- localStorage keys are stable enough for demos but not a migration source of truth.

## 6. Reusable Components Audit

Reusable systems that can continue to carry the product:

- `AppShell`, `AppSidebar`, `AppTopbar`, and `appNavigation`: core authenticated layout and role-aware navigation.
- Dashboard preview components: `DashboardCard`, `CoursePreviewCard`, `TaskPreviewItem`, `ActivityPreviewItem`.
- Auth components: `AuthSplitLayout`, `AuthInput`, `AuthRoleSelector`, `AuthDivider`, `SocialLoginButton`, `AuthCloseButton`.
- Course components: `CourseCard`, `CoursePreviewList`, `CreateCourseForm`, teacher/student detail/list wrappers.
- Document system: `AulifyDocumentEditor`, `AulifyDocumentViewer`, BlockNote theme/dictionary. This should become the reusable editor for notes, task instructions, course materials, and future educational documents.
- Notes components: `NoteForm`, `NoteDetail`, `NoteCard`, `NotesList`, teacher/student wrappers.
- Task components: `TaskForm`, `TaskDetail`, `TaskCard`, `TasksList`, submission form/list, teacher/student wrappers.
- Attendance components: `TeacherAttendanceOverview`, `AttendanceSessionForm`, `AttendanceStatusBadge`, `StudentAttendanceOverview`.
- Activity components: cards, lists, forms, answer form, detail, results.
- Progress components: summary cards, course progress cards, progress bars, recent/pending items.

Reusable patterns worth preserving:

- Repository-first data access instead of UI reading storage directly.
- Document editor/viewer pair for editable teacher pages and read-only student pages.
- Course-scoped feature pages for notes, tasks, activities, and attendance.
- Simple status badges and rounded cards with Aulify colors.
- Excel report generation pattern for future exports.

Reuse risks:

- Many feature components still hand-code similar Tailwind classes instead of using `packages/ui`.
- Domain-specific components may need extraction only after real product patterns settle.
- The document editor is stored under `components/notes` even though tasks now reuse it. Consider moving it to a generic `components/document` folder later.

## 7. Technical Debt and Risks

Concrete risks:

- localStorage does not support multi-device, multi-user, collaboration, backup, permissions, or secure storage.
- Mock auth is client-only and cannot protect data.
- No real authorization or security rules exist.
- No backend business endpoints exist beyond health checks.
- No real file storage, upload validation, download control, or PDF preview.
- Current user identity is still partly derived from mock/demo values.
- Route access is role-based but not membership-based.
- Some teacher actions are placeholders: publish/close task, edit/publish activity, some status transitions.
- BlockNote styling/localization likely needs more cross-browser QA.
- Domain types are spread across mock files instead of stable shared packages.
- Repositories are synchronous and will need an async migration plan.
- Progress metrics are simple approximations over local data.
- No production deploy, CI workflow, or preview environment is documented as operational.
- No Firestore security rules, Storage rules, or test coverage for rules.
- No upload limits or file validation policy is enforced beyond local PDF metadata labels.
- No integration/load tests exist.
- Public landing is incomplete.
- Root `pnpm build` will include all workspaces; some workspaces are scaffolds and should stay build-clean as services evolve.

## 8. Product Gaps

Missing important product capabilities:

- Real users, roles, profiles, and account settings.
- Real course enrollment and roster management.
- Teacher/student permissions by course.
- Real file upload/download and file preview.
- PDF preview inside app.
- Storage limits, upload validation, and file lifecycle rules.
- Grading/review workflow for submissions.
- Notifications or status flows for due dates, submissions, published content, and attendance changes.
- Live quiz room system with code/QR/lobby/ranking.
- Profile picture/avatar customization.
- Dark mode with animated theme transition.
- Settings page.
- Landing/public site completion.
- Responsive polish page by page.
- Production deploy, environment strategy, monitoring, and error reporting.

## 9. Future Live Quiz Feature Plan

Live quizzes should be treated as a future module, separate from the current asynchronous activities module. The async activity model can share question authoring and scoring concepts, but live sessions need their own real-time room state.

### Teacher Flow

1. Create live quiz from a course.
2. Add questions, options, optional images, and correct answers.
3. Configure time limit, points, randomization, reveal behavior, and ranking visibility.
4. Start live session.
5. Show room code and QR join link.
6. Monitor lobby as students join.
7. Present questions one at a time.
8. Lock answers after timer or teacher action.
9. Show live result distribution.
10. Show leaderboard/ranking if enabled.
11. End session.
12. Export results and save historical attempt records.

### Student Flow

1. Join with room code or QR.
2. Confirm nickname/profile/avatar.
3. Wait in lobby.
4. Answer each question within time limit.
5. See submitted/locked state.
6. See feedback when teacher reveals it.
7. See ranking if enabled.
8. Return to course after session.

### Basic Integrity

- Time limits per question.
- Randomized option order.
- One answer per player per question.
- Lock answer after submit.
- Track tab visibility or suspicious focus changes as a soft signal.
- Hide correct answer until teacher reveals.
- Temporary room code with expiration.
- Prevent duplicate same-session joins when possible.
- Rate-limit joins and answer writes.
- Store immutable final answers after lock.

### Technical Options

| Option | Strengths | Weaknesses |
| --- | --- | --- |
| Firebase Realtime Database for live sessions plus Firestore for history | Low operational overhead, fast presence/state updates, fits Firebase roadmap, simpler than running sockets early. | Needs careful rules and room-state modeling; querying historical data belongs in Firestore. |
| Firestore only | One database model, good persistence and queries. | Real-time high-frequency room state can become awkward and more expensive. Presence/lobby behavior is weaker. |
| Socket.IO service later | Full control, strong real-time semantics, easier custom game server behavior. | More infrastructure, deployment, scaling, auth handshake, and operational work. |

Recommendation:

Use Firebase Realtime Database for active live room state and Firestore for historical results in the first live-quiz version. This fits the current Firebase direction while avoiding a custom socket service too early. Revisit Socket.IO only if Aulify needs advanced real-time controls, high-scale tournament behavior, or custom server authority beyond Firebase rules.

## 10. Firebase Migration Roadmap

### Phase 1: Model Real Data

- Finalize core domain types for users, profiles, courses, course members, notes, tasks, submissions, attendance, activities, attempts, files, and settings.
- Move durable shared types out of `mock` files.
- Decide which reads are frontend direct reads and which go through backend services.
- Convert repository contracts toward async functions where needed.

### Phase 2: Firebase Auth + Users/Profiles

- Add Firebase Auth client setup.
- Add backend/admin setup only where server verification is needed.
- Create user profile records after registration.
- Map role, display name, avatar, and settings.
- Replace mock session guards with real auth state and route protection.

### Phase 3: Firestore Migration

- Migrate courses, notes, tasks, attendance, activities, submissions, and attempts into Firestore-backed repositories.
- Preserve UI behavior by swapping repository internals.
- Add query patterns by course, role, and current user.
- Add optimistic loading/error states where needed.

### Phase 4: Firebase Storage

- Implement file upload metadata and storage paths.
- Add upload validation before upload.
- Store file records in Firestore.
- Add download URLs through controlled access.
- Add PDF preview flow.

### Phase 5: Security Rules

- Write Firestore rules for course membership, teacher ownership, student reads, submissions, attendance, and activities.
- Write Storage rules for course files and submission files.
- Add rules tests.
- Add admin-only or service-only paths if needed.

### Phase 6: Deploy and QA

- Configure production/staging Firebase projects.
- Configure app domains:
  - `aulify.org`
  - `app.aulify.org`
  - `api.aulify.org`
- Deploy landing and web apps.
- Add error reporting and basic analytics.
- Run manual QA and route matrix.
- Add smoke tests for auth, course, note, task, attendance, activity, and progress flows.

## 11. Suggested Firestore Collections

Draft collection names:

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
- `liveQuizRooms`
- `liveQuizPlayers`
- `liveQuizAnswers`
- `files`
- `settings`

Early modeling notes:

- Prefer user IDs from Firebase Auth as stable identity keys.
- Store course membership separately from course records.
- Store notes/tasks/activities with `courseId`, `createdBy`, `status`, `createdAt`, `updatedAt`.
- Store submission/attempt records with `studentId`, not just email.
- Store file metadata in Firestore and binary objects in Storage.
- Keep live quiz active state separate from historical attempts/results.

## 12. Priority Roadmap: Next 6-8 Weeks

### Must-Have Before Real Demo

1. Stabilize core data contracts for auth, profiles, courses, memberships, notes, tasks, submissions, attendance, activities, and files.
2. Add Firebase Auth and profile creation.
3. Add real role/session handling and replace client-only mock guards.
4. Migrate courses and course members to Firestore.
5. Migrate notes and tasks to Firestore while preserving document blocks.
6. Add Firebase Storage plan and enforce file type/size rules before real uploads.
7. Add route-level loading/error states for real async data.
8. Finish critical public landing sections and legal placeholders.

### Should-Have for Differentiation

1. Attendance backed by Firestore with real roster records.
2. Professional attendance export from real data.
3. PDF preview inside the app.
4. Submission grading/feedback workflow.
5. Better progress metrics connected to real submissions, attempts, and attendance.
6. Profile page with avatar/profile picture.
7. Settings page with account preferences.

### Nice-to-Have Polish

1. Page-by-page responsive QA.
2. Better empty states and onboarding for new users.
3. Search/filter/sort for courses, notes, tasks, and activities.
4. Dark mode with polished theme transition.
5. More complete BlockNote theme/localization QA.
6. Loading skeletons and success/error toasts.
7. Export progress states and error handling.

### Future V2

1. Live quizzes with room code, QR, lobby, real-time answers, and rankings.
2. Advanced anti-cheat signals for live sessions.
3. Course analytics trends over time.
4. Rich file library per course.
5. Notifications and calendar integrations.
6. Backend microservices beyond health checks.
7. GraphQL dashboards/insights service.
8. Advanced admin/organization management.

## 13. Next Recommended Task

Next task: define and implement the real data contract layer for Firebase migration, starting with `users`, `profiles`, `courses`, and `courseMembers`, without changing the UI yet.

This should produce shared TypeScript types, repository interface shapes, Firestore path conventions, and a migration checklist for replacing the current mock/localStorage repositories module by module.
