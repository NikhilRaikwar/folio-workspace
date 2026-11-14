'use client';
import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
export default function Dialog({title,kicker='FOLIO WORKSPACE',description,onClose,children}:{title:string;kicker?:string;description?:string;onClose:()=>void;children:React.ReactNode}){
 const ref=useRef<HTMLDivElement>(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;const el=ref.current;el?.focus();
  const key=(e:KeyboardEvent)=>{
   if(e.defaultPrevented)return;
   if(e.key==='Escape')close.current();
   if(e.key==='Tab'){
    const focusable=Array.from(el?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]')||[]).filter(n=>n.getClientRects().length>0);
    const first=focusable[0],last=focusable.at(-1);
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===el)){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===el)){e.preventDefault();first?.focus();}
   }
  };
  document.addEventListener('keydown',key);const old=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=old;previous?.focus();};
 },[]);
 return <div className="dialog-layer" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1} ref={ref}><button className="icon dialog-x" onClick={onClose} aria-label="Close dialog"><X size={19}/></button><span className="eyebrow">{kicker}</span><h2 id="dialog-title">{title}</h2>{description&&<p className="dialog-description">{description}</p>}{children}</div></div>;
}
