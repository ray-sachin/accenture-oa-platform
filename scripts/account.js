'use strict';
const path=require('node:path');
const crypto=require('node:crypto');
const {promisify}=require('node:util');
const {openDatabase}=require('../server/db');
const root=path.join(__dirname,'..');
try{process.loadEnvFile(path.join(root,'.env'));}catch(error){if(error.code!=='ENOENT')throw error;}
const [action,email]=process.argv.slice(2);
if(!['inspect','clear-cooldown','reset-password','grant-admin','revoke-admin'].includes(action)||!email){console.log('Usage: node scripts/account.js inspect|clear-cooldown|reset-password|grant-admin|revoke-admin student@example.com\nRole changes require trusted server access. Recovery is for a trusted operator AFTER verifying account ownership. Passwords are entered privately, never as command arguments.');process.exit(1);}
const db=openDatabase(path.resolve(root,process.env.DATABASE_PATH||'private/runtime/campusready.sqlite'));
const user=db.prepare('SELECT * FROM users WHERE email=?').get(email.trim().toLowerCase());
if(!user){console.error('Account not found.');db.close();process.exit(1);}
if(action==='inspect'){console.log(JSON.stringify({email:user.email,premium:!!user.premium,isAdmin:!!user.is_admin,track:user.track,cooldownUntil:user.cooldown_until?new Date(user.cooldown_until).toISOString():null,activeSessions:db.prepare('SELECT COUNT(*) AS n FROM sessions WHERE user_id=? AND expires_at>?').get(user.id,Date.now()).n},null,2));db.close();}
else if(action==='grant-admin'||action==='revoke-admin'){
 db.exec('BEGIN IMMEDIATE');
 try{db.prepare('UPDATE users SET is_admin=? WHERE id=?').run(action==='grant-admin'?1:0,user.id);db.prepare('INSERT INTO security_events(user_id,kind,created_at) VALUES(?,?,?)').run(user.id,`operator_${action.replace('-','_')}`,Date.now());db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
 db.close();console.log('Administrator role updated. Existing sessions pick up the new permissions on their next request.');
}
else if(action==='clear-cooldown'){
 db.exec('BEGIN IMMEDIATE');
 try{db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);db.prepare('UPDATE users SET cooldown_until=0,conflicts=0 WHERE id=?').run(user.id);db.prepare('INSERT INTO security_events(user_id,kind,created_at) VALUES(?,?,?)').run(user.id,'operator_device_recovery',Date.now());db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}db.close();console.log('Cooldown cleared and all sessions revoked. The owner can sign in again.');
}else{
 if(!process.stdin.isTTY){console.error('Password recovery requires an interactive terminal with hidden input.');db.close();process.exit(1);}
 function hidden(prompt){return new Promise(resolve=>{let value='';process.stdout.write(prompt);process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');const listener=chunk=>{for(const c of chunk){if(c==='\u0003'){process.stdin.setRawMode(false);db.close();process.exit(1);}if(c==='\r'||c==='\n'){process.stdin.removeListener('data',listener);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');resolve(value);return;}if(c==='\u007f'||c==='\b')value=value.slice(0,-1);else if(c>=' ')value+=c;}};process.stdin.on('data',listener);});}
 (async()=>{try{const password=await hidden('New password (hidden): ');const confirmation=await hidden('Confirm password (hidden): ');if(password!==confirmation||password.length<12||password.length>128)throw new Error('Passwords must match and contain 12–128 characters.');const salt=crypto.randomBytes(16).toString('hex');const derived=await promisify(crypto.scrypt)(password,salt,64);db.exec('BEGIN IMMEDIATE');db.prepare('UPDATE users SET password=?,cooldown_until=0 WHERE id=?').run(`${salt}:${derived.toString('hex')}`,user.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);db.prepare('INSERT INTO security_events(user_id,kind,created_at) VALUES(?,?,?)').run(user.id,'operator_password_recovery',Date.now());db.exec('COMMIT');console.log('Password reset and sessions revoked.');}catch(error){console.error(error.message);process.exitCode=1;}finally{db.close();}})();
}
