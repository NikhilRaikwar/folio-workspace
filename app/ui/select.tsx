'use client';
import {useEffect,useId,useRef,useState,type ReactNode} from 'react';
import {Check,ChevronDown} from 'lucide-react';

type Option={value:string;label:string;description?:string;icon?:ReactNode};
export default function Select({id,label,value,options,onChange,placeholder='Choose an option',disabled=false,compact=false,floating=false}:{id?:string;label:string;value:string;options:Option[];onChange:(value:string)=>void;placeholder?:string;disabled?:boolean;compact?:boolean;floating?:boolean}){
 const generated=useId(),listId=generated+'-list',trigger=useRef<HTMLButtonElement>(null),root=useRef<HTMLDivElement>(null);
 const [open,setOpen]=useState(false),[active,setActive]=useState(0);
 const selected=options.find(o=>o.value===value);
 function show(){setActive(Math.max(0,options.findIndex(o=>o.value===value)));setOpen(true);}
 function choose(index:number){const option=options[index];if(!option)return;setOpen(false);trigger.current?.focus();onChange(option.value);}
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
 useEffect(()=>{if(disabled)setOpen(false);},[disabled]);
 return <div ref={root} className={'folio-select '+(compact?'compact-select ':'')+(floating?'floating-select ':'')+(open?'select-open':'')}>
  <button ref={trigger} id={id} type="button" className="select-trigger" role="combobox" aria-label={label} aria-expanded={open} aria-haspopup="listbox" aria-controls={open?listId:undefined} aria-activedescendant={open?listId+'-'+active:undefined} disabled={disabled} onClick={()=>open?setOpen(false):show()} onKeyDown={e=>{
   if(e.key==='Escape'&&open){e.preventDefault();e.stopPropagation();setOpen(false);return;}
   if(e.key==='Tab'){setOpen(false);return;}
   if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(!open){show();return;}setActive(i=>e.key==='Home'?0:e.key==='End'?options.length-1:(i+(e.key==='ArrowDown'?1:-1)+options.length)%options.length);return;}
   if((e.key==='Enter'||e.key===' ')&&open){e.preventDefault();choose(active);}
  }}>
   {selected?.icon&&<span className="select-leading">{selected.icon}</span>}
   <span className={'select-value '+(!selected?'select-placeholder':'')}><strong>{selected?.label||placeholder}</strong>{!compact&&selected?.description&&<small>{selected.description}</small>}</span><ChevronDown size={16}/>
  </button>
  {open&&<div id={listId} role="listbox" aria-label={label} className="select-menu">{options.map((option,i)=><button id={listId+'-'+i} key={option.value} type="button" role="option" data-value={option.value} aria-selected={value===option.value} tabIndex={-1} className={'select-option '+(i===active?'option-active':'')} onMouseDown={e=>e.preventDefault()} onPointerMove={()=>setActive(i)} onClick={()=>choose(i)}>{option.icon&&<span className="select-leading">{option.icon}</span>}<span><strong>{option.label}</strong>{option.description&&<small>{option.description}</small>}</span>{value===option.value&&<Check size={16}/>}</button>)}</div>}
 </div>;
}
