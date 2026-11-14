CREATE TABLE IF NOT EXISTS folio_users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, initials TEXT NOT NULL, color TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS folio_documents (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES folio_users(id), title TEXT NOT NULL, content TEXT NOT NULL, excerpt TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS folio_access (document_id TEXT NOT NULL REFERENCES folio_documents(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES folio_users(id), role TEXT NOT NULL CHECK(role IN ('editor','viewer')), PRIMARY KEY(document_id,user_id));
CREATE INDEX IF NOT EXISTS folio_access_user_idx ON folio_access(user_id);
CREATE INDEX IF NOT EXISTS folio_documents_owner_idx ON folio_documents(owner_id,updated_at);
CREATE TABLE IF NOT EXISTS folio_setup (key TEXT PRIMARY KEY, value TEXT NOT NULL);
