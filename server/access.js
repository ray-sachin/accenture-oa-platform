'use strict';
const crypto = require('node:crypto');
const digest = code => crypto.createHash('sha256').update(code).digest('hex');
const normalize = code => typeof code==='string'?code.trim().toUpperCase():'';

function createAccess({db,fail,quota,env={}}) {
 const invitation = user => user ? db.prepare(`SELECT c.id,c.expires_at FROM invite_redemptions r JOIN invite_codes c ON c.id=r.code_id WHERE r.user_id=? AND c.revoked_at IS NULL AND c.expires_at>? ORDER BY r.redeemed_at DESC LIMIT 1`).get(user.id,Date.now()) : undefined;
 const status = user => {const code=invitation(user);const count=db.prepare('SELECT COUNT(*) AS c FROM invite_codes').get().c;return {required:env.REQUIRE_INVITATIONS!=='false'&&count>0,eligible:env.REQUIRE_INVITATIONS==='false'||count===0||!!code,expiresAt:code?.expires_at||null};};
 const requireInvitation = user => {if(env.REQUIRE_INVITATIONS==='false'||env.NODE_ENV==='test'||db.prepare('SELECT COUNT(*) AS c FROM invite_codes').get().c===0)return {id:null,expires_at:null};const code=invitation(user);if(!code)fail(403,'Redeem a valid invitation code before purchasing your pass.',{code:'INVITATION_REQUIRED'});return code;};
 const audit = (u,kind,target) => db.prepare('INSERT INTO admin_events VALUES(?,?,?,?,?)').run(crypto.randomUUID(),u.id,kind,target,Date.now());
 const codeRows = () => db.prepare(`SELECT c.id,c.label,c.max_uses,c.expires_at,c.revoked_at,c.created_at,COUNT(r.user_id) AS uses FROM invite_codes c LEFT JOIN invite_redemptions r ON r.code_id=c.id GROUP BY c.id ORDER BY c.created_at DESC LIMIT 100`).all();

 function handle({pathname,method,body,url,u,req,json}) {
  if(pathname==='/api/invitations/redeem'&&method==='POST') {
   quota(`redeem-user:${u.id}`,8,900000);
   quota(`redeem-ip:${digest(req.socket.remoteAddress||'unknown')}`,40,900000);
   const value=normalize(body.code);
   if(!/^[A-Z0-9-]{16,80}$/.test(value))fail(400,'This code is unavailable. Check it or request a new invitation.');
   // Synchronous transaction makes the final available place safe across concurrent requests.
   db.exec('BEGIN IMMEDIATE');
   try {
    const code=db.prepare('SELECT * FROM invite_codes WHERE code_hash=?').get(digest(value));
    if(!code||code.revoked_at!==null||code.expires_at<=Date.now())fail(400,'This code is unavailable. Check it or request a new invitation.');
    const redeemed=db.prepare('SELECT 1 FROM invite_redemptions WHERE code_id=? AND user_id=?').get(code.id,u.id);
    if(!redeemed) {
     const uses=db.prepare('SELECT COUNT(*) AS n FROM invite_redemptions WHERE code_id=?').get(code.id).n;
     if(uses>=code.max_uses)fail(400,'This code is unavailable. Check it or request a new invitation.');
     db.prepare('INSERT INTO invite_redemptions VALUES(?,?,?)').run(code.id,u.id,Date.now());
    }
    db.exec('COMMIT');
   }catch(error){db.exec('ROLLBACK');throw error;}
   json(200,{invitation:status(u)});return true;
  }
  if(!pathname.startsWith('/api/admin/'))return false;
  if(!u.is_admin)fail(403,'Administrator access is required.');
  if(pathname==='/api/admin/overview'&&method==='GET') {
   const now=Date.now();
   const users=db.prepare('SELECT COUNT(*) AS total,SUM(premium) AS unlocked,SUM(CASE WHEN created_at>? THEN 1 ELSE 0 END) AS joinedWeek,SUM(CASE WHEN cooldown_until>? THEN 1 ELSE 0 END) AS coolingDown FROM users').get(now-7*86400000,now);
   const payments=db.prepare("SELECT COUNT(*) AS total,COALESCE(SUM(CASE WHEN status='captured' THEN amount ELSE 0 END),0) AS capturedAmount,COALESCE(SUM(CASE WHEN status='refunded' THEN amount ELSE 0 END),0) AS refundedAmount FROM orders").get();
   const sessions=db.prepare('SELECT COUNT(DISTINCT user_id) AS active FROM sessions WHERE expires_at>?').get(now);
   const attempts=db.prepare("SELECT COUNT(*) AS total,COALESCE(SUM(CASE WHEN status='submitted' THEN 1 ELSE 0 END),0) AS submitted FROM attempts").get();
   const orders=db.prepare('SELECT o.id,o.amount,o.status,o.created_at,u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT 50').all();
   const events=db.prepare(`SELECT kind,created_at,email FROM (SELECT s.kind,s.created_at,u.email FROM security_events s LEFT JOIN users u ON u.id=s.user_id UNION ALL SELECT a.kind,a.created_at,u.email FROM admin_events a JOIN users u ON u.id=a.actor_id) ORDER BY created_at DESC LIMIT 50`).all();
   json(200,{users,payments,sessions,attempts,orders,events,codes:codeRows(),codeCount:db.prepare('SELECT COUNT(*) AS n FROM invite_codes').get().n,redemptions:db.prepare('SELECT COUNT(*) AS n FROM invite_redemptions').get().n});return true;
  }
  if(pathname==='/api/admin/users'&&method==='GET') {
   const search=String(url.searchParams.get('search')||'').trim().slice(0,100);
   const page=Math.max(1,Math.min(100000,Number.parseInt(url.searchParams.get('page'),10)||1));
   // Literal substring search; user-supplied wildcard characters have no special meaning.
   const filter='%'+search.replace(/[\\%_]/g,c=>'\\'+c)+'%';
   const where="WHERE u.name LIKE ? ESCAPE '\\' OR u.email LIKE ? ESCAPE '\\'";
   const total=db.prepare('SELECT COUNT(*) AS n FROM users u '+where).get(filter,filter).n;
   const rows=db.prepare(`SELECT u.id,u.name,u.email,u.premium,u.is_admin,u.track,u.created_at,u.cooldown_until,(SELECT COUNT(*) FROM attempts a WHERE a.user_id=u.id) AS attempts,(SELECT COUNT(*) FROM progress p WHERE p.user_id=u.id AND p.status='solved') AS solved,EXISTS(SELECT 1 FROM sessions s WHERE s.user_id=u.id AND s.expires_at>?) AS active FROM users u ${where} ORDER BY u.created_at DESC,u.id LIMIT 20 OFFSET ?`).all(Date.now(),filter,filter,(page-1)*20);
   json(200,{users:rows,total,page,pageSize:20});return true;
  }
  if(pathname==='/api/admin/codes'&&method==='POST') {
   quota(`admin-create:${u.id}`,30,3600000);
   const label=typeof body.label==='string'?body.label.trim():'';
   const code=body.code===undefined||body.code===''?crypto.randomBytes(16).toString('hex').toUpperCase():normalize(body.code);
   if(label.length<2||label.length>80)fail(400,'Use a code label of 2–80 characters.');
   if(!/^[A-Z0-9-]{16,80}$/.test(code))fail(400,'Use 16–80 letters, numbers or hyphens, or leave the code blank to generate a strong one.');
   if(!Number.isInteger(body.maxUses)||body.maxUses<1||body.maxUses>10000)fail(400,'Choose a redemption limit from 1 to 10,000.');
   if(!Number.isSafeInteger(body.expiresAt)||body.expiresAt<=Date.now()||body.expiresAt>Date.now()+366*86400000)fail(400,'Choose an expiry within the next year.');
   if(db.prepare('SELECT id FROM invite_codes WHERE code_hash=?').get(digest(code)))fail(409,'This code has already been used. Choose a different secret.');
   const id=crypto.randomUUID();
   db.exec('BEGIN IMMEDIATE');
   try{db.prepare('INSERT INTO invite_codes VALUES(?,?,?,?,?,NULL,?,?)').run(id,label,digest(code),body.maxUses,body.expiresAt,u.id,Date.now());audit(u,'invitation_created',id);db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
   // Returned once for distribution; only its digest is persisted. Never log the secret.
   json(201,{id,code});return true;
  }
  const revoke=pathname.match(/^\/api\/admin\/codes\/([a-f0-9-]+)\/revoke$/);
  if(revoke&&method==='POST') {
   const code=db.prepare('SELECT id,revoked_at FROM invite_codes WHERE id=?').get(revoke[1]);
   if(!code)fail(404,'Invitation not found.');
   db.exec('BEGIN IMMEDIATE');
   try{if(code.revoked_at===null){db.prepare('UPDATE invite_codes SET revoked_at=? WHERE id=?').run(Date.now(),code.id);audit(u,'invitation_revoked',code.id);}db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
   json(200,{ok:true});return true;
  }
  fail(404,'Admin route not found.');
 }
 return {status,requireInvitation,handle};
}
module.exports={createAccess};
