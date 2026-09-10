# VINRelease Technical Specification

The complete technical specification is `../../VINRelease_Product_Specification.md`. This build implements its locked P0 using:

- Next.js App Router, React, TypeScript, and Tailwind CSS.
- Zod for domain and CALL-E result validation.
- A server-only CALL-E adapter using `@call-e/calle` and `CALLE_API_KEY`.
- A deterministic in-process demo repository seeded with case 4821; the repository boundary allows a PostgreSQL adapter after the hackathon.
- Route handlers for case retrieval, reset, call preview, authorization, task polling, and webhook ingestion.
- Vitest for domain, safety, provider, and route-level workflow tests.

## Trust boundary

The server regenerates call contracts, checks the contact allowlist, enforces disclosure fields, validates the provider result, persists the call before reporting it started, and applies state transitions atomically through the repository interface. The browser never receives provider credentials.

## Environments

- `VINRELEASE_MODE=demo`: deterministic fixtures only; outbound provider code is unreachable.
- `VINRELEASE_MODE=live`: requires `CALLE_API_KEY`, a confirmed request, and an approved E.164 contact.

Exact product behavior, schemas, screen requirements, and test cases remain defined by `VINRelease_Product_Specification.md` sections 8 through 22.
