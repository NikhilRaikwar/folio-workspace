# Nikhil's final submission steps

The app is deployed, GitHub source is pushed, and the public end-to-end API checks pass.

- Live app: https://folio-team-writing-room.festivecinch16.chatgpt.site
- GitHub: https://github.com/NikhilRaikwar/folio-workspace
- Demo accounts: Nikhil Raikwar, Maya Iyer, Aarav Shah. No passwords.

## 1. Record your walkthrough

Use WALKTHROUGH_SCRIPT.md and the deployed app. Record 3–5 minutes in your own voice: create/format/save/refresh, Markdown import, viewer/editor sharing, architecture, scope cuts, and honest AI usage. Demonstrate Markdown export and roles as the optional enhancements if time permits.

Upload the video with public or unlisted access. Test its link in incognito. Paste it into WALKTHROUGH_URL.txt and SUBMISSION.md, then into the portal's separate required video field.

## 2. Upload one Google Drive folder

Upload this submission package: source-code.zip, README.md, ARCHITECTURE.md, AI_WORKFLOW.md, SUBMISSION.md, DEPLOYMENT.md, VERIFICATION.md, REQUIREMENTS.md, LICENSE, LIVE_URL.txt, WALKTHROUGH_URL.txt, WALKTHROUGH_SCRIPT.md, START_HERE.md, and screenshots/.

Never upload the real .env, database token, node_modules, runtime state, or unrelated archived projects. The source ZIP was checked for excluded paths and actual database-credential values.

Set the folder to Anyone with the link — Viewer. Add its URL to SUBMISSION.md and verify the folder from an incognito session.

## 3. Paste this in the portal

Replace the two remaining placeholders with real links:

```markdown
# Folio — Collaborative Document Workspace
Candidate: Nikhil Raikwar

- Submission folder: [Google Drive](DRIVE_FOLDER_URL)
- Live app: [Open Folio](https://folio-team-writing-room.festivecinch16.chatgpt.site)
- Walkthrough: [Watch demo](VIDEO_URL)
- Source: [GitHub](https://github.com/NikhilRaikwar/folio-workspace)

## Reviewer access
No password. Use the demo account menu to switch between Nikhil Raikwar,
Maya Iyer, and Aarav Shah. Authentication is simulated for this assessment.

## Suggested review
As Nikhil, create, rename, format, save, refresh, and reopen a document.
Import a .txt or .md file (200 KB maximum). Share with Maya as viewer,
switch accounts, and open Shared with me. Change Maya to editor as Nikhil
and verify editing. Only owners can share, revoke, and delete.

## Included and verified
Source, setup instructions, architecture note, AI workflow note,
ten passing automated tests, type-check, production build, screenshots,
and public deployment verification are included.

## Optional enhancements
Owner/editor/viewer sharing roles and Markdown export are implemented.
Stale-write protection prevents silent overwrites of newer revisions.

## Deliberate limitations and next steps
Real authentication, realtime merging, comments, revision history,
and DOCX support are intentionally omitted. Next priorities:
real sessions, browser regression tests, and revision recovery.
```

Do not submit placeholder video/Drive links. Personally review the app and notes so your walkthrough explains decisions you understand. Do not claim every line was manually authored or every possible browser scenario was tested.
