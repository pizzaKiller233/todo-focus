const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'todo-focus.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS focus_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    seconds INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS daily_goal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_minutes INTEGER NOT NULL DEFAULT 480,
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// Ensure default goal row exists
const goalRow = db.prepare('SELECT COUNT(*) as count FROM daily_goal').get();
if (goalRow.count === 0) {
  db.prepare('INSERT INTO daily_goal (goal_minutes) VALUES (480)').run();
}

module.exports = db;
