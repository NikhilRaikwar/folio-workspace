# Folio deployment

## Current target

Sites hosts a Cloudflare Worker built from the included Vinext starter. Turso stores documents and sharing independently of the Worker instance. The `.openai/hosting.json` identity belongs to this Folio project only. Do not replace it with an unrelated Site identity. D1/R2 bindings are unused because this implementation uses the candidate-owned remote database.

## Before publishing

1. Install with `npm ci` on Node 22.13+.
2. Set server-only `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in local `.env`.
3. Run `npm run db:setup` to create/seed the empty database once.
4. Run `npm test`, `npm run typecheck`, and the Sites build helper (or `npm run build` for a standalone build).
5. Configure the same two values through Sites production runtime environment settings. Local `.env` is not a production-secret deployment mechanism. Never put either value in a public prefix, source file, or hosting manifest.
6. Follow the Sites source synchronization, packaging, save-version, and deployment workflow. That workflow **creates/pushes a source commit**. The candidate authorized source synchronization and public publication; the initial deployment is complete.

GitHub and Sites source hosting are distinct destinations. GitHub URL: https://github.com/NikhilRaikwar/folio-workspace. Both the Sites source and GitHub main branch have been pushed under the candidate's explicit authorization. The packaged source is also reviewable independently.

## Reviewer access

New Sites are private by default. A private preview is not a reviewer-accessible final submission. Before submission, the candidate must authorize/configure the intended reviewer audience and verify the final URL in an incognito session. A login gate that reviewers cannot pass must be resolved explicitly; do not change permissions silently merely to make deployment succeed.

The app itself offers demo identities with no password. A public demo lets visitors switch accounts and modify sample documents. Keep credentials secret and use synthetic content only.

## Hosted acceptance checklist

- Page and API are reachable from the final URL.
- Three demo users appear.
- Create, rename, format, save, refresh, reopen.
- Import the provided Markdown/text examples.
- Share as viewer, then editor, and verify each role.
- Revoke access and confirm subsequent reads/writes are denied.
- Confirm data persists from another browser/session.
- Confirm the runtime does not expose credentials in responses or client assets.
- Record the actual live URL in `LIVE_URL.txt`, `SUBMISSION.md`, and the portal.

## Troubleshooting

- **Database is not configured:** add both production runtime secrets and redeploy the saved source version.
- **Workspace connection error:** check database availability/token permissions and production logs; never paste tokens into public debugging messages.
- **Tables missing:** run the explicit setup script against the intended database. Do not add DDL to each request as a workaround.
- **Stale revision:** download the local draft and load the current version. This is intentional concurrency protection.
- **Publishing from a new checkout:** preserve the correct Site identity, use fresh source credentials, push the exact source state, and package that same state before saving/deploying.

## Published application

https://folio-team-writing-room.festivecinch16.chatgpt.site

Public access and an anonymous end-to-end API smoke check passed. Runtime database URL and token are configured as secrets. The reviewer can use the app without a platform login; demo identities remain simulated and writable as documented.
