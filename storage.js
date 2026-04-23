const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = path.join(__dirname, "game.db");
const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_token_hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS adventures (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    class_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    state_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS graveyard_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    class_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    total_battles INTEGER NOT NULL,
    victories INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    currency_earned_json TEXT NOT NULL,
    kill_stats_json TEXT NOT NULL,
    summary TEXT NOT NULL,
    death_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return crypto.randomUUID();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password, passwordHash) {
  const [, salt, stored] = passwordHash.split("$");
  const derived = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(stored, "hex");
  return storedBuffer.length === derived.length && crypto.timingSafeEqual(storedBuffer, derived);
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function sessionExpiry() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

function publicUser(row) {
  return row ? { id: row.id, username: row.username, createdAt: row.created_at, updatedAt: row.updated_at } : null;
}

function normalizeAdventureRow(row) {
  if (!row) return null;
  const snapshot = JSON.parse(row.state_json);
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    classId: row.class_id,
    level: row.level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    snapshot,
  };
}

function summarizeAdventure(snapshot) {
  const player = snapshot.player ?? {};
  return {
    name: player.name ?? "Unknown Adventurer",
    description: player.description ?? "",
    classId: player.classDef?.id ?? "unknown",
    level: player.level ?? 1,
  };
}

function normalizeCurrency(currency = {}) {
  const totalCopper = (currency.gold ?? 0) * 100 + (currency.silver ?? 0) * 10 + (currency.copper ?? 0);
  return {
    gold: Math.floor(totalCopper / 100),
    silver: Math.floor((totalCopper % 100) / 10),
    copper: totalCopper % 10,
  };
}

function buildGraveyardSummary(snapshot) {
  const player = snapshot.player ?? {};
  const stats = snapshot.progress?.killStats ?? {};
  const fragments = Object.entries(stats)
    .filter(([, count]) => count > 0)
    .map(([enemyType, count]) => `${count} ${enemyType}${count === 1 ? "" : "s"}`);
  const killsText = fragments.length ? fragments.join(", ") : "no foes";
  return `${player.name} made it to level ${player.level}, killed ${killsText}. May their legend always be remembered.`;
}

function createUser(username, password) {
  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (existing) {
    return { error: "That username is already taken." };
  }
  const timestamp = nowIso();
  const id = makeId();
  db.prepare(
    "INSERT INTO users (id, username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
  ).run(id, username, hashPassword(password), timestamp, timestamp);
  return { user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)) };
}

function authenticateUser(username, password) {
  const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!row || !verifyPassword(password, row.password_hash)) {
    return null;
  }
  return publicUser(row);
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const timestamp = nowIso();
  const expiresAt = sessionExpiry();
  db.prepare(
    "INSERT INTO sessions (id, user_id, session_token_hash, created_at, updated_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(makeId(), userId, hashSessionToken(token), timestamp, timestamp, expiresAt);
  return token;
}

function getUserBySessionToken(token) {
  if (!token) return null;
  const row = db.prepare(
    `SELECT users.* FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.session_token_hash = ?
       AND sessions.expires_at > ?`
  ).get(hashSessionToken(token), nowIso());
  return publicUser(row);
}

function deleteSession(token) {
  if (!token) return;
  db.prepare("DELETE FROM sessions WHERE session_token_hash = ?").run(hashSessionToken(token));
}

function listActiveAdventures(userId) {
  return db
    .prepare("SELECT * FROM adventures WHERE user_id = ? ORDER BY updated_at DESC")
    .all(userId)
    .map((row) => normalizeAdventureRow(row));
}

function getAdventure(userId, adventureId) {
  return normalizeAdventureRow(
    db.prepare("SELECT * FROM adventures WHERE id = ? AND user_id = ?").get(adventureId, userId)
  );
}

function saveAdventure(userId, snapshot, adventureId = null) {
  const summary = summarizeAdventure(snapshot);
  const timestamp = nowIso();
  if (!adventureId) {
    const activeCount = db.prepare("SELECT COUNT(*) AS count FROM adventures WHERE user_id = ?").get(userId).count;
    if (activeCount >= 3) {
      return { error: "You already have 3 active adventures." };
    }
    const id = makeId();
    db.prepare(
      "INSERT INTO adventures (id, user_id, name, description, class_id, level, state_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(id, userId, summary.name, summary.description, summary.classId, summary.level, JSON.stringify(snapshot), timestamp, timestamp);
    return { adventure: getAdventure(userId, id) };
  }

  db.prepare(
    "UPDATE adventures SET name = ?, description = ?, class_id = ?, level = ?, state_json = ?, updated_at = ? WHERE id = ? AND user_id = ?"
  ).run(summary.name, summary.description, summary.classId, summary.level, JSON.stringify(snapshot), timestamp, adventureId, userId);
  return { adventure: getAdventure(userId, adventureId) };
}

function deleteAdventure(userId, adventureId) {
  db.prepare("DELETE FROM adventures WHERE id = ? AND user_id = ?").run(adventureId, userId);
}

function recordDeath(userId, adventureId, snapshot) {
  const player = snapshot.player ?? {};
  const progress = snapshot.progress ?? {};
  const deathDate = nowIso();
  db.prepare(
    `INSERT INTO graveyard_entries
      (id, user_id, name, class_id, level, total_battles, victories, xp_earned, currency_earned_json, kill_stats_json, summary, death_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    makeId(),
    userId,
    player.name ?? "Unknown Adventurer",
    player.classDef?.id ?? "unknown",
    player.level ?? 1,
    progress.battlesFought ?? 0,
    progress.victories ?? 0,
    progress.xpEarned ?? 0,
    JSON.stringify(normalizeCurrency(progress.currencyEarned ?? {})),
    JSON.stringify(progress.killStats ?? {}),
    buildGraveyardSummary(snapshot),
    deathDate,
    deathDate
  );
  deleteAdventure(userId, adventureId);
}

function listGraveyardEntries(userId) {
  return db
    .prepare("SELECT * FROM graveyard_entries WHERE user_id = ? ORDER BY death_date DESC")
    .all(userId)
    .map((row) => ({
      id: row.id,
      name: row.name,
      classId: row.class_id,
      level: row.level,
      totalBattles: row.total_battles,
      victories: row.victories,
      xpEarned: row.xp_earned,
      currencyEarned: JSON.parse(row.currency_earned_json),
      killStats: JSON.parse(row.kill_stats_json),
      summary: row.summary,
      deathDate: row.death_date,
      createdAt: row.created_at,
    }));
}

module.exports = {
  createSession,
  createUser,
  deleteAdventure,
  deleteSession,
  getAdventure,
  getUserBySessionToken,
  listActiveAdventures,
  listGraveyardEntries,
  recordDeath,
  saveAdventure,
  authenticateUser,
  normalizeCurrency,
};
