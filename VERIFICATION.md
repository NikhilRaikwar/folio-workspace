# Folio verification record

Date: 14 November 2026. Environment: Windows, Node.js 22.22.0.

## Passing checks

- **10 automated tests passed, 0 failed** using production Request/Response service handlers and real isolated SQLite databases. Tests do not use the candidate's remote database.
- **TypeScript check passed** after correcting the API helper's generic return signature.
- **Production Worker build passed**, including the client, server, RSC, and SSR compilation stages. Vinext prints a route-classification advisory for the client-driven home page; this is not a build failure.
- **Candidate-owned database connection verified** with read-only `SELECT 1`, without printing credentials.
- **Schema and seed setup completed** on the new Folio Turso database.
- **Local runtime smoke check:** home page returns 200; `/api/users` returns three demo accounts; Nikhil's `/api/documents` returns the expected three accessible seeded documents.
- **Local Worker + real Turso end-to-end API smoke test passed:** create, rename, save required marks, reopen, stale-write rejection, grant viewer, reject viewer writes, upgrade editor, save as editor, revoke, deny access. Only the smoke-test-created document was removed afterward.

## Browser checks completed

After the initial URL-detection blocker, a later browser session successfully verified the actual Folio localhost URL. Checks completed in Chrome:

- Compact document-first dashboard and visible account switcher.
- Opened owner and shared-editor documents; shared editor shows Can edit and has no Share button.
- Created a temporary document, renamed it, typed text, applied bold/italic/underline, and observed autosave.
- Read the same draft through the local Worker API and confirmed all three marks persisted in Turso.
- Refreshed the browser and confirmed saved title/content reopened.
- Switched to Maya, opened the shared test draft, and confirmed the title is read-only, formatting controls are disabled, Can view is visible, and Share is absent.
- Used the native file picker to import samples/team-notes.md. The editor displayed the imported heading, emphasis, bullet list and numbered list.
- Triggered Markdown export and observed Chrome report a completed new download.
- Inspected full-width desktop and narrow desktop/tablet window layouts.
- Captured app-only workspace, editor, viewer, and import screenshots in screenshots/. Browser tabs/toolbars were cropped out.

The temporary browser verification draft and its share were removed. The sample import remains as a harmless demonstration document under Maya's account. Mobile-phone widths, comprehensive keyboard focus testing, network interruption UX, and hosted/cross-browser behavior still need review; those checks are not claimed.

## Remaining delivery checks

Hosted publication and an incognito reviewer-access test remain pending because the candidate previously prohibited commits/pushes. Sites requires source synchronization. GitHub has not been pushed. The final video and Drive folder are also pending human completion.

## Environmental issues resolved

The sandbox could not resolve npm hosts or use local Worker sockets. Dependency installation, database setup, and local preview were rerun with the required network permission. The dependency lockfile was updated before the locked install. Neither the network failures nor the earlier TypeScript failure are counted as successful checks.

## Final acceptance changes

Ten tests now pass, including explicit 403 for unshared document requests, viewer write denial, blank-title defaulting, and duplicate invitation/self-share/unknown-user validation. TypeScript passed after the compact dashboard and owner-only Share button changes. Final production build and hosted/browser checks are recorded separately; no browser verification is inferred from unit tests.

Production Sites runtime variables TURSO_DATABASE_URL and TURSO_AUTH_TOKEN have been configured as secrets. Their presence is not a hosted-deployment verification; source publication is still pending.
