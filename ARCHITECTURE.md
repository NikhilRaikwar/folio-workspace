# Folio — architecture and prioritization

## Product slice

Folio covers the complete life of a small shared document: create → write → persist → import → share → reopen with another identity. A document-preview workspace emphasizes discovery and ownership. The writing room reduces visual noise, provides a compact formatting toolbar, an outline, word count, explicit autosave feedback, and an access dialog. Mobile layouts collapse the workspace navigation and writing layout.

## Stack and boundaries

1. **Interface:** React + TypeScript on the Sites-supported Vinext starter. The heavier Tiptap editor is dynamically loaded when a document opens. Workspace users and document lists fetch in parallel. Search, sort, grid/list views, and empty/error states operate on accessible documents only.
2. **HTTP boundary:** `app/api/[...path]/route.ts` injects server credentials and delegates to the framework-independent `lib/folio/service.mjs`. The service uses standard Request/Response objects so tests exercise the same authorization/validation handlers.
3. **Database:** `lib/folio/database.mjs` uses parameterized SQL over Turso's HTTPS pipeline protocol. It uses only fetch, with a timeout and safe generic transport errors, so no native SQLite runtime dependency is needed in the Worker. Credentials remain in local `.env` or hosted runtime secrets.
4. **Provisioning:** `lib/folio/schema.sql` defines the initial schema. `npm run db:setup` explicitly applies idempotent statements and seeds once. Request handlers never run DDL. This first-version bootstrap is intentionally small; future schema evolution should append numbered migrations with an applied-migration ledger rather than editing a deployed schema in place.

## Data model

- `folio_users`: fixed demo identities, display information, and unique email.
- `folio_documents`: owner, title, structured content JSON, plain-text excerpt, revision, and timestamps.
- `folio_access`: document/user composite primary key and constrained editor/viewer role.
- `folio_setup`: records the seed version so re-running setup does not restore deleted documents.

Indexes support owner and shared-user lookups. Seed initialization is idempotent but not a general multi-migration transaction runner. The owner relationship is independent of shared grants; a user cannot grant themselves ownership through the sharing API.

## Identity and access

The assignment permits mocked users. A clearly labeled demo account switcher sends `x-folio-user`; the server verifies that the chosen account exists. This does not prove the visitor's identity: any visitor can impersonate seeded users. Server permission checks demonstrate application access logic within that explicitly documented limitation. Use synthetic data only.

Every read/write/share/delete resolves an owner or grant. Unshared users receive 403 with an access-denied message. Missing documents receive 404. Viewers cannot rename or write; editors cannot share/delete; owners can grant, change, revoke, and delete. Hiding controls is a convenience, not enforcement. Revoked access takes effect on subsequent API calls; open editors are not pushed an access-change event.

## Rich text and file safety

Persisting a small validated ProseMirror schema preserves formatting without arbitrary executable HTML. Validation limits nodes, nesting, byte size, heading levels, marks, and child relationships, and drops unsupported attributes. Plain-text imports are literal text nodes. Markdown tokens become the supported JSON subset; HTML and embedded media are omitted. Import creates a new document rather than silently replacing an existing draft.

## Save semantics

An 800 ms debounce reduces writes. In-flight saves serialize and snapshot a local edit sequence. A save response only clears the dirty flag if no newer edit exists; newer text receives a subsequent save using the returned revision. `UPDATE ... WHERE revision=?` is the atomic concurrency guard. Stale writes return 409 instead of last-write-wins data loss.

Conflict/access failures stop automatic writes and preserve the in-memory draft. The user can download a JSON backup and explicitly reload or leave. Normal workspace navigation flushes a pending save, and browser unload warns if dirty. Network errors remain visible and require retry; there is no durable offline queue, automatic merge, version history, or guaranteed crash recovery.

## Prioritization

Depth in persistence, permissions, safe imports, and save reliability mattered more than partial realtime collaboration or an AI writing feature unrelated to the brief. Viewer/editor roles are the one small permission enhancement. Markdown export and backup are bounded conveniences. Real authentication, history/recovery, and browser regression coverage are the highest-value next steps.

## Validation

Ten isolated integration tests exercise real SQLite plus the production service handlers. TypeScript and Worker production builds are separate checks. A smoke test through the local Worker and actual Turso database checks the deployed-runtime code path. `VERIFICATION.md` separates these passing checks from visual/browser and hosted checks that have not been completed.
