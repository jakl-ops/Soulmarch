const STAT_LIMIT = 10;
const MIN_STAT = 1;
const MAX_STAT = 10;
const BASE_AC = 10;
const BANDAGE_PRICE = { copper: 5, silver: 0, gold: 0 };
const WARMING_SALVE_PRICE = { copper: 8, silver: 0, gold: 0 };
const ANTITOXIN_PRICE = { copper: 0, silver: 1, gold: 0 };
const SOOTHING_BALM_PRICE = { copper: 8, silver: 0, gold: 0 };
const SMELLING_SALTS_PRICE = { copper: 0, silver: 1, gold: 0 };
const INN_PRICE = { copper: 0, silver: 3, gold: 0 };
const XP_THRESHOLDS = [0, 150, 400, 900, 1800, 3200, 5000, 7500, 10500, 14000];
// The run now moves through explicit phases so combat, rewards, item use, and defeat do not fight each other.
const GAME_STATES = {
  characterCreation: "character_creation",
  inCombat: "in_combat",
  victory: "victory",
  betweenBattles: "between_battles",
  defeat: "defeat",
};

const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "non-binary", label: "Non-binary" },
  { id: "undisclosed", label: "Undisclosed" },
];

const ADVENTURE_BACKGROUNDS = Array.from({ length: 9 }, (_, index) =>
  `assets/backgrounds/adventure/adventure-${String(index + 1).padStart(3, "0")}.jpg`
);

const INN_BACKGROUNDS = Array.from({ length: 4 }, (_, index) =>
  `assets/backgrounds/inn/inn-${String(index + 1).padStart(3, "0")}.jpg`
);

const ENEMY_PORTRAITS = {
  goblin: { icon: "◣", accent: "#6ec46a", bg: "radial-gradient(circle at 35% 30%, rgba(110, 196, 106, 0.28), rgba(19, 28, 20, 0.94))" },
  wolf: { icon: "◈", accent: "#91a8bd", bg: "radial-gradient(circle at 35% 30%, rgba(145, 168, 189, 0.25), rgba(18, 24, 30, 0.94))" },
  bandit: { icon: "✦", accent: "#c79767", bg: "radial-gradient(circle at 35% 30%, rgba(199, 151, 103, 0.26), rgba(31, 22, 18, 0.94))" },
  skeleton: { icon: "☠", accent: "#d8d5c8", bg: "radial-gradient(circle at 35% 30%, rgba(216, 213, 200, 0.22), rgba(24, 24, 26, 0.95))" },
  apprenticeMage: { icon: "✶", accent: "#81a7ff", bg: "radial-gradient(circle at 35% 30%, rgba(129, 167, 255, 0.28), rgba(19, 21, 34, 0.95))" },
  default: { icon: "◆", accent: "#a8b1bb", bg: "radial-gradient(circle at 35% 30%, rgba(168, 177, 187, 0.22), rgba(21, 24, 28, 0.95))" },
};

Object.assign(ENEMY_PORTRAITS, {
  goblin: { src: "assets/portraits/enemies/Goblin.png", accent: "#6ec46a", bg: "radial-gradient(circle at 35% 30%, rgba(110, 196, 106, 0.28), rgba(19, 28, 20, 0.94))" },
  wolf: { src: "assets/portraits/enemies/Wolf.png", accent: "#91a8bd", bg: "radial-gradient(circle at 35% 30%, rgba(145, 168, 189, 0.25), rgba(18, 24, 30, 0.94))" },
  bandit: { src: "assets/portraits/enemies/Bandit.png", accent: "#c79767", bg: "radial-gradient(circle at 35% 30%, rgba(199, 151, 103, 0.26), rgba(31, 22, 18, 0.94))" },
  skeleton: { src: "assets/portraits/enemies/Skeleton.png", accent: "#d8d5c8", bg: "radial-gradient(circle at 35% 30%, rgba(216, 213, 200, 0.22), rgba(24, 24, 26, 0.95))" },
  apprenticeMage: { src: "assets/portraits/enemies/Apprentice Mage.png", accent: "#81a7ff", bg: "radial-gradient(circle at 35% 30%, rgba(129, 167, 255, 0.28), rgba(19, 21, 34, 0.95))" },
  default: { icon: "?", accent: "#a8b1bb", bg: "radial-gradient(circle at 35% 30%, rgba(168, 177, 187, 0.22), rgba(21, 24, 28, 0.95))" },
});

const WEAPON_IMAGE_FALLBACK = "assets/weapons/default.png";
const weaponImages = {
  sword: "assets/weapons/sword.png",
  axe: "assets/weapons/axe.png",
  bow: "assets/weapons/bow.png",
  staff: "assets/weapons/staff.png",
  dagger: "assets/weapons/dagger.png",
  unarmed: "assets/weapons/unarmed.png",
};

const BATTLE_MUSIC_TRACKS = [
  "assets/audio/battle/ob-lix-dead-zone-action-background-music-109863.mp3",
  "assets/audio/battle/ob-lix-greenskin-warrior-war-background-music-111203.mp3",
  "assets/audio/battle/ob-lix-langhus-burning-viking-background-music-109865.mp3",
  "assets/audio/battle/ob-lix-prepare-to-die-part-3-war-background-music-113258.mp3",
  "assets/audio/battle/ob-lix-skjaldmr-norse-viking-background-music-110364.mp3",
  "assets/audio/battle/ob-lix-spaekona-viking-background-music-109374.mp3",
  "assets/audio/battle/ob-lix-the-spell-dark-magic-background-music-ob-lix-8009.mp3",
  "assets/audio/battle/ob-lix-where-the-brave-may-live-forever-viking-background-music-109867.mp3",
];

const HUB_MUSIC_TRACK = "assets/audio/hub-theme.mp3";
const INN_MUSIC_TRACK = "assets/audio/inn-theme.mp3";
const MUSIC_FADE_MS = 1600;
const MUSIC_FADE_STEP_MS = 80;
const MUSIC_VOLUMES = {
  hubMusic: 0.32,
  innMusic: 0.28,
  battleMusic: 0.3,
  battleMusicAlt: 0.3,
};

const statusDefinitions = {
  burn: {
    name: "Burn",
    duration: 3,
    tick: "end",
    damage: 2,
    damageType: "fire",
    color: "burn",
    negative: true,
    tooltip: "Takes fire damage at the end of turn.",
    removableBy: ["Soothing Balm", "Cleansing Light"],
  },
  freeze: {
    name: "Frozen",
    duration: 2,
    hitPenalty: -2,
    color: "freeze",
    negative: true,
    tooltip: "Suffers a penalty to hit and physical accuracy.",
    removableBy: ["Warming Salve", "Mental Ward", "Cleansing Light"],
  },
  poison: {
    name: "Poison",
    duration: 3,
    tick: "start",
    damage: 1,
    damageType: "physical",
    color: "poison",
    negative: true,
    tooltip: "Takes damage at the start of turn.",
    removableBy: ["Antitoxin", "Centered Breath", "Cleansing Light"],
  },
  stun: {
    name: "Stun",
    duration: 1,
    skipAction: true,
    color: "stun",
    negative: true,
    tooltip: "Loses the next action.",
    removableBy: ["Smelling Salts", "Mental Ward", "Cleansing Light"],
  },
  bleed: {
    name: "Bleed",
    duration: 3,
    tick: "afterAct",
    damage: 2,
    damageType: "physical",
    color: "bleed",
    negative: true,
    tooltip: "Takes damage after acting.",
    removableBy: ["Bandage", "Centered Breath", "Cleansing Light"],
  },
  guarded: {
    name: "Guarded",
    duration: 2,
    damageReduction: 3,
    color: "guarded",
    negative: false,
    tooltip: "Reduces incoming damage for a short time.",
    removableBy: [],
  },
  shielded: {
    name: "Shielded",
    duration: 2,
    damageReduction: 2,
    color: "shielded",
    negative: false,
    tooltip: "Blunts incoming damage with a protective ward.",
    removableBy: [],
  },
};

const consumableItems = {
  minorHealthPotion: {
    id: "minorHealthPotion",
    name: "Minor Health Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 1, gold: 0 },
    restoreType: "hp",
    restoreRange: [8, 15],
    description: "Restore 8-15 HP.",
  },
  majorHealthPotion: {
    id: "majorHealthPotion",
    name: "Major Health Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 5, gold: 0 },
    restoreType: "hp",
    restoreRange: [18, 30],
    description: "Restore 18-30 HP.",
  },
  advancedHealthPotion: {
    id: "advancedHealthPotion",
    name: "Advanced Health Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 1 },
    restoreType: "hp",
    restoreRange: [35, 55],
    description: "Restore 35-55 HP.",
  },
  magicalHealthPotion: {
    id: "magicalHealthPotion",
    name: "Magical Health Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 10 },
    restoreType: "hp",
    restoreRange: [80, 120],
    description: "Restore 80-120 HP.",
  },
  minorManaPotion: {
    id: "minorManaPotion",
    name: "Minor Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 1, gold: 0 },
    restoreType: "mana",
    restoreRange: [2, 4],
    description: "Restore 2-4 Mana.",
  },
  majorManaPotion: {
    id: "majorManaPotion",
    name: "Major Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 5, gold: 0 },
    restoreType: "mana",
    restoreRange: [5, 8],
    description: "Restore 5-8 Mana.",
  },
  advancedManaPotion: {
    id: "advancedManaPotion",
    name: "Advanced Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 1 },
    restoreType: "mana",
    restoreRange: [9, 14],
    description: "Restore 9-14 Mana.",
  },
  magicalManaPotion: {
    id: "magicalManaPotion",
    name: "Magical Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 10 },
    restoreType: "mana",
    restoreRange: [18, 25],
    description: "Restore 18-25 Mana.",
  },
  minorStaminaPotion: {
    id: "minorStaminaPotion",
    name: "Minor Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 1, gold: 0 },
    restoreType: "stamina",
    restoreRange: [2, 4],
    description: "Restore 2-4 Stamina.",
  },
  majorStaminaPotion: {
    id: "majorStaminaPotion",
    name: "Major Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 5, gold: 0 },
    restoreType: "stamina",
    restoreRange: [5, 8],
    description: "Restore 5-8 Stamina.",
  },
  advancedStaminaPotion: {
    id: "advancedStaminaPotion",
    name: "Advanced Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 1 },
    restoreType: "stamina",
    restoreRange: [9, 14],
    description: "Restore 9-14 Stamina.",
  },
  magicalStaminaPotion: {
    id: "magicalStaminaPotion",
    name: "Magical Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 10 },
    restoreType: "stamina",
    restoreRange: [18, 25],
    description: "Restore 18-25 Stamina.",
  },
  bandage: {
    id: "bandage",
    name: "Bandage",
    actionType: "minor",
    type: "remedy",
    cost: BANDAGE_PRICE,
    restoreType: null,
    restoreRange: null,
    description: "Remove Bleed.",
    removesStatuses: ["bleed"],
  },
  warmingSalve: {
    id: "warmingSalve",
    name: "Warming Salve",
    actionType: "minor",
    type: "remedy",
    cost: WARMING_SALVE_PRICE,
    restoreType: null,
    restoreRange: null,
    description: "Remove Frozen.",
    removesStatuses: ["freeze"],
  },
  antitoxin: {
    id: "antitoxin",
    name: "Antitoxin",
    actionType: "minor",
    type: "remedy",
    cost: ANTITOXIN_PRICE,
    restoreType: null,
    restoreRange: null,
    description: "Remove Poison.",
    removesStatuses: ["poison"],
  },
  soothingBalm: {
    id: "soothingBalm",
    name: "Soothing Balm",
    actionType: "minor",
    type: "remedy",
    cost: SOOTHING_BALM_PRICE,
    restoreType: null,
    restoreRange: null,
    description: "Remove Burn.",
    removesStatuses: ["burn"],
  },
  smellingSalts: {
    id: "smellingSalts",
    name: "Smelling Salts",
    actionType: "minor",
    type: "remedy",
    cost: SMELLING_SALTS_PRICE,
    restoreType: null,
    restoreRange: null,
    description: "Removes Stun.",
    removesStatuses: ["stun"],
  },
};

const currencyIcons = {
  gold: "assets/icons/coin-gold.svg",
  silver: "assets/icons/coin-silver.svg",
  copper: "assets/icons/coin-copper.svg",
};

const itemRestoreColors = {
  hp: { liquid: "#d15b5b", glow: "#ff9a8f", rim: "#d6b17a" },
  mana: { liquid: "#4f78da", glow: "#9cc2ff", rim: "#b8c6ea" },
  stamina: { liquid: "#cf9830", glow: "#ffd36d", rim: "#d9b47a" },
};

const statTooltips = {
  mind: "thinking, awareness, puzzle-solving, perception, deception, social reasoning",
  body: "weapon attacks, climbing, jumping, brute force, physical actions",
  soul: "spellcasting, magical effects, mystical power, spiritual resistance",
};

const levelUpStatDescriptions = {
  mind:
    "+1 Mind — Improves perception, deception, and mental abilities. Powers Mystic skills and increases effectiveness of Mind-based actions.",
  body:
    "+1 Body — Improves weapon attacks, survivability, and physical checks. Increases HP and boosts martial effectiveness.",
  soul:
    "+1 Soul — Improves spellcasting and magical power. Increases Mana and effectiveness of Soul-based abilities.",
};

const subclassDescriptions = {
  warrior: {
    berserker: {
      summary: "High damage warrior who sacrifices defense.",
      features: ["+2 damage", "-1 AC"],
    },
    defender: {
      summary: "Defensive specialist focused on survivability.",
      features: ["+2 AC", "-1 damage"],
    },
  },
  magician: {
    elementalist: {
      summary: "Element-focused caster with stronger elemental damage.",
      features: ["+2 elemental damage", "Empowers fire, ice, and lightning"],
    },
    sage: {
      summary: "Mystic scholar who sharpens insight and control.",
      features: ["+2 Mind checks"],
    },
  },
  monk: {
    body: {
      summary: "Martial ascetic who perfects physical mastery.",
      features: ["+2 Body checks"],
    },
    soul: {
      summary: "Spiritual ascetic who deepens inner power.",
      features: ["+2 Soul checks"],
    },
  },
  guardian: {
    bulwark: {
      summary: "Immovable wall that hardens body and armor.",
      features: ["+1 AC", "+1 Body checks"],
    },
    sentinel: {
      summary: "Watchful protector who punishes openings.",
      features: ["+1 damage", "+1 Mind checks"],
    },
  },
  rogue: {
    assassin: {
      summary: "Executioner who leans fully into burst damage.",
      features: ["+2 damage"],
    },
    scout: {
      summary: "Fast skirmisher with sharper battlefield awareness.",
      features: ["+2 initiative", "+1 Mind checks"],
    },
  },
  sorcerer: {
    pyromancer: {
      summary: "Elemental savant who burns hotter than anyone else.",
      features: ["+2 fire damage"],
    },
    oracle: {
      summary: "Foresighted caster with balanced insight and magic.",
      features: ["+1 Mind checks", "+1 Soul checks"],
    },
  },
  paladin: {
    oathkeeper: {
      summary: "Steadfast holy defender bound to sacred duty.",
      features: ["+1 AC", "+1 Soul checks"],
    },
    avenger: {
      summary: "Holy striker who channels conviction into offense.",
      features: ["+1 damage"],
    },
  },
  mystic: {
    seer: {
      summary: "Vision-bound psionic who reads intention before it lands.",
      features: ["+2 Mind checks"],
    },
    telekinetic: {
      summary: "Will-forged combatant who turns thought into force.",
      features: ["+1 AC", "+1 damage"],
    },
  },
};

const classes = {
  warrior: {
    id: "warrior",
    name: "Warrior",
    icon: "🛡️",
    shortDescription: "Durable martial veteran.",
    tooltipSummary: "+2 weapon hit, +1 AC, +1 damage reduction, +2 Body checks",
    weaponHitBonus: 2,
    spellHitBonus: 0,
    acBonus: 1,
    damageBonus: 0,
    damageReduction: 1,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 0, body: 2, soul: 0 },
    hasSpells: false,
    skillIds: ["powerStrike", "guardStance"],
    playstyle: "Martial bruiser who stays on the field and wins steady weapon trades.",
    roleTag: "Martial",
  },
  magician: {
    id: "magician",
    name: "Magician",
    icon: "🔮",
    shortDescription: "Careful arcane caster.",
    tooltipSummary: "+2 spell hit, +2 Soul checks, efficient control magic",
    weaponHitBonus: 0,
    spellHitBonus: 2,
    acBonus: 0,
    damageBonus: 0,
    damageReduction: 0,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 0, body: 0, soul: 2 },
    hasSpells: true,
    skillIds: ["fireBolt", "arcaneShield"],
    playstyle: "Reliable Soul caster with balanced offense and defensive wards.",
    roleTag: "Caster",
  },
  monk: {
    id: "monk",
    name: "Monk",
    icon: "🥋",
    shortDescription: "Mobile fighter with inner discipline.",
    tooltipSummary: "+1 weapon hit, +1 AC, +1 first attack hit, +1 Body checks, +1 Soul checks",
    weaponHitBonus: 1,
    spellHitBonus: 0,
    acBonus: 1,
    damageBonus: 0,
    damageReduction: 0,
    firstAttackHitBonus: 1,
    checkBonuses: { mind: 0, body: 1, soul: 1 },
    hasSpells: false,
    skillIds: ["flurry", "innerFocus"],
    playstyle: "Agile hybrid that mixes momentum attacks with self-buffing defense.",
    roleTag: "Hybrid",
  },
  guardian: {
    id: "guardian",
    name: "Guardian",
    icon: "🧱",
    shortDescription: "Wall-like defender built to absorb pressure.",
    tooltipSummary: "+3 AC, +1 Body checks, reduce incoming damage by 2",
    weaponHitBonus: 0,
    spellHitBonus: 0,
    acBonus: 3,
    damageBonus: 0,
    damageReduction: 2,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 0, body: 1, soul: 0 },
    hasSpells: false,
    skillIds: ["brace", "shieldSlam"],
    playstyle: "Pure tank that survives attrition and controls tempo with defense.",
    roleTag: "Tank",
  },
  rogue: {
    id: "rogue",
    name: "Rogue",
    icon: "🗡️",
    shortDescription: "Precision striker who punishes openings.",
    tooltipSummary: "+1 weapon hit, +2 Mind checks, +2 first-hit attack bonus, +1 damage",
    weaponHitBonus: 1,
    spellHitBonus: 0,
    acBonus: 0,
    damageBonus: 1,
    damageReduction: 0,
    firstAttackHitBonus: 2,
    checkBonuses: { mind: 2, body: 0, soul: 0 },
    hasSpells: false,
    skillIds: ["quickStab", "feint"],
    playstyle: "Opportunist who spikes damage when fights are short and controlled.",
    roleTag: "Martial",
  },
  sorcerer: {
    id: "sorcerer",
    name: "Sorcerer",
    icon: "⚡",
    shortDescription: "Explosive elemental caster.",
    tooltipSummary: "+3 spell hit, +1 Soul checks, +1 spell damage, -1 AC",
    weaponHitBonus: 0,
    spellHitBonus: 3,
    acBonus: -1,
    damageBonus: 1,
    damageReduction: 0,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 0, body: 0, soul: 1 },
    hasSpells: true,
    skillIds: ["sparkSurge", "frostMark"],
    playstyle: "High-damage caster that trades safety for stronger spell bursts.",
    roleTag: "Caster",
  },
  paladin: {
    id: "paladin",
    name: "Paladin",
    icon: "✨",
    shortDescription: "Holy knight with steady mixed offense.",
    tooltipSummary: "+1 weapon hit, +1 spell hit, +1 AC, +1 Soul checks, +1 damage reduction",
    weaponHitBonus: 1,
    spellHitBonus: 1,
    acBonus: 1,
    damageBonus: 0,
    damageReduction: 1,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 0, body: 0, soul: 1 },
    hasSpells: true,
    skillIds: ["smite", "blessingStrike"],
    playstyle: "Hybrid front-liner that blends durability, support, and burst turns.",
    roleTag: "Hybrid",
  },
  mystic: {
    id: "mystic",
    name: "Mystic",
    icon: "🧠",
    shortDescription: "Psionic adept who fights with pure Mind.",
    tooltipSummary: "+2 spell hit, +2 Mind checks, +1 AC, precise control skills",
    weaponHitBonus: 0,
    spellHitBonus: 2,
    acBonus: 1,
    damageBonus: 0,
    damageReduction: 0,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 2, body: 0, soul: 0 },
    hasSpells: true,
    skillIds: ["mindSpike", "thoughtLock"],
    playstyle: "Psionic controller that wins through accurate Mind-based pressure and disruption.",
    roleTag: "Psionic",
  },
};

const subclasses = {
  warrior: {
    berserker: { id: "berserker", name: "Berserker", acBonus: -1, damageBonus: 2, checkBonuses: {} },
    defender: { id: "defender", name: "Defender", acBonus: 2, damageBonus: -1, checkBonuses: {} },
  },
  magician: {
    elementalist: {
      id: "elementalist",
      name: "Elementalist",
      acBonus: 0,
      damageBonus: 2,
      damageBonusTypes: ["fire", "ice", "lightning"],
      checkBonuses: {},
    },
    sage: { id: "sage", name: "Sage", acBonus: 0, damageBonus: 0, checkBonuses: { mind: 2 } },
  },
  monk: {
    body: { id: "body", name: "Body", acBonus: 0, damageBonus: 0, checkBonuses: { body: 2 } },
    soul: { id: "soul", name: "Soul", acBonus: 0, damageBonus: 0, checkBonuses: { soul: 2 } },
  },
  guardian: {
    bulwark: { id: "bulwark", name: "Bulwark", acBonus: 1, damageBonus: 0, checkBonuses: { body: 1 } },
    sentinel: { id: "sentinel", name: "Sentinel", acBonus: 0, damageBonus: 1, checkBonuses: { mind: 1 } },
  },
  rogue: {
    assassin: { id: "assassin", name: "Assassin", acBonus: 0, damageBonus: 2, checkBonuses: {} },
    scout: { id: "scout", name: "Scout", acBonus: 0, damageBonus: 0, initiativeBonus: 2, checkBonuses: { mind: 1 } },
  },
  sorcerer: {
    pyromancer: {
      id: "pyromancer",
      name: "Pyromancer",
      acBonus: 0,
      damageBonus: 2,
      damageBonusTypes: ["fire"],
      checkBonuses: {},
    },
    oracle: { id: "oracle", name: "Oracle", acBonus: 0, damageBonus: 0, checkBonuses: { mind: 1, soul: 1 } },
  },
  paladin: {
    oathkeeper: { id: "oathkeeper", name: "Oathkeeper", acBonus: 1, damageBonus: 0, checkBonuses: { soul: 1 } },
    avenger: { id: "avenger", name: "Avenger", acBonus: 0, damageBonus: 1, checkBonuses: {} },
  },
  mystic: {
    seer: { id: "seer", name: "Seer", acBonus: 0, damageBonus: 0, checkBonuses: { mind: 2 } },
    telekinetic: { id: "telekinetic", name: "Telekinetic", acBonus: 1, damageBonus: 1, checkBonuses: {} },
  },
};

const weapons = {
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
  axe: {
    id: "axe",
    name: "Axe",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 0,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 0,
    damageType: "physical",
    special: "Crit on 19-20; 35% bleed on hit",
    critMin: 19,
    initiativeBonus: 0,
    status: { id: "bleed", chance: 0.35 },
  },
  bow: {
    id: "bow",
    name: "Bow",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 2,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 0,
    damageType: "physical",
    special: "+2 initiative; 30% freeze on hit",
    critMin: 20,
    initiativeBonus: 2,
    status: { id: "freeze", chance: 0.3 },
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
  dagger: {
    id: "dagger",
    name: "Dagger",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 2,
    damageDice: { count: 1, sides: 4 },
    damageBonus: 0,
    damageType: "physical",
    special: "Can attack twice; second attack -2",
    critMin: 20,
    extraAttackPenalty: -2,
    initiativeBonus: 0,
    status: { id: "poison", chance: 0.25 },
  },
  unarmed: {
    id: "unarmed",
    name: "Unarmed",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 0,
    damageDice: { count: 1, sides: 4 },
    damageBonus: 0,
    damageType: "physical",
    special: "Monk gets +2 hit bonus",
    critMin: 20,
    monkHitBonus: 2,
    initiativeBonus: 0,
    status: null,
  },
  flameWand: {
    id: "flameWand",
    name: "Flame Wand",
    attackKind: "spell",
    stat: "soul",
    attackBonus: 1,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "fire",
    special: "Soul attack; 50% burn on hit",
    critMin: 20,
    initiativeBonus: 0,
    status: { id: "burn", chance: 0.5 },
  },
  crudeBlade: {
    id: "crudeBlade",
    name: "Crude Blade",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 1,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "physical",
    special: "Rough enemy weapon",
    critMin: 20,
    initiativeBonus: 0,
    status: { id: "bleed", chance: 0.2 },
  },
  bite: {
    id: "bite",
    name: "Bite",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 1,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 0,
    damageType: "physical",
    special: "30% bleed on hit",
    critMin: 20,
    initiativeBonus: 1,
    status: { id: "bleed", chance: 0.3 },
  },
  rustySword: {
    id: "rustySword",
    name: "Rusty Sword",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 0,
    damageType: "physical",
    special: "Bandit weapon",
    critMin: 20,
    initiativeBonus: 0,
    status: null,
  },
  boneClaw: {
    id: "boneClaw",
    name: "Bone Claw",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 0,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "physical",
    special: "25% freeze on hit",
    critMin: 20,
    initiativeBonus: 0,
    status: { id: "freeze", chance: 0.25 },
  },
  emberBolt: {
    id: "emberBolt",
    name: "Ember Bolt",
    attackKind: "spell",
    stat: "soul",
    attackBonus: 2,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "fire",
    special: "40% burn on hit",
    critMin: 20,
    initiativeBonus: 0,
    status: { id: "burn", chance: 0.4 },
  },
};

const armors = {
  none: { id: "none", name: "No Armor", acBonus: 0, checkBonuses: {} },
  light: { id: "light", name: "Light", acBonus: 2, checkBonuses: {} },
  medium: { id: "medium", name: "Medium", acBonus: 3, checkBonuses: {} },
  heavy: { id: "heavy", name: "Heavy", acBonus: 4, checkBonuses: { mind: -1 } },
  scraps: { id: "scraps", name: "Scrap Armor", acBonus: 1, checkBonuses: {} },
  hide: { id: "hide", name: "Hide", acBonus: 1, checkBonuses: {} },
  bone: { id: "bone", name: "Bone Guard", acBonus: 2, checkBonuses: { mind: -1 } },
  robe: { id: "robe", name: "Robe", acBonus: 0, checkBonuses: {} },
};

const spells = {
  spark: {
    id: "spark",
    name: "Spark",
    mode: "standalone",
    attackKind: "spell",
    stat: "soul",
    attackBonus: 0,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 2,
    damageType: "fire",
    special: "Starter spell; 35% burn",
    critMin: 20,
    status: { id: "burn", chance: 0.35 },
  },
};

const skills = {
  powerStrike: {
    id: "powerStrike",
    name: "Power Strike",
    classId: "warrior",
    stat: "body",
    attackKind: "weapon",
    mode: "attack_modifier",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "physical",
    status: { id: "stun" },
    baseEffectChance: 12,
    effectScalingStat: "mind",
    effectChancePerStat: 3,
    maxEffectChance: 45,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "+1 hit, extra physical damage, may Stun with disciplined timing.",
  },
  guardStance: {
    id: "guardStance",
    name: "Guard Stance",
    classId: "warrior",
    stat: "body",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "guarded", chance: 1 },
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "Gain Guarded and consume your action.",
  },
  fireBolt: {
    id: "fireBolt",
    name: "Fire Bolt",
    classId: "magician",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "fire",
    status: { id: "burn" },
    baseEffectChance: 20,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 70,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Soul spell attack that ignites more reliably with sharper focus.",
  },
  arcaneShield: {
    id: "arcaneShield",
    name: "Arcane Shield",
    classId: "magician",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "Gain Shielded and consume your action.",
  },
  flurry: {
    id: "flurry",
    name: "Flurry",
    classId: "monk",
    stat: "body",
    attackKind: "weapon",
    mode: "attack_modifier",
    hitBonus: 1,
    damageDice: { count: 1, sides: 4 },
    damageBonus: 1,
    damageType: "physical",
    followUpPenalty: -2,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "A light hit plus a second strike at -2.",
  },
  innerFocus: {
    id: "innerFocus",
    name: "Centered Breath",
    classId: "monk",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    canRemoveStatuses: ["bleed", "poison"],
    statusRemovalLimit: 1,
    resourceType: "mana",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Minor action that clears Bleed or Poison from yourself.",
  },
  brace: {
    id: "brace",
    name: "Brace",
    classId: "guardian",
    stat: "body",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "guarded", chance: 1 },
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "Gain Guarded and consume your action.",
  },
  shieldSlam: {
    id: "shieldSlam",
    name: "Shield Slam",
    classId: "guardian",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "stun" },
    baseEffectChance: 10,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 50,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "Body attack that may Stun when aimed with control.",
  },
  quickStab: {
    id: "quickStab",
    name: "Quick Stab",
    classId: "rogue",
    stat: "body",
    attackKind: "weapon",
    mode: "attack_modifier",
    hitBonus: 2,
    damageDice: { count: 1, sides: 4 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "poison" },
    baseEffectChance: 15,
    effectScalingStat: "mind",
    effectChancePerStat: 3,
    maxEffectChance: 60,
    resourceType: "stamina",
    resourceCost: 1,
    cooldownTurns: 0,
    description: "+2 hit and may Poison with a precise opening.",
  },
  feint: {
    id: "feint",
    name: "Feint",
    classId: "rogue",
    stat: "mind",
    attackKind: "weapon",
    mode: "attack_modifier",
    hitBonus: 1,
    damageDice: { count: 1, sides: 4 },
    damageBonus: 0,
    damageType: "physical",
    status: { id: "freeze" },
    baseEffectChance: 18,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 58,
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 1,
    description: "Mind-based attack that lowers enemy accuracy with Freeze.",
  },
  sparkSurge: {
    id: "sparkSurge",
    name: "Spark Surge",
    classId: "sorcerer",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 12,
    effectScalingStat: "mind",
    effectChancePerStat: 3,
    maxEffectChance: 45,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Lightning spell with Stun chance.",
  },
  frostMark: {
    id: "frostMark",
    name: "Frost Mark",
    classId: "sorcerer",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "ice",
    status: { id: "freeze" },
    baseEffectChance: 22,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 72,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Ice spell that Freezes more often when cast with focus.",
  },
  smite: {
    id: "smite",
    name: "Smite",
    classId: "paladin",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 10,
    effectScalingStat: "body",
    effectChancePerStat: 3,
    maxEffectChance: 42,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Soul attack with a Stun chance empowered by martial force.",
  },
  blessingStrike: {
    id: "blessingStrike",
    name: "Blessing Strike",
    classId: "paladin",
    stat: "body",
    attackKind: "weapon",
    mode: "attack_modifier",
    hitBonus: 1,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "physical",
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: "stamina",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Weapon attack that also grants Shielded.",
  },
  mindSpike: {
    id: "mindSpike",
    name: "Mind Spike",
    classId: "mystic",
    stat: "mind",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "lightning",
    status: { id: "freeze" },
    baseEffectChance: 14,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 54,
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 1,
    description: "A precise psionic lash that strikes with Mind and may daze the target.",
  },
  thoughtLock: {
    id: "thoughtLock",
    name: "Mental Ward",
    classId: "mystic",
    stat: "mind",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    canRemoveStatuses: ["stun", "freeze"],
    statusRemovalLimit: 1,
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 2,
    description: "Minor action that clears a control effect and grants Shielded.",
  },
  hamstring: {
    id: "hamstring",
    name: "Hamstring",
    classId: "warrior",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "bleed" },
    baseEffectChance: 24,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 72,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "A brutal cut that opens the target up with Bleed.",
  },
  crushingBlow: {
    id: "crushingBlow",
    name: "Crushing Blow",
    classId: "warrior",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 2,
    damageType: "physical",
    status: { id: "stun" },
    baseEffectChance: 14,
    effectScalingStat: "soul",
    effectChancePerStat: 3,
    maxEffectChance: 46,
    resourceType: "stamina",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "A heavy hit that may Stun the target.",
  },
  iceShard: {
    id: "iceShard",
    name: "Ice Shard",
    classId: "magician",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 2,
    damageType: "ice",
    status: { id: "freeze" },
    baseEffectChance: 24,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 74,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "A focused ice spell that often Freezes.",
  },
  arcanePulse: {
    id: "arcanePulse",
    name: "Arcane Pulse",
    classId: "magician",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 10,
    effectScalingStat: "body",
    effectChancePerStat: 3,
    maxEffectChance: 42,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "A rippling burst of arcane force that may Stun.",
  },
  risingPalm: {
    id: "risingPalm",
    name: "Rising Palm",
    classId: "monk",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "stun" },
    baseEffectChance: 14,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 58,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "A snapping palm strike that can Stun.",
  },
  spiritStep: {
    id: "spiritStep",
    name: "Spirit Step",
    classId: "monk",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "guarded", chance: 1 },
    resourceType: "mana",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Move with inner calm and gain Guarded.",
  },
  ironBash: {
    id: "ironBash",
    name: "Iron Bash",
    classId: "guardian",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "stun" },
    baseEffectChance: 16,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 60,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "A shield-heavy slam that can Stun.",
  },
  bulwarkRush: {
    id: "bulwarkRush",
    name: "Bulwark Rush",
    classId: "guardian",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "physical",
    statusSelf: { id: "guarded", chance: 1 },
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "Crash forward, strike, and gain Guarded.",
  },
  poisonEdge: {
    id: "poisonEdge",
    name: "Poison Edge",
    classId: "rogue",
    stat: "body",
    attackKind: "weapon",
    mode: "attack_modifier",
    hitBonus: 1,
    damageDice: { count: 1, sides: 4 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "poison" },
    baseEffectChance: 24,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 72,
    resourceType: "stamina",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Coat the next strike in a stronger poison.",
  },
  shadowThrow: {
    id: "shadowThrow",
    name: "Shadow Throw",
    classId: "rogue",
    stat: "mind",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 2,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "poison" },
    baseEffectChance: 16,
    effectScalingStat: "soul",
    effectChancePerStat: 3,
    maxEffectChance: 52,
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 1,
    description: "A deceptive throw guided by guile and timing.",
  },
  arcSurge: {
    id: "arcSurge",
    name: "Arc Surge",
    classId: "sorcerer",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 1,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 12,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 56,
    resourceType: "mana",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "An unstable lightning burst with stronger impact.",
  },
  cinderBurst: {
    id: "cinderBurst",
    name: "Cinder Burst",
    classId: "sorcerer",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "fire",
    status: { id: "burn" },
    baseEffectChance: 28,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 78,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Exploding fire that heavily pressures with Burn.",
  },
  radiantWard: {
    id: "radiantWard",
    name: "Cleansing Light",
    classId: "paladin",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    canRemoveStatuses: "negative",
    statusRemovalLimit: 1,
    resourceType: "mana",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Minor action that removes one negative status from yourself.",
  },
  sanctifiedBlade: {
    id: "sanctifiedBlade",
    name: "Sanctified Blade",
    classId: "paladin",
    stat: "body",
    attackKind: "weapon",
    mode: "attack_modifier",
    hitBonus: 2,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 2,
    damageType: "lightning",
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Bless the next strike with radiant force and protection.",
  },
  psychicVeil: {
    id: "psychicVeil",
    name: "Psychic Veil",
    classId: "mystic",
    stat: "mind",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 1,
    description: "Raise a psionic veil to blunt incoming harm.",
  },
  mindLance: {
    id: "mindLance",
    name: "Mind Lance",
    classId: "mystic",
    stat: "mind",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 1,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 12,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 56,
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 1,
    description: "Drive a sharpened psionic spear through the enemy's guard.",
  },
};

const skillUpgrades = {
  powerStrikeMastery: {
    id: "powerStrikeMastery",
    targetSkillId: "powerStrike",
    name: "Power Strike+",
    summary: "Power Strike hits harder and no longer waits on a cooldown.",
    changes: { name: "Power Strike+", damageBonus: 4, cooldownTurns: 0, description: "A mastered strike with heavier damage and no cooldown." },
  },
  guardStanceMastery: {
    id: "guardStanceMastery",
    targetSkillId: "guardStance",
    name: "Guard Stance+",
    summary: "Guard Stance becomes cheaper and returns faster.",
    changes: { name: "Guard Stance+", resourceCost: 1, cooldownTurns: 1, description: "Gain Guarded with less strain and less downtime." },
  },
  fireBoltMastery: {
    id: "fireBoltMastery",
    targetSkillId: "fireBolt",
    name: "Fire Bolt+",
    summary: "Fire Bolt gains more damage and loses its cooldown.",
    changes: { name: "Fire Bolt+", damageDice: { count: 1, sides: 10 }, damageBonus: 2, cooldownTurns: 0, description: "A hotter fire bolt that can be cast every turn." },
  },
  arcaneShieldMastery: {
    id: "arcaneShieldMastery",
    targetSkillId: "arcaneShield",
    name: "Arcane Shield+",
    summary: "Arcane Shield costs less and recovers faster.",
    changes: { name: "Arcane Shield+", resourceCost: 1, cooldownTurns: 1, description: "A refined ward with lower mana strain." },
  },
  flurryMastery: {
    id: "flurryMastery",
    targetSkillId: "flurry",
    name: "Flurry+",
    summary: "Flurry lands more reliably and keeps its rhythm.",
    changes: { name: "Flurry+", hitBonus: 2, damageBonus: 2, cooldownTurns: 0, followUpPenalty: -1, description: "A faster flurry with stronger follow-up pressure." },
  },
  innerFocusMastery: {
    id: "innerFocusMastery",
    targetSkillId: "innerFocus",
    name: "Inner Focus+",
    summary: "Inner Focus becomes nearly effortless.",
    changes: { name: "Inner Focus+", resourceCost: 0, cooldownTurns: 0, description: "Center yourself without spending mana." },
  },
  braceMastery: {
    id: "braceMastery",
    targetSkillId: "brace",
    name: "Brace+",
    summary: "Brace costs less and comes back sooner.",
    changes: { name: "Brace+", resourceCost: 1, cooldownTurns: 1, description: "A seasoned brace that is easier to maintain." },
  },
  shieldSlamMastery: {
    id: "shieldSlamMastery",
    targetSkillId: "shieldSlam",
    name: "Shield Slam+",
    summary: "Shield Slam hits harder with a better stun window.",
    changes: {
      name: "Shield Slam+",
      damageBonus: 3,
      cooldownTurns: 1,
      baseEffectChance: 20,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 62,
      description: "A crushing slam with stronger stun pressure.",
    },
  },
  quickStabMastery: {
    id: "quickStabMastery",
    targetSkillId: "quickStab",
    name: "Quick Stab+",
    summary: "Quick Stab draws more blood without waiting on cooldown.",
    changes: {
      name: "Quick Stab+",
      damageBonus: 2,
      cooldownTurns: 0,
      baseEffectChance: 24,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 72,
      description: "A faster, nastier stab with stronger poison.",
    },
  },
  feintMastery: {
    id: "feintMastery",
    targetSkillId: "feint",
    name: "Feint+",
    summary: "Feint becomes more accurate and sharper on the hit.",
    changes: {
      name: "Feint+",
      hitBonus: 2,
      damageBonus: 1,
      cooldownTurns: 0,
      baseEffectChance: 28,
      effectScalingStat: "soul",
      effectChancePerStat: 4,
      maxEffectChance: 68,
      description: "A perfected feint that bites harder and hinders more.",
    },
  },
  sparkSurgeMastery: {
    id: "sparkSurgeMastery",
    targetSkillId: "sparkSurge",
    name: "Spark Surge+",
    summary: "Spark Surge gains more damage and no cooldown.",
    changes: {
      name: "Spark Surge+",
      damageBonus: 4,
      cooldownTurns: 0,
      baseEffectChance: 18,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 58,
      description: "A surging spell that crackles every turn.",
    },
  },
  frostMarkMastery: {
    id: "frostMarkMastery",
    targetSkillId: "frostMark",
    name: "Frost Mark+",
    summary: "Frost Mark deepens its chill and refreshes faster.",
    changes: {
      name: "Frost Mark+",
      damageBonus: 2,
      cooldownTurns: 0,
      baseEffectChance: 30,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 80,
      description: "A stronger curse of winter with no cooldown.",
    },
  },
  smiteMastery: {
    id: "smiteMastery",
    targetSkillId: "smite",
    name: "Smite+",
    summary: "Smite strikes brighter and more often.",
    changes: {
      name: "Smite+",
      damageBonus: 3,
      cooldownTurns: 0,
      baseEffectChance: 18,
      effectScalingStat: "body",
      effectChancePerStat: 3,
      maxEffectChance: 48,
      description: "A radiant strike that returns every turn.",
    },
  },
  blessingStrikeMastery: {
    id: "blessingStrikeMastery",
    targetSkillId: "blessingStrike",
    name: "Blessing Strike+",
    summary: "Blessing Strike gains more force and no cooldown.",
    changes: { name: "Blessing Strike+", damageBonus: 2, cooldownTurns: 0, description: "A stronger blessed attack that also refreshes instantly." },
  },
  mindSpikeMastery: {
    id: "mindSpikeMastery",
    targetSkillId: "mindSpike",
    name: "Mind Spike+",
    summary: "Mind Spike pierces deeper and can be used every turn.",
    changes: {
      name: "Mind Spike+",
      damageBonus: 3,
      cooldownTurns: 0,
      baseEffectChance: 20,
      effectScalingStat: "soul",
      effectChancePerStat: 4,
      maxEffectChance: 60,
      description: "A perfected psionic lash that refreshes instantly.",
    },
  },
  thoughtLockMastery: {
    id: "thoughtLockMastery",
    targetSkillId: "thoughtLock",
    name: "Thought Lock+",
    summary: "Thought Lock becomes easier to sustain.",
    changes: { name: "Thought Lock+", cooldownTurns: 1, description: "A stronger mental ward that recovers faster." },
  },
};

const classSkillTrees = {
  warrior: { id: "warrior", name: "Warrior", levels: { 1: { skills: ["powerStrike", "guardStance"] }, 2: { skills: ["hamstring"] }, 3: { subclass: true }, 4: { upgrades: ["powerStrikeMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["crushingBlow"], upgrades: ["guardStanceMastery"] } } } },
  magician: { id: "magician", name: "Magician", levels: { 1: { skills: ["fireBolt", "arcaneShield"] }, 2: { skills: ["iceShard"] }, 3: { subclass: true }, 4: { upgrades: ["fireBoltMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["arcanePulse"], upgrades: ["arcaneShieldMastery"] } } } },
  monk: { id: "monk", name: "Monk", levels: { 1: { skills: ["flurry", "innerFocus"] }, 2: { skills: ["risingPalm"] }, 3: { subclass: true }, 4: { upgrades: ["flurryMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["spiritStep"], upgrades: ["innerFocusMastery"] } } } },
  guardian: { id: "guardian", name: "Guardian", levels: { 1: { skills: ["brace", "shieldSlam"] }, 2: { skills: ["ironBash"] }, 3: { subclass: true }, 4: { upgrades: ["braceMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["bulwarkRush"], upgrades: ["shieldSlamMastery"] } } } },
  rogue: { id: "rogue", name: "Rogue", levels: { 1: { skills: ["quickStab", "feint"] }, 2: { skills: ["poisonEdge"] }, 3: { subclass: true }, 4: { upgrades: ["quickStabMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["shadowThrow"], upgrades: ["feintMastery"] } } } },
  sorcerer: { id: "sorcerer", name: "Sorcerer", levels: { 1: { skills: ["sparkSurge", "frostMark"] }, 2: { skills: ["arcSurge"] }, 3: { subclass: true }, 4: { upgrades: ["sparkSurgeMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["cinderBurst"], upgrades: ["frostMarkMastery"] } } } },
  paladin: { id: "paladin", name: "Paladin", levels: { 1: { skills: ["smite", "blessingStrike"] }, 2: { skills: ["radiantWard"] }, 3: { subclass: true }, 4: { upgrades: ["smiteMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["sanctifiedBlade"], upgrades: ["blessingStrikeMastery"] } } } },
  mystic: { id: "mystic", name: "Mystic", levels: { 1: { skills: ["mindSpike", "thoughtLock"] }, 2: { skills: ["psychicVeil"] }, 3: { subclass: true }, 4: { upgrades: ["mindSpikeMastery"] }, 5: { choice: { type: "skill_or_upgrade", skills: ["mindLance"], upgrades: ["thoughtLockMastery"] } } } },
};

const enemyTemplates = {
  goblin: {
    id: "goblin",
    name: "Goblin",
    stats: { mind: 2, body: 4, soul: 1 },
    baseHp: 14,
    armorId: "scraps",
    weaponId: "crudeBlade",
    acBonus: 1,
    resistances: ["ice"],
    weaknesses: ["fire"],
    loot: { xp: 80, copper: [6, 12], silver: [1, 3], gold: [0, 0], weaponChance: 0.15, weaponIds: ["dagger"] },
  },
  wolf: {
    id: "wolf",
    name: "Wolf",
    stats: { mind: 1, body: 5, soul: 1 },
    baseHp: 16,
    armorId: "hide",
    weaponId: "bite",
    acBonus: 1,
    resistances: [],
    weaknesses: ["fire"],
    loot: { xp: 75, copper: [4, 10], silver: [1, 2], gold: [0, 0], weaponChance: 0.05, weaponIds: ["unarmed"] },
  },
  bandit: {
    id: "bandit",
    name: "Bandit",
    stats: { mind: 3, body: 4, soul: 1 },
    baseHp: 20,
    armorId: "light",
    weaponId: "rustySword",
    acBonus: 1,
    resistances: [],
    weaknesses: [],
    loot: { xp: 100, copper: [8, 16], silver: [2, 5], gold: [0, 1], weaponChance: 0.25, weaponIds: ["sword", "dagger", "bow"] },
  },
  skeleton: {
    id: "skeleton",
    name: "Skeleton",
    stats: { mind: 1, body: 3, soul: 2 },
    baseHp: 18,
    armorId: "bone",
    weaponId: "boneClaw",
    acBonus: 1,
    resistances: ["ice", "poison"],
    weaknesses: ["lightning"],
    loot: { xp: 110, copper: [2, 8], silver: [2, 4], gold: [0, 1], weaponChance: 0.18, weaponIds: ["axe"] },
  },
  apprenticeMage: {
    id: "apprenticeMage",
    name: "Apprentice Mage",
    stats: { mind: 4, body: 2, soul: 5 },
    baseHp: 17,
    armorId: "robe",
    weaponId: "emberBolt",
    acBonus: 1,
    resistances: ["fire"],
    weaknesses: ["physical"],
    loot: { xp: 130, copper: [4, 10], silver: [3, 6], gold: [0, 2], weaponChance: 0.3, weaponIds: ["staff", "flameWand"] },
  },
};

const elements = {
  hubMusic: document.querySelector("#hubMusic"),
  innMusic: document.querySelector("#innMusic"),
  battleMusic: document.querySelector("#battleMusic"),
  battleMusicAlt: document.querySelector("#battleMusicAlt"),
  authScreen: document.querySelector("#authScreen"),
  hubScreen: document.querySelector("#hubScreen"),
  graveyardScreen: document.querySelector("#graveyardScreen"),
  builderScreen: document.querySelector("#builderScreen"),
  combatScreen: document.querySelector("#combatScreen"),
  levelUpScreen: document.querySelector("#levelUpScreen"),
  authUsername: document.querySelector("#authUsername"),
  authPassword: document.querySelector("#authPassword"),
  authText: document.querySelector("#authText"),
  loginButton: document.querySelector("#loginButton"),
  signupButton: document.querySelector("#signupButton"),
  hubUserText: document.querySelector("#hubUserText"),
  hubValidationText: document.querySelector("#hubValidationText"),
  adventureSlots: document.querySelector("#adventureSlots"),
  graveyardButton: document.querySelector("#graveyardButton"),
  logoutButton: document.querySelector("#logoutButton"),
  graveyardList: document.querySelector("#graveyardList"),
  backToHubButton: document.querySelector("#backToHubButton"),
  nameInput: document.querySelector("#nameInput"),
  descriptionInput: document.querySelector("#descriptionInput"),
  genderPills: document.querySelector("#genderPills"),
  mindInput: document.querySelector("#mindInput"),
  bodyInput: document.querySelector("#bodyInput"),
  soulInput: document.querySelector("#soulInput"),
  mindValue: document.querySelector("#mindValue"),
  bodyValue: document.querySelector("#bodyValue"),
  soulValue: document.querySelector("#soulValue"),
  totalSpent: document.querySelector("#totalSpent"),
  totalRemaining: document.querySelector("#totalRemaining"),
  weaponSelect: document.querySelector("#weaponSelect"),
  armorSelect: document.querySelector("#armorSelect"),
  builderAc: document.querySelector("#builderAc"),
  builderWeaponAttack: document.querySelector("#builderWeaponAttack"),
  builderWeaponDamage: document.querySelector("#builderWeaponDamage"),
  builderWeaponSpecial: document.querySelector("#builderWeaponSpecial"),
  builderWeaponPreview: document.querySelector("#builderWeaponPreview"),
  builderHp: document.querySelector("#builderHp"),
  classPills: document.querySelector("#classPills"),
  builderSummaryName: document.querySelector("#builderSummaryName"),
  builderSummaryDescription: document.querySelector("#builderSummaryDescription"),
  builderSummaryGender: document.querySelector("#builderSummaryGender"),
  builderSummaryClass: document.querySelector("#builderSummaryClass"),
  builderSummaryStats: document.querySelector("#builderSummaryStats"),
  builderSummaryWeapon: document.querySelector("#builderSummaryWeapon"),
  builderSummaryArmor: document.querySelector("#builderSummaryArmor"),
  builderSummarySkills: document.querySelector("#builderSummarySkills"),
  classInfoPanel: document.querySelector("#classInfoPanel"),
  validationText: document.querySelector("#validationText"),
  startButton: document.querySelector("#startButton"),
  levelUpText: document.querySelector("#levelUpText"),
  levelProgressionInfo: document.querySelector("#levelProgressionInfo"),
  levelStatPills: document.querySelector("#levelStatPills"),
  subclassSection: document.querySelector("#subclassSection"),
  subclassPills: document.querySelector("#subclassPills"),
  progressionChoiceSection: document.querySelector("#progressionChoiceSection"),
  progressionChoicePills: document.querySelector("#progressionChoicePills"),
  levelValidationText: document.querySelector("#levelValidationText"),
  applyLevelButton: document.querySelector("#applyLevelButton"),
  playerNameHeading: document.querySelector("#playerNameHeading"),
  playerHpBar: document.querySelector("#playerHpBar"),
  playerManaBar: document.querySelector("#playerManaBar"),
  playerStaminaBar: document.querySelector("#playerStaminaBar"),
  playerLevelXp: document.querySelector("#playerLevelXp"),
  saveStatus: document.querySelector("#saveStatus"),
  playerGenderLine: document.querySelector("#playerGenderLine"),
  playerStats: document.querySelector("#playerStats"),
  playerGender: document.querySelector("#playerGender"),
  playerClass: document.querySelector("#playerClass"),
  playerSubclass: document.querySelector("#playerSubclass"),
  playerWealth: document.querySelector("#playerWealth"),
  playerWeapon: document.querySelector("#playerWeapon"),
  playerArmor: document.querySelector("#playerArmor"),
  playerTraits: document.querySelector("#playerTraits"),
  playerStatuses: document.querySelector("#playerStatuses"),
  playerAc: document.querySelector("#playerAc"),
  playerAttack: document.querySelector("#playerAttack"),
  playerAttackFormula: document.querySelector("#playerAttackFormula"),
  playerSpell: document.querySelector("#playerSpell"),
  playerDamage: document.querySelector("#playerDamage"),
  playerCooldowns: document.querySelector("#playerCooldowns"),
  playerDerived: document.querySelector("#playerDerived"),
  enemyNameHeading: document.querySelector("#enemyNameHeading"),
  enemyPortrait: document.querySelector("#enemyPortrait"),
  enemyHpBar: document.querySelector("#enemyHpBar"),
  enemyTypeLevel: document.querySelector("#enemyTypeLevel"),
  enemyStats: document.querySelector("#enemyStats"),
  enemyWeapon: document.querySelector("#enemyWeapon"),
  enemyTraits: document.querySelector("#enemyTraits"),
  enemyStatuses: document.querySelector("#enemyStatuses"),
  enemyAc: document.querySelector("#enemyAc"),
  enemyAttack: document.querySelector("#enemyAttack"),
  enemyDamage: document.querySelector("#enemyDamage"),
  playerCard: document.querySelector("#playerCard"),
  enemyCard: document.querySelector("#enemyCard"),
  combatLayout: document.querySelector("#combatLayout"),
  initiativeList: document.querySelector("#initiativeList"),
  turnText: document.querySelector("#turnText"),
  actionText: document.querySelector("#actionText"),
  majorActionStatus: document.querySelector("#majorActionStatus"),
  minorActionStatus: document.querySelector("#minorActionStatus"),
  attackButton: document.querySelector("#attackButton"),
  majorSkillButton: document.querySelector("#majorSkillButton"),
  minorSkillButton: document.querySelector("#minorSkillButton"),
  clearSkillButton: document.querySelector("#clearSkillButton"),
  endTurnButton: document.querySelector("#endTurnButton"),
  nextEncounterButton: document.querySelector("#nextEncounterButton"),
  inventoryList: document.querySelector("#inventoryList"),
  shopCurrency: document.querySelector("#shopCurrency"),
  shopList: document.querySelector("#shopList"),
  innButton: document.querySelector("#innButton"),
  diceLogPanel: document.querySelector("#diceLogPanel"),
  resultsList: document.querySelector("#resultsList"),
  rewardModal: document.querySelector("#rewardModal"),
  rewardContinueButton: document.querySelector("#rewardContinueButton"),
  progressionModal: document.querySelector("#progressionModal"),
  progressionResultsList: document.querySelector("#progressionResultsList"),
  progressionContinueButton: document.querySelector("#progressionContinueButton"),
  infoModal: document.querySelector("#infoModal"),
  infoTitle: document.querySelector("#infoTitle"),
  infoBody: document.querySelector("#infoBody"),
  infoCloseButton: document.querySelector("#infoCloseButton"),
  skillsList: document.querySelector("#skillsList"),
  skillInfoPanel: document.querySelector("#skillInfoPanel"),
  selectedSkillText: document.querySelector("#selectedSkillText"),
  codexList: document.querySelector("#codexList"),
  codexButton: document.querySelector("#codexButton"),
  codexModal: document.querySelector("#codexModal"),
  codexCloseButton: document.querySelector("#codexCloseButton"),
  resetButton: document.querySelector("#resetButton"),
  diceLog: document.querySelector("#diceLog"),
};

function resumeScreenMusicFromInteraction() {
  syncScreenMusic();
}

function getNextBattleMusicTrack() {
  if (!state.battleMusicDeck.length) {
    state.battleMusicDeck = shuffleArray(BATTLE_MUSIC_TRACKS);
  }
  return state.battleMusicDeck.shift() ?? BATTLE_MUSIC_TRACKS[0];
}

function getMusicElement(key) {
  return elements[key] ?? null;
}

function isBattleMusicKey(key) {
  return key === "battleMusic" || key === "battleMusicAlt";
}

function clearFade(audio) {
  if (audio?._fadeTimer) {
    window.clearInterval(audio._fadeTimer);
    audio._fadeTimer = null;
  }
}

function fadeAudioTo(audio, targetVolume, { pauseOnZero = false } = {}) {
  if (!audio) return;
  clearFade(audio);
  const startVolume = Number(audio.volume ?? 0);
  if (Math.abs(startVolume - targetVolume) < 0.01) {
    audio.volume = targetVolume;
    if (pauseOnZero && targetVolume === 0) {
      audio.pause();
    }
    return;
  }
  const steps = Math.max(1, Math.round(MUSIC_FADE_MS / MUSIC_FADE_STEP_MS));
  const stepAmount = (targetVolume - startVolume) / steps;
  let step = 0;
  audio._fadeTimer = window.setInterval(() => {
    step += 1;
    const nextVolume = step >= steps ? targetVolume : startVolume + stepAmount * step;
    audio.volume = Math.max(0, Math.min(1, nextVolume));
    if (step >= steps) {
      clearFade(audio);
      if (pauseOnZero && targetVolume === 0) {
        audio.pause();
      }
    }
  }, MUSIC_FADE_STEP_MS);
}

function configureMusicElement(audio, trackUrl, loop) {
  if (!audio || !trackUrl) return;
  if (audio.dataset.track !== trackUrl) {
    audio.src = trackUrl;
    audio.dataset.track = trackUrl;
  }
  audio.loop = loop;
}

function crossfadeToMusic(targetKey, trackUrl, { loop = true } = {}) {
  const target = getMusicElement(targetKey);
  if (!target || !trackUrl) return;
  const sameTarget = state.activeMusicKey === targetKey && target.dataset.track === trackUrl && !target.paused;
  if (sameTarget) {
    fadeAudioTo(target, MUSIC_VOLUMES[targetKey] ?? 0.3);
    ["hubMusic", "innMusic", "battleMusic", "battleMusicAlt"].forEach((key) => {
      if (key === targetKey) return;
      fadeAudioTo(getMusicElement(key), 0, { pauseOnZero: true });
    });
    return;
  }
  configureMusicElement(target, trackUrl, loop);
  target.volume = 0;
  const playAttempt = target.play();
  if (playAttempt?.catch) {
    playAttempt.catch(() => {});
  }
  ["hubMusic", "innMusic", "battleMusic", "battleMusicAlt"].forEach((key) => {
    const audio = getMusicElement(key);
    if (!audio) return;
    if (key === targetKey) {
      fadeAudioTo(audio, MUSIC_VOLUMES[key] ?? 0.3);
      return;
    }
    fadeAudioTo(audio, 0, { pauseOnZero: true });
  });
  state.activeMusicKey = targetKey;
}

function stopAllMusic() {
  ["hubMusic", "innMusic", "battleMusic", "battleMusicAlt"].forEach((key) => {
    fadeAudioTo(getMusicElement(key), 0, { pauseOnZero: true });
  });
  state.activeMusicKey = null;
}

function getBattlePlaybackKey(preferAlternate = false) {
  if (preferAlternate) {
    return state.activeMusicKey === "battleMusic" ? "battleMusicAlt" : "battleMusic";
  }
  if (state.activeMusicKey === "battleMusic" || state.activeMusicKey === "battleMusicAlt") {
    return state.activeMusicKey;
  }
  return "battleMusic";
}

function syncScreenMusic(screenName = getVisibleScreenName()) {
  if (screenName === "auth" || screenName === "hub" || screenName === "graveyard") {
    crossfadeToMusic("hubMusic", HUB_MUSIC_TRACK, { loop: true });
    return;
  }
  if (screenName === "combat" && state.gameState === GAME_STATES.betweenBattles) {
    crossfadeToMusic("innMusic", INN_MUSIC_TRACK, { loop: true });
    return;
  }
  if (screenName === "combat" && state.gameState === GAME_STATES.inCombat) {
    if (!state.currentBattleTrack) {
      state.currentBattleTrack = getNextBattleMusicTrack();
    }
    crossfadeToMusic(getBattlePlaybackKey(), state.currentBattleTrack, { loop: false });
    return;
  }
  stopAllMusic();
}

function getVisibleScreenName() {
  if (!elements.authScreen.hidden) return "auth";
  if (!elements.hubScreen.hidden) return "hub";
  if (!elements.graveyardScreen.hidden) return "graveyard";
  if (!elements.combatScreen.hidden) return "combat";
  return "builder";
}

const state = {
  user: null,
  currentAdventureId: null,
  activeAdventures: [],
  savePending: false,
  saveMessage: "",
  graveyardEntries: [],
  gameState: GAME_STATES.characterCreation,
  builderSelectedClassId: "warrior",
  builderGender: "undisclosed",
  player: null,
  enemy: null,
  initiative: [],
  turnIndex: 0,
  actionUsed: false,
  majorActionUsed: false,
  minorActionsUsed: 0,
  turnStarted: false,
  round: 1,
  isResolvingEnemyTurn: false,
  winner: null,
  pendingLevelUps: 0,
  pendingLevelQueue: [],
  combatEnded: false,
  lastRewards: [],
  lastProgressionResults: [],
  progress: null,
  levelUpDraft: { stat: null, subclass: null, progressionChoice: null },
  activeCodexSection: "classes",
  expandedInventoryItems: new Set(),
  expandedShopItems: new Set(),
  sceneBackgroundKind: null,
  sceneBackgroundUrl: "",
  sceneBackgroundDecks: {
    adventure: [],
    inn: [],
  },
  battleMusicDeck: [],
  currentBattleTrack: "",
  activeMusicKey: null,
};

function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function normalizePlayerIdentity(player) {
  if (!player) return;
  player.gender = GENDER_OPTIONS.find((option) => option.id === player.gender)?.id ?? "undisclosed";
}

function formatGenderLabel(genderId) {
  return GENDER_OPTIONS.find((option) => option.id === genderId)?.label ?? "Undisclosed";
}

function rollRange(range) {
  return range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
}

function signed(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function getSceneBackgroundPool(kind) {
  return kind === "inn" ? INN_BACKGROUNDS : ADVENTURE_BACKGROUNDS;
}

function drawSceneBackground(kind) {
  const pool = getSceneBackgroundPool(kind);
  if (!pool.length) return "";
  if (!state.sceneBackgroundDecks[kind]?.length) {
    state.sceneBackgroundDecks[kind] = shuffleArray(pool);
    if (pool.length > 1 && state.sceneBackgroundUrl) {
      const currentName = decodeURIComponent(state.sceneBackgroundUrl.split("/").pop() ?? "");
      if (state.sceneBackgroundDecks[kind][0]?.endsWith(currentName)) {
        state.sceneBackgroundDecks[kind].push(state.sceneBackgroundDecks[kind].shift());
      }
    }
  }
  return state.sceneBackgroundDecks[kind].shift() ?? pool[0];
}

function getEnemyPortrait(templateId) {
  return ENEMY_PORTRAITS[templateId] ?? ENEMY_PORTRAITS.default;
}

function renderEnemyPortrait(combatant) {
  if (!elements.enemyPortrait) return;
  const portrait = getEnemyPortrait(combatant?.templateId);
  elements.enemyPortrait.style.setProperty("--enemy-portrait-accent", portrait.accent);
  elements.enemyPortrait.style.setProperty("--enemy-portrait-bg", portrait.bg);
  elements.enemyPortrait.innerHTML = portrait.src
    ? `<img class="enemy-portrait-image" src="${portrait.src}" alt="" loading="eager" decoding="async">`
    : `<span class="enemy-portrait-glyph">${portrait.icon}</span>`;
  elements.enemyPortrait.setAttribute("aria-label", combatant ? `${combatant.name} portrait` : "Enemy portrait");
  elements.enemyPortrait.title = combatant ? combatant.name : "Enemy";
}

function syncSceneBackground(force = false) {
  const kind = state.gameState === GAME_STATES.betweenBattles ? "inn" : "adventure";
  if (!force && state.sceneBackgroundKind === kind && state.sceneBackgroundUrl) return;
  state.sceneBackgroundKind = kind;
  state.sceneBackgroundUrl = drawSceneBackground(kind);
}

function applySceneBackground(screenName) {
  const combatActive = screenName === "combat" && !!state.sceneBackgroundUrl;
  const hubActive = screenName === "hub";
  const graveyardActive = screenName === "graveyard";
  document.body.classList.toggle("scene-mode", combatActive || hubActive || graveyardActive);
  document.body.dataset.sceneKind = combatActive ? state.sceneBackgroundKind : hubActive ? "hub" : graveyardActive ? "graveyard" : "";
  document.body.style.backgroundImage =
    combatActive
      ? `linear-gradient(180deg, rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.72)), url("${state.sceneBackgroundUrl}")`
      : hubActive
        ? `linear-gradient(180deg, rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.72)), url("login-splash-background.jpg")`
        : graveyardActive
          ? `linear-gradient(180deg, rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.72)), url("assets/backgrounds/graveyard/graveyard-background.jpg")`
          : "";
  document.body.style.backgroundSize = "";
  document.body.style.backgroundPosition = combatActive || hubActive || graveyardActive ? "center center" : "";
  document.body.style.backgroundRepeat = combatActive || hubActive || graveyardActive ? "no-repeat" : "";
  document.body.style.backgroundAttachment = combatActive || hubActive || graveyardActive ? "fixed" : "";
  if (!elements.combatScreen) return;
  if (combatActive) {
    elements.combatScreen.classList.add("scene-screen");
    elements.combatScreen.style.setProperty("--combat-scene-background", `url("${state.sceneBackgroundUrl}")`);
  } else {
    elements.combatScreen.classList.remove("scene-screen");
    elements.combatScreen.style.removeProperty("--combat-scene-background");
  }
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function currencyToCopper(currency) {
  return (currency.gold ?? 0) * 100 + (currency.silver ?? 0) * 10 + (currency.copper ?? 0);
}

function normalizeCurrency(currency) {
  const totalCopper = Math.max(0, currencyToCopper(currency));
  return {
    gold: Math.floor(totalCopper / 100),
    silver: Math.floor((totalCopper % 100) / 10),
    copper: totalCopper % 10,
  };
}

function applyNormalizedCurrency(target, currency) {
  const normalized = normalizeCurrency(currency);
  target.gold = normalized.gold;
  target.silver = normalized.silver;
  target.copper = normalized.copper;
}

function addCurrency(inventory, reward) {
  const totalCopper = currencyToCopper(inventory.currency) + currencyToCopper(reward);
  applyNormalizedCurrency(inventory.currency, { copper: totalCopper, silver: 0, gold: 0 });
}

function canAffordCurrency(currency, cost) {
  return currencyToCopper(currency) >= currencyToCopper(cost);
}

function spendCurrency(inventory, cost) {
  if (!canAffordCurrency(inventory.currency, cost)) return false;
  const remainingCopper = currencyToCopper(inventory.currency) - currencyToCopper(cost);
  applyNormalizedCurrency(inventory.currency, { copper: remainingCopper, silver: 0, gold: 0 });
  return true;
}

function formatCurrencyCompact(currency) {
  const normalized = normalizeCurrency(currency);
  return `${normalized.gold}g ${normalized.silver}s ${normalized.copper}c`;
}

function formatCurrencyDetailed(currency) {
  const normalized = normalizeCurrency(currency);
  return `${normalized.gold} gold, ${normalized.silver} silver, ${normalized.copper} copper`;
}

function getClassIconPath(classId) {
  return `assets/icons/class-${classId}.svg`;
}

function renderClassIcon(classId, label) {
  const path = getClassIconPath(classId ?? "default");
  return `<img class="class-icon-image" src="${path}" alt="" aria-hidden="true"><span>${label}</span>`;
}

function renderCurrencyWithIcons(currency, options = {}) {
  const normalized = normalizeCurrency(currency);
  const showZero = options.showZero ?? false;
  const entries = [
    { key: "gold", value: normalized.gold, short: "g", long: "gold" },
    { key: "silver", value: normalized.silver, short: "s", long: "silver" },
    { key: "copper", value: normalized.copper, short: "c", long: "copper" },
  ].filter((entry) => showZero || entry.value > 0);
  const visibleEntries = entries.length ? entries : [{ key: "copper", value: 0, short: "c", long: "copper" }];
  const compact = options.compact ?? false;
  return `
    <span class="currency-display${compact ? " compact" : ""}">
      ${visibleEntries
        .map(
          (entry) => `
            <span class="currency-chip currency-${entry.key}">
              <img src="${currencyIcons[entry.key]}" alt="" aria-hidden="true">
              <span>${entry.value}${compact ? entry.short : ` ${entry.long}`}</span>
            </span>
          `
        )
        .join("")}
    </span>
  `;
}

function getWeaponImagePath(weaponId) {
  return weaponImages[weaponId] ?? WEAPON_IMAGE_FALLBACK;
}

function renderWeaponImage(weaponId, weaponName, options = {}) {
  const label = weaponName ?? safeEntityName(weapons, weaponId, "Weapon");
  const showName = options.showName ?? true;
  const sizeClass = options.size ? ` weapon-image-${options.size}` : "";
  return `
    <span class="weapon-inline${options.compact ? " compact" : ""}">
      <img
        class="weapon-image${sizeClass}"
        src="${getWeaponImagePath(weaponId)}"
        alt=""
        aria-hidden="true"
        onerror="this.onerror=null;this.src='${WEAPON_IMAGE_FALLBACK}'"
      >
      ${showName ? `<span>${label}</span>` : ""}
    </span>
  `;
}

function getItemTierLabel(itemId) {
  if (itemId.startsWith("minor")) return "minor";
  if (itemId.startsWith("major")) return "major";
  if (itemId.startsWith("advanced")) return "advanced";
  if (itemId.startsWith("magical")) return "magical";
  return "utility";
}

function getItemTierPalette(itemId, restoreType) {
  const base = itemRestoreColors[restoreType] ?? { liquid: "#7d8b90", glow: "#c4d0d6", rim: "#9ca7ae" };
  const tier = getItemTierLabel(itemId);
  const rimByTier = {
    minor: "#9aa1ab",
    major: "#6f95ff",
    advanced: "#f0c44e",
    magical: "#ca86ff",
    utility: base.rim,
  };
  return { ...base, rim: rimByTier[tier] ?? base.rim };
}

function renderUseGlyph() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M11 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function renderBuyGlyph() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
}

function renderPotionIcon(itemDef) {
  const palette = getItemTierPalette(itemDef.id, itemDef.restoreType);
  const rarityFill = {
    minor: "#858d98",
    major: "#5b7fda",
    advanced: "#d7a93d",
    magical: "#b56ae8",
  }[getItemTierLabel(itemDef.id)] ?? palette.rim;
  return `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M18 5h12v6l4 5c2 2 4 5 4 10 0 9-6 15-14 15S10 35 10 26c0-5 2-8 4-10l4-5V5z" fill="#14181d" stroke="${rarityFill}" stroke-width="3.2"/>
      <path d="M15 21c0-3 2-5 4-6h10c2 1 4 3 4 6v9c0 6-4 10-9 10s-9-4-9-10v-9z" fill="${palette.liquid}" opacity="0.98"/>
      <ellipse cx="24" cy="22" rx="7" ry="4" fill="${palette.glow}" opacity="0.35"/>
      <path d="M20 17c1.4-1.8 2.9-2.8 4.8-3.5" stroke="${palette.glow}" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
      <path d="M20 6h8" stroke="${rarityFill}" stroke-width="3" stroke-linecap="round"/>
      <path d="M16 20h16" stroke="${rarityFill}" stroke-width="1.8" opacity="0.8"/>
      <path d="M18 38c2 2 4 3 6 3s4-1 6-3" stroke="${rarityFill}" stroke-width="1.4" opacity="0.65" fill="none" stroke-linecap="round"/>
    </svg>
  `;
}

function renderUtilityItemIcon(itemDef) {
  const templates = {
    bandage: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="7" y="14" width="34" height="20" rx="7" fill="#1a1e22" stroke="#d7c7ad" stroke-width="2"/>
        <path d="M14 20l20 8M14 28l20-8" stroke="#8b5a5a" stroke-width="2" opacity="0.65"/>
        <circle cx="24" cy="24" r="3" fill="#d7c7ad"/>
      </svg>
    `,
    warmingSalve: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="11" y="14" width="26" height="22" rx="5" fill="#1a1e22" stroke="#77a8d9" stroke-width="2"/>
        <path d="M18 27c2-5 4-7 6-10 1 4 5 6 5 10 0 3-2 5-5 5s-6-2-6-5z" fill="#77a8d9"/>
      </svg>
    `,
    antitoxin: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M19 6h10v6l7 14c2 5-2 11-8 11h-8c-6 0-10-6-8-11l7-14V6z" fill="#1a1e22" stroke="#6fc986" stroke-width="2"/>
        <circle cx="24" cy="26" r="7" fill="#295337"/>
        <path d="M20 26h8M24 22v8" stroke="#9de2a8" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    soothingBalm: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="10" y="15" width="28" height="20" rx="5" fill="#1a1e22" stroke="#df9656" stroke-width="2"/>
        <path d="M20 29c0-4 2-6 4-9 2 3 4 5 4 9a4 4 0 0 1-8 0z" fill="#df9656"/>
      </svg>
    `,
    smellingSalts: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="12" y="13" width="24" height="22" rx="5" fill="#1a1e22" stroke="#d2caa6" stroke-width="2"/>
        <path d="M18 31c4-1 8-1 12 0M20 24c1-2 2-4 4-6 2 2 3 4 4 6" stroke="#efe4bf" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
  };
  return templates[itemDef.id] ?? renderPotionIcon(itemDef);
}

function renderItemIcon(itemDef) {
  const iconMarkup = itemDef.restoreType ? renderPotionIcon(itemDef) : renderUtilityItemIcon(itemDef);
  return `<span class="item-icon item-icon-${getItemTierLabel(itemDef.id)}">${iconMarkup}</span>`;
}

function formatItemDetails(itemDef) {
  const parts = [itemDef.description];
  if (itemDef.restoreType) {
    parts.push(`Use: Restores ${titleCase(itemDef.restoreType)}.`);
  }
  if (itemDef.removesStatuses?.length) {
    parts.push(`Removes ${itemDef.removesStatuses.map((statusId) => statusDefinitions[statusId]?.name ?? statusId).join(" or ")}.`);
  }
  parts.push(`Action: ${titleCase(itemDef.actionType)}.`);
  return parts.join(" ");
}

function toggleExpandedItem(setName, itemId) {
  const targetSet = state[setName];
  if (!targetSet) return;
  if (targetSet.has(itemId)) targetSet.delete(itemId);
  else targetSet.add(itemId);
}

function resourceLabel(resourceType) {
  return resourceType === "mana" ? "Mana" : resourceType === "stamina" ? "Stamina" : "Free";
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

function createProgress() {
  return {
    battlesFought: 0,
    victories: 0,
    killStats: {},
    xpEarned: 0,
    currencyEarned: { copper: 0, silver: 0, gold: 0 },
  };
}

function activeScreen(screenName) {
  const screens = {
    auth: elements.authScreen,
    hub: elements.hubScreen,
    graveyard: elements.graveyardScreen,
    builder: elements.builderScreen,
    combat: elements.combatScreen,
  };
  Object.entries(screens).forEach(([name, element]) => {
    element.hidden = name !== screenName;
  });
  document.body.classList.toggle("auth-mode", screenName === "auth");
  if (elements.codexButton) {
    elements.codexButton.hidden = screenName !== "combat";
  }
  applySceneBackground(screenName);
  syncScreenMusic(screenName);
}

function getInitiativeSnapshot() {
  return state.initiative.map((entry) => ({
    combatantId: entry.combatant.id,
    total: entry.total,
    die: entry.die,
    parts: entry.parts,
  }));
}

function captureSnapshot() {
  return JSON.parse(
    JSON.stringify({
      gameState: state.gameState,
      builderSelectedClassId: state.builderSelectedClassId,
      builderGender: state.builderGender,
      player: state.player,
      enemy: state.enemy,
      initiative: getInitiativeSnapshot(),
      turnIndex: state.turnIndex,
      actionUsed: state.actionUsed,
      majorActionUsed: state.majorActionUsed,
      minorActionsUsed: state.minorActionsUsed,
      turnStarted: state.turnStarted,
      round: state.round,
      isResolvingEnemyTurn: false,
      winnerId: state.winner?.id ?? null,
      pendingLevelUps: state.pendingLevelUps,
      pendingLevelQueue: state.pendingLevelQueue,
      combatEnded: state.combatEnded,
      lastRewards: state.lastRewards,
      lastProgressionResults: state.lastProgressionResults,
      progress: state.progress ?? createProgress(),
    })
  );
}

function hydrateInitiative(snapshot) {
  const combatants = { player: state.player, enemy: state.enemy };
  return (snapshot.initiative ?? []).map((entry) => ({
    combatant: combatants[entry.combatantId],
    total: entry.total,
    die: entry.die,
    parts: entry.parts,
  }));
}

function loadSnapshot(snapshot) {
  state.gameState = snapshot.gameState ?? GAME_STATES.betweenBattles;
  state.builderSelectedClassId = snapshot.builderSelectedClassId ?? snapshot.player?.classDef?.id ?? "warrior";
  state.builderGender = snapshot.builderGender ?? snapshot.player?.gender ?? "undisclosed";
  state.player = snapshot.player;
  normalizePlayerIdentity(state.player);
  normalizePlayerProgression(state.player);
  normalizePlayerInventory(state.player);
  if (state.player.inventory?.consumables?.healthPotion) {
    state.player.inventory.consumables.minorHealthPotion =
      (state.player.inventory.consumables.minorHealthPotion ?? 0) + state.player.inventory.consumables.healthPotion;
    delete state.player.inventory.consumables.healthPotion;
  }
  state.enemy = snapshot.enemy;
  state.turnIndex = snapshot.turnIndex ?? 0;
  state.actionUsed = snapshot.actionUsed ?? false;
  state.majorActionUsed = snapshot.majorActionUsed ?? (snapshot.actionUsed ?? false);
  state.minorActionsUsed = snapshot.minorActionsUsed ?? 0;
  state.turnStarted = snapshot.turnStarted ?? false;
  syncActionState();
  state.round = snapshot.round ?? 1;
  state.isResolvingEnemyTurn = false;
  state.pendingLevelUps = snapshot.pendingLevelUps ?? 0;
  state.pendingLevelQueue = snapshot.pendingLevelQueue ?? [];
  if (!state.pendingLevelQueue.length && state.pendingLevelUps > 0 && state.player) {
    const startLevel = Math.max(2, state.player.level - state.pendingLevelUps + 1);
    for (let level = startLevel; level <= state.player.level; level += 1) {
      state.pendingLevelQueue.push(level);
    }
  }
  state.combatEnded = snapshot.combatEnded ?? false;
  state.lastRewards = snapshot.lastRewards ?? [];
  state.lastProgressionResults = snapshot.lastProgressionResults ?? [];
  state.progress = snapshot.progress ?? createProgress();
  state.winner = snapshot.winnerId === "enemy" ? state.enemy : snapshot.winnerId === "player" ? state.player : null;
  state.initiative = hydrateInitiative(snapshot);
}

async function saveAdventure(reason = "autosave") {
  if (!state.user) {
    if (state.saveMessage !== "Not logged in — progress will not be saved.") {
      state.saveMessage = "Not logged in — progress will not be saved.";
      renderCombat();
    }
    return;
  }
  if (!state.currentAdventureId || !state.player) return;
  state.savePending = true;
  try {
    await apiRequest(`/api/adventures/${state.currentAdventureId}`, {
      method: "PUT",
      body: JSON.stringify({ snapshot: captureSnapshot(), reason }),
    });
    state.saveMessage = `Saved after ${reason}.`;
  } catch (error) {
    state.saveMessage = error.message;
  } finally {
    state.savePending = false;
    renderCombat();
  }
}

async function createAdventureSave() {
  if (!state.user) {
    state.saveMessage = "Not logged in — progress will not be saved.";
    return;
  }
  const result = await apiRequest("/api/adventures", {
    method: "POST",
    body: JSON.stringify({ snapshot: captureSnapshot() }),
  });
  state.currentAdventureId = result.adventure.id;
}

function classNameFromId(classId) {
  return classes[classId]?.name ?? classId;
}

function renderHub(adventures = state.activeAdventures, graveyardEntries = state.graveyardEntries) {
  elements.hubUserText.textContent = state.user ? `Signed in as ${state.user.username}` : "";
  elements.adventureSlots.innerHTML = "";
  const slots = 3;
  for (let index = 0; index < slots; index += 1) {
    const adventure = adventures[index];
    const card = document.createElement("section");
    card.className = "panel hub-card";
    if (adventure) {
      card.innerHTML = `
        <h3>${adventure.name}</h3>
        <p class="stat">Class: ${classNameFromId(adventure.classId)}</p>
        ${adventure.gender ? `<p class="stat">Gender: ${formatGenderLabel(adventure.gender)}</p>` : ""}
        <p class="stat">Level: ${adventure.level}</p>
        <div class="action-buttons hub-card-actions">
          <button type="button" data-continue="${adventure.id}">Continue</button>
          <button type="button" data-delete="${adventure.id}">Delete</button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <h3>Empty Slot</h3>
        <p class="stat">Create a new adventure.</p>
        <div class="action-buttons hub-card-actions">
          <button type="button" data-new-slot="${index}">Create New Adventure</button>
        </div>
      `;
    }
    elements.adventureSlots.append(card);
  }
  elements.hubValidationText.textContent =
    adventures.length >= 3 ? "All 3 active adventure slots are filled." : `${graveyardEntries.length} fallen adventurer${graveyardEntries.length === 1 ? "" : "s"} remembered.`;
}

function renderGraveyard(entries = state.graveyardEntries) {
  elements.graveyardList.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("section");
    empty.className = "panel hub-card";
    empty.innerHTML = "<h3>No names carved here yet.</h3><p class=\"stat\">Your fallen heroes will be remembered when the time comes.</p>";
    elements.graveyardList.append(empty);
    return;
  }
  entries.forEach((entry) => {
    const killText = Object.entries(entry.killStats)
      .map(([enemyType, count]) => `${count} ${enemyType}`)
      .join(", ") || "No recorded kills";
    const card = document.createElement("section");
    card.className = "panel hub-card graveyard-card";
    card.innerHTML = `
      <h3>${entry.name}</h3>
      <p class="stat">Class: ${classNameFromId(entry.classId)}</p>
      <p class="stat">Level: ${entry.level}</p>
      <p class="stat">Battles: ${entry.totalBattles}</p>
      <p class="stat">Kills: ${killText}</p>
      <p class="stat">Death: ${new Date(entry.deathDate).toLocaleString()}</p>
      <p class="stat">${entry.summary}</p>
    `;
    elements.graveyardList.append(card);
  });
}

async function refreshHub() {
  const data = await apiRequest("/api/hub");
  state.user = data.user;
  state.activeAdventures = data.adventures;
  state.graveyardEntries = data.graveyard;
  renderHub(data.adventures, data.graveyard);
  renderGraveyard(data.graveyard);
  activeScreen("hub");
  elements.resetButton.hidden = true;
}

async function bootSession() {
  try {
    const data = await apiRequest("/api/session", { method: "GET" });
    if (data.user) {
      state.user = data.user;
      await refreshHub();
      return;
    }
  } catch {}
  activeScreen("auth");
  elements.resetButton.hidden = true;
}

async function loginOrSignup(mode) {
  const username = elements.authUsername.value.trim().toLowerCase();
  const password = elements.authPassword.value;
  if (!username || password.length < 8) {
    elements.authText.textContent = "Enter a username and a password with at least 8 characters.";
    return;
  }
  try {
    const data = await apiRequest(`/api/${mode}`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    state.user = data.user;
    elements.authText.textContent = "";
    elements.authPassword.value = "";
    await refreshHub();
  } catch (error) {
    elements.authText.textContent = error.message;
  }
}

async function logoutUser() {
  try {
    await apiRequest("/api/logout", { method: "POST", body: JSON.stringify({}) });
  } catch {}
  state.user = null;
  state.currentAdventureId = null;
  state.activeAdventures = [];
  state.graveyardEntries = [];
  elements.resetButton.hidden = true;
  activeScreen("auth");
}

function finalizeSkillDefinition(skill) {
  skill.statUsed = titleCase(skill.stat);
  skill.statusEffect = skill.status ?? null;
  skill.classRestriction = skill.classId;
  const statusChanceText = skill.status ? formatStatusChanceText(skill) : "";
  skill.tooltipText = `${skill.description} (${skill.mode === "attack_modifier" ? "Modifier Skill" : "Standalone Skill"}; ${skill.statUsed}; ${
    skill.damageDice ? `${formatDice(skill.damageDice)} ${skill.damageType}` : "no direct damage"
  }; ${skill.resourceCost ?? 0} ${resourceLabel(skill.resourceType)}; cooldown ${skill.cooldownTurns ?? 0}${
    statusChanceText ? `; ${statusChanceText}` : skill.status ? `; ${statusDefinitions[skill.status.id].name}` : ""
  })`;
  return skill;
}

Object.values(skills).forEach(finalizeSkillDefinition);

function getClassSkillTree(classId) {
  return classSkillTrees[classId] ?? null;
}

function getClassProgressionLevel(classId, level) {
  return getClassSkillTree(classId)?.levels?.[level] ?? {};
}

function getClassStartingSkillIds(classId) {
  return [...(getClassProgressionLevel(classId, 1).skills ?? classes[classId]?.skillIds ?? [])];
}

function normalizePlayerProgression(player) {
  if (!player?.classDef) return;
  player.unlockedSkills = Array.from(new Set(player.unlockedSkills?.length ? player.unlockedSkills : getClassStartingSkillIds(player.classDef.id)));
  player.upgradedSkills = Array.from(new Set(player.upgradedSkills ?? []));
}

function normalizePlayerInventory(player) {
  if (!player) return;
  player.inventory ??= {};
  player.inventory.currency ??= { gold: 0, silver: 0, copper: 0 };
  applyNormalizedCurrency(player.inventory.currency, player.inventory.currency);
  player.inventory.consumables ??= {};
  Object.keys(consumableItems).forEach((itemId) => {
    player.inventory.consumables[itemId] ??= itemId === "minorHealthPotion" ? 1 : 0;
  });
  player.inventory.weapons = Array.isArray(player.inventory.weapons) ? player.inventory.weapons.filter(Boolean) : [];
  player.inventory.armor = Array.isArray(player.inventory.armor) ? player.inventory.armor.filter(Boolean) : [];
}

function safeEntityName(recordMap, id, fallback = "Unknown") {
  if (!id) return fallback;
  return recordMap[id]?.name ?? (titleCase(String(id).replace(/([A-Z])/g, " $1").trim()) || fallback);
}

function getResolvedSkill(skillId, player = state.player) {
  const baseSkill = skills[skillId];
  if (!baseSkill) return null;
  const resolved = finalizeSkillDefinition({ ...baseSkill, damageDice: baseSkill.damageDice ? { ...baseSkill.damageDice } : undefined });
  const appliedUpgrades = (player?.upgradedSkills ?? [])
    .map((upgradeId) => skillUpgrades[upgradeId])
    .filter((upgrade) => upgrade?.targetSkillId === skillId);
  appliedUpgrades.forEach((upgrade) => {
    Object.entries(upgrade.changes ?? {}).forEach(([key, value]) => {
      resolved[key] = value && typeof value === "object" && !Array.isArray(value) ? { ...value } : value;
    });
  });
  finalizeSkillDefinition(resolved);
  resolved.appliedUpgrades = appliedUpgrades;
  return resolved;
}

function calculateEffectChance(actor, source) {
  if (!source?.status?.id) return null;
  if (source.baseEffectChance !== undefined && source.effectScalingStat && source.effectChancePerStat !== undefined) {
    const scalingStatId = String(source.effectScalingStat).toLowerCase();
    const statValue = actor?.stats?.[scalingStatId] ?? 0;
    const rawChance = source.baseEffectChance + statValue * source.effectChancePerStat;
    const maxChance = source.maxEffectChance ?? 100;
    return {
      chancePercent: Math.max(0, Math.min(maxChance, rawChance)),
      baseEffectChance: source.baseEffectChance,
      effectScalingStat: titleCase(scalingStatId),
      effectChancePerStat: source.effectChancePerStat,
      maxEffectChance: maxChance,
      usesScaling: true,
    };
  }
  if (source.status?.chance !== undefined) {
    return {
      chancePercent: Math.round(source.status.chance * 100),
      usesScaling: false,
    };
  }
  return null;
}

function formatStatusChanceText(source, actor = state.player) {
  if (!source?.status?.id) return "";
  const statusName = statusDefinitions[source.status.id]?.name ?? source.status.id;
  const chance = calculateEffectChance(actor, source);
  if (!chance) return statusName;
  if (!chance.usesScaling) return `${statusName} chance: ${chance.chancePercent}%`;
  return `${statusName} chance: ${chance.chancePercent}% (${chance.baseEffectChance}% base + ${chance.effectScalingStat} scaling, max ${chance.maxEffectChance}%)`;
}

function getSkillById(skillId, player = state.player) {
  return getResolvedSkill(skillId, player) ?? skills[skillId] ?? null;
}

function readStat(input) {
  return Number.parseInt(input.value, 10);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDice(dice) {
  return `${dice.count}d${dice.sides}`;
}

function calculateMaxHp(stats, level) {
  return 18 + stats.body * 2 + (level - 1) * 4;
}

function calculateMaxMana(stats, level) {
  return 5 + stats.soul + Math.floor(level / 2);
}

function calculateMaxStamina(stats, level) {
  return 5 + stats.body + Math.floor(level / 2);
}

function recalculateHp(combatant, previousMaxHp = combatant.maxHp) {
  combatant.maxHp = calculateMaxHp(combatant.stats, combatant.level);
  combatant.hp = Math.min(combatant.maxHp, combatant.hp + Math.max(0, combatant.maxHp - previousMaxHp));
}

function recalculateResources(combatant, previousMaxMana = combatant.maxMana ?? 0, previousMaxStamina = combatant.maxStamina ?? 0) {
  combatant.maxMana = calculateMaxMana(combatant.stats, combatant.level);
  combatant.maxStamina = calculateMaxStamina(combatant.stats, combatant.level);
  combatant.mana = Math.min(combatant.maxMana, (combatant.mana ?? combatant.maxMana) + Math.max(0, combatant.maxMana - previousMaxMana));
  combatant.stamina = Math.min(
    combatant.maxStamina,
    (combatant.stamina ?? combatant.maxStamina) + Math.max(0, combatant.maxStamina - previousMaxStamina)
  );
}

function clearNegativeStatuses(player) {
  player.statuses = player.statuses.filter((status) => !statusDefinitions[status.id]?.negative);
}

function restorePlayerAtInn() {
  if (!state.player) return;
  state.player.hp = state.player.maxHp;
  state.player.mana = state.player.maxMana;
  state.player.stamina = state.player.maxStamina;
  clearNegativeStatuses(state.player);
  state.player.skillCooldowns = {};
  state.player.selectedSkillId = null;
}

function getSelectedClass() {
  return classes[state.builderSelectedClassId] ?? null;
}

function getBuilderStats() {
  return {
    mind: readStat(elements.mindInput),
    body: readStat(elements.bodyInput),
    soul: readStat(elements.soulInput),
  };
}

function statTotal(stats) {
  return Object.values(stats).reduce(
    (total, value) => total + (Number.isInteger(value) ? value : 0),
    0
  );
}

function enforceStatBudget(changedInput) {
  const stats = getBuilderStats();
  let changedValue = readStat(changedInput);
  if (!Number.isInteger(changedValue)) {
    changedValue = MIN_STAT;
  }
  changedValue = clamp(changedValue, MIN_STAT, MAX_STAT);

  const otherTotal = [elements.mindInput, elements.bodyInput, elements.soulInput]
    .filter((input) => input !== changedInput)
    .reduce((total, input) => total + clamp(readStat(input) || MIN_STAT, MIN_STAT, MAX_STAT), 0);
  changedInput.value = Math.min(changedValue, Math.max(MIN_STAT, STAT_LIMIT - otherTotal));

  Object.entries(stats).forEach(([stat, value]) => {
    const input = elements[`${stat}Input`];
    if (!Number.isInteger(value) || value < MIN_STAT) {
      input.value = MIN_STAT;
    } else if (value > MAX_STAT) {
      input.value = MAX_STAT;
    }
  });
}

function getLevelForXp(xp) {
  let level = 1;
  XP_THRESHOLDS.forEach((threshold, index) => {
    if (xp >= threshold) {
      level = index + 1;
    }
  });
  return Math.min(level, XP_THRESHOLDS.length);
}

function getNextLevelText(player) {
  const nextThreshold = XP_THRESHOLDS[player.level];
  return nextThreshold === undefined ? "max" : `${nextThreshold} XP`;
}

function getSubclassDef(combatant) {
  if (!combatant.classDef || !combatant.subclassId) {
    return null;
  }
  return subclasses[combatant.classDef.id]?.[combatant.subclassId] ?? null;
}

function getArmorBonus(combatant) {
  return combatant.armor?.acBonus ?? 0;
}

function getClassAcBonus(combatant) {
  return combatant.classDef?.acBonus ?? 0;
}

function getSubclassAcBonus(combatant) {
  return getSubclassDef(combatant)?.acBonus ?? 0;
}

function getAc(combatant) {
  return (
    BASE_AC +
    getArmorBonus(combatant) +
    getClassAcBonus(combatant) +
    getSubclassAcBonus(combatant) +
    (combatant.acBonus ?? 0)
  );
}

function getAcFormula(combatant) {
  const parts = [`Base ${BASE_AC}`];
  if (combatant.armor) {
    parts.push(`${combatant.armor.name} ${signed(getArmorBonus(combatant))}`);
  }
  if (combatant.classDef && getClassAcBonus(combatant) !== 0) {
    parts.push(`${combatant.classDef.name} ${signed(getClassAcBonus(combatant))}`);
  }
  if (getSubclassAcBonus(combatant) !== 0) {
    parts.push(`${getSubclassDef(combatant).name} ${signed(getSubclassAcBonus(combatant))}`);
  }
  if ((combatant.acBonus ?? 0) !== 0) {
    parts.push(`Other ${signed(combatant.acBonus)}`);
  }
  return `${parts.join(" + ")} = ${getAc(combatant)}`;
}

function getClassAttackBonus(combatant, attackKind) {
  if (!combatant.classDef) {
    return 0;
  }
  return attackKind === "spell" ? combatant.classDef.spellHitBonus : combatant.classDef.weaponHitBonus;
}

function getClassCheckBonus(combatant, stat) {
  return combatant.classDef?.checkBonuses?.[stat] ?? 0;
}

function getSubclassCheckBonus(combatant, stat) {
  return getSubclassDef(combatant)?.checkBonuses?.[stat] ?? 0;
}

function getArmorCheckBonus(combatant, stat) {
  return combatant.armor?.checkBonuses?.[stat] ?? 0;
}

function getStatusHitPenalty(combatant) {
  return combatant.statuses.reduce((total, status) => total + (statusDefinitions[status.id].hitPenalty ?? 0), 0);
}

function getStatusDamageReduction(combatant) {
  return combatant.statuses.reduce((total, status) => total + (statusDefinitions[status.id].damageReduction ?? 0), 0);
}

function getWeaponSpecialAttackBonus(combatant, attack) {
  let bonus = 0;
  if (attack.id === "unarmed" && combatant.classDef?.id === "monk") {
    bonus += attack.monkHitBonus ?? 0;
  }
  if (attack.attackKind === "spell" && combatant.weapon?.spellAttackBonus) {
    bonus += combatant.weapon.spellAttackBonus;
  }
  return bonus;
}

function getFirstAttackBonus(combatant) {
  return combatant.hasAttacked ? 0 : combatant.classDef?.firstAttackHitBonus ?? 0;
}

// Custom system core: actual Mind/Body/Soul scores are direct d20 modifiers.
function buildD20Parts(combatant, stat, options = {}) {
  const statValue = Number.isInteger(combatant.stats[stat]) ? combatant.stats[stat] : 0;
  const parts = [{ label: titleCase(stat), value: statValue }];
  const classBonus = options.classBonus ?? getClassCheckBonus(combatant, stat);
  const subclassBonus = options.subclassBonus ?? getSubclassCheckBonus(combatant, stat);
  const armorPenalty = options.armorBonus ?? getArmorCheckBonus(combatant, stat);
  const equipmentBonus = options.equipmentBonus ?? 0;
  const specialBonus = options.specialBonus ?? 0;
  const statusBonus = options.statusBonus ?? getStatusHitPenalty(combatant);

  if (classBonus !== 0) parts.push({ label: options.classLabel ?? "Class", value: classBonus });
  if (subclassBonus !== 0) parts.push({ label: options.subclassLabel ?? "Subclass", value: subclassBonus });
  if (armorPenalty !== 0) parts.push({ label: combatant.armor?.name ?? "Armor", value: armorPenalty });
  if (equipmentBonus !== 0) parts.push({ label: options.equipmentLabel ?? "Equipment", value: equipmentBonus });
  if (specialBonus !== 0) parts.push({ label: options.specialLabel ?? "Special", value: specialBonus });
  if (statusBonus !== 0) parts.push({ label: "Status", value: statusBonus });

  return parts;
}

function sumParts(parts) {
  return parts.reduce((total, part) => total + part.value, 0);
}

function formatRollMath(die, parts) {
  const bonusText = parts.map((part) => `${part.label} ${part.value}`).join(" + ");
  return `d20 (${die})${bonusText ? ` + ${bonusText}` : ""} = ${die + sumParts(parts)}`;
}

function rollDamageDice(dice) {
  const rolls = [];
  for (let index = 0; index < dice.count; index += 1) {
    rolls.push(roll(dice.sides));
  }
  return { rolls, total: rolls.reduce((sum, value) => sum + value, 0) };
}

function createInventory(startingWeaponId, startingArmorId) {
  return {
    currency: { copper: 0, silver: 0, gold: 0 },
    consumables: Object.fromEntries(Object.keys(consumableItems).map((itemId) => [itemId, itemId === "minorHealthPotion" ? 1 : 0])),
    weapons: [startingWeaponId],
    armor: [startingArmorId],
  };
}

function addInventoryItem(inventory, category, id, quantity = 1) {
  if (category === "currency" || category === "consumables") {
    inventory[category][id] = (inventory[category][id] ?? 0) + quantity;
    if (category === "currency") {
      applyNormalizedCurrency(inventory.currency, inventory.currency);
    }
    return;
  }
  if (!inventory[category].includes(id)) {
    inventory[category].push(id);
  }
}

function createPlayer() {
  const stats = getBuilderStats();
  const classDef = getSelectedClass();
  const weapon = weapons[elements.weaponSelect.value];
  const armor = armors[elements.armorSelect.value];
  const level = 1;
  const maxHp = calculateMaxHp(stats, level);
  const maxMana = calculateMaxMana(stats, level);
  const maxStamina = calculateMaxStamina(stats, level);

  return {
    id: "player",
    name: elements.nameInput.value.trim() || "Adventurer",
    description: elements.descriptionInput.value.trim(),
    gender: state.builderGender,
    level,
    xp: 0,
    maxHp,
    hp: maxHp,
    maxMana,
    mana: maxMana,
    maxStamina,
    stamina: maxStamina,
    stats,
    classDef,
    subclassId: null,
    unlockedSkills: getClassStartingSkillIds(classDef.id),
    upgradedSkills: [],
    weapon,
    spell: null,
    armor,
    acBonus: 0,
    resistances: [],
    weaknesses: [],
    statuses: [],
    inventory: createInventory(weapon.id, armor.id),
    hasAttacked: false,
    selectedSkillId: null,
    skillCooldowns: {},
  };
}

async function continueAdventure(adventureId) {
  const data = await apiRequest(`/api/adventures/${adventureId}`, { method: "GET" });
  state.currentAdventureId = adventureId;
  loadSnapshot(data.adventure.snapshot);
  if (state.gameState === GAME_STATES.victory && state.lastRewards.length > 0) {
    elements.levelUpScreen.hidden = true;
    showRewardModal();
  } else if (state.lastProgressionResults.length > 0) {
    showProgressionModal();
  } else if (state.pendingLevelUps > 0) {
    showLevelUp();
  } else {
    elements.levelUpScreen.hidden = true;
  }
  elements.authText.textContent = "";
  elements.resetButton.hidden = false;
  elements.resetButton.textContent = "Adventure Hub";
  activeScreen("combat");
  renderCombat();
  if (state.gameState === GAME_STATES.inCombat) {
    maybeRunEnemyTurn();
  }
}

function prepareNewAdventure() {
  state.currentAdventureId = null;
  state.progress = createProgress();
  state.gameState = GAME_STATES.characterCreation;
  state.builderGender = "undisclosed";
  state.player = null;
  state.enemy = null;
  state.initiative = [];
  state.turnIndex = 0;
  resetPlayerTurnActions();
  state.turnStarted = false;
  state.round = 1;
  state.isResolvingEnemyTurn = false;
  state.winner = null;
  state.pendingLevelUps = 0;
  state.pendingLevelQueue = [];
  state.combatEnded = false;
  state.lastRewards = [];
  state.lastProgressionResults = [];
  state.levelUpDraft = { stat: null, subclass: null, progressionChoice: null };
  elements.levelUpScreen.hidden = true;
  elements.rewardModal.hidden = true;
  elements.progressionModal.hidden = true;
  elements.resetButton.hidden = false;
  elements.resetButton.textContent = "Adventure Hub";
  activeScreen("builder");
  renderBuilder();
}

// Enemy scaling is intentionally simple: each level adds HP, small stat pressure,
// AC at even levels, damage via level bonus, and larger rewards.
function createScaledEnemy(playerLevel) {
  const templateList = Object.values(enemyTemplates);
  const template = templateList[Math.floor(Math.random() * templateList.length)];
  const level = Math.max(1, playerLevel);
  const scale = level - 1;
  const stats = {
    mind: clamp(template.stats.mind + Math.floor(scale / 3), 1, 10),
    body: clamp(template.stats.body + Math.floor(scale / 2), 1, 10),
    soul: clamp(template.stats.soul + Math.floor(scale / 3), 1, 10),
  };
  const maxHp = template.baseHp + stats.body * 2 + scale * 4;

  return {
    id: "enemy",
    templateId: template.id,
    name: template.name,
    level,
    xp: 0,
    maxHp,
    hp: maxHp,
    stats,
    classDef: null,
    subclassId: null,
    weapon: weapons[template.weaponId],
    spell: weapons[template.weaponId].attackKind === "spell" ? weapons[template.weaponId] : null,
    armor: armors[template.armorId],
    acBonus: template.acBonus + Math.floor(scale / 2),
    damageLevelBonus: Math.floor(scale / 2),
    resistances: [...template.resistances],
    weaknesses: [...template.weaknesses],
    statuses: [],
    loot: template.loot,
    hasAttacked: false,
  };
}

function validateCharacter() {
  const stats = getBuilderStats();
  const messages = [];
  const values = Object.values(stats);
  const total = statTotal(stats);

  if (!elements.nameInput.value.trim()) messages.push("Enter a character name.");
  if (values.some((value) => !Number.isInteger(value))) messages.push("All stats must be whole numbers.");
  if (values.some((value) => value < MIN_STAT || value > MAX_STAT)) messages.push("Each stat must be between 1 and 10.");
  if (total > STAT_LIMIT) messages.push("Total stats cannot exceed 10.");
  if (!getSelectedClass()) messages.push("Choose a class.");
  if (!weapons[elements.weaponSelect.value]) messages.push("Choose a weapon.");
  if (!armors[elements.armorSelect.value]) messages.push("Choose armor.");

  return { valid: messages.length === 0, messages, stats, total };
}

function formatClassTooltip(classDef) {
  const startingSkills = getClassStartingSkillIds(classDef.id);
  const lines = [
    classDef.shortDescription,
    classDef.roleTag ? `Role ${classDef.roleTag}` : null,
    classDef.playstyle ? `Playstyle ${classDef.playstyle}` : null,
    `Weapon hit ${signed(classDef.weaponHitBonus)}`,
    `Spell hit ${signed(classDef.spellHitBonus)}`,
    `AC ${signed(classDef.acBonus)}`,
  ].filter(Boolean);
  Object.entries(classDef.checkBonuses)
    .filter(([, value]) => value !== 0)
    .forEach(([stat, value]) => lines.push(`${titleCase(stat)} checks ${signed(value)}`));
  if (classDef.damageReduction) {
    lines.push(`Damage reduction ${classDef.damageReduction}`);
  }
  lines.push(`Skills ${startingSkills.map((id) => getSkillById(id)?.name ?? id).join(", ")}`);
  return lines.join(" | ");
}

function formatInfoTooltip(label, body, options = {}) {
  const title = options.title ?? label;
  const content = options.htmlLabel ?? label;
  return `<button type="button" class="info-chip tooltip-term" data-info-title="${escapeAttribute(title)}" data-info-body="${escapeAttribute(
    body
  )}" data-tooltip="${escapeAttribute(body)}">${content}<span class="info-chip-icon" aria-hidden="true">i</span></button>`;
}

function formatClassDisplay(classDef) {
  return classDef
    ? formatInfoTooltip(
        classDef.name,
        `${classDef.shortDescription} | ${classDef.roleTag ?? "Class"} | ${classDef.tooltipSummary}`,
        { htmlLabel: renderClassIcon(classDef.id, classDef.name) }
      )
    : "None";
}

function formatSubclassDisplay(subclassDef) {
  if (!subclassDef) {
    return "Locked until level 3";
  }
  const summary = `AC ${signed(subclassDef.acBonus ?? 0)}, damage ${signed(subclassDef.damageBonus ?? 0)}`;
  return formatInfoTooltip(subclassDef.name, `${subclassDef.name} | ${summary}`);
}

function formatStatsMarkup(stats) {
  return [
    `${formatInfoTooltip(`Mind ${stats.mind}`, statTooltips.mind)}`,
    `${formatInfoTooltip(`Body ${stats.body}`, statTooltips.body)}`,
    `${formatInfoTooltip(`Soul ${stats.soul}`, statTooltips.soul)}`,
  ].join(", ");
}

function renderClassPills() {
  elements.classPills.innerHTML = "";
  Object.values(classes).forEach((classDef) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `class-pill${state.builderSelectedClassId === classDef.id ? " active" : ""}`;
    button.dataset.tooltip = formatClassTooltip(classDef);
    button.innerHTML = renderClassIcon(classDef.id, classDef.name);
    button.addEventListener("click", () => {
      state.builderSelectedClassId = classDef.id;
      renderBuilder();
    });
    elements.classPills.append(button);
  });
}

function renderGenderPills() {
  if (!elements.genderPills) return;
  elements.genderPills.innerHTML = "";
  GENDER_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `class-pill gender-pill${state.builderGender === option.id ? " active" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      state.builderGender = option.id;
      renderBuilder();
    });
    elements.genderPills.append(button);
  });
}

function renderClassInfoPanel(classDef) {
  if (!classDef) {
    elements.classInfoPanel.textContent = "Choose a class to see its role, bonuses, and starting skills.";
    return;
  }
  const startingSkills = getClassStartingSkillIds(classDef.id);
  elements.classInfoPanel.innerHTML = `<strong>${classDef.name}</strong>${classDef.shortDescription} ${classDef.roleTag ? `[${classDef.roleTag}] ` : ""}${
    classDef.playstyle
  } Bonuses: ${classDef.tooltipSummary}. Skills: ${startingSkills.map((id) => getSkillById(id)?.name ?? id).join(", ")}.`;
}

function renderBuilder() {
  const validation = validateCharacter();
  const previewClass = getSelectedClass();
  elements.mindValue.textContent = validation.stats.mind;
  elements.bodyValue.textContent = validation.stats.body;
  elements.soulValue.textContent = validation.stats.soul;
  const preview = {
    id: "preview",
    name: elements.nameInput.value.trim() || "Adventurer",
    description: elements.descriptionInput.value.trim(),
    gender: state.builderGender,
    level: 1,
    stats: validation.stats,
    classDef: previewClass,
    subclassId: null,
    weapon: weapons[elements.weaponSelect.value],
    armor: armors[elements.armorSelect.value],
    acBonus: 0,
    resistances: [],
    weaknesses: [],
    statuses: [],
    hasAttacked: false,
  };
  const weaponParts = getAttackParts(preview, preview.weapon);

  renderClassPills();
  renderGenderPills();
  elements.totalSpent.textContent = validation.total;
  elements.totalRemaining.textContent = Math.max(0, STAT_LIMIT - validation.total);
  elements.builderSummaryName.textContent = preview.name;
  elements.builderSummaryDescription.textContent = preview.description || "No description";
  elements.builderSummaryGender.textContent = formatGenderLabel(preview.gender);
  elements.builderSummaryClass.innerHTML = formatClassDisplay(previewClass);
  elements.builderSummaryStats.innerHTML = formatStatsMarkup(preview.stats);
    elements.builderSummaryWeapon.innerHTML = renderWeaponImage(preview.weapon.id, preview.weapon.name);
    if (elements.builderWeaponPreview) {
      elements.builderWeaponPreview.innerHTML = `${renderWeaponImage(preview.weapon.id, preview.weapon.name)}<span class="muted">${preview.weapon.special}</span>`;
    }
  elements.builderSummaryArmor.textContent = preview.armor.name;
  elements.builderSummarySkills.textContent = previewClass
    ? getClassStartingSkillIds(previewClass.id)
        .map((id) => getSkillById(id)?.name ?? id)
        .join(", ")
    : "None";
  renderClassInfoPanel(previewClass);
  elements.builderAc.textContent = getAcFormula(preview);
  elements.builderWeaponAttack.textContent = `d20 + ${weaponParts.map((part) => `${part.label} ${part.value}`).join(" + ")}`;
  elements.builderWeaponDamage.textContent = `${formatDice(preview.weapon.damageDice)} ${preview.weapon.damageType}`;
  elements.builderWeaponSpecial.textContent = preview.weapon.special;
  elements.builderHp.textContent = `${calculateMaxHp(preview.stats, 1)} max HP`;
  elements.validationText.textContent = validation.valid ? "Ready to start." : validation.messages.join(" ");
  elements.validationText.classList.toggle("valid", validation.valid);
  elements.startButton.disabled = !validation.valid;
}

function living(combatant) {
  return combatant.hp > 0;
}

function currentCombatant() {
  return state.initiative[state.turnIndex]?.combatant;
}

function syncActionState() {
  state.actionUsed = state.majorActionUsed || state.minorActionsUsed > 0;
}

function resetPlayerTurnActions() {
  state.majorActionUsed = false;
  state.minorActionsUsed = 0;
  syncActionState();
}

function canUseMajorAction() {
  return currentCombatant()?.id === "player" && !state.isResolvingEnemyTurn && !state.winner && !state.majorActionUsed && state.minorActionsUsed < 2;
}

function canUseMinorAction() {
  if (currentCombatant()?.id !== "player" || state.isResolvingEnemyTurn || state.winner) return false;
  const maxMinorActions = state.majorActionUsed ? 1 : 2;
  return state.minorActionsUsed < maxMinorActions;
}

function getMinorActionLimit() {
  return state.majorActionUsed ? 1 : 2;
}

function isPlayerTurnComplete() {
  return state.minorActionsUsed >= 2 || (state.majorActionUsed && state.minorActionsUsed >= 1);
}

function markMajorActionUsed(label) {
  state.majorActionUsed = true;
  syncActionState();
  if (label) addLog(`${state.player.name} uses Major Action: ${label}.`);
}

function markMinorActionUsed(label) {
  state.minorActionsUsed += 1;
  syncActionState();
  if (label) addLog(`${state.player.name} uses Minor Action: ${label}.`);
  if (!canUseMinorAction()) {
    addLog("No Minor Actions remaining.");
  }
}

function finishPlayerAction() {
  renderCombat();
  if (!state.winner && isPlayerTurnComplete()) {
    addLog(`${state.player.name} ends turn.`);
    window.setTimeout(advanceTurn, 450);
  }
}

function getSkillActionType(skill) {
  if (!skill || skill.mode === "attack_modifier") return null;
  return skill.attackKind === "utility" ? "minor" : "major";
}

function targetFor(attacker) {
  return attacker.id === "player" ? state.enemy : state.player;
}

function decorateLog(message) {
  const playerName = state.player?.name;
  const enemyName = state.enemy?.name;
  let html = message;
  if (playerName) {
    html = html.replaceAll(playerName, `<span class="log-player">${playerName}</span>`);
  }
  if (enemyName) {
    html = html.replaceAll(enemyName, `<span class="log-enemy">${enemyName}</span>`);
  }
  html = html.replace(/CRITICAL HIT!/g, '<span class="log-crit">CRITICAL HIT!</span>');
  html = html.replace(/(Damage [^=]*= )(\d+)/g, '$1<span class="log-damage">$2</span>');
  html = html.replace(/(recovers )(\d+)( HP)/g, '$1<span class="log-heal">$2</span>$3');
  html = html.replace(/(suffers )(\d+)/g, '$1<span class="log-damage">$2</span>');
  return html;
}

function addLog(message) {
  const item = document.createElement("li");
  item.innerHTML = decorateLog(message);
  elements.diceLog.prepend(item);
}

function renderHpBar(container, combatant) {
  const percent = combatant.maxHp > 0 ? Math.max(0, Math.min(100, (combatant.hp / combatant.maxHp) * 100)) : 0;
  const stateClass = percent <= 20 ? "low" : percent <= 50 ? "mid" : "high";
  container.innerHTML = "";
  const bar = document.createElement("div");
  bar.className = "hp-bar";
  const fill = document.createElement("div");
  fill.className = `hp-fill ${stateClass}`;
  fill.style.width = `${percent}%`;
  const text = document.createElement("div");
  text.className = "hp-text";
  text.textContent = `${combatant.hp} / ${combatant.maxHp}`;
  bar.append(fill, text);
  container.append(bar);
}

function renderResourceBar(container, label, value, maxValue, theme) {
  const percent = maxValue > 0 ? Math.max(0, Math.min(100, (value / maxValue) * 100)) : 0;
  container.innerHTML = "";
  const bar = document.createElement("div");
  bar.className = `resource-bar ${theme}`;
  const fill = document.createElement("div");
  fill.className = "resource-fill";
  fill.style.width = `${percent}%`;
  const text = document.createElement("div");
  text.className = "resource-text";
  text.textContent = `${label} ${value} / ${maxValue}`;
  bar.append(fill, text);
  container.append(bar);
}

async function startCombat() {
  const validation = validateCharacter();
  if (!validation.valid) {
    renderBuilder();
    return;
  }

  state.player = createPlayer();
  state.progress = state.progress ?? createProgress();
  state.enemy = createScaledEnemy(state.player.level);
  state.gameState = GAME_STATES.inCombat;
  state.turnIndex = 0;
  resetPlayerTurnActions();
  state.turnStarted = false;
  state.round = 1;
  state.isResolvingEnemyTurn = false;
  state.winner = null;
  state.pendingLevelUps = 0;
  state.pendingLevelQueue = [];
  state.combatEnded = false;
  state.lastRewards = [];
  state.lastProgressionResults = [];
  state.levelUpDraft = { stat: null, subclass: null, progressionChoice: null };
  elements.nextEncounterButton.hidden = true;
  elements.diceLog.innerHTML = "";
  elements.builderScreen.hidden = true;
  elements.levelUpScreen.hidden = true;
  activeScreen("combat");
  elements.rewardModal.hidden = true;
  elements.progressionModal.hidden = true;
  elements.resetButton.hidden = false;
  elements.resetButton.textContent = "Adventure Hub";

  rollInitiative();
  state.progress.battlesFought += 1;
  addLog(`${state.player.name} AC: ${getAcFormula(state.player)}.`);
  addLog(`${state.enemy.name} AC: ${getAcFormula(state.enemy)}.`);
  try {
    if (!state.currentAdventureId) {
      await createAdventureSave();
    } else {
      await saveAdventure("combat start");
    }
  } catch (error) {
    elements.validationText.textContent = error.message;
    activeScreen("builder");
    return;
  }
  renderCombat();
  maybeRunEnemyTurn();
}

function getInitiativeParts(combatant) {
  const initiativeBonus = (combatant.weapon?.initiativeBonus ?? 0) + (getSubclassDef(combatant)?.initiativeBonus ?? 0);
  return buildD20Parts(combatant, "mind", {
    specialBonus: initiativeBonus,
    specialLabel: combatant.weapon?.initiativeBonus ? combatant.weapon.name : "Subclass",
  });
}

function rollInitiative() {
  const playerRoll = roll(20);
  const enemyRoll = roll(20);
  const playerParts = getInitiativeParts(state.player);
  const enemyParts = getInitiativeParts(state.enemy);
  const playerTotal = playerRoll + sumParts(playerParts);
  const enemyTotal = enemyRoll + sumParts(enemyParts);

  state.initiative = [
    { combatant: state.player, total: playerTotal, die: playerRoll, parts: playerParts },
    { combatant: state.enemy, total: enemyTotal, die: enemyRoll, parts: enemyParts },
  ].sort((a, b) => b.total - a.total || (a.combatant.id === "player" ? -1 : 1));

  addLog(`Initiative: ${state.player.name} ${formatRollMath(playerRoll, playerParts)}; ${state.enemy.name} ${formatRollMath(enemyRoll, enemyParts)}.`);
}

function resetToBuilder() {
  if (state.user) {
    refreshHub().catch((error) => {
      elements.authText.textContent = error.message;
      activeScreen("auth");
    });
    return;
  }
  prepareNewAdventure();
}

function formatTraits(combatant) {
  const resist = combatant.resistances.length ? combatant.resistances.join(", ") : "none";
  const weak = combatant.weaknesses.length ? combatant.weaknesses.join(", ") : "none";
  return `Resist ${resist}; Weak ${weak}`;
}

function formatStatusRemoval(statusId) {
  const statusDef = statusDefinitions[statusId];
  return statusDef?.removableBy?.length ? statusDef.removableBy.join(", ") : "Usually fades naturally or needs special recovery";
}

function getStatusTooltip(statusId) {
  const statusDef = statusDefinitions[statusId];
  return `${statusDef.tooltip} Removal: ${formatStatusRemoval(statusId)}.`;
}

function formatStatuses(combatant) {
  if (!combatant.statuses.length) {
    return '<span class="status-empty">No active effects</span>';
  }
  return combatant.statuses
    .map((status) => {
      const def = statusDefinitions[status.id];
      const durationText = status.duration > 0 ? ` ${status.duration}` : "";
      return `<span class="status-pill status-${def.color ?? "default"}" data-tooltip="${getStatusTooltip(status.id)}">${def.name}${durationText}</span>`;
    })
    .join("");
}

function renderCombatant(prefix, combatant) {
  if (!combatant) {
    if (prefix === "enemy") {
      elements.enemyNameHeading.textContent = "Enemy";
      renderEnemyPortrait(null);
      elements.enemyTypeLevel.textContent = "-";
      elements.enemyStats.textContent = "-";
      elements.enemyWeapon.textContent = "-";
      elements.enemyTraits.textContent = "-";
      elements.enemyStatuses.innerHTML = '<span class="status-empty">No active effects</span>';
      elements.enemyAc.textContent = "-";
      elements.enemyAttack.textContent = "-";
      elements.enemyDamage.textContent = "-";
      elements.enemyHpBar.innerHTML = "";
    }
    return;
  }
  const attackParts = getAttackParts(combatant);
  const attackTotal = sumParts(attackParts);
  renderHpBar(elements[`${prefix}HpBar`], combatant);
  elements[`${prefix}Stats`].innerHTML = formatStatsMarkup(combatant.stats);
    elements[`${prefix}Weapon`].innerHTML = `${renderWeaponImage(combatant.weapon.id, combatant.weapon.name)}<span class="weapon-special-copy">${combatant.weapon.special}</span>`;
  elements[`${prefix}Traits`].textContent = formatTraits(combatant);
  elements[`${prefix}Statuses`].innerHTML = formatStatuses(combatant);
  elements[`${prefix}Ac`].innerHTML = formatInfoTooltip(`${getAc(combatant)}`, getAcFormula(combatant), { title: `AC ${getAc(combatant)}` });
  elements[`${prefix}Attack`].innerHTML = formatInfoTooltip(`${signed(attackTotal)}`, attackParts.map((part) => `${part.label} ${signed(part.value)}`).join(" | "), {
    title: `Attack ${signed(attackTotal)}`,
  });
  elements[`${prefix}Damage`].textContent = `${formatDice(combatant.weapon.damageDice)} ${combatant.weapon.damageType}`;

    if (prefix === "player") {
    elements.playerNameHeading.textContent = combatant.name;
    elements.playerLevelXp.textContent = `Level ${combatant.level}, ${combatant.xp} XP, next ${getNextLevelText(combatant)}`;
    elements.saveStatus.textContent = state.savePending
      ? "Saving..."
      : state.saveMessage || (state.user ? "" : "Not logged in — progress will not be saved.");
    elements.playerGenderLine.textContent = `Gender: ${formatGenderLabel(combatant.gender)}`;
    renderResourceBar(elements.playerManaBar, "Mana", combatant.mana, combatant.maxMana, "mana");
    renderResourceBar(elements.playerStaminaBar, "Stamina", combatant.stamina, combatant.maxStamina, "stamina");
    elements.playerGender.textContent = formatGenderLabel(combatant.gender);
    elements.playerClass.innerHTML = formatClassDisplay(combatant.classDef);
    elements.playerSubclass.innerHTML = formatSubclassDisplay(getSubclassDef(combatant));
    elements.playerWealth.textContent = formatCurrencyCompact(combatant.inventory.currency);
    elements.playerArmor.textContent = combatant.armor.name;
    elements.playerAttackFormula.textContent = `d20 + ${attackParts.map((part) => `${part.label} ${part.value}`).join(" + ")}`;
    elements.playerCooldowns.textContent = formatCooldownSummary(combatant);
    elements.playerDerived.textContent = `Max HP ${combatant.maxHp}; Max Mana ${combatant.maxMana}; Max Stamina ${combatant.maxStamina}; ${getAcFormula(combatant)}`;
    const magicalSkills = getPlayerSkills().filter((skill) => skill.attackKind === "spell" || skill.statUsed === "Soul");
    elements.playerSpell.textContent = magicalSkills.length
      ? magicalSkills.map((skill) => `${skill.name}: ${skill.statUsed}-based ${skill.mode}`).join(", ")
      : "None";
    } else {
      elements.enemyNameHeading.textContent = combatant.name;
      renderEnemyPortrait(combatant);
      elements.enemyTypeLevel.textContent = `${combatant.templateId}, level ${combatant.level}`;
    }
  }

function renderInventory() {
  if (!state.player || !elements.inventoryList) return;
  const inventory = state.player.inventory;
  normalizePlayerInventory(state.player);
  applyNormalizedCurrency(inventory.currency, inventory.currency);
  const ownedConsumables = Object.values(consumableItems).filter((item) => (state.player.inventory.consumables[item.id] ?? 0) > 0);
  const consumableMarkup = ownedConsumables.length
    ? ownedConsumables
        .map((item) => {
          const useState = getConsumableUseState(state.player, item);
          const usingInCombat = state.gameState === GAME_STATES.inCombat;
          const actionBlocked = usingInCombat && !canUseMinorAction();
          const disabled = !useState.usable || actionBlocked;
          const reason = actionBlocked ? "No Minor Action available" : useState.reason;
          const expanded = state.expandedInventoryItems.has(item.id);
          const quantity = state.player.inventory.consumables[item.id] ?? 0;
          return `
            <div class="item-card inventory-item-card${expanded ? " expanded" : ""}">
              <button type="button" class="item-expand-badge" data-toggle-inventory-item="${item.id}" aria-expanded="${expanded}" aria-label="Show ${item.name} details">+</button>
              <button type="button" class="item-icon-button" data-use-item="${item.id}" ${disabled ? "disabled" : ""} title="${reason}" aria-label="Use ${item.name}">
                <span class="sr-only">${item.name}</span>
                ${renderItemIcon(item)}
                <span class="item-count-badge">${quantity}</span>
              </button>
              <div class="item-card-details" ${expanded ? "" : "hidden"}><strong>${item.name}</strong>${formatItemDetails(item)}</div>
            </div>
          `;
        })
        .join("")
    : '<p class="muted">No consumables on hand.</p>';
    const ownedWeapons = inventory.weapons.length
      ? `<div class="weapon-chip-row">${inventory.weapons.map((id) => renderWeaponImage(id, safeEntityName(weapons, id), { compact: true })).join("")}</div>`
      : '<p class="muted">No weapons owned.</p>';
  const ownedArmor = inventory.armor.length
    ? inventory.armor.map((id) => safeEntityName(armors, id)).join(', ')
    : 'None';
  const equipmentMarkup = `
    <div class="inventory-section">
      <h3>Currency</h3>
      <div>${renderCurrencyWithIcons(inventory.currency, { showZero: true })}</div>
    </div>
      <div class="inventory-section">
        <h3>Owned weapons</h3>
        ${ownedWeapons}
      </div>
      <p>Owned armor: ${ownedArmor}</p>
      <p>Equipped: ${renderWeaponImage(state.player.weapon.id, state.player.weapon.name, { compact: true })}, ${state.player.armor.name}</p>
    <div class="inventory-section">
      <h3>Consumables</h3>
      <div class="item-list">${consumableMarkup}</div>
    </div>
  `;
  elements.inventoryList.innerHTML = equipmentMarkup;
  renderShop();
}

function renderShop() {
  if (!state.player || !elements.shopList || !elements.shopCurrency) return;
  const inventory = state.player.inventory;
  normalizePlayerInventory(state.player);
  elements.shopCurrency.innerHTML = `Funds: ${renderCurrencyWithIcons(inventory.currency, { compact: true, showZero: true })}`;
  elements.shopList.innerHTML = '';
  Object.values(consumableItems).forEach((item) => {
    const row = document.createElement('div');
    const expanded = state.expandedShopItems.has(item.id);
    row.className = 'item-card shop-item-card' + (expanded ? ' expanded' : '');
    const disabled = state.gameState !== GAME_STATES.betweenBattles || !canAffordCurrency(inventory.currency, item.cost);
    row.innerHTML = `
      <button type="button" class="item-expand-badge" data-toggle-shop-item="${item.id}" aria-expanded="${expanded}" aria-label="Show ${item.name} details">+</button>
      <div class="item-card-main">
        <button type="button" class="item-icon-button shop-buy-button" data-buy-item="${item.id}" ${disabled ? "disabled" : ""} aria-label="Buy ${item.name}">
          <span class="sr-only">${item.name}</span>
          ${renderItemIcon(item)}
          <span class="item-count-badge">${inventory.consumables[item.id] ?? 0}</span>
        </button>
        <div class="item-card-body">
          <strong>${item.name}</strong>
          <span class="item-meta">${renderCurrencyWithIcons(item.cost, { compact: true })}</span>
          <span class="item-meta">Owned: ${inventory.consumables[item.id] ?? 0}</span>
        </div>
      </div>
      <div class="item-card-details" ${expanded ? "" : "hidden"}>${formatItemDetails(item)}</div>
    `;
    elements.shopList.append(row);
  });
  elements.innButton.disabled = state.gameState !== GAME_STATES.betweenBattles || !canAffordCurrency(inventory.currency, INN_PRICE);
}

function renderResults() {
  elements.resultsList.innerHTML = "";
  const lines = state.lastRewards.length ? state.lastRewards : ["No rewards yet."];
  lines.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    elements.resultsList.append(p);
  });
}

function showRewardModal() {
  renderResults();
  elements.rewardModal.hidden = false;
}

function showProgressionModal() {
  elements.progressionResultsList.innerHTML = "";
  state.lastProgressionResults.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    elements.progressionResultsList.append(p);
  });
  elements.progressionModal.hidden = false;
}

function showInfoModal(title, body) {
  elements.infoTitle.textContent = title || "Info";
  elements.infoBody.innerHTML = "";
  String(body)
    .split(/\s*\|\s*|\n/)
    .filter(Boolean)
    .forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line.trim();
      elements.infoBody.append(p);
    });
  elements.infoModal.hidden = false;
}

function hideInfoModal() {
  elements.infoModal.hidden = true;
}

function showCodexModal() {
  renderCodex();
  elements.codexModal.hidden = false;
}

function hideCodexModal() {
  elements.codexModal.hidden = true;
}

function hideRewardModal() {
  elements.rewardModal.hidden = true;
  if (state.pendingLevelUps > 0) {
    showLevelUp();
    return;
  }
  if (state.lastProgressionResults.length > 0) {
    showProgressionModal();
    return;
  }
  completeVictoryIfReady();
}

function hideProgressionModal() {
  elements.progressionModal.hidden = true;
  state.lastProgressionResults = [];
  if (state.pendingLevelUps > 0) {
    showLevelUp();
  } else {
    completeVictoryIfReady();
  }
  renderCombat();
}

function switchPlayerTab(tabName) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  ["overview", "details", "inventory"].forEach((name) => {
    const panel = document.querySelector(`#${name}Tab`);
    panel.hidden = name !== tabName;
  });
}

function getPlayerSkills() {
  if (!state.player) return [];
  normalizePlayerProgression(state.player);
  const unlocked = state.player.unlockedSkills?.length ? state.player.unlockedSkills : getClassStartingSkillIds(state.player.classDef?.id);
  return unlocked.map((id) => getSkillById(id, state.player)).filter(Boolean);
}

function getSkillCooldownRemaining(player, skillId) {
  return player.skillCooldowns?.[skillId] ?? 0;
}

function canUseSkill(player, skill, cooldownState = player.skillCooldowns ?? {}) {
  const cooldownRemaining = cooldownState[skill.id] ?? 0;
  if (cooldownRemaining > 0) {
    return {
      usable: false,
      reason: `${skill.name} is on cooldown (${cooldownRemaining} turn${cooldownRemaining === 1 ? "" : "s"} remaining).`,
      cooldownRemaining,
    };
  }
  const resourceType = skill.resourceType ?? null;
  const resourceCost = skill.resourceCost ?? 0;
  if (!resourceType || resourceCost <= 0) {
    return { usable: true, reason: "", cooldownRemaining };
  }
  const currentValue = player[resourceType] ?? 0;
  if (currentValue < resourceCost) {
    return {
      usable: false,
      reason: `Need ${resourceCost} ${resourceLabel(resourceType)}.`,
      cooldownRemaining,
    };
  }
  return { usable: true, reason: "", cooldownRemaining };
}

function spendSkillResource(player, skill) {
  if (!skill.resourceType || !skill.resourceCost) return;
  player[skill.resourceType] = Math.max(0, (player[skill.resourceType] ?? 0) - skill.resourceCost);
  addLog(`${player.name} spends ${skill.resourceCost} ${resourceLabel(skill.resourceType)} to use ${skill.name}.`);
}

function startSkillCooldown(player, skill) {
  const cooldownTurns = skill.cooldownTurns ?? 0;
  if (cooldownTurns <= 0) return;
  player.skillCooldowns[skill.id] = cooldownTurns;
  addLog(`${skill.name} enters cooldown for ${cooldownTurns} turn${cooldownTurns === 1 ? "" : "s"}.`);
}

function tickSkillCooldowns(player) {
  if (!player?.skillCooldowns) return;
  Object.entries(player.skillCooldowns).forEach(([skillId, remaining]) => {
    const nextValue = remaining - 1;
    if (nextValue <= 0) {
      delete player.skillCooldowns[skillId];
      addLog(`${getSkillById(skillId, player)?.name ?? skillId} is ready again.`);
    } else {
      player.skillCooldowns[skillId] = nextValue;
    }
  });
}

function formatCooldownSummary(player) {
  const entries = Object.entries(player.skillCooldowns ?? {});
  if (!entries.length) return "None";
  return entries
    .map(([skillId, turns]) => `${getSkillById(skillId, player)?.name ?? skillId} ${turns}`)
    .join(", ");
}

function getSkillBadgeText(skill) {
  const badges = [];
  if (skill.resourceType && (skill.resourceCost ?? 0) > 0) {
    badges.push(`${skill.resourceType === "mana" ? "M" : "S"}${skill.resourceCost}`);
  }
  if ((skill.cooldownTurns ?? 0) > 0) {
    badges.push(`CD${skill.cooldownTurns}`);
  }
  return badges.join(" ");
}

function renderSkills() {
  if (!elements.skillsList || !elements.skillInfoPanel || !state.player) return;
  const skillList = getPlayerSkills();
  const selected = getSelectedSkill();
  const selectedActionType = getSkillActionType(selected);
  const playerTurnActive = state.gameState === GAME_STATES.inCombat && currentCombatant()?.id === "player" && !state.isResolvingEnemyTurn;
  elements.selectedSkillText.textContent = selected ? selected.name : "None";
  elements.clearSkillButton.hidden = !selected || !playerTurnActive;
  elements.skillsList.innerHTML = "";
  skillList.forEach((skill) => {
    const availability = canUseSkill(state.player, skill);
    const actionType = getSkillActionType(skill);
    const actionAvailable =
      skill.mode === "attack_modifier" ? canUseMajorAction() : actionType === "major" ? canUseMajorAction() : canUseMinorAction();
    const button = document.createElement("button");
    button.type = "button";
    button.className = `skill-pill${state.player.selectedSkillId === skill.id ? " active" : ""}${availability.usable ? "" : " unavailable"}`;
    button.innerHTML = `<span>${skill.name}</span>${getSkillBadgeText(skill) ? `<span class="skill-badge">${getSkillBadgeText(skill)}</span>` : ""}${
      availability.cooldownRemaining > 0 ? `<span class="cooldown-badge">${availability.cooldownRemaining}</span>` : ""
    }`;
    button.dataset.skillId = skill.id;
    const chanceLine = skill.status ? `\n${formatStatusChanceText(skill, state.player)}` : "";
    button.dataset.tooltip = `${skill.description}\nMode: ${skill.mode === "attack_modifier" ? "Modifier Skill" : "Standalone Skill"}\nStat: ${skill.statUsed}\nResource: ${
      skill.resourceType ? `${skill.resourceCost} ${resourceLabel(skill.resourceType)}` : "None"
    }\nCooldown: ${skill.cooldownTurns ?? 0}\nCurrent cooldown: ${availability.cooldownRemaining}${chanceLine}\nEffect: ${formatSkillEffect(skill, state.player)}${
      availability.reason ? `\nUnavailable: ${availability.reason}` : ""
    }`;
    button.disabled = !availability.usable || !playerTurnActive || !actionAvailable;
    button.addEventListener("click", () => selectSkill(skill.id));
    elements.skillsList.append(button);
  });
  elements.skillInfoPanel.innerHTML = selected
    ? `<strong>${selected.name}</strong>${selected.description} Mode: ${
        selected.mode === "attack_modifier" ? "Modifier Skill" : "Standalone Skill"
      }. Stat: ${selected.statUsed}. Resource: ${
        selected.resourceType ? `${selected.resourceCost} ${resourceLabel(selected.resourceType)}` : "None"
      }. Cooldown: ${selected.cooldownTurns ?? 0}. Action: ${selectedActionType ? titleCase(selectedActionType) : "Attack modifier"}. Effect: ${formatSkillEffect(selected, state.player)}.`
    : "Tap a skill to prepare it and read its details here.";
}

function renderCodexCards(entries, renderCard) {
  const grid = document.createElement("div");
  grid.className = "codex-grid";
  entries.forEach((entry) => grid.append(renderCard(entry)));
  return grid;
}

function createCodexCard(title, subtitle, description, chips = [], bullets = []) {
  const card = document.createElement("section");
  card.className = "codex-card";
  const chipMarkup = chips.map((chip) => `<span class="codex-chip">${chip}</span>`).join("");
  const bulletMarkup = bullets.map((bullet) => `<li>${bullet}</li>`).join("");
  card.innerHTML = `
    <div class="codex-card-header">
      <h3>${title}</h3>
      ${subtitle ? `<span class="muted">${subtitle}</span>` : ""}
    </div>
    ${description ? `<p>${description}</p>` : ""}
    ${chipMarkup ? `<div class="codex-chip-row">${chipMarkup}</div>` : ""}
    ${bulletMarkup ? `<ul class="codex-list">${bulletMarkup}</ul>` : ""}
  `;
  return card;
}

function renderCodex() {
  if (!elements.codexList) return;
  elements.codexList.innerHTML = "";
  const nav = document.createElement("div");
  nav.className = "subtabs";
  const sections = ["classes", "subclasses", "weapons", "enemies", "items", "status"];
  sections.forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `subtab-button${state.activeCodexSection === section ? " active" : ""}`;
    button.textContent = section === "status" ? "Status Effects" : titleCase(section);
    button.addEventListener("click", () => {
      state.activeCodexSection = section;
      renderCodex();
    });
    nav.append(button);
  });
  elements.codexList.append(nav);

  let content;
  if (state.activeCodexSection === "classes") {
    content = renderCodexCards(Object.values(classes), (classDef) =>
      createCodexCard(
        classDef.name,
        classDef.roleTag ?? "Class",
        classDef.shortDescription,
        [`Weapon hit ${signed(classDef.weaponHitBonus)}`, `Spell hit ${signed(classDef.spellHitBonus)}`, `AC ${signed(classDef.acBonus)}`],
        [classDef.playstyle, classDef.tooltipSummary]
      )
    );
  } else if (state.activeCodexSection === "subclasses") {
    content = renderCodexCards(
      Object.entries(subclasses).flatMap(([classId, group]) => Object.values(group).map((subclass) => ({ classId, subclass }))),
      ({ classId, subclass }) => {
        const info = getSubclassPresentation(classId, subclass.id);
        return createCodexCard(subclass.name, `Class: ${classes[classId]?.name ?? classId}`, info.summary, [], info.features);
      }
    );
  } else if (state.activeCodexSection === "weapons") {
    content = renderCodexCards(
        Object.values(weapons).filter((weapon) => !["crudeBlade", "bite", "boneClaw", "emberBolt", "rustySword"].includes(weapon.id)),
        (weapon) =>
          createCodexCard(
            renderWeaponImage(weapon.id, weapon.name, { size: "sm" }),
            `${formatDice(weapon.damageDice)} ${weapon.damageType}`,
            weapon.special,
            [`Stat: ${titleCase(weapon.stat)}`, `Type: ${weapon.attackKind}`]
          )
    );
  } else if (state.activeCodexSection === "enemies") {
    content = renderCodexCards(Object.values(enemyTemplates), (enemy) =>
      createCodexCard(
        enemy.name,
        `Stats ${enemy.stats.mind}/${enemy.stats.body}/${enemy.stats.soul}`,
        `Typical foe with ${armors[enemy.armorId].name} and ${weapons[enemy.weaponId].name}.`,
        [`Resist: ${enemy.resistances.join(", ") || "None"}`, `Weak: ${enemy.weaknesses.join(", ") || "None"}`],
        [`Loot: ${enemy.loot.xp} base XP`, `Weapon drop chance: ${Math.round(enemy.loot.weaponChance * 100)}%`]
      )
    );
  } else if (state.activeCodexSection === "items") {
    content = renderCodexCards(
      [
        ...Object.values(consumableItems).map((item) => ({
          name: item.name,
          use: item.description,
          cost: formatCurrencyCompact(item.cost),
        })),
        { name: "Inn Stay", use: "Restore HP, Mana, and Stamina, clear cooldowns, and remove temporary negative effects.", cost: formatCurrencyCompact(INN_PRICE) },
      ],
      (item) => createCodexCard(item.name, `Cost: ${item.cost}`, item.use)
    );
  } else {
    content = renderCodexCards(Object.entries(statusDefinitions), ([statusId, status]) =>
      createCodexCard(status.name, "", describeStatus(status), [], [`Removal: ${formatStatusRemoval(statusId)}`])
    );
  }
  elements.codexList.append(content);
}

function describeStatus(status) {
  const parts = [status.tooltip];
  if (status.damage && status.tick) {
    parts.push(`${status.damage} damage on ${status.tick} turn timing`);
  }
  if (status.hitPenalty) {
    parts.push(`${status.hitPenalty} to hit`);
  }
  if (status.skipAction) {
    parts.push("Lose next action");
  }
  if (status.damageReduction) {
    parts.push(`Reduce incoming damage by ${status.damageReduction}`);
  }
  return parts.join(". ");
}

function formatSkillEffect(skill, actor = state.player) {
  const effects = [];
  effects.push(skill.mode === "attack_modifier" ? "Attack modifier" : "Standalone");
  effects.push(`${skill.statUsed}-based`);
  if (skill.hitBonus) effects.push(`${signed(skill.hitBonus)} hit`);
  if (skill.damageDice) effects.push(`${formatDice(skill.damageDice)} ${skill.damageType}`);
  if (skill.damageBonus) effects.push(`${signed(skill.damageBonus)} damage`);
  if (skill.statusEffect || skill.status) effects.push(formatStatusChanceText(skill, actor));
  if (skill.statusSelf) effects.push(`Self: ${statusDefinitions[skill.statusSelf.id].name}`);
  if (skill.canRemoveStatuses === "negative") effects.push("Removes 1 negative status");
  if (Array.isArray(skill.canRemoveStatuses) && skill.canRemoveStatuses.length) {
    effects.push(`Removes ${skill.canRemoveStatuses.map((statusId) => statusDefinitions[statusId].name).join(" or ")}`);
  }
  return effects.length ? `(${effects.join("; ")})` : "";
}

function selectSkill(skillId) {
  if (state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.isResolvingEnemyTurn) return;
  const skill = getSkillById(skillId, state.player);
  const availability = canUseSkill(state.player, skill);
  const actionType = getSkillActionType(skill);
  const actionAvailable =
    skill.mode === "attack_modifier" ? canUseMajorAction() : actionType === "major" ? canUseMajorAction() : canUseMinorAction();
  if (!availability.usable) {
    addLog(availability.reason);
    renderCombat();
    return;
  }
  if (!actionAvailable) {
    addLog(actionType === "minor" ? "No Minor Actions available for that skill." : "No Major Action available for that skill.");
    renderCombat();
    return;
  }
  state.player.selectedSkillId = state.player.selectedSkillId === skillId ? null : skillId;
  const selected = getSelectedSkill();
  addLog(
    selected
      ? `${state.player.name} prepares ${selected.name} (${selected.mode === "attack_modifier" ? "attack modifier" : "standalone"}).`
      : `${state.player.name} clears the prepared skill.`
  );
  renderCombat();
}

function getSelectedSkill() {
  return getSkillById(state.player.selectedSkillId, state.player);
}

function takePreparedAttackModifier(baseAttack) {
  const skill = getSelectedSkill();
  if (!skill || skill.mode !== "attack_modifier") {
    return { attack: baseAttack, skill: null };
  }
  const availability = canUseSkill(state.player, skill);
  if (!availability.usable) {
    addLog(availability.reason);
    state.player.selectedSkillId = null;
    return { attack: baseAttack, skill: null };
  }

  state.player.selectedSkillId = null;
  spendSkillResource(state.player, skill);
  startSkillCooldown(state.player, skill);
  addLog(`${state.player.name} uses ${skill.name} -> Attack enhanced.`);

  return {
    skill,
    attack: {
      ...baseAttack,
      name: `${baseAttack.name} + ${skill.name}`,
      attackBonus: (baseAttack.attackBonus ?? 0) + (skill.hitBonus ?? 0),
      damageDice: skill.damageDice ?? baseAttack.damageDice,
      damageBonus: (baseAttack.damageBonus ?? 0) + (skill.damageBonus ?? 0),
      damageType: skill.damageType ?? baseAttack.damageType,
      status: skill.statusEffect ?? baseAttack.status,
      statusSelf: skill.statusSelf ?? baseAttack.statusSelf,
      followUpPenalty: skill.followUpPenalty ?? baseAttack.extraAttackPenalty,
    },
  };
}

function buildStandaloneSkillAttack(skill) {
  return {
    id: skill.id,
    name: skill.name,
    attackKind: skill.attackKind === "utility" ? "utility" : skill.attackKind,
    stat: skill.statUsed.toLowerCase(),
    attackBonus: skill.hitBonus ?? 0,
    damageDice: skill.damageDice,
    damageBonus: skill.damageBonus ?? 0,
    damageType: skill.damageType ?? "physical",
    critMin: 20,
    status: skill.statusEffect ?? null,
    statusSelf: skill.statusSelf ?? null,
    followUpPenalty: skill.followUpPenalty,
  };
}

function useSelectedSkill() {
  if (currentCombatant()?.id !== "player") return;
  const skill = getSelectedSkill();
  if (!skill || skill.mode !== "standalone") return;
  const actionType = getSkillActionType(skill);
  const actionAvailable = actionType === "major" ? canUseMajorAction() : canUseMinorAction();
  const availability = canUseSkill(state.player, skill);
  if (!availability.usable || !actionAvailable) {
    addLog(availability.reason ?? (actionType === "minor" ? "No Minor Actions available for that skill." : "No Major Action available for that skill."));
    state.player.selectedSkillId = null;
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }

  state.player.selectedSkillId = null;
  if (actionType === "minor") {
    markMinorActionUsed(skill.name);
  }
  spendSkillResource(state.player, skill);
  startSkillCooldown(state.player, skill);

  if (skill.attackKind === "utility") {
    if (skill.canRemoveStatuses) {
      const removed = removeStatusesBySource(
        state.player,
        skill.canRemoveStatuses,
        skill.name,
        skill.statusRemovalLimit ?? Infinity
      );
      if (!removed.length) {
        addLog(`${skill.name} finds no matching effect to remove.`);
      }
    }
    if (skill.statusSelf) {
      maybeApplyStatus(state.player, state.player, skill.statusSelf, skill.name);
    }
    addLog(`${state.player.name} uses ${skill.name}.`);
    if (!state.winner) tickStatuses(state.player, "afterAct");
    finishPlayerAction();
    return;
  }

  const attack = buildStandaloneSkillAttack(skill);
  resolveAttack(state.player, attack, { skill, followUp: true });
  if (!state.winner && skill.followUpPenalty !== undefined) {
    resolveAttack(state.player, attack, { skill, followUp: true, extraHitBonus: skill.followUpPenalty });
  }
  if (skill.statusSelf) {
    maybeApplyStatus(state.player, state.player, skill.statusSelf, skill.name);
  }
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function renderInitiative() {
  elements.initiativeList.innerHTML = "";
  if (!state.initiative?.length) {
    return;
  }
  state.initiative.forEach((entry, index) => {
    const item = document.createElement("li");
    item.textContent = `${entry.combatant.name}: ${entry.total}`;
    if (index === state.turnIndex && !state.winner) item.classList.add("active");
    elements.initiativeList.append(item);
  });
}

function renderCombat() {
  const active = currentCombatant();
  const betweenBattlesView = state.gameState === GAME_STATES.betweenBattles;
  syncSceneBackground();
  applySceneBackground("combat");
  syncScreenMusic("combat");
  elements.combatLayout?.classList.toggle("between-battles-view", betweenBattlesView);
  document.querySelectorAll(".battle-only").forEach((section) => {
    section.hidden = betweenBattlesView;
  });
  document.querySelectorAll(".between-only").forEach((section) => {
    section.hidden = !betweenBattlesView;
  });
  elements.diceLogPanel.open = !betweenBattlesView;
  renderCombatant("player", state.player);
  renderCombatant("enemy", state.enemy);
  renderInitiative();
  try {
    renderInventory();
  } catch (error) {
    console.error("Inventory render failed", error);
    if (elements.inventoryList) {
      elements.inventoryList.innerHTML = `<p class="muted">Inventory could not be displayed for this save. Please refresh or continue the adventure to resync it.</p>`;
    }
    if (elements.shopList) {
      elements.shopList.innerHTML = `<p class="muted">Shop could not be displayed right now.</p>`;
    }
  }
  renderResults();
  try {
    renderSkills();
  } catch (error) {
    console.error("Skill render failed", error);
    if (elements.skillsList) {
      elements.skillsList.innerHTML = `<p class="muted">Skills could not be displayed right now.</p>`;
    }
  }
  try {
    renderCodex();
  } catch (error) {
    console.error("Codex render failed", error);
    if (elements.codexList) {
      elements.codexList.innerHTML = `<p class="muted">Codex could not be displayed right now.</p>`;
    }
  }

  elements.playerCard.classList.toggle("active", active?.id === "player" && !state.winner);
  elements.enemyCard.classList.toggle("active", active?.id === "enemy" && !state.winner);

  if (state.gameState === GAME_STATES.defeat) {
    elements.turnText.textContent = `${state.player.name} was defeated.`;
    elements.actionText.textContent = "Game over. Create a new character to try again.";
    elements.majorActionStatus.textContent = "-";
    elements.minorActionStatus.textContent = "-";
    setActionButtons(true);
    elements.nextEncounterButton.hidden = true;
    return;
  }

  if (state.gameState === GAME_STATES.victory) {
    elements.turnText.textContent = `${state.winner.name} wins.`;
    elements.actionText.textContent = state.pendingLevelUps > 0 ? "Level up is available before the next battle." : "Processing victory.";
    elements.majorActionStatus.textContent = "-";
    elements.minorActionStatus.textContent = "-";
    setActionButtons(true);
    elements.nextEncounterButton.hidden = true;
    return;
  }

  if (state.gameState === GAME_STATES.betweenBattles) {
    elements.turnText.textContent = "Between battles";
    elements.actionText.textContent = "Review rewards, use items, rest at the inn, or start the next battle.";
    elements.majorActionStatus.textContent = "-";
    elements.minorActionStatus.textContent = "-";
    setActionButtons(true);
    elements.innButton.disabled = !canAffordCurrency(state.player.inventory.currency, INN_PRICE);
    elements.nextEncounterButton.hidden = false;
    elements.nextEncounterButton.disabled = state.pendingLevelUps > 0;
    return;
  }

  elements.turnText.textContent = `Round ${state.round}: ${active.name}'s turn`;
  const selectedSkill = getSelectedSkill();
  const selectedSkillActionType = getSkillActionType(selectedSkill);
  const selectedSkillAvailability = selectedSkill ? canUseSkill(state.player, selectedSkill) : null;
  const playerTurnActive = active.id === "player" && !state.isResolvingEnemyTurn;
  elements.majorActionStatus.textContent = playerTurnActive ? (state.majorActionUsed ? "Used" : "Available") : "-";
  elements.minorActionStatus.textContent = playerTurnActive ? `${state.minorActionsUsed} / ${getMinorActionLimit()} used` : "-";
  elements.actionText.textContent = playerTurnActive
    ? selectedSkill
      ? selectedSkill.mode === "attack_modifier"
        ? `Next attack modified by ${selectedSkill.name}.`
        : `${selectedSkill.name} is ready as a ${selectedSkillActionType} action.`
      : "Choose actions freely until you end your turn or run out."
    : "Wait for the enemy turn to finish.";
  elements.attackButton.disabled = !playerTurnActive || !canUseMajorAction();
  elements.majorSkillButton.hidden = !(selectedSkill && selectedSkill.mode === "standalone" && selectedSkillActionType === "major");
  elements.majorSkillButton.disabled = !playerTurnActive || !canUseMajorAction() || !selectedSkillAvailability?.usable;
  elements.majorSkillButton.textContent = selectedSkill ? `Use ${selectedSkill.name}` : "Use Selected Skill";
  elements.minorSkillButton.hidden = !(selectedSkill && selectedSkill.mode === "standalone" && selectedSkillActionType === "minor");
  elements.minorSkillButton.disabled = !playerTurnActive || !canUseMinorAction() || !selectedSkillAvailability?.usable;
  elements.minorSkillButton.textContent = selectedSkill ? `Use ${selectedSkill.name}` : "Use Selected Skill";
  elements.endTurnButton.disabled = !playerTurnActive;
  elements.clearSkillButton.hidden = !selectedSkill || !playerTurnActive;
  elements.innButton.disabled = true;
  elements.nextEncounterButton.hidden = true;
}

function setActionButtons(disabled) {
  elements.attackButton.disabled = disabled;
  elements.majorSkillButton.disabled = disabled;
  elements.minorSkillButton.disabled = disabled;
  elements.endTurnButton.disabled = disabled;
  elements.majorSkillButton.hidden = true;
  elements.minorSkillButton.hidden = true;
  elements.clearSkillButton.hidden = true;
}

async function startNextEncounter() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles || state.pendingLevelUps > 0) return;
  state.enemy = createScaledEnemy(state.player.level);
  state.player.hasAttacked = false;
  state.player.selectedSkillId = null;
  state.gameState = GAME_STATES.inCombat;
  state.turnIndex = 0;
  resetPlayerTurnActions();
  state.actionUsed = false;
  state.turnStarted = false;
  state.round = 1;
  state.isResolvingEnemyTurn = false;
  state.winner = null;
  state.combatEnded = false;
  state.lastRewards = [];
  elements.nextEncounterButton.hidden = true;
  rollInitiative();
  state.progress.battlesFought += 1;
  addLog(`New encounter: ${state.enemy.name} level ${state.enemy.level}.`);
  addLog(`${state.enemy.name} AC: ${getAcFormula(state.enemy)}.`);
  await saveAdventure("combat start");
  renderCombat();
  maybeRunEnemyTurn();
}

function getAttackParts(attacker, attack = attacker.weapon, extraHitBonus = 0) {
  return buildD20Parts(attacker, attack.stat, {
    classBonus: getClassAttackBonus(attacker, attack.attackKind),
    classLabel: attacker.classDef ? attacker.classDef.name : "Class",
    equipmentBonus: attack.attackBonus ?? 0,
    equipmentLabel: attack.name,
    specialBonus: getWeaponSpecialAttackBonus(attacker, attack) + getFirstAttackBonus(attacker) + extraHitBonus,
    specialLabel: getFirstAttackBonus(attacker) ? "First attack" : "Special",
  });
}

function getSkillParts(attacker, skill, extraHitBonus = 0) {
  return buildD20Parts(attacker, skill.statUsed.toLowerCase(), {
    classBonus: getClassAttackBonus(attacker, skill.attackKind),
    classLabel: attacker.classDef ? attacker.classDef.name : "Class",
    equipmentBonus: skill.hitBonus ?? 0,
    equipmentLabel: skill.name,
    specialBonus: getFirstAttackBonus(attacker) + extraHitBonus,
    specialLabel: "Special",
  });
}

function isArmored(combatant) {
  return getArmorBonus(combatant) > 0;
}

function getDamageBonusParts(attacker, defender, attack) {
  const parts = [];
  const classBonus = attacker.classDef?.damageBonus ?? 0;
  const subclass = getSubclassDef(attacker);
  const subclassDamageBonus =
    subclass?.damageBonusTypes && !subclass.damageBonusTypes.includes(attack.damageType)
      ? 0
      : subclass?.damageBonus ?? 0;
  const levelBonus = attacker.damageLevelBonus ?? 0;

  if ((attack.damageBonus ?? 0) !== 0) parts.push({ label: attack.name, value: attack.damageBonus });
  if (classBonus !== 0) parts.push({ label: attacker.classDef.name, value: classBonus });
  if (subclassDamageBonus !== 0) parts.push({ label: subclass.name, value: subclassDamageBonus });
  if (attack.id === "sword" && isArmored(defender)) parts.push({ label: "Armored target", value: 1 });
  if (levelBonus !== 0) parts.push({ label: "Scaling", value: levelBonus });
  return parts;
}

function applyDamageTraits(defender, damage, damageType) {
  let finalDamage = damage;
  const notes = [];
  if (defender.resistances.includes(damageType)) {
    finalDamage = Math.floor(finalDamage / 2);
    notes.push(`${defender.name} resists ${damageType}`);
  }
  if (defender.weaknesses.includes(damageType)) {
    finalDamage += 2;
    notes.push(`${defender.name} is weak to ${damageType} +2`);
  }
  const reduction = (defender.classDef?.damageReduction ?? 0) + getStatusDamageReduction(defender);
  if (reduction > 0) {
    finalDamage = Math.max(0, finalDamage - reduction);
    notes.push(`${defender.name} reduces damage by ${reduction}`);
  }
  return { finalDamage, notes };
}

function applyStatus(target, statusId, sourceName) {
  const def = statusDefinitions[statusId];
  const existing = target.statuses.find((status) => status.id === statusId);
  if (existing) {
    existing.duration = Math.max(existing.duration, def.duration);
  } else {
    target.statuses.push({ id: statusId, duration: def.duration });
  }
  addLog(`${sourceName} applies ${def.name} to ${target.name}.`);
}

function maybeApplyStatus(source, target, status, sourceName, effectSource = null) {
  if (!status) return;
  const chance = calculateEffectChance(source, effectSource ?? { status });
  if (!chance) return;
  const statusName = statusDefinitions[status.id]?.name ?? status.id;
  const rollValue = roll(100);
  if (chance.usesScaling) {
    addLog(`${statusName} chance: ${chance.chancePercent}% (${chance.baseEffectChance}% base + ${chance.effectScalingStat} scaling, max ${chance.maxEffectChance}%).`);
  } else {
    addLog(`${statusName} chance: ${chance.chancePercent}%.`);
  }
  if (rollValue <= chance.chancePercent) {
    addLog(`Rolled ${rollValue} -> ${statusName} applied.`);
    applyStatus(target, status.id, sourceName);
  } else {
    addLog(`Rolled ${rollValue} -> No ${statusName.toLowerCase()}.`);
  }
}

function tickStatuses(combatant, timing) {
  combatant.statuses = combatant.statuses.filter((status) => {
    const def = statusDefinitions[status.id];
    if (def.tick === timing && def.damage) {
      combatant.hp = Math.max(0, combatant.hp - def.damage);
      addLog(`${combatant.name} suffers ${def.damage} ${def.damageType} from ${def.name}.`);
    }
    if (timing === "end") {
      status.duration -= 1;
      if (status.duration <= 0) {
        addLog(`${def.name} fades from ${combatant.name}.`);
        return false;
      }
    }
    return true;
  });
  checkWinner();
}

function hasStatus(combatant, statusId) {
  return combatant.statuses.some((status) => status.id === statusId);
}

function resolveAttack(attacker, attack = attacker.weapon, options = {}) {
  if ((attacker.id === "player" && !options.followUp && !canUseMajorAction()) || (attacker.id !== "player" && state.actionUsed && !options.followUp) || state.winner) {
    addLog(`${attacker.name} cannot act again this turn.`);
    renderCombat();
    return;
  }

  if (attacker.id === "player" && !options.followUp) {
    markMajorActionUsed(options.skill?.name ?? "Attack");
  } else if (attacker.id !== "player" && !options.followUp) {
    state.actionUsed = true;
  }
  const defender = targetFor(attacker);
  const attackDie = roll(20);
  const parts = options.skill ? getSkillParts(attacker, options.skill, options.extraHitBonus ?? 0) : getAttackParts(attacker, attack, options.extraHitBonus ?? 0);
  const attackTotal = attackDie + sumParts(parts);
  const defenderAc = getAc(defender);
  const isNaturalTwenty = attackDie === 20;
  const isCrit = isNaturalTwenty || attackDie >= (attack.critMin ?? 20);
  const hit = isCrit || (attackDie !== 1 && attackTotal >= defenderAc);
  attacker.hasAttacked = true;

  if (hit) {
    const damageDice = isCrit
      ? { ...attack.damageDice, count: attack.damageDice.count * 2 }
      : attack.damageDice;
    const damageRoll = rollDamageDice(damageDice);
    const damageBonusParts = getDamageBonusParts(attacker, defender, attack);
    const totalDamage = damageRoll.total + sumParts(damageBonusParts);
    const traitResult = applyDamageTraits(defender, Math.max(0, totalDamage), attack.damageType);
    defender.hp = Math.max(0, defender.hp - traitResult.finalDamage);
    const bonusText = damageBonusParts.length ? ` + ${damageBonusParts.map((part) => `${part.label} ${part.value}`).join(" + ")}` : "";
    const traitText = traitResult.notes.length ? ` ${traitResult.notes.join("; ")}.` : "";
    const sourceName = options.skill?.name ?? attack.name;
    const critText = isCrit ? " CRITICAL HIT!" : "";

    addLog(`${attacker.name} uses ${sourceName}: ${formatRollMath(attackDie, parts)} vs ${defender.name} AC ${defenderAc} -> HIT.${critText} Damage ${formatDice(damageDice)} (${damageRoll.rolls.join(", ")})${bonusText} = ${traitResult.finalDamage} ${attack.damageType}.${traitText}`);
    maybeApplyStatus(attacker, defender, attack.status, sourceName, options.skill ?? attack);
    checkWinner();
    return;
  }

  addLog(`${attacker.name} uses ${options.skill?.name ?? attack.name}: ${formatRollMath(attackDie, parts)} vs ${defender.name} AC ${defenderAc} -> MISS.`);
}

function usePotion() {
  useConsumableItem("minorHealthPotion");
}

function removeStatus(combatant, statusId) {
  const before = combatant.statuses.length;
  combatant.statuses = combatant.statuses.filter((status) => status.id !== statusId);
  return combatant.statuses.length !== before;
}

function removeStatusesBySource(combatant, statusIds, sourceName, limit = Infinity) {
  const removed = [];
  const allowed = statusIds === "negative"
    ? new Set(Object.entries(statusDefinitions).filter(([, def]) => def.negative).map(([statusId]) => statusId))
    : new Set(statusIds);
  combatant.statuses = combatant.statuses.filter((status) => {
    if (removed.length >= limit || !allowed.has(status.id)) return true;
    removed.push(statusDefinitions[status.id].name);
    return false;
  });
  if (removed.length) {
    addLog(`${sourceName} removes ${removed.join(", ")} from ${combatant.name}.`);
  }
  return removed;
}

function getConsumableUseState(player, itemDef) {
  const quantity = player.inventory.consumables[itemDef.id] ?? 0;
  if (quantity <= 0) return { usable: false, reason: "Out of stock" };
  if (itemDef.restoreType === "hp") {
    if (player.hp >= player.maxHp) return { usable: false, reason: "Already at full HP" };
    return { usable: true, reason: "" };
  }
  if (itemDef.restoreType === "mana") {
    if (player.mana >= player.maxMana) return { usable: false, reason: "Already at full Mana" };
    return { usable: true, reason: "" };
  }
  if (itemDef.restoreType === "stamina") {
    if (player.stamina >= player.maxStamina) return { usable: false, reason: "Already at full Stamina" };
    return { usable: true, reason: "" };
  }
  if (!itemDef.removesStatuses?.length) {
    return { usable: false, reason: itemDef.description };
  }
  const matching = player.statuses.filter((status) => itemDef.removesStatuses.includes(status.id));
  if (!matching.length) {
    return { usable: false, reason: `Needs ${itemDef.removesStatuses.map((statusId) => statusDefinitions[statusId].name).join(" or ")}` };
  }
  return { usable: true, reason: "" };
}

function useConsumableItem(itemId) {
  if (!state.player || state.gameState === GAME_STATES.defeat || state.gameState === GAME_STATES.characterCreation) return;
  const itemDef = consumableItems[itemId];
  if (!itemDef) return;
  const usingInCombat = state.gameState === GAME_STATES.inCombat;
  if (usingInCombat && (currentCombatant()?.id !== "player" || !canUseMinorAction())) return;
  if (usingInCombat && !startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  const useState = getConsumableUseState(state.player, itemDef);
  if (!useState.usable) {
    addLog(`${itemDef.name} cannot be used: ${useState.reason}.`);
    renderCombat();
    return;
  }
  if (usingInCombat) markMinorActionUsed(itemDef.name);
  state.player.inventory.consumables[itemId] -= 1;
  if (itemDef.restoreType) {
    const restoreRoll = rollRange(itemDef.restoreRange);
    const resourceKey = itemDef.restoreType === "hp" ? "hp" : itemDef.restoreType;
    const maxKey = resourceKey === "hp" ? "maxHp" : `max${titleCase(resourceKey)}`;
    const oldValue = state.player[resourceKey];
    state.player[resourceKey] = Math.min(state.player[maxKey], state.player[resourceKey] + restoreRoll);
    const restored = state.player[resourceKey] - oldValue;
    addLog(`${state.player.name} uses ${itemDef.name} and restores ${restored} ${titleCase(resourceKey)}.`);
  } else {
    addLog(`${state.player.name} uses ${itemDef.name}.`);
    removeStatusesBySource(state.player, itemDef.removesStatuses, itemDef.name);
  }
  if (usingInCombat && !state.winner) {
    tickStatuses(state.player, "afterAct");
  }
  renderCombat();
  void saveAdventure("inventory");
  if (usingInCombat && isPlayerTurnComplete()) {
    addLog(`${state.player.name} ends turn.`);
    window.setTimeout(advanceTurn, 450);
  }
}

function useBandage() {
  useConsumableItem("bandage");
}

function buyConsumable(itemId) {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles) return;
  const itemDef = consumableItems[itemId];
  if (!itemDef) return;
  if (!spendCurrency(state.player.inventory, itemDef.cost)) {
    addLog(`${state.player.name} cannot afford ${itemDef.name}.`);
    renderCombat();
    return;
  }
  addInventoryItem(state.player.inventory, "consumables", itemId, 1);
  addLog(`${state.player.name} buys ${itemDef.name} for ${formatCurrencyCompact(itemDef.cost)}.`);
  renderCombat();
  void saveAdventure("shop purchase");
}

function checkWinner() {
  if (!living(state.enemy)) {
    state.winner = state.player;
    state.gameState = GAME_STATES.victory;
    awardLoot(state.player, state.enemy);
  } else if (!living(state.player)) {
    state.winner = state.enemy;
    state.gameState = GAME_STATES.defeat;
    state.combatEnded = true;
    state.player.selectedSkillId = null;
    const deathSnapshot = captureSnapshot();
    handleCharacterDeath(deathSnapshot);
  }
}

function completeVictoryIfReady() {
  if (
    state.gameState !== GAME_STATES.victory ||
    state.pendingLevelUps > 0 ||
    !elements.rewardModal.hidden ||
    !elements.levelUpScreen.hidden ||
    !elements.progressionModal.hidden
  ) {
    return;
  }
  // Victory is only fully complete after loot, XP, and any level-up choices are resolved.
  state.player.selectedSkillId = null;
  state.player.hasAttacked = false;
  addLog(`${state.player.name} keeps current HP, Mana, Stamina, statuses, and cooldowns between battles.`);
  state.gameState = GAME_STATES.betweenBattles;
  void saveAdventure("combat");
}

async function handleCharacterDeath(snapshot) {
  if (!state.currentAdventureId || !state.user) return;
  try {
    await apiRequest(`/api/death/${state.currentAdventureId}`, {
      method: "POST",
      body: JSON.stringify({ snapshot }),
    });
    state.currentAdventureId = null;
    await refreshHub();
  } catch (error) {
    addLog(`Death record error: ${error.message}`);
  }
}

function stayAtInn() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles) return;
  if (!spendCurrency(state.player.inventory, INN_PRICE)) {
    addLog(`${state.player.name} cannot afford the inn.`);
    renderCombat();
    return;
  }
  restorePlayerAtInn();
  addLog(
    `${state.player.name} stays at the inn for ${formatCurrencyCompact(INN_PRICE)} and restores to ${state.player.hp} / ${state.player.maxHp} HP, ${state.player.mana} / ${state.player.maxMana} Mana, and ${state.player.stamina} / ${state.player.maxStamina} Stamina. Negative effects and cooldowns are cleared.`
  );
  renderCombat();
  void saveAdventure("rest");
}

function getCurrentLevelUpLevel() {
  return state.pendingLevelQueue[0] ?? state.player.level;
}

function getCurrentLevelProgression() {
  return getClassProgressionLevel(state.player.classDef.id, getCurrentLevelUpLevel());
}

function shouldChooseSubclassForLevelUp(level = getCurrentLevelUpLevel()) {
  return Boolean(getClassProgressionLevel(state.player.classDef.id, level).subclass) && !state.player.subclassId;
}

function getProgressionChoiceOptions(level = getCurrentLevelUpLevel()) {
  const choice = getClassProgressionLevel(state.player.classDef.id, level).choice;
  if (!choice) return [];
  return [
    ...(choice.skills ?? []).map((skillId) => ({ type: "skill", id: skillId })),
    ...(choice.upgrades ?? []).map((upgradeId) => ({ type: "upgrade", id: upgradeId })),
  ];
}

function describeProgressionChoiceOption(option) {
  if (option.type === "skill") {
    const skill = getSkillById(option.id, state.player);
    return {
      title: skill.name,
      body: skill.description,
      features: [`Mode: ${skill.mode === "attack_modifier" ? "Modifier Skill" : "Standalone Skill"}`, `Stat: ${skill.statUsed}`, `Cooldown: ${skill.cooldownTurns ?? 0}`],
    };
  }
  const upgrade = skillUpgrades[option.id];
  const targetSkill = getSkillById(upgrade.targetSkillId, state.player);
  return {
    title: upgrade.name,
    body: upgrade.summary,
    features: [`Upgrades ${targetSkill?.name ?? upgrade.targetSkillId}`],
  };
}

function unlockSkill(player, skillId) {
  normalizePlayerProgression(player);
  if (player.unlockedSkills.includes(skillId)) {
    return null;
  }
  player.unlockedSkills.push(skillId);
  const skill = getSkillById(skillId, player);
  return `New skill unlocked: ${skill.name} — ${skill.description}`;
}

function applySkillUpgrade(player, upgradeId) {
  normalizePlayerProgression(player);
  if (player.upgradedSkills.includes(upgradeId)) {
    return null;
  }
  const upgrade = skillUpgrades[upgradeId];
  if (!upgrade) return null;
  player.upgradedSkills.push(upgradeId);
  const skill = getSkillById(upgrade.targetSkillId, player);
  return `Skill upgraded: ${skill.name} — ${upgrade.summary}`;
}

function applyProgressionForLevel(player, level) {
  const progression = getClassProgressionLevel(player.classDef.id, level);
  const results = [];
  (progression.skills ?? []).forEach((skillId) => {
    const message = unlockSkill(player, skillId);
    if (message) results.push(message);
  });
  (progression.upgrades ?? []).forEach((upgradeId) => {
    const message = applySkillUpgrade(player, upgradeId);
    if (message) results.push(message);
  });
  const choiceId = state.levelUpDraft.progressionChoice;
  if (progression.choice && choiceId) {
    const option = getProgressionChoiceOptions(level).find((entry) => entry.id === choiceId);
    if (option) {
      const message = option.type === "skill" ? unlockSkill(player, option.id) : applySkillUpgrade(player, option.id);
      if (message) results.push(message);
    }
  }
  return results;
}

function awardLoot(player, enemy) {
  if (state.combatEnded) return;
  state.combatEnded = true;
  const scale = enemy.level - 1;
  const loot = enemy.loot;
  const xp = loot.xp + scale * 30;
  const copper = rollRange(loot.copper) + scale * 4;
  const silver = rollRange(loot.silver) + Math.floor(scale / 2);
  const gold = rollRange(loot.gold) + Math.floor(scale / 3);
  const currencyReward = normalizeCurrency({ copper, silver, gold });
  const rewards = [`${xp} XP`, `Currency: ${formatCurrencyDetailed(currencyReward)}`];

  addCurrency(player.inventory, currencyReward);
  state.progress.victories += 1;
  state.progress.killStats[enemy.templateId] = (state.progress.killStats[enemy.templateId] ?? 0) + 1;
  state.progress.xpEarned += xp;
  addCurrency({ currency: state.progress.currencyEarned }, currencyReward);
  awardXp(player, xp);

  if (Math.random() <= loot.weaponChance) {
    const weaponId = loot.weaponIds[Math.floor(Math.random() * loot.weaponIds.length)];
    addInventoryItem(player.inventory, "weapons", weaponId);
    rewards.push(`${weapons[weaponId].name} weapon drop`);
  } else {
    rewards.push("No weapon drop");
  }

  state.lastRewards = rewards;
  addLog(`Loot: ${rewards.join(", ")}.`);
  showRewardModal();
  void saveAdventure("loot");
}

function awardXp(player, amount) {
  const oldLevel = player.level;
  const oldMaxHp = player.maxHp;
  const oldMaxMana = player.maxMana;
  const oldMaxStamina = player.maxStamina;
  player.xp += amount;
  player.level = getLevelForXp(player.xp);
  recalculateHp(player, oldMaxHp);
  recalculateResources(player, oldMaxMana, oldMaxStamina);
  addLog(`${player.name} gains ${amount} XP (${player.xp} total).`);
  if (player.level > oldLevel) {
    const gainedLevels = [];
    for (let level = oldLevel + 1; level <= player.level; level += 1) {
      gainedLevels.push(level);
    }
    state.pendingLevelQueue.push(...gainedLevels);
    state.pendingLevelUps += player.level - oldLevel;
    addLog(`${player.name} reaches level ${player.level}. Level up will continue after rewards.`);
  }
  void saveAdventure("xp");
}

function getSubclassPresentation(classId, subclassId) {
  const description = subclassDescriptions[classId]?.[subclassId];
  if (description) return description;
  const subclass = subclasses[classId]?.[subclassId];
  if (!subclass) return { summary: "Subclass path.", features: [] };
  const features = [];
  if (subclass.acBonus) features.push(`${signed(subclass.acBonus)} AC`);
  if (subclass.damageBonus) features.push(`${signed(subclass.damageBonus)} damage`);
  Object.entries(subclass.checkBonuses ?? {}).forEach(([stat, bonus]) => {
    if (bonus) features.push(`${signed(bonus)} ${titleCase(stat)} checks`);
  });
  return { summary: "Subclass specialization.", features };
}

function renderLevelUpStatPills() {
  elements.levelStatPills.innerHTML = "";
  ["mind", "body", "soul"].forEach((stat) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-pill";
    if (state.levelUpDraft.stat === stat) button.classList.add("active");
    button.innerHTML = `<strong>${titleCase(stat)}</strong><span>${levelUpStatDescriptions[stat]}</span>`;
    button.addEventListener("click", () => {
      state.levelUpDraft.stat = stat;
      renderLevelUpValidation();
      renderLevelUpStatPills();
    });
    elements.levelStatPills.append(button);
  });
}

function renderProgressionChoicePills() {
  elements.progressionChoicePills.innerHTML = "";
  getProgressionChoiceOptions().forEach((option) => {
    const details = describeProgressionChoiceOption(option);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-pill progression-choice-pill";
    if (state.levelUpDraft.progressionChoice === option.id) button.classList.add("active");
    button.innerHTML = `<strong>${details.title}</strong><span>${details.body}</span><ul>${details.features
      .map((feature) => `<li>${feature}</li>`)
      .join("")}</ul>`;
    button.addEventListener("click", () => {
      state.levelUpDraft.progressionChoice = option.id;
      renderLevelUpValidation();
      renderProgressionChoicePills();
    });
    elements.progressionChoicePills.append(button);
  });
}

function renderSubclassPills() {
  elements.subclassPills.innerHTML = "";
  const classId = state.player.classDef.id;
  Object.values(subclasses[classId] ?? {}).forEach((subclass) => {
    const info = getSubclassPresentation(classId, subclass.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-pill";
    if (state.levelUpDraft.subclass === subclass.id) button.classList.add("active");
    button.innerHTML = `<strong>${subclass.name}</strong><span>${info.summary}</span><ul>${info.features
      .map((feature) => `<li>${feature}</li>`)
      .join("")}</ul>`;
    button.addEventListener("click", () => {
      state.levelUpDraft.subclass = subclass.id;
      renderLevelUpValidation();
      renderSubclassPills();
    });
    elements.subclassPills.append(button);
  });
}

function showLevelUp() {
  const level = getCurrentLevelUpLevel();
  const progression = getCurrentLevelProgression();
  state.levelUpDraft = { stat: null, subclass: shouldChooseSubclassForLevelUp(level) ? null : state.player.subclassId, progressionChoice: null };
  elements.levelUpScreen.hidden = false;
  elements.levelUpText.textContent =
    state.pendingLevelUps > 1
      ? `${state.player.name} is resolving level ${level}. Choose one improvement now. ${state.pendingLevelUps} level-ups remain.`
      : `${state.player.name} reached level ${level}. Choose one improvement to continue the journey.`;
  const levelNotes = [];
  if ((progression.skills ?? []).length) levelNotes.push(`Unlocks: ${(progression.skills ?? []).map((skillId) => getSkillById(skillId, state.player)?.name ?? skillId).join(", ")}`);
  if ((progression.upgrades ?? []).length) levelNotes.push(`Major upgrade: ${(progression.upgrades ?? []).map((upgradeId) => skillUpgrades[upgradeId]?.name ?? upgradeId).join(", ")}`);
  if (progression.choice) levelNotes.push("Choice: unlock a new skill or upgrade an existing one.");
  if (progression.subclass) levelNotes.push("Subclass selection unlocks at this level.");
  elements.levelProgressionInfo.textContent = levelNotes.length ? levelNotes.join(" ") : "This level grants your stat increase.";
  elements.subclassSection.hidden = !shouldChooseSubclassForLevelUp(level);
  elements.progressionChoiceSection.hidden = !progression.choice;
  renderLevelUpStatPills();
  if (shouldChooseSubclassForLevelUp(level)) renderSubclassPills();
  if (progression.choice) renderProgressionChoicePills();
  renderLevelUpValidation();
}

function renderLevelUpValidation() {
  const stat = state.levelUpDraft.stat;
  if (!stat) {
    elements.levelValidationText.textContent = "Choose one stat to increase.";
    elements.applyLevelButton.disabled = true;
    return;
  }
  if (state.player.stats[stat] >= MAX_STAT) {
    elements.levelValidationText.textContent = `${titleCase(stat)} is already ${MAX_STAT}.`;
    elements.applyLevelButton.disabled = true;
    return;
  }
  if (shouldChooseSubclassForLevelUp() && !state.levelUpDraft.subclass) {
    elements.levelValidationText.textContent = "Choose a subclass before confirming.";
    elements.applyLevelButton.disabled = true;
    return;
  }
  if (getCurrentLevelProgression().choice && !state.levelUpDraft.progressionChoice) {
    elements.levelValidationText.textContent = "Choose a skill or upgrade before confirming.";
    elements.applyLevelButton.disabled = true;
    return;
  }
  elements.levelValidationText.textContent = "";
  elements.applyLevelButton.disabled = false;
}

function applyLevelUp() {
  if (state.pendingLevelUps <= 0) return;
  const level = getCurrentLevelUpLevel();
  const stat = state.levelUpDraft.stat;
  if (!stat || state.player.stats[stat] >= MAX_STAT) {
    renderLevelUpValidation();
    return;
  }

  const oldMaxHp = state.player.maxHp;
  const oldMaxMana = state.player.maxMana;
  const oldMaxStamina = state.player.maxStamina;
  const shouldChooseSubclass = shouldChooseSubclassForLevelUp(level);
  state.player.stats[stat] = clamp(state.player.stats[stat] + 1, MIN_STAT, MAX_STAT);
  recalculateHp(state.player, oldMaxHp);
  recalculateResources(state.player, oldMaxMana, oldMaxStamina);
  if (shouldChooseSubclass) {
    state.player.subclassId = state.levelUpDraft.subclass;
    addLog(`${state.player.name} chooses ${getSubclassDef(state.player).name}.`);
  }
  const progressionResults = applyProgressionForLevel(state.player, level);
  if (progressionResults.length) {
    state.lastProgressionResults = progressionResults;
  }
  state.pendingLevelQueue.shift();
  state.pendingLevelUps -= 1;
  addLog(
    `${state.player.name} gains +1 ${titleCase(stat)}. Max HP is now ${state.player.maxHp}, Mana ${state.player.maxMana}, Stamina ${state.player.maxStamina}.`
  );
  state.levelUpDraft = { stat: null, subclass: null, progressionChoice: null };
  elements.levelUpScreen.hidden = true;
  if (state.lastProgressionResults.length > 0) {
    showProgressionModal();
  } else if (state.pendingLevelUps > 0) {
    showLevelUp();
  } else {
    completeVictoryIfReady();
  }
  renderCombat();
  void saveAdventure("level up");
}

function startTurn(combatant) {
  if (state.turnStarted) return true;
  state.turnStarted = true;
  if (combatant.id === "player") {
    tickSkillCooldowns(combatant);
  }
  tickStatuses(combatant, "start");
  if (state.winner) return false;
  if (hasStatus(combatant, "stun")) {
    addLog(`${combatant.name} is Stunned and loses this action.`);
    const stun = combatant.statuses.find((status) => status.id === "stun");
    stun.duration = 0;
    combatant.statuses = combatant.statuses.filter((status) => status.duration > 0);
    if (combatant.id === "player") {
      state.majorActionUsed = true;
      state.minorActionsUsed = 1;
      syncActionState();
    } else {
      state.actionUsed = true;
    }
    return false;
  }
  return true;
}

function endTurn(combatant) {
  tickStatuses(combatant, "end");
}

function advanceTurn() {
  if (state.winner) {
    renderCombat();
    return;
  }

  endTurn(currentCombatant());
  if (state.winner) {
    renderCombat();
    return;
  }

  state.turnIndex += 1;
  if (state.turnIndex >= state.initiative.length) {
    state.turnIndex = 0;
    state.round += 1;
  }
  state.turnStarted = false;
  if (currentCombatant()?.id === "player") {
    resetPlayerTurnActions();
  } else {
    state.actionUsed = false;
  }
  renderCombat();
  maybeRunEnemyTurn();
}

function performPrimaryAction() {
  if (currentCombatant()?.id !== "player") return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  if (!canUseMajorAction()) {
    renderCombat();
    return;
  }
  const prepared = takePreparedAttackModifier(state.player.weapon);
  resolveAttack(state.player, prepared.attack);
  const followUpPenalty = prepared.attack.followUpPenalty ?? state.player.weapon.extraAttackPenalty;
  if (!state.winner && followUpPenalty !== undefined) {
    resolveAttack(state.player, prepared.attack, {
      extraHitBonus: followUpPenalty,
      followUp: true,
    });
  }
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function maybeRunEnemyTurn() {
  if (state.winner || currentCombatant()?.id !== "enemy" || state.isResolvingEnemyTurn) return;
  state.isResolvingEnemyTurn = true;
  addLog("Enemy turn begins.");
  renderCombat();
  window.setTimeout(() => {
    if (startTurn(state.enemy)) {
      resolveAttack(state.enemy);
      tickStatuses(state.enemy, "afterAct");
    }
    state.isResolvingEnemyTurn = false;
    renderCombat();
    window.setTimeout(advanceTurn, 450);
  }, 700);
}

function endPlayerTurnEarly() {
  if (state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.isResolvingEnemyTurn || state.winner) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  addLog(`${state.player.name} ends turn.`);
  renderCombat();
  window.setTimeout(advanceTurn, 450);
}

[elements.nameInput, elements.descriptionInput, elements.mindInput, elements.bodyInput, elements.soulInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input !== elements.nameInput && input !== elements.descriptionInput) enforceStatBudget(input);
    renderBuilder();
  });
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => switchPlayerTab(button.dataset.tab));
});
elements.codexButton.addEventListener("click", showCodexModal);

elements.weaponSelect.addEventListener("change", renderBuilder);
elements.armorSelect.addEventListener("change", renderBuilder);
elements.startButton.addEventListener("click", startCombat);
elements.attackButton.addEventListener("click", performPrimaryAction);
elements.majorSkillButton.addEventListener("click", useSelectedSkill);
elements.minorSkillButton.addEventListener("click", useSelectedSkill);
elements.clearSkillButton.addEventListener("click", () => {
  if (state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.isResolvingEnemyTurn) return;
  state.player.selectedSkillId = null;
  addLog(`${state.player.name} clears the prepared skill.`);
  renderCombat();
});
elements.endTurnButton.addEventListener("click", endPlayerTurnEarly);
elements.nextEncounterButton.addEventListener("click", startNextEncounter);
elements.rewardContinueButton.addEventListener("click", hideRewardModal);
elements.progressionContinueButton.addEventListener("click", hideProgressionModal);
elements.infoCloseButton.addEventListener("click", hideInfoModal);
elements.codexCloseButton.addEventListener("click", hideCodexModal);
elements.innButton.addEventListener("click", stayAtInn);
elements.inventoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-use-item]");
  if (button) {
    useConsumableItem(button.dataset.useItem);
    return;
  }
  const toggle = event.target.closest("[data-toggle-inventory-item]");
  if (!toggle) return;
  toggleExpandedItem("expandedInventoryItems", toggle.dataset.toggleInventoryItem);
  renderInventory();
});
elements.shopList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-buy-item]");
  if (button) {
    buyConsumable(button.dataset.buyItem);
    return;
  }
  const toggle = event.target.closest("[data-toggle-shop-item]");
  if (!toggle) return;
  toggleExpandedItem("expandedShopItems", toggle.dataset.toggleShopItem);
  renderShop();
});
elements.resetButton.addEventListener("click", resetToBuilder);
elements.applyLevelButton.addEventListener("click", applyLevelUp);
elements.loginButton.addEventListener("click", () => loginOrSignup("login"));
elements.signupButton.addEventListener("click", () => loginOrSignup("signup"));
[
  elements.authUsername,
  elements.authPassword,
].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    loginOrSignup("login");
  });
});
elements.logoutButton.addEventListener("click", logoutUser);
elements.graveyardButton.addEventListener("click", () => {
  renderGraveyard();
  activeScreen("graveyard");
});
elements.backToHubButton.addEventListener("click", () => {
  renderHub();
  activeScreen("hub");
});
elements.adventureSlots.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const continueId = target.dataset.continue;
  const deleteId = target.dataset.delete;
  if (continueId) {
    try {
      await continueAdventure(continueId);
    } catch (error) {
      elements.hubValidationText.textContent = error.message;
    }
    return;
  }
  if (deleteId) {
    if (window.confirm("Delete this adventure permanently?")) {
      try {
        await apiRequest(`/api/adventures/${deleteId}`, { method: "DELETE" });
        await refreshHub();
      } catch (error) {
        elements.hubValidationText.textContent = error.message;
      }
    }
    return;
  }
  if (target.dataset.newSlot !== undefined) {
    prepareNewAdventure();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const infoTarget = target.closest("[data-info-title][data-info-body]");
  if (!infoTarget) return;
  event.preventDefault();
  showInfoModal(infoTarget.dataset.infoTitle, infoTarget.dataset.infoBody);
});

document.addEventListener("pointerdown", resumeScreenMusicFromInteraction);
document.addEventListener("keydown", resumeScreenMusicFromInteraction);
[elements.battleMusic, elements.battleMusicAlt].forEach((audio) => {
  audio?.addEventListener("ended", () => {
    if (state.gameState !== GAME_STATES.inCombat || elements.combatScreen.hidden) return;
    if (state.activeMusicKey && getMusicElement(state.activeMusicKey) !== audio) return;
    const nextTrack = getNextBattleMusicTrack();
    state.currentBattleTrack = nextTrack;
    crossfadeToMusic(getBattlePlaybackKey(true), nextTrack, { loop: false });
  });
});

renderBuilder();
activeScreen("auth");
bootSession();
