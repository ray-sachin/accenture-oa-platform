'use strict';
const {DatabaseSync}=require('node:sqlite');
let input='';
process.stdin.setEncoding('utf8');
process.stdin.on('data',chunk=>{input+=chunk;if(input.length>150000)process.exit(1);});
process.stdin.on('end',()=>{
 try{
  const {schema,query}=JSON.parse(input);
  const db=new DatabaseSync(':memory:',{allowExtension:false});
  db.exec(schema);db.exec('PRAGMA query_only=ON;');
  const functions=new Set(['count','sum','total','avg','min','max','abs','round','lower','upper','length','substr','substring','coalesce','ifnull','nullif','trim','ltrim','rtrim','replace','typeof','like','glob','date','datetime','strftime','julianday','row_number','rank','dense_rank']);
  db.setAuthorizer((action,arg1,arg2)=>{
   if(action===31)return functions.has(String(arg2||arg1||'').toLowerCase())?0:1;
   return [20,21].includes(action)?0:1;
  });
  const rows=[];let size=0;
  for(const row of db.prepare(query).iterate()){size+=JSON.stringify(row).length;if(rows.length>=100||size>64000)throw new Error('Result limit exceeded. Return at most 100 rows and 64 KB.');rows.push(row);}
  process.stdout.write(JSON.stringify({rows}));db.close();
 }catch(error){process.stdout.write(JSON.stringify({error:error.message}));}
});
