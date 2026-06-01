# Aulify

Aulify is a TypeScript monorepo for an educational platform.

The platform is organized as independent apps, microservices, and shared packages. Aulify 1.0 focuses on courses, notes, tasks, asynchronous activities, insights, and auth.

## Workspace

- `apps/landing`: public landing page for `aulify.org`
- `apps/web`: authenticated app for `app.aulify.org`
- `apps/api-gateway`: API gateway for `api.aulify.org`
- `services/*`: independent backend services
- `packages/*`: shared UI, configuration, validation, types, and client utilities
- `docs`: product and technical planning
- `assets`: brand, illustration, and icon assets
- `tests`: integration and load test roots

## Scripts

- `pnpm dev`: run available development scripts across workspaces
- `pnpm build`: build available workspaces
- `pnpm lint`: run available lint scripts
- `pnpm typecheck`: run available type checks
- `pnpm test`: run available tests
- `pnpm format`: run available formatting scripts

## Getting Started

Install dependencies after package manifests are added to apps, services, and packages:

```bash
pnpm install
```

Then start development:

```bash
pnpm dev
```

This repository currently contains only the initial monorepo structure and planning documents. Product pages, backend business endpoints, Firebase wiring, and feature implementation are intentionally not included yet.
