# Nikhil's remaining submission steps

1. Inspect the local Folio preview and run the README review flow. Core desktop browser flows have been verified; personally review them and report any UI issue before publication.
2. Decide when to lift the earlier no-commit/no-push restriction. Sites requires a source commit/push before publishing; GitHub publication is a separate action.
3. Configure the intended reviewer audience. Sites starts private; a private owner-only link is not a completed reviewer-accessible deliverable. Verify the final public/reviewer URL in incognito after publishing.
4. Confirm the actual hosted create/edit/import/share/persistence flows. Update `VERIFICATION.md`, `LIVE_URL.txt`, and `SUBMISSION.md` with real results/links.
5. Record a 3–5 minute screen/voice walkthrough using `WALKTHROUGH_SCRIPT.md`. Add its accessible URL to `WALKTHROUGH_URL.txt` and `SUBMISSION.md`.
6. Put the source ZIP and notes in one Google Drive folder. Add screenshots of this Folio app if useful. Never include `.env`, secrets, node_modules, unrelated archived projects, or local runtime state.
7. Set the folder to Anyone with the link — Viewer, check it in incognito, and put its URL in the final submission. Review the AI workflow note and explain your actual decisions honestly.

## Portal Markdown template

Replace every placeholder only after that deliverable exists:

```markdown
# Folio — Collaborative Document Workspace
Candidate: Nikhil Raikwar

- Submission folder: [Google Drive](DRIVE_FOLDER_URL)
- Live application: [Open Folio](LIVE_APPLICATION_URL)
- Walkthrough: [Watch the demo](VIDEO_URL)
- Source: [GitHub](https://github.com/NikhilRaikwar/folio-workspace)

## Reviewer access
No password. Use the labeled demo account switcher for Nikhil Raikwar,
Maya Iyer, and Aarav Shah. Authentication is simulated for this assessment.

## Suggested review
Create and format a document as Nikhil. Wait for “All changes saved,”
refresh, and reopen. Import a .txt or .md file (200 KB maximum).
Share with Maya as viewer, switch accounts, and open Shared with me.
Change Maya to editor as Nikhil, then verify editing and access revocation.

## Included
Source code, local setup, architecture note, AI workflow note,
ten passing automated tests, verification record, and video URL.

## Scope and limits
Creation, rename, rich-text editing, autosave, structured persistence,
import, owner/editor/viewer sharing, and stale-write protection are included.
Real authentication, realtime merge, comments, history, and DOCX support
were intentionally omitted. Next: real sessions, browser regression tests,
and revision recovery.
```

Paste the video URL separately into the portal's required Video Submission Link field. Do not describe pending checks as completed or submit placeholder URLs.
