# Product Blueprint

Aulify is an educational platform, not a game-first product.

## Aulify 1.0 Includes

- Auth
- Courses
- Notes
- Tasks
- Asynchronous activities
- Insights

## Aulify 1.0 Excludes

- Live classes
- Video calls
- Room-code live sessions
- Socket.IO
- Real-time rankings

## Activities

Activities are asynchronous assignments attached to courses. Initial activity types are:

- Quizzes
- Quick questions
- True/false items
- Surveys

## Architecture Direction

Aulify uses a TypeScript monorepo with independent apps and microservices. The backend is split by service ownership instead of being a monolith.

REST is used for actions. GraphQL is used for dashboards and insights.

Firebase Auth and Firestore are planned for later. Frontend apps should access Firebase-backed data through the backend, not directly.
