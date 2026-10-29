'use strict';
const { DatabaseSync } = require('node:sqlite');
const { mkdirSync } = require('node:fs');
const path = require('node:path');
function openDatabase(filename) {
  if (filename !== ':memory:') mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, premium INTEGER NOT NULL DEFAULT 0, track INTEGER NOT NULL DEFAULT 10 CHECK(track IN (10,20,30)), cooldown_until INTEGER NOT NULL DEFAULT 0, conflicts INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), device TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), amount INTEGER NOT NULL CHECK(amount=49900), payment_id TEXT UNIQUE, status TEXT NOT NULL DEFAULT 'created', created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS webhook_events (id TEXT PRIMARY KEY, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), mode TEXT NOT NULL, question_ids TEXT NOT NULL, started_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'active', answers TEXT NOT NULL DEFAULT '{}', score INTEGER, total INTEGER, code TEXT NOT NULL DEFAULT '{}');
    CREATE UNIQUE INDEX IF NOT EXISTS single_active_attempt ON attempts(user_id) WHERE status='active';
    CREATE TABLE IF NOT EXISTS progress (user_id TEXT NOT NULL REFERENCES users(id), question_id TEXT NOT NULL, status TEXT NOT NULL, updated_at INTEGER NOT NULL, PRIMARY KEY(user_id,question_id));
    CREATE TABLE IF NOT EXISTS study_days (user_id TEXT NOT NULL REFERENCES users(id), track INTEGER NOT NULL, day INTEGER NOT NULL, completed_at INTEGER NOT NULL, PRIMARY KEY(user_id,track,day));
    CREATE TABLE IF NOT EXISTS quotas (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS security_events (id INTEGER PRIMARY KEY, user_id TEXT, kind TEXT NOT NULL, created_at INTEGER NOT NULL);
  `);
  // Additive migrations preserve existing accounts, payments and preparation history.
  if (!db.prepare('PRAGMA table_info(users)').all().some(c=>c.name==='is_admin')) db.exec('ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0 CHECK(is_admin IN (0,1))');
  db.exec(`
    CREATE TABLE IF NOT EXISTS invite_codes (id TEXT PRIMARY KEY, label TEXT NOT NULL, code_hash TEXT UNIQUE NOT NULL, max_uses INTEGER NOT NULL CHECK(max_uses>0), expires_at INTEGER NOT NULL, revoked_at INTEGER, created_by TEXT NOT NULL REFERENCES users(id), created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS invite_redemptions (code_id TEXT NOT NULL REFERENCES invite_codes(id), user_id TEXT NOT NULL REFERENCES users(id), redeemed_at INTEGER NOT NULL, PRIMARY KEY(code_id,user_id));
    CREATE INDEX IF NOT EXISTS invite_redemptions_user ON invite_redemptions(user_id);
    CREATE TABLE IF NOT EXISTS admin_events (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL REFERENCES users(id), kind TEXT NOT NULL, target_id TEXT NOT NULL, created_at INTEGER NOT NULL);
  `);
  if (!db.prepare('PRAGMA table_info(orders)').all().some(c=>c.name==='invite_id')) db.exec('ALTER TABLE orders ADD COLUMN invite_id TEXT REFERENCES invite_codes(id)');
  return db;
}
module.exports = { openDatabase };
