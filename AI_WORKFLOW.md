# AI workflow — Folio

Candidate: Nikhil Raikwar

## Tools and contribution

OpenAI Codex in the desktop app assisted with scope translation, React/TypeScript components, Tiptap integration, the SQL-backed service, test cases, local command execution, and submission documentation. The product, database ownership, repository, license, UI differentiation, and restrictions on committing/publishing were directed in conversation.

AI accelerated repetitive editor-toolbar wiring, access-control routes, structured import conversion, test setup, and documentation. The final scope favors core document flows and reliability over extra features.

## Changes and rejected directions

- The candidate required a fresh project and separately owned database; unrelated prior project files were isolated and excluded from the source and submission.
- The implementation uses a verified external Turso database and server-only environment values instead of a browser-local persistence shortcut.
- An initial API helper failed TypeScript's generic return check. Its signature and response handling were corrected and the type-check rerun.
- The visual first pass used small, low-contrast functional labels. Functional text sizes and contrast were strengthened rather than accepting the first styling output unchanged.
- Content validation was tightened to an explicit node/mark schema and own-property checks. Backend permission and stale-write cases were tested rather than treating disabled UI controls as proof of correctness.
- An initial browser attempt stopped because the tool could not confidently determine the active URL. A later session verified the Folio URL and completed the core desktop browser checks recorded in VERIFICATION.md; the initial failure was not presented as a successful check.

## Verification and judgment

Ten tests run the same service handlers against real isolated SQLite databases: formatting persistence, access restrictions, role changes/revocation, stale revisions, imports, structure/input validation, restart persistence, and export. TypeScript and the production Worker build are checked separately. A local Worker-to-Turso smoke test verifies actual API integration without printing credentials and removes only its own temporary test document.

`VERIFICATION.md` records actual evidence and remaining checks. The candidate should personally review the UI and code, verify the public deployed app, and explain their own decisions in the required walkthrough. No claim is made that the candidate personally authored every line or that AI output is correct merely because it compiles.

## Final scope review

The candidate rejected the large promotional dashboard hero and sidebar marketing cards. They were removed in favor of a compact document-first workspace. The candidate also requested owner-only sharing controls, explicit editor/viewer labels, 403 for unshared access, default blank titles, and duplicate-invitation errors. Those changes were implemented and covered by the updated ten-test suite.
