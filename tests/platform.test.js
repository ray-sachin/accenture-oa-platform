'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Readable,Writable}=require('node:stream');
const crypto=require('node:crypto');
const {createApp,sqlRun}=require('../server/app');
const {openDatabase}=require('../server/db');
const bank=require('../private/bank/questions.json');
const tracks=require('../private/bank/tracks.json');

// Invoke the real HTTP request handler without requiring network permissions.
function fixture(env={},fetch){const db=openDatabase(':memory:');const server=createApp({db,env:{APP_ORIGIN:'http://localhost:3000',NODE_ENV:'development',GEMINI_API_KEY:'',JUDGE0_URL:'',RAZORPAY_KEY_ID:'',RAZORPAY_KEY_SECRET:'',RAZORPAY_WEBHOOK_SECRET:'',...env},fetch});return {db,server};}
function client(server,ip='127.0.0.1'){
 const cookies={};let csrf='';
 async function request(path,body,extra={}){
  const raw=body===undefined?null:Buffer.from(typeof body==='string'?body:JSON.stringify(body));
  const req=Readable.from(raw?[raw]:[]);req.method=body===undefined?'GET':'POST';req.url=path;req.socket={remoteAddress:ip};req.headers={cookie:Object.entries(cookies).map(([k,v])=>`${k}=${v}`).join('; '),origin:'http://localhost:3000','content-type':'application/json','x-csrf-token':csrf,...extra};
  const chunks=[];const headers={};const res=new Writable({write(chunk,encoding,callback){chunks.push(Buffer.from(chunk));callback();}});res.statusCode=200;res.setHeader=(key,value)=>{headers[key.toLowerCase()]=value;};res.writeHead=(status,values={})=>{res.statusCode=status;Object.entries(values).forEach(([k,v])=>res.setHeader(k,v));res.headersSent=true;};
  const done=new Promise((resolve,reject)=>{res.on('finish',resolve);res.on('error',reject);});server.emit('request',req,res);await done;
  for(const c of [].concat(headers['set-cookie']||[])){const [key,value]=c.split(';')[0].split('=');cookies[key]=value;}
  const text=Buffer.concat(chunks).toString('utf8');let data;try{data=JSON.parse(text);}catch{data=text;}if(data?.csrf)csrf=data.csrf;
  return {status:res.statusCode,data,headers};
 }
 return {request,cookies,bootstrap:()=>request('/api/bootstrap'),register:async(email='student@example.test')=>{await request('/api/bootstrap');return request('/api/auth/register',{name:'Test Student',email,password:'Test passphrase 2026!'});},login:()=>request('/api/auth/login',{email:'student@example.test',password:'Test passphrase 2026!'})};
}
test('catalog: exactly 100 questions, three complete schedules, valid references and keys',()=>{
 assert.equal(bank.length,100);assert.equal(new Set(bank.map(q=>q.id)).size,100);
 assert.deepEqual(tracks.map(t=>t.days),[10,20,30]);for(const t of tracks){assert.equal(t.schedule.length,t.days);for(const day of t.schedule){assert.ok(day.ids.length>0,'Every day includes a linked exercise');assert.ok(day.lesson&&day.tasks.length>0);for(const id of day.ids)assert.ok(bank.some(q=>q.id===id));}}
 for(const q of bank){assert.ok(q.title&&q.scenario);if(q.type==='mcq')assert.ok(q.answer>=0&&q.answer<q.options.length);if(q.type==='code')assert.ok(q.tests.some(t=>t.hidden));}
});
test('public responses contain metadata only; private routes and files cannot be downloaded',async()=>{
 const {db,server}=fixture();const c=client(server);const boot=await c.bootstrap();assert.equal(boot.status,200);assert.equal(boot.data.questions.length,100);assert.equal(boot.data.price,499);
 for(const q of boot.data.questions){assert.equal(q.solution,undefined);assert.equal(q.tests,undefined);assert.equal(q.answer,undefined);}
 for(const url of ['/data/questions.json','/data/logs.json','/.env','/private/bank/questions.json','/server/app.js','/../private/bank/questions.json','/%2e%2e/.env'])assert.equal((await c.request(url)).status,404,url);
 assert.equal((await c.request('/api/logs')).status,401);assert.equal((await c.request('/api/attempts',{questionId:'parity'})).status,401);db.close();
});
test('authentication validates CSRF, origin and password; hashes credentials and stores only token hashes',async()=>{
 const {db,server}=fixture();const c=client(server);await c.bootstrap();assert.equal((await c.request('/api/auth/register',{email:'x@y.test',name:'Test',password:'short'})).status,400);
 assert.equal((await c.request('/api/auth/register',{}, {origin:'https://evil.test'})).status,403);
 assert.equal((await c.request('/api/auth/register',{}, {'x-csrf-token':'fake'})).status,403);
 const r=await c.register();assert.equal(r.status,200);const u=db.prepare('SELECT * FROM users').get();assert.notEqual(u.password,'Test passphrase 2026!');assert.match(u.password,/^[a-f0-9]+:[a-f0-9]+$/);const s=db.prepare('SELECT * FROM sessions').get();assert.notEqual(s.token,c.cookies.campus_session);assert.notEqual(s.device,c.cookies.campus_device);assert.match(r.headers['set-cookie'],/HttpOnly; SameSite=Strict/);assert.equal((await c.bootstrap()).data.user.id,u.id);db.close();
});
test('one active browser: invalid passwords cannot trigger cooldown; valid conflicts yield 6 then 12 hours',async()=>{
 const {db,server}=fixture();const a=client(server),b=client(server);await a.register();await b.bootstrap();
 assert.equal((await b.request('/api/auth/login',{email:'student@example.test',password:'Wrong passphrase 2026!'})).status,401);assert.equal(db.prepare('SELECT cooldown_until FROM users').get().cooldown_until,0);
 const conflict=await b.login();assert.equal(conflict.status,423);assert.ok(conflict.data.cooldownUntil-Date.now()>5.99*3600000);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM sessions').get().n,0);
 assert.equal((await a.login()).status,423);db.prepare('UPDATE users SET cooldown_until=0').run();assert.equal((await a.login()).status,200);
 const repeat=await b.login();assert.equal(repeat.status,423);assert.ok(repeat.data.cooldownUntil-Date.now()>11.99*3600000);db.close();
});
test('logout allows a deliberate device change and reused sessions fail after expiry',async()=>{
 const {db,server}=fixture();const a=client(server),b=client(server);await a.register();await a.request('/api/auth/logout',{});await b.bootstrap();assert.equal((await b.login()).status,200);db.prepare('UPDATE sessions SET expires_at=0').run();assert.equal((await b.request('/api/history')).status,401);db.close();
});
test('premium actions fail closed; no client premium flag unlocks content, AI or checkout',async()=>{
 const {db,server}=fixture();const c=client(server);await c.register();assert.equal((await c.request('/api/attempts',{mode:'practice',questionId:'house-robber',premium:true})).status,402);
 assert.equal((await c.request('/api/tutor',{message:'Hello'})).status,402);assert.equal((await c.request('/api/library/project-prd')).status,402);assert.equal((await c.request('/api/payments/order',{})).status,503);
 assert.equal((await c.request('/api/profile',{track:15})).status,400);assert.equal((await c.request('/api/profile',{track:20})).status,200);assert.equal((await c.bootstrap()).data.user.track,20);db.close();
});
test('attempt isolation, single active session, code validation, timer and solution gates',async()=>{
 const {db,server}=fixture();const a=client(server),b=client(server);await a.register();await b.register('other@example.test');
 const {data:attempt}=await a.request('/api/attempts',{mode:'practice',questionId:'parity'});assert.equal(attempt.questions[0].solution,undefined);assert.equal(attempt.questions[0].tests,undefined);assert.equal(attempt.questions[0].samples.length,1);
 assert.equal((await b.request(`/api/attempts/${attempt.id}`)).status,404);assert.equal((await a.request('/api/attempts',{mode:'practice',questionId:'q1'})).data.id,attempt.id);
 assert.equal((await a.request(`/api/attempts/${attempt.id}/solution`,{questionId:'parity'})).status,423);
 assert.equal((await a.request(`/api/attempts/${attempt.id}/save`,{questionId:'house-robber',code:{python:'pass'}})).status,403);
 assert.equal((await a.request(`/api/attempts/${attempt.id}/save`,{questionId:'parity',code:{python:{invalid:true}}})).status,400);
 assert.equal((await a.request(`/api/attempts/${attempt.id}/save`,{questionId:'parity',code:{python:''}})).status,200);assert.equal((await a.request(`/api/attempts/${attempt.id}`)).data.code.parity.python,'');
 db.prepare('UPDATE attempts SET started_at=?,expires_at=? WHERE id=?').run(Date.now()-1201000,Date.now()+100000,attempt.id);
 assert.equal((await a.request(`/api/attempts/${attempt.id}/solution`,{questionId:'parity'})).status,200);
 db.prepare('UPDATE attempts SET expires_at=0 WHERE id=?').run(attempt.id);assert.equal((await a.request(`/api/attempts/${attempt.id}/save`,{answers:{}})).status,409);assert.equal((await a.request(`/api/attempts/${attempt.id}/run`,{questionId:'parity',code:'',submit:true,language:'python'})).status,409);
 assert.equal((await a.request(`/api/attempts/${attempt.id}/submit`,{})).status,200);assert.equal((await a.request(`/api/attempts/${attempt.id}/submit`,{})).status,200);db.close();
});
test('MCQ answers are graded on the server and submitted attempts cannot be edited',async()=>{
 const {db,server}=fixture();const c=client(server);await c.register();const {data:a}=await c.request('/api/attempts',{mode:'diagnostic'});
 assert.equal(a.questions[0].answer,undefined);await c.request(`/api/attempts/${a.id}/save`,{answers:{'mcq-1':1,'mcq-2':0,'mcq-3':2,'mcq-4':1}});const r=await c.request(`/api/attempts/${a.id}/submit`,{score:999});assert.equal(r.data.score,4);assert.equal(r.data.total,4);assert.equal(r.data.review.length,4);
 assert.equal((await c.request(`/api/attempts/${a.id}/save`,{answers:{'mcq-1':0}})).status,409);assert.equal((await c.request(`/api/attempts/${a.id}`)).data.review.length,4);db.close();
});
test('SQL runs actual queries in a separate read-only database and rejects writes/extensions',async()=>{
 const q=bank.find(q=>q.id==='sports-sql');const correct=await sqlRun(q.schema,q.solution.sql);assert.equal(correct.rows.length,2);assert.equal(correct.rows[0].sports_count,3);
 assert.ok((await sqlRun(q.schema,"ATTACH DATABASE 'private/runtime/campusready.sqlite' AS secret")).error);
 assert.ok((await sqlRun(q.schema,"SELECT load_extension('anything')")).error);
 assert.ok((await sqlRun(q.schema,'DELETE FROM player')).error);
 for(const item of bank.filter(q=>q.type==='sql'))for(const fixture of item.fixtures)assert.ok(Array.isArray((await sqlRun(fixture,item.solution.sql)).rows),item.id);
});
test('SQL submission stores verified results but never reveals hidden fixture values',async()=>{
 const {db,server}=fixture();const c=client(server);await c.register();db.prepare('UPDATE users SET premium=1').run();const q=bank.find(q=>q.id==='sports-sql');const {data:a}=await c.request('/api/attempts',{mode:'practice',questionId:q.id});const r=await c.request(`/api/attempts/${a.id}/run`,{questionId:q.id,code:q.solution.sql,language:'sql',submit:true});assert.equal(r.status,200);assert.equal(r.data.passed,2);assert.equal(r.data.results[1].output,undefined);assert.equal(db.prepare('SELECT status FROM progress').get().status,'solved');db.close();
});
test('payment capture requires order ownership, HMAC, captured INR 49900, and idempotent webhook',async()=>{
 let orderN=0;let paymentAmount=49900;const fake=async(url,init)=>({ok:true,json:async()=>url.endsWith('/orders')?{id:`order_Test${++orderN}`}:{id:'pay_Test1',order_id:'order_Test1',amount:paymentAmount,currency:'INR',status:'captured'}});
 const {db,server}=fixture({RAZORPAY_KEY_ID:'test-key',RAZORPAY_KEY_SECRET:'test-secret',RAZORPAY_WEBHOOK_SECRET:'test-hook'},fake);const c=client(server),other=client(server);await c.register();await other.register('other@example.test');const {data:order}=await c.request('/api/payments/order',{amount:1});assert.equal(order.amount,49900);
 const signature=crypto.createHmac('sha256','test-secret').update(`${order.orderId}|pay_Test1`).digest('hex');const body={razorpay_order_id:order.orderId,razorpay_payment_id:'pay_Test1',razorpay_signature:signature};
 assert.equal((await other.request('/api/payments/verify',body)).status,400);assert.equal((await c.request('/api/payments/verify',{...body,razorpay_signature:'bad'})).status,400);paymentAmount=1;assert.equal((await c.request('/api/payments/verify',body)).status,400);paymentAmount=49900;assert.equal((await c.request('/api/payments/verify',body)).status,200);assert.equal((await c.bootstrap()).data.user.premium,true);
 const payload=JSON.stringify({event:'payment.captured',payload:{payment:{entity:{id:'pay_Test1',order_id:order.orderId,amount:49900,currency:'INR',status:'captured'}}}});const webhookSig=crypto.createHmac('sha256','test-hook').update(payload).digest('hex');
 assert.equal((await c.request('/api/payments/webhook',payload,{'x-razorpay-signature':'fake'})).status,400);for(let i=0;i<2;i++)assert.equal((await c.request('/api/payments/webhook',payload,{'x-razorpay-signature':webhookSig,'x-razorpay-event-id':'evt-1'})).status,200);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM webhook_events').get().n,1);db.close();
});
test('preview is authenticated and opaque-origin sandboxed; generated code stays out of parent',async()=>{
 const {db,server}=fixture();const c=client(server);await c.register();const {data:a}=await c.request('/api/attempts',{mode:'practice',questionId:'q1'});const {data:p}=await c.request(`/api/attempts/${a.id}/preview`,{questionId:'q1',code:{html:'<div>Preview</div>',css:'',js:''},test:true});const r=await c.request(p.url);assert.equal(r.status,200);assert.match(r.headers['content-security-policy'],/sandbox allow-scripts/);assert.doesNotMatch(r.headers['content-security-policy'],/allow-same-origin/);assert.match(r.headers['content-security-policy'],/connect-src 'none'/);assert.equal((await client(server).request(p.url)).status,401);db.close();
});
test('Gemini stays server-side, respects entitlement and has a per-account quota',async()=>{
 let captured;const {db,server}=fixture({GEMINI_API_KEY:'private-test-key',AI_DAILY_LIMIT:'1'},async(url,init)=>{captured=init;return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:'Start with a small example.'}]}}]})};});const c=client(server);await c.register();db.prepare('UPDATE users SET premium=1').run();const boot=await c.bootstrap();assert.ok(!JSON.stringify(boot.data).includes('private-test-key'));
 const r=await c.request('/api/tutor',{message:'Explain parity',questionId:'parity'});assert.equal(r.status,200);assert.equal(captured.headers['x-goog-api-key'],'private-test-key');assert.ok(!captured.body.includes('password'));assert.equal((await c.request('/api/tutor',{message:'Explain again'})).status,429);db.close();
});
test('Judge0 submission fixes limits, ignores client test cases and redacts hidden execution output',async()=>{
 const requests=[];const q=bank.find(q=>q.id==='parity');let i=0;
 const {db,server}=fixture({JUDGE0_URL:'https://judge.example.test'},async(url,init)=>{requests.push(JSON.parse(init.body));const expected=q.tests[i++].expected;return {ok:true,json:async()=>({status:{id:3,description:'Accepted'},stdout:Buffer.from(expected).toString('base64'),stderr:null})};});
 const c=client(server);await c.register();const {data:a}=await c.request('/api/attempts',{mode:'practice',questionId:q.id});const result=await c.request(`/api/attempts/${a.id}/run`,{questionId:q.id,code:'print(6)',language:'python',submit:true,tests:[],enable_network:true});
 assert.equal(result.status,200);assert.equal(result.data.passed,q.tests.length);assert.equal(requests.length,q.tests.length);
 for(const request of requests){assert.equal(request.enable_network,false);assert.equal(request.cpu_time_limit,2);assert.equal(request.memory_limit,128000);assert.equal(request.language_id,71);}
 assert.equal(result.data.results[1].output,undefined);assert.equal(result.data.results[1].input,undefined);assert.equal(result.data.results[1].expected,undefined);db.close();
});
test('AI access is disabled while a timed mock is active',async()=>{
 const {db,server}=fixture({GEMINI_API_KEY:'test'});const c=client(server);await c.register();db.prepare('UPDATE users SET premium=1').run();await c.request('/api/attempts',{mode:'coding'});assert.equal((await c.request('/api/tutor',{message:'Help with my mock'})).status,409);db.close();
});
test('large SQL allocation functions and recursive statements are denied',async()=>{
 assert.ok((await sqlRun('CREATE TABLE x(v);','SELECT randomblob(1000000000)')).error);
 assert.ok((await sqlRun('CREATE TABLE x(v);','WITH RECURSIVE a(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM a) SELECT sum(x) FROM a')).error);
});
test('campus rehearsal covers the notice areas, is paid, timed and independent of study pace',async()=>{
 const {db,server}=fixture();const c=client(server);await c.register();
 assert.equal((await c.request('/api/attempts',{mode:'campus'})).status,402);
 db.prepare('UPDATE users SET premium=1').run();
 for(const track of [10,20,30]){
  await c.request('/api/profile',{track});const {data:a}=await c.request('/api/attempts',{mode:'campus'});
  assert.equal(a.questions.length,43);assert.equal(a.expires_at-a.started_at,100*60000);
  assert.equal(a.questions.filter(q=>q.type==='mcq').length,40);
  for(const category of ['technical','dsa','sql','web','behavioral','reasoning','english'])assert.ok(a.questions.some(q=>q.category===category));
  assert.equal((await c.request(`/api/attempts/${a.id}/solution`,{questionId:'compression'})).status,403);
  assert.equal((await c.request('/api/tutor',{message:'Give me an answer'})).status,409);
  await c.request(`/api/attempts/${a.id}/submit`,{});
 }
 db.close();
});
test('an entitlement revoked during execution cannot record a paid solution',async()=>{
 const q=bank.find(q=>q.id==='house-robber');let db;
 const f=fixture({JUDGE0_URL:'https://judge.example.test'},async()=>{db.prepare('UPDATE users SET premium=0').run();return {ok:true,json:async()=>({status:{id:3,description:'Accepted'},stdout:Buffer.from('12').toString('base64')})};});db=f.db;
 const c=client(f.server);await c.register();db.prepare('UPDATE users SET premium=1').run();
 const {data:a}=await c.request('/api/attempts',{mode:'practice',questionId:q.id});
 const result=await c.request(`/api/attempts/${a.id}/run`,{questionId:q.id,code:'print(12)',language:'python',submit:true});
 assert.equal(result.status,402);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM progress').get().n,0);db.close();
});
test('SQL accepts explanatory comments and payment refunds revoke the complete pass',async()=>{
 const {db,server}=fixture({RAZORPAY_WEBHOOK_SECRET:'hook'});const c=client(server);await c.register();db.prepare('UPDATE users SET premium=1').run();
 const q=bank.find(q=>q.id==='sports-sql');const {data:a}=await c.request('/api/attempts',{mode:'practice',questionId:q.id});
 assert.equal((await c.request(`/api/attempts/${a.id}/run`,{questionId:q.id,code:'-- explanation\n/* read-only */\n'+q.solution.sql,language:'sql',submit:true})).data.passed,2);
 const u=db.prepare('SELECT id FROM users').get();db.prepare("INSERT INTO orders(id,user_id,amount,payment_id,status,created_at) VALUES('order_Refund',?,49900,'pay_Refund','captured',?)").run(u.id,Date.now());
 const payload=JSON.stringify({event:'refund.processed',payload:{refund:{entity:{payment_id:'pay_Refund',amount:49900}}}});
 const signature=crypto.createHmac('sha256','hook').update(payload).digest('hex');
 assert.equal((await c.request('/api/payments/webhook',payload,{'x-razorpay-signature':signature})).status,200);
 assert.equal((await c.bootstrap()).data.user.premium,false);assert.equal((await c.request(`/api/attempts/${a.id}`)).status,402);db.close();
});
