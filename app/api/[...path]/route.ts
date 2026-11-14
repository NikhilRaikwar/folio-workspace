import { env } from 'cloudflare:workers';
import { createDatabase } from '@/lib/folio/database.mjs';
import { createService } from '@/lib/folio/service.mjs';
export const dynamic='force-dynamic';
async function handle(request:Request){
 const runtime=env as unknown as Record<string,string|undefined>;
 const url=runtime.TURSO_DATABASE_URL||process.env.TURSO_DATABASE_URL;
 const token=runtime.TURSO_AUTH_TOKEN||process.env.TURSO_AUTH_TOKEN;
 if(!url||!token)return Response.json({error:'Workspace database is not configured.'},{status:503,headers:{'Cache-Control':'no-store'}});
 return createService(createDatabase(url,token))(request);
}
export {handle as GET,handle as POST,handle as PATCH,handle as PUT,handle as DELETE};
