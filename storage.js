const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "game.db");
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

const MEMORIAL_ENDINGS = [
  "May their legend always be remembered.",
  "Their march has ended, but their story remains.",
  "Let their name be carved in gold and shadow.",
  "They fell, but the road remembers.",
  "Their soul marches on.",
  "Rest now, brave wanderer.",
];

const TEST_PROFILE = {
  username: "jak",
  password: "Soulmarch!!",
};

const TEST_LEVEL = 20;
const TEST_XP = 465000;
const TEST_STATS = { mind: 60, body: 60, soul: 60 };

const TEST_WEAPONS = {
  sword: {
    id: "sword",
    name: "Sword",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 0,
    damageType: "physical",
    special: "+1 damage vs armored targets",
    critMin: 20,
    initiativeBonus: 0,
    status: null,
  },
  staff: {
    id: "staff",
    name: "Staff",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 0,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 0,
    damageType: "physical",
    special: "+1 to spell rolls",
    critMin: 20,
    spellAttackBonus: 1,
    initiativeBonus: 0,
    status: null,
  },
};

const TEST_ARMORS = {
  none: { id: "none", name: "No Armor", acBonus: 0, checkBonuses: {} },
  light: { id: "light", name: "Light", acBonus: 2, checkBonuses: {} },
  medium: { id: "medium", name: "Medium", acBonus: 3, checkBonuses: {} },
  heavy: { id: "heavy", name: "Heavy", acBonus: 4, checkBonuses: { mind: -1 } },
};

const TEST_CLASS_GEAR = {
  warrior: { weapon: "sword", armor: "medium" },
  rogue: { weapon: "sword", armor: "medium" },
  monk: { weapon: "staff", armor: "light" },
  magician: { weapon: "staff", armor: "none" },
  sorcerer: { weapon: "staff", armor: "none" },
  guardian: { weapon: "sword", armor: "heavy" },
  paladin: { weapon: "sword", armor: "heavy" },
  mystic: { weapon: "staff", armor: "light" },
};

const TEST_CLASS_NAMES = {
  warrior: "Warrior",
  rogue: "Stalker",
  monk: "Ascendant",
  magician: "Magician",
  sorcerer: "Channeler",
  guardian: "Guardian",
  paladin: "Justicar",
  mystic: "Psion",
};

const TEST_SKILLS = {
  warrior: ["powerStrike", "guardStance", "hamstring", "crushingBlow", "whirlwindCleave", "secondWind", "skullbreaker"],
  rogue: ["quickStab", "feint", "poisonEdge", "shadowThrow", "vanish", "cripplingCut"],
  monk: ["flurry", "innerFocus", "risingPalm", "spiritStep"],
  magician: ["fireBolt", "arcaneShield", "iceShard", "arcanePulse", "manaWard", "meteorSpark"],
  sorcerer: ["sparkSurge", "frostMark", "flameLash", "lightningChain", "chaosBolt", "stormBreaker"],
  guardian: ["brace", "shieldSlam", "ironBash", "bulwarkRush"],
  paladin: ["smite", "blessingStrike", "cleansingLight", "sanctifiedBlade"],
  mystic: ["mindSpike", "thoughtLock", "psychicVeil", "mindLance"],
};

const TEST_UPGRADES = {
  warrior: ["powerStrikeMastery", "guardStanceMastery", "hamstringMastery", "crushingBlowMastery", "whirlwindCleaveMastery"],
  rogue: ["quickStabMastery", "feintMastery", "poisonEdgeMastery", "shadowThrowMastery", "vanishMastery"],
  monk: ["flurryMastery", "innerFocusMastery"],
  magician: ["fireBoltMastery", "arcaneShieldMastery", "iceShardMastery", "arcanePulseMastery", "manaWardMastery"],
  sorcerer: ["sparkSurgeMastery", "frostMarkMastery", "flameLashMastery", "lightningChainMastery", "chaosBoltMastery"],
  guardian: ["braceMastery", "shieldSlamMastery"],
  paladin: ["smiteMastery", "blessingStrikeMastery"],
  mystic: ["mindSpikeMastery", "thoughtLockMastery"],
};

const TEST_FEATURES = {
  warrior: {
    core: ["warriorDamageScaling", "extraAttack", "relentlessStrikes", "veteransGrit", "executioner", "avatarOfWar"],
    berserker: ["frenzy", "bloodlust", "reckless", "carnage"],
    defender: ["shieldMastery", "ironWill", "fortress", "unbreakable", "livingWall"],
  },
  rogue: {
    core: ["rogueCritScaling", "sneakAttack", "shadowFlurry", "evasion", "assassinate", "exploitWeakness", "deathmark"],
    assassin: ["deathsOpening", "lethalPrecision", "killersRhythm", "assassinAssassinate", "perfectExecution"],
    scout: ["quickRead", "evasiveFootwork", "flowState", "ghostStep", "untouchable"],
  },
  monk: {
    core: ["monkStaminaRecovery"],
    body: [],
    soul: [],
  },
  magician: {
    core: ["magicianManaEfficiency", "empoweredCasting", "doubleCast", "spellDiscipline", "arcaneSurge", "spellEcho", "masterOfMagic"],
    elementalist: ["elementalAttunement", "unstableElements", "dualElements", "overchannel", "cataclysm"],
    sage: ["studiedCasting", "manaEfficiency", "arcaneInsight", "mindOverMatter", "perfectFocus"],
  },
  sorcerer: {
    core: ["sorcererSpellDamageScaling", "sorcererArcaneSurge", "chainCasting", "rawPower", "overload", "wildCasting", "arcaneCataclysm"],
    pyromancer: ["burningSoul", "kindling", "firestorm", "infernoHeart", "worldfire"],
    stormcaller: ["staticCharge", "conductiveShock", "arcJump", "thunderhead", "stormAvatar"],
  },
  guardian: {
    core: ["guardianReductionScaling"],
    bulwark: [],
    sentinel: [],
  },
  paladin: {
    core: ["paladinShieldScaling"],
    oathkeeper: [],
    avenger: [],
  },
  mystic: {
    core: ["mysticMindScaling"],
    seer: [],
    telekinetic: [],
  },
};

const TEST_ROSTER = [
  { classId: "warrior", subclassId: "berserker", subclassName: "Berserker" },
  { classId: "warrior", subclassId: "defender", subclassName: "Defender" },
  { classId: "rogue", subclassId: "assassin", subclassName: "Assassin" },
  { classId: "rogue", subclassId: "scout", subclassName: "Scout" },
  { classId: "monk", subclassId: "body", subclassName: "Body" },
  { classId: "monk", subclassId: "soul", subclassName: "Soul" },
  { classId: "magician", subclassId: "elementalist", subclassName: "Elementalist" },
  { classId: "magician", subclassId: "sage", subclassName: "Sage" },
  { classId: "sorcerer", subclassId: "pyromancer", subclassName: "Pyromancer" },
  { classId: "sorcerer", subclassId: "stormcaller", subclassName: "Stormcaller" },
  { classId: "guardian", subclassId: "bulwark", subclassName: "Bulwark" },
  { classId: "guardian", subclassId: "sentinel", subclassName: "Sentinel" },
  { classId: "paladin", subclassId: "oathkeeper", subclassName: "Oathkeeper" },
  { classId: "paladin", subclassId: "avenger", subclassName: "Avenger" },
  { classId: "mystic", subclassId: "seer", subclassName: "Seer" },
  { classId: "mystic", subclassId: "telekinetic", subclassName: "Telekinetic" },
];

function formatEnemyType(enemyType) {
  return String(enemyType)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
}

function pluralizeEnemyType(enemyType, count) {
  const label = formatEnemyType(enemyType);
  if (count === 1) return label;
  return label.endsWith("s") ? label : `${label}s`;
}

function joinMemorialList(parts) {
  if (!parts.length) return "no foes";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}

function chooseMemorialEnding() {
  return MEMORIAL_ENDINGS[Math.floor(Math.random() * MEMORIAL_ENDINGS.length)];
}

function buildGraveyardSummary(snapshot) {
  const player = snapshot.player ?? {};
  const name = player.name ?? "Unknown Adventurer";
  const level = player.level ?? 1;
  const stats = snapshot.progress?.killStats ?? {};
  const fragments = Object.entries(stats)
    .filter(([, count]) => count > 0)
    .map(([enemyType, count]) => `${count} ${pluralizeEnemyType(enemyType, count)}`);
  const killsText = joinMemorialList(fragments);
  return `${name} made it to level ${level}, killed ${killsText}. ${chooseMemorialEnding()}`;
}

function calculateTestMaxHp(stats, level) {
  return 20 + stats.body * 3 + level * 3 + Math.floor(level / 5);
}

function calculateTestMaxMana(stats, level) {
  return 5 + stats.soul + Math.floor(level / 3);
}

function calculateTestMaxStamina(stats, level) {
  return 5 + stats.body + Math.floor(level / 3);
}

function getOrRepairTestUser(username, password) {
  const timestamp = nowIso();
  const existing = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (existing) {
    db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").run(hashPassword(password), timestamp, existing.id);
    return publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(existing.id));
  }

  const id = makeId();
  db.prepare(
    "INSERT INTO users (id, username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
  ).run(id, username, hashPassword(password), timestamp, timestamp);
  return publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id));
}

function createTestInventory(classId) {
  const gear = TEST_CLASS_GEAR[classId] ?? TEST_CLASS_GEAR.warrior;
  const weaponIds = classId === "warrior"
    ? ["sword", "axe", "bow", "staff", "dagger", "unarmed"]
    : classId === "rogue"
      ? ["sword", "bow", "dagger", "unarmed"]
      : ["sword", "staff", "dagger", "unarmed", "wand"];
  return {
    weapons: [...new Set([gear.weapon, ...weaponIds])],
    armor: [...new Set([gear.armor, "none", "light", "medium", "heavy"])],
    consumables: {
      minorHealthPotion: 10,
      majorHealthPotion: 10,
      advancedHealthPotion: 10,
      magicalHealthPotion: 10,
      minorManaPotion: 10,
      majorManaPotion: 10,
      advancedManaPotion: 10,
      magicalManaPotion: 10,
      minorStaminaPotion: 10,
      majorStaminaPotion: 10,
      advancedStaminaPotion: 10,
      magicalStaminaPotion: 10,
      bandage: 10,
      warmingSalve: 10,
      antitoxin: 10,
      soothingBalm: 10,
      smellingSalts: 10,
    },
    currency: { copper: 9, silver: 9, gold: 99 },
  };
}

function getTestCharacterName(rosterEntry) {
  const className = TEST_CLASS_NAMES[rosterEntry.classId] ?? rosterEntry.classId;
  return `Test ${className} ${rosterEntry.subclassName}`;
}

function buildTestSnapshot(rosterEntry) {
  const { classId, subclassId, subclassName } = rosterEntry;
  const className = TEST_CLASS_NAMES[classId] ?? classId;
  const name = getTestCharacterName(rosterEntry);
  const maxHp = calculateTestMaxHp(TEST_STATS, TEST_LEVEL);
  const maxMana = calculateTestMaxMana(TEST_STATS, TEST_LEVEL);
  const maxStamina = calculateTestMaxStamina(TEST_STATS, TEST_LEVEL);
  const gear = TEST_CLASS_GEAR[classId] ?? TEST_CLASS_GEAR.warrior;
  const features = TEST_FEATURES[classId] ?? { core: [] };

  return {
    gameState: "between_battles",
    builderSelectedClassId: classId,
    builderGender: "female",
    player: {
      id: "player",
      name,
      description: `Development test character for ${className} / ${subclassName}.`,
      gender: "female",
      level: TEST_LEVEL,
      xp: TEST_XP,
      maxHp,
      hp: maxHp,
      maxMana,
      mana: maxMana,
      maxStamina,
      stamina: maxStamina,
      stats: { ...TEST_STATS },
      classDef: { id: classId, name: className },
      subclassId,
      unlockedSkills: TEST_SKILLS[classId] ?? [],
      upgradedSkills: TEST_UPGRADES[classId] ?? [],
      unlockedFeatures: [...new Set([...(features.core ?? []), ...(features[subclassId] ?? [])])],
      weapon: TEST_WEAPONS[gear.weapon] ?? TEST_WEAPONS.sword,
      spell: null,
      armor: TEST_ARMORS[gear.armor] ?? TEST_ARMORS.none,
      acBonus: 0,
      resistances: [],
      weaknesses: [],
      statuses: [],
      inventory: createTestInventory(classId),
      hasAttacked: false,
      nextRollBonus: 0,
      selectedSkillId: null,
      skillCooldowns: {},
    },
    enemy: null,
    initiative: [],
    turnIndex: 0,
    actionUsed: false,
    majorActionUsed: false,
    minorActionsUsed: 0,
    turnStarted: false,
    round: 1,
    isResolvingEnemyTurn: false,
    winnerId: null,
    pendingLevelUps: 0,
    pendingLevelQueue: [],
    combatEnded: false,
    sneakAttackUsed: false,
    deathsOpeningUsed: false,
    assassinateUsed: false,
    quickReadUsedThisTurn: false,
    killersRhythmUsedThisTurn: false,
    shadowFlurryChecked: false,
    shadowFlurryUsed: false,
    evasionUsed: false,
    ghostStepUsed: false,
    deathmarkUsed: false,
    deathmarkTargetId: null,
    deathmarkActive: false,
    perfectExecutionUsed: false,
    perfectExecutionActive: false,
    arcaneInsightUsed: false,
    mindOverMatterUsed: false,
    doubleCastUsed: false,
    spellEchoUsed: false,
    arcaneSurgeUsed: false,
    arcaneSurgeActive: false,
    dualElementsUsed: false,
    dualElementsActive: false,
    overchannelUsed: false,
    overchannelActive: false,
    cataclysmUsed: false,
    cataclysmActive: false,
    masterOfMagicUsed: false,
    masterOfMagicActive: false,
    firestormUsed: false,
    firestormActive: false,
    worldfireUsed: false,
    worldfireActive: false,
    overloadUsed: false,
    overloadActive: false,
    arcaneCataclysmUsed: false,
    arcaneCataclysmActive: false,
    wildCastingUsedThisTurn: false,
    perfectFocusUsed: false,
    perfectFocusActive: false,
    bloodlustStacks: 0,
    lastRewards: [],
    lastProgressionResults: [],
    progress: {
      battlesFought: 0,
      victories: 0,
      killStats: {},
      xpEarned: 0,
      currencyEarned: { copper: 0, silver: 0, gold: 0 },
    },
  };
}

function pruneNonRosterTestAdventures(userId) {
  const rosterNames = TEST_ROSTER.map(getTestCharacterName);
  const placeholders = rosterNames.map(() => "?").join(", ");
  db.prepare(`DELETE FROM adventures WHERE user_id = ? AND name NOT IN (${placeholders})`).run(userId, ...rosterNames);
}

function upsertSeedAdventure(userId, snapshot, timestamp) {
  const summary = summarizeAdventure(snapshot);
  const existingRows = db
    .prepare("SELECT * FROM adventures WHERE user_id = ? AND name = ? ORDER BY created_at ASC")
    .all(userId, summary.name);
  const stateJson = JSON.stringify(snapshot);

  if (existingRows.length) {
    const keep = existingRows[0];
    db.prepare(
      "UPDATE adventures SET description = ?, class_id = ?, level = ?, state_json = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    ).run(summary.description, summary.classId, summary.level, stateJson, timestamp, keep.id, userId);

    existingRows.slice(1).forEach((duplicate) => {
      db.prepare("DELETE FROM adventures WHERE id = ? AND user_id = ?").run(duplicate.id, userId);
    });
    return getAdventure(userId, keep.id);
  }

  const id = makeId();
  db.prepare(
    "INSERT INTO adventures (id, user_id, name, description, class_id, level, state_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, userId, summary.name, summary.description, summary.classId, summary.level, stateJson, timestamp, timestamp);
  return getAdventure(userId, id);
}

function seedTestProfile() {
  const user = getOrRepairTestUser(TEST_PROFILE.username, TEST_PROFILE.password);
  pruneNonRosterTestAdventures(user.id);
  const baseTime = Date.now();
  const characters = TEST_ROSTER.map((rosterEntry, index) => {
    const snapshot = buildTestSnapshot(rosterEntry);
    const timestamp = new Date(baseTime + index * 1000).toISOString();
    const adventure = upsertSeedAdventure(user.id, snapshot, timestamp);
    return {
      id: adventure.id,
      name: adventure.name,
      classId: rosterEntry.classId,
      subclassId: rosterEntry.subclassId,
      level: adventure.level,
    };
  });

  return {
    username: user.username,
    userId: user.id,
    characters,
  };
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
  const adventure = getAdventure(userId, adventureId);
  if (!adventure) {
    return { alreadyHandled: true };
  }
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
  return { alreadyHandled: false };
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
  seedTestProfile,
  authenticateUser,
  normalizeCurrency,
};
