import { assert, Problem, validTitle, validContent, emptyDocument, importDocument, plainText } from './content.mjs';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function createService(db) {
 async function access(id,uid,permission='read') {
  const {rows}=await db.execute('SELECT d.*,a.role AS shared_role,u.name AS owner_name,u.email AS owner_email,u.initials AS owner_initials,u.color AS owner_color FROM folio_documents d JOIN folio_users u ON u.id=d.owner_id LEFT JOIN folio_access a ON a.document_id=d.id AND a.user_id=? WHERE d.id=?',[uid,id]);
  const d=rows[0];assert(d,404,'This document no longer exists.');
  assert(d.owner_id===uid||d.shared_role,403,"You don't have access to this document. Ask the owner to share it with you.");
  d.role=d.owner_id===uid?'owner':d.shared_role;
  assert(permission!=='owner'||d.role==='owner',403,'Only the document owner can manage access or delete it.');
  assert(permission!=='write'||d.role!=='viewer',403,'You have view-only access. Ask the owner for editing access.');return d;
 }
 const present=d=>({id:d.id,title:d.title,content:d.content?JSON.parse(d.content):undefined,excerpt:d.excerpt,revision:Number(d.revision),createdAt:d.created_at,updatedAt:d.updated_at,role:d.role,owner:{id:d.owner_id,name:d.owner_name,email:d.owner_email,initials:d.owner_initials,color:d.owner_color}});
 async function create(uid,title,content) {
  title=validTitle(title);content=validContent(content);const id=crypto.randomUUID(),now=new Date().toISOString();
  await db.execute('INSERT INTO folio_documents (id,owner_id,title,content,excerpt,created_at,updated_at) VALUES (?,?,?,?,?,?,?)',[id,uid,title,JSON.stringify(content),plainText(content).slice(0,260),now,now]);return json(present(await access(id,uid)),201);
 }
 async function payload(req) {
  const body=await req.text();assert(new TextEncoder().encode(body).length<650000,413,'This request is too large.');
  try{const data=JSON.parse(body);assert(data&&typeof data==='object'&&!Array.isArray(data),400,'Expected an object.');return data;}catch{throw new Problem(400,'The request could not be read. Please try again.');}
 }
 return async function handle(req) {
  try {
   const parts=new URL(req.url).pathname.replace(/^\/api\/?/,'').split('/').filter(Boolean).map(decodeURIComponent);
   const [resource,id,sub,member]=parts;
   if(req.method==='GET'&&resource==='users'&&parts.length===1)return json((await db.execute("SELECT id,name,email,initials,color FROM folio_users ORDER BY CASE id WHEN 'nikhil' THEN 0 ELSE 1 END,name")).rows);
   const uid=req.headers.get('x-folio-user');assert(uid&&(await db.execute('SELECT id FROM folio_users WHERE id=?',[uid])).rows.length,401,'Choose a demo account to continue.');
   if(resource==='import'&&req.method==='POST'&&parts.length===1){const body=await payload(req);const imported=importDocument(body.filename,body.text);return await create(uid,imported.title,imported.content);}
   if(resource!=='documents')throw new Problem(404,'API route not found.');
   if(!id) {
    if(req.method==='GET') {
     const {rows}=await db.execute("SELECT d.id,d.title,d.excerpt,d.revision,d.created_at,d.updated_at,d.owner_id,u.name AS owner_name,u.email AS owner_email,u.initials AS owner_initials,u.color AS owner_color,CASE WHEN d.owner_id=? THEN 'owner' ELSE a.role END AS role FROM folio_documents d JOIN folio_users u ON u.id=d.owner_id LEFT JOIN folio_access a ON a.document_id=d.id AND a.user_id=? WHERE d.owner_id=? OR a.user_id=? ORDER BY d.updated_at DESC",[uid,uid,uid,uid]);return json(rows.map(present));
    }
    if(req.method==='POST'){const body=await payload(req);return await create(uid,body.title??'Untitled document',emptyDocument());}
   }
   if(id&&parts.length===2) {
    if(req.method==='GET')return json(present(await access(id,uid)));
    if(req.method==='PATCH') {
     await access(id,uid,'write');const body=await payload(req);const title=validTitle(body.title),content=validContent(body.content);
     assert(Number.isInteger(body.revision)&&body.revision>0,400,'A valid document revision is required.');
     const {rowsAffected}=await db.execute('UPDATE folio_documents SET title=?,content=?,excerpt=?,updated_at=?,revision=revision+1 WHERE id=? AND revision=?',[title,JSON.stringify(content),plainText(content).slice(0,260),new Date().toISOString(),id,body.revision]);
     assert(rowsAffected===1,409,'A newer version was saved elsewhere. Download your draft before loading the latest version.');return json(present(await access(id,uid)));
    }
    if(req.method==='DELETE'){await access(id,uid,'owner');await db.execute('DELETE FROM folio_access WHERE document_id=?',[id]);await db.execute('DELETE FROM folio_documents WHERE id=?',[id]);return json({ok:true});}
   }
   if(sub==='shares'&&parts.length===3) {
    if(req.method==='GET'){await access(id,uid);return json((await db.execute('SELECT a.user_id,a.role,u.name,u.email,u.initials,u.color FROM folio_access a JOIN folio_users u ON u.id=a.user_id WHERE a.document_id=? ORDER BY u.name',[id])).rows);}
    if(req.method==='POST'||req.method==='PUT') {
     const d=await access(id,uid,'owner'),body=await payload(req);
     assert(typeof body.userId==='string'&&body.userId!==d.owner_id&&(await db.execute('SELECT id FROM folio_users WHERE id=?',[body.userId])).rows.length,400,'Choose a teammate other than the owner.');
     assert(['editor','viewer'].includes(body.role),400,'Choose editor or viewer access.');
     if(req.method==='POST'){
      const result=await db.execute('INSERT OR IGNORE INTO folio_access (document_id,user_id,role) VALUES (?,?,?)',[id,body.userId,body.role]);
      assert(result.rowsAffected===1,409,'This teammate already has access. Change their permission in the people list above.');
     }else{
      const result=await db.execute('UPDATE folio_access SET role=? WHERE document_id=? AND user_id=?',[body.role,id,body.userId]);
      assert(result.rowsAffected===1,404,'This teammate no longer has access. Invite them again.');
     }
     return json({ok:true});
    }
   }
   if(sub==='shares'&&member&&parts.length===4&&req.method==='DELETE'){await access(id,uid,'owner');await db.execute('DELETE FROM folio_access WHERE document_id=? AND user_id=?',[id,member]);return json({ok:true});}
   return json({error:'API route not found.'},404);
  } catch(e) {
   if(e instanceof Problem)return json({error:e.message},e.status);
   console.error('Folio API request failed. Check database configuration and connectivity.');return json({error:'We could not reach your workspace. Your draft is still in this window. Please try again.'},503);
  }
 };
}
