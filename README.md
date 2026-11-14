# Folio

**A little space. A big idea.**

A compact, task-first document workspace built by Nikhil Raikwar for the Ajaia AI-Native Full Stack Developer assessment. Create a draft, write with rich text, import your notes, and share intentional access with teammates.

## Quick start

Requires Node.js 22.13+ and npm. No paid dependency is required to review the hosted app. Local setup needs a Turso/libSQL database URL and database-scoped token, or you can run the isolated test suite without either.

```sh
npm ci
```

Copy `.env.example` to `.env`, then fill in your own database credentials:

```dotenv
TURSO_DATABASE_URL=YOUR_DATABASE_URL
TURSO_AUTH_TOKEN=YOUR_DATABASE_AUTH_TOKEN
```

```sh
npm run db:setup
npm run dev
```

Open the **Local URL printed by the dev server** (normally http://127.0.0.1:5173). `db:setup` explicitly creates the schema and seeds the three demo accounts once. It is safe to rerun and does not resurrect deleted starter documents. Database credentials are server-only; do not prefix them with `VITE_` or `NEXT_PUBLIC_`, put them in source control, or include them in a submission ZIP.

## Demo accounts and review flow

No passwords. Use the account menu at the top right of the workspace.

| Account | Demo email | Initial access |
|---|---|---|
| Nikhil Raikwar | nikhil@folio.demo | Owns two documents; can edit Maya's launch notes |
| Maya Iyer | maya@folio.demo | Owns launch notes |
| Aarav Shah | aarav@folio.demo | Empty workspace until a teammate shares a document |

**These identities are simulated authentication**, not a secure login system. Anyone who can access the app can switch accounts. Use synthetic content only. The assignment explicitly permits seeded/mocked users; server authorization still checks ownership and sharing on every document operation.

1. As Nikhil, create a document, rename it, and try bold, italic, underline, headings, bullets, and numbered lists.
2. Wait for **All changes saved**, refresh, and reopen. An open document's URL fragment also retains its selection on refresh in the same browser.
3. Import `samples/team-notes.md` or `samples/plain-notes.txt`.
4. Share a document with Maya as **Can view**. Return to the workspace, switch to Maya, and open **Shared with me**. The title and editor are read-only.
5. Switch back to Nikhil, change Maya to **Can edit**, then reopen as Maya and save an edit.
6. As Nikhil, revoke Maya's access. Subsequent reads and saves are denied.
7. Open the same document in two tabs and save from one. Saving an older revision from the other shows a conflict instead of overwriting the newer draft. Download a local JSON backup before loading the latest version.

## Supported editing and import

- Rich text: paragraphs, three heading levels, bold, italic, underline, strike, lists, quotes, code, and horizontal rules. The visible toolbar focuses on the required formatting.
- Blank titles default to **Untitled document**. Duplicate invitations return a clear error; existing permissions can be changed separately.
- Autosave begins after 800 ms of inactivity. Saves are serialized, with explicit saved, saving, unsaved, and error states. Ctrl/Cmd+S triggers save.
- Imports: non-empty UTF-8 `.txt` and `.md`, maximum **200 KB**. Each import becomes a new document owned by the importing user.
- Markdown headings, emphasis, quotes, and lists are supported. Embedded HTML, images, links as clickable objects, and tables are intentionally excluded. Link label text can be retained without a clickable link.
- Editor content is stored as validated ProseMirror/Tiptap JSON, maximum **500 KB**. Unsupported nodes/marks and invalid nesting are rejected server-side.
- Markdown export preserves the supported Markdown subset. Underline/strike may lose styling in this export. The JSON backup preserves structured content and is available through Document options and save-error recovery. A backup-import/restore UI is not included.

## Commands

```sh
npm test                 # Isolated Request/Response + real SQLite integration tests
npm run typecheck        # TypeScript checks
npm run build            # Vinext/Cloudflare Worker production build
npm start                # Preview the production Worker locally
npm run db:setup         # Explicit initial remote schema/seed setup
```

The tests use Node's built-in experimental SQLite module; Node 22 prints an informational experimental warning. Tests use independent local test databases, not production credentials or the remote workspace.

For Sites packaging, use the documented Sites build helper and publication workflow. A raw local `npm start` is a preview, not a hosted deployment. Hosted runtime credentials must be configured separately from `.env` through Sites settings. The `.openai/hosting.json` file identifies the Site; `scripts/vite/sites-vite-plugin.ts` packages the Worker build.

## Architecture and boundaries

React/TypeScript on Vinext provides the interface and API route shell. Tiptap handles rich text and editing history. Framework-independent service code uses web `Request`/`Response`; a small SQL-over-HTTPS adapter talks to Turso from the Worker. SQL is parameterized. Table setup is explicit and separate from ordinary requests.

Owned and shared documents have visible labels. Owners manage access and deletion; editors write; viewers only read. Atomic revision checks prevent silent stale writes. This is **not realtime collaboration or automatic merge**. Changes made elsewhere appear after reopening/reloading. Access changes are enforced on the next API request.

No real signup, email invitations, realtime presence/merge, comments, version history, DOCX parsing, or PDF export. Those are deliberate timebox cuts. Autosave is not an offline queue: an abrupt tab/process termination can lose unsaved work. The app warns on browser unload and offers backup/recovery when a save fails. Remaining production hardening includes real sessions, rate limits, audit history, and stronger multi-user recovery.

With another 2–4 hours: add real authentication, browser end-to-end regression tests, and revision recovery/history before considering realtime collaboration.

## Submission

Candidate: **Nikhil Raikwar** · raikwarnikhil80@gmail.com

- Source repository: https://github.com/NikhilRaikwar/folio-workspace
- Live deployment: https://folio.nikhilraikwar.me (public; no platform login required).
- Walkthrough: https://youtu.be/EOffB_BzrxY
- Architecture: `ARCHITECTURE.md`
- AI workflow: `AI_WORKFLOW.md`
- Exact deliverables/status: `SUBMISSION.md`

MIT License. Copyright (c) 2026 Nikhil Raikwar.

## Verification

Ten isolated service/SQLite tests, TypeScript checking, and the production Worker build pass. Core browser flows were checked locally: typing, required formatting, autosave, refresh persistence, demo account switching, view-only controls, file import, and export download. Public no-cookie API checks passed create/edit/persist/import and permission enforcement on the deployed app. Exhaustive mobile/cross-browser and offline testing are not claimed.

## Source layout

- `app/`: interface and API route shell.
- `lib/folio/`: content validation, database adapter, schema, seeds, and API service.
- `worker/`: Cloudflare Worker entrypoint.
- `scripts/`: database setup and required build/runtime integration only.
- `tests/`: isolated integration tests.
- `samples/`: text and Markdown examples for reviewers.
- `public/`: favicon.
- `.openai/`: Sites deployment identity.

## Screenshots

Candidate-provided screenshots of the working application:

- [Dashboard: owned and shared documents](screenshots/01-dashboard.png)
- [Editor: headings, formatting, and lists](screenshots/02-editor.png)
- [Sharing: teammate access and permissions](screenshots/03-sharing.png)
- [Viewer: read-only document access](screenshots/04-viewer.png)

Walkthrough preparation notes and generated screenshots are kept outside the repository. No source ZIP is tracked in GitHub.
