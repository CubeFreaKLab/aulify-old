# Data Model

This is the initial domain outline for Aulify 1.0. Storage schemas are not finalized.

## Core Entities

- User
- Course
- Enrollment
- Note
- Task
- Activity
- Activity response
- Insight summary

## Service Ownership

- `users-service`: users, auth-related profile data, and access context
- `courses-service`: courses and enrollments
- `notes-service`: notes attached to courses or users
- `tasks-service`: tasks and completion state
- `activities-service`: asynchronous activities and responses
- `insights-service`: dashboard and learning insight summaries

Firebase Auth and Firestore are planned later. Backend services should own access to Firebase-backed data.
