/**
 * scripts/setup-db.js
 *
 * Run once after `npm install` to create the SQLite database file and table.
 * Usage:  node scripts/setup-db.js
 *
 * Safe to run multiple times — uses CREATE TABLE IF NOT EXISTS.
 */

const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'prisma');
const dbPath = path.join(dbDir, 'dev.db');

// Ensure prisma/ directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

async function main() {
  const client = createClient({ url: `file:${dbPath}` });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS donations (
      id           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      nameGu       TEXT    NOT NULL DEFAULT '',
      city         TEXT    NOT NULL,
      cityGu       TEXT    NOT NULL DEFAULT '',
      message      TEXT    NOT NULL DEFAULT '',
      messageGu    TEXT    NOT NULL DEFAULT '',
      amount       REAL    NOT NULL,
      date         TEXT    NOT NULL,
      profileImage TEXT
    )
  `);

  console.log('✅ SQLite database ready at', dbPath);
  await client.close();
}

main().catch((err) => {
  console.error('❌ DB setup failed:', err);
  process.exit(1);
});
