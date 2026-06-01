# Deployment

Aulify is planned as independently deployable apps and microservices.

## Public Domains

- `aulify.org`: landing app
- `app.aulify.org`: authenticated web app
- `api.aulify.org`: API gateway

## Deployment Shape

- Frontend apps are deployed independently.
- The API gateway is deployed independently.
- Each backend service is deployed independently.
- Shared packages are versioned through the monorepo workspace.

Firebase Auth and Firestore are planned infrastructure dependencies, but they are not connected yet.
