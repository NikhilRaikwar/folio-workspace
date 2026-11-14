export const demoUsers=[
  {id:'nikhil',name:'Nikhil Raikwar',email:'nikhil@folio.demo',initials:'NR',color:'indigo'},
  {id:'maya',name:'Maya Iyer',email:'maya@folio.demo',initials:'MI',color:'rose'},
  {id:'aarav',name:'Aarav Shah',email:'aarav@folio.demo',initials:'AS',color:'amber'},
];
const text=s=>({type:'text',text:s});
const p=s=>({type:'paragraph',content:[text(s)]});
const h=s=>({type:'heading',attrs:{level:2},content:[text(s)]});
export const starterDocuments=[
 {id:'folio-welcome',owner:'nikhil',title:'A place for your next good idea',content:{type:'doc',content:[{type:'heading',attrs:{level:1},content:[text('A place for your next good idea')]},p('Some ideas arrive fully formed. Most need a little room. Folio is a shared space to think on paper, work through a first draft, and bring someone else into the conversation.'),h('Start with something small'),{type:'bulletList',content:['Give this document a title of your own.','Try a heading, a list, or a little emphasis.','Invite Maya to read your draft or help shape it.'].map(s=>({type:'listItem',content:[p(s)]}))},h('A note on this workspace'),p('These are demo accounts. Switch between Nikhil, Maya, and Aarav to explore ownership, editing, and view-only access. Use sample content, never confidential information.'),{type:'blockquote',content:[p('The first draft is just the beginning.')]}]}},
 {id:'folio-launch',owner:'maya',title:'Launch notes / the useful details',content:{type:'doc',content:[{type:'heading',attrs:{level:1},content:[text('Launch notes')]},p('A working brief for a quieter, more useful team workspace. Keep this draft focused on the decisions that help us ship.'),h('What we want to make easier'),p('Turn a scattered thought into a clear document. Save it with confidence. Put it in the right hands.'),h('The release checklist'),{type:'orderedList',attrs:{start:1},content:['Finish the core writing experience.','Verify that changes survive a refresh.','Review access as both an editor and a viewer.'].map(s=>({type:'listItem',content:[p(s)]}))},h('Open question'),p('What is the smallest improvement that would make your next writing session better?')]}},
 {id:'folio-research',owner:'nikhil',title:'Research notebook',content:{type:'doc',content:[{type:'heading',attrs:{level:1},content:[text('Research notebook')]},p('A scratchpad for observations, questions, and the little details worth keeping.'),h('A useful starting point'),p('Before adding another feature, understand the moment when someone needs it. What were they trying to do? What got in their way?'),h('Questions to bring to the team'),{type:'bulletList',content:['Where does the current draft live?','Who needs to review it?','What makes a document ready to share?'].map(s=>({type:'listItem',content:[p(s)]}))}]}},
];
export async function seedDatabase(db) {
  for(const u of demoUsers)await db.execute('INSERT OR IGNORE INTO folio_users VALUES (?,?,?,?,?)',[u.id,u.name,u.email,u.initials,u.color]);
  const exists=await db.execute("SELECT key FROM folio_setup WHERE key='seed-v1'");if(exists.rows.length)return;
  const now=new Date().toISOString();
  for(const d of starterDocuments)await db.execute('INSERT OR IGNORE INTO folio_documents (id,owner_id,title,content,excerpt,created_at,updated_at) VALUES (?,?,?,?,?,?,?)',[d.id,d.owner,d.title,JSON.stringify(d.content),d.content.content.filter(n=>n.type==='paragraph').map(n=>n.content[0].text).join(' ').slice(0,260),now,now]);
  await db.execute("INSERT OR IGNORE INTO folio_access VALUES ('folio-launch','nikhil','editor')");
  await db.execute("INSERT OR IGNORE INTO folio_setup VALUES ('seed-v1','complete')");
}
