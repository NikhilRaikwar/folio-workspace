# Folio walkthrough — 3–5 minutes

Record your own screen and voice. Use the final deployed app after testing it. Explain decisions you understand and only claim checks you actually performed.

## 0:00–0:25 — Introduce the product

“I’m Nikhil Raikwar. This is Folio, a focused workspace for creating, editing, and sharing documents. I scoped it around a dependable document lifecycle rather than trying to recreate all of Google Docs.”

Show the workspace, document previews, owned/shared distinction, and clearly labeled demo account switcher. Explain that authentication is simulated.

## 0:25–1:25 — Create, edit, persist

Create a document named “Team planning notes.” Add a heading, paragraph, bold, italic, underline, bullets, and numbered list. Point out saved/saving feedback. Refresh after “All changes saved” and reopen. Mention that rich text is stored as validated structured JSON.

## 1:25–2:00 — Import

Import `samples/team-notes.md`. Show headings/lists preserved. State UTF-8 .txt/.md support and the 200 KB cap. Import creates a new draft instead of overwriting an existing one. Unsupported embedded HTML/media is omitted.

## 2:00–3:10 — Share intentionally

As Nikhil, grant Maya viewer access. Return to the workspace and switch to Maya. Open Shared with me and show the read-only editor/title. Switch back to Nikhil, change Maya to editor, reopen as Maya and save an edit. Explain that the server enforces permissions. If time permits, revoke access and demonstrate denial after reopening.

## 3:10–3:45 — Architecture and reliability

“React and Tiptap provide editing. The API runs on a Cloudflare Worker through Sites, and my Turso database persists documents and sharing. Server validation rejects unsupported document structures. Atomic revision checks reject stale writes, and a local backup can preserve a draft during recovery. This is not realtime merging.”

If relevant, briefly show actual test output. Never show `.env`, tokens, settings containing credentials, or unrelated private windows.

## 3:45–4:30 — AI and tradeoffs

Explain how you used Codex for implementation, tests, and documentation. Describe one actual decision/change: separate database ownership, structured content validation, fresh UI, or a TypeScript issue you investigated. Do not claim personal code review or browser testing you have not performed.

State real auth, realtime merging, comments, and history were intentionally omitted. Next priorities: real sessions, browser regression coverage, and revision recovery.

Upload as an accessible unlisted/public video. Test the link in incognito, update `WALKTHROUGH_URL.txt` and `SUBMISSION.md`, and paste the same URL into the assessment's separate required video field.
