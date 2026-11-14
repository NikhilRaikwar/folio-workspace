'use client';
import {useState,useRef,useEffect,useCallback} from 'react';
import type {Api,DocumentRecord,RichNode} from './types';
import {ApiError} from './types';
export default function useDraft(id:string,api:Api){
 const [record,setRecord]=useState<DocumentRecord|null>(null),[title,setTitle]=useState(''),[status,setStatus]=useState<'saved'|'saving'|'unsaved'|'error'>('saved'),[error,setError]=useState(''),[accessDenied,setAccessDenied]=useState(false),[loadVersion,setLoadVersion]=useState(0),[loading,setLoading]=useState(true),[blocked,setBlocked]=useState(false);
 const data=useRef({title:'',content:{} as RichNode,revision:0,seq:0,dirty:false,blocked:false});
 const inFlight=useRef<Promise<boolean>|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),live=useRef(true);
 const load=useCallback(async()=>{setLoading(true);setError('');setAccessDenied(false);try{
  const doc=await api<DocumentRecord>('/documents/'+id);if(!live.current)return;
  data.current={title:doc.title,content:doc.content,revision:doc.revision,seq:0,dirty:false,blocked:false};setRecord(doc);setTitle(doc.title);setBlocked(false);setStatus('saved');setLoadVersion(n=>n+1);
 }catch(e){if(live.current){setError((e as Error).message);setAccessDenied(e instanceof ApiError&&e.status===403);}}finally{if(live.current)setLoading(false);}},[id,api]);
 const save=useCallback(async():Promise<boolean>=>{
  if(inFlight.current)return inFlight.current;
  const d=data.current;if(!d.dirty)return true;if(d.blocked)return false;
  const seq=d.seq;const payload={title:d.title,content:d.content,revision:d.revision};setStatus('saving');
  const work=(async()=>{try{
   const saved=await api<DocumentRecord>('/documents/'+id,{method:'PATCH',body:JSON.stringify(payload)});
   d.revision=saved.revision;if(d.seq===seq){d.dirty=false;d.title=saved.title;}
   if(live.current){setRecord(saved);if(d.seq===seq)setTitle(saved.title);setStatus(d.dirty?'unsaved':'saved');setError('');}
   return !d.dirty;
  }catch(e){if(e instanceof ApiError&&[401,403,404,409].includes(e.status)){d.blocked=true;if(live.current)setBlocked(true);}if(live.current){setStatus('error');setError((e as Error).message);}return false;}
  finally{inFlight.current=null;}})();inFlight.current=work;return work;
 },[api,id]);
 const schedule=useCallback(()=>{if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>{void save();},800);},[save]);
 const change=useCallback((update:{title?:string;content?:RichNode})=>{Object.assign(data.current,update);data.current.dirty=true;data.current.seq++;if(update.title!==undefined)setTitle(update.title);setStatus('unsaved');schedule();},[schedule]);
 // If a user types during an in-flight save, a second save must run after its
 // completion. The revision from the response is adopted before that write.
 useEffect(()=>{if(status==='unsaved'&&data.current.dirty&&!data.current.blocked)schedule();},[status,record,schedule]);
 useEffect(()=>{live.current=true;load();return()=>{live.current=false;if(timer.current)clearTimeout(timer.current);};},[load]);
 useEffect(()=>{const unload=(e:BeforeUnloadEvent)=>{if(data.current.dirty){e.preventDefault();e.returnValue='';}};const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();void save();}};window.addEventListener('beforeunload',unload);window.addEventListener('keydown',key);return()=>{window.removeEventListener('beforeunload',unload);window.removeEventListener('keydown',key);};},[save]);
 const flush=async()=>{if(timer.current)clearTimeout(timer.current);if(inFlight.current)await inFlight.current;if(data.current.dirty&&!data.current.blocked)await save();return !data.current.dirty;};
 return {record,title,status,error,accessDenied,blocked,loading,loadVersion,change,save,flush,reload:load,snapshot:()=>({title:data.current.title,content:data.current.content,revision:data.current.revision}),isDirty:()=>data.current.dirty};
}
