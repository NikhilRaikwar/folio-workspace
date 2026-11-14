export function createDatabase(url,token) {
  if(!url||!token)throw new Error('Database configuration is missing.');
  const endpoint=new URL('/v2/pipeline',url.replace(/^libsql:/,'https:'));
  if(endpoint.protocol!=='https:')throw new Error('Use a secure remote database URL.');
  return {
    async execute(sql,args=[]) {
      const encode=value=>value===null?{type:'null'}:typeof value==='number'?{type:'integer',value:String(value)}:{type:'text',value:String(value)};
      const res=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({requests:[{type:'execute',stmt:{sql,args:args.map(encode)}},{type:'close'}]}),signal:AbortSignal.timeout(15000)});
      if(!res.ok)throw new Error('Database request failed.');
      const data=await res.json();const first=data.results?.[0];
      if(first?.type!=='ok')throw new Error('Database statement failed.');
      const result=first.response.result;
      return {rows:result.rows.map(row=>Object.fromEntries(row.map((cell,i)=>[result.cols[i].name,cell.type==='null'?null:cell.type==='integer'||cell.type==='float'?Number(cell.value):cell.value]))),rowsAffected:result.affected_row_count};
    }
  };
}
