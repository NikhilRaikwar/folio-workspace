'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,Check,LockKeyhole,UserPlus,X} from 'lucide-react';
import Dialog from './dialog';
import Select from './select';
const permissions=[{value:'editor',label:'Can edit',description:'Write and update this document'},{value:'viewer',label:'Can view',description:'Read without making changes'}];
import type {Api,DocumentRecord,Grant,Person} from './types';
export function Avatar({person,small=false}:{person:Pick<Person,'initials'|'color'>;small?:boolean}){return <span className={'avatar '+person.color+(small?' avatar-sm':'')}>{person.initials}</span>;}
export default function ShareDialog({record,users,api,onClose}:{record:DocumentRecord;users:Person[];api:Api;onClose:()=>void}){
 const [grants,setGrants]=useState<Grant[]>([]),[user,setUser]=useState(''),[role,setRole]=useState('editor'),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(''),[message,setMessage]=useState('');
 const root='/documents/'+record.id+'/shares';
 async function refresh(){setGrants(await api<Grant[]>(root));}
 useEffect(()=>{refresh().catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
 async function update(uid:string,value:string,invite=false){setBusy(true);setError('');setMessage('');try{await api(root+(value==='remove'?'/'+uid:''),{method:value==='remove'?'DELETE':invite?'POST':'PUT',...(value==='remove'?{}:{body:JSON.stringify({userId:uid,role:value})})});await refresh();setUser('');setMessage(value==='remove'?'Access removed.':'Access updated. Switch demo accounts from the workspace to try it.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <Dialog title="A good draft deserves company." kicker="SHARE DOCUMENT" description="Choose who can read your work, and who can help shape it." onClose={onClose}>
 <div className="access-person"><Avatar person={record.owner}/><span><strong>{record.owner.name}</strong><small>{record.owner.email}</small></span><span className="role-label">Owner</span></div>
 {loading?<p className="subtle">Loading access…</p>:grants.map(g=><div className="access-person" key={g.user_id}><Avatar person={g}/><span><strong>{g.name}</strong><small>{g.email}</small></span>{record.role==='owner'?<><Select label={'Access for '+g.name} compact disabled={busy} value={g.role} options={permissions} onChange={value=>update(g.user_id,value)}/><button className="icon" aria-label={'Remove '+g.name} disabled={busy} onClick={()=>update(g.user_id,'remove')}><X size={15}/></button></>:<span className="role-label">{g.role==='editor'?'Can edit':'Can view'}</span>}</div>)}
 {record.role==='owner'&&<form className="grant-form" onSubmit={e=>{e.preventDefault();update(user,role,true);}}><label htmlFor="invite-user">Invite a teammate</label><div className="grant-fields"><Select id="invite-user" label="Invite a teammate" placeholder="Choose a teammate" value={user} disabled={busy||loading} options={users.filter(u=>u.id!==record.owner.id).map(u=>({value:u.id,label:u.name,description:u.email,icon:<Avatar person={u}/>}))} onChange={setUser}/><Select label="Permission for teammate" value={role} disabled={busy||loading} options={permissions} onChange={setRole} compact/></div><p className="field-help">Editors can change the title and text. Only the owner can manage access or delete.</p><button className="primary wide" disabled={busy||!user||loading}><UserPlus size={16}/>{busy?'Updating access…':'Grant access'}<span className="button-end"><ArrowUpRight size={17}/></span></button></form>}
 {record.role!=='owner'&&<p className="field-help owner-note">Only {record.owner.name} can change who has access.</p>}
 {error&&<div className="notice error" role="alert">{error}</div>}{message&&<div className="notice success" role="status"><Check size={16}/>{message}</div>}
 <div className="privacy-note"><LockKeyhole size={15}/><span><strong>Restricted document</strong><small>Only the owner and invited demo accounts have access.</small></span></div>
 </Dialog>;
}
