import { marked } from 'marked';

export const MAX_IMPORT_BYTES = 200 * 1024;
export const MAX_DOCUMENT_BYTES = 500 * 1024;
export const emptyDocument = () => ({type:'doc',content:[{type:'paragraph'}]});
export class Problem extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function assert(condition, status, message) { if (!condition) throw new Problem(status,message); }
export function validTitle(input) {
  assert(typeof input === 'string' && input.trim().length <= 120,400,'Document titles must be text and no longer than 120 characters.');
  return input.trim() || 'Untitled document';
}

// Persist a deliberately small ProseMirror schema. Unknown attributes, marks,
// links, and executable embeds never cross the write boundary.
export function validContent(input) {
  assert(input && typeof input === 'object',400,'Document content is missing.');
  assert(new TextEncoder().encode(JSON.stringify(input)).length <= MAX_DOCUMENT_BYTES,413,'This document exceeds the 500 KB limit.');
  const children = {
    doc:['paragraph','heading','bulletList','orderedList','blockquote','codeBlock','horizontalRule'],
    paragraph:['text','hardBreak'],heading:['text','hardBreak'],
    bulletList:['listItem'],orderedList:['listItem'],
    listItem:['paragraph','bulletList','orderedList','blockquote','heading','codeBlock'],
    blockquote:['paragraph','heading','bulletList','orderedList','codeBlock'],codeBlock:['text'],
  };
  let count=0;
  function visit(node,depth=0) {
    assert(depth < 20 && ++count <= 20000,400,'This document is too deeply nested or complex.');
    assert(node && typeof node === 'object' && typeof node.type === 'string',400,'Invalid document structure.');
    const out={type:node.type};
    if(node.type==='text') {
      assert(typeof node.text==='string'&&node.text.length>0,400,'Invalid text node.');
      out.text=node.text;
      if(node.marks) {
        assert(Array.isArray(node.marks)&&node.marks.every(m=>m&&['bold','italic','underline','strike','code'].includes(m.type)),400,'Unsupported text formatting.');
        out.marks=node.marks.map(m=>({type:m.type}));
      }
      return out;
    }
    assert(Object.hasOwn(children,node.type) || ['horizontalRule','hardBreak'].includes(node.type),400,'Unsupported document element.');
    if(node.type==='heading') {
      assert([1,2,3].includes(node.attrs?.level),400,'Unsupported heading level.');
      out.attrs={level:node.attrs.level};
    }
    if(node.type==='orderedList') out.attrs={start:Number.isInteger(node.attrs?.start)&&node.attrs.start>0&&node.attrs.start<=10000?node.attrs.start:1};
    if(node.content) {
      assert(Array.isArray(node.content)&&!!children[node.type],400,'Invalid child content.');
      assert(node.content.every(n=>children[node.type].includes(n?.type)),400,'Unsupported document nesting.');
      out.content=node.content.map(n=>visit(n,depth+1));
    }
    if(node.type==='doc') assert(out.content?.length>0,400,'A document needs at least one block.');
    if(node.type==='listItem') assert(out.content?.[0]?.type==='paragraph',400,'A list item must begin with a paragraph.');
    if(['orderedList','bulletList','blockquote'].includes(node.type)) assert(out.content?.length>0,400,'Empty list or quote is not supported.');
    return out;
  }
  assert(input.type==='doc',400,'Invalid document root.');
  return visit(input);
}
export function plainText(node) {
  if(node.type==='text') return node.text;
  if(node.type==='hardBreak')return '\n';
  const text=(node.content||[]).map(plainText).join(['paragraph','heading'].includes(node.type)?'':'\n');
  return text;
}
function inline(tokens,marks=[]) {
  return (tokens||[]).flatMap(t=>{
    if(['strong','em','del'].includes(t.type))return inline(t.tokens,[...marks,{type:{strong:'bold',em:'italic',del:'strike'}[t.type]}]);
    if(t.type==='link')return inline(t.tokens,marks);
    if(t.type==='br')return [{type:'hardBreak'}];
    if(t.type==='escape'||t.type==='text')return t.tokens?inline(t.tokens,marks):t.text?[{type:'text',text:t.text,...(marks.length?{marks}: {})}]:[];
    if(t.type==='codespan')return [{type:'text',text:t.text,marks:[...marks,{type:'code'}]}];
    // Raw HTML and images are intentionally excluded from imports.
    return [];
  });
}
function blocks(tokens) {
  return tokens.flatMap(t=>{
    if(t.type==='heading')return [{type:'heading',attrs:{level:Math.min(t.depth,3)},content:inline(t.tokens)}];
    if(t.type==='paragraph'||t.type==='text')return [{type:'paragraph',content:inline(t.tokens||marked.lexer(t.text,{gfm:false}))}];
    if(t.type==='list')return [{type:t.ordered?'orderedList':'bulletList',...(t.ordered?{attrs:{start:t.start||1}}:{}),content:t.items.map(item=>{
      const content=blocks(item.tokens);if(content[0]?.type!=='paragraph')content.unshift({type:'paragraph'});return {type:'listItem',content};
    })}];
    if(t.type==='blockquote'){const content=blocks(t.tokens);return content.length?[{type:'blockquote',content}]:[];}
    if(t.type==='code')return [{type:'codeBlock',...(t.text?{content:[{type:'text',text:t.text}]}:{})}];
    if(t.type==='hr')return [{type:'horizontalRule'}];
    return [];
  });
}
export function importDocument(filename,text) {
  assert(typeof filename==='string'&&/\.(txt|md)$/i.test(filename),400,'Choose a .txt or .md file.');
  assert(typeof text==='string'&&new TextEncoder().encode(text).length<=MAX_IMPORT_BYTES,413,'Your file must be 200 KB or smaller.');
  assert(text.trim().length>0&&!text.includes('\0'),400,'Choose a non-empty UTF-8 text file.');
  let content;
  if(/\.md$/i.test(filename)) content=blocks(marked.lexer(text,{gfm:false}));
  else content=text.split(/\r?\n/).map(line=>({type:'paragraph',...(line?{content:[{type:'text',text:line}]}:{})}));
  assert(content.length>0,400,'No supported text was found. Use headings, paragraphs, or lists.');
  return {title:validTitle(filename.replace(/\.(txt|md)$/i,'').slice(0,120)),content:validContent({type:'doc',content})};
}
export function toMarkdown(node,level=0) {
  if(node.type==='text') {
    let text=node.text.replace(/([\\`*_\[\]])/g,'\\$1');
    for(const mark of node.marks||[]) {if(mark.type==='bold')text='**'+text+'**';if(mark.type==='italic')text='*'+text+'*';if(mark.type==='code')text='`'+node.text+'`';}
    return text;
  }
  if(node.type==='hardBreak')return '  \n';
  const join=()=> (node.content||[]).map(c=>toMarkdown(c,level)).join('');
  if(node.type==='heading')return '#'.repeat(node.attrs.level)+' '+join()+'\n\n';
  if(node.type==='paragraph')return join()+'\n\n';
  if(node.type==='codeBlock')return '```\n'+(node.content||[]).map(n=>n.text||'').join('')+'\n```\n\n';
  if(node.type==='horizontalRule')return '---\n\n';
  if(node.type==='blockquote')return join().trim().split('\n').map(s=>'> '+s).join('\n')+'\n\n';
  if(node.type==='bulletList'||node.type==='orderedList')return (node.content||[]).map((li,i)=>'  '.repeat(level)+(node.type==='bulletList'?'- ':`${(node.attrs?.start||1)+i}. `)+(li.content||[]).map(c=>toMarkdown(c,level+1)).join('').trim()+'\n').join('')+'\n';
  return join();
}
