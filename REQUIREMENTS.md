# Assessment acceptance map

Candidate: Nikhil Raikwar · Product: Folio

| Requirement | Implementation and evidence |
|---|---|
| Create and rename | API integration tests; browser-created and renamed draft verified |
| Browser rich-text editing | Tiptap paragraphs, bold, italic, underline, headings, bulleted/numbered lists; browser marks confirmed in database |
| Save and reopen | Debounced serialized saves, explicit statuses, refresh/reopen browser check, database-file restart test |
| Product-relevant upload | Native file picker imported sample Markdown into a new editable document; text import also covered by service tests |
| Supported file types stated | UI and README: UTF-8 `.txt` / `.md`, 200 KB maximum; DOCX intentionally excluded |
| Owner and access grants | Owner-only Share control and server-checked invite/change/revoke operations |
| Owned vs shared | Dashboard labels/filters and editor Can edit / Can view labels; visible demo account switcher |
| View-only enforcement | Read-only title/editor, disabled toolbar verified in browser; server rejects viewer save with 403 |
| Unshared access | Server returns 403; friendly access-denied view rather than crash |
| Real persistence | Candidate-owned remote Turso database; Worker-to-database smoke check passed |
| Validation/errors | Invalid/oversized/empty imports, structured content, invalid share target, self-sharing, duplicate invites; default blank titles |
| Meaningful automated tests | Ten isolated production-service + SQLite integration tests pass |
| Setup/run instructions | README, .env.example, explicit db:setup, package lockfile |
| Architecture note | ARCHITECTURE.md |
| AI workflow note | AI_WORKFLOW.md records actual contributions, rejected UI direction, corrections, and verification |
| Working reviewer deployment | Pending permission for required source commit/push and public reviewer access; local app works |
| Walkthrough video | Script ready; candidate's 3–5 minute recording/upload pending |
| Drive folder | Source ZIP and notes ready locally; candidate's upload/sharing pending |

## Optional enhancements included

The brief asks for **one small enhancement if time permits**, not every optional feature. Folio includes:

1. **Role-based sharing:** owner, editor, viewer, and revocation. Demonstrate the same document as Maya with Can view, then Can edit. The server enforces the distinction.
2. **Markdown export:** use Export in the editor. Browser download was verified, and a test checks Markdown serialization. Underline does not have a standard Markdown equivalent and is exported as plain text; structured JSON backup retains the full supported editor representation.

Stale-write protection, a document outline, and word count add bounded reliability/usability. Realtime collaboration, comments, suggestion mode, and version history were intentionally not added. Do not present them as completed features.

## Final submission is complete only after

- The actual live URL is published and tested for reviewer access.
- The candidate records/uploads a public or unlisted video and replaces its placeholder.
- The final source package and notes are uploaded to one accessible Google Drive folder.
- SUBMISSION.md and portal links reference those real deliverables.
