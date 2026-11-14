import { readFile } from 'node:fs/promises';
import { createDatabase } from '../lib/folio/database.mjs';
import { seedDatabase } from '../lib/folio/seed.mjs';
try {
 const db=createDatabase(process.env.TURSO_DATABASE_URL,process.env.TURSO_AUTH_TOKEN);
 const sql=await readFile(new URL('../lib/folio/schema.sql',import.meta.url),'utf8');
 for(const statement of sql.split(';').map(s=>s.trim()).filter(Boolean))await db.execute(statement);
 await seedDatabase(db);
 console.log('Folio schema and demo data ready. Credentials were not printed.');
} catch { console.error('Database setup failed. Check the server environment and database connectivity.');process.exitCode=1; }
