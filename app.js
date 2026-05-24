const STAT_LIMIT = 10;
const MIN_STAT = 1;
const CREATION_MAX_STAT = 10;
const MAX_STAT = 60;
const MAX_LEVEL = 20;
const BASE_AC = 10;
const TURN_ADVANCE_DELAY_MS = 300;
const ENEMY_ACTION_DELAY_MS = 450;
const XP_THRESHOLDS = [
  0,
  120,
  360,
  1100,
  2800,
  6200,
  12500,
  21000,
  33000,
  49000,
  70000,
  94000,
  122000,
  155000,
  192000,
  234000,
  282000,
  336000,
  396000,
  465000,
];
const BANDAGE_PRICE = { copper: 5, silver: 0, gold: 0 };
const WARMING_SALVE_PRICE = { copper: 8, silver: 0, gold: 0 };
const ANTITOXIN_PRICE = { copper: 0, silver: 1, gold: 0 };
const SOOTHING_BALM_PRICE = { copper: 8, silver: 0, gold: 0 };
const SMELLING_SALTS_PRICE = { copper: 0, silver: 1, gold: 0 };
const INN_PRICE = { copper: 0, silver: 3, gold: 0 };
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
  { id: "undisclosed", label: "Undisclosed" },
];

const CLASS_PORTRAITS = {
  warrior: {
    male: "assets/portraits/classes/Warrior_Male.png",
    female: "assets/portraits/classes/Warrior_Female.png",
    undisclosed: "assets/portraits/classes/Warrior_Undiclosed.png",
  },
  monk: {
    male: "assets/portraits/classes/Monk_Male.png",
    female: "assets/portraits/classes/Monk_Female.png",
    undisclosed: "assets/portraits/classes/Monk_Undisclosed.png",
  },
  magician: {
    male: "assets/portraits/classes/Magician_Male.png",
    female: "assets/portraits/classes/Magician_Female.png",
    undisclosed: "assets/portraits/classes/Magician_Undisclosed.png",
  },
  guardian: {
    male: "assets/portraits/classes/Guardian_Male.png",
    female: "assets/portraits/classes/Guardian_Female.png",
    undisclosed: "assets/portraits/classes/Guardian_Undiclosed.png",
  },
  rogue: {
    male: "assets/portraits/classes/Rogue_Male.png",
    female: "assets/portraits/classes/Rogue_Female.png",
    undisclosed: "assets/portraits/classes/Rogue_Undiclosed.png",
  },
  sorcerer: {
    male: "assets/portraits/classes/Sorcerer_Male.png",
    female: "assets/portraits/classes/Sorcerer_Female.png",
    undisclosed: "assets/portraits/classes/Sorcerer_Undisclosed.png",
  },
  paladin: {
    male: "assets/portraits/classes/Paladin_Male.png",
    female: "assets/portraits/classes/Paladin_Female.png",
    undisclosed: "assets/portraits/classes/Paladin_Undiclosed.png",
  },
  mystic: {
    male: "assets/portraits/classes/Mystic_Male.png",
    female: "assets/portraits/classes/Mystic_Female.png",
    undisclosed: "assets/portraits/classes/Mystic_Undiclosed.png",
  },
};

const ADVENTURE_BACKGROUNDS = Array.from({ length: 9 }, (_, index) =>
  `assets/backgrounds/adventure/adventure-${String(index + 1).padStart(3, "0")}.jpg`
);

const INN_BACKGROUNDS = Array.from({ length: 4 }, (_, index) =>
  `assets/backgrounds/inn/inn-${String(index + 1).padStart(3, "0")}.jpg`
);

const ENEMY_PORTRAITS = {
  goblin: { icon: "â—£", accent: "#6ec46a", bg: "radial-gradient(circle at 35% 30%, rgba(110, 196, 106, 0.28), rgba(19, 28, 20, 0.94))" },
  wolf: { icon: "â—ˆ", accent: "#91a8bd", bg: "radial-gradient(circle at 35% 30%, rgba(145, 168, 189, 0.25), rgba(18, 24, 30, 0.94))" },
  bandit: { icon: "âœ¦", accent: "#c79767", bg: "radial-gradient(circle at 35% 30%, rgba(199, 151, 103, 0.26), rgba(31, 22, 18, 0.94))" },
  skeleton: { icon: "â˜ ", accent: "#d8d5c8", bg: "radial-gradient(circle at 35% 30%, rgba(216, 213, 200, 0.22), rgba(24, 24, 26, 0.95))" },
  apprenticeMage: { icon: "âœ¶", accent: "#81a7ff", bg: "radial-gradient(circle at 35% 30%, rgba(129, 167, 255, 0.28), rgba(19, 21, 34, 0.95))" },
  default: { icon: "â—†", accent: "#a8b1bb", bg: "radial-gradient(circle at 35% 30%, rgba(168, 177, 187, 0.22), rgba(21, 24, 28, 0.95))" },
};

Object.assign(ENEMY_PORTRAITS, {
  goblin: { src: "assets/portraits/enemies/Goblin.png", accent: "#6ec46a", bg: "radial-gradient(circle at 35% 30%, rgba(110, 196, 106, 0.28), rgba(19, 28, 20, 0.94))" },
  wolf: { src: "assets/portraits/enemies/Wolf.png", accent: "#91a8bd", bg: "radial-gradient(circle at 35% 30%, rgba(145, 168, 189, 0.25), rgba(18, 24, 30, 0.94))" },
  bandit: { src: "assets/portraits/enemies/Bandit.png", accent: "#c79767", bg: "radial-gradient(circle at 35% 30%, rgba(199, 151, 103, 0.26), rgba(31, 22, 18, 0.94))" },
  skeleton: { src: "assets/portraits/enemies/Skeleton.png", accent: "#d8d5c8", bg: "radial-gradient(circle at 35% 30%, rgba(216, 213, 200, 0.22), rgba(24, 24, 26, 0.95))" },
  apprenticeMage: { src: "assets/portraits/enemies/Apprentice Mage.png", accent: "#81a7ff", bg: "radial-gradient(circle at 35% 30%, rgba(129, 167, 255, 0.28), rgba(19, 21, 34, 0.95))" },
  default: { icon: "?", accent: "#a8b1bb", bg: "radial-gradient(circle at 35% 30%, rgba(168, 177, 187, 0.22), rgba(21, 24, 28, 0.95))" },
});

[
  "Cave Rat",
  "Rabid Dog",
  "Forest Imp",
  "Mudling",
  "Grave Robber",
  "Ash Sprite",
  "Kobold Scout",
  "Kobold Slinger",
  "Ash Drake Whelp",
  "Goblin Knife-Chief",
  "Alpha Wolf",
  "Bone Collector",
  "Hobgoblin",
  "Dire Wolf",
  "Cultist",
  "Marauder",
  "Bone Archer",
  "Ash Hound",
  "Thorn Witch",
  "Ironbound Thug",
  "Plague Rat Swarm",
  "Kobold Dragonshield",
  "Cave Drake",
  "Venomscale Kobold",
  "Hobgoblin Warcaptain",
  "Cult Highspeaker",
  "Dire Wolf Matriarch",
  "Ogre",
  "Wraith",
  "Veteran Bandit",
  "Grave Witch",
  "Stoneback Boar",
  "Ember Revenant",
  "Venom Assassin",
  "Hollow Knight",
  "Storm Adept",
  "Deepwood Troll",
  "Ember Drake",
  "Kobold Flamecaller",
  "Storm Drake",
  "Ogre Bonecrusher",
  "Wraith of the Old Road",
  "Bandit King",
  "Bone Knight",
  "Flame Adept",
  "Shadow Stalker",
  "Iron Revenant",
  "Frostbound Giant",
  "Void Priest",
  "Bloodthorn Matron",
  "Lesser Ash Drake",
  "Nightblade Duelist",
  "Plague Necromancer",
  "Frost Drake",
  "Kobold Dragon Priest",
  "Bone Knight Commander",
  "Flame Oracle",
  "Shadow Stalker Prime",
  "Iron Troll",
  "Storm Acolyte",
  "Grave Champion",
  "Void Reaver",
  "Ancient Wraith",
  "Hellfire Warlock",
  "Storm Tyrant",
  "Obsidian Colossus",
  "Astral Devourer",
  "Fallen Seraph",
  "Void Drake",
  "Elder Flame Drake",
  "The Grave King",
  "Worldfire Archon",
  "The Soul Eater",
  "Dragonbound Kobold King",
].forEach((enemyName) => {
  const id = enemyName.charAt(0).toLowerCase() + enemyName.slice(1).replace(/[^A-Za-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  ENEMY_PORTRAITS[id] = {
    src: `assets/portraits/enemies/${enemyName}.png`,
    accent: ENEMY_PORTRAITS.default.accent,
    bg: ENEMY_PORTRAITS.default.bg,
  };
});

const WEAPON_IMAGE_FALLBACK = "assets/weapons/default.png";
const weaponImages = {
  sword: "assets/weapons/sword.png",
  axe: "assets/weapons/axe.png",
  bow: "assets/weapons/bow.png",
  staff: "assets/weapons/staff.png",
  dagger: "assets/weapons/dagger.png",
  unarmed: "assets/weapons/unarmed.png",
  wand: "assets/weapons/wand.png",
  flameWand: "assets/weapons/flame-wand.png",
  heavyClub: WEAPON_IMAGE_FALLBACK,
  shadowBlade: WEAPON_IMAGE_FALLBACK,
  stormRod: WEAPON_IMAGE_FALLBACK,
  boneSword: WEAPON_IMAGE_FALLBACK,
  trollFist: WEAPON_IMAGE_FALLBACK,
};

const ARMOR_IMAGE_FALLBACK = "assets/armor/no-armor.png";
const armorImages = {
  none: "assets/armor/no-armor.png",
  light: "assets/armor/light-armor.png",
  medium: "assets/armor/medium-armor.png",
  heavy: "assets/armor/heavy-armor.png",
  scraps: "assets/armor/light-armor.png",
  hide: "assets/armor/light-armor.png",
  bone: "assets/armor/heavy-armor.png",
  robe: "assets/armor/no-armor.png",
};

const itemImages = {
  antitoxin: "assets/items/antitoxin.png",
  bandage: "assets/items/bandage.png",
  minorHealthPotion: "assets/items/Health Potion - Minor.png",
  majorHealthPotion: "assets/items/Health Potion - Major.png",
  advancedHealthPotion: "assets/items/Health Potion - Advanced.png",
  magicalHealthPotion: "assets/items/Health Potion - Magical.png",
  minorManaPotion: "assets/items/Mana Potion - Minor.png",
  majorManaPotion: "assets/items/Mana Potion - Major.png",
  advancedManaPotion: "assets/items/Mana Potion - Advanced.png",
  magicalManaPotion: "assets/items/Mana Potion - Magical.png",
  smellingSalts: "assets/items/smelling salts.png",
  soothingBalm: "assets/items/soothing balm.png",
  minorStaminaPotion: "assets/items/Stamina Potion - Minor.png",
  majorStaminaPotion: "assets/items/Stamina Potion - Major.png",
  advancedStaminaPotion: "assets/items/Stamina Potion - Advanced.png",
  magicalStaminaPotion: "assets/items/Stamina Potion - Magical.png",
  warmingSalve: "assets/items/warming salve.png",
};

const weaponSellValues = {
  sword: { copper: 0, silver: 1, gold: 0 },
  axe: { copper: 0, silver: 1, gold: 0 },
  bow: { copper: 0, silver: 1, gold: 0 },
  staff: { copper: 5, silver: 0, gold: 0 },
  dagger: { copper: 5, silver: 0, gold: 0 },
  unarmed: { copper: 0, silver: 0, gold: 0 },
  wand: { copper: 5, silver: 0, gold: 0 },
  flameWand: { copper: 0, silver: 2, gold: 0 },
  crudeBlade: { copper: 5, silver: 0, gold: 0 },
  boneClub: { copper: 4, silver: 0, gold: 0 },
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
  weakened: {
    id: "weakened",
    name: "Weakened",
    duration: 2,
    color: "weakened",
    negative: true,
    tooltip: "Deals reduced damage while weakened.",
    removableBy: [],
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
  vanished: {
    name: "Vanished",
    duration: 1,
    defenseBonus: 3,
    color: "shielded",
    negative: false,
    tooltip: "+3 Defense and enemies suffer -1 to hit until your next turn.",
    removableBy: [],
    expiresAtStartOfNextPlayerTurn: true,
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
    restorePercent: 0.05,
    description: "Restore 5% of max HP.",
  },
  majorHealthPotion: {
    id: "majorHealthPotion",
    name: "Major Health Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 1 },
    restoreType: "hp",
    restorePercent: 0.25,
    description: "Restore 25% of max HP.",
  },
  advancedHealthPotion: {
    id: "advancedHealthPotion",
    name: "Advanced Health Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 10 },
    restoreType: "hp",
    restorePercent: 0.4,
    description: "Restore 40% of max HP.",
  },
  magicalHealthPotion: {
    id: "magicalHealthPotion",
    name: "Magical Health Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 100 },
    restoreType: "hp",
    restorePercent: 0.8,
    description: "Restore 80% of max HP.",
  },
  minorManaPotion: {
    id: "minorManaPotion",
    name: "Minor Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 1, gold: 0 },
    restoreType: "mana",
    restorePercent: 0.05,
    description: "Restore 5% of max Mana.",
  },
  majorManaPotion: {
    id: "majorManaPotion",
    name: "Major Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 1 },
    restoreType: "mana",
    restorePercent: 0.25,
    description: "Restore 25% of max Mana.",
  },
  advancedManaPotion: {
    id: "advancedManaPotion",
    name: "Advanced Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 10 },
    restoreType: "mana",
    restorePercent: 0.4,
    description: "Restore 40% of max Mana.",
  },
  magicalManaPotion: {
    id: "magicalManaPotion",
    name: "Magical Mana Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 100 },
    restoreType: "mana",
    restorePercent: 0.8,
    description: "Restore 80% of max Mana.",
  },
  minorStaminaPotion: {
    id: "minorStaminaPotion",
    name: "Minor Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 1, gold: 0 },
    restoreType: "stamina",
    restorePercent: 0.05,
    description: "Restore 5% of max Stamina.",
  },
  majorStaminaPotion: {
    id: "majorStaminaPotion",
    name: "Major Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 1 },
    restoreType: "stamina",
    restorePercent: 0.25,
    description: "Restore 25% of max Stamina.",
  },
  advancedStaminaPotion: {
    id: "advancedStaminaPotion",
    name: "Advanced Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 10 },
    restoreType: "stamina",
    restorePercent: 0.4,
    description: "Restore 40% of max Stamina.",
  },
  magicalStaminaPotion: {
    id: "magicalStaminaPotion",
    name: "Magical Stamina Potion",
    actionType: "minor",
    type: "potion",
    cost: { copper: 0, silver: 0, gold: 100 },
    restoreType: "stamina",
    restorePercent: 0.8,
    description: "Restore 80% of max Stamina.",
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
  mind: "Mind improves psionic skills, perception, deception, and status chances that scale from thought or focus.",
  body: "Body improves weapon attacks, physical checks, max HP, and max Stamina.",
  soul: "Soul improves spellcasting, magical skills, max Mana, and spiritual effects.",
};

const levelUpStatDescriptions = {
  mind:
    "+1 Mind - improves psionics, perception, deception, and Mind-based status chances.",
  body:
    "+1 Body - improves weapon attacks and physical checks, and increases max HP and Stamina.",
  soul:
    "+1 Soul - improves spellcasting and Soul skills, and increases max Mana.",
};

const subclassDescriptions = {
  warrior: {
    berserker: {
      summary: "High damage path that hits harder but takes more risk.",
      features: ["Strength: burst damage", "Weakness: lower Defense"],
    },
    defender: {
      summary: "Defensive path that survives longer but hits less explosively.",
      features: ["Strength: Defense", "Weakness: lower damage"],
    },
  },
  magician: {
    elementalist: {
      summary: "Element path for stronger fire, ice, and lightning pressure.",
      features: ["Strength: elemental damage", "Weakness: resource pressure"],
    },
    sage: {
      summary: "Control path that favors accuracy, insight, and efficiency.",
      features: ["Strength: reliability", "Weakness: less burst"],
    },
  },
  monk: {
    body: {
      summary: "Physical path focused on unarmed pressure and resilience.",
      features: ["Strength: weapon rhythm", "Weakness: close-range focus"],
    },
    soul: {
      summary: "Spiritual path focused on Mana flow and mystical strikes.",
      features: ["Strength: support and control", "Weakness: split resources"],
    },
  },
  guardian: {
    bulwark: {
      summary: "Survival path that turns the Guardian into a wall.",
      features: ["Strength: damage reduction", "Weakness: slower offense"],
    },
    sentinel: {
      summary: "Counter path that punishes misses and controlled enemies.",
      features: ["Strength: counterplay", "Weakness: needs enemy openings"],
    },
  },
  rogue: {
    assassin: {
      summary: "Opening-strike path built to end fights quickly.",
      features: ["Strength: burst damage", "Weakness: relies on landing key hits"],
    },
    scout: {
      summary: "Evasive path that stays accurate and hard to pin down.",
      features: ["Strength: safety and tempo", "Weakness: lower burst"],
    },
  },
  sorcerer: {
    pyromancer: {
      summary: "Fire path that turns Burn into escalating damage.",
      features: ["Strength: fire damage", "Weakness: fire-resistant foes"],
    },
    stormcaller: {
      summary: "Storm-touched channeler who turns lightning into control.",
      features: ["Strength: lightning accuracy", "Weakness: needs control windows"],
    },
  },
  paladin: {
    oathkeeper: {
      summary: "Defensive oath path that protects and cleanses.",
      features: ["Strength: survival", "Weakness: slower finishers"],
    },
    avenger: {
      summary: "Offensive oath path that punishes weakened enemies.",
      features: ["Strength: holy burst", "Weakness: needs setup"],
    },
  },
  mystic: {
    seer: {
      summary: "Prediction path that avoids danger and lands key Mind attacks.",
      features: ["Strength: accuracy and avoidance", "Weakness: lighter damage"],
    },
    telekinetic: {
      summary: "Force path that adds damage and protection through willpower.",
      features: ["Strength: psionic damage", "Weakness: depends on Weakened setup"],
    },
  },
};

const classes = {
  warrior: {
    id: "warrior",
    name: "Warrior",
    icon: "ðŸ›¡ï¸",
    shortDescription: "Durable martial veteran.",
    creationTagline: "Strike first. Strike hard.",
    tooltipSummary: "+2 weapon hit, +1 Defense, +1 damage reduction, +2 Body checks",
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
    icon: "ðŸ”®",
    shortDescription: "Careful arcane caster.",
    creationTagline: "Study the impossible. Shape it.",
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
    name: "Ascendant",
    icon: "ðŸ¥‹",
    shortDescription: "Mobile fighter pursuing physical and spiritual perfection.",
    creationTagline: "Perfect the body. Master the self.",
    tooltipSummary: "+1 weapon hit, +1 Defense, +1 first attack hit, +1 Body checks, +1 Soul checks",
    weaponHitBonus: 1,
    spellHitBonus: 0,
    acBonus: 1,
    damageBonus: 0,
    damageReduction: 0,
    firstAttackHitBonus: 1,
    checkBonuses: { mind: 0, body: 1, soul: 1 },
    hasSpells: false,
    skillIds: ["flurry", "innerFocus"],
    playstyle: "Agile hybrid that mixes momentum attacks with disciplined self-buffing defense.",
    roleTag: "Hybrid",
  },
  guardian: {
    id: "guardian",
    name: "Guardian",
    icon: "ðŸ§±",
    shortDescription: "Wall-like defender built to absorb pressure.",
    creationTagline: "Stand firm. Endure everything.",
    tooltipSummary: "+3 Defense, +1 Body checks, reduce incoming damage by 2",
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
    name: "Stalker",
    icon: "ðŸ—¡ï¸",
    shortDescription: "Precision striker who moves unseen and punishes openings.",
    creationTagline: "Move unseen. Kill clean.",
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
    playstyle: "Patient hunter who spikes damage when fights are short and controlled.",
    roleTag: "Martial",
  },
  sorcerer: {
    id: "sorcerer",
    name: "Channeler",
    icon: "âš¡",
    shortDescription: "Explosive conduit for unstable elemental power.",
    creationTagline: "Power flows through you. Control is optional.",
    tooltipSummary: "+3 spell hit, +1 Soul checks, +1 spell damage, -1 Defense",
    weaponHitBonus: 0,
    spellHitBonus: 3,
    acBonus: -1,
    damageBonus: 1,
    damageReduction: 0,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 0, body: 0, soul: 1 },
    hasSpells: true,
    skillIds: ["sparkSurge", "frostMark"],
    playstyle: "High-damage caster that trades safety for stronger surges of power.",
    roleTag: "Caster",
  },
  paladin: {
    id: "paladin",
    name: "Justicar",
    icon: "âœ¨",
    shortDescription: "Judgment-bound knight with steady mixed offense.",
    creationTagline: "Judgment walks beside you.",
    tooltipSummary: "+1 weapon hit, +1 spell hit, +1 Defense, +1 Soul checks, +1 damage reduction",
    weaponHitBonus: 1,
    spellHitBonus: 1,
    acBonus: 1,
    damageBonus: 0,
    damageReduction: 1,
    firstAttackHitBonus: 0,
    checkBonuses: { mind: 0, body: 0, soul: 1 },
    hasSpells: true,
    skillIds: ["smite", "blessingStrike"],
    playstyle: "Hybrid front-liner that blends durability, support, and righteous burst turns.",
    roleTag: "Hybrid",
  },
  mystic: {
    id: "mystic",
    name: "Psion",
    icon: "ðŸ§ ",
    shortDescription: "Psionic adept who fights with pure Mind.",
    creationTagline: "Know the mind. Break the will.",
    tooltipSummary: "+2 spell hit, +2 Mind checks, +1 Defense, precise control skills",
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
    stormcaller: { id: "stormcaller", name: "Stormcaller", acBonus: 0, damageBonus: 0, checkBonuses: {} },
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

const classFeatures = {
  warrior: {
    core: {
      5: { id: "extraAttack", name: "Extra Attack", description: "Attack twice when using the basic Attack action." },
      10: { id: "relentlessStrikes", name: "Relentless Strikes", description: "Basic Attack makes three attacks." },
      13: { id: "veteransGrit", name: "Veteran's Grit", description: "Once per combat, survive a lethal hit at 1 HP." },
      15: { id: "executioner", name: "Executioner", description: "Deal bonus damage to enemies below 30% HP." },
      20: {
        id: "avatarOfWar",
        name: "Avatar of War",
        description: "Basic Attack makes four attacks. Once per combat, gain Guarded and bonus damage for one turn.",
      },
    },
    berserker: {
      3: { id: "frenzy", name: "Frenzy", description: "+1 attack, take +10% damage" },
      7: { id: "bloodlust", name: "Bloodlust", description: "Gain stacking +1 damage on hit" },
      15: { id: "reckless", name: "Reckless Slaughter", description: "+2 hit, enemies gain +2 hit vs you" },
      20: { id: "carnage", name: "God of Carnage", description: "Kill grants extra full attack action" },
    },
    defender: {
      3: { id: "shieldMastery", name: "Shield Mastery", description: "Gain weaker Guarded permanently" },
      7: { id: "ironWill", name: "Iron Will", description: "Immune to Stun" },
      10: { id: "fortress", name: "Fortress Stance", description: "Reduce damage by 3" },
      15: { id: "unbreakable", name: "Unbreakable", description: "Survive lethal damage once per combat" },
      20: { id: "livingWall", name: "Living Wall", description: "Reduce all damage by 50% for 1 turn" },
    },
  },
  rogue: {
    core: {
      5: { id: "sneakAttack", name: "Sneak Attack", description: "First successful hit each combat deals bonus damage." },
      10: { id: "shadowFlurry", name: "Shadow Flurry", description: "If your first attack hits, make a second quick attack." },
      13: { id: "evasion", name: "Evasion", description: "Once per combat, reduce damage from a heavy hit." },
      15: { id: "assassinate", name: "Assassinate", description: "First hit in combat critically strikes if it lands." },
      17: { id: "exploitWeakness", name: "Exploit Weakness", description: "Enemies suffering a negative status take bonus Rogue damage." },
      20: { id: "deathmark", name: "Deathmark", description: "Once per combat, mark a target. Your next hit against it deals double final damage." },
    },
    assassin: {
      3: { id: "deathsOpening", name: "Death's Opening", description: "First successful hit in combat deals +50% damage." },
      7: { id: "lethalPrecision", name: "Lethal Precision", description: "+10% crit chance." },
      10: { id: "killersRhythm", name: "Killer's Rhythm", description: "On kill, gain +1 attack once per turn." },
      15: { id: "assassinAssassinate", name: "Assassinate", description: "First hit each combat is a guaranteed critical if it hits." },
      20: { id: "perfectExecution", name: "Perfect Execution", description: "Once per combat, next hit deals double final damage." },
    },
    scout: {
      3: { id: "quickRead", name: "Quick Read", description: "+2 to hit on first attack each turn." },
      7: { id: "evasiveFootwork", name: "Evasive Footwork", description: "+1 Defense." },
      10: { id: "flowState", name: "Flow State", description: "Gain 1 Stamina each turn." },
      15: { id: "ghostStep", name: "Ghost Step", description: "Once per combat, avoid all damage from one attack." },
      20: { id: "untouchable", name: "Untouchable", description: "Enemies suffer -2 to hit against you." },
    },
  },
  magician: {
    core: {
      5: { id: "empoweredCasting", name: "Empowered Casting", description: "Spells deal +2 damage." },
      10: { id: "doubleCast", name: "Double Cast", description: "Once per combat, cast the same spell twice." },
      13: { id: "spellDiscipline", name: "Spell Discipline", description: "Spell Mana costs are reduced by 1, minimum 1." },
      15: { id: "arcaneSurge", name: "Arcane Surge", description: "Once per combat, your next spell ignores resistance." },
      17: { id: "spellEcho", name: "Spell Echo", description: "First spell each combat repeats for 50% damage." },
      20: { id: "masterOfMagic", name: "Master of Magic", description: "Once per combat, your next spell deals +100% final spell damage." },
    },
    elementalist: {
      3: { id: "elementalAttunement", name: "Elemental Attunement", description: "Fire, ice, and lightning spells deal +2 damage." },
      7: { id: "unstableElements", name: "Unstable Elements", description: "Elemental status effects are more likely to apply." },
      10: { id: "dualElements", name: "Dual Elements", description: "Once per combat, your next elemental spell can apply a second related status effect." },
      15: { id: "overchannel", name: "Overchannel", description: "Once per combat, your next spell deals +50% final damage." },
      20: { id: "cataclysm", name: "Cataclysm", description: "Once per combat, your next elemental spell deals +100% final damage." },
    },
    sage: {
      3: { id: "studiedCasting", name: "Studied Casting", description: "Spells gain +2 to hit." },
      7: { id: "manaEfficiency", name: "Mana Efficiency", description: "Spell Mana costs reduced by 1, minimum 1." },
      10: { id: "arcaneInsight", name: "Arcane Insight", description: "First spell each combat gains +2 hit and ignores hit penalties." },
      15: { id: "mindOverMatter", name: "Mind Over Matter", description: "Once per combat, avoid all damage from one attack." },
      20: { id: "perfectFocus", name: "Perfect Focus", description: "Once per combat, your next spell automatically hits." },
    },
  },
  monk: {
    core: {
      5: { id: "monkFlurryMastery", name: "Flurry Mastery", description: "Basic Attack strikes twice." },
      10: { id: "perfectFlow", name: "Perfect Flow", description: "Restore 1 Stamina at the start of each turn." },
      13: { id: "stillness", name: "Stillness", description: "Once per combat, automatically clear one negative status." },
      15: { id: "spiritStrikes", name: "Spirit Strikes", description: "Monk attacks deal bonus Soul damage." },
      17: { id: "innerReserve", name: "Inner Reserve", description: "Once per combat, restore Mana and Stamina." },
      20: { id: "transcendence", name: "Transcendence", description: "Always act first. Once per combat, take an extra full turn." },
    },
    body: {
      3: { id: "ironBody", name: "Iron Body", description: "Gain +1 Defense and stronger unarmed attacks." },
      7: { id: "flowingStrikes", name: "Flowing Strikes", description: "First attack each turn gains +2 hit." },
      10: { id: "endlessMotion", name: "Endless Motion", description: "Flurry attacks one additional time." },
      15: { id: "adamantSoul", name: "Adamant Soul", description: "Immune to Bleed and Stun." },
      20: { id: "livingWeapon", name: "Living Weapon", description: "Unarmed attacks strike four times and ignore damage reduction." },
    },
    soul: {
      3: { id: "innerLight", name: "Inner Light", description: "Monk skills gain +2 Soul damage." },
      7: { id: "spiritFlow", name: "Spirit Flow", description: "Restore 1 Mana each turn." },
      10: { id: "ghostStep", name: "Ghost Step", description: "Once per combat, avoid all damage from one attack." },
      15: { id: "astralFist", name: "Astral Fist", description: "Unarmed attacks deal bonus Soul damage and can Stun." },
      20: { id: "enlightenment", name: "Enlightenment", description: "Once per combat, take an extra full turn and gain Guarded." },
    },
  },
  guardian: {
    core: {
      5: { id: "shieldWall", name: "Shield Wall", description: "Gain passive damage reduction." },
      10: { id: "unbreakableLine", name: "Unbreakable Line", description: "Once per combat, reduce incoming damage to 0." },
      13: { id: "stoneblood", name: "Stoneblood", description: "Immune to Stun." },
      15: { id: "fortressHeart", name: "Fortress Heart", description: "All incoming damage is reduced." },
      17: { id: "lastStand", name: "Last Stand", description: "When below 30% HP, gain bonus Defense and damage reduction." },
      20: { id: "immovableBastion", name: "Immovable Bastion", description: "Once per combat, become nearly unbreakable for one full turn." },
    },
    bulwark: {
      3: { id: "reinforcedGuard", name: "Reinforced Guard", description: "Permanent Guarded and +1 Defense." },
      7: { id: "heavyMomentum", name: "Heavy Momentum", description: "Gain additional damage reduction while Guarded." },
      10: { id: "ironFortress", name: "Iron Fortress", description: "Immune to Stun and Frozen." },
      15: { id: "mountainStance", name: "Mountain Stance", description: "Reduce incoming damage by 25%." },
      20: { id: "eternalBastion", name: "Eternal Bastion", description: "Massively reduce incoming damage for one turn." },
    },
    sentinel: {
      3: { id: "watchfulEye", name: "Watchful Eye", description: "Enemies attacking you suffer -1 hit." },
      7: { id: "crushingCounter", name: "Crushing Counter", description: "After taking damage, next attack deals bonus damage." },
      10: { id: "relentlessGuard", name: "Relentless Guard", description: "Gain Guarded whenever you Stun an enemy." },
      15: { id: "dominatingPresence", name: "Dominating Presence", description: "Controlled enemies deal reduced damage." },
      20: { id: "judgmentWall", name: "Judgment Wall", description: "Missed attacks trigger counterattacks for one turn." },
    },
  },
  paladin: {
    core: {
      5: { id: "divineSmite", name: "Divine Smite", description: "Weapon attacks deal +2 holy damage." },
      10: { id: "sacredResolve", name: "Sacred Resolve", description: "Once per combat, survive lethal damage at 1 HP." },
      13: { id: "auraOfProtection", name: "Aura of Protection", description: "While Shielded, incoming damage is reduced." },
      15: { id: "holyJudgment", name: "Holy Judgment", description: "Attacks deal increased damage to enemies with negative statuses." },
      20: { id: "divineChampion", name: "Divine Champion", description: "Cleanse yourself, gain Shielded, and empower your next Smite or Blessed Strike." },
    },
    oathkeeper: {
      3: { id: "sacredVow", name: "Sacred Vow", description: "Gain +1 Defense while Shielded." },
      7: { id: "pureHeart", name: "Pure Heart", description: "Cleansing Light restores HP." },
      10: { id: "divineShelter", name: "Divine Shelter", description: "Once per combat, negate one incoming attack." },
      15: { id: "unbrokenOath", name: "Unbroken Oath", description: "Immune to Stun and Poison." },
      20: { id: "eternalOath", name: "Eternal Oath", description: "Gain Shielded and reduce incoming damage for one turn." },
    },
    avenger: {
      3: { id: "vengefulSmite", name: "Vengeful Smite", description: "Smite and Blessed Strike deal +2 damage." },
      7: { id: "judgmentBrand", name: "Judgment Brand", description: "Smite marks enemies for increased weapon damage." },
      10: { id: "relentlessVengeance", name: "Relentless Vengeance", description: "Defeating an enemy restores a Major Action." },
      15: { id: "righteousExecution", name: "Righteous Execution", description: "Weakened enemies take increased holy damage." },
      20: { id: "wrathIncarnate", name: "Wrath Incarnate", description: "Next Smite or Blessed Strike automatically crits and Stuns." },
    },
  },
  mystic: {
    core: {
      5: { id: "mindPierce", name: "Mind Pierce", description: "Mind attacks ignore 2 points of enemy Defense." },
      10: { id: "psychicEcho", name: "Psychic Echo", description: "Once per combat, repeat a successful Mind attack for reduced damage." },
      13: { id: "mentalFortress", name: "Mental Fortress", description: "Immune to Stun." },
      15: { id: "mentalOverload", name: "Mental Overload", description: "Mind attacks gain increased status chance." },
      17: { id: "psionicRecovery", name: "Psionic Recovery", description: "Once per combat, clear a negative status or restore HP." },
      20: { id: "trueSight", name: "True Sight", description: "Once per combat, your next Mind attack automatically hits and deals double damage." },
    },
    seer: {
      3: { id: "foresight", name: "Foresight", description: "First Mind attack each combat gains +2 hit." },
      7: { id: "premonition", name: "Premonition", description: "Once per combat, avoid one incoming attack." },
      10: { id: "openMind", name: "Open Mind", description: "Mind attacks ignore hit penalties." },
      15: { id: "paralyzingVision", name: "Paralyzing Vision", description: "Mind attacks that Stun or Freeze gain increased status chance." },
      20: { id: "perfectPrediction", name: "Perfect Prediction", description: "Once per combat, make the next enemy attack miss." },
    },
    telekinetic: {
      3: { id: "forcePush", name: "Force Push", description: "Mind attacks deal +2 psionic damage." },
      7: { id: "kineticShield", name: "Kinetic Shield", description: "Gain +1 Defense while Shielded." },
      10: { id: "crushingGrip", name: "Crushing Grip", description: "Weakened enemies take increased Mind damage." },
      15: { id: "invisibleHand", name: "Invisible Hand", description: "Once per combat, reduce incoming damage by 50%." },
      20: { id: "gravityBreak", name: "Gravity Break", description: "Once per combat, your next Mind attack deals double damage and Stuns." },
    },
  },
  sorcerer: {
    core: {
      5: { id: "sorcererArcaneSurge", name: "Arcane Surge", description: "Spells deal +3 damage." },
      10: { id: "chainCasting", name: "Chain Casting", description: "Spell hits twice." },
      13: { id: "rawPower", name: "Raw Power", description: "Spell damage increased." },
      15: { id: "overload", name: "Overload", description: "Once per combat, double spell damage." },
      17: { id: "wildCasting", name: "Wild Casting", description: "Spell effects become unpredictable." },
      20: { id: "arcaneCataclysm", name: "Arcane Cataclysm", description: "Massive spell damage burst." },
    },
    pyromancer: {
      3: { id: "burningSoul", name: "Burning Soul", description: "Fire spells deal +2 damage and Burn lasts longer." },
      7: { id: "kindling", name: "Kindling", description: "Burning enemies take increased fire damage." },
      10: { id: "firestorm", name: "Firestorm", description: "Next fire spell applies Burn automatically." },
      15: { id: "infernoHeart", name: "Inferno Heart", description: "Burn damage is doubled." },
      20: { id: "worldfire", name: "Worldfire", description: "Next fire spell deals double damage and applies Burn." },
    },
    stormcaller: {
      3: { id: "staticCharge", name: "Static Charge", description: "Lightning spells gain +2 hit." },
      7: { id: "conductiveShock", name: "Conductive Shock", description: "Stunned or Frozen enemies take more lightning damage." },
      10: { id: "arcJump", name: "Arc Jump", description: "Next lightning spell hits again for reduced damage." },
      15: { id: "thunderhead", name: "Thunderhead", description: "Stun chance increased." },
      20: { id: "stormAvatar", name: "Storm Avatar", description: "Next lightning spell auto-hits and deals double damage." },
    },
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
    special: "Quick weapon with precise openings",
    critMin: 20,
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
    special: "Ascendant gets +2 hit bonus",
    critMin: 20,
    monkHitBonus: 2,
    initiativeBonus: 0,
    status: null,
  },
  wand: {
    id: "wand",
    name: "Wand",
    attackKind: "spell",
    stat: "soul",
    attackBonus: 1,
    damageDice: { count: 1, sides: 4 },
    damageBonus: 0,
    damageType: "lightning",
    special: "+1 spell attack; basic arcane focus",
    critMin: 20,
    initiativeBonus: 0,
    status: null,
    spellAttackBonus: 1,
    sellValue: { copper: 5, silver: 0, gold: 0 },
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
  heavyClub: {
    id: "heavyClub",
    name: "Heavy Club",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 0,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 2,
    damageType: "physical",
    special: "Heavy enemy weapon",
    critMin: 20,
    initiativeBonus: -1,
    status: null,
    sellValue: { copper: 0, silver: 4, gold: 0 },
  },
  shadowBlade: {
    id: "shadowBlade",
    name: "Shadow Blade",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 2,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 2,
    damageType: "physical",
    special: "35% poison on hit",
    critMin: 19,
    initiativeBonus: 2,
    status: { id: "poison", chance: 0.35 },
    sellValue: { copper: 0, silver: 8, gold: 0 },
  },
  stormRod: {
    id: "stormRod",
    name: "Storm Rod",
    attackKind: "spell",
    stat: "soul",
    attackBonus: 2,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "lightning",
    special: "30% stun on hit",
    critMin: 20,
    initiativeBonus: 0,
    status: { id: "stun", chance: 0.3 },
    spellAttackBonus: 1,
    sellValue: { copper: 0, silver: 0, gold: 1 },
  },
  boneSword: {
    id: "boneSword",
    name: "Bone Sword",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 1,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "physical",
    special: "25% freeze on hit",
    critMin: 20,
    initiativeBonus: 0,
    status: { id: "freeze", chance: 0.25 },
    sellValue: { copper: 0, silver: 7, gold: 0 },
  },
  trollFist: {
    id: "trollFist",
    name: "Troll Fist",
    attackKind: "weapon",
    stat: "body",
    attackBonus: 0,
    damageDice: { count: 2, sides: 6 },
    damageBonus: 3,
    damageType: "physical",
    special: "Massive enemy strike",
    critMin: 20,
    initiativeBonus: -2,
    status: null,
    sellValue: { copper: 0, silver: 0, gold: 1 },
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

const classArmorIds = {
  warrior: "medium",
  rogue: "medium",
  monk: "light",
  magician: "none",
  sorcerer: "none",
  paladin: "heavy",
  guardian: "heavy",
  mystic: "light",
};

const classWeaponIds = {
  warrior: ["sword", "axe", "bow", "staff", "dagger", "unarmed"],
  guardian: ["sword", "axe", "staff", "unarmed"],
  rogue: ["sword", "bow", "dagger", "unarmed"],
  monk: ["staff", "dagger", "unarmed"],
  magician: ["staff", "wand", "dagger", "unarmed"],
  sorcerer: ["staff", "wand", "dagger", "unarmed"],
  paladin: ["sword", "axe", "staff", "unarmed"],
  mystic: ["staff", "dagger", "unarmed"],
};

const playableClassIds = ["guardian", "warrior", "rogue", "magician", "sorcerer", "monk", "paladin", "mystic"];

const legacyClassAliases = {
  guardian: "guardian",
  warrior: "warrior",
  rogue: "rogue",
  stalker: "rogue",
  mage: "magician",
  magician: "magician",
  sorcerer: "sorcerer",
  channeler: "sorcerer",
  monk: "monk",
  ascendant: "monk",
  paladin: "paladin",
  justicar: "paladin",
  mystic: "mystic",
  psion: "mystic",
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
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "A rapid sequence that adds light damage to the next strike.",
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
    actionType: "minor",
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
  flameLash: {
    id: "flameLash",
    name: "Flame Lash",
    classId: "sorcerer",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "fire",
    status: { id: "burn" },
    baseEffectChance: 20,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 70,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "A searing lash of flame with a reliable Burn chance.",
  },
  lightningChain: {
    id: "lightningChain",
    name: "Lightning Chain",
    classId: "sorcerer",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    damageDice: { count: 1, sides: 10 },
    damageBonus: 2,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 15,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 60,
    resourceType: "mana",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "Volatile lightning that can lock a foe in place.",
  },
  chaosBolt: {
    id: "chaosBolt",
    name: "Chaos Bolt",
    classId: "sorcerer",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    damageDice: { count: 1, sides: 12 },
    damageBonus: 2,
    damageType: "lightning",
    resourceType: "mana",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "Raw storm power shaped just enough to throw.",
  },
  stormBreaker: {
    id: "stormBreaker",
    name: "Storm Breaker",
    classId: "sorcerer",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    damageDice: { count: 2, sides: 10 },
    damageBonus: 3,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 25,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 75,
    resourceType: "mana",
    resourceCost: 5,
    cooldownTurns: 3,
    description: "A violent storm strike with a strong Stun chance.",
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
    name: "Blessed Strike",
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
    actionType: "minor",
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
  whirlwindCleave: {
    id: "whirlwindCleave",
    name: "Whirlwind Cleave",
    classId: "warrior",
    stat: "body",
    attackKind: "weapon",
    actionType: "major",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "physical",
    resourceType: "stamina",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "A sweeping strike meant to cut through multiple foes.",
  },
  secondWind: {
    id: "secondWind",
    name: "Second Wind",
    classId: "warrior",
    stat: "body",
    attackKind: "utility",
    actionType: "minor",
    mode: "standalone",
    hitBonus: 0,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 3,
    description: "Restore 20% max HP once per combat.",
  },
  skullbreaker: {
    id: "skullbreaker",
    name: "Skullbreaker",
    classId: "warrior",
    stat: "body",
    attackKind: "weapon",
    actionType: "major",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 12 },
    damageBonus: 3,
    damageType: "physical",
    status: { id: "stun" },
    baseEffectChance: 20,
    effectScalingStat: "soul",
    effectChancePerStat: 3,
    maxEffectChance: 65,
    resourceType: "stamina",
    resourceCost: 4,
    cooldownTurns: 3,
    description: "A brutal overhead strike with a strong chance to Stun.",
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
  manaWard: {
    id: "manaWard",
    name: "Mana Ward",
    classId: "magician",
    actionType: "minor",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    resourceType: "mana",
    resourceCost: 1,
    cooldownTurns: 3,
    description: "Restore a small amount of Mana or gain Shielded.",
  },
  meteorSpark: {
    id: "meteorSpark",
    name: "Meteor Spark",
    classId: "magician",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 12 },
    damageBonus: 4,
    damageType: "fire",
    status: { id: "burn" },
    baseEffectChance: 30,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 80,
    resourceType: "mana",
    resourceCost: 5,
    cooldownTurns: 3,
    description: "Call down a blazing arcane meteor with heavy fire damage and strong Burn chance.",
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
    actionType: "minor",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "guarded", chance: 1 },
    resourceType: "stamina",
    resourceCost: 1,
    cooldownTurns: 2,
    description: "Move with spiritual precision and gain Guarded until your next turn.",
  },
  kiBurst: {
    id: "kiBurst",
    name: "Ki Burst",
    classId: "monk",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 2,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 20,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 70,
    resourceType: "mana",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "Release focused spiritual force with a chance to Stun.",
  },
  hundredFists: {
    id: "hundredFists",
    name: "Hundred Fists",
    classId: "monk",
    actionType: "major",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 3,
    damageType: "physical",
    resourceType: "stamina",
    resourceCost: 4,
    cooldownTurns: 3,
    description: "A relentless storm of rapid strikes.",
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
  tauntingStrike: {
    id: "tauntingStrike",
    name: "Taunting Strike",
    classId: "guardian",
    actionType: "major",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 1,
    damageType: "physical",
    status: { id: "weakened", chance: 1 },
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "Strike with forceful presence, weakening the enemy's next attack.",
  },
  earthbreaker: {
    id: "earthbreaker",
    name: "Earthbreaker",
    classId: "guardian",
    actionType: "major",
    stat: "body",
    attackKind: "weapon",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 2, sides: 8 },
    damageBonus: 3,
    damageType: "physical",
    status: { id: "stun" },
    baseEffectChance: 25,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 75,
    resourceType: "stamina",
    resourceCost: 4,
    cooldownTurns: 3,
    description: "Smash the battlefield with a brutal strike that can Stun.",
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
  vanish: {
    id: "vanish",
    name: "Vanish",
    classId: "rogue",
    stat: "body",
    attackKind: "utility",
    actionType: "minor",
    mode: "standalone",
    hitBonus: 0,
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 3,
    description: "Slip out of reach, gaining temporary protection until your next turn.",
  },
  cripplingCut: {
    id: "cripplingCut",
    name: "Crippling Cut",
    classId: "rogue",
    stat: "body",
    attackKind: "weapon",
    actionType: "major",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    damageType: "physical",
    status: { id: "freeze" },
    baseEffectChance: 20,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 70,
    resourceType: "stamina",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "A precise disabling strike that can slow or lock down the target.",
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
    actionType: "minor",
    resourceType: "mana",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Minor action that removes one negative status from yourself.",
  },
  cleansingLight: {
    id: "cleansingLight",
    name: "Cleansing Light",
    classId: "paladin",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    canRemoveStatuses: "negative",
    statusRemovalLimit: 1,
    actionType: "minor",
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
  radiantCommand: {
    id: "radiantCommand",
    name: "Radiant Command",
    classId: "paladin",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 2,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 18,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 70,
    resourceType: "mana",
    resourceCost: 3,
    cooldownTurns: 2,
    description: "Issue a radiant command that strikes with holy force and may Stun.",
  },
  layOnHands: {
    id: "layOnHands",
    name: "Lay on Hands",
    classId: "paladin",
    actionType: "minor",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 3,
    description: "Once per combat, restore 25% max HP.",
  },
  wrathfulNova: {
    id: "wrathfulNova",
    name: "Wrathful Nova",
    classId: "paladin",
    actionType: "major",
    stat: "soul",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 2, sides: 10 },
    damageBonus: 3,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 30,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 85,
    resourceType: "mana",
    resourceCost: 5,
    cooldownTurns: 3,
    description: "Unleash a holy lightning nova with a strong chance to Stun.",
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
    actionType: "minor",
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
  thoughtRend: {
    id: "thoughtRend",
    name: "Thought Rend",
    classId: "mystic",
    actionType: "major",
    stat: "mind",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 1,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 2,
    damageType: "lightning",
    status: { id: "weakened", chance: 1 },
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 2,
    description: "Tear at the enemy's thoughts, weakening their attacks.",
  },
  voidThought: {
    id: "voidThought",
    name: "Void Thought",
    classId: "mystic",
    actionType: "major",
    stat: "mind",
    attackKind: "spell",
    mode: "standalone",
    hitBonus: 0,
    damageDice: { count: 2, sides: 10 },
    damageBonus: 4,
    damageType: "lightning",
    status: { id: "stun" },
    baseEffectChance: 30,
    effectScalingStat: "mind",
    effectChancePerStat: 4,
    maxEffectChance: 85,
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 3,
    description: "Drop the enemy into a void of thought with a strong chance to Stun.",
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
  hamstringMastery: {
    id: "hamstringMastery",
    targetSkillId: "hamstring",
    name: "Hamstring+",
    summary: "Hamstring deals more damage and applies Bleed more reliably.",
    changes: {
      name: "Hamstring+",
      damageBonus: 3,
      baseEffectChance: 34,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 82,
      cooldownTurns: 0,
      description: "A deeper cut with stronger Bleed pressure.",
    },
  },
  crushingBlowMastery: {
    id: "crushingBlowMastery",
    targetSkillId: "crushingBlow",
    name: "Crushing Blow+",
    summary: "Crushing Blow hits harder and stuns more reliably.",
    changes: {
      name: "Crushing Blow+",
      damageBonus: 4,
      baseEffectChance: 22,
      effectScalingStat: "soul",
      effectChancePerStat: 3,
      maxEffectChance: 56,
      cooldownTurns: 1,
      description: "A heavier blow with stronger Stun pressure.",
    },
  },
  whirlwindCleaveMastery: {
    id: "whirlwindCleaveMastery",
    targetSkillId: "whirlwindCleave",
    name: "Whirlwind Cleave+",
    summary: "Whirlwind Cleave costs less and hits harder.",
    changes: {
      name: "Whirlwind Cleave+",
      damageBonus: 4,
      resourceCost: 2,
      cooldownTurns: 1,
      singleTargetDamageBonusPercent: 0.4,
      description: "A stronger sweeping strike with less stamina strain.",
    },
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
  iceShardMastery: {
    id: "iceShardMastery",
    targetSkillId: "iceShard",
    name: "Ice Shard+",
    summary: "Ice Shard deals more damage and Freezes more reliably.",
    changes: {
      name: "Ice Shard+",
      damageBonus: 4,
      baseEffectChance: 34,
      maxEffectChance: 84,
      cooldownTurns: 0,
      description: "A sharper ice spell with heavier impact and a stronger Freeze chance.",
    },
  },
  arcanePulseMastery: {
    id: "arcanePulseMastery",
    targetSkillId: "arcanePulse",
    name: "Arcane Pulse+",
    summary: "Arcane Pulse becomes more accurate and Stuns more reliably.",
    changes: {
      name: "Arcane Pulse+",
      hitBonus: 2,
      damageBonus: 2,
      baseEffectChance: 18,
      maxEffectChance: 52,
      cooldownTurns: 0,
      description: "A focused pulse with cleaner aim and a stronger Stun chance.",
    },
  },
  manaWardMastery: {
    id: "manaWardMastery",
    targetSkillId: "manaWard",
    name: "Mana Ward+",
    summary: "Mana Ward costs less and recovers faster.",
    changes: {
      name: "Mana Ward+",
      resourceCost: 0,
      cooldownTurns: 2,
      description: "A refined ward that answers with almost no strain.",
    },
  },
  flurryMastery: {
    id: "flurryMastery",
    targetSkillId: "flurry",
    name: "Flurry+",
    summary: "Flurry lands more reliably and hits harder.",
    changes: { name: "Flurry+", hitBonus: 2, damageBonus: 2, cooldownTurns: 0, description: "A faster flurry that adds stronger pressure to the next strike." },
  },
  innerFocusMastery: {
    id: "innerFocusMastery",
    targetSkillId: "innerFocus",
    name: "Inner Focus+",
    summary: "Inner Focus becomes nearly effortless.",
    changes: { name: "Inner Focus+", resourceCost: 0, cooldownTurns: 0, description: "Center yourself without spending mana." },
  },
  risingPalmMastery: {
    id: "risingPalmMastery",
    targetSkillId: "risingPalm",
    name: "Rising Palm+",
    summary: "Rising Palm deals more damage and Stuns more reliably.",
    changes: {
      name: "Rising Palm+",
      damageBonus: 3,
      baseEffectChance: 24,
      effectScalingStat: "soul",
      effectChancePerStat: 4,
      maxEffectChance: 68,
      cooldownTurns: 0,
      description: "A stronger palm strike with more reliable Stun.",
    },
  },
  spiritStepMastery: {
    id: "spiritStepMastery",
    targetSkillId: "spiritStep",
    name: "Spirit Step+",
    summary: "Spirit Step grants stronger protection and recovers faster.",
    changes: {
      name: "Spirit Step+",
      cooldownTurns: 1,
      description: "Move with refined spiritual precision and stronger protection.",
    },
  },
  kiBurstMastery: {
    id: "kiBurstMastery",
    targetSkillId: "kiBurst",
    name: "Ki Burst+",
    summary: "Ki Burst deals more damage and Stuns more reliably.",
    changes: {
      name: "Ki Burst+",
      damageBonus: 4,
      baseEffectChance: 30,
      effectScalingStat: "soul",
      effectChancePerStat: 4,
      maxEffectChance: 80,
      cooldownTurns: 1,
      description: "A stronger burst of spiritual force with a sharper Stun chance.",
    },
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
  ironBashMastery: {
    id: "ironBashMastery",
    targetSkillId: "ironBash",
    name: "Iron Bash+",
    summary: "Iron Bash deals more damage and Stuns more reliably.",
    changes: {
      name: "Iron Bash+",
      damageBonus: 3,
      baseEffectChance: 26,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 70,
      cooldownTurns: 1,
      description: "A heavier shield slam with a sharper Stun chance.",
    },
  },
  bulwarkRushMastery: {
    id: "bulwarkRushMastery",
    targetSkillId: "bulwarkRush",
    name: "Bulwark Rush+",
    summary: "Bulwark Rush hits harder and grants stronger protection.",
    changes: {
      name: "Bulwark Rush+",
      damageBonus: 3,
      statusDurationBonus: 1,
      cooldownTurns: 1,
      description: "Crash forward with more force and longer-lasting Guarded.",
    },
  },
  tauntingStrikeMastery: {
    id: "tauntingStrikeMastery",
    targetSkillId: "tauntingStrike",
    name: "Taunting Strike+",
    summary: "Taunting Strike weakens enemies more reliably and recovers faster.",
    changes: {
      name: "Taunting Strike+",
      statusDurationBonus: 1,
      cooldownTurns: 1,
      description: "Strike with overwhelming presence, weakening the enemy for longer.",
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
  poisonEdgeMastery: {
    id: "poisonEdgeMastery",
    targetSkillId: "poisonEdge",
    name: "Poison Edge+",
    summary: "Poison Edge deals more damage and applies Poison more reliably.",
    changes: {
      name: "Poison Edge+",
      damageBonus: 3,
      baseEffectChance: 34,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 82,
      cooldownTurns: 0,
      description: "A sharper poisoned edge that bites deeper and applies Poison more reliably.",
    },
  },
  shadowThrowMastery: {
    id: "shadowThrowMastery",
    targetSkillId: "shadowThrow",
    name: "Shadow Throw+",
    summary: "Shadow Throw becomes more accurate and sharper.",
    changes: {
      name: "Shadow Throw+",
      hitBonus: 3,
      damageBonus: 3,
      baseEffectChance: 24,
      effectScalingStat: "soul",
      effectChancePerStat: 3,
      maxEffectChance: 62,
      cooldownTurns: 0,
      description: "A sharper shadow throw with better accuracy, stronger damage, and more reliable Poison.",
    },
  },
  vanishMastery: {
    id: "vanishMastery",
    targetSkillId: "vanish",
    name: "Vanish+",
    summary: "Vanish costs less and recovers faster.",
    changes: {
      name: "Vanish+",
      resourceCost: 1,
      cooldownTurns: 2,
      defenseBonus: 4,
      enemyHitPenalty: -2,
      description: "Slip fully into shadow, gaining stronger protection until your next turn.",
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
  flameLashMastery: {
    id: "flameLashMastery",
    targetSkillId: "flameLash",
    name: "Flame Lash+",
    summary: "Flame Lash burns hotter and applies Burn more reliably.",
    changes: {
      name: "Flame Lash+",
      damageBonus: 4,
      baseEffectChance: 30,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 80,
      cooldownTurns: 0,
      description: "A hotter lash of fire with a more reliable Burn.",
    },
  },
  lightningChainMastery: {
    id: "lightningChainMastery",
    targetSkillId: "lightningChain",
    name: "Lightning Chain+",
    summary: "Lightning Chain hits harder and Stuns more reliably.",
    changes: {
      name: "Lightning Chain+",
      damageBonus: 4,
      baseEffectChance: 23,
      effectScalingStat: "mind",
      effectChancePerStat: 4,
      maxEffectChance: 70,
      cooldownTurns: 1,
      description: "A sharper lightning chain with stronger damage and Stun chance.",
    },
  },
  chaosBoltMastery: {
    id: "chaosBoltMastery",
    targetSkillId: "chaosBolt",
    name: "Chaos Bolt+",
    summary: "Chaos Bolt becomes stronger and recovers faster.",
    changes: {
      name: "Chaos Bolt+",
      damageBonus: 4,
      cooldownTurns: 1,
      description: "A more volatile bolt with greater raw force and faster recovery.",
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
    name: "Blessed Strike+",
    summary: "Blessed Strike gains more force and no cooldown.",
    changes: { name: "Blessed Strike+", damageBonus: 3, statusDurationBonus: 1, cooldownTurns: 0, description: "A stronger blessed attack with longer-lasting protection." },
  },
  cleansingLightMastery: {
    id: "cleansingLightMastery",
    targetSkillId: "cleansingLight",
    name: "Cleansing Light+",
    summary: "Cleansing Light also restores HP and recovers faster.",
    changes: {
      name: "Cleansing Light+",
      healPercent: 0.1,
      cooldownTurns: 0,
      description: "Remove one negative status and restore a small amount of HP.",
    },
  },
  sanctifiedBladeMastery: {
    id: "sanctifiedBladeMastery",
    targetSkillId: "sanctifiedBlade",
    name: "Sanctified Blade+",
    summary: "Sanctified Blade hits harder and grants longer protection.",
    changes: {
      name: "Sanctified Blade+",
      damageBonus: 4,
      statusDurationBonus: 1,
      cooldownTurns: 0,
      description: "Bless the next strike with stronger radiant force and longer protection.",
    },
  },
  radiantCommandMastery: {
    id: "radiantCommandMastery",
    targetSkillId: "radiantCommand",
    name: "Radiant Command+",
    summary: "Radiant Command deals more damage, Stuns more reliably, and recovers faster.",
    changes: {
      name: "Radiant Command+",
      damageBonus: 4,
      baseEffectChance: 28,
      effectScalingStat: "soul",
      effectChancePerStat: 4,
      maxEffectChance: 80,
      cooldownTurns: 1,
      description: "A stronger radiant command with sharper Stun pressure.",
    },
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
    name: "Mental Ward+",
    summary: "Mental Ward grants longer protection and recovers faster.",
    changes: { name: "Mental Ward+", statusDurationBonus: 1, cooldownTurns: 1, description: "A stronger mental ward that recovers faster and grants longer protection." },
  },
  psychicVeilMastery: {
    id: "psychicVeilMastery",
    targetSkillId: "psychicVeil",
    name: "Psychic Veil+",
    summary: "Psychic Veil grants longer protection and recovers faster.",
    changes: {
      name: "Psychic Veil+",
      statusDurationBonus: 1,
      cooldownTurns: 0,
      description: "Raise a stronger psionic veil with longer-lasting protection.",
    },
  },
  mindLanceMastery: {
    id: "mindLanceMastery",
    targetSkillId: "mindLance",
    name: "Mind Lance+",
    summary: "Mind Lance deals more damage, Stuns more reliably, and recovers faster.",
    changes: {
      name: "Mind Lance+",
      damageBonus: 3,
      baseEffectChance: 22,
      effectScalingStat: "soul",
      effectChancePerStat: 4,
      maxEffectChance: 66,
      cooldownTurns: 0,
      description: "A sharper psionic spear with stronger Stun pressure.",
    },
  },
  thoughtRendMastery: {
    id: "thoughtRendMastery",
    targetSkillId: "thoughtRend",
    name: "Thought Rend+",
    summary: "Thought Rend deals more damage and Weakens for longer.",
    changes: {
      name: "Thought Rend+",
      damageBonus: 4,
      statusDurationBonus: 1,
      cooldownTurns: 1,
      description: "A deeper thought wound that Weakens for longer.",
    },
  },
};

const classSkillTrees = {
  warrior: {
    id: "warrior",
    name: "Warrior",
    levels: {
      1: { skills: ["powerStrike", "guardStance"] },
      2: { skills: ["hamstring"] },
      3: { subclass: true, subclassFeatures: { berserker: "frenzy", defender: "shieldMastery" } },
      4: { statIncrease: true },
      5: { features: ["extraAttack"] },
      6: { skills: ["crushingBlow"] },
      7: { subclassFeatures: { berserker: "bloodlust", defender: "ironWill" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["powerStrikeMastery", "guardStanceMastery"] } },
      10: { features: ["relentlessStrikes"], subclassFeatures: { defender: "fortress" } },
      11: { skills: ["whirlwindCleave"] },
      12: { statIncrease: true },
      13: { features: ["veteransGrit"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["hamstringMastery", "crushingBlowMastery"] } },
      15: { features: ["executioner"], subclassFeatures: { berserker: "reckless", defender: "unbreakable" } },
      16: { statIncrease: true },
      17: { skills: ["secondWind"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["skullbreaker"], upgrades: ["whirlwindCleaveMastery"] } },
      19: { statIncrease: true },
      20: { features: ["avatarOfWar"], subclassFeatures: { berserker: "carnage", defender: "livingWall" } },
    },
  },
  magician: {
    id: "magician",
    name: "Magician",
    levels: {
      1: { skills: ["fireBolt", "arcaneShield"] },
      2: { skills: ["iceShard"] },
      3: { subclass: true, subclassFeatures: { elementalist: "elementalAttunement", sage: "studiedCasting" } },
      4: { statIncrease: true },
      5: { features: ["empoweredCasting"] },
      6: { skills: ["arcanePulse"] },
      7: { subclassFeatures: { elementalist: "unstableElements", sage: "manaEfficiency" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["fireBoltMastery", "arcaneShieldMastery"] } },
      10: { features: ["doubleCast"], subclassFeatures: { elementalist: "dualElements", sage: "arcaneInsight" } },
      11: { skills: ["manaWard"] },
      12: { statIncrease: true },
      13: { features: ["spellDiscipline"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["iceShardMastery", "arcanePulseMastery"] } },
      15: { features: ["arcaneSurge"], subclassFeatures: { elementalist: "overchannel", sage: "mindOverMatter" } },
      16: { statIncrease: true },
      17: { features: ["spellEcho"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["meteorSpark"], upgrades: ["manaWardMastery"] } },
      19: { statIncrease: true },
      20: { features: ["masterOfMagic"], subclassFeatures: { elementalist: "cataclysm", sage: "perfectFocus" } },
    },
  },
  monk: {
    id: "monk",
    name: "Ascendant",
    levels: {
      1: { skills: ["flurry", "innerFocus"] },
      2: { skills: ["risingPalm"] },
      3: { subclass: true, subclassFeatures: { body: "ironBody", soul: "innerLight" } },
      4: { statIncrease: true },
      5: { features: ["monkFlurryMastery"] },
      6: { skills: ["spiritStep"] },
      7: { subclassFeatures: { body: "flowingStrikes", soul: "spiritFlow" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["flurryMastery", "innerFocusMastery"] } },
      10: { features: ["perfectFlow"], subclassFeatures: { body: "endlessMotion", soul: "ghostStep" } },
      11: { skills: ["kiBurst"] },
      12: { statIncrease: true },
      13: { features: ["stillness"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["risingPalmMastery", "spiritStepMastery"] } },
      15: { features: ["spiritStrikes"], subclassFeatures: { body: "adamantSoul", soul: "astralFist" } },
      16: { statIncrease: true },
      17: { features: ["innerReserve"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["hundredFists"], upgrades: ["kiBurstMastery"] } },
      19: { statIncrease: true },
      20: { features: ["transcendence"], subclassFeatures: { body: "livingWeapon", soul: "enlightenment" } },
    },
  },
  guardian: {
    id: "guardian",
    name: "Guardian",
    levels: {
      1: { skills: ["brace", "shieldSlam"] },
      2: { skills: ["ironBash"] },
      3: { subclass: true, subclassFeatures: { bulwark: "reinforcedGuard", sentinel: "watchfulEye" } },
      4: { statIncrease: true },
      5: { features: ["shieldWall"] },
      6: { skills: ["bulwarkRush"] },
      7: { subclassFeatures: { bulwark: "heavyMomentum", sentinel: "crushingCounter" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["braceMastery", "shieldSlamMastery"] } },
      10: { features: ["unbreakableLine"], subclassFeatures: { bulwark: "ironFortress", sentinel: "relentlessGuard" } },
      11: { skills: ["tauntingStrike"] },
      12: { statIncrease: true },
      13: { features: ["stoneblood"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["ironBashMastery", "bulwarkRushMastery"] } },
      15: { features: ["fortressHeart"], subclassFeatures: { bulwark: "mountainStance", sentinel: "dominatingPresence" } },
      16: { statIncrease: true },
      17: { features: ["lastStand"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["earthbreaker"], upgrades: ["tauntingStrikeMastery"] } },
      19: { statIncrease: true },
      20: { features: ["immovableBastion"], subclassFeatures: { bulwark: "eternalBastion", sentinel: "judgmentWall" } },
    },
  },
  rogue: {
    id: "rogue",
    name: "Stalker",
    levels: {
      1: { skills: ["quickStab", "feint"] },
      2: { skills: ["poisonEdge"] },
      3: { subclass: true, subclassFeatures: { assassin: "deathsOpening", scout: "quickRead" } },
      4: { statIncrease: true },
      5: { features: ["sneakAttack"] },
      6: { skills: ["shadowThrow"] },
      7: { subclassFeatures: { assassin: "lethalPrecision", scout: "evasiveFootwork" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["quickStabMastery", "feintMastery"] } },
      10: { features: ["shadowFlurry"], subclassFeatures: { assassin: "killersRhythm", scout: "flowState" } },
      11: { skills: ["vanish"] },
      12: { statIncrease: true },
      13: { features: ["evasion"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["poisonEdgeMastery", "shadowThrowMastery"] } },
      15: { features: ["assassinate"], subclassFeatures: { assassin: "assassinAssassinate", scout: "ghostStep" } },
      16: { statIncrease: true },
      17: { features: ["exploitWeakness"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["cripplingCut"], upgrades: ["vanishMastery"] } },
      19: { statIncrease: true },
      20: { features: ["deathmark"], subclassFeatures: { assassin: "perfectExecution", scout: "untouchable" } },
    },
  },
  sorcerer: {
    id: "sorcerer",
    name: "Channeler",
    levels: {
      1: { skills: ["sparkSurge", "frostMark"] },
      2: { skills: ["flameLash"] },
      3: { subclass: true, subclassFeatures: { pyromancer: "burningSoul", stormcaller: "staticCharge" } },
      4: { statIncrease: true },
      5: { features: ["sorcererArcaneSurge"] },
      6: { skills: ["lightningChain"] },
      7: { subclassFeatures: { pyromancer: "kindling", stormcaller: "conductiveShock" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["sparkSurgeMastery", "frostMarkMastery"] } },
      10: { features: ["chainCasting"], subclassFeatures: { pyromancer: "firestorm", stormcaller: "arcJump" } },
      11: { skills: ["chaosBolt"] },
      12: { statIncrease: true },
      13: { features: ["rawPower"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["flameLashMastery", "lightningChainMastery"] } },
      15: { features: ["overload"], subclassFeatures: { pyromancer: "infernoHeart", stormcaller: "thunderhead" } },
      16: { statIncrease: true },
      17: { features: ["wildCasting"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["stormBreaker"], upgrades: ["chaosBoltMastery"] } },
      19: { statIncrease: true },
      20: { features: ["arcaneCataclysm"], subclassFeatures: { pyromancer: "worldfire", stormcaller: "stormAvatar" } },
    },
  },
  paladin: {
    id: "paladin",
    name: "Justicar",
    levels: {
      1: { skills: ["smite", "blessingStrike"] },
      2: { skills: ["cleansingLight"] },
      3: { subclass: true, subclassFeatures: { oathkeeper: "sacredVow", avenger: "vengefulSmite" } },
      4: { statIncrease: true },
      5: { features: ["divineSmite"] },
      6: { skills: ["sanctifiedBlade"] },
      7: { subclassFeatures: { oathkeeper: "pureHeart", avenger: "judgmentBrand" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["smiteMastery", "blessingStrikeMastery"] } },
      10: { features: ["sacredResolve"], subclassFeatures: { oathkeeper: "divineShelter", avenger: "relentlessVengeance" } },
      11: { skills: ["radiantCommand"] },
      12: { statIncrease: true },
      13: { features: ["auraOfProtection"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["cleansingLightMastery", "sanctifiedBladeMastery"] } },
      15: { features: ["holyJudgment"], subclassFeatures: { oathkeeper: "unbrokenOath", avenger: "righteousExecution" } },
      16: { statIncrease: true },
      17: { skills: ["layOnHands"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["wrathfulNova"], upgrades: ["radiantCommandMastery"] } },
      19: { statIncrease: true },
      20: { features: ["divineChampion"], subclassFeatures: { oathkeeper: "eternalOath", avenger: "wrathIncarnate" } },
    },
  },
  mystic: {
    id: "mystic",
    name: "Psion",
    levels: {
      1: { skills: ["mindSpike", "thoughtLock"] },
      2: { skills: ["psychicVeil"] },
      3: { subclass: true, subclassFeatures: { seer: "foresight", telekinetic: "forcePush" } },
      4: { statIncrease: true },
      5: { features: ["mindPierce"] },
      6: { skills: ["mindLance"] },
      7: { subclassFeatures: { seer: "premonition", telekinetic: "kineticShield" } },
      8: { statIncrease: true },
      9: { choice: { type: "skill_upgrade", upgrades: ["mindSpikeMastery", "thoughtLockMastery"] } },
      10: { features: ["psychicEcho"], subclassFeatures: { seer: "openMind", telekinetic: "crushingGrip" } },
      11: { skills: ["thoughtRend"] },
      12: { statIncrease: true },
      13: { features: ["mentalFortress"] },
      14: { choice: { type: "skill_upgrade", upgrades: ["psychicVeilMastery", "mindLanceMastery"] } },
      15: { features: ["mentalOverload"], subclassFeatures: { seer: "paralyzingVision", telekinetic: "invisibleHand" } },
      16: { statIncrease: true },
      17: { features: ["psionicRecovery"] },
      18: { choice: { type: "skill_or_upgrade", skills: ["voidThought"], upgrades: ["thoughtRendMastery"] } },
      19: { statIncrease: true },
      20: { features: ["trueSight"], subclassFeatures: { seer: "perfectPrediction", telekinetic: "gravityBreak" } },
    },
  },
};

const CLASS_FEATURE_LEVELS = [7, 10, 15, 20];
const CLASS_CHOICE_LEVELS = [5, 9, 13, 17];
const CLASS_PASSIVE_FEATURES = {
  warrior: {
    id: "warriorDamageScaling",
    name: "Battle-Hardened Strikes",
    description: "+1 weapon and martial skill damage every 5 levels.",
    interval: 5,
  },
  magician: {
    id: "magicianManaEfficiency",
    name: "Efficient Spellcraft",
    description: "Soul-based mana skill costs are reduced by 1 every 5 levels, to a minimum of 1.",
    interval: 5,
  },
  rogue: {
    id: "rogueCritScaling",
    name: "Predator's Eye",
    description: "+5% critical threat chance every 4 levels.",
    interval: 4,
  },
  guardian: {
    id: "guardianReductionScaling",
    name: "Iron Bulwark",
    description: "+1 damage reduction every 5 levels.",
    interval: 5,
  },
  sorcerer: {
    id: "sorcererSpellDamageScaling",
    name: "Overflowing Channel",
    description: "+1 spell damage every 4 levels.",
    interval: 4,
  },
  paladin: {
    id: "paladinShieldScaling",
    name: "Consecrated Protection",
    description: "+1 healing and shield effectiveness every 5 levels.",
    interval: 5,
  },
  mystic: {
    id: "mysticMindScaling",
    name: "Deepened Thoughtform",
    description: "+1 effective Mind scaling for psionic status chances every 4 levels.",
    interval: 4,
  },
  monk: {
    id: "monkStaminaRecovery",
    name: "Inner Wellspring",
    description: "+1 stamina recovered when using Recover every 5 levels.",
    interval: 5,
  },
};

function getClassPassiveFeature(classId) {
  return CLASS_PASSIVE_FEATURES[classId] ?? null;
}

function getClassPassiveFeatureById(featureId) {
  return Object.values(CLASS_PASSIVE_FEATURES).find((feature) => feature.id === featureId) ?? null;
}

function getClassPassiveRank(combatantOrLevel, classId = null) {
  const level = typeof combatantOrLevel === "number" ? combatantOrLevel : combatantOrLevel?.level ?? 1;
  const feature = getClassPassiveFeature(classId ?? combatantOrLevel?.classDef?.id);
  if (!feature) return 0;
  return Math.floor(Math.max(1, level) / feature.interval);
}

function getClassFeatureLines(classId, level = MAX_LEVEL) {
  if (classFeatures[classId]?.core) {
    return Object.entries(classFeatures[classId]?.core ?? {})
      .map(([featureLevel, feature]) => ({
        level: Number(featureLevel),
        name: feature.name,
        description: feature.description,
        active: level >= Number(featureLevel),
      }))
      .sort((a, b) => a.level - b.level);
  }
  const feature = getClassPassiveFeature(classId);
  if (!feature) return [];
  const className = classes[classId]?.name ?? classSkillTrees[classId]?.name ?? titleCase(classId);
  return CLASS_FEATURE_LEVELS.map((featureLevel) => {
    const rank = getClassPassiveRank(featureLevel, classId);
    const active = level >= featureLevel;
    return {
      level: featureLevel,
      name: feature.name,
      description: `${className}: ${feature.description}`,
      active,
    };
  });
}

function formatProgressionNameFromId(value) {
  return titleCase(String(value ?? "").replace(/([a-z])([A-Z])/g, "$1 $2"));
}

function findClassCoreFeature(classId, featureId) {
  const coreFeatures = classFeatures[classId]?.core ?? {};
  return Object.values(coreFeatures).find((feature) => feature.id === featureId) ?? null;
}

function findSubclassFeature(classId, subclassId, featureId) {
  const subclassFeatures = classFeatures[classId]?.[subclassId] ?? {};
  return Object.values(subclassFeatures).find((feature) => feature.id === featureId) ?? null;
}

function createProgressionItem(name, description = "", meta = {}) {
  return {
    name: name || "Progression",
    description,
    ...meta,
  };
}

function getProgressionSkillItem(skillId) {
  const skill = skills[skillId];
  return createProgressionItem(skill?.name ?? formatProgressionNameFromId(skillId), skill?.description ?? "");
}

function getProgressionUpgradeItem(upgradeId) {
  const upgrade = skillUpgrades[upgradeId];
  return createProgressionItem(upgrade?.name ?? formatProgressionNameFromId(upgradeId), upgrade?.summary ?? "");
}

function getProgressionFeatureItem(classId, featureId) {
  const feature = findClassCoreFeature(classId, featureId) ?? getClassPassiveFeatureById(featureId);
  return createProgressionItem(feature?.name ?? formatProgressionNameFromId(featureId), feature?.description ?? "");
}

function getProgressionChoiceItem(choice) {
  const optionItems = [
    ...(choice?.skills ?? []).map(getProgressionSkillItem),
    ...(choice?.upgrades ?? []).map(getProgressionUpgradeItem),
  ];
  const summary = optionItems
    .map((item) => `${item.name}${item.description ? ` - ${item.description}` : ""}`)
    .join(" | ");
  return createProgressionItem("Choice", summary || "Choose one progression option.");
}

function getClassProgressionEntries(classId) {
  const normalizedClassId = normalizeClassId(classId, "");
  const tree = classSkillTrees[normalizedClassId];
  if (!tree?.levels) return [];
  const subclassFeatureGroups = Object.entries(classFeatures[normalizedClassId] ?? {}).filter(([groupId]) => groupId !== "core");

  return Object.entries(tree.levels)
    .map(([levelText, levelData]) => {
      const level = Number(levelText);
      const items = [];
      const addedSubclassFeatureKeys = new Set();
      (levelData.skills ?? []).forEach((skillId) => items.push(getProgressionSkillItem(skillId)));
      (levelData.upgrades ?? []).forEach((upgradeId) => items.push(getProgressionUpgradeItem(upgradeId)));
      if (levelData.subclass) {
        const subclassNames = Object.values(subclasses[normalizedClassId] ?? {}).map((subclass) => subclass.name);
        items.push(createProgressionItem("Subclass Choice", subclassNames.length ? `Choose ${subclassNames.join(" or ")}.` : "Choose a subclass."));
      }
      if (levelData.statIncrease) {
        items.push(createProgressionItem("Stat Increase", "Choose one stat to increase."));
      }
      (levelData.features ?? []).forEach((featureId) => items.push(getProgressionFeatureItem(normalizedClassId, featureId)));
      Object.entries(levelData.subclassFeatures ?? {}).forEach(([subclassId, featureId]) => {
        const subclassName = subclasses[normalizedClassId]?.[subclassId]?.name ?? formatProgressionNameFromId(subclassId);
        const feature = findSubclassFeature(normalizedClassId, subclassId, featureId);
        if (feature?.id) addedSubclassFeatureKeys.add(`${subclassId}:${feature.id}`);
        items.push(
          createProgressionItem(
            `${subclassName}: ${feature?.name ?? formatProgressionNameFromId(featureId)}`,
            feature?.description ?? "",
            { type: "subclassFeature", subclassId, featureId }
          )
        );
      });
      subclassFeatureGroups.forEach(([subclassId, featureLevels]) => {
        const feature = featureLevels?.[level];
        if (!feature?.id) return;
        const featureKey = `${subclassId}:${feature.id}`;
        if (addedSubclassFeatureKeys.has(featureKey)) return;
        const subclassName = subclasses[normalizedClassId]?.[subclassId]?.name ?? formatProgressionNameFromId(subclassId);
        items.push(createProgressionItem(`${subclassName}: ${feature.name}`, feature.description ?? "", { type: "subclassFeature", subclassId, featureId: feature.id }));
      });
      if (levelData.choice) items.push(getProgressionChoiceItem(levelData.choice));
      return {
        level,
        items,
      };
    })
    .filter((entry) => entry.items.length)
    .sort((a, b) => a.level - b.level);
}

function getClassProgressionBulletLines(classId) {
  return getClassProgressionEntries(classId).flatMap((entry) =>
    entry.items.map((item) => `Level ${entry.level}: ${item.name}${item.description ? ` - ${item.description}` : ""}`)
  );
}

function getSubclassFeatureBulletLines(classId, subclassId) {
  return Object.entries(classFeatures[classId]?.[subclassId] ?? {})
    .map(([levelText, feature]) => ({
      level: Number(levelText),
      feature,
    }))
    .filter(({ feature }) => feature?.id)
    .sort((a, b) => a.level - b.level)
    .map(({ level, feature }) => `Level ${level}: ${feature.name}${feature.description ? ` - ${feature.description}` : ""}`);
}

function renderClassProgressionList(classId, currentLevel = 0, selectedSubclassId = null) {
  const entries = getClassProgressionEntries(classId);
  if (!entries.length) return `<p>No progression data available.</p>`;
  return `
    <div class="class-progression-list">
      ${entries
        .map((entry) => {
          const statusClass = entry.level <= currentLevel ? " unlocked" : " upcoming";
          const statusLabel = entry.level <= currentLevel ? "Unlocked" : "Upcoming";
          const visibleItems = entry.items.filter(
            (item) => !selectedSubclassId || item.type !== "subclassFeature" || item.subclassId === selectedSubclassId
          );
          if (!visibleItems.length) return "";
          return `
            <article class="class-progression-entry${statusClass}">
              <div class="class-progression-level">Level ${entry.level}</div>
              <div class="class-progression-items">
                ${visibleItems
                  .map(
                    (item) => `
                      <div class="class-progression-item">
                        <strong>${escapeAttribute(item.name)}</strong>
                        ${item.description ? `<span>${escapeAttribute(item.description)}</span>` : ""}
                      </div>`
                  )
                  .join("")}
              </div>
              <span class="class-progression-status">${statusLabel}</span>
            </article>`;
        })
        .join("")}
    </div>
  `;
}

function mergeProgressionLevel(...levels) {
  const merged = {};
  levels.filter(Boolean).forEach((level) => {
    if (level.skills) merged.skills = [...(merged.skills ?? []), ...level.skills];
    if (level.upgrades) merged.upgrades = [...(merged.upgrades ?? []), ...level.upgrades];
    if (level.features) merged.features = [...(merged.features ?? []), ...level.features];
    if (level.subclassFeatures) merged.subclassFeatures = { ...(merged.subclassFeatures ?? {}), ...level.subclassFeatures };
    if (level.subclass) merged.subclass = true;
    if (level.choice) {
      merged.choice = {
        type: "skill_or_upgrade",
        skills: [...(merged.choice?.skills ?? []), ...(level.choice.skills ?? [])],
        upgrades: [...(merged.choice?.upgrades ?? []), ...(level.choice.upgrades ?? [])],
      };
    }
  });
  if (merged.skills) merged.skills = Array.from(new Set(merged.skills));
  if (merged.upgrades) merged.upgrades = Array.from(new Set(merged.upgrades));
  if (merged.features) merged.features = Array.from(new Set(merged.features));
  if (merged.choice) {
    merged.choice.skills = Array.from(new Set(merged.choice.skills));
    merged.choice.upgrades = Array.from(new Set(merged.choice.upgrades));
  }
  return merged;
}

function getGeneratedProgressionLevel(classId, level) {
  const baseTree = classSkillTrees[classId];
  const hasExplicitFullProgression = Array.from({ length: MAX_LEVEL }, (_, index) => index + 1).every((progressionLevel) => baseTree?.levels?.[progressionLevel]);
  if (hasExplicitFullProgression) return {};
  const levelFiveChoice = baseTree?.levels?.[5]?.choice;
  const generated = {};
  if (level === 6 && levelFiveChoice?.skills?.length) {
    generated.skills = levelFiveChoice.skills;
  }
  if (CLASS_CHOICE_LEVELS.includes(level) && levelFiveChoice) {
    generated.choice = level === 9
      ? { type: "skill_or_upgrade", upgrades: levelFiveChoice.upgrades ?? [] }
      : levelFiveChoice;
  }
  if (CLASS_FEATURE_LEVELS.includes(level)) {
    const feature = getClassPassiveFeature(classId);
    if (feature) generated.features = [feature.id];
  }
  return generated;
}

const enemyTierDefinitions = {
  1: { id: 1, name: "Tier 1", levelRange: [1, 4] },
  2: { id: 2, name: "Tier 2", levelRange: [5, 8] },
  3: { id: 3, name: "Tier 3", levelRange: [9, 12] },
  4: { id: 4, name: "Tier 4", levelRange: [13, 16] },
  5: { id: 5, name: "Tier 5", levelRange: [17, 20] },
};

function enemyLoot(tier, weight = 1, weaponIds = ["sword"], weaponChance = 0.18) {
  const base = {
    1: { xp: 90, copper: [4, 14], silver: [1, 4], gold: [0, 0], weaponChance: 0.14 },
    2: { xp: 180, copper: [6, 18], silver: [5, 12], gold: [0, 2], weaponChance: 0.24 },
    3: { xp: 430, copper: [8, 24], silver: [10, 24], gold: [1, 6], weaponChance: 0.34 },
    4: { xp: 900, copper: [10, 30], silver: [18, 38], gold: [4, 11], weaponChance: 0.44 },
    5: { xp: 1750, copper: [12, 34], silver: [28, 56], gold: [9, 20], weaponChance: 0.52 },
  }[tier];
  return { ...base, xp: Math.round(base.xp * weight), weaponChance, weaponIds };
}

function makeEnemy(id, name, tier, enemyType, stats, baseHp, armorId, weaponId, acBonus, traits, lootWeight, weaponIds, weaponChance, description) {
  return {
    id,
    name,
    tier,
    enemyType,
    levelRange: enemyTierDefinitions[tier].levelRange,
    stats,
    baseHp,
    armorId,
    weaponId,
    acBonus,
    resistances: traits.resistances ?? [],
    weaknesses: traits.weaknesses ?? [],
    statusImmunities: traits.statusImmunities ?? [],
    loot: enemyLoot(tier, lootWeight, weaponIds, weaponChance),
    description,
  };
}

const enemyTemplates = {
  goblin: makeEnemy("goblin", "Goblin", 1, "standard", { mind: 2, body: 4, soul: 1 }, 14, "scraps", "crudeBlade", 1, { resistances: ["ice"], weaknesses: ["fire"] }, 0.9, ["dagger"], 0.15, "A scrappy raider with crude gear and quick, opportunistic strikes."),
  wolf: makeEnemy("wolf", "Wolf", 1, "standard", { mind: 1, body: 5, soul: 1 }, 16, "hide", "bite", 1, { weaknesses: ["fire"] }, 0.85, ["unarmed"], 0.08, "A fast predator that pressures wounded travelers with snapping bites."),
  bandit: makeEnemy("bandit", "Bandit", 1, "standard", { mind: 3, body: 4, soul: 1 }, 20, "light", "rustySword", 1, {}, 1.05, ["sword", "dagger", "bow"], 0.22, "A road thief with basic martial training and practical weapons."),
  skeleton: makeEnemy("skeleton", "Skeleton", 1, "standard", { mind: 1, body: 3, soul: 2 }, 18, "bone", "boneClaw", 1, { resistances: ["ice", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed"] }, 1.1, ["axe"], 0.18, "A brittle undead guard that ignores bleeding wounds."),
  caveRat: makeEnemy("caveRat", "Cave Rat", 1, "standard", { mind: 1, body: 3, soul: 1 }, 12, "hide", "bite", 0, { weaknesses: ["fire"] }, 0.75, ["unarmed"], 0.05, "A skittering cave scavenger with a nasty bite."),
  rabidDog: makeEnemy("rabidDog", "Rabid Dog", 1, "standard", { mind: 1, body: 4, soul: 1 }, 15, "hide", "bite", 0, {}, 0.9, ["unarmed", "dagger"], 0.08, "A frenzied stray that attacks without fear."),
  forestImp: makeEnemy("forestImp", "Forest Imp", 1, "standard", { mind: 4, body: 2, soul: 2 }, 13, "scraps", "dagger", 1, { weaknesses: ["physical"] }, 0.95, ["dagger", "staff"], 0.14, "A spiteful trickster that darts between roots and shadows."),
  mudling: makeEnemy("mudling", "Mudling", 1, "standard", { mind: 1, body: 4, soul: 2 }, 17, "hide", "unarmed", 1, { resistances: ["physical"], weaknesses: ["lightning"] }, 0.95, ["unarmed"], 0.06, "A clotted little elemental that absorbs glancing blows."),
  graveRobber: makeEnemy("graveRobber", "Grave Robber", 1, "standard", { mind: 3, body: 3, soul: 1 }, 18, "light", "dagger", 1, { resistances: ["poison"] }, 1.0, ["dagger", "rustySword"], 0.2, "A desperate scavenger armed with stolen grave goods."),
  ashSprite: makeEnemy("ashSprite", "Ash Sprite", 1, "standard", { mind: 2, body: 2, soul: 4 }, 13, "none", "emberBolt", 1, { resistances: ["fire"], weaknesses: ["ice"] }, 1.0, ["wand", "flameWand"], 0.18, "A flickering fire spirit with low endurance and sharp sparks."),
  koboldScout: makeEnemy("koboldScout", "Kobold Scout", 1, "standard", { mind: 4, body: 3, soul: 1 }, 13, "light", "dagger", 0, {}, 0.9, ["dagger", "bow"], 0.16, "A quick kobold pathfinder with sharp eyes and light blades."),
  koboldSlinger: makeEnemy("koboldSlinger", "Kobold Slinger", 1, "standard", { mind: 3, body: 3, soul: 1 }, 12, "scraps", "bow", 0, {}, 0.9, ["bow", "dagger"], 0.16, "A ranged kobold harrier that favors accuracy over endurance."),
  ashDrakeWhelp: makeEnemy("ashDrakeWhelp", "Ash Drake Whelp", 1, "standard", { mind: 2, body: 4, soul: 3 }, 16, "hide", "emberBolt", 1, { resistances: ["fire"], weaknesses: ["ice"] }, 1.05, ["flameWand", "unarmed"], 0.18, "A small drake whelp with hot breath and fragile wings."),

  goblinKnifeChief: makeEnemy("goblinKnifeChief", "Goblin Knife-Chief", 1, "boss", { mind: 4, body: 6, soul: 1 }, 34, "medium", "crudeBlade", 2, { resistances: ["ice"], weaknesses: ["fire"] }, 2.0, ["dagger", "sword", "bow"], 0.35, "A scarred goblin leader whose blades test new adventurers."),
  alphaWolf: makeEnemy("alphaWolf", "Alpha Wolf", 1, "boss", { mind: 2, body: 7, soul: 1 }, 36, "hide", "bite", 2, { weaknesses: ["fire"] }, 1.95, ["unarmed", "dagger"], 0.28, "The pack leader, fast enough to punish hesitation."),
  boneCollector: makeEnemy("boneCollector", "Bone Collector", 1, "boss", { mind: 3, body: 5, soul: 3 }, 38, "bone", "boneClaw", 2, { resistances: ["ice", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed"] }, 2.05, ["axe", "boneSword"], 0.34, "A graveyard horror that gathers bones into armor and claws."),

  apprenticeMage: makeEnemy("apprenticeMage", "Apprentice Mage", 2, "standard", { mind: 4, body: 2, soul: 5 }, 22, "robe", "emberBolt", 1, { resistances: ["fire"], weaknesses: ["physical"] }, 0.95, ["staff", "flameWand"], 0.3, "A novice firecaster with fragile defenses and dangerous sparks."),
  hobgoblin: makeEnemy("hobgoblin", "Hobgoblin", 2, "standard", { mind: 3, body: 6, soul: 1 }, 28, "medium", "heavyClub", 2, { resistances: ["bleed"] }, 1.0, ["axe", "heavyClub", "sword"], 0.28, "A disciplined martial brute with better armor and heavier swings."),
  direWolf: makeEnemy("direWolf", "Dire Wolf", 2, "standard", { mind: 2, body: 7, soul: 1 }, 26, "hide", "bite", 1, { weaknesses: ["fire"] }, 0.95, ["unarmed", "dagger"], 0.12, "A larger, faster wolf that tears into prey with bleeding bites."),
  cultist: makeEnemy("cultist", "Cultist", 2, "standard", { mind: 5, body: 2, soul: 4 }, 23, "robe", "emberBolt", 1, { resistances: ["poison"], weaknesses: ["physical"] }, 1.05, ["dagger", "staff", "flameWand"], 0.24, "A half-trained ritualist mixing cunning, poison, and unstable flame."),
  marauder: makeEnemy("marauder", "Marauder", 2, "standard", { mind: 3, body: 6, soul: 2 }, 30, "medium", "axe", 2, {}, 1.05, ["axe", "sword", "heavyClub"], 0.3, "A roaming raider with a taste for heavy weapons."),
  boneArcher: makeEnemy("boneArcher", "Bone Archer", 2, "standard", { mind: 2, body: 5, soul: 3 }, 24, "bone", "bow", 2, { resistances: ["ice", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed"] }, 1.05, ["bow", "boneSword"], 0.25, "An undead marksman that cannot be made to bleed."),
  ashHound: makeEnemy("ashHound", "Ash Hound", 2, "standard", { mind: 2, body: 6, soul: 3 }, 27, "hide", "emberBolt", 1, { resistances: ["fire"], weaknesses: ["ice"] }, 1.0, ["flameWand", "unarmed"], 0.2, "A smoke-black hound wreathed in embers."),
  thornWitch: makeEnemy("thornWitch", "Thorn Witch", 2, "standard", { mind: 5, body: 2, soul: 5 }, 23, "robe", "staff", 1, { resistances: ["poison"], weaknesses: ["fire"] }, 1.05, ["staff", "wand"], 0.26, "A hedge-caster who fights with venomous charms."),
  ironboundThug: makeEnemy("ironboundThug", "Ironbound Thug", 2, "standard", { mind: 2, body: 7, soul: 1 }, 32, "heavy", "heavyClub", 3, { resistances: ["physical"], weaknesses: ["lightning"] }, 1.1, ["heavyClub", "axe"], 0.28, "A slow, armored enforcer who soaks up punishment."),
  plagueRatSwarm: makeEnemy("plagueRatSwarm", "Plague Rat Swarm", 2, "standard", { mind: 1, body: 5, soul: 2 }, 25, "hide", "dagger", 1, { resistances: ["poison"], weaknesses: ["fire"] }, 1.0, ["dagger"], 0.16, "A churning mass of diseased teeth and claws."),
  koboldDragonshield: makeEnemy("koboldDragonshield", "Kobold Dragonshield", 2, "standard", { mind: 3, body: 6, soul: 2 }, 30, "heavy", "sword", 3, { resistances: ["fire"], weaknesses: ["lightning"] }, 1.05, ["sword", "dagger", "heavyClub"], 0.3, "A defensive kobold guard carrying a shield in a dragon's name."),
  caveDrake: makeEnemy("caveDrake", "Cave Drake", 2, "standard", { mind: 1, body: 8, soul: 2 }, 34, "hide", "bite", 2, { resistances: ["physical"], weaknesses: ["lightning"] }, 1.08, ["unarmed", "heavyClub"], 0.2, "A sturdy cave beast with powerful jaws and poor instincts."),
  venomscaleKobold: makeEnemy("venomscaleKobold", "Venomscale Kobold", 2, "standard", { mind: 5, body: 4, soul: 2 }, 24, "light", "dagger", 1, { resistances: ["poison"], weaknesses: ["fire"] }, 1.0, ["dagger", "shadowBlade"], 0.28, "A poison-trained kobold whose blade is more dangerous than its size."),

  hobgoblinWarcaptain: makeEnemy("hobgoblinWarcaptain", "Hobgoblin Warcaptain", 2, "boss", { mind: 5, body: 8, soul: 2 }, 54, "heavy", "heavyClub", 3, { resistances: ["bleed"] }, 2.0, ["heavyClub", "axe", "sword"], 0.42, "A battlefield commander who tests whether the road beyond Tier 2 is earned."),
  cultHighspeaker: makeEnemy("cultHighspeaker", "Cult Highspeaker", 2, "boss", { mind: 7, body: 3, soul: 7 }, 46, "robe", "flameWand", 2, { resistances: ["fire", "poison"], weaknesses: ["physical"] }, 2.05, ["flameWand", "wand", "staff"], 0.45, "A ritual leader whose words make the air burn."),
  direWolfMatriarch: makeEnemy("direWolfMatriarch", "Dire Wolf Matriarch", 2, "boss", { mind: 3, body: 9, soul: 2 }, 52, "hide", "bite", 2, { weaknesses: ["fire"] }, 1.95, ["unarmed", "dagger", "bow"], 0.36, "The oldest hunter in the pack, scarred and brutally quick."),

  ogre: makeEnemy("ogre", "Ogre", 3, "standard", { mind: 1, body: 9, soul: 1 }, 48, "hide", "heavyClub", 1, { weaknesses: ["lightning"] }, 1.0, ["heavyClub", "axe", "staff"], 0.32, "A towering bruiser with huge health and punishing physical force."),
  wraith: makeEnemy("wraith", "Wraith", 3, "standard", { mind: 4, body: 2, soul: 8 }, 32, "none", "stormRod", 2, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 1.05, ["wand", "stormRod", "staff"], 0.3, "A soul-heavy spirit that shrugs off mundane wounds but fears holy stormlight."),
  veteranBandit: makeEnemy("veteranBandit", "Veteran Bandit", 3, "standard", { mind: 5, body: 6, soul: 2 }, 36, "medium", "shadowBlade", 2, {}, 1.0, ["sword", "bow", "dagger", "shadowBlade"], 0.38, "A hardened outlaw with sharper weapons and better spoils."),
  graveWitch: makeEnemy("graveWitch", "Grave Witch", 3, "standard", { mind: 7, body: 2, soul: 7 }, 34, "robe", "stormRod", 2, { resistances: ["poison"], weaknesses: ["lightning"], statusImmunities: ["poison"] }, 1.05, ["staff", "wand", "stormRod"], 0.34, "A grave-caller who binds old grudges into spells."),
  stonebackBoar: makeEnemy("stonebackBoar", "Stoneback Boar", 3, "standard", { mind: 1, body: 9, soul: 2 }, 46, "hide", "bite", 3, { resistances: ["physical"], weaknesses: ["lightning"] }, 0.95, ["unarmed", "heavyClub"], 0.2, "A stubborn beast plated with stone-like hide."),
  emberRevenant: makeEnemy("emberRevenant", "Ember Revenant", 3, "standard", { mind: 3, body: 4, soul: 8 }, 38, "bone", "flameWand", 2, { resistances: ["fire", "poison"], weaknesses: ["ice"], statusImmunities: ["bleed", "poison"] }, 1.05, ["flameWand", "boneSword"], 0.36, "An undead ember-soul that burns with unfinished rage."),
  venomAssassin: makeEnemy("venomAssassin", "Venom Assassin", 3, "standard", { mind: 7, body: 6, soul: 2 }, 34, "light", "shadowBlade", 2, { resistances: ["poison"] }, 1.0, ["shadowBlade", "dagger", "bow"], 0.4, "A silent killer who favors poison and precise cuts."),
  hollowKnight: makeEnemy("hollowKnight", "Hollow Knight", 3, "standard", { mind: 2, body: 8, soul: 4 }, 44, "heavy", "boneSword", 3, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed"] }, 1.05, ["boneSword", "sword", "axe"], 0.36, "An empty suit of oath-bound armor with a dead man's sword."),
  stormAdept: makeEnemy("stormAdept", "Storm Adept", 3, "standard", { mind: 5, body: 3, soul: 8 }, 35, "robe", "stormRod", 2, { resistances: ["lightning"], weaknesses: ["physical"] }, 1.05, ["stormRod", "wand", "staff"], 0.38, "A practiced lightning caster who threatens Stun windows."),
  deepwoodTroll: makeEnemy("deepwoodTroll", "Deepwood Troll", 3, "standard", { mind: 2, body: 9, soul: 3 }, 52, "hide", "heavyClub", 2, { resistances: ["physical"], weaknesses: ["fire"] }, 1.1, ["heavyClub", "axe"], 0.34, "A mossy troll from old forest paths, hard to bring down."),
  emberDrake: makeEnemy("emberDrake", "Ember Drake", 3, "standard", { mind: 3, body: 8, soul: 7 }, 48, "hide", "flameWand", 3, { resistances: ["fire"], weaknesses: ["ice"] }, 1.08, ["flameWand", "heavyClub"], 0.38, "A fire drake with ember breath and growing scales."),
  koboldFlamecaller: makeEnemy("koboldFlamecaller", "Kobold Flamecaller", 3, "standard", { mind: 6, body: 3, soul: 8 }, 34, "robe", "flameWand", 1, { resistances: ["fire"], weaknesses: ["ice"] }, 1.03, ["flameWand", "wand", "staff"], 0.4, "A kobold firecaster with more flame than armor."),
  stormDrake: makeEnemy("stormDrake", "Storm Drake", 3, "standard", { mind: 4, body: 7, soul: 8 }, 46, "hide", "stormRod", 3, { resistances: ["lightning"], weaknesses: ["physical"] }, 1.08, ["stormRod", "heavyClub"], 0.38, "A lightning drake that can stun prey with crackling breath."),

  ogreBonecrusher: makeEnemy("ogreBonecrusher", "Ogre Bonecrusher", 3, "boss", { mind: 2, body: 12, soul: 2 }, 86, "medium", "heavyClub", 3, { weaknesses: ["lightning"] }, 2.0, ["heavyClub", "axe", "trollFist"], 0.48, "A gigantic ogre whose club is a trial all by itself."),
  wraithOfTheOldRoad: makeEnemy("wraithOfTheOldRoad", "Wraith of the Old Road", 3, "boss", { mind: 6, body: 3, soul: 11 }, 70, "none", "stormRod", 3, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 2.08, ["stormRod", "wand", "staff"], 0.48, "A legendary spirit haunting the road between tiers."),
  banditKing: makeEnemy("banditKing", "Bandit King", 3, "boss", { mind: 8, body: 9, soul: 3 }, 76, "heavy", "shadowBlade", 3, {}, 2.05, ["shadowBlade", "sword", "bow"], 0.5, "A crowned outlaw who rules through fear and fast steel."),

  boneKnight: makeEnemy("boneKnight", "Bone Knight", 4, "standard", { mind: 3, body: 8, soul: 5 }, 50, "heavy", "boneSword", 3, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 1.0, ["boneSword", "sword", "axe"], 0.42, "An armored undead champion with high defense and no blood to spill."),
  flameAdept: makeEnemy("flameAdept", "Flame Adept", 4, "standard", { mind: 5, body: 3, soul: 9 }, 38, "robe", "flameWand", 2, { resistances: ["fire"], weaknesses: ["ice"] }, 1.04, ["flameWand", "wand", "staff"], 0.45, "A practiced firecaster who turns every opening into Burn pressure."),
  shadowStalker: makeEnemy("shadowStalker", "Shadow Stalker", 4, "standard", { mind: 8, body: 6, soul: 3 }, 34, "light", "shadowBlade", 2, { resistances: ["poison"], weaknesses: ["lightning"] }, 0.98, ["shadowBlade", "dagger", "bow"], 0.46, "A precise ambusher with low health, high accuracy, and poison pressure."),
  ironRevenant: makeEnemy("ironRevenant", "Iron Revenant", 4, "standard", { mind: 3, body: 9, soul: 6 }, 56, "heavy", "boneSword", 3, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 1.05, ["boneSword", "heavyClub", "axe"], 0.44, "A dead warrior sealed inside cold iron."),
  frostboundGiant: makeEnemy("frostboundGiant", "Frostbound Giant", 4, "standard", { mind: 2, body: 11, soul: 4 }, 66, "hide", "heavyClub", 2, { resistances: ["ice", "physical"], weaknesses: ["fire"] }, 1.08, ["heavyClub", "axe", "trollFist"], 0.42, "A giant carrying winter in its bones."),
  voidPriest: makeEnemy("voidPriest", "Void Priest", 4, "standard", { mind: 9, body: 3, soul: 8 }, 42, "robe", "stormRod", 2, { resistances: ["poison"], weaknesses: ["physical"] }, 1.05, ["stormRod", "wand", "staff"], 0.44, "A priest of the empty dark, dangerous but fragile."),
  bloodthornMatron: makeEnemy("bloodthornMatron", "Bloodthorn Matron", 4, "standard", { mind: 7, body: 5, soul: 7 }, 48, "light", "shadowBlade", 2, { resistances: ["poison"], weaknesses: ["fire"] }, 1.03, ["shadowBlade", "staff", "dagger"], 0.45, "A thorn-crowned matron who mixes poison and blood rites."),
  lesserAshDrake: makeEnemy("lesserAshDrake", "Lesser Ash Drake", 4, "standard", { mind: 4, body: 9, soul: 7 }, 58, "hide", "flameWand", 3, { resistances: ["fire", "physical"], weaknesses: ["ice"] }, 1.1, ["flameWand", "heavyClub"], 0.46, "A young drake with ember breath and armored scales."),
  nightbladeDuelist: makeEnemy("nightbladeDuelist", "Nightblade Duelist", 4, "standard", { mind: 8, body: 8, soul: 3 }, 44, "light", "shadowBlade", 3, { resistances: ["poison"] }, 1.02, ["shadowBlade", "sword", "dagger"], 0.48, "A duelist who fights like a shadow given steel."),
  plagueNecromancer: makeEnemy("plagueNecromancer", "Plague Necromancer", 4, "standard", { mind: 8, body: 3, soul: 9 }, 44, "robe", "stormRod", 2, { resistances: ["poison"], weaknesses: ["lightning"], statusImmunities: ["poison"] }, 1.08, ["stormRod", "staff", "wand"], 0.46, "A corpse-mage whose magic carries sickness and dread."),
  frostDrake: makeEnemy("frostDrake", "Frost Drake", 4, "standard", { mind: 4, body: 9, soul: 8 }, 60, "hide", "boneClaw", 3, { resistances: ["ice", "physical"], weaknesses: ["fire"] }, 1.1, ["boneSword", "heavyClub"], 0.46, "An ice drake whose freezing breath slows the bold."),
  koboldDragonPriest: makeEnemy("koboldDragonPriest", "Kobold Dragon Priest", 4, "standard", { mind: 8, body: 4, soul: 10 }, 46, "robe", "stormRod", 2, { resistances: ["fire", "lightning"], weaknesses: ["physical"] }, 1.08, ["stormRod", "flameWand", "staff"], 0.48, "A high-soul kobold priest invoking draconic storm and flame."),

  boneKnightCommander: makeEnemy("boneKnightCommander", "Bone Knight Commander", 4, "boss", { mind: 5, body: 11, soul: 8 }, 98, "heavy", "boneSword", 4, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 2.05, ["boneSword", "sword", "axe"], 0.55, "A commanding undead knight who guards the road into the last tier."),
  flameOracle: makeEnemy("flameOracle", "Flame Oracle", 4, "boss", { mind: 9, body: 4, soul: 12 }, 84, "robe", "flameWand", 3, { resistances: ["fire"], weaknesses: ["ice"] }, 2.08, ["flameWand", "wand", "staff"], 0.56, "A prophet of fire whose visions arrive as burning pain."),
  shadowStalkerPrime: makeEnemy("shadowStalkerPrime", "Shadow Stalker Prime", 4, "boss", { mind: 11, body: 9, soul: 4 }, 86, "medium", "shadowBlade", 4, { resistances: ["poison"], weaknesses: ["lightning"] }, 2.0, ["shadowBlade", "dagger", "bow"], 0.58, "The perfected ambusher, built to test late-game reactions."),

  ironTroll: makeEnemy("ironTroll", "Iron Troll", 5, "standard", { mind: 1, body: 12, soul: 2 }, 78, "heavy", "trollFist", 3, { resistances: ["physical"], weaknesses: ["lightning"] }, 1.0, ["trollFist", "heavyClub", "axe"], 0.5, "A massive, iron-skinned monster with crushing strength and little subtlety."),
  stormAcolyte: makeEnemy("stormAcolyte", "Storm Acolyte", 5, "standard", { mind: 6, body: 4, soul: 11 }, 46, "robe", "stormRod", 2, { resistances: ["lightning"], weaknesses: ["physical"] }, 0.98, ["stormRod", "wand", "staff"], 0.52, "A lightning channeler who can Stun foes with focused storm magic."),
  graveChampion: makeEnemy("graveChampion", "Grave Champion", 5, "standard", { mind: 4, body: 10, soul: 7 }, 62, "heavy", "boneSword", 4, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 1.08, ["boneSword", "stormRod", "sword", "axe"], 0.55, "An elite undead warrior armored in grave-forged steel."),
  voidReaver: makeEnemy("voidReaver", "Void Reaver", 5, "standard", { mind: 10, body: 7, soul: 9 }, 58, "medium", "shadowBlade", 3, { resistances: ["poison"], weaknesses: ["lightning"] }, 1.05, ["shadowBlade", "stormRod", "sword"], 0.54, "A mind-hungry raider from the spaces between stars."),
  ancientWraith: makeEnemy("ancientWraith", "Ancient Wraith", 5, "standard", { mind: 8, body: 3, soul: 13 }, 56, "none", "stormRod", 4, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 1.08, ["stormRod", "wand", "staff"], 0.56, "An old spirit too angry to fade, almost untouched by mortal wounds."),
  hellfireWarlock: makeEnemy("hellfireWarlock", "Hellfire Warlock", 5, "standard", { mind: 9, body: 4, soul: 12 }, 54, "robe", "flameWand", 3, { resistances: ["fire"], weaknesses: ["ice"] }, 1.06, ["flameWand", "wand", "staff"], 0.56, "A firebound caster who burns through hesitation."),
  stormTyrant: makeEnemy("stormTyrant", "Storm Tyrant", 5, "standard", { mind: 8, body: 7, soul: 12 }, 66, "medium", "stormRod", 4, { resistances: ["lightning"], weaknesses: ["physical"] }, 1.1, ["stormRod", "sword", "staff"], 0.58, "A stormlord who turns lightning into rule."),
  obsidianColossus: makeEnemy("obsidianColossus", "Obsidian Colossus", 5, "standard", { mind: 2, body: 13, soul: 5 }, 92, "heavy", "trollFist", 4, { resistances: ["physical", "fire"], weaknesses: ["lightning"] }, 1.12, ["trollFist", "heavyClub", "axe"], 0.54, "A black-stone giant built for endurance and impact."),
  astralDevourer: makeEnemy("astralDevourer", "Astral Devourer", 5, "standard", { mind: 11, body: 5, soul: 11 }, 60, "none", "stormRod", 3, { resistances: ["poison"], weaknesses: ["physical"] }, 1.08, ["stormRod", "wand", "staff"], 0.56, "A drifting horror that feeds on thought and spirit."),
  fallenSeraph: makeEnemy("fallenSeraph", "Fallen Seraph", 5, "standard", { mind: 8, body: 8, soul: 12 }, 70, "medium", "boneSword", 4, { resistances: ["fire", "poison"], weaknesses: ["lightning"] }, 1.12, ["boneSword", "stormRod", "sword"], 0.58, "A ruined celestial remnant with terrible grace."),
  voidDrake: makeEnemy("voidDrake", "Void Drake", 5, "standard", { mind: 11, body: 7, soul: 12 }, 72, "hide", "stormRod", 4, { resistances: ["lightning", "poison"], weaknesses: ["physical"] }, 1.12, ["stormRod", "shadowBlade", "wand"], 0.58, "A late-tier drake steeped in void magic and alien cunning."),
  elderFlameDrake: makeEnemy("elderFlameDrake", "Elder Flame Drake", 5, "standard", { mind: 6, body: 11, soul: 13 }, 88, "hide", "flameWand", 4, { resistances: ["fire", "physical"], weaknesses: ["ice"] }, 1.14, ["flameWand", "trollFist", "heavyClub"], 0.6, "An elder fire drake with relentless Burn pressure."),

  theGraveKing: makeEnemy("theGraveKing", "The Grave King", 5, "boss", { mind: 8, body: 13, soul: 12 }, 140, "heavy", "boneSword", 5, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 2.35, ["boneSword", "stormRod", "sword", "axe"], 0.68, "An endgame undead sovereign and final trial of the grave road."),
  worldfireArchon: makeEnemy("worldfireArchon", "Worldfire Archon", 5, "boss", { mind: 10, body: 7, soul: 15 }, 122, "robe", "flameWand", 4, { resistances: ["fire"], weaknesses: ["ice"] }, 2.3, ["flameWand", "wand", "staff"], 0.68, "A living pillar of flame waiting at the edge of the world."),
  theSoulEater: makeEnemy("theSoulEater", "The Soul Eater", 5, "boss", { mind: 13, body: 8, soul: 14 }, 128, "none", "stormRod", 5, { resistances: ["physical", "poison"], weaknesses: ["lightning"], statusImmunities: ["bleed", "poison"] }, 2.4, ["stormRod", "shadowBlade", "wand"], 0.7, "A final trial horror that devours memory, will, and light."),
  dragonboundKoboldKing: makeEnemy("dragonboundKoboldKing", "Dragonbound Kobold King", 5, "boss", { mind: 12, body: 8, soul: 15 }, 124, "medium", "flameWand", 5, { resistances: ["fire", "lightning"], weaknesses: ["ice"] }, 2.32, ["flameWand", "stormRod", "shadowBlade"], 0.7, "A final kobold king empowered by draconic fire and storm rites."),
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
  builderAvatarPreview: document.querySelector("#builderAvatarPreview"),
  builderAvatarTitle: document.querySelector("#builderAvatarTitle"),
  builderAvatarMeta: document.querySelector("#builderAvatarMeta"),
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
  playerLevelTier: document.querySelector("#playerLevelTier"),
  playerXpBar: document.querySelector("#playerXpBar"),
  playerAvatar: document.querySelector("#playerAvatar"),
  saveStatus: document.querySelector("#saveStatus"),
  playerGenderLine: document.querySelector("#playerGenderLine"),
  playerAc: document.querySelector("#playerAc"),
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
  turnText: document.querySelector("#turnText"),
  actionText: document.querySelector("#actionText"),
  majorActionStatus: document.querySelector("#majorActionStatus"),
  minorActionStatus: document.querySelector("#minorActionStatus"),
  attackButton: document.querySelector("#attackButton"),
  majorSkillButton: document.querySelector("#majorSkillButton"),
  minorSkillButton: document.querySelector("#minorSkillButton"),
  recoverButton: document.querySelector("#recoverButton"),
  focusButton: document.querySelector("#focusButton"),
  shakeOffButton: document.querySelector("#shakeOffButton"),
  deathmarkButton: document.querySelector("#deathmarkButton"),
  perfectExecutionButton: document.querySelector("#perfectExecutionButton"),
  arcaneSurgeButton: document.querySelector("#arcaneSurgeButton"),
  dualElementsButton: document.querySelector("#dualElementsButton"),
  overchannelButton: document.querySelector("#overchannelButton"),
  cataclysmButton: document.querySelector("#cataclysmButton"),
  masterOfMagicButton: document.querySelector("#masterOfMagicButton"),
  firestormButton: document.querySelector("#firestormButton"),
  worldfireButton: document.querySelector("#worldfireButton"),
  arcJumpButton: document.querySelector("#arcJumpButton"),
  stormAvatarButton: document.querySelector("#stormAvatarButton"),
  overloadButton: document.querySelector("#overloadButton"),
  arcaneCataclysmButton: document.querySelector("#arcaneCataclysmButton"),
  perfectFocusButton: document.querySelector("#perfectFocusButton"),
  innerReserveButton: document.querySelector("#innerReserveButton"),
  transcendenceButton: document.querySelector("#transcendenceButton"),
  enlightenmentButton: document.querySelector("#enlightenmentButton"),
  immovableBastionButton: document.querySelector("#immovableBastionButton"),
  eternalBastionButton: document.querySelector("#eternalBastionButton"),
  judgmentWallButton: document.querySelector("#judgmentWallButton"),
  divineChampionButton: document.querySelector("#divineChampionButton"),
  eternalOathButton: document.querySelector("#eternalOathButton"),
  wrathIncarnateButton: document.querySelector("#wrathIncarnateButton"),
  psionicRecoveryButton: document.querySelector("#psionicRecoveryButton"),
  trueSightButton: document.querySelector("#trueSightButton"),
  perfectPredictionButton: document.querySelector("#perfectPredictionButton"),
  gravityBreakButton: document.querySelector("#gravityBreakButton"),
  livingWallButton: document.querySelector("#livingWallButton"),
  clearSkillButton: document.querySelector("#clearSkillButton"),
  endTurnButton: document.querySelector("#endTurnButton"),
  nextEncounterButton: document.querySelector("#nextEncounterButton"),
  inventoryList: document.querySelector("#inventoryList"),
  shopCurrency: document.querySelector("#shopCurrency"),
  shopList: document.querySelector("#shopList"),
  innButton: document.querySelector("#innButton"),
  betweenBattleText: document.querySelector("#betweenBattleText"),
  tierTrialButton: document.querySelector("#tierTrialButton"),
  finalTrialButton: document.querySelector("#finalTrialButton"),
  adminQaPanel: document.querySelector("#adminQaPanel"),
  adminQaLevelSelect: document.querySelector("#adminQaLevelSelect"),
  adminQaSetLevelButton: document.querySelector("#adminQaSetLevelButton"),
  adminQaClassSelect: document.querySelector("#adminQaClassSelect"),
  adminQaSubclassSelect: document.querySelector("#adminQaSubclassSelect"),
  adminQaRebuildButton: document.querySelector("#adminQaRebuildButton"),
  adminQaGold10Button: document.querySelector("#adminQaGold10Button"),
  adminQaGold100Button: document.querySelector("#adminQaGold100Button"),
  adminQaResetCombatButton: document.querySelector("#adminQaResetCombatButton"),
  adminQaAddSelect: document.querySelector("#adminQaAddSelect"),
  adminQaAddButton: document.querySelector("#adminQaAddButton"),
  adminQaEnemySelect: document.querySelector("#adminQaEnemySelect"),
  adminQaEnemyLevelSelect: document.querySelector("#adminQaEnemyLevelSelect"),
  adminQaStartCombatButton: document.querySelector("#adminQaStartCombatButton"),
  adminQaPlayerStatusSelect: document.querySelector("#adminQaPlayerStatusSelect"),
  adminQaApplyPlayerStatusButton: document.querySelector("#adminQaApplyPlayerStatusButton"),
  adminQaEnemyStatusSelect: document.querySelector("#adminQaEnemyStatusSelect"),
  adminQaApplyEnemyStatusButton: document.querySelector("#adminQaApplyEnemyStatusButton"),
  adminQaPlayerHpFullButton: document.querySelector("#adminQaPlayerHpFullButton"),
  adminQaPlayerHpOneButton: document.querySelector("#adminQaPlayerHpOneButton"),
  adminQaPlayerManaFullButton: document.querySelector("#adminQaPlayerManaFullButton"),
  adminQaPlayerStaminaFullButton: document.querySelector("#adminQaPlayerStaminaFullButton"),
  adminQaClearStatusesButton: document.querySelector("#adminQaClearStatusesButton"),
  adminQaClearCooldownsButton: document.querySelector("#adminQaClearCooldownsButton"),
  adminQaResetFlagsButton: document.querySelector("#adminQaResetFlagsButton"),
  adminQaEnemyHpFullButton: document.querySelector("#adminQaEnemyHpFullButton"),
  adminQaEnemyHpThirtyButton: document.querySelector("#adminQaEnemyHpThirtyButton"),
  adminQaEnemyHpOneButton: document.querySelector("#adminQaEnemyHpOneButton"),
  adminQaD20OneButton: document.querySelector("#adminQaD20OneButton"),
  adminQaD20TenButton: document.querySelector("#adminQaD20TenButton"),
  adminQaD20FifteenButton: document.querySelector("#adminQaD20FifteenButton"),
  adminQaD20TwentyButton: document.querySelector("#adminQaD20TwentyButton"),
  adminQaD20CustomInput: document.querySelector("#adminQaD20CustomInput"),
  adminQaD20CustomButton: document.querySelector("#adminQaD20CustomButton"),
  adminQaStatusSuccessButton: document.querySelector("#adminQaStatusSuccessButton"),
  adminQaStatusFailButton: document.querySelector("#adminQaStatusFailButton"),
  adminQaStatusCustomInput: document.querySelector("#adminQaStatusCustomInput"),
  adminQaStatusCustomButton: document.querySelector("#adminQaStatusCustomButton"),
  adminQaDamageMinButton: document.querySelector("#adminQaDamageMinButton"),
  adminQaDamageMaxButton: document.querySelector("#adminQaDamageMaxButton"),
  adminQaClearOverridesButton: document.querySelector("#adminQaClearOverridesButton"),
  adminQaOverrideStatus: document.querySelector("#adminQaOverrideStatus"),
  adminFeatureInspectorBody: document.querySelector("#adminFeatureInspectorBody"),
  adminCopyDebugButton: document.querySelector("#adminCopyDebugButton"),
  adminCopyDebugStatus: document.querySelector("#adminCopyDebugStatus"),
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
  characterButton: document.querySelector("#characterButton"),
  characterModal: document.querySelector("#characterModal"),
  characterModalBody: document.querySelector("#characterModalBody"),
  characterCloseButton: document.querySelector("#characterCloseButton"),
  inventoryButton: document.querySelector("#inventoryButton"),
  inventoryModal: document.querySelector("#inventoryModal"),
  inventoryCloseButton: document.querySelector("#inventoryCloseButton"),
  deleteAdventureModal: document.querySelector("#deleteAdventureModal"),
  cancelDeleteAdventureButton: document.querySelector("#cancelDeleteAdventureButton"),
  confirmDeleteAdventureButton: document.querySelector("#confirmDeleteAdventureButton"),
  resetButton: document.querySelector("#resetButton"),
  diceLog: document.querySelector("#diceLog"),
};

function resumeScreenMusicFromInteraction() {
  if (!isPageMusicAllowed()) return;
  state.musicSuppressedByFocus = false;
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
  if (!isPageMusicAllowed()) {
    state.musicSuppressedByFocus = true;
    pauseAllMusicImmediately();
    return;
  }
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

function pauseAllMusicImmediately() {
  ["hubMusic", "innMusic", "battleMusic", "battleMusicAlt"].forEach((key) => {
    const audio = getMusicElement(key);
    if (!audio) return;
    clearFade(audio);
    audio.pause();
    audio.volume = 0;
  });
  state.activeMusicKey = null;
}

function isPageMusicAllowed() {
  return document.visibilityState !== "hidden" && document.hasFocus();
}

function handleMusicFocusChange() {
  if (!isPageMusicAllowed()) {
    state.musicSuppressedByFocus = true;
    pauseAllMusicImmediately();
  }
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
  if (!isPageMusicAllowed() || state.musicSuppressedByFocus) {
    pauseAllMusicImmediately();
    return;
  }
  if (screenName === "auth" || screenName === "hub" || screenName === "builder" || screenName === "graveyard") {
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
  sneakAttackUsed: false,
  deathsOpeningUsed: false,
  assassinateUsed: false,
  quickReadUsedThisTurn: false,
  flowingStrikesUsedThisTurn: false,
  killersRhythmUsedThisTurn: false,
  shadowFlurryChecked: false,
  shadowFlurryUsed: false,
  evasionUsed: false,
  ghostStepUsed: false,
  monkGhostStepUsed: false,
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
  arcJumpUsed: false,
  arcJumpActive: false,
  stormAvatarUsed: false,
  stormAvatarActive: false,
  stillnessUsed: false,
  innerReserveUsed: false,
  transcendenceUsed: false,
  enlightenmentUsed: false,
  pendingExtraTurn: false,
  overloadUsed: false,
  overloadActive: false,
  arcaneCataclysmUsed: false,
  arcaneCataclysmActive: false,
  wildCastingUsedThisTurn: false,
  perfectFocusUsed: false,
  perfectFocusActive: false,
  veteranGritUsed: false,
  unbreakableUsed: false,
  unbreakableLineUsed: false,
  immovableBastionUsed: false,
  immovableBastionActive: false,
  eternalBastionUsed: false,
  eternalBastionActive: false,
  judgmentWallUsed: false,
  judgmentWallActive: false,
  crushingCounterActive: false,
  sacredResolveUsed: false,
  layOnHandsUsed: false,
  divineChampionUsed: false,
  divineChampionActive: false,
  divineShelterUsed: false,
  eternalOathUsed: false,
  eternalOathActive: false,
  judgmentBrandActive: false,
  brandedTargetId: null,
  relentlessVengeanceUsed: false,
  wrathIncarnateUsed: false,
  wrathIncarnateActive: false,
  psychicEchoUsed: false,
  psionicRecoveryUsed: false,
  trueSightUsed: false,
  trueSightActive: false,
  foresightUsed: false,
  premonitionUsed: false,
  perfectPredictionUsed: false,
  perfectPredictionActive: false,
  invisibleHandUsed: false,
  gravityBreakUsed: false,
  gravityBreakActive: false,
  livingWallUsed: false,
  livingWallActive: false,
  godOfCarnageUsed: false,
  godOfCarnageBonusAttackAvailable: false,
  bloodlustStacks: 0,
  deathRecordInFlight: false,
  lastRewards: [],
  lastProgressionResults: [],
  progress: null,
  levelUpDraft: { stat: null, subclass: null, progressionChoice: null },
  activeCodexSection: "classes",
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
  musicSuppressedByFocus: false,
  pendingDeleteAdventureId: null,
  adminForcedD20: null,
  adminForcedStatusRoll: null,
  adminForcedDamageRoll: null,
};

function rollRaw(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function roll(sides) {
  if (sides === 20 && isAdminQaUser() && Number.isInteger(state.adminForcedD20)) {
    const forced = clamp(state.adminForcedD20, 1, 20);
    state.adminForcedD20 = null;
    addLog("Admin QA: forced d20 used.");
    renderAdminQaOverrideStatus();
    return forced;
  }
  return rollRaw(sides);
}

function rollStatusChance(chancePercent) {
  if (isAdminQaUser() && state.adminForcedStatusRoll) {
    const override = state.adminForcedStatusRoll;
    state.adminForcedStatusRoll = null;
    addLog("Admin QA: forced status roll used.");
    renderAdminQaOverrideStatus();
    if (override.mode === "success") {
      return { rollValue: Math.max(1, Math.min(100, chancePercent || 1)), succeeds: true, forced: true };
    }
    if (override.mode === "fail") {
      return { rollValue: Math.min(100, Math.max(1, (chancePercent || 0) + 1)), succeeds: false, forced: true };
    }
    const rollValue = clamp(override.value ?? rollRaw(100), 1, 100);
    return { rollValue, succeeds: rollValue <= chancePercent, forced: true };
  }
  const rollValue = rollRaw(100);
  return { rollValue, succeeds: rollValue <= chancePercent, forced: false };
}

function getStatModifier(statValue) {
  return Math.floor(((Number.isInteger(statValue) ? statValue : MIN_STAT) - 1) / 2);
}

function getXpRequiredForNextLevel(level) {
  if (level >= MAX_LEVEL) return 0;
  return getTotalXpForLevel(level + 1) - getTotalXpForLevel(level);
}

function getTotalXpForLevel(level) {
  const targetLevel = clamp(level, 1, MAX_LEVEL);
  return XP_THRESHOLDS[targetLevel - 1] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
}

function getPowerTier(level) {
  const safeLevel = clamp(level ?? 1, 1, MAX_LEVEL);
  if (safeLevel <= 20) return { tier: 1, name: "Initiate" };
  if (safeLevel <= 50) return { tier: 2, name: "Veteran" };
  if (safeLevel <= 100) return { tier: 3, name: "Elite" };
  if (safeLevel <= 150) return { tier: 4, name: "Mythic" };
  return { tier: 5, name: "Legendary" };
}

function formatPowerTier(level) {
  const tier = getPowerTier(level);
  return `Tier ${tier.tier} â€” ${tier.name}`;
}

function formatPowerTierName(level) {
  return getPowerTier(level).name;
}

function doesLevelGrantStatIncrease(level) {
  return [4, 8, 12, 16, 19].includes(level);
}

function getLevelDamageBonus(combatant) {
  return Math.floor((combatant?.level ?? 1) / 4);
}

function getLevelDefenseBonus(combatant) {
  return Math.floor((combatant?.level ?? 1) / 3);
}

function normalizePlayerIdentity(player) {
  if (!player) return;
  player.id = player.id ?? "player";
  player.name = String(player.name ?? "Adventurer").trim() || "Adventurer";
  player.description = player.description ?? "";
  player.gender = normalizeGender(player.gender);
}

function clearCombatStatuses(...combatants) {
  combatants.forEach((combatant) => {
    if (!combatant?.statuses) return;
    combatant.statuses = [];
  });
}

function normalizeGender(genderId) {
  const normalized = String(genderId ?? "")
    .trim()
    .toLowerCase();
  return GENDER_OPTIONS.find((option) => option.id === normalized)?.id ?? "undisclosed";
}

function formatGenderLabel(genderId) {
  return GENDER_OPTIONS.find((option) => option.id === normalizeGender(genderId))?.label ?? "Undisclosed";
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

function getClassPortraitPath(classId, genderId) {
  const normalizedGender = normalizeGender(genderId);
  const normalizedClassId = normalizeClassId(classId);
  return (
    CLASS_PORTRAITS[normalizedClassId]?.[normalizedGender] ??
    CLASS_PORTRAITS[normalizedClassId]?.undisclosed ??
    CLASS_PORTRAITS.warrior.undisclosed
  );
}

function getClassArmorId(classId) {
  return classArmorIds[normalizeClassId(classId, "")] ?? "none";
}

function getValidWeaponIdsForClass(classId) {
  return classWeaponIds[normalizeClassId(classId, "")] ?? classWeaponIds.warrior;
}

function getBuilderWeaponId(classId = state.builderSelectedClassId) {
  const validWeaponIds = getValidWeaponIdsForClass(classId);
  const selectedWeaponId = elements.weaponSelect?.value;
  return validWeaponIds.includes(selectedWeaponId) ? selectedWeaponId : validWeaponIds[0];
}

function syncBuilderWeaponOptions(classId = state.builderSelectedClassId) {
  if (!elements.weaponSelect) return;
  const validWeaponIds = getValidWeaponIdsForClass(classId);
  const selectedWeaponId = getBuilderWeaponId(classId);
  elements.weaponSelect.innerHTML = "";
  validWeaponIds.forEach((weaponId) => {
    const option = document.createElement("option");
    option.value = weaponId;
    option.textContent = weapons[weaponId]?.name ?? titleCase(weaponId);
    elements.weaponSelect.append(option);
  });
  elements.weaponSelect.value = selectedWeaponId;
}

function renderCharacterAvatar(classId, genderId, label, options = {}) {
  const normalizedClassId = normalizeClassId(classId);
  const classDef = classes[normalizedClassId];
  const portraitPath = getClassPortraitPath(normalizedClassId, genderId);
  const sizeClass = options.large ? " character-avatar-large" : options.small ? " character-avatar-small" : "";
  const alt = label ? `${label} portrait` : `${classDef?.name ?? "Character"} portrait`;
  return `<span class="character-avatar${sizeClass}"><img src="${portraitPath}" alt="${escapeAttribute(alt)}" loading="${
    options.eager ? "eager" : "lazy"
  }" decoding="async"></span>`;
}

function setCharacterAvatar(element, classId, genderId, label, options = {}) {
  if (!element) return;
  element.innerHTML = `<img src="${getClassPortraitPath(classId, genderId)}" alt="${escapeAttribute(
    label ? `${label} portrait` : "Character portrait"
  )}" loading="${options.eager ? "eager" : "lazy"}" decoding="async">`;
}

function renderEnemyPortrait(combatant) {
  if (!elements.enemyPortrait) return;
  const portrait = getEnemyPortrait(combatant?.templateId);
  elements.enemyPortrait.style.setProperty("--enemy-portrait-accent", portrait.accent);
  elements.enemyPortrait.style.setProperty("--enemy-portrait-bg", portrait.bg);
  elements.enemyPortrait.innerHTML = portrait.src
    ? `<img class="enemy-portrait-image" src="${portrait.src}" alt="" loading="eager" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false;"><span class="enemy-portrait-glyph" hidden>${ENEMY_PORTRAITS.default.icon}</span>`
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
  const builderActive = screenName === "builder";
  const graveyardActive = screenName === "graveyard";
  document.body.classList.toggle("scene-mode", combatActive || hubActive || builderActive || graveyardActive);
  document.body.dataset.sceneKind = combatActive ? state.sceneBackgroundKind : hubActive || builderActive ? "hub" : graveyardActive ? "graveyard" : "";
  document.body.style.backgroundImage =
    combatActive
      ? `linear-gradient(180deg, rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.72)), url("${state.sceneBackgroundUrl}")`
      : hubActive || builderActive
        ? `linear-gradient(180deg, rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.72)), url("login-splash-background.jpg")`
        : graveyardActive
          ? `linear-gradient(180deg, rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.72)), url("assets/backgrounds/graveyard/graveyard-background.jpg")`
          : "";
  document.body.style.backgroundSize = "";
  document.body.style.backgroundPosition = combatActive || hubActive || builderActive || graveyardActive ? "center center" : "";
  document.body.style.backgroundRepeat = combatActive || hubActive || builderActive || graveyardActive ? "no-repeat" : "";
  document.body.style.backgroundAttachment = combatActive || hubActive || builderActive || graveyardActive ? "fixed" : "";
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

function halveCurrencyValue(currency) {
  const copper = Math.floor(currencyToCopper(currency) / 2);
  return normalizeCurrency({ copper, silver: 0, gold: 0 });
}

function getConsumableSellValue(item) {
  return item?.sellValue ? normalizeCurrency(item.sellValue) : halveCurrencyValue(item?.cost ?? {});
}

function getWeaponSellValue(weaponId) {
  return normalizeCurrency(weapons[weaponId]?.sellValue ?? weaponSellValues[weaponId] ?? { copper: 5, silver: 0, gold: 0 });
}

function isBetweenBattles() {
  return state.gameState === GAME_STATES.betweenBattles;
}

function playerNeedsInnRest(player) {
  return Boolean(player && (player.hp < player.maxHp || player.mana < player.maxMana || player.stamina < player.maxStamina));
}

function getInnButtonState(player) {
  if (!player || state.gameState !== GAME_STATES.betweenBattles) {
    return { disabled: true, title: "Stay at the Inn is available between battles." };
  }
  if (!playerNeedsInnRest(player)) {
    return { disabled: true, title: "You are already fully rested." };
  }
  if (!canAffordCurrency(player.inventory.currency, INN_PRICE)) {
    return { disabled: true, title: `You need ${formatCurrencyCompact(INN_PRICE)}.` };
  }
  return { disabled: false, title: "Restore HP, Mana, and Stamina." };
}

function updateInnButtonState() {
  if (!elements.innButton) return;
  const buttonState = getInnButtonState(state.player);
  elements.innButton.disabled = buttonState.disabled;
  elements.innButton.title = buttonState.title;
}

function canEquipWeaponId(player, weaponId) {
  if (!player || !weapons[weaponId]) return false;
  return player.inventory.weapons.includes(weaponId) && getValidWeaponIdsForClass(player.classDef?.id).includes(weaponId);
}

function findFallbackWeaponId(player, excludingWeaponId = null) {
  const validWeaponIds = getValidWeaponIdsForClass(player.classDef?.id);
  return player.inventory.weapons.find((weaponId) => weaponId !== excludingWeaponId && validWeaponIds.includes(weaponId)) ?? null;
}

function formatDateOnly(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
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

function getArmorImagePath(armorId) {
  return armorImages[armorId] ?? ARMOR_IMAGE_FALLBACK;
}

function renderArmorImage(armorId, armorName, options = {}) {
  const label = armorName ?? safeEntityName(armors, armorId, "Armor");
  const showName = options.showName ?? true;
  const sizeClass = options.size ? ` armor-image-${options.size}` : "";
  return `
    <span class="armor-inline${options.compact ? " compact" : ""}">
      <img
        class="armor-image${sizeClass}"
        src="${getArmorImagePath(armorId)}"
        alt=""
        aria-hidden="true"
        onerror="this.onerror=null;this.src='${ARMOR_IMAGE_FALLBACK}'"
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

function getItemImagePath(itemId) {
  return itemImages[itemId] ?? "";
}

function renderItemIcon(itemDef) {
  const fallbackMarkup = itemDef.restoreType ? renderPotionIcon(itemDef) : renderUtilityItemIcon(itemDef);
  const imagePath = getItemImagePath(itemDef.id);
  if (!imagePath) {
    return `<span class="item-icon item-icon-${getItemTierLabel(itemDef.id)}">${fallbackMarkup}</span>`;
  }
  return `
    <span class="item-icon item-icon-${getItemTierLabel(itemDef.id)}">
      <img
        src="${imagePath}"
        alt=""
        aria-hidden="true"
        onerror="this.hidden=true;this.nextElementSibling.hidden=false"
      >
      <span class="item-icon-fallback" hidden>${fallbackMarkup}</span>
    </span>
  `;
}

function formatPercent(value) {
  return `${Math.round((value ?? 0) * 100)}%`;
}

function formatItemDetails(itemDef) {
  const parts = [itemDef.description];
  if (itemDef.restoreType) {
    parts.push(`Use: Restores ${formatPercent(itemDef.restorePercent)} of max ${titleCase(itemDef.restoreType)}.`);
  }
  if (itemDef.removesStatuses?.length) {
    parts.push(`Removes ${itemDef.removesStatuses.map((statusId) => statusDefinitions[statusId]?.name ?? statusId).join(" or ")}.`);
  }
  parts.push(`Action: ${titleCase(itemDef.actionType)}.`);
  return parts.join(" ");
}

function formatItemInfoBody(itemDef) {
  if (!itemDef) return "";
  const lines = [];
  lines.push(itemDef.description);
  if (itemDef.restoreType) {
    lines.push(`Effect: Restores ${formatPercent(itemDef.restorePercent)} of max ${titleCase(itemDef.restoreType)}.`);
  }
  if (itemDef.removesStatuses?.length) {
    lines.push(`Effect: Removes ${itemDef.removesStatuses.map((statusId) => statusDefinitions[statusId]?.name ?? statusId).join(" or ")}.`);
  }
  lines.push(`Action: ${titleCase(itemDef.actionType)}.`);
  if (itemDef.cost) {
    lines.push(`Shop cost: ${formatCurrencyDetailed(itemDef.cost)}.`);
  }
  const sellValue = getConsumableSellValue(itemDef);
  if (currencyToCopper(sellValue) > 0) {
    lines.push(`Sell value: ${formatCurrencyDetailed(sellValue)}.`);
  }
  const useState = state.player ? getConsumableUseState(state.player, itemDef) : null;
  if (useState && !useState.usable) {
    lines.push(`Restriction: ${useState.reason}`);
  }
  return lines.join("|");
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

function getSnapshotGender(snapshot) {
  return normalizeGender(snapshot?.player?.gender ?? snapshot?.builderGender ?? "undisclosed");
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
  updateTopNavigation(screenName);
  applySceneBackground(screenName);
  syncScreenMusic(screenName);
}

function currentScreenName() {
  if (!elements.authScreen.hidden) return "auth";
  if (!elements.hubScreen.hidden) return "hub";
  if (!elements.graveyardScreen.hidden) return "graveyard";
  if (!elements.builderScreen.hidden) return "builder";
  if (!elements.combatScreen.hidden) return "combat";
  return "auth";
}

function updateTopNavigation(screenName = currentScreenName()) {
  const showNavigation = screenName !== "auth";
  if (elements.resetButton) {
    elements.resetButton.hidden = !showNavigation;
    elements.resetButton.textContent = "Adventure Hub";
    elements.resetButton.classList.toggle("active", screenName === "hub");
  }
  if (elements.codexButton) {
    elements.codexButton.hidden = !showNavigation;
    elements.codexButton.classList.toggle("active", !elements.codexModal?.hidden);
  }
  if (elements.characterButton) {
    const showCharacter = showNavigation && !!state.player;
    elements.characterButton.hidden = !showCharacter;
    elements.characterButton.classList.toggle("active", showCharacter && !elements.characterModal?.hidden);
  }
  if (elements.inventoryButton) {
    const showInventory = showNavigation && !!state.player;
    elements.inventoryButton.hidden = !showInventory;
    elements.inventoryButton.classList.toggle("active", showInventory && !elements.inventoryModal?.hidden);
  }
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
      sneakAttackUsed: state.sneakAttackUsed ?? false,
      deathsOpeningUsed: state.deathsOpeningUsed ?? false,
      assassinateUsed: state.assassinateUsed ?? false,
      quickReadUsedThisTurn: state.quickReadUsedThisTurn ?? false,
      flowingStrikesUsedThisTurn: state.flowingStrikesUsedThisTurn ?? false,
      killersRhythmUsedThisTurn: state.killersRhythmUsedThisTurn ?? false,
      shadowFlurryChecked: state.shadowFlurryChecked ?? false,
      shadowFlurryUsed: state.shadowFlurryUsed ?? false,
      evasionUsed: state.evasionUsed ?? false,
      ghostStepUsed: state.ghostStepUsed ?? false,
      monkGhostStepUsed: state.monkGhostStepUsed ?? false,
      deathmarkUsed: state.deathmarkUsed ?? false,
      deathmarkTargetId: state.deathmarkTargetId ?? null,
      deathmarkActive: state.deathmarkActive ?? false,
      perfectExecutionUsed: state.perfectExecutionUsed ?? false,
      perfectExecutionActive: state.perfectExecutionActive ?? false,
      arcaneInsightUsed: state.arcaneInsightUsed ?? false,
      mindOverMatterUsed: state.mindOverMatterUsed ?? false,
      doubleCastUsed: state.doubleCastUsed ?? false,
      spellEchoUsed: state.spellEchoUsed ?? false,
      arcaneSurgeUsed: state.arcaneSurgeUsed ?? false,
      arcaneSurgeActive: state.arcaneSurgeActive ?? false,
      dualElementsUsed: state.dualElementsUsed ?? false,
      dualElementsActive: state.dualElementsActive ?? false,
      overchannelUsed: state.overchannelUsed ?? false,
      overchannelActive: state.overchannelActive ?? false,
      cataclysmUsed: state.cataclysmUsed ?? false,
      cataclysmActive: state.cataclysmActive ?? false,
      masterOfMagicUsed: state.masterOfMagicUsed ?? false,
      masterOfMagicActive: state.masterOfMagicActive ?? false,
      firestormUsed: state.firestormUsed ?? false,
      firestormActive: state.firestormActive ?? false,
      worldfireUsed: state.worldfireUsed ?? false,
      worldfireActive: state.worldfireActive ?? false,
      arcJumpUsed: state.arcJumpUsed ?? false,
      arcJumpActive: state.arcJumpActive ?? false,
      stormAvatarUsed: state.stormAvatarUsed ?? false,
      stormAvatarActive: state.stormAvatarActive ?? false,
      stillnessUsed: state.stillnessUsed ?? false,
      innerReserveUsed: state.innerReserveUsed ?? false,
      transcendenceUsed: state.transcendenceUsed ?? false,
      enlightenmentUsed: state.enlightenmentUsed ?? false,
      pendingExtraTurn: state.pendingExtraTurn ?? false,
      overloadUsed: state.overloadUsed ?? false,
      overloadActive: state.overloadActive ?? false,
      arcaneCataclysmUsed: state.arcaneCataclysmUsed ?? false,
      arcaneCataclysmActive: state.arcaneCataclysmActive ?? false,
      wildCastingUsedThisTurn: state.wildCastingUsedThisTurn ?? false,
      perfectFocusUsed: state.perfectFocusUsed ?? false,
      perfectFocusActive: state.perfectFocusActive ?? false,
      veteranGritUsed: state.veteranGritUsed ?? false,
      unbreakableUsed: state.unbreakableUsed ?? false,
      unbreakableLineUsed: state.unbreakableLineUsed ?? false,
      immovableBastionUsed: state.immovableBastionUsed ?? false,
      immovableBastionActive: state.immovableBastionActive ?? false,
      eternalBastionUsed: state.eternalBastionUsed ?? false,
      eternalBastionActive: state.eternalBastionActive ?? false,
      judgmentWallUsed: state.judgmentWallUsed ?? false,
      judgmentWallActive: state.judgmentWallActive ?? false,
      crushingCounterActive: state.crushingCounterActive ?? false,
      sacredResolveUsed: state.sacredResolveUsed ?? false,
      layOnHandsUsed: state.layOnHandsUsed ?? false,
      divineChampionUsed: state.divineChampionUsed ?? false,
      divineChampionActive: state.divineChampionActive ?? false,
      divineShelterUsed: state.divineShelterUsed ?? false,
      eternalOathUsed: state.eternalOathUsed ?? false,
      eternalOathActive: state.eternalOathActive ?? false,
      judgmentBrandActive: state.judgmentBrandActive ?? false,
      brandedTargetId: state.brandedTargetId ?? null,
      relentlessVengeanceUsed: state.relentlessVengeanceUsed ?? false,
      wrathIncarnateUsed: state.wrathIncarnateUsed ?? false,
      wrathIncarnateActive: state.wrathIncarnateActive ?? false,
      psychicEchoUsed: state.psychicEchoUsed ?? false,
      psionicRecoveryUsed: state.psionicRecoveryUsed ?? false,
      trueSightUsed: state.trueSightUsed ?? false,
      trueSightActive: state.trueSightActive ?? false,
      foresightUsed: state.foresightUsed ?? false,
      premonitionUsed: state.premonitionUsed ?? false,
      perfectPredictionUsed: state.perfectPredictionUsed ?? false,
      perfectPredictionActive: state.perfectPredictionActive ?? false,
      invisibleHandUsed: state.invisibleHandUsed ?? false,
      gravityBreakUsed: state.gravityBreakUsed ?? false,
      gravityBreakActive: state.gravityBreakActive ?? false,
      livingWallUsed: state.livingWallUsed ?? false,
      livingWallActive: state.livingWallActive ?? false,
      godOfCarnageUsed: state.godOfCarnageUsed ?? false,
      godOfCarnageBonusAttackAvailable: state.godOfCarnageBonusAttackAvailable ?? false,
      bloodlustStacks: state.bloodlustStacks ?? 0,
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

function normalizeClassId(value, fallback = "warrior") {
  const raw = typeof value === "string" ? value : value?.id ?? value?.name ?? "";
  const key = raw.trim().toLowerCase().replace(/[\s_-]+/g, "");
  return legacyClassAliases[key] ?? (classes[raw]?.id ?? fallback);
}

function normalizePlayerClass(player) {
  if (!player) return;
  const classId = normalizeClassId(player.classDef ?? player.classId ?? player.class);
  player.classDef = classes[classId] ?? classes.warrior;
  if (player.subclassId && !subclasses[player.classDef.id]?.[player.subclassId]) {
    player.subclassId = null;
  }
}

function loadSnapshot(snapshot) {
  state.gameState = snapshot.gameState ?? GAME_STATES.betweenBattles;
  state.builderSelectedClassId = normalizeClassId(snapshot.builderSelectedClassId ?? snapshot.player?.classDef ?? snapshot.player?.classId);
  state.builderGender = normalizeGender(snapshot.builderGender ?? snapshot.player?.gender ?? "undisclosed");
  state.player = snapshot.player;
  normalizePlayerIdentity(state.player);
  normalizePlayerClass(state.player);
  normalizePlayerInventory(state.player);
  normalizeCombatantLoadout(state.player);
  normalizePlayerScaling(state.player);
  normalizePlayerProgression(state.player);
  normalizePlayerTierTrials(state.player);
  if (state.player.inventory?.consumables?.healthPotion) {
    state.player.inventory.consumables.minorHealthPotion =
      (state.player.inventory.consumables.minorHealthPotion ?? 0) + state.player.inventory.consumables.healthPotion;
    delete state.player.inventory.consumables.healthPotion;
  }
  state.enemy = snapshot.enemy;
  normalizeCombatantStats(state.enemy);
  normalizeCombatantLoadout(state.enemy);
  state.turnIndex = snapshot.turnIndex ?? 0;
  state.actionUsed = snapshot.actionUsed ?? false;
  state.majorActionUsed = snapshot.majorActionUsed ?? (snapshot.actionUsed ?? false);
  state.minorActionsUsed = snapshot.minorActionsUsed ?? 0;
  state.turnStarted = snapshot.turnStarted ?? false;
  syncActionState();
  state.round = snapshot.round ?? 1;
  state.isResolvingEnemyTurn = false;
  state.pendingLevelUps = Math.max(0, Number.parseInt(snapshot.pendingLevelUps, 10) || 0);
  state.pendingLevelQueue = Array.isArray(snapshot.pendingLevelQueue)
    ? snapshot.pendingLevelQueue.map((level) => clamp(Number.parseInt(level, 10) || 0, 2, MAX_LEVEL)).filter((level) => level >= 2)
    : [];
  if (!state.pendingLevelQueue.length && state.pendingLevelUps > 0 && state.player) {
    const startLevel = Math.max(2, state.player.level - state.pendingLevelUps + 1);
    for (let level = startLevel; level <= state.player.level; level += 1) {
      state.pendingLevelQueue.push(level);
    }
  }
  state.pendingLevelQueue = Array.from(new Set(state.pendingLevelQueue)).filter((level) => level <= (state.player?.level ?? MAX_LEVEL));
  state.pendingLevelUps = Math.min(state.pendingLevelUps, state.pendingLevelQueue.length);
  state.combatEnded = snapshot.combatEnded ?? false;
  state.sneakAttackUsed = snapshot.sneakAttackUsed ?? false;
  state.deathsOpeningUsed = snapshot.deathsOpeningUsed ?? false;
  state.assassinateUsed = snapshot.assassinateUsed ?? false;
  state.quickReadUsedThisTurn = snapshot.quickReadUsedThisTurn ?? false;
  state.flowingStrikesUsedThisTurn = snapshot.flowingStrikesUsedThisTurn ?? false;
  state.killersRhythmUsedThisTurn = snapshot.killersRhythmUsedThisTurn ?? false;
  state.shadowFlurryChecked = snapshot.shadowFlurryChecked ?? false;
  state.shadowFlurryUsed = snapshot.shadowFlurryUsed ?? false;
  state.evasionUsed = snapshot.evasionUsed ?? false;
  state.ghostStepUsed = snapshot.ghostStepUsed ?? false;
  state.monkGhostStepUsed = snapshot.monkGhostStepUsed ?? false;
  state.deathmarkUsed = snapshot.deathmarkUsed ?? false;
  state.deathmarkTargetId = snapshot.deathmarkTargetId ?? null;
  state.deathmarkActive = snapshot.deathmarkActive ?? false;
  state.perfectExecutionUsed = snapshot.perfectExecutionUsed ?? false;
  state.perfectExecutionActive = snapshot.perfectExecutionActive ?? false;
  state.arcaneInsightUsed = snapshot.arcaneInsightUsed ?? false;
  state.mindOverMatterUsed = snapshot.mindOverMatterUsed ?? false;
  state.doubleCastUsed = snapshot.doubleCastUsed ?? false;
  state.spellEchoUsed = snapshot.spellEchoUsed ?? false;
  state.arcaneSurgeUsed = snapshot.arcaneSurgeUsed ?? false;
  state.arcaneSurgeActive = snapshot.arcaneSurgeActive ?? false;
  state.dualElementsUsed = snapshot.dualElementsUsed ?? false;
  state.dualElementsActive = snapshot.dualElementsActive ?? false;
  state.overchannelUsed = snapshot.overchannelUsed ?? false;
  state.overchannelActive = snapshot.overchannelActive ?? false;
  state.cataclysmUsed = snapshot.cataclysmUsed ?? false;
  state.cataclysmActive = snapshot.cataclysmActive ?? false;
  state.masterOfMagicUsed = snapshot.masterOfMagicUsed ?? false;
  state.masterOfMagicActive = snapshot.masterOfMagicActive ?? false;
  state.firestormUsed = snapshot.firestormUsed ?? false;
  state.firestormActive = snapshot.firestormActive ?? false;
  state.worldfireUsed = snapshot.worldfireUsed ?? false;
  state.worldfireActive = snapshot.worldfireActive ?? false;
  state.arcJumpUsed = snapshot.arcJumpUsed ?? false;
  state.arcJumpActive = snapshot.arcJumpActive ?? false;
  state.stormAvatarUsed = snapshot.stormAvatarUsed ?? false;
  state.stormAvatarActive = snapshot.stormAvatarActive ?? false;
  state.stillnessUsed = snapshot.stillnessUsed ?? false;
  state.innerReserveUsed = snapshot.innerReserveUsed ?? false;
  state.transcendenceUsed = snapshot.transcendenceUsed ?? false;
  state.enlightenmentUsed = snapshot.enlightenmentUsed ?? false;
  state.pendingExtraTurn = snapshot.pendingExtraTurn ?? false;
  state.overloadUsed = snapshot.overloadUsed ?? false;
  state.overloadActive = snapshot.overloadActive ?? false;
  state.arcaneCataclysmUsed = snapshot.arcaneCataclysmUsed ?? false;
  state.arcaneCataclysmActive = snapshot.arcaneCataclysmActive ?? false;
  state.wildCastingUsedThisTurn = snapshot.wildCastingUsedThisTurn ?? false;
  state.perfectFocusUsed = snapshot.perfectFocusUsed ?? false;
  state.perfectFocusActive = snapshot.perfectFocusActive ?? false;
  state.veteranGritUsed = snapshot.veteranGritUsed ?? false;
  state.unbreakableUsed = snapshot.unbreakableUsed ?? false;
  state.unbreakableLineUsed = snapshot.unbreakableLineUsed ?? false;
  state.immovableBastionUsed = snapshot.immovableBastionUsed ?? false;
  state.immovableBastionActive = snapshot.immovableBastionActive ?? false;
  state.eternalBastionUsed = snapshot.eternalBastionUsed ?? false;
  state.eternalBastionActive = snapshot.eternalBastionActive ?? false;
  state.judgmentWallUsed = snapshot.judgmentWallUsed ?? false;
  state.judgmentWallActive = snapshot.judgmentWallActive ?? false;
  state.crushingCounterActive = snapshot.crushingCounterActive ?? false;
  state.sacredResolveUsed = snapshot.sacredResolveUsed ?? false;
  state.layOnHandsUsed = snapshot.layOnHandsUsed ?? false;
  state.divineChampionUsed = snapshot.divineChampionUsed ?? false;
  state.divineChampionActive = snapshot.divineChampionActive ?? false;
  state.divineShelterUsed = snapshot.divineShelterUsed ?? false;
  state.eternalOathUsed = snapshot.eternalOathUsed ?? false;
  state.eternalOathActive = snapshot.eternalOathActive ?? false;
  state.judgmentBrandActive = snapshot.judgmentBrandActive ?? false;
  state.brandedTargetId = snapshot.brandedTargetId ?? null;
  state.relentlessVengeanceUsed = snapshot.relentlessVengeanceUsed ?? false;
  state.wrathIncarnateUsed = snapshot.wrathIncarnateUsed ?? false;
  state.wrathIncarnateActive = snapshot.wrathIncarnateActive ?? false;
  state.psychicEchoUsed = snapshot.psychicEchoUsed ?? false;
  state.psionicRecoveryUsed = snapshot.psionicRecoveryUsed ?? false;
  state.trueSightUsed = snapshot.trueSightUsed ?? false;
  state.trueSightActive = snapshot.trueSightActive ?? false;
  state.foresightUsed = snapshot.foresightUsed ?? false;
  state.premonitionUsed = snapshot.premonitionUsed ?? false;
  state.perfectPredictionUsed = snapshot.perfectPredictionUsed ?? false;
  state.perfectPredictionActive = snapshot.perfectPredictionActive ?? false;
  state.invisibleHandUsed = snapshot.invisibleHandUsed ?? false;
  state.gravityBreakUsed = snapshot.gravityBreakUsed ?? false;
  state.gravityBreakActive = snapshot.gravityBreakActive ?? false;
  state.livingWallUsed = snapshot.livingWallUsed ?? false;
  state.livingWallActive = snapshot.livingWallActive ?? false;
  state.godOfCarnageUsed = snapshot.godOfCarnageUsed ?? false;
  state.godOfCarnageBonusAttackAvailable = snapshot.godOfCarnageBonusAttackAvailable ?? false;
  state.bloodlustStacks = clamp(snapshot.bloodlustStacks ?? 0, 0, 10);
  state.deathRecordInFlight = false;
  state.lastRewards = snapshot.lastRewards ?? [];
  state.lastProgressionResults = snapshot.lastProgressionResults ?? [];
  state.progress = snapshot.progress ?? createProgress();
  state.winner = snapshot.winnerId === "enemy" ? state.enemy : snapshot.winnerId === "player" ? state.player : null;
  state.initiative = hydrateInitiative(snapshot);
  if (state.gameState === GAME_STATES.betweenBattles) {
    resetCombatFeatureFlags();
    clearCombatStatuses(state.player, state.enemy);
  }
}

async function saveAdventure(reason = "autosave") {
  if (!state.user) {
    if (state.saveMessage !== "Not logged in â€” progress will not be saved.") {
      state.saveMessage = "Not logged in â€” progress will not be saved.";
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
    state.saveMessage = "Not logged in â€” progress will not be saved.";
    return;
  }
  const result = await apiRequest("/api/adventures", {
    method: "POST",
    body: JSON.stringify({ snapshot: captureSnapshot() }),
  });
  state.currentAdventureId = result.adventure.id;
}

function classNameFromId(classId) {
  const normalizedClassId = normalizeClassId(classId, classId);
  return classes[normalizedClassId]?.name ?? classId;
}

function renderHub(adventures = state.activeAdventures, graveyardEntries = state.graveyardEntries) {
  elements.hubUserText.textContent = state.user ? `Signed in as ${state.user.username}` : "";
  elements.adventureSlots.innerHTML = "";
  const isTestProfileRoster = state.user?.username === "jak" && adventures.length > 3;
  const slots = isTestProfileRoster ? adventures.length : 3;
  for (let index = 0; index < slots; index += 1) {
    const adventure = adventures[index];
    const card = document.createElement("section");
    card.className = "panel soul-frame soul-metal-border soul-glass-bg hub-card";
    if (adventure) {
      card.innerHTML = `
        <div class="hub-card-portrait">
          ${renderCharacterAvatar(adventure.classId, adventure.gender, adventure.name, { large: true })}
        </div>
        <div class="hub-card-info">
          <h3>${escapeAttribute(adventure.name)}</h3>
          <p class="hub-card-class">${classNameFromId(adventure.classId)}</p>
        </div>
        <div class="hub-card-actions">
          <button class="hub-continue-button" type="button" data-continue="${adventure.id}">Continue</button>
          <button class="hub-delete-button" type="button" data-delete="${adventure.id}" aria-label="Delete ${escapeAttribute(
            adventure.name
          )}" title="Delete character">
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <path d="M8 7h8m-7 0V5h6v2m-8 3 1 9h8l1-9M10 11v6m4-6v6" />
            </svg>
          </button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <h3>Empty Slot</h3>
        <p class="stat">Create a new adventure.</p>
        <div class="hub-card-actions empty-slot-actions">
          <button type="button" data-new-slot="${index}">Create New Adventure</button>
        </div>
      `;
    }
    elements.adventureSlots.append(card);
  }
  elements.hubValidationText.textContent = isTestProfileRoster
    ? `${adventures.length} development test characters loaded.`
    : adventures.length >= 3
      ? "All 3 active adventure slots are filled."
      : `${graveyardEntries.length} fallen adventurer${graveyardEntries.length === 1 ? "" : "s"} remembered.`;
}

function renderGraveyard(entries = state.graveyardEntries) {
  elements.graveyardList.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("section");
    empty.className = "panel soul-frame soul-metal-border soul-glass-bg hub-card";
    empty.innerHTML = "<h3>No names carved here yet.</h3><p class=\"stat\">Your fallen heroes will be remembered when the time comes.</p>";
    elements.graveyardList.append(empty);
    return;
  }
  entries.forEach((entry) => {
    const card = document.createElement("section");
    card.className = "graveyard-tombstone";
    const name = entry.name ?? "Unknown Adventurer";
    const level = clamp(Number.parseInt(entry.level, 10) || 1, 1, MAX_LEVEL);
    const summary = entry.summary ?? `${name} made it to level ${level}. Their soul marches on.`;
    card.innerHTML = `
      <div class="graveyard-epitaph">
        <h3>${escapeAttribute(name)}</h3>
        <p class="graveyard-date">${formatDateOnly(entry.deathDate)}</p>
        <p class="graveyard-summary">${escapeAttribute(summary)}</p>
      </div>
    `;
    elements.graveyardList.append(card);
  });
}

async function refreshHub() {
  const data = await apiRequest("/api/hub");
  const adventures = await Promise.all(
    data.adventures.map(async (adventure) => {
      try {
        const full = await apiRequest(`/api/adventures/${adventure.id}`, { method: "GET" });
        const snapshot = full.adventure?.snapshot;
        return {
          ...adventure,
          classId: normalizeClassId(snapshot?.player?.classDef ?? adventure.classId),
          gender: getSnapshotGender(snapshot),
        };
      } catch {
        return { ...adventure, classId: normalizeClassId(adventure.classId), gender: normalizeGender(adventure.gender) };
      }
    })
  );
  state.user = data.user;
  state.activeAdventures = adventures;
  state.graveyardEntries = data.graveyard;
  renderHub(adventures, data.graveyard);
  renderGraveyard(data.graveyard);
  activeScreen("hub");
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
  skill.tooltipText = `${skill.description} (${skill.mode === "attack_modifier" ? "prepares your next Attack" : "uses its own action"}; ${skill.statUsed}; ${
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
  const tree = getClassSkillTree(classId);
  return mergeProgressionLevel(tree?.levels?.[level], getGeneratedProgressionLevel(classId, level));
}

function getClassStartingSkillIds(classId) {
  return [...(getClassProgressionLevel(classId, 1).skills ?? classes[classId]?.skillIds ?? [])];
}

function getProgressionChoiceIdsThroughLevel(classId, level, type) {
  const ids = new Set();
  for (let progressionLevel = 1; progressionLevel <= level; progressionLevel += 1) {
    const progression = getClassProgressionLevel(classId, progressionLevel);
    (progression.choice?.options ?? []).forEach((option) => {
      if (option.type === type && option.id) ids.add(option.id);
    });
    if (type === "skill") {
      (progression.choice?.skills ?? []).forEach((skillId) => ids.add(skillId));
    }
    if (type === "upgrade") {
      (progression.choice?.upgrades ?? []).forEach((upgradeId) => ids.add(upgradeId));
      (progression.choice?.skillUpgrades ?? []).forEach((upgradeId) => ids.add(upgradeId));
    }
  }
  return ids;
}

function getEarnedProgressionThroughLevel(player, level, options = {}) {
  const classId = normalizeClassId(player?.classDef?.id, "");
  const safeLevel = clamp(Number.parseInt(level, 10) || 1, 1, MAX_LEVEL);
  const skillsToKeep = getProgressionChoiceIdsThroughLevel(classId, safeLevel, "skill");
  const upgradesToKeep = getProgressionChoiceIdsThroughLevel(classId, safeLevel, "upgrade");
  const skillsEarned = new Set(getClassStartingSkillIds(classId).map(normalizeSkillId));
  const featuresEarned = new Set();
  for (let progressionLevel = 1; progressionLevel <= safeLevel; progressionLevel += 1) {
    const progression = getClassProgressionLevel(classId, progressionLevel);
    (progression.skills ?? []).forEach((skillId) => skillsEarned.add(normalizeSkillId(skillId)));
    (progression.features ?? []).forEach((featureId) => featuresEarned.add(featureId));
    const subclassFeatureId = progression.subclassFeatures?.[player.subclassId];
    if (subclassFeatureId) featuresEarned.add(subclassFeatureId);
  }
  const upgradesEarned = new Set();
  if (options.includeChoiceOptions) {
    skillsToKeep.forEach((skillId) => skillsEarned.add(normalizeSkillId(skillId)));
    upgradesToKeep.forEach((upgradeId) => {
      const upgrade = skillUpgrades[upgradeId];
      if (!upgrade || !skillsEarned.has(normalizeSkillId(upgrade.targetSkillId))) return;
      upgradesEarned.add(upgradeId);
    });
  }
  (player?.unlockedSkills ?? [])
    .map(normalizeSkillId)
    .filter((skillId) => skillsToKeep.has(skillId))
    .forEach((skillId) => skillsEarned.add(skillId));
  (player?.upgradedSkills ?? [])
    .filter((upgradeId) => upgradesToKeep.has(upgradeId) && skillUpgrades[upgradeId])
    .forEach((upgradeId) => upgradesEarned.add(upgradeId));
  return { skills: skillsEarned, upgrades: upgradesEarned, features: featuresEarned };
}

const legacySkillAliases = {
  radiantWard: "cleansingLight",
};

function normalizeSkillId(skillId) {
  return legacySkillAliases[skillId] ?? skillId;
}

function normalizePlayerProgression(player) {
  if (!player?.classDef) return;
  const classId = normalizeClassId(player.classDef.id, "");
  const level = clamp(Number.parseInt(player.level, 10) || 1, 1, MAX_LEVEL);
  const earnedSkills = new Set(getClassStartingSkillIds(classId));
  const earnedFeatures = new Set();
  for (let progressionLevel = 1; progressionLevel <= level; progressionLevel += 1) {
    const progression = getClassProgressionLevel(classId, progressionLevel);
    (progression.skills ?? []).forEach((skillId) => earnedSkills.add(skillId));
    (progression.features ?? []).forEach((featureId) => earnedFeatures.add(featureId));
    const subclassFeatureId = progression.subclassFeatures?.[player.subclassId];
    if (subclassFeatureId) earnedFeatures.add(subclassFeatureId);
  }
  player.unlockedSkills = Array.from(new Set([...(player.unlockedSkills ?? []), ...earnedSkills].map(normalizeSkillId))).filter((skillId) => skills[skillId]);
  player.upgradedSkills = Array.from(new Set(player.upgradedSkills ?? [])).filter((upgradeId) => skillUpgrades[upgradeId]);
  player.unlockedFeatures = Array.from(new Set([...(player.unlockedFeatures ?? []), ...earnedFeatures]));
  if (player.selectedSkillId) player.selectedSkillId = skills[normalizeSkillId(player.selectedSkillId)] ? normalizeSkillId(player.selectedSkillId) : null;
  player.nextRollBonus = Math.max(0, Number.parseInt(player.nextRollBonus, 10) || 0);
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
  const classId = normalizeClassId(player.classDef ?? player.classId ?? player.class, "warrior");
  const fallbackWeaponId = getValidWeaponIdsForClass(classId)[0] ?? "unarmed";
  const equippedWeaponId = resolveWeaponId(player.weapon ?? player.weaponId, fallbackWeaponId);
  const equippedArmorId = resolveArmorId(player.armor ?? player.armorId, getClassArmorId(classId));
  if (!player.inventory.weapons.includes(equippedWeaponId)) player.inventory.weapons.push(equippedWeaponId);
  if (!player.inventory.armor.includes(equippedArmorId)) player.inventory.armor.push(equippedArmorId);
}

function normalizeCombatantStats(combatant) {
  if (!combatant) return;
  combatant.stats ??= { mind: MIN_STAT, body: MIN_STAT, soul: MIN_STAT };
  ["mind", "body", "soul"].forEach((stat) => {
    combatant.stats[stat] = clamp(Number.parseInt(combatant.stats[stat], 10) || MIN_STAT, MIN_STAT, MAX_STAT);
  });
  combatant.level = clamp(Number.parseInt(combatant.level, 10) || 1, 1, MAX_LEVEL);
  combatant.xp = clamp(Number.parseInt(combatant.xp, 10) || 0, 0, getTotalXpForLevel(MAX_LEVEL));
}

function getIdFromSaveValue(value) {
  return typeof value === "string" ? value : value?.id;
}

function resolveWeaponId(value, fallbackId = "unarmed") {
  return weapons[getIdFromSaveValue(value)] ? getIdFromSaveValue(value) : fallbackId;
}

function resolveArmorId(value, fallbackId = "none") {
  return armors[getIdFromSaveValue(value)] ? getIdFromSaveValue(value) : fallbackId;
}

function normalizeCombatantLoadout(combatant) {
  if (!combatant) return;
  const template = enemyTemplates[combatant.templateId];
  const classId = normalizeClassId(combatant.classDef ?? combatant.classId ?? combatant.class, "");
  const fallbackWeaponId = template?.weaponId ?? getValidWeaponIdsForClass(classId)[0] ?? "unarmed";
  const fallbackArmorId = template?.armorId ?? getClassArmorId(classId);
  const weaponId = resolveWeaponId(combatant.weapon ?? combatant.weaponId, fallbackWeaponId);
  const armorId = resolveArmorId(combatant.armor ?? combatant.armorId, fallbackArmorId);
  combatant.weapon = weapons[weaponId] ?? weapons.unarmed;
  combatant.spell = combatant.weapon.attackKind === "spell" ? combatant.weapon : null;
  combatant.armor = armors[armorId] ?? armors.none;
  combatant.resistances = Array.isArray(combatant.resistances) ? combatant.resistances : [];
  combatant.weaknesses = Array.isArray(combatant.weaknesses) ? combatant.weaknesses : [];
  combatant.statusImmunities = Array.isArray(combatant.statusImmunities) ? combatant.statusImmunities : [];
  combatant.statuses = Array.isArray(combatant.statuses) ? combatant.statuses.filter((status) => statusDefinitions[status?.id]) : [];
  combatant.skillCooldowns = combatant.skillCooldowns && typeof combatant.skillCooldowns === "object" ? combatant.skillCooldowns : {};
  combatant.hasAttacked = Boolean(combatant.hasAttacked);
  if (combatant.selectedSkillId && !skills[combatant.selectedSkillId]) combatant.selectedSkillId = null;
}

function normalizePlayerScaling(player) {
  if (!player) return;
  normalizeCombatantStats(player);
  if (!player.level && player.xp) player.level = getLevelForXp(player.xp);
  player.level = clamp(Math.max(player.level ?? 1, getLevelForXp(player.xp ?? 0)), 1, MAX_LEVEL);
  const oldMaxHp = player.maxHp ?? calculateMaxHp(player.stats, player.level);
  const oldMaxMana = player.maxMana ?? calculateMaxMana(player.stats, player.level);
  const oldMaxStamina = player.maxStamina ?? calculateMaxStamina(player.stats, player.level);
  recalculateHp(player, oldMaxHp);
  recalculateResources(player, oldMaxMana, oldMaxStamina);
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
  const unstableElementsBonus = getUnstableElementsStatusChanceBonus(actor, source);
  const thunderheadBonus = getThunderheadStatusChanceBonus(actor, source);
  const mentalOverloadBonus = getMentalOverloadStatusChanceBonus(actor, source);
  const paralyzingVisionBonus = getParalyzingVisionStatusChanceBonus(actor, source);
  if (source.baseEffectChance !== undefined && source.effectScalingStat && source.effectChancePerStat !== undefined) {
    const scalingStatId = String(source.effectScalingStat).toLowerCase();
    const passiveMindBonus = actor?.classDef?.id === "mystic" && scalingStatId === "mind" ? getClassPassiveRank(actor) : 0;
    const statValue = (actor?.stats?.[scalingStatId] ?? 0) + passiveMindBonus;
    const rawChance = source.baseEffectChance + statValue * source.effectChancePerStat + unstableElementsBonus + mentalOverloadBonus;
    const maxChance = source.maxEffectChance ?? 100;
    const cappedBaseChance = Math.max(0, Math.min(100, maxChance, rawChance));
    return {
      chancePercent: Math.max(0, Math.min(100, cappedBaseChance + thunderheadBonus + paralyzingVisionBonus)),
      baseEffectChance: source.baseEffectChance,
      effectScalingStat: titleCase(scalingStatId),
      effectChancePerStat: source.effectChancePerStat,
      maxEffectChance: thunderheadBonus > 0 || paralyzingVisionBonus > 0 ? 100 : maxChance,
      usesScaling: true,
    };
  }
  if (source.status?.chance !== undefined) {
    const maxChance = source.maxEffectChance ?? 100;
    const cappedBaseChance = Math.max(0, Math.min(100, maxChance, Math.round(source.status.chance * 100) + unstableElementsBonus + mentalOverloadBonus));
    return {
      chancePercent: Math.max(0, Math.min(100, cappedBaseChance + thunderheadBonus + paralyzingVisionBonus)),
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
  return 20 + stats.body * 3 + level * 3 + Math.floor(level / 5);
}

function calculateMaxMana(stats, level) {
  return 5 + stats.soul + Math.floor(level / 3);
}

function calculateMaxStamina(stats, level) {
  return 5 + stats.body + Math.floor(level / 3);
}

function recalculateHp(combatant, previousMaxHp = combatant.maxHp) {
  combatant.maxHp = calculateMaxHp(combatant.stats, combatant.level);
  const parsedHp = Number.parseInt(combatant.hp, 10);
  const currentHp = Number.isFinite(parsedHp) ? parsedHp : combatant.maxHp;
  combatant.hp = Math.min(combatant.maxHp, currentHp + Math.max(0, combatant.maxHp - (previousMaxHp ?? combatant.maxHp)));
}

function recalculateResources(combatant, previousMaxMana = combatant.maxMana ?? 0, previousMaxStamina = combatant.maxStamina ?? 0) {
  combatant.maxMana = calculateMaxMana(combatant.stats, combatant.level);
  combatant.maxStamina = calculateMaxStamina(combatant.stats, combatant.level);
  const parsedMana = Number.parseInt(combatant.mana, 10);
  const parsedStamina = Number.parseInt(combatant.stamina, 10);
  const currentMana = Number.isFinite(parsedMana) ? parsedMana : combatant.maxMana;
  const currentStamina = Number.isFinite(parsedStamina) ? parsedStamina : combatant.maxStamina;
  combatant.mana = Math.min(combatant.maxMana, currentMana + Math.max(0, combatant.maxMana - previousMaxMana));
  combatant.stamina = Math.min(
    combatant.maxStamina,
    currentStamina + Math.max(0, combatant.maxStamina - previousMaxStamina)
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
  changedValue = clamp(changedValue, MIN_STAT, CREATION_MAX_STAT);

  const otherTotal = [elements.mindInput, elements.bodyInput, elements.soulInput]
    .filter((input) => input !== changedInput)
    .reduce((total, input) => total + clamp(readStat(input) || MIN_STAT, MIN_STAT, CREATION_MAX_STAT), 0);
  changedInput.value = Math.min(changedValue, Math.max(MIN_STAT, STAT_LIMIT - otherTotal));

  Object.entries(stats).forEach(([stat, value]) => {
    const input = elements[`${stat}Input`];
    if (!Number.isInteger(value) || value < MIN_STAT) {
      input.value = MIN_STAT;
    } else if (value > CREATION_MAX_STAT) {
      input.value = CREATION_MAX_STAT;
    }
  });
}

function getLevelForXp(xp) {
  const totalXp = Math.max(0, xp ?? 0);
  let level = 1;
  while (level < MAX_LEVEL && totalXp >= getTotalXpForLevel(level + 1)) {
    level += 1;
  }
  return level;
}

function getTierForLevel(level) {
  const safeLevel = clamp(Number.parseInt(level, 10) || 1, 1, MAX_LEVEL);
  return Math.min(5, Math.ceil(safeLevel / 4));
}

function getTierCap(tier) {
  return clamp(Number.parseInt(tier, 10) || 1, 1, 5) * 4;
}

function getTierEntryLevel(tier) {
  return tier <= 1 ? 1 : getTierCap(tier - 1) + 1;
}

function normalizePlayerTierTrials(player) {
  if (!player) return;
  player.progression ??= {};
  player.progression.tierTrialsCompleted ??= {};
  for (let tier = 1; tier <= 4; tier += 1) {
    const entryLevel = getTierEntryLevel(tier + 1);
    const completedByLevel = (player.level ?? 1) >= entryLevel;
    player.progression.tierTrialsCompleted[tier] = Boolean(player.progression.tierTrialsCompleted[tier] || completedByLevel);
  }
}

function isTierTrialCompleted(player, tier) {
  normalizePlayerTierTrials(player);
  return Boolean(player?.progression?.tierTrialsCompleted?.[tier]);
}

function getMaxUnlockedLevel(player) {
  normalizePlayerTierTrials(player);
  for (let tier = 1; tier <= 4; tier += 1) {
    if (!isTierTrialCompleted(player, tier)) return getTierCap(tier);
  }
  return MAX_LEVEL;
}

function getBlockedTierTrial(player) {
  if (!player || (player.level ?? 1) >= MAX_LEVEL) return null;
  normalizePlayerTierTrials(player);
  const tier = getTierForLevel(player.level ?? 1);
  if (tier >= 5 || isTierTrialCompleted(player, tier)) return null;
  const nextTierLevel = getTierCap(tier) + 1;
  if ((player.level ?? 1) === getTierCap(tier) && (player.xp ?? 0) >= getTotalXpForLevel(nextTierLevel)) {
    return { tier, nextTier: tier + 1, nextTierLevel };
  }
  return null;
}

function isTierTrialRequired(player) {
  return Boolean(getBlockedTierTrial(player));
}

function getNextLevelText(player) {
  if ((player?.level ?? 1) >= MAX_LEVEL) return "MAX";
  const trial = getBlockedTierTrial(player);
  if (trial) return `Tier ${trial.tier} Trial`;
  return `${getTotalXpForLevel(player.level + 1)} XP`;
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
  return getClassDefenseBonus(combatant);
}

function getSubclassAcBonus(combatant) {
  return getSubclassDef(combatant)?.acBonus ?? 0;
}

function getScoutEvasiveFootworkDefenseBonus(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "rogue" && combatant?.subclassId === "scout" && (combatant?.level ?? 1) >= 7 ? 1 : 0;
}

function isMonkBodyIronBodyActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "monk" && combatant?.subclassId === "body" && (combatant?.level ?? 1) >= 3;
}

function getIronBodyDefenseBonus(combatant) {
  return isMonkBodyIronBodyActive(combatant) ? 1 : 0;
}

function isGuardianClass(combatant) {
  return normalizeClassId(combatant?.classDef, "") === "guardian";
}

function isGuardianBulwark(combatant, level = 1) {
  return isGuardianClass(combatant) && combatant?.subclassId === "bulwark" && (combatant?.level ?? 1) >= level;
}

function isGuardianSentinel(combatant, level = 1) {
  return isGuardianClass(combatant) && combatant?.subclassId === "sentinel" && (combatant?.level ?? 1) >= level;
}

function isGuardianLastStandActive(combatant) {
  return isGuardianClass(combatant) && (combatant?.level ?? 1) >= 17 && (combatant?.hp ?? 0) <= (combatant?.maxHp ?? 0) * 0.3;
}

function getReinforcedGuardDefenseBonus(combatant) {
  return isGuardianBulwark(combatant, 3) ? 1 : 0;
}

function getGuardianLastStandDefenseBonus(combatant) {
  return isGuardianLastStandActive(combatant) ? 2 : 0;
}

function isPaladinClass(combatant) {
  return normalizeClassId(combatant?.classDef, "") === "paladin";
}

function isPaladinOathkeeper(combatant, level = 1) {
  return isPaladinClass(combatant) && combatant?.subclassId === "oathkeeper" && (combatant?.level ?? 1) >= level;
}

function isPaladinAvenger(combatant, level = 1) {
  return isPaladinClass(combatant) && combatant?.subclassId === "avenger" && (combatant?.level ?? 1) >= level;
}

function getSacredVowDefenseBonus(combatant) {
  return isPaladinOathkeeper(combatant, 3) && hasStatus(combatant, "shielded") ? 1 : 0;
}

function getKineticShieldDefenseBonus(combatant) {
  return isMysticTelekinetic(combatant, 7) && hasStatus(combatant, "shielded") ? 1 : 0;
}

function getStatusDefenseBonus(combatant) {
  return (combatant?.statuses ?? []).reduce((total, status) => {
    const definition = statusDefinitions[status.id];
    return total + (status.defenseBonus ?? definition?.defenseBonus ?? 0);
  }, 0);
}

function getAc(combatant) {
  return (
    BASE_AC +
    getArmorBonus(combatant) +
    getClassAcBonus(combatant) +
    getSubclassAcBonus(combatant) +
    getScoutEvasiveFootworkDefenseBonus(combatant) +
    getIronBodyDefenseBonus(combatant) +
    getReinforcedGuardDefenseBonus(combatant) +
    getGuardianLastStandDefenseBonus(combatant) +
    getSacredVowDefenseBonus(combatant) +
    getKineticShieldDefenseBonus(combatant) +
    getStatusDefenseBonus(combatant) +
    getLevelDefenseBonus(combatant) +
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
  const evasiveFootworkBonus = getScoutEvasiveFootworkDefenseBonus(combatant);
  if (evasiveFootworkBonus !== 0) {
    parts.push(`Evasive Footwork ${signed(evasiveFootworkBonus)}`);
  }
  const ironBodyBonus = getIronBodyDefenseBonus(combatant);
  if (ironBodyBonus !== 0) {
    parts.push(`Iron Body ${signed(ironBodyBonus)}`);
  }
  const reinforcedGuardBonus = getReinforcedGuardDefenseBonus(combatant);
  if (reinforcedGuardBonus !== 0) {
    parts.push(`Reinforced Guard ${signed(reinforcedGuardBonus)}`);
  }
  const lastStandBonus = getGuardianLastStandDefenseBonus(combatant);
  if (lastStandBonus !== 0) {
    parts.push(`Last Stand ${signed(lastStandBonus)}`);
  }
  const sacredVowBonus = getSacredVowDefenseBonus(combatant);
  if (sacredVowBonus !== 0) {
    parts.push(`Sacred Vow ${signed(sacredVowBonus)}`);
  }
  const kineticShieldBonus = getKineticShieldDefenseBonus(combatant);
  if (kineticShieldBonus !== 0) {
    parts.push(`Kinetic Shield ${signed(kineticShieldBonus)}`);
  }
  const statusDefenseBonus = getStatusDefenseBonus(combatant);
  if (statusDefenseBonus !== 0) {
    parts.push(`Status ${signed(statusDefenseBonus)}`);
  }
  const levelDefenseBonus = getLevelDefenseBonus(combatant);
  if (levelDefenseBonus !== 0) {
    parts.push(`Level ${signed(levelDefenseBonus)}`);
  }
  if ((combatant.acBonus ?? 0) !== 0) {
    parts.push(`Other ${signed(combatant.acBonus)}`);
  }
  return `${parts.join(" + ")} = ${getAc(combatant)}`;
}

function getClassAttackBonus(combatant, attackKind) {
  if (!combatant.classDef) return 0;
  return attackKind === "spell" ? getClassSpellHitBonus(combatant) : getClassWeaponHitBonus(combatant);
}

function getClassWeaponHitBonus(combatant) {
  return combatant.classDef?.weaponHitBonus ?? 0;
}

function getClassSpellHitBonus(combatant) {
  return combatant.classDef?.spellHitBonus ?? 0;
}

function getClassDamageReduction(combatant) {
  if (!combatant.classDef) return 0;
  return combatant.classDef?.damageReduction ?? 0;
}

function getClassDefenseBonus(combatant) {
  if (!combatant.classDef) return 0;
  return combatant.classDef?.acBonus ?? 0;
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
  const statusReduction = combatant.statuses.reduce((total, status) => total + (statusDefinitions[status.id].damageReduction ?? 0), 0);
  const paladinBonus = statusReduction > 0 && combatant.classDef?.id === "paladin" ? getClassPassiveRank(combatant) : 0;
  return statusReduction + paladinBonus;
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

// Custom system core: Mind/Body/Soul scores produce bounded d20 modifiers.
function buildD20Parts(combatant, stat, options = {}) {
  const statValue = Number.isInteger(combatant.stats[stat]) ? combatant.stats[stat] : 0;
  const parts = [{ label: `${titleCase(stat)} mod`, value: getStatModifier(statValue) }];
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
  if (isAdminQaUser() && state.adminForcedDamageRoll) {
    const mode = state.adminForcedDamageRoll;
    state.adminForcedDamageRoll = null;
    const forcedValue = mode === "max" ? dice.sides : 1;
    const rolls = Array.from({ length: dice.count }, () => forcedValue);
    addLog("Admin QA: forced damage roll used.");
    renderAdminQaOverrideStatus();
    return { rolls, total: rolls.reduce((sum, value) => sum + value, 0) };
  }
  const rolls = [];
  for (let index = 0; index < dice.count; index += 1) {
    rolls.push(rollRaw(dice.sides));
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
  const weapon = weapons[getBuilderWeaponId(classDef.id)];
  const armor = armors[getClassArmorId(classDef.id)];
  const level = 1;
  const maxHp = calculateMaxHp(stats, level);
  const maxMana = calculateMaxMana(stats, level);
  const maxStamina = calculateMaxStamina(stats, level);

  return {
    id: "player",
    name: elements.nameInput.value.trim() || "Adventurer",
    description: elements.descriptionInput.value.trim(),
    gender: normalizeGender(state.builderGender),
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
    nextRollBonus: 0,
    selectedSkillId: null,
    skillCooldowns: {},
    progression: { tierTrialsCompleted: { 1: false, 2: false, 3: false, 4: false } },
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
  state.deathRecordInFlight = false;
  resetCombatFeatureFlags();
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

function getStandardEnemiesForTier(tier) {
  return Object.values(enemyTemplates).filter((enemy) => enemy.tier === tier && enemy.enemyType === "standard");
}

function getBossEnemiesForTier(tier) {
  return Object.values(enemyTemplates).filter((enemy) => enemy.tier === tier && enemy.enemyType === "boss");
}

function getEnemyTemplatesForLevel(level, enemyType = "standard") {
  const tier = getTierForLevel(level);
  const tierTemplates = Object.values(enemyTemplates).filter((template) => {
    const [minLevel, maxLevel] = template.levelRange ?? [1, MAX_LEVEL];
    return template.enemyType === enemyType && template.tier === tier && level >= minLevel && level <= maxLevel;
  });
  if (tierTemplates.length) return tierTemplates;
  return Object.values(enemyTemplates).filter((template) => template.enemyType === enemyType && template.tier === tier);
}

function createScaledEnemy(playerLevel, templateId = null, options = {}) {
  const level = clamp(Math.max(1, playerLevel), 1, MAX_LEVEL);
  const enemyType = options.enemyType ?? "standard";
  const matchingTemplates = getEnemyTemplatesForLevel(level, enemyType);
  const templateList = matchingTemplates.length ? matchingTemplates : Object.values(enemyTemplates).filter((template) => template.enemyType === enemyType);
  const template = enemyTemplates[templateId] ?? templateList[Math.floor(Math.random() * templateList.length)];
  const scale = level - 1;
  const tier = getPowerTier(level);
  const templateWeapon = weapons[template.weaponId];
  const levelHitBonus = Math.floor(scale / 5);
  const scaledWeapon = {
    ...templateWeapon,
    damageDice: templateWeapon.damageDice ? { ...templateWeapon.damageDice } : undefined,
    attackBonus: (templateWeapon.attackBonus ?? 0) + levelHitBonus,
  };
  const stats = {
    mind: clamp(template.stats.mind + Math.floor(scale / 6), MIN_STAT, MAX_STAT),
    body: clamp(template.stats.body + Math.floor(scale / 5), MIN_STAT, MAX_STAT),
    soul: clamp(template.stats.soul + Math.floor(scale / 6), MIN_STAT, MAX_STAT),
  };
  const maxHp = template.baseHp + stats.body * 3 + level * 3 + Math.floor(level / 5) + (tier.tier - 1) * 10;

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
    weapon: scaledWeapon,
    spell: scaledWeapon.attackKind === "spell" ? scaledWeapon : null,
    armor: armors[template.armorId],
    acBonus: template.acBonus + Math.floor(level / 20),
    resistances: [...template.resistances],
    weaknesses: [...template.weaknesses],
    statusImmunities: [...(template.statusImmunities ?? [])],
    statuses: [],
    loot: template.loot,
    enemyType: template.enemyType,
    isTierTrial: Boolean(options.isTierTrial),
    isFinalTrial: Boolean(options.isFinalTrial),
    trialTier: options.trialTier ?? null,
    hasAttacked: false,
  };
}

function validateCharacter() {
  const stats = getBuilderStats();
  const messages = [];
  const values = Object.values(stats);
  const total = statTotal(stats);
  const selectedClass = getSelectedClass();
  const selectedWeaponId = selectedClass ? getBuilderWeaponId(selectedClass.id) : null;

  if (!elements.nameInput.value.trim()) messages.push("Enter a character name.");
  if (values.some((value) => !Number.isInteger(value))) messages.push("All stats must be whole numbers.");
  if (values.some((value) => value < MIN_STAT || value > CREATION_MAX_STAT)) messages.push("Each stat must be between 1 and 10.");
  if (total > STAT_LIMIT) messages.push("Total stats cannot exceed 10.");
  if (!selectedClass) messages.push("Choose a class.");
  if (!selectedWeaponId || !getValidWeaponIdsForClass(selectedClass?.id).includes(selectedWeaponId) || !weapons[selectedWeaponId]) {
    messages.push("Choose a valid class weapon.");
  }

  return { valid: messages.length === 0, messages, stats, total };
}

function getClassResourceGuide(classDef) {
  if (!classDef) return "Resources: choose actions that match your class.";
  if (classDef.id === "warrior" || classDef.id === "rogue" || classDef.id === "guardian") {
    return "Resource: Stamina for martial skills.";
  }
  if (classDef.id === "magician" || classDef.id === "sorcerer") {
    return "Resource: Mana for spells.";
  }
  if (classDef.id === "paladin" || classDef.id === "monk") {
    return "Resource: mixes Stamina and Mana.";
  }
  if (classDef.id === "mystic") {
    return "Resource: mostly cooldown-based Mind skills.";
  }
  return "Resource: class skills may use Mana or Stamina.";
}

function getClassWeaponGuide(classDef) {
  const weaponNames = getValidWeaponIdsForClass(classDef?.id).map((weaponId) => weapons[weaponId]?.name ?? titleCase(weaponId));
  return `Starting weapons: ${weaponNames.join(", ")}. You can only equip weapons your class can use.`;
}

function formatClassTooltip(classDef) {
  const startingSkills = getClassStartingSkillIds(classDef.id);
  const lines = [
    classDef.creationTagline,
    classDef.shortDescription,
    classDef.roleTag ? `Role ${classDef.roleTag}` : null,
    classDef.playstyle ? `Playstyle ${classDef.playstyle}` : null,
    getClassResourceGuide(classDef),
    getClassWeaponGuide(classDef),
    `Weapon hit ${signed(classDef.weaponHitBonus)}`,
    `Spell hit ${signed(classDef.spellHitBonus)}`,
    `Defense ${signed(classDef.acBonus)}`,
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
  const summary = `Defense ${signed(subclassDef.acBonus ?? 0)}, damage ${signed(subclassDef.damageBonus ?? 0)}`;
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
  playableClassIds.map((id) => classes[id]).filter(Boolean).forEach((classDef) => {
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
  const tagline = classDef.creationTagline ? `<em>${classDef.creationTagline}</em> ` : "";
  elements.classInfoPanel.innerHTML = `<strong>${classDef.name}</strong> ${tagline}${classDef.shortDescription} ${
    classDef.roleTag ? `[${classDef.roleTag}] ` : ""
  }${classDef.playstyle} ${getClassResourceGuide(classDef)} ${getClassWeaponGuide(classDef)} Bonuses: ${classDef.tooltipSummary}. Starting skills: ${startingSkills
    .map((id) => getSkillById(id)?.name ?? id)
    .join(", ")}.`;
}

function renderBuilder() {
  const previewClass = getSelectedClass();
  syncBuilderWeaponOptions(previewClass?.id);
  const validation = validateCharacter();
  const previewWeaponId = getBuilderWeaponId(previewClass?.id);
  const previewArmorId = getClassArmorId(previewClass?.id);
  elements.mindValue.textContent = validation.stats.mind;
  elements.bodyValue.textContent = validation.stats.body;
  elements.soulValue.textContent = validation.stats.soul;
  const preview = {
    id: "preview",
    name: elements.nameInput.value.trim() || "Adventurer",
    description: elements.descriptionInput.value.trim(),
    gender: normalizeGender(state.builderGender),
    level: 1,
    stats: validation.stats,
    classDef: previewClass,
    subclassId: null,
    weapon: weapons[previewWeaponId],
    armor: armors[previewArmorId],
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
    elements.builderWeaponPreview.innerHTML = `${renderWeaponImage(preview.weapon.id, preview.weapon.name)}<span class="muted">${preview.weapon.special}. ${getClassWeaponGuide(previewClass)}</span>`;
  }
  const previewClassName = previewClass?.name ?? "Adventurer";
  setCharacterAvatar(elements.builderAvatarPreview, previewClass?.id, preview.gender, `${preview.name} ${previewClassName}`, { eager: true });
  if (elements.builderAvatarTitle) {
    elements.builderAvatarTitle.textContent = preview.name;
  }
  if (elements.builderAvatarMeta) {
    elements.builderAvatarMeta.textContent = `${formatGenderLabel(preview.gender)} ${previewClassName}`;
  }
  elements.builderSummaryArmor.innerHTML = renderArmorImage(preview.armor.id, preview.armor.name);
  elements.builderSummarySkills.textContent = previewClass
    ? getClassStartingSkillIds(previewClass.id)
        .map((id) => getSkillById(id)?.name ?? id)
        .join(", ")
    : "None";
  renderClassInfoPanel(previewClass);
  elements.builderAc.innerHTML = formatInfoTooltip(`Defense ${getAc(preview)}`, `${getAcFormula(preview)}. Defense is the number enemy attacks try to meet or beat.`);
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
  state.killersRhythmUsedThisTurn = false;
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

function isBerserkerFrenzyActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "warrior" && combatant?.subclassId === "berserker" && (combatant?.level ?? 1) >= 3;
}

function isBerserkerBloodlustActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "warrior" && combatant?.subclassId === "berserker" && (combatant?.level ?? 1) >= 7;
}

function isBerserkerRecklessSlaughterActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "warrior" && combatant?.subclassId === "berserker" && (combatant?.level ?? 1) >= 15;
}

function isBerserkerGodOfCarnageActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "warrior" && combatant?.subclassId === "berserker" && (combatant?.level ?? 1) === 20;
}

function getShieldMasteryReduction(defender) {
  const classId = normalizeClassId(defender?.classDef, "");
  return classId === "warrior" && defender?.subclassId === "defender" && (defender?.level ?? 1) >= 3 ? 1 : 0;
}

function getFortressStanceReduction(defender) {
  const classId = normalizeClassId(defender?.classDef, "");
  return classId === "warrior" && defender?.subclassId === "defender" && (defender?.level ?? 1) >= 10 ? 3 : 0;
}

function getShieldWallReduction(defender) {
  const classId = normalizeClassId(defender?.classDef, "");
  return classId === "guardian" && (defender?.level ?? 1) >= 5 ? 1 : 0;
}

function getReinforcedGuardReduction(defender) {
  return isGuardianBulwark(defender, 3) ? 1 : 0;
}

function getFortressHeartReduction(defender) {
  return isGuardianClass(defender) && (defender?.level ?? 1) >= 15 ? 2 : 0;
}

function getGuardianLastStandReduction(defender) {
  return isGuardianLastStandActive(defender) ? 2 : 0;
}

function getHeavyMomentumReduction(defender) {
  return isGuardianBulwark(defender, 7) && hasStatus(defender, "guarded") ? 1 : 0;
}

function getMountainStanceReduction(defender, damage) {
  if (!isGuardianBulwark(defender, 15)) return 0;
  return Math.floor(Math.max(0, damage) * 0.25);
}

function isGuardianImmovableBastionActive(defender) {
  return isGuardianClass(defender) && (defender?.level ?? 1) >= 20;
}

function isGuardianEternalBastionActive(defender) {
  return isGuardianBulwark(defender, 20);
}

function getGuardianBastionReduction(defender, damage) {
  if (!((state.immovableBastionActive && isGuardianImmovableBastionActive(defender)) || (state.eternalBastionActive && isGuardianEternalBastionActive(defender)))) return 0;
  return Math.floor(Math.max(0, damage) * 0.75);
}

function getAuraOfProtectionReduction(defender) {
  return isPaladinClass(defender) && (defender?.level ?? 1) >= 13 && hasStatus(defender, "shielded") ? 2 : 0;
}

function getEternalOathReduction(defender, damage) {
  if (!state.eternalOathActive || !isPaladinOathkeeper(defender, 20)) return 0;
  const safeDamage = Math.max(0, damage);
  return safeDamage - Math.floor(safeDamage * 0.5);
}

function isLivingWallFeatureActive(defender) {
  const classId = normalizeClassId(defender?.classDef, "");
  return classId === "warrior" && defender?.subclassId === "defender" && (defender?.level ?? 1) >= 20;
}

function resetLivingWall() {
  state.livingWallUsed = false;
  state.livingWallActive = false;
}

function getLivingWallReduction(defender, damage) {
  if (!state.livingWallActive || !isLivingWallFeatureActive(defender)) return 0;
  const safeDamage = Math.max(0, damage);
  return safeDamage - Math.floor(safeDamage * 0.5);
}

function isIronWillActive(target) {
  const classId = normalizeClassId(target?.classDef, "");
  return classId === "warrior" && target?.subclassId === "defender" && (target?.level ?? 1) >= 7;
}

function isUnbrokenOathStatus(statusId) {
  return statusId === "stun" || statusId === "poison";
}

function clearUnbrokenOathStatuses(combatant) {
  if (!isPaladinOathkeeper(combatant, 15)) return;
  combatant.statuses = (combatant.statuses ?? []).filter((status) => !isUnbrokenOathStatus(status.id));
}

function isMonkBodyAdamantSoulActive(target) {
  const classId = normalizeClassId(target?.classDef, "");
  return classId === "monk" && target?.subclassId === "body" && (target?.level ?? 1) >= 15;
}

function isMonkBodyLivingWeaponActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "monk" && combatant?.subclassId === "body" && (combatant?.level ?? 1) >= 20;
}

function isMonkBodyLivingWeaponUnarmedAttack(attacker, attackOrSkill) {
  if (!isMonkBodyLivingWeaponActive(attacker)) return false;
  if (attacker?.weapon?.id !== "unarmed") return false;
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "monk") return false;
  return true;
}

function isAdamantSoulStatus(statusId) {
  return statusId === "bleed" || statusId === "stun";
}

function clearAdamantSoulStatuses(combatant) {
  if (!isMonkBodyAdamantSoulActive(combatant)) return;
  combatant.statuses = (combatant.statuses ?? []).filter((status) => !isAdamantSoulStatus(status.id));
}

function isWarriorWeaponAttack(attackOrSkill) {
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (!attackOrSkill?.classId) return true;
  return normalizeClassId(attackOrSkill.classId, "") === "warrior";
}

function getRecklessSlaughterHitBonus(attacker, defender, attackOrSkill) {
  if (isBerserkerRecklessSlaughterActive(attacker) && isWarriorWeaponAttack(attackOrSkill)) return 2;
  if (isBerserkerRecklessSlaughterActive(defender) && attacker?.id !== "player") return 2;
  return 0;
}

function getBloodlustBonus(attacker, attack = attacker?.weapon) {
  if (!isBerserkerBloodlustActive(attacker) || attack?.attackKind !== "weapon") return 0;
  return clamp(state.bloodlustStacks ?? 0, 0, 10);
}

function gainBloodlustStack(attacker, attack = attacker?.weapon) {
  if (!isBerserkerBloodlustActive(attacker) || attack?.attackKind !== "weapon") return;
  const currentStacks = clamp(state.bloodlustStacks ?? 0, 0, 10);
  if (currentStacks >= 10) return;
  state.bloodlustStacks = currentStacks + 1;
  addLog("Bloodlust rises: +1 damage stack.");
}

function resetBloodlustStacks() {
  state.bloodlustStacks = 0;
}

function resetSneakAttack() {
  state.sneakAttackUsed = false;
}

function resetDeathsOpening() {
  state.deathsOpeningUsed = false;
}

function resetAssassinate() {
  state.assassinateUsed = false;
}

function resetQuickRead() {
  state.quickReadUsedThisTurn = false;
}

function resetFlowingStrikes() {
  state.flowingStrikesUsedThisTurn = false;
}

function restoreResource(combatant, resourceKey, amount) {
  const maxKey = `max${resourceKey[0].toUpperCase()}${resourceKey.slice(1)}`;
  const before = combatant?.[resourceKey] ?? 0;
  const maxValue = combatant?.[maxKey] ?? before;
  const restoreAmount = Math.max(0, amount ?? 0);
  combatant[resourceKey] = Math.min(maxValue, before + restoreAmount);
  return combatant[resourceKey] - before;
}

function applyScoutFlowState(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  if (combatant?.id !== "player" || classId !== "rogue" || combatant?.subclassId !== "scout" || (combatant?.level ?? 1) < 10) return;
  if (restoreResource(combatant, "stamina", 1) > 0) addLog("Flow State restores 1 Stamina.");
}

function applyMonkPerfectFlow(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  if (combatant?.id !== "player" || classId !== "monk" || (combatant?.level ?? 1) < 10) return;
  if (restoreResource(combatant, "stamina", 1) > 0) addLog("Perfect Flow restores 1 Stamina.");
}

function applyMonkSoulSpiritFlow(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  if (combatant?.id !== "player" || classId !== "monk" || combatant?.subclassId !== "soul" || (combatant?.level ?? 1) < 7) return;
  if (restoreResource(combatant, "mana", 1) > 0) addLog("Spirit Flow restores 1 Mana.");
}

function applyMonkStillness(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  if (combatant?.id !== "player" || classId !== "monk" || (combatant?.level ?? 1) < 13 || state.stillnessUsed) return;
  const status = getNegativeStatuses(combatant)[0];
  if (!status) return;
  removeStatus(combatant, status.id);
  state.stillnessUsed = true;
  addLog(`Stillness clears ${statusDefinitions[status.id]?.name ?? status.id} from ${combatant.name}.`);
}

function resetStillness() {
  state.stillnessUsed = false;
}

function isMonkInnerReserveActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "monk" && (combatant?.level ?? 1) >= 17;
}

function restoreInnerReserveResources(combatant) {
  const staminaRestore = Math.ceil((combatant.maxStamina ?? 0) * 0.25);
  const manaRestore = Math.ceil((combatant.maxMana ?? 0) * 0.25);
  return {
    stamina: restoreResource(combatant, "stamina", staminaRestore),
    mana: restoreResource(combatant, "mana", manaRestore),
  };
}

function restoreHpByPercent(combatant, percent) {
  const restoreAmount = Math.ceil((combatant.maxHp ?? 0) * percent);
  return restoreResource(combatant, "hp", restoreAmount);
}

function useLayOnHandsSkill(combatant) {
  if (state.layOnHandsUsed) {
    addLog("Lay on Hands has already been used this combat.");
    return;
  }
  state.layOnHandsUsed = true;
  const restored = restoreHpByPercent(combatant, 0.25);
  addLog(`Lay on Hands restores ${restored} HP.`);
}

function applyCleansingLightHealing(combatant, skill) {
  const masteryHealPercent = skill?.healPercent ?? 0;
  if (masteryHealPercent > 0) {
    const restored = restoreHpByPercent(combatant, masteryHealPercent);
    if (restored > 0) addLog(`${skill.name} restores ${restored} HP.`);
  }
  if (isPaladinOathkeeper(combatant, 7)) {
    const restored = restoreHpByPercent(combatant, 0.1);
    if (restored > 0) addLog(`Pure Heart restores ${restored} HP.`);
  }
}

function resetInnerReserve() {
  state.innerReserveUsed = false;
}

function isMonkTranscendenceActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "monk" && (combatant?.level ?? 1) >= 20;
}

function isMonkSoulEnlightenmentActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "monk" && combatant?.subclassId === "soul" && (combatant?.level ?? 1) >= 20;
}

function resetTranscendence() {
  state.transcendenceUsed = false;
  state.pendingExtraTurn = false;
}

function resetEnlightenment() {
  state.enlightenmentUsed = false;
  state.pendingExtraTurn = false;
}

function resetShadowFlurry() {
  state.shadowFlurryChecked = false;
  state.shadowFlurryUsed = false;
}

function resetEvasion() {
  state.evasionUsed = false;
}

function resetGhostStep() {
  state.ghostStepUsed = false;
}

function resetMonkGhostStep() {
  state.monkGhostStepUsed = false;
}

function resetUnbreakableLine() {
  state.unbreakableLineUsed = false;
  state.immovableBastionUsed = false;
  state.immovableBastionActive = false;
  state.eternalBastionUsed = false;
  state.eternalBastionActive = false;
  state.judgmentWallUsed = false;
  state.judgmentWallActive = false;
  state.crushingCounterActive = false;
}

function resetPaladinFeatures() {
  state.sacredResolveUsed = false;
  state.layOnHandsUsed = false;
  state.divineChampionUsed = false;
  state.divineChampionActive = false;
  state.divineShelterUsed = false;
  state.eternalOathUsed = false;
  state.eternalOathActive = false;
  clearJudgmentBrand();
  state.relentlessVengeanceUsed = false;
  state.wrathIncarnateUsed = false;
  state.wrathIncarnateActive = false;
}

function resetMysticFeatures() {
  state.psychicEchoUsed = false;
  state.psionicRecoveryUsed = false;
  state.trueSightUsed = false;
  state.trueSightActive = false;
  state.foresightUsed = false;
  state.premonitionUsed = false;
  state.perfectPredictionUsed = false;
  state.perfectPredictionActive = false;
  state.invisibleHandUsed = false;
  state.gravityBreakUsed = false;
  state.gravityBreakActive = false;
}

function resetCombatFeatureFlags() {
  state.veteranGritUsed = false;
  state.unbreakableUsed = false;
  resetLivingWall();
  resetGodOfCarnage();
  resetSneakAttack();
  resetDeathsOpening();
  resetAssassinate();
  resetQuickRead();
  resetFlowingStrikes();
  resetShadowFlurry();
  resetEvasion();
  resetGhostStep();
  resetMonkGhostStep();
  resetUnbreakableLine();
  resetPaladinFeatures();
  resetMysticFeatures();
  resetDeathmark();
  resetPerfectExecution();
  resetArcaneInsight();
  resetMindOverMatter();
  resetDoubleCast();
  resetSpellEcho();
  resetMasterOfMagic();
  resetFirestorm();
  resetWorldfire();
  resetArcJump();
  resetStormAvatar();
  resetStillness();
  resetInnerReserve();
  resetTranscendence();
  resetEnlightenment();
  resetPerfectFocus();
  resetArcaneSurge();
  resetDualElements();
  resetOverchannel();
  resetCataclysm();
  resetOverload();
  resetArcaneCataclysm();
  resetWildCasting();
  resetBloodlustStacks();
}

function isRogueDeathmarkFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "rogue" && (combatant?.level ?? 1) >= 20;
}

function getDeathmarkTargetId(target) {
  return target?.combatId ?? target?.instanceId ?? target?.id ?? target?.name ?? null;
}

function clearDeathmark() {
  state.deathmarkActive = false;
  state.deathmarkTargetId = null;
}

function resetDeathmark() {
  state.deathmarkUsed = false;
  clearDeathmark();
}

function isAssassinPerfectExecutionFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "rogue" && combatant?.subclassId === "assassin" && (combatant?.level ?? 1) >= 20;
}

function clearPerfectExecution() {
  state.perfectExecutionActive = false;
}

function resetPerfectExecution() {
  state.perfectExecutionUsed = false;
  clearPerfectExecution();
}

function isMagicianDoubleCastFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && (combatant?.level ?? 1) >= 10;
}

function isDoubleCastEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function shouldTriggerDoubleCast(caster, skill) {
  return isMagicianDoubleCastFeatureActive(caster) && isDoubleCastEligibleSkill(skill) && !state.doubleCastUsed;
}

function resetDoubleCast() {
  state.doubleCastUsed = false;
}

function isSorcererChainCastingFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && (combatant?.level ?? 1) >= 10;
}

function isChainCastingEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function shouldTriggerChainCasting(caster, skill) {
  return isSorcererChainCastingFeatureActive(caster) && isChainCastingEligibleSkill(skill);
}

function isMagicianSpellEchoFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && (combatant?.level ?? 1) >= 17;
}

function isSpellEchoEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function shouldTriggerSpellEcho(caster, skill, finalDamage) {
  return isMagicianSpellEchoFeatureActive(caster)
    && isSpellEchoEligibleSkill(skill)
    && !state.spellEchoUsed
    && finalDamage >= 1;
}

function getSpellEchoDamage(finalDamage) {
  if (finalDamage < 1) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.5));
}

function resetSpellEcho() {
  state.spellEchoUsed = false;
}

function isMagicianMasterOfMagicFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && (combatant?.level ?? 1) >= 20;
}

function isMasterOfMagicEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function getMasterOfMagicDamageBonus(caster, skill, finalDamage, options = {}) {
  if (!isMagicianMasterOfMagicFeatureActive(caster)) return 0;
  if (!state.masterOfMagicActive) return 0;
  if (options.doubleCast || !isMasterOfMagicEligibleSkill(skill) || finalDamage < 1) return 0;
  return finalDamage;
}

function resetMasterOfMagic() {
  state.masterOfMagicUsed = false;
  state.masterOfMagicActive = false;
}

function isMagicianPerfectFocusFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && combatant?.subclassId === "sage" && (combatant?.level ?? 1) >= 20;
}

function isPerfectFocusEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function consumePerfectFocusForSkill(caster, skill) {
  if (!isMagicianPerfectFocusFeatureActive(caster)) return false;
  if (!state.perfectFocusActive || !isPerfectFocusEligibleSkill(skill)) return false;
  state.perfectFocusActive = false;
  addLog("Perfect Focus makes the spell automatically hit.");
  return true;
}

function resetPerfectFocus() {
  state.perfectFocusUsed = false;
  state.perfectFocusActive = false;
}

function isMagicianOverchannelFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && combatant?.subclassId === "elementalist" && (combatant?.level ?? 1) >= 15;
}

function isOverchannelEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function getOverchannelDamageBonus(caster, skill, finalDamage, options = {}) {
  if (!isMagicianOverchannelFeatureActive(caster)) return 0;
  if (!state.overchannelActive) return 0;
  if (options.doubleCast || !isOverchannelEligibleSkill(skill) || finalDamage < 1) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.5));
}

function resetOverchannel() {
  state.overchannelUsed = false;
  state.overchannelActive = false;
}

function isElementalDamageType(damageType) {
  return ["fire", "ice", "lightning"].includes(damageType);
}

function isMagicianCataclysmFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && combatant?.subclassId === "elementalist" && (combatant?.level ?? 1) >= 20;
}

function isCataclysmEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell" && isElementalDamageType(skill?.damageType);
}

function getCataclysmDamageBonus(caster, skill, finalDamage, options = {}) {
  if (!isMagicianCataclysmFeatureActive(caster)) return 0;
  if (!state.cataclysmActive) return 0;
  if (options.doubleCast || !isCataclysmEligibleSkill(skill) || finalDamage < 1) return 0;
  return finalDamage;
}

function resetCataclysm() {
  state.cataclysmUsed = false;
  state.cataclysmActive = false;
}

function isSorcererOverloadFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && (combatant?.level ?? 1) >= 15;
}

function isOverloadEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function getOverloadDamageBonus(caster, skill, finalDamage, options = {}) {
  if (!isSorcererOverloadFeatureActive(caster)) return 0;
  if (!state.overloadActive) return 0;
  if (options.chainCasting || !isOverloadEligibleSkill(skill) || finalDamage < 1) return 0;
  return finalDamage;
}

function resetOverload() {
  state.overloadUsed = false;
  state.overloadActive = false;
}

function isSorcererArcaneCataclysmFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && (combatant?.level ?? 1) === 20;
}

function isArcaneCataclysmEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function getArcaneCataclysmDamageBonus(caster, skill, finalDamage, options = {}) {
  if (!isSorcererArcaneCataclysmFeatureActive(caster)) return 0;
  if (!state.arcaneCataclysmActive) return 0;
  if (options.chainCasting || !isArcaneCataclysmEligibleSkill(skill) || finalDamage < 1) return 0;
  return finalDamage;
}

function resetArcaneCataclysm() {
  state.arcaneCataclysmUsed = false;
  state.arcaneCataclysmActive = false;
}

function isSorcererPyromancerBurningSoulActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && combatant?.subclassId === "pyromancer" && (combatant?.level ?? 1) >= 3;
}

function isBurningSoulFireSpell(source) {
  return source?.mode === "standalone" && source?.attackKind === "spell" && source?.damageType === "fire";
}

function getBurningSoulDamageBonus(attacker, attackOrSkill) {
  if (!isSorcererPyromancerBurningSoulActive(attacker)) return 0;
  if (!isBurningSoulFireSpell(attackOrSkill)) return 0;
  return 2;
}

function getBurningSoulBurnDurationBonus(source, effectSource, statusId) {
  if (statusId !== "burn") return 0;
  if (!isSorcererPyromancerBurningSoulActive(source)) return 0;
  if (!isBurningSoulFireSpell(effectSource)) return 0;
  return 1;
}

function isSorcererPyromancerKindlingActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && combatant?.subclassId === "pyromancer" && (combatant?.level ?? 1) >= 7;
}

function isKindlingFireSpell(source) {
  return source?.mode === "standalone" && source?.attackKind === "spell" && source?.damageType === "fire";
}

function getKindlingDamageBonus(attacker, defender, attackOrSkill, finalDamage) {
  if (!isSorcererPyromancerKindlingActive(attacker)) return 0;
  if (!isKindlingFireSpell(attackOrSkill)) return 0;
  if (!hasStatus(defender, "burn") || finalDamage < 1) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.25));
}

function isSorcererPyromancerFirestormActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && combatant?.subclassId === "pyromancer" && (combatant?.level ?? 1) >= 10;
}

function isSorcererPyromancerInfernoHeartActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && combatant?.subclassId === "pyromancer" && (combatant?.level ?? 1) >= 15;
}

function isSorcererPyromancerWorldfireActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && combatant?.subclassId === "pyromancer" && (combatant?.level ?? 1) === 20;
}

function isFirestormEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell" && skill?.damageType === "fire";
}

function isWorldfireEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell" && skill?.damageType === "fire";
}

function getWorldfireDamageBonus(caster, skill, finalDamage, options = {}) {
  if (!isSorcererPyromancerWorldfireActive(caster)) return 0;
  if (!state.worldfireActive) return 0;
  if (options.chainCasting || !isWorldfireEligibleSkill(skill) || finalDamage < 1) return 0;
  return finalDamage;
}

function applyWorldfireBurn(caster, target, skill) {
  if (!isWorldfireEligibleSkill(skill)) return false;
  addLog("Worldfire doubles the spell\u2019s damage and applies Burn.");
  applyStatus(target, "burn", "Worldfire", caster.level ?? 1, {
    durationBonus: getBurningSoulBurnDurationBonus(caster, skill, "burn"),
    sourceClassId: caster.classDef?.id,
    sourceSubclassId: caster.subclassId,
  });
  return true;
}

function resetWorldfire() {
  state.worldfireUsed = false;
  state.worldfireActive = false;
}

function shouldTriggerFirestorm(caster, skill) {
  return isSorcererPyromancerFirestormActive(caster) && isFirestormEligibleSkill(skill) && state.firestormActive;
}

function applyFirestorm(caster, target, skill) {
  if (!shouldTriggerFirestorm(caster, skill)) return false;
  state.firestormActive = false;
  addLog("Firestorm applies Burn automatically.");
  applyStatus(target, "burn", "Firestorm", caster.level ?? 1, {
    durationBonus: getBurningSoulBurnDurationBonus(caster, skill, "burn"),
    sourceClassId: caster.classDef?.id,
    sourceSubclassId: caster.subclassId,
  });
  return true;
}

function resetFirestorm() {
  state.firestormUsed = false;
  state.firestormActive = false;
}

function isSorcererWildCastingFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "sorcerer" && (combatant?.level ?? 1) >= 17;
}

function isWildCastingEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function shouldTriggerWildCasting(caster, skill) {
  return isSorcererWildCastingFeatureActive(caster) && isWildCastingEligibleSkill(skill) && !state.wildCastingUsedThisTurn;
}

function restoreWildCastingMana(caster, amount) {
  const restoreAmount = Math.max(0, amount);
  caster.mana = Math.min(caster.maxMana ?? caster.mana ?? 0, (caster.mana ?? 0) + restoreAmount);
  return `${restoreAmount} Mana restored.`;
}

function reduceWildCastingCooldown(caster, skill) {
  caster.skillCooldowns ??= {};
  const currentCooldown = caster.skillCooldowns?.[skill.id] ?? 0;
  const nextCooldown = Math.max(0, currentCooldown - 1);
  if (nextCooldown > 0) {
    caster.skillCooldowns[skill.id] = nextCooldown;
  } else {
    delete caster.skillCooldowns[skill.id];
  }
  return `${skill.name} cooldown reduced by 1.`;
}

function applyWildCasting(caster, target, skill, attack, finalDamage) {
  if (!shouldTriggerWildCasting(caster, skill)) return { damageBonus: 0, statusHandled: false };
  state.wildCastingUsedThisTurn = true;
  let effectRoll = roll(4);
  if (effectRoll === 2 && !attack?.status) {
    const reroll = roll(4);
    effectRoll = reroll === 2 ? 0 : reroll;
  }

  let resultText = "";
  let damageBonus = 0;
  let statusHandled = false;
  if (effectRoll === 1) {
    damageBonus = finalDamage > 0 ? Math.max(1, Math.floor(finalDamage * 0.25)) : 0;
    resultText = `+${damageBonus} final damage.`;
  } else if (effectRoll === 2 && attack?.status) {
    const statusName = statusDefinitions[attack.status.id]?.name ?? attack.status.id;
    statusHandled = true;
    const applied = applyStatus(target, attack.status.id, skill.name, caster.level ?? 1, {
      durationBonus: getBurningSoulBurnDurationBonus(caster, skill, attack.status.id),
      sourceClassId: caster.classDef?.id,
      sourceSubclassId: caster.subclassId,
    });
    resultText = applied ? `${statusName} applied automatically.` : `${statusName} resisted.`;
  } else if (effectRoll === 3) {
    resultText = restoreWildCastingMana(caster, 2);
  } else if (effectRoll === 4) {
    resultText = reduceWildCastingCooldown(caster, skill);
  } else {
    resultText = restoreWildCastingMana(caster, 1);
  }
  addLog(`Wild Casting surges: ${resultText}`);
  return { damageBonus, statusHandled };
}

function resetWildCasting() {
  state.wildCastingUsedThisTurn = false;
}

function isMagicianArcaneSurgeFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && (combatant?.level ?? 1) >= 15;
}

function isArcaneSurgeEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function resetArcaneSurge() {
  state.arcaneSurgeUsed = false;
  state.arcaneSurgeActive = false;
}

function consumeArcaneSurgeForSkill(caster, skill) {
  if (!isMagicianArcaneSurgeFeatureActive(caster) || !state.arcaneSurgeActive || !isArcaneSurgeEligibleSkill(skill)) return false;
  state.arcaneSurgeActive = false;
  addLog("Arcane Surge ignores resistance.");
  return true;
}

function isMagicianDualElementsFeatureActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "magician" && combatant?.subclassId === "elementalist" && (combatant?.level ?? 1) >= 10;
}

function isDualElementsEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell" && Boolean(DUAL_ELEMENTS_SECONDARY_STATUS_BY_DAMAGE_TYPE[skill.damageType]);
}

function resetDualElements() {
  state.dualElementsUsed = false;
  state.dualElementsActive = false;
}

function maybeApplyDualElements(caster, target, skill) {
  if (!isMagicianDualElementsFeatureActive(caster) || !state.dualElementsActive || !isDualElementsEligibleSkill(skill) || !living(target)) return;
  const statusId = DUAL_ELEMENTS_SECONDARY_STATUS_BY_DAMAGE_TYPE[skill.damageType];
  const statusName = statusDefinitions[statusId]?.name ?? titleCase(statusId);
  state.dualElementsActive = false;
  addLog(`Dual Elements attempts to apply ${statusName}.`);
  maybeApplyStatus(caster, target, { id: statusId }, "Dual Elements", { ...skill, status: { id: statusId } });
}

function isDeathmarkTarget(target) {
  return state.deathmarkActive && state.deathmarkTargetId && state.deathmarkTargetId === getDeathmarkTargetId(target);
}

function getDeathmarkDamageBonus(attacker, defender, finalDamage) {
  if (!isRogueDeathmarkFeatureActive(attacker) || !isDeathmarkTarget(defender) || finalDamage < 1) return 0;
  return finalDamage;
}

function getPerfectExecutionDamageBonus(attacker, attackOrSkill, finalDamage) {
  if (!isAssassinPerfectExecutionFeatureActive(attacker) || !state.perfectExecutionActive || finalDamage < 1) return 0;
  if (!isRogueWeaponAttack(attacker, attackOrSkill)) return 0;
  return finalDamage;
}

function clearDeathmarkIfTarget(target) {
  if (isDeathmarkTarget(target)) clearDeathmark();
}

function resetGodOfCarnage() {
  state.godOfCarnageUsed = false;
  state.godOfCarnageBonusAttackAvailable = false;
}

function triggerGodOfCarnage(attacker) {
  if (!isBerserkerGodOfCarnageActive(attacker) || state.godOfCarnageUsed) return;
  state.godOfCarnageUsed = true;
  state.godOfCarnageBonusAttackAvailable = true;
  addLog(`God of Carnage triggers â€” ${attacker.name} is ready to strike again.`);
}

function getWarriorBaseBasicAttackCount(player) {
  const classId = normalizeClassId(player?.classDef, "");
  if (classId !== "warrior") return 1;
  const level = player?.level ?? 1;
  if (level >= 20) return 4;
  if (level >= 10) return 3;
  if (level >= 5) return 2;
  return 1;
}

function getBasicAttackCount(player) {
  const classId = normalizeClassId(player?.classDef, "");
  if (isMonkBodyLivingWeaponUnarmedAttack(player, player?.weapon)) return 4;
  if (classId === "monk" && (player?.level ?? 1) >= 5) return 2;
  return getWarriorBaseBasicAttackCount(player) + (isBerserkerFrenzyActive(player) ? 1 : 0);
}

function getBasicAttackFollowUpLog(player, attackIndex) {
  if (isMonkBodyLivingWeaponUnarmedAttack(player, player?.weapon)) {
    return `${player.name} follows through with Living Weapon.`;
  }
  if (normalizeClassId(player?.classDef, "") === "monk" && attackIndex === 1) {
    return `Flurry Mastery \u2014 ${player.name} strikes again.`;
  }
  const warriorBaseAttackCount = getWarriorBaseBasicAttackCount(player);
  if (isBerserkerFrenzyActive(player) && attackIndex >= warriorBaseAttackCount) {
    return `Frenzy drives ${player.name} into another attack.`;
  }
  if (attackIndex === 3) return `${player.name} becomes an Avatar of War and strikes again.`;
  if (attackIndex === 2) return `${player.name} presses the assault with Relentless Strikes.`;
  return `${player.name} follows through with Extra Attack.`;
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
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
  }
}

function getNegativeStatuses(combatant) {
  return (combatant?.statuses ?? []).filter((status) => statusDefinitions[status.id]?.negative);
}

function canUseUniversalMinorAction() {
  return state.gameState === GAME_STATES.inCombat && currentCombatant()?.id === "player" && !state.isResolvingEnemyTurn && !state.winner && canUseMinorAction();
}

function getRecoverTarget(player) {
  if (!player) return null;
  const recoverOptions = [
    { key: "hp", maxKey: "maxHp", label: "HP", amount: Math.ceil((player.maxHp ?? 0) * 0.05) },
    { key: "mana", maxKey: "maxMana", label: "Mana", amount: 2 },
    {
      key: "stamina",
      maxKey: "maxStamina",
      label: "Stamina",
      amount: 2 + (player.classDef?.id === "monk" ? getClassPassiveRank(player) : 0),
    },
  ].filter((option) => (player[option.key] ?? 0) < (player[option.maxKey] ?? 0));
  if (!recoverOptions.length) return null;
  recoverOptions.sort((a, b) => (player[a.key] ?? 0) / Math.max(1, player[a.maxKey] ?? 1) - (player[b.key] ?? 0) / Math.max(1, player[b.maxKey] ?? 1));
  return recoverOptions[0];
}

function useRecoverAction() {
  if (!canUseUniversalMinorAction()) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
    return;
  }
  const target = getRecoverTarget(state.player);
  if (!target) {
    addLog(`${state.player.name} has no depleted resource to recover.`);
    renderCombat();
    return;
  }
  markMinorActionUsed("Recover");
  const before = state.player[target.key] ?? 0;
  state.player[target.key] = Math.min(state.player[target.maxKey] ?? before, before + target.amount);
  const restored = state.player[target.key] - before;
  addLog(`${state.player.name} recovers ${restored} ${target.label}.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useFocusAction() {
  if (!canUseUniversalMinorAction()) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
    return;
  }
  markMinorActionUsed("Focus");
  state.player.nextRollBonus = Math.max(state.player.nextRollBonus ?? 0, 1);
  addLog(`${state.player.name} focuses. The next roll gains +1.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useShakeItOffAction() {
  if (!canUseUniversalMinorAction()) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
    return;
  }
  const negativeStatuses = getNegativeStatuses(state.player);
  if (!negativeStatuses.length) {
    addLog(`${state.player.name} has no negative status to shake off.`);
    renderCombat();
    return;
  }
  markMinorActionUsed("Shake It Off");
  const chance = clamp(50 + (state.player.stats?.mind ?? 0) * 2, 0, 100);
  const statusRoll = rollStatusChance(chance);
  const rollValue = statusRoll.rollValue;
  const status = negativeStatuses[0];
  const statusName = statusDefinitions[status.id]?.name ?? status.id;
  addLog(`Shake It Off chance: ${chance}% (50% base + Mind scaling).`);
  if (statusRoll.succeeds) {
    removeStatus(state.player, status.id);
    addLog(`Rolled ${rollValue} -> ${statusName} removed.`);
  } else {
    addLog(`Rolled ${rollValue} -> ${statusName} remains.`);
  }
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useDeathmarkAction() {
  if (!canUseUniversalMinorAction() || !isRogueDeathmarkFeatureActive(state.player) || state.deathmarkUsed || state.deathmarkActive || state.perfectExecutionActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Deathmark");
  state.deathmarkUsed = true;
  state.deathmarkActive = true;
  state.deathmarkTargetId = getDeathmarkTargetId(state.enemy);
  addLog(`Deathmark — ${state.player.name} marks ${state.enemy.name}.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function usePerfectExecutionAction() {
  if (!canUseUniversalMinorAction() || !isAssassinPerfectExecutionFeatureActive(state.player) || state.perfectExecutionUsed || state.perfectExecutionActive || state.deathmarkActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Perfect Execution");
  state.perfectExecutionUsed = true;
  state.perfectExecutionActive = true;
  addLog(`Perfect Execution — ${state.player.name} prepares a killing strike.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useArcaneSurgeAction() {
  if (!canUseUniversalMinorAction() || !isMagicianArcaneSurgeFeatureActive(state.player) || state.arcaneSurgeUsed || state.arcaneSurgeActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Arcane Surge");
  state.arcaneSurgeUsed = true;
  state.arcaneSurgeActive = true;
  addLog(`Arcane Surge \u2014 ${state.player.name} channels overwhelming power.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useDualElementsAction() {
  if (!canUseUniversalMinorAction() || !isMagicianDualElementsFeatureActive(state.player) || state.dualElementsUsed || state.dualElementsActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Dual Elements");
  state.dualElementsUsed = true;
  state.dualElementsActive = true;
  addLog(`Dual Elements \u2014 ${state.player.name} weaves unstable magic.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useOverchannelAction() {
  if (!canUseUniversalMinorAction() || !isMagicianOverchannelFeatureActive(state.player) || state.overchannelUsed || state.overchannelActive || !living(state.enemy)) return;
  if (state.cataclysmActive || state.masterOfMagicActive) {
    addLog("Overchannel cannot be activated while Cataclysm or Master of Magic is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Overchannel");
  state.overchannelUsed = true;
  state.overchannelActive = true;
  addLog(`Overchannel \u2014 ${state.player.name} pushes beyond safe limits.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useCataclysmAction() {
  if (!canUseUniversalMinorAction() || !isMagicianCataclysmFeatureActive(state.player) || state.cataclysmUsed || state.cataclysmActive || !living(state.enemy)) return;
  if (state.overchannelActive || state.masterOfMagicActive) {
    addLog("Cataclysm cannot be activated while Overchannel or Master of Magic is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Cataclysm");
  state.cataclysmUsed = true;
  state.cataclysmActive = true;
  addLog(`Cataclysm \u2014 ${state.player.name} gathers destructive elemental force.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useMasterOfMagicAction() {
  if (!canUseUniversalMinorAction() || !isMagicianMasterOfMagicFeatureActive(state.player) || state.masterOfMagicUsed || state.masterOfMagicActive || !living(state.enemy)) return;
  if (state.cataclysmActive || state.overchannelActive) {
    addLog("Master of Magic cannot be activated while Cataclysm or Overchannel is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Master of Magic");
  state.masterOfMagicUsed = true;
  state.masterOfMagicActive = true;
  addLog(`Master of Magic \u2014 ${state.player.name} channels ultimate power.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useFirestormAction() {
  if (!canUseUniversalMinorAction() || !isSorcererPyromancerFirestormActive(state.player) || state.firestormUsed || state.firestormActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Firestorm");
  state.firestormUsed = true;
  state.firestormActive = true;
  addLog(`Firestorm \u2014 ${state.player.name} wreathes their next spell in flame.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useWorldfireAction() {
  if (!canUseUniversalMinorAction() || !isSorcererPyromancerWorldfireActive(state.player) || state.worldfireUsed || state.worldfireActive || !living(state.enemy)) return;
  if (state.overloadActive || state.arcaneCataclysmActive || state.cataclysmActive || state.masterOfMagicActive) {
    addLog("Worldfire cannot be activated while another double-damage spell effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Worldfire");
  state.worldfireUsed = true;
  state.worldfireActive = true;
  addLog(`Worldfire \u2014 ${state.player.name} becomes the heart of the blaze.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useArcJumpAction() {
  if (!canUseUniversalMinorAction() || !isSorcererStormcallerArcJumpActive(state.player) || state.arcJumpUsed || state.arcJumpActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Arc Jump");
  state.arcJumpUsed = true;
  state.arcJumpActive = true;
  addLog(`Arc Jump \u2014 ${state.player.name} charges the air with lightning.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useStormAvatarAction() {
  if (!canUseUniversalMinorAction() || !isSorcererStormcallerStormAvatarActive(state.player) || state.stormAvatarUsed || state.stormAvatarActive || !living(state.enemy)) return;
  if (state.overloadActive || state.arcaneCataclysmActive || state.cataclysmActive || state.masterOfMagicActive || state.worldfireActive) {
    addLog("Storm Avatar cannot be activated while another double-damage spell effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Storm Avatar");
  state.stormAvatarUsed = true;
  state.stormAvatarActive = true;
  addLog(`Storm Avatar \u2014 ${state.player.name} becomes the eye of the storm.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useOverloadAction() {
  if (!canUseUniversalMinorAction() || !isSorcererOverloadFeatureActive(state.player) || state.overloadUsed || state.overloadActive || !living(state.enemy)) return;
  if (state.cataclysmActive || state.masterOfMagicActive || state.arcaneCataclysmActive || state.worldfireActive || state.stormAvatarActive) {
    addLog("Overload cannot be activated while another double-damage spell effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Overload");
  state.overloadUsed = true;
  state.overloadActive = true;
  addLog(`Overload \u2014 ${state.player.name} channels unstable arcane power.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useArcaneCataclysmAction() {
  if (
    !canUseUniversalMinorAction() ||
    !isSorcererArcaneCataclysmFeatureActive(state.player) ||
    state.arcaneCataclysmUsed ||
    state.arcaneCataclysmActive ||
    !living(state.enemy)
  ) return;
  if (state.overloadActive || state.worldfireActive || state.stormAvatarActive || state.cataclysmActive || state.masterOfMagicActive) {
    addLog("Arcane Cataclysm cannot be activated while another double-damage spell effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Arcane Cataclysm");
  state.arcaneCataclysmUsed = true;
  state.arcaneCataclysmActive = true;
  addLog(`Arcane Cataclysm \u2014 ${state.player.name} gathers impossible power.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function usePerfectFocusAction() {
  if (!canUseUniversalMinorAction() || !isMagicianPerfectFocusFeatureActive(state.player) || state.perfectFocusUsed || state.perfectFocusActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Perfect Focus");
  state.perfectFocusUsed = true;
  state.perfectFocusActive = true;
  addLog(`Perfect Focus \u2014 ${state.player.name} sees the spell's path clearly.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useInnerReserveAction() {
  if (!canUseUniversalMinorAction() || !isMonkInnerReserveActive(state.player) || state.innerReserveUsed) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Inner Reserve");
  state.innerReserveUsed = true;
  const restored = restoreInnerReserveResources(state.player);
  addLog(`Inner Reserve restores ${restored.stamina} Stamina and ${restored.mana} Mana.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useTranscendenceAction() {
  if (!canUseUniversalMinorAction() || !isMonkTranscendenceActive(state.player) || state.transcendenceUsed) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  state.minorActionsUsed += 1;
  syncActionState();
  addLog(`${state.player.name} uses Minor Action: Transcendence.`);
  state.transcendenceUsed = true;
  state.pendingExtraTurn = true;
  addLog(`Transcendence \u2014 ${state.player.name} steps beyond the flow of battle.`);
  resetPlayerTurnActions();
  state.pendingExtraTurn = false;
  renderCombat();
}

function useEnlightenmentAction() {
  if (!canUseUniversalMinorAction() || !isMonkSoulEnlightenmentActive(state.player) || state.enlightenmentUsed) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  state.minorActionsUsed += 1;
  syncActionState();
  addLog(`${state.player.name} uses Minor Action: Enlightenment.`);
  state.enlightenmentUsed = true;
  state.pendingExtraTurn = true;
  addLog(`Enlightenment \u2014 ${state.player.name} moves beyond mortal limits.`);
  applyStatus(state.player, "guarded", "Enlightenment", state.player.level ?? 1, {
    sourceClassId: state.player.classDef?.id,
    sourceSubclassId: state.player.subclassId,
  });
  addLog("Enlightenment grants Guarded.");
  resetPlayerTurnActions();
  state.pendingExtraTurn = false;
  renderCombat();
}

function isImmovableBastionFeatureActive(combatant) {
  return combatant?.id === "player" && isGuardianClass(combatant) && (combatant?.level ?? 1) >= 20;
}

function isEternalBastionFeatureActive(combatant) {
  return combatant?.id === "player" && isGuardianEternalBastionActive(combatant);
}

function isJudgmentWallFeatureActive(combatant) {
  return combatant?.id === "player" && isGuardianSentinel(combatant, 20);
}

function isDivineChampionFeatureActive(combatant) {
  return combatant?.id === "player" && isPaladinClass(combatant) && (combatant?.level ?? 1) >= 20;
}

function isEternalOathFeatureActive(combatant) {
  return combatant?.id === "player" && isPaladinOathkeeper(combatant, 20);
}

function isWrathIncarnateFeatureActive(combatant) {
  return combatant?.id === "player" && isPaladinAvenger(combatant, 20);
}

function isPsionicRecoveryFeatureActive(combatant) {
  return combatant?.id === "player" && isMysticClass(combatant) && (combatant?.level ?? 1) >= 17;
}

function isTrueSightFeatureActive(combatant) {
  return combatant?.id === "player" && isMysticClass(combatant) && (combatant?.level ?? 1) >= 20;
}

function isPerfectPredictionFeatureActive(combatant) {
  return combatant?.id === "player" && isMysticSeer(combatant, 20);
}

function isGravityBreakFeatureActive(combatant) {
  return combatant?.id === "player" && isMysticTelekinetic(combatant, 20);
}

function hasActiveDoubleDamageEffect() {
  return (
    state.deathmarkActive ||
    state.perfectExecutionActive ||
    state.cataclysmActive ||
    state.masterOfMagicActive ||
    state.overloadActive ||
    state.arcaneCataclysmActive ||
    state.worldfireActive ||
    state.stormAvatarActive ||
    state.divineChampionActive ||
    state.trueSightActive ||
    state.gravityBreakActive
  );
}

function useImmovableBastionAction() {
  if (!canUseUniversalMinorAction() || !isImmovableBastionFeatureActive(state.player) || state.immovableBastionUsed || state.immovableBastionActive) return;
  if (state.eternalBastionActive) {
    addLog("Another bastion effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Immovable Bastion");
  state.immovableBastionUsed = true;
  state.immovableBastionActive = true;
  addLog(`Immovable Bastion \u2014 ${state.player.name} becomes immovable.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useEternalBastionAction() {
  if (!canUseUniversalMinorAction() || !isEternalBastionFeatureActive(state.player) || state.eternalBastionUsed || state.eternalBastionActive) return;
  if (state.immovableBastionActive) {
    addLog("Another bastion effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Eternal Bastion");
  state.eternalBastionUsed = true;
  state.eternalBastionActive = true;
  addLog(`Eternal Bastion \u2014 ${state.player.name} becomes an eternal wall.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useJudgmentWallAction() {
  if (!canUseUniversalMinorAction() || !isJudgmentWallFeatureActive(state.player) || state.judgmentWallUsed || state.judgmentWallActive) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Judgment Wall");
  state.judgmentWallUsed = true;
  state.judgmentWallActive = true;
  addLog(`Judgment Wall \u2014 ${state.player.name} prepares to punish every opening.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useDivineChampionAction() {
  if (!canUseUniversalMinorAction() || !isDivineChampionFeatureActive(state.player) || state.divineChampionUsed || state.divineChampionActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Divine Champion");
  state.divineChampionUsed = true;
  state.divineChampionActive = true;
  removeStatusesBySource(state.player, "negative", "Divine Champion");
  applyStatus(state.player, "shielded", "Divine Champion", state.player.level ?? 1, {
    sourceClassId: state.player.classDef?.id,
    sourceSubclassId: state.player.subclassId,
  });
  addLog(`Divine Champion \u2014 ${state.player.name} becomes a vessel of holy power.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useEternalOathAction() {
  if (!canUseUniversalMinorAction() || !isEternalOathFeatureActive(state.player) || state.eternalOathUsed || state.eternalOathActive) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Eternal Oath");
  state.eternalOathUsed = true;
  state.eternalOathActive = true;
  applyStatus(state.player, "shielded", "Eternal Oath", state.player.level ?? 1, {
    sourceClassId: state.player.classDef?.id,
    sourceSubclassId: state.player.subclassId,
  });
  addLog(`Eternal Oath \u2014 ${state.player.name} becomes untouchable.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useWrathIncarnateAction() {
  if (!canUseUniversalMinorAction() || !isWrathIncarnateFeatureActive(state.player) || state.wrathIncarnateUsed || state.wrathIncarnateActive || !living(state.enemy)) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Wrath Incarnate");
  state.wrathIncarnateUsed = true;
  state.wrathIncarnateActive = true;
  addLog("Wrath Incarnate prepares divine punishment.");
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function usePsionicRecoveryAction() {
  if (!canUseUniversalMinorAction() || !isPsionicRecoveryFeatureActive(state.player) || state.psionicRecoveryUsed) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Psionic Recovery");
  state.psionicRecoveryUsed = true;
  const status = getNegativeStatuses(state.player)[0];
  if (status) {
    removeStatus(state.player, status.id);
    addLog(`Psionic Recovery clears ${statusDefinitions[status.id]?.name ?? status.id}.`);
  } else {
    const restored = restoreHpByPercent(state.player, 0.2);
    addLog(`Psionic Recovery restores ${restored} HP.`);
  }
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useTrueSightAction() {
  if (!canUseUniversalMinorAction() || !isTrueSightFeatureActive(state.player) || state.trueSightUsed || state.trueSightActive || !living(state.enemy)) return;
  if (hasActiveDoubleDamageEffect()) {
    addLog("True Sight cannot be activated while another double-damage effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("True Sight");
  state.trueSightUsed = true;
  state.trueSightActive = true;
  addLog(`True Sight \u2014 ${state.player.name} sees the perfect strike.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function usePerfectPredictionAction() {
  if (!canUseUniversalMinorAction() || !isPerfectPredictionFeatureActive(state.player) || state.perfectPredictionUsed || state.perfectPredictionActive) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Perfect Prediction");
  state.perfectPredictionUsed = true;
  state.perfectPredictionActive = true;
  addLog(`Perfect Prediction \u2014 ${state.player.name} reads the next attack.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useGravityBreakAction() {
  if (!canUseUniversalMinorAction() || !isGravityBreakFeatureActive(state.player) || state.gravityBreakUsed || state.gravityBreakActive || !living(state.enemy)) return;
  if (hasActiveDoubleDamageEffect()) {
    addLog("Gravity Break cannot be activated while another double-damage effect is already active.");
    renderCombat();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Gravity Break");
  state.gravityBreakUsed = true;
  state.gravityBreakActive = true;
  addLog(`Gravity Break \u2014 ${state.player.name} bends thought into crushing force.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function useLivingWallAction() {
  if (!canUseUniversalMinorAction() || !isLivingWallFeatureActive(state.player) || state.livingWallUsed || state.livingWallActive) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
    return;
  }
  markMinorActionUsed("Living Wall");
  state.livingWallUsed = true;
  state.livingWallActive = true;
  addLog(`Living Wall â€” ${state.player.name} becomes an immovable fortress.`);
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function consumeNextRollBonus(combatant) {
  const bonus = combatant?.nextRollBonus ?? 0;
  if (bonus > 0) combatant.nextRollBonus = 0;
  return bonus;
}

function skillHasDirectOffense(skill) {
  return Boolean(skill?.damageDice || skill?.damageBonus || skill?.attackKind === "weapon" || skill?.attackKind === "spell");
}

function getSkillActionType(skill) {
  if (!skill || skill.mode === "attack_modifier") return null;
  if (skill.mode === "standalone" && skillHasDirectOffense(skill)) return "major";
  return skill.actionType ?? "major";
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
  const latest = elements.diceLog.firstElementChild;
  if (latest?.dataset?.logMessage === message) {
    const count = (Number.parseInt(latest.dataset.logCount, 10) || 1) + 1;
    latest.dataset.logCount = String(count);
    latest.innerHTML = `${decorateLog(message)} <span class="log-repeat">x${count}</span>`;
    return;
  }
  const item = document.createElement("li");
  item.dataset.logMessage = message;
  item.dataset.logCount = "1";
  item.innerHTML = decorateLog(message);
  elements.diceLog.prepend(item);
  while (elements.diceLog.children.length > 120) {
    elements.diceLog.lastElementChild?.remove();
  }
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

function renderXpBar(container, player) {
  if (!container || !player) return;
  const maxLevel = (player.level ?? 1) >= MAX_LEVEL;
  const currentLevelTotal = getTotalXpForLevel(player.level);
  const nextLevelTotal = getTotalXpForLevel(Math.min(MAX_LEVEL, player.level + 1));
  const levelSpan = Math.max(1, nextLevelTotal - currentLevelTotal);
  const levelProgress = Math.max(0, (player.xp ?? 0) - currentLevelTotal);
  const percent = maxLevel ? 100 : clamp((levelProgress / levelSpan) * 100, 0, 100);
  container.innerHTML = "";
  const bar = document.createElement("div");
  bar.className = "resource-bar xp";
  const fill = document.createElement("div");
  fill.className = "resource-fill";
  fill.style.width = `${percent}%`;
  const text = document.createElement("div");
  text.className = "resource-text";
  text.textContent = maxLevel ? "XP MAX" : `XP ${player.xp ?? 0} / ${nextLevelTotal}`;
  bar.append(fill, text);
  container.append(bar);
}

function renderCharacterModal() {
  if (!state.player || !elements.characterModalBody) return;
  const player = state.player;
  const attackParts = getAttackParts(player);
  const attackTotal = sumParts(attackParts);
  const subclassDef = getSubclassDef(player);
  const playerSkills = getPlayerSkills();
  const cooldownSummary = formatCooldownSummary(player);
  const statusSummary = formatStatuses(player);
  const resourceSummary = `HP ${player.hp}/${player.maxHp}; Mana ${player.mana}/${player.maxMana}; Stamina ${player.stamina}/${player.maxStamina}`;
  const classFeatureSummary = getClassFeatureLines(player.classDef?.id, player.level);
  const classFeatureMarkup = classFeatureSummary.length
    ? classFeatureSummary
        .map(
          (feature) => `
            <article class="character-skill-card">
              <div>
                <h4>Level ${feature.level}: ${escapeAttribute(feature.name)}</h4>
                <p>${escapeAttribute(feature.description)}</p>
              </div>
            </article>`
        )
        .join("")
    : `<p>No class features.</p>`;
  const skillSummary = playerSkills.length
    ? playerSkills
        .map(
          (skill) => `
            <article class="character-skill-card">
              <div>
                <h4>${escapeAttribute(skill.name)}</h4>
                <p>${escapeAttribute(skill.description)}</p>
              </div>
              <p class="muted">${escapeAttribute(formatSkillEffect(skill, player))}</p>
            </article>`
        )
        .join("")
    : `<p>No class skills unlocked.</p>`;
  const classProgressionEntries = getClassProgressionEntries(player.classDef?.id);
  const hasFullProgression = classProgressionEntries.some((entry) => entry.level >= MAX_LEVEL);
  const classProgressionIntro = hasFullProgression
    ? `<p class="muted">Level 1-${MAX_LEVEL} progression, including skills, choices, stat increases, class features, and ${
        subclassDef ? `${subclassDef.name} subclass features` : "subclass feature options"
      }.</p>`
    : "";
  const classProgressionMarkup = renderClassProgressionList(player.classDef?.id, player.level, player.subclassId);
  elements.characterModalBody.innerHTML = `
    <section class="character-profile">
      ${renderCharacterAvatar(player.classDef?.id, player.gender, player.name, { large: true })}
      <div>
        <h3>${player.name}</h3>
        <p class="muted">${formatGenderLabel(player.gender)} ${player.classDef?.name ?? "Adventurer"}</p>
        <p>${formatPowerTierName(player.level)}</p>
      </div>
    </section>
    <section class="character-detail-grid">
      <div class="character-detail-card">
        <h3>Progress</h3>
        <p>Level ${player.level}</p>
        <p>${(player.level ?? 1) >= MAX_LEVEL ? "XP MAX" : `XP ${player.xp ?? 0} / ${getTotalXpForLevel(player.level + 1)}`}</p>
        <p>${resourceSummary}</p>
      </div>
      <div class="character-detail-card">
        <h3>Identity</h3>
        <p>Class: ${formatClassDisplay(player.classDef)}</p>
        <p>Subclass: ${formatSubclassDisplay(subclassDef)}</p>
        <p>Stats: ${formatStatsMarkup(player.stats)}</p>
      </div>
      <div class="character-detail-card">
        <h3>Defense</h3>
        <p>${formatInfoTooltip(`${getAc(player)}`, getAcFormula(player), { title: `Defense ${getAc(player)}` })}</p>
        <p>${getAcFormula(player)}</p>
      </div>
      <div class="character-detail-card">
        <h3>Attack</h3>
        <p>${formatInfoTooltip(`${signed(attackTotal)}`, attackParts.map((part) => `${part.label} ${signed(part.value)}`).join(" | "), {
          title: `Attack ${signed(attackTotal)}`,
        })}</p>
        <p>d20 + ${attackParts.map((part) => `${part.label} ${part.value}`).join(" + ")}</p>
      </div>
      <div class="character-detail-card">
        <h3>Equipment</h3>
        <p>Weapon: ${renderWeaponImage(player.weapon.id, player.weapon.name, { compact: true, size: "lg" })}</p>
        <p>Armor: ${renderArmorImage(player.armor.id, player.armor.name, { compact: true, size: "lg" })}</p>
      </div>
      <div class="character-detail-card">
        <h3>Traits</h3>
        <p>${formatTraits(player)}</p>
        <p>Status: ${statusSummary}</p>
        <p>Cooldowns: ${cooldownSummary}</p>
      </div>
      <div class="character-detail-card character-detail-wide">
        <h3>Class Features</h3>
        <div class="character-skill-list">${classFeatureMarkup}</div>
      </div>
      <div class="character-detail-card character-detail-wide">
        <h3>Skills</h3>
        <div class="character-skill-list">${skillSummary}</div>
      </div>
      <div class="character-detail-card character-detail-wide">
        <h3>Class Progression</h3>
        ${classProgressionIntro}
        ${classProgressionMarkup}
      </div>
      <div class="character-detail-card character-detail-wide">
        <h3>Derived</h3>
        <p>Max HP ${player.maxHp}; Max Mana ${player.maxMana}; Max Stamina ${player.maxStamina}; ${getAcFormula(player)}</p>
      </div>
    </section>
  `;
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
  resetCombatFeatureFlags();
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
  addLog(`${state.player.name} Defense: ${getAcFormula(state.player)}.`);
  addLog(`${state.enemy.name} Defense: ${getAcFormula(state.enemy)}.`);
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

  if (isMonkTranscendenceActive(state.player)) {
    state.initiative.sort((a, b) => (a.combatant.id === "player" ? -1 : b.combatant.id === "player" ? 1 : 0));
    addLog(`Transcendence \u2014 ${state.player.name} moves before thought.`);
  }
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
      const durationTooltip = status.duration > 0 ? ` Duration: ${status.duration} turn${status.duration === 1 ? "" : "s"} remaining.` : "";
      return `<span class="status-pill status-${def.color ?? "default"}" data-tooltip="${status.tooltip ?? getStatusTooltip(status.id)}${durationTooltip}">${def.name}${durationText}</span>`;
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
  const statsElement = elements[`${prefix}Stats`];
  const weaponElement = elements[`${prefix}Weapon`];
  const traitsElement = elements[`${prefix}Traits`];
  const statusesElement = elements[`${prefix}Statuses`];
  const defenseElement = elements[`${prefix}Ac`];
  const attackElement = elements[`${prefix}Attack`];
  const damageElement = elements[`${prefix}Damage`];
  if (statsElement) statsElement.innerHTML = formatStatsMarkup(combatant.stats);
  if (weaponElement) {
    weaponElement.innerHTML = `${renderWeaponImage(combatant.weapon.id, combatant.weapon.name)}<span class="weapon-special-copy">${combatant.weapon.special}</span>`;
  }
  if (traitsElement) traitsElement.textContent = formatTraits(combatant);
  if (statusesElement) statusesElement.innerHTML = formatStatuses(combatant);
  if (defenseElement) {
    defenseElement.innerHTML = formatInfoTooltip(`${getAc(combatant)}`, getAcFormula(combatant), { title: `Defense ${getAc(combatant)}` });
  }
  if (attackElement) {
    attackElement.innerHTML = formatInfoTooltip(`${signed(attackTotal)}`, attackParts.map((part) => `${part.label} ${signed(part.value)}`).join(" | "), {
      title: `Attack ${signed(attackTotal)}`,
    });
  }
  if (damageElement) damageElement.textContent = `${formatDice(combatant.weapon.damageDice)} ${combatant.weapon.damageType}`;

    if (prefix === "player") {
    if (elements.playerNameHeading) elements.playerNameHeading.textContent = combatant.name;
    setCharacterAvatar(elements.playerAvatar, combatant.classDef?.id, combatant.gender, combatant.name, { eager: true });
    if (elements.playerLevelXp) elements.playerLevelXp.textContent = `Level ${combatant.level}`;
    if (elements.playerLevelTier) elements.playerLevelTier.textContent = "";
    renderXpBar(elements.playerXpBar, combatant);
    if (elements.saveStatus) elements.saveStatus.textContent = state.savePending
      ? "Saving..."
      : state.saveMessage || (state.user ? "" : "Not logged in â€” progress will not be saved.");
    if (elements.playerGenderLine) elements.playerGenderLine.textContent = "";
    renderResourceBar(elements.playerManaBar, "Mana", combatant.mana, combatant.maxMana, "mana");
    renderResourceBar(elements.playerStaminaBar, "Stamina", combatant.stamina, combatant.maxStamina, "stamina");
    if (elements.playerGender) elements.playerGender.textContent = formatGenderLabel(combatant.gender);
    if (elements.playerClass) elements.playerClass.innerHTML = formatClassDisplay(combatant.classDef);
    if (elements.playerSubclass) elements.playerSubclass.innerHTML = formatSubclassDisplay(getSubclassDef(combatant));
    if (elements.playerWealth) elements.playerWealth.textContent = formatCurrencyCompact(combatant.inventory.currency);
    if (elements.playerArmor) elements.playerArmor.innerHTML = renderArmorImage(combatant.armor.id, combatant.armor.name);
    if (elements.playerAttackFormula) elements.playerAttackFormula.textContent = `d20 + ${attackParts.map((part) => `${part.label} ${part.value}`).join(" + ")}`;
    if (elements.playerCooldowns) elements.playerCooldowns.textContent = formatCooldownSummary(combatant);
    if (elements.playerDerived) {
      elements.playerDerived.textContent = `Max HP ${combatant.maxHp}; Max Mana ${combatant.maxMana}; Max Stamina ${combatant.maxStamina}; ${getAcFormula(combatant)}`;
    }
    const magicalSkills = getPlayerSkills().filter((skill) => skill.attackKind === "spell" || skill.statUsed === "Soul");
    if (elements.playerSpell) {
      elements.playerSpell.textContent = magicalSkills.length
        ? magicalSkills.map((skill) => `${skill.name}: ${skill.statUsed}-based ${skill.mode}`).join(", ")
        : "None";
    }
    if (elements.characterModal && !elements.characterModal.hidden) renderCharacterModal();
    if (elements.inventoryModal && !elements.inventoryModal.hidden) renderInventory();
    } else {
      elements.enemyNameHeading.textContent = combatant.name;
      renderEnemyPortrait(combatant);
      const typeLabel = combatant.isFinalTrial ? "Final Trial" : combatant.isTierTrial ? `Tier ${combatant.trialTier} Trial` : combatant.enemyType === "boss" ? "Boss" : "Standard";
      elements.enemyTypeLevel.textContent = `${typeLabel}, level ${combatant.level}`;
    }
  }

function renderInventory() {
  if (!state.player || !elements.inventoryList) return;
  const inventory = state.player.inventory;
  normalizePlayerInventory(state.player);
  applyNormalizedCurrency(inventory.currency, inventory.currency);
  const canManageGear = isBetweenBattles();
  const ownedConsumables = Object.values(consumableItems).filter((item) => (state.player.inventory.consumables[item.id] ?? 0) > 0);
  const consumableMarkup = ownedConsumables.length
    ? ownedConsumables
        .map((item) => {
          const useState = getConsumableUseState(state.player, item);
          const usingInCombat = state.gameState === GAME_STATES.inCombat;
          const actionBlocked = usingInCombat && !canUseMinorAction();
          const disabled = !useState.usable || actionBlocked;
          const reason = actionBlocked ? "No Minor Action available" : useState.reason;
          const quantity = state.player.inventory.consumables[item.id] ?? 0;
          const sellValue = getConsumableSellValue(item);
          return `
            <div class="item-card inventory-item-card">
              <span class="inventory-item-icon-wrap">
                <button type="button" class="item-icon-button" data-use-item="${item.id}" ${disabled ? "disabled" : ""} title="${reason}" aria-label="Use ${item.name}">
                  <span class="sr-only">${item.name}</span>
                  ${renderItemIcon(item)}
                  <span class="item-count-badge">${quantity}</span>
                </button>
                <button type="button" class="item-info-badge" data-info-item="${item.id}" aria-label="Show ${item.name} info">i</button>
              </span>
              ${
                canManageGear
                  ? `<button type="button" class="item-sell-button" data-sell-item="${item.id}" title="Sell ${item.name}">Sell ${renderCurrencyWithIcons(sellValue, { compact: true })}</button>`
                  : ""
              }
            </div>
          `;
        })
        .join("")
    : '<p class="muted">No consumables on hand.</p>';
  const ownedWeapons = inventory.weapons.length
    ? `<div class="inventory-weapon-list">${inventory.weapons
        .map((id) => {
          const weapon = weapons[id];
          const weaponName = safeEntityName(weapons, id);
          const equipped = state.player.weapon?.id === id;
          const classValid = getValidWeaponIdsForClass(state.player.classDef?.id).includes(id);
          const equipDisabled = !canManageGear || equipped || !classValid;
          const sellDisabled = id === "unarmed";
          const equipTitle = equipped
            ? "Currently equipped"
            : !classValid
              ? `${weaponName} is not available to ${state.player.classDef?.name ?? "this class"}`
              : canManageGear
                ? `Equip ${weaponName}`
                : "Can only equip between battles";
          return `
            <div class="inventory-weapon-card">
              <div class="inventory-weapon-main">
                ${renderWeaponImage(id, weaponName, { compact: true, showName: false, size: "lg" })}
                <div>
                  <strong>${weaponName}</strong>
                  <span class="item-meta">${weapon?.special ?? "No special effect"}</span>
                  <span class="item-meta">${equipped ? "Equipped" : classValid ? "Available" : "Class restricted"}</span>
                </div>
              </div>
              <div class="inventory-card-actions">
                <button type="button" data-equip-weapon="${id}" ${equipDisabled ? "disabled" : ""} title="${escapeAttribute(equipTitle)}">Equip</button>
                ${
                  canManageGear
                    ? `<button type="button" data-sell-weapon="${id}" ${sellDisabled ? "disabled" : ""} title="${id === "unarmed" ? "Unarmed cannot be sold" : "Sell weapon"}">Sell ${renderCurrencyWithIcons(getWeaponSellValue(id), { compact: true })}</button>`
                    : ""
                }
              </div>
            </div>
          `;
        })
        .join("")}</div>`
    : '<p class="muted">No weapons owned.</p>';
  const ownedArmor = inventory.armor.length
    ? `<div class="armor-chip-row">${inventory.armor
        .map((id) => renderArmorImage(id, safeEntityName(armors, id), { compact: true }))
        .join("")}</div>`
    : '<p class="muted">No armor owned.</p>';
  const equipmentMarkup = `
    <div class="inventory-section">
      <h3>Currency</h3>
      <div>${renderCurrencyWithIcons(inventory.currency, { showZero: true })}</div>
    </div>
      <div class="inventory-section">
        <h3>Owned weapons</h3>
        ${ownedWeapons}
      </div>
      <div class="inventory-section">
        <h3>Owned armor</h3>
        ${ownedArmor}
      </div>
      <p class="equipment-line">
        Equipped:
        ${renderWeaponImage(state.player.weapon.id, state.player.weapon.name, { compact: true, showName: false, size: "lg" })}
        <span>${state.player.weapon.name}</span>
        ${renderArmorImage(state.player.armor.id, state.player.armor.name, { compact: true, showName: false, size: "lg" })}
        <span>${state.player.armor.name}</span>
      </p>
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
  updateInnButtonState();
}

function isAdminQaUser() {
  return state.user?.username === "jak";
}

const adminQaClassLabels = {
  warrior: "Warrior",
  rogue: "Rogue",
  magician: "Magician",
  sorcerer: "Sorcerer",
  monk: "Monk",
  guardian: "Guardian",
  paladin: "Paladin",
  mystic: "Mystic",
};

const adminQaStatusIds = ["bleed", "burn", "poison", "freeze", "stun", "guarded", "shielded"];

const adminFeatureFlagIds = [
  "sneakAttackUsed",
  "deathsOpeningUsed",
  "assassinateUsed",
  "quickReadUsedThisTurn",
  "flowingStrikesUsedThisTurn",
  "killersRhythmUsedThisTurn",
  "shadowFlurryChecked",
  "shadowFlurryUsed",
  "evasionUsed",
  "ghostStepUsed",
  "monkGhostStepUsed",
  "deathmarkUsed",
  "deathmarkActive",
  "perfectExecutionUsed",
  "perfectExecutionActive",
  "arcaneInsightUsed",
  "mindOverMatterUsed",
  "doubleCastUsed",
  "spellEchoUsed",
  "arcaneSurgeUsed",
  "arcaneSurgeActive",
  "dualElementsUsed",
  "dualElementsActive",
  "overchannelUsed",
  "overchannelActive",
  "cataclysmUsed",
  "cataclysmActive",
  "masterOfMagicUsed",
  "masterOfMagicActive",
  "firestormUsed",
  "firestormActive",
  "worldfireUsed",
  "worldfireActive",
  "arcJumpUsed",
  "arcJumpActive",
  "stormAvatarUsed",
  "stormAvatarActive",
  "overloadUsed",
  "overloadActive",
  "arcaneCataclysmUsed",
  "arcaneCataclysmActive",
  "wildCastingUsedThisTurn",
  "perfectFocusUsed",
  "perfectFocusActive",
  "stillnessUsed",
  "innerReserveUsed",
  "transcendenceUsed",
  "transcendenceActive",
  "enlightenmentUsed",
  "enlightenmentActive",
  "pendingExtraTurn",
  "unbreakableLineUsed",
  "immovableBastionUsed",
  "immovableBastionActive",
  "eternalBastionUsed",
  "eternalBastionActive",
  "judgmentWallUsed",
  "judgmentWallActive",
  "crushingCounterActive",
  "sacredResolveUsed",
  "layOnHandsUsed",
  "divineChampionUsed",
  "divineChampionActive",
  "divineShelterUsed",
  "eternalOathUsed",
  "eternalOathActive",
  "judgmentBrandActive",
  "relentlessVengeanceUsed",
  "wrathIncarnateUsed",
  "wrathIncarnateActive",
  "psychicEchoUsed",
  "psionicRecoveryUsed",
  "trueSightUsed",
  "trueSightActive",
  "foresightUsed",
  "premonitionUsed",
  "perfectPredictionUsed",
  "perfectPredictionActive",
  "invisibleHandUsed",
  "gravityBreakUsed",
  "gravityBreakActive",
  "veteranGritUsed",
  "unbreakableUsed",
  "livingWallUsed",
  "livingWallActive",
  "godOfCarnageUsed",
  "godOfCarnageBonusAttackAvailable",
  "bloodlustStacks",
];

function populateAdminQaControls() {
  if (
    !elements.adminQaLevelSelect ||
    !elements.adminQaAddSelect ||
    !elements.adminQaClassSelect ||
    !elements.adminQaSubclassSelect ||
    !elements.adminQaEnemySelect ||
    !elements.adminQaEnemyLevelSelect
  ) return;
  if (!elements.adminQaLevelSelect.options.length) {
    for (let level = 1; level <= MAX_LEVEL; level += 1) {
      const option = document.createElement("option");
      option.value = String(level);
      option.textContent = `Level ${level}`;
      elements.adminQaLevelSelect.append(option);
    }
  }
  if (!elements.adminQaEnemyLevelSelect.options.length) {
    for (let level = 1; level <= MAX_LEVEL; level += 1) {
      const option = document.createElement("option");
      option.value = String(level);
      option.textContent = `Level ${level}`;
      elements.adminQaEnemyLevelSelect.append(option);
    }
  }
  if (!elements.adminQaClassSelect.options.length) {
    playableClassIds.forEach((classId) => {
      const option = document.createElement("option");
      option.value = classId;
      option.textContent = adminQaClassLabels[classId] ?? classes[classId]?.name ?? titleCase(classId);
      elements.adminQaClassSelect.append(option);
    });
  }
  if (!elements.adminQaEnemySelect.options.length) {
    Object.values(enemyTemplates).forEach((enemy) => {
      const option = document.createElement("option");
      option.value = enemy.id;
      option.textContent = enemy.name;
      elements.adminQaEnemySelect.append(option);
    });
  }
  [elements.adminQaPlayerStatusSelect, elements.adminQaEnemyStatusSelect].forEach((select) => {
    if (!select || select.options.length) return;
    adminQaStatusIds.forEach((statusId) => {
      const option = document.createElement("option");
      option.value = statusId;
      option.textContent = statusDefinitions[statusId]?.name ?? titleCase(statusId);
      select.append(option);
    });
  });
  if (!elements.adminQaAddSelect.options.length) {
    const consumableGroup = document.createElement("optgroup");
    consumableGroup.label = "Consumables";
    Object.values(consumableItems).forEach((item) => {
      const option = document.createElement("option");
      option.value = `item:${item.id}`;
      option.textContent = item.name;
      consumableGroup.append(option);
    });
    const weaponGroup = document.createElement("optgroup");
    weaponGroup.label = "Weapons";
    Object.values(weapons).forEach((weapon) => {
      const option = document.createElement("option");
      option.value = `weapon:${weapon.id}`;
      option.textContent = weapon.name;
      weaponGroup.append(option);
    });
    elements.adminQaAddSelect.append(consumableGroup, weaponGroup);
  }
}

function getDefaultSubclassId(classId) {
  return Object.keys(subclasses[classId] ?? {})[0] ?? null;
}

function updateAdminQaSubclassOptions(classId, selectedSubclassId = null) {
  if (!elements.adminQaSubclassSelect) return;
  const availableSubclasses = Object.values(subclasses[classId] ?? {});
  elements.adminQaSubclassSelect.innerHTML = "";
  availableSubclasses.forEach((subclass) => {
    const option = document.createElement("option");
    option.value = subclass.id;
    option.textContent = subclass.name;
    elements.adminQaSubclassSelect.append(option);
  });
  const fallbackSubclassId = selectedSubclassId && subclasses[classId]?.[selectedSubclassId] ? selectedSubclassId : getDefaultSubclassId(classId);
  if (fallbackSubclassId) elements.adminQaSubclassSelect.value = fallbackSubclassId;
}

function renderAdminQaPanel() {
  const visible = isAdminQaUser() && !!state.player;
  if (!elements.adminQaPanel) return;
  elements.adminQaPanel.hidden = !visible;
  elements.combatLayout?.classList.toggle("admin-qa-active", visible);
  if (!visible) return;
  populateAdminQaControls();
  elements.adminQaLevelSelect.value = String(clamp(state.player.level ?? 1, 1, MAX_LEVEL));
  elements.adminQaEnemyLevelSelect.value = String(clamp(state.enemy?.level ?? state.player.level ?? 1, 1, MAX_LEVEL));
  const classId = normalizeClassId(state.player.classDef?.id, "warrior");
  elements.adminQaClassSelect.value = classId;
  updateAdminQaSubclassOptions(classId, state.player.subclassId);
  renderAdminQaOverrideStatus();
  renderAdminFeatureInspector();
}

function renderAdminQaOverrideStatus() {
  if (!elements.adminQaOverrideStatus) return;
  if (!isAdminQaUser() || !state.player) {
    elements.adminQaOverrideStatus.textContent = "";
    return;
  }
  const pending = [];
  if (Number.isInteger(state.adminForcedD20)) pending.push(`next d20 = ${state.adminForcedD20}`);
  if (state.adminForcedStatusRoll?.mode === "success") pending.push("next status roll = success");
  if (state.adminForcedStatusRoll?.mode === "fail") pending.push("next status roll = fail");
  if (state.adminForcedStatusRoll?.mode === "custom") pending.push(`next status roll = ${state.adminForcedStatusRoll.value}`);
  if (state.adminForcedDamageRoll === "min") pending.push("next damage = min");
  if (state.adminForcedDamageRoll === "max") pending.push("next damage = max");
  elements.adminQaOverrideStatus.textContent = pending.length ? `Pending overrides: ${pending.join("; ")}.` : "No pending QA overrides.";
}

function forceAdminQaD20(value) {
  if (!isAdminQaUser() || !state.player) return;
  const forced = clamp(Number.parseInt(value, 10) || 1, 1, 20);
  state.adminForcedD20 = forced;
  addLog(`Admin QA: next d20 forced to ${forced}.`);
  renderAdminQaOverrideStatus();
}

function forceAdminQaCustomD20() {
  forceAdminQaD20(elements.adminQaD20CustomInput?.value);
}

function forceAdminQaStatusRoll(mode, value = null) {
  if (!isAdminQaUser() || !state.player) return;
  if (mode === "success" || mode === "fail") {
    state.adminForcedStatusRoll = { mode };
    addLog(`Admin QA: next status roll forced to ${mode}.`);
  } else {
    const forced = clamp(Number.parseInt(value, 10) || 1, 1, 100);
    state.adminForcedStatusRoll = { mode: "custom", value: forced };
    addLog(`Admin QA: next status roll forced to ${forced}.`);
  }
  renderAdminQaOverrideStatus();
}

function forceAdminQaCustomStatusRoll() {
  forceAdminQaStatusRoll("custom", elements.adminQaStatusCustomInput?.value);
}

function forceAdminQaDamageRoll(mode) {
  if (!isAdminQaUser() || !state.player) return;
  state.adminForcedDamageRoll = mode === "max" ? "max" : "min";
  addLog(`Admin QA: next damage roll forced to ${state.adminForcedDamageRoll}.`);
  renderAdminQaOverrideStatus();
}

function clearAdminQaOverrides() {
  if (!isAdminQaUser()) return;
  state.adminForcedD20 = null;
  state.adminForcedStatusRoll = null;
  state.adminForcedDamageRoll = null;
  addLog("Admin QA overrides cleared.");
  renderAdminQaOverrideStatus();
}

function getAdminStateLabel() {
  if (!state.player) return "No character";
  if (state.gameState === GAME_STATES.inCombat) return "In combat";
  if (state.gameState === GAME_STATES.betweenBattles) return "Between battles";
  if (state.gameState === GAME_STATES.victory) return "Victory";
  if (state.gameState === GAME_STATES.defeat || (state.player.hp ?? 0) <= 0) return "Defeated";
  if (state.gameState === GAME_STATES.characterCreation) return "Character creation";
  return titleCase(state.gameState ?? "unknown");
}

function getAdminFeatureState(featureId) {
  const activeKey = `${featureId}Active`;
  const usedKey = `${featureId}Used`;
  if (Object.prototype.hasOwnProperty.call(state, activeKey) && state[activeKey]) return "active";
  if (Object.prototype.hasOwnProperty.call(state, usedKey)) return state[usedKey] ? "used" : "available";
  return "active";
}

function getAdminActiveFeatureEntries(player) {
  const classId = normalizeClassId(player?.classDef?.id, "");
  const subclassId = player?.subclassId;
  const level = clamp(player?.level ?? 1, 1, MAX_LEVEL);
  const entries = [];
  getCodexFeatureEntries(classFeatures[classId]?.core).forEach(({ level: featureLevel, feature }) => {
    if (featureLevel <= level) {
      entries.push({ level: featureLevel, type: "Class", feature, state: getAdminFeatureState(feature.id) });
    }
  });
  getCodexFeatureEntries(classFeatures[classId]?.[subclassId]).forEach(({ level: featureLevel, feature }) => {
    if (featureLevel <= level) {
      entries.push({ level: featureLevel, type: subclasses[classId]?.[subclassId]?.name ?? "Subclass", feature, state: getAdminFeatureState(feature.id) });
    }
  });
  return entries.sort((a, b) => a.level - b.level || a.type.localeCompare(b.type));
}

function getAdminSkillEntries(player) {
  return getPlayerSkills().map((skill) => {
    const availability = canUseSkill(player, skill);
    const actionType = getSkillActionType(skill) ?? skill.actionType ?? "modifier";
    const actionGate = actionType === "minor" ? "minor" : "major";
    const inCombat = state.gameState === GAME_STATES.inCombat;
    const playerTurn = currentCombatant()?.id === "player" && !state.isResolvingEnemyTurn && !state.winner;
    const actionAvailable = !inCombat || !playerTurn ? true : actionGate === "minor" ? canUseMinorAction() : canUseMajorAction();
    const usable = availability.usable && actionAvailable;
    const actionReason = !actionAvailable ? `Need an available ${titleCase(actionGate)} action.` : "";
    return {
      skill,
      actionType,
      resourceCost: getEffectiveSkillResourceCost(player, skill),
      cooldownRemaining: availability.cooldownRemaining ?? getSkillCooldownRemaining(player, skill.id),
      usable,
      reason: availability.reason || actionReason || "Ready",
    };
  });
}

function getAdminCombatFlagEntries() {
  return adminFeatureFlagIds
    .filter((flagId) => Object.prototype.hasOwnProperty.call(state, flagId))
    .map((flagId) => ({ id: flagId, value: state[flagId] }));
}

function formatAdminStatusText(combatant) {
  if (!combatant?.statuses?.length) return "None";
  return combatant.statuses
    .map((status) => {
      const name = statusDefinitions[status.id]?.name ?? titleCase(status.id);
      return status.duration > 0 ? `${name} (${status.duration})` : name;
    })
    .join(", ");
}

function getAdminImmunityNames(combatant) {
  if (!combatant) return [];
  return Object.keys(statusDefinitions)
    .filter((statusId) => isStatusImmune(combatant, statusId))
    .map((statusId) => statusDefinitions[statusId]?.name ?? titleCase(statusId));
}

function getAdminDamageReductionNotes(player) {
  if (!player) return [];
  const notes = [];
  const flatReductions = [
    ["Class", getClassDamageReduction(player)],
    ["Status", getStatusDamageReduction(player)],
    ["Shield Mastery", getShieldMasteryReduction(player)],
    ["Fortress Stance", getFortressStanceReduction(player)],
    ["Shield Wall", getShieldWallReduction(player)],
    ["Reinforced Guard", getReinforcedGuardReduction(player)],
    ["Fortress Heart", getFortressHeartReduction(player)],
    ["Last Stand", getGuardianLastStandReduction(player)],
    ["Heavy Momentum", getHeavyMomentumReduction(player)],
    ["Aura of Protection", getAuraOfProtectionReduction(player)],
  ];
  flatReductions.forEach(([label, value]) => {
    if (value > 0) notes.push(`${label}: -${value}`);
  });
  if (isGuardianBulwark(player, 15)) notes.push("Mountain Stance: -25% after flat reductions");
  if (state.immovableBastionActive && isGuardianImmovableBastionActive(player)) notes.push("Immovable Bastion: -75% active");
  if (state.eternalBastionActive && isGuardianEternalBastionActive(player)) notes.push("Eternal Bastion: -75% active");
  if (state.eternalOathActive && isPaladinOathkeeper(player, 20)) notes.push("Eternal Oath: -50% active");
  if (state.livingWallActive && isLivingWallFeatureActive(player)) notes.push("Living Wall: -50% active");
  if (state.invisibleHandUsed && isMysticTelekinetic(player, 15)) notes.push("Invisible Hand: used this combat");
  return notes;
}

function getAdminDamageMultiplierNotes() {
  const activeDoubleFlags = [
    "deathmarkActive",
    "perfectExecutionActive",
    "cataclysmActive",
    "masterOfMagicActive",
    "overloadActive",
    "arcaneCataclysmActive",
    "worldfireActive",
    "stormAvatarActive",
    "divineChampionActive",
    "trueSightActive",
    "gravityBreakActive",
  ].filter((flagId) => state[flagId]);
  const notes = activeDoubleFlags.map((flagId) => `${flagId}: double damage active`);
  if (state.crushingCounterActive) notes.push("crushingCounterActive: next Guardian attack +25%");
  if (state.judgmentBrandActive) notes.push("judgmentBrandActive: next Paladin weapon attack +25%");
  if (!notes.length && hasActiveDoubleDamageEffect()) notes.push("A double-damage effect is active.");
  return notes;
}

function getAdminActionEconomyLines() {
  const turnOwner = currentCombatant()?.id ?? "none";
  return [
    `majorActionUsed: ${Boolean(state.majorActionUsed)}`,
    `minorActionsUsed: ${state.minorActionsUsed ?? 0}`,
    `turn owner: ${turnOwner}`,
    `can use Major: ${canUseMajorAction()}`,
    `can use Minor: ${canUseMinorAction()}`,
  ];
}

function renderAdminList(items, emptyText = "None") {
  if (!items.length) return `<p class="muted">${escapeAttribute(emptyText)}</p>`;
  return `<ul class="admin-inspector-list">${items.map((item) => `<li>${escapeAttribute(item)}</li>`).join("")}</ul>`;
}

function renderAdminInspectorSection(title, bodyHtml) {
  return `<section class="admin-inspector-section"><h4>${escapeAttribute(title)}</h4>${bodyHtml}</section>`;
}

function buildAdminDebugSummaryText() {
  const player = state.player;
  if (!player) return "No active character.";
  const classId = normalizeClassId(player.classDef?.id, "");
  const className = classes[classId]?.name ?? titleCase(classId);
  const subclassName = subclasses[classId]?.[player.subclassId]?.name ?? "None";
  const features = getAdminActiveFeatureEntries(player).map((entry) => `Level ${entry.level} ${entry.feature.name} (${entry.type}) - ${entry.state}`);
  const flags = getAdminCombatFlagEntries().map((entry) => `${entry.id}: ${entry.value}`);
  const enemy = state.enemy ? `${state.enemy.name} L${state.enemy.level ?? "?"} HP ${state.enemy.hp}/${state.enemy.maxHp}` : "None";
  return [
    "Soulmarch Admin Debug Summary",
    `Character: ${player.name}`,
    `Class: ${className}`,
    `Subclass: ${subclassName}`,
    `Level: ${player.level}`,
    `XP: ${player.xp ?? 0}`,
    `State: ${getAdminStateLabel()}`,
    `Resources: HP ${player.hp}/${player.maxHp}, Mana ${player.mana}/${player.maxMana}, Stamina ${player.stamina}/${player.maxStamina}`,
    `Enemy: ${enemy}`,
    `Statuses: ${formatAdminStatusText(player)}`,
    `Enemy Statuses: ${formatAdminStatusText(state.enemy)}`,
    `Active Features:\n${features.length ? features.map((line) => `- ${line}`).join("\n") : "- None"}`,
    `Flags:\n${flags.length ? flags.map((line) => `- ${line}`).join("\n") : "- None"}`,
    `Action Economy:\n${getAdminActionEconomyLines().map((line) => `- ${line}`).join("\n")}`,
  ].join("\n");
}

function renderAdminFeatureInspector() {
  if (!elements.adminFeatureInspectorBody) return;
  if (!isAdminQaUser() || !state.player) {
    elements.adminFeatureInspectorBody.innerHTML = "";
    return;
  }
  const player = state.player;
  const classId = normalizeClassId(player.classDef?.id, "");
  const className = classes[classId]?.name ?? titleCase(classId);
  const subclassName = subclasses[classId]?.[player.subclassId]?.name ?? "None";
  const summary = [
    `Name: ${player.name}`,
    `Class: ${className}`,
    `Subclass: ${subclassName}`,
    `Level: ${player.level}`,
    `XP: ${player.xp ?? 0}`,
    `State: ${getAdminStateLabel()}`,
  ];
  const skillRows = getAdminSkillEntries(player).map(
    ({ skill, actionType, resourceCost, cooldownRemaining, usable, reason }) =>
      `${skill.name} (${skill.id}) - ${titleCase(actionType)}, ${resourceCost} ${resourceLabel(skill.resourceType)}, cooldown ${cooldownRemaining}; usable: ${usable}${reason && reason !== "Ready" ? ` (${reason})` : ""}`
  );
  const featureRows = getAdminActiveFeatureEntries(player).map(
    (entry) => `Level ${entry.level}: ${entry.feature.name} (${entry.type}) - ${entry.state}`
  );
  const flagRows = getAdminCombatFlagEntries().map((entry) => `${entry.id}: ${entry.value}`);
  const immunityNames = getAdminImmunityNames(player);
  const reductionNotes = getAdminDamageReductionNotes(player);
  const multiplierNotes = getAdminDamageMultiplierNotes();
  const statusRows = [
    `Player statuses: ${formatAdminStatusText(player)}`,
    `Enemy statuses: ${formatAdminStatusText(state.enemy)}`,
    `Immunities: ${immunityNames.length ? immunityNames.join(", ") : "None"}`,
    `Damage reductions: ${reductionNotes.length ? reductionNotes.join("; ") : "None"}`,
    `Damage multipliers: ${multiplierNotes.length ? multiplierNotes.join("; ") : "None"}`,
  ];
  elements.adminFeatureInspectorBody.innerHTML = [
    renderAdminInspectorSection("Character Summary", renderAdminList(summary)),
    renderAdminInspectorSection("Unlocked Skills", renderAdminList(skillRows)),
    renderAdminInspectorSection("Active Class Features", renderAdminList(featureRows)),
    renderAdminInspectorSection("Combat Flags", renderAdminList(flagRows)),
    renderAdminInspectorSection("Status / Immunity Info", renderAdminList(statusRows)),
    renderAdminInspectorSection("Action Economy State", renderAdminList(getAdminActionEconomyLines())),
  ].join("");
}

async function copyAdminDebugSummary() {
  if (!isAdminQaUser() || !state.player) return;
  const text = buildAdminDebugSummaryText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    if (elements.adminCopyDebugStatus) elements.adminCopyDebugStatus.textContent = "Debug summary copied.";
  } catch (error) {
    if (elements.adminCopyDebugStatus) elements.adminCopyDebugStatus.textContent = "Copy failed; debug summary printed to console.";
    console.info(text);
  }
}

function syncAdminQaLevelProgression(player, level, options = {}) {
  const earned = getEarnedProgressionThroughLevel(player, level, options);
  player.unlockedSkills = Array.from(earned.skills).filter((skillId) => skills[skillId]);
  player.upgradedSkills = Array.from(earned.upgrades).filter((upgradeId) => skillUpgrades[upgradeId]);
  player.unlockedFeatures = Array.from(earned.features);
  if (player.selectedSkillId && !player.unlockedSkills.includes(normalizeSkillId(player.selectedSkillId))) {
    player.selectedSkillId = null;
  }
}

function setAdminQaLevel() {
  if (!isAdminQaUser() || !state.player || !elements.adminQaLevelSelect) return;
  const targetLevel = clamp(Number.parseInt(elements.adminQaLevelSelect.value, 10) || 1, 1, MAX_LEVEL);
  const oldMaxHp = state.player.maxHp ?? calculateMaxHp(state.player.stats, state.player.level ?? targetLevel);
  const oldMaxMana = state.player.maxMana ?? calculateMaxMana(state.player.stats, state.player.level ?? targetLevel);
  const oldMaxStamina = state.player.maxStamina ?? calculateMaxStamina(state.player.stats, state.player.level ?? targetLevel);
  state.player.level = targetLevel;
  state.player.xp = getTotalXpForLevel(targetLevel);
  syncAdminQaLevelProgression(state.player, targetLevel, { includeChoiceOptions: true });
  recalculateHp(state.player, oldMaxHp);
  recalculateResources(state.player, oldMaxMana, oldMaxStamina);
  state.pendingLevelUps = 0;
  state.pendingLevelQueue = [];
  state.levelUpDraft = { stat: null, subclass: null, progressionChoice: null };
  elements.levelUpScreen.hidden = true;
  normalizePlayerProgression(state.player);
  addLog(`Admin QA set ${state.player.name} to level ${targetLevel}.`);
  renderCombat();
  void saveAdventure("admin qa level");
}

function getValidQaWeaponIdForClass(classId, currentWeaponId) {
  const validWeaponIds = getValidWeaponIdsForClass(classId);
  return currentWeaponId && validWeaponIds.includes(currentWeaponId) ? currentWeaponId : validWeaponIds[0] ?? "unarmed";
}

function rebuildAdminQaProgression() {
  if (!isAdminQaUser() || !state.player || !elements.adminQaClassSelect || !elements.adminQaSubclassSelect) return;
  const classId = normalizeClassId(elements.adminQaClassSelect.value, normalizeClassId(state.player.classDef?.id, "warrior"));
  const subclassId = subclasses[classId]?.[elements.adminQaSubclassSelect.value] ? elements.adminQaSubclassSelect.value : getDefaultSubclassId(classId);
  const level = clamp(state.player.level ?? 1, 1, MAX_LEVEL);
  const previousMaxHp = state.player.maxHp;
  const previousMaxMana = state.player.maxMana;
  const previousMaxStamina = state.player.maxStamina;
  state.player.classDef = classes[classId];
  state.player.subclassId = subclassId;
  const currentWeaponId = state.player.weapon?.id;
  const weaponId = getValidQaWeaponIdForClass(classId, currentWeaponId);
  const armorId = armors[state.player.armor?.id] ? state.player.armor.id : getClassArmorId(classId);
  state.player.weapon = weapons[weaponId] ?? weapons.unarmed;
  state.player.spell = state.player.weapon.attackKind === "spell" ? state.player.weapon : null;
  state.player.armor = armors[armorId] ?? armors[getClassArmorId(classId)] ?? armors.none;
  normalizePlayerInventory(state.player);
  if (!state.player.inventory.weapons.includes(weaponId)) state.player.inventory.weapons.push(weaponId);
  if (!state.player.inventory.armor.includes(state.player.armor.id)) state.player.inventory.armor.push(state.player.armor.id);
  syncAdminQaLevelProgression(state.player, level, { includeChoiceOptions: true });
  state.player.skillCooldowns = {};
  state.player.selectedSkillId = null;
  clearCombatStatuses(state.player, state.enemy);
  resetCombatFeatureFlags();
  resetPlayerTurnActions();
  recalculateHp(state.player, previousMaxHp);
  recalculateResources(state.player, previousMaxMana, previousMaxStamina);
  state.player.hp = state.player.maxHp;
  state.player.mana = state.player.maxMana;
  state.player.stamina = state.player.maxStamina;
  state.pendingLevelUps = 0;
  state.pendingLevelQueue = [];
  state.levelUpDraft = { stat: null, subclass: null, progressionChoice: null };
  elements.levelUpScreen.hidden = true;
  addLog(`Admin QA rebuilds ${state.player.name} as ${adminQaClassLabels[classId] ?? classes[classId]?.name ?? titleCase(classId)} / ${subclasses[classId]?.[subclassId]?.name ?? titleCase(subclassId ?? "")}.`);
  renderCombat();
  void saveAdventure("admin qa class");
}

function grantAdminQaGold(amount) {
  if (!isAdminQaUser() || !state.player) return;
  addCurrency(state.player.inventory, { gold: amount, silver: 0, copper: 0 });
  addLog(`Admin QA grants ${amount} gold.`);
  renderCombat();
  void saveAdventure("admin qa currency");
}

function resetAdminQaCombatState() {
  if (!isAdminQaUser() || !state.player) return;
  state.player.hp = state.player.maxHp;
  state.player.mana = state.player.maxMana;
  state.player.stamina = state.player.maxStamina;
  state.player.skillCooldowns = {};
  state.player.selectedSkillId = null;
  clearCombatStatuses(state.player, state.enemy);
  resetCombatFeatureFlags();
  resetPlayerTurnActions();
  addLog("Admin QA resets combat state.");
  renderCombat();
  void saveAdventure("admin qa reset");
}

function addAdminQaItem() {
  if (!isAdminQaUser() || !state.player || !elements.adminQaAddSelect) return;
  const [type, id] = String(elements.adminQaAddSelect.value ?? "").split(":");
  normalizePlayerInventory(state.player);
  if (type === "weapon" && weapons[id]) {
    if (!state.player.inventory.weapons.includes(id)) {
      state.player.inventory.weapons.push(id);
      addLog(`Admin QA adds ${weapons[id].name}.`);
    } else {
      addLog(`Admin QA: ${weapons[id].name} is already in inventory.`);
    }
  } else if (type === "item" && consumableItems[id]) {
    state.player.inventory.consumables[id] = (state.player.inventory.consumables[id] ?? 0) + 1;
    addLog(`Admin QA adds ${consumableItems[id].name}.`);
  }
  renderCombat();
  void saveAdventure("admin qa item");
}

function startAdminQaCombat() {
  if (!isAdminQaUser() || !state.player || !elements.adminQaEnemySelect || !elements.adminQaEnemyLevelSelect) return;
  const enemyTemplateId = elements.adminQaEnemySelect.value;
  const enemyLevel = clamp(Number.parseInt(elements.adminQaEnemyLevelSelect.value, 10) || state.player.level || 1, 1, MAX_LEVEL);
  state.enemy = createScaledEnemy(enemyLevel, enemyTemplateId);
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
  state.pendingLevelUps = 0;
  state.pendingLevelQueue = [];
  resetCombatFeatureFlags();
  state.lastRewards = [];
  elements.nextEncounterButton.hidden = true;
  rollInitiative();
  addLog(`Admin Combat QA starts ${state.enemy.name} level ${state.enemy.level}.`);
  addLog(`${state.enemy.name} Defense: ${getAcFormula(state.enemy)}.`);
  renderCombat();
  void saveAdventure("admin qa combat");
  maybeRunEnemyTurn();
}

function applyAdminQaStatus(target) {
  if (!isAdminQaUser() || !state.player) return;
  const combatant = target === "enemy" ? state.enemy : state.player;
  const select = target === "enemy" ? elements.adminQaEnemyStatusSelect : elements.adminQaPlayerStatusSelect;
  if (!combatant || !select?.value || !statusDefinitions[select.value]) return;
  applyStatus(combatant, select.value, "Admin Combat QA", state.player.level ?? 1, {
    sourceClassId: "adminQa",
    sourceCombatant: state.player,
  });
  renderCombat();
  void saveAdventure(`admin qa ${target} status`);
}

function setAdminQaPlayerResource(resource, value) {
  if (!isAdminQaUser() || !state.player) return;
  if (resource === "hp" && value === "full") state.player.hp = state.player.maxHp;
  if (resource === "hp" && value === "one") state.player.hp = Math.min(state.player.maxHp, 1);
  if (resource === "mana") state.player.mana = state.player.maxMana;
  if (resource === "stamina") state.player.stamina = state.player.maxStamina;
  renderCombat();
  void saveAdventure("admin qa resources");
}

function clearAdminQaStatuses() {
  if (!isAdminQaUser() || !state.player) return;
  clearCombatStatuses(state.player, state.enemy);
  addLog("Admin Combat QA clears statuses.");
  renderCombat();
  void saveAdventure("admin qa clear statuses");
}

function clearAdminQaCooldowns() {
  if (!isAdminQaUser() || !state.player) return;
  state.player.skillCooldowns = {};
  state.player.selectedSkillId = null;
  addLog("Admin Combat QA clears cooldowns.");
  renderCombat();
  void saveAdventure("admin qa clear cooldowns");
}

function resetAdminQaFlagsOnly() {
  if (!isAdminQaUser() || !state.player) return;
  resetCombatFeatureFlags();
  resetPlayerTurnActions();
  addLog("Admin Combat QA resets once-per-combat flags.");
  renderCombat();
  void saveAdventure("admin qa flags");
}

function setAdminQaEnemyHp(mode) {
  if (!isAdminQaUser() || !state.enemy) return;
  if (mode === "full") state.enemy.hp = state.enemy.maxHp;
  if (mode === "thirty") state.enemy.hp = Math.max(1, Math.floor(state.enemy.maxHp * 0.3));
  if (mode === "one") state.enemy.hp = Math.min(state.enemy.maxHp, 1);
  addLog(`Admin Combat QA sets ${state.enemy.name} HP to ${state.enemy.hp}.`);
  renderCombat();
  void saveAdventure("admin qa enemy hp");
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

function showItemInfoModal(itemDef) {
  if (!itemDef) return;
  elements.infoTitle.textContent = itemDef.name;
  elements.infoBody.innerHTML = `
    <div class="item-info-hero" aria-hidden="true">
      ${renderItemIcon(itemDef)}
    </div>
  `;
  String(formatItemInfoBody(itemDef))
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
  updateTopNavigation();
}

function hideCodexModal() {
  elements.codexModal.hidden = true;
  updateTopNavigation();
}

function showCharacterModal() {
  if (!state.player || !elements.characterModal) return;
  renderCharacterModal();
  elements.characterModal.hidden = false;
  updateTopNavigation();
}

function hideCharacterModal() {
  if (!elements.characterModal) return;
  elements.characterModal.hidden = true;
  updateTopNavigation();
}

function showInventoryModal() {
  if (!state.player || !elements.inventoryModal) return;
  renderInventory();
  elements.inventoryModal.hidden = false;
  updateTopNavigation();
}

function hideInventoryModal() {
  if (!elements.inventoryModal) return;
  elements.inventoryModal.hidden = true;
  updateTopNavigation();
}

function showDeleteAdventureModal(adventureId) {
  state.pendingDeleteAdventureId = adventureId;
  elements.deleteAdventureModal.hidden = false;
}

function hideDeleteAdventureModal() {
  state.pendingDeleteAdventureId = null;
  elements.deleteAdventureModal.hidden = true;
  elements.confirmDeleteAdventureButton.disabled = false;
}

async function confirmDeleteAdventure() {
  const adventureId = state.pendingDeleteAdventureId;
  if (!adventureId) return;
  elements.confirmDeleteAdventureButton.disabled = true;
  try {
    await apiRequest(`/api/adventures/${adventureId}`, { method: "DELETE" });
    hideDeleteAdventureModal();
    await refreshHub();
  } catch (error) {
    elements.confirmDeleteAdventureButton.disabled = false;
    elements.hubValidationText.textContent = error.message;
  }
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
    if (panel) panel.hidden = name !== tabName;
  });
  updateTopNavigation();
}

function showCharacterTab() {
  showCharacterModal();
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
  if (skill.id === "secondWind" && (player.hp ?? 0) >= (player.maxHp ?? 0)) {
    return {
      usable: false,
      reason: "Second Wind cannot be used at full HP.",
      cooldownRemaining,
    };
  }
  if (skill.id === "layOnHands") {
    if (state.layOnHandsUsed) {
      return { usable: false, reason: "Lay on Hands has already been used this combat.", cooldownRemaining };
    }
    if ((player.hp ?? 0) >= (player.maxHp ?? 0)) {
      return { usable: false, reason: "Lay on Hands cannot be used at full HP.", cooldownRemaining };
    }
  }
  const resourceType = skill.resourceType ?? null;
  const resourceCost = getEffectiveSkillResourceCost(player, skill);
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

function isMagicianSpellDisciplineActive(player) {
  return normalizeClassId(player?.classDef, "") === "magician" && (player?.level ?? 1) >= 13;
}

function isSpellDisciplineEligibleSkill(skill) {
  if (!skill || skill.resourceType !== "mana") return false;
  if (skill.attackKind === "spell") return true;
  const stat = String(skill.statUsed ?? skill.stat ?? "").toLowerCase();
  return stat === "soul";
}

function isMagicianSageManaEfficiencyActive(player) {
  return (
    normalizeClassId(player?.classDef, "") === "magician" &&
    player?.subclassId === "sage" &&
    (player?.level ?? 1) >= 7
  );
}

function isManaEfficiencyEligibleSkill(skill) {
  return skill?.resourceType === "mana" && skill?.attackKind === "spell";
}

function getAdjustedSkillResourceCost(player, skill) {
  const baseCost = skill?.resourceCost ?? 0;
  if (!skill?.resourceType || baseCost <= 0) return baseCost;
  let reduction = 0;
  if (isMagicianSpellDisciplineActive(player) && isSpellDisciplineEligibleSkill(skill)) {
    reduction += 1;
  }
  if (isMagicianSageManaEfficiencyActive(player) && isManaEfficiencyEligibleSkill(skill)) {
    reduction += 1;
  }
  return reduction > 0 ? Math.max(1, baseCost - reduction) : baseCost;
}

function getEffectiveSkillResourceCost(player, skill) {
  return getAdjustedSkillResourceCost(player, skill);
}

function spendSkillResource(player, skill) {
  const resourceCost = getEffectiveSkillResourceCost(player, skill);
  if (!skill.resourceType || !resourceCost) return;
  player[skill.resourceType] = Math.max(0, (player[skill.resourceType] ?? 0) - resourceCost);
  addLog(`${player.name} spends ${resourceCost} ${resourceLabel(skill.resourceType)} to use ${skill.name}.`);
}

function startSkillCooldown(player, skill) {
  const cooldownTurns = skill.cooldownTurns ?? 0;
  if (cooldownTurns <= 0) return;
  player.skillCooldowns[skill.id] = cooldownTurns;
  addLog(`${skill.name} enters cooldown for ${cooldownTurns} turn${cooldownTurns === 1 ? "" : "s"}.`);
}

function useSecondWindSkill(player) {
  const beforeHp = player.hp ?? 0;
  const healing = Math.ceil((player.maxHp ?? 0) * 0.2);
  player.hp = Math.min(player.maxHp ?? beforeHp, beforeHp + healing);
  const restored = player.hp - beforeHp;
  addLog(`${player.name} uses Second Wind and restores ${restored} HP.`);
}

function useVanishSkill(player, skill = skills.vanish) {
  const vanishDef = statusDefinitions.vanished;
  const defenseBonus = skill?.defenseBonus ?? vanishDef.defenseBonus ?? 3;
  const enemyHitPenalty = skill?.enemyHitPenalty ?? -1;
  const tooltip = `+${defenseBonus} Defense and enemies suffer ${enemyHitPenalty} to hit until your next turn.`;
  const upgraded = skill?.name === "Vanish+" || defenseBonus > (vanishDef.defenseBonus ?? 3) || enemyHitPenalty < -1;
  const existing = player.statuses.find((status) => status.id === "vanished");
  if (existing) {
    existing.duration = Math.max(existing.duration ?? 0, vanishDef.duration);
    existing.sourceLevel = Math.max(existing.sourceLevel ?? 1, player.level ?? 1);
    existing.defenseBonus = defenseBonus;
    existing.enemyHitPenalty = enemyHitPenalty;
    existing.tooltip = tooltip;
  } else {
    player.statuses.push({
      id: "vanished",
      duration: vanishDef.duration,
      sourceLevel: player.level ?? 1,
      defenseBonus,
      enemyHitPenalty,
      tooltip,
    });
  }
  addLog(upgraded ? `${player.name} vanishes completely into shadow.` : `${player.name} vanishes into shadow.`);
}

function clearVanishAtTurnStart(combatant) {
  if (!hasStatus(combatant, "vanished")) return;
  combatant.statuses = combatant.statuses.filter((status) => status.id !== "vanished");
  addLog(`Vanish fades from ${combatant.name}.`);
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

function getSkillBadgeText(skill, player = state.player) {
  const badges = [];
  const resourceCost = getEffectiveSkillResourceCost(player, skill);
  if (skill.resourceType && resourceCost > 0) {
    badges.push(`${skill.resourceType === "mana" ? "M" : "S"}${resourceCost}`);
  }
  if ((skill.cooldownTurns ?? 0) > 0) {
    badges.push(`CD${skill.cooldownTurns}`);
  }
  return badges.join(" ");
}

function getSkillActionDescription(skill) {
  if (!skill) return "Action: choose a skill.";
  if (skill.mode === "attack_modifier") return "Action: prepare this, then use Attack.";
  return `Action: ${titleCase(getSkillActionType(skill))} Action.`;
}

function getSkillTooltipText(skill, player, availability) {
  const resourceCost = getEffectiveSkillResourceCost(player, skill);
  const chanceLine = skill.status ? `\nStatus chance: ${formatStatusChanceText(skill, player)}` : "";
  return `${skill.description}\n${getSkillActionDescription(skill)}\nScaling stat: ${skill.statUsed}\nCost: ${
    skill.resourceType ? `${resourceCost} ${resourceLabel(skill.resourceType)}` : "None"
  }\nCooldown: ${skill.cooldownTurns ?? 0} turn${(skill.cooldownTurns ?? 0) === 1 ? "" : "s"}\nCurrent cooldown: ${
    availability.cooldownRemaining
  }${chanceLine}\nEffect: ${formatSkillEffect(skill, player)}${availability.reason ? `\nUnavailable: ${availability.reason}` : ""}`;
}

function renderSkills() {
  if (!elements.skillsList || !elements.skillInfoPanel || !state.player) return;
  const skillList = getPlayerSkills();
  const selected = getSelectedSkill();
  const playerTurnActive = state.gameState === GAME_STATES.inCombat && currentCombatant()?.id === "player" && !state.isResolvingEnemyTurn;
  elements.selectedSkillText.textContent = selected ? selected.name : "None";
  elements.clearSkillButton.hidden = !selected || !playerTurnActive;
  elements.skillsList.innerHTML = "";
  skillList.forEach((skill) => {
    const availability = canUseSkill(state.player, skill);
    const actionType = getSkillActionType(skill);
    const badgeText = getSkillBadgeText(skill, state.player);
    const actionAvailable =
      skill.mode === "attack_modifier" ? canUseMajorAction() : actionType === "major" ? canUseMajorAction() : canUseMinorAction();
    const button = document.createElement("button");
    button.type = "button";
    button.className = `skill-pill${state.player.selectedSkillId === skill.id ? " active" : ""}${availability.usable ? "" : " unavailable"}`;
    button.innerHTML = `<span>${skill.name}</span>${badgeText ? `<span class="skill-badge">${badgeText}</span>` : ""}${
      availability.cooldownRemaining > 0 ? `<span class="cooldown-badge">${availability.cooldownRemaining}</span>` : ""
    }`;
    button.dataset.skillId = skill.id;
    button.dataset.tooltip = getSkillTooltipText(skill, state.player, availability);
    button.disabled = !availability.usable || !playerTurnActive || !actionAvailable;
    button.addEventListener("click", () => selectSkill(skill.id));
    elements.skillsList.append(button);
  });
  elements.skillInfoPanel.innerHTML = selected
    ? `<strong>${selected.name}</strong>${selected.description} ${getSkillActionDescription(selected)} Scaling stat: ${selected.statUsed}. Cost: ${
        selected.resourceType ? `${getEffectiveSkillResourceCost(state.player, selected)} ${resourceLabel(selected.resourceType)}` : "None"
      }. Cooldown: ${selected.cooldownTurns ?? 0}. Effect: ${formatSkillEffect(selected, state.player)}.`
    : "Tap a skill to prepare it and read its details here.";
}

function renderCodexCards(entries, renderCard) {
  const grid = document.createElement("div");
  grid.className = "codex-grid";
  entries.forEach((entry) => grid.append(renderCard(entry)));
  return grid;
}

function stripMarkup(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function getCodexFallbackIcon(title) {
  const label = stripMarkup(title);
  return `<span class="codex-fallback-icon">${escapeAttribute((label.charAt(0) || "?").toUpperCase())}</span>`;
}

function renderCodexClassIcon(classId, label) {
  return `<span class="codex-class-icon-wrap">${renderClassIcon(classId, label)}</span>`;
}

function renderCodexEnemyIcon(templateId, enemyName) {
  const portrait = getEnemyPortrait(templateId);
  return `
    <span class="codex-enemy-icon" style="--enemy-portrait-accent:${portrait.accent}; --enemy-portrait-bg:${portrait.bg};">
      ${
        portrait.src
          ? `<img src="${portrait.src}" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false;"><span class="enemy-portrait-glyph" hidden>${ENEMY_PORTRAITS.default.icon}</span>`
          : `<span class="enemy-portrait-glyph">${portrait.icon}</span>`
      }
      <span class="sr-only">${escapeAttribute(enemyName ?? "Enemy")}</span>
    </span>
  `;
}

function renderCodexStatusIcon(statusId, status) {
  return `<span class="codex-status-icon"><span class="status-pill status-${status.color ?? "default"}">${status.name ?? titleCase(statusId)}</span></span>`;
}

function formatEnemyTierLabel(enemy) {
  const tier = enemyTierDefinitions[enemy.tier];
  const [minLevel, maxLevel] = enemy.levelRange ?? tier?.levelRange ?? [1, MAX_LEVEL];
  const typeLabel = enemy.enemyType === "boss" ? "Boss Trial" : "Standard";
  return `${tier?.name ?? `Tier ${enemy.tier ?? "?"}`} ${typeLabel} - Levels ${minLevel}-${maxLevel}`;
}

function formatEnemyTraitList(values) {
  return values?.length ? values.map((value) => titleCase(value)).join(", ") : "None";
}

function getEnemyNotableStatuses(enemy) {
  const statusIds = new Set();
  const weapon = weapons[enemy.weaponId];
  if (weapon?.status?.id) statusIds.add(weapon.status.id);
  return Array.from(statusIds).map((statusId) => statusDefinitions[statusId]?.name ?? titleCase(statusId));
}

function getEnemyWeaponDropNames(enemy) {
  return (enemy.loot?.weaponIds ?? [])
    .map((weaponId) => weapons[weaponId]?.name ?? titleCase(weaponId))
    .filter(Boolean);
}

function getCodexClassArmorLabel(classId) {
  const armorId = classArmorIds[classId] ?? "none";
  return armors[armorId]?.name ?? titleCase(armorId);
}

function getCodexSkillName(skillId) {
  return skills[skillId]?.name ?? formatProgressionNameFromId(skillId);
}

function getCodexSubclassNames(classId) {
  return Object.values(subclasses[classId] ?? {}).map((subclass) => subclass.name);
}

function getCodexClassSkillIds(classId) {
  const ids = new Set(classes[classId]?.skillIds ?? []);
  const levels = classSkillTrees[classId]?.levels ?? {};
  Object.values(levels).forEach((entry) => {
    (entry.skills ?? []).forEach((skillId) => ids.add(skillId));
    (entry.choice?.skills ?? []).forEach((skillId) => ids.add(skillId));
  });
  return [...ids];
}

function getCodexClassResourceStyle(classId) {
  const skillIds = getCodexClassSkillIds(classId);
  const resourceTypes = new Set(skillIds.map((skillId) => skills[skillId]?.resourceType).filter(Boolean));
  if (resourceTypes.has("mana") && resourceTypes.has("stamina")) return "Resource style: Mana and Stamina hybrid";
  if (resourceTypes.has("mana")) return "Resource style: Mana-focused";
  if (resourceTypes.has("stamina")) return "Resource style: Stamina-focused";
  if (classes[classId]?.hasSpells) return "Resource style: free-form spell utility";
  return "Resource style: weapon-first";
}

function getCodexFeatureEntries(featureGroup) {
  return Object.entries(featureGroup ?? {})
    .map(([level, feature]) => ({ level: Number(level), feature }))
    .filter((entry) => Number.isFinite(entry.level) && entry.feature)
    .sort((a, b) => a.level - b.level);
}

function getCodexClassProgressionSummary(classId) {
  const tree = classSkillTrees[classId]?.levels ?? {};
  const startingSkills = (tree[1]?.skills ?? []).map(getCodexSkillName);
  const levelTwoSkills = (tree[2]?.skills ?? []).map(getCodexSkillName);
  const coreFeatures = getCodexFeatureEntries(classFeatures[classId]?.core);
  const choiceLevels = Object.entries(tree)
    .filter(([, entry]) => entry.choice)
    .map(([level]) => Number(level))
    .filter((level) => Number.isFinite(level))
    .sort((a, b) => a - b);
  const summaries = [];

  if (startingSkills.length) summaries.push(`Starts with ${startingSkills.join(" and ")}.`);
  if (levelTwoSkills.length) summaries.push(`Early growth adds ${levelTwoSkills.join(", ")}.`);
  if (getCodexSubclassNames(classId).length) summaries.push("Subclass choice shapes the class identity and high-level tactics.");
  if (coreFeatures.length) {
    summaries.push(`Signature milestones: ${coreFeatures.map((entry) => `L${entry.level} ${entry.feature.name}`).join(", ")}.`);
  } else if (Object.keys(tree).length) {
    summaries.push("Progression adds new skills, upgrades, and stat increases over time.");
  }
  if (choiceLevels.length) summaries.push(`Choice levels: ${choiceLevels.map((level) => `L${level}`).join(", ")}.`);

  return summaries;
}

const codexSubclassRoleTags = {
  warrior: { berserker: "Aggressor", defender: "Protector" },
  rogue: { assassin: "Execution", scout: "Skirmisher" },
  magician: { elementalist: "Elemental", sage: "Scholar" },
  guardian: { bulwark: "Tank", sentinel: "Warden" },
  monk: { body: "Martial", soul: "Spiritual" },
  sorcerer: { pyromancer: "Blaster", stormcaller: "Storm" },
  paladin: { oathkeeper: "Vanguard", avenger: "Judgment" },
  mystic: { seer: "Psionic", telekinetic: "Force" },
};

function getCodexSubclassRoleTag(classId, subclassId) {
  return codexSubclassRoleTags[classId]?.[subclassId] ?? "Specialist";
}

function getCodexSubclassDescription(classId, subclassId) {
  return getSubclassPresentation(classId, subclassId).summary;
}

function getCodexSubclassSignature(classId, subclassId) {
  const featureEntries = getCodexFeatureEntries(classFeatures[classId]?.[subclassId]);
  if (featureEntries.length) {
    const firstFeature = featureEntries[0].feature;
    return `${firstFeature.name}: ${firstFeature.description}`;
  }
  const presentation = getSubclassPresentation(classId, subclassId);
  return presentation.features[0] ?? "A focused specialization for this class.";
}

function getCodexSubclassHighlights(classId, subclassId) {
  const featureEntries = getCodexFeatureEntries(classFeatures[classId]?.[subclassId]);
  if (featureEntries.length) {
    const highlights = featureEntries
      .slice(0, 4)
      .map((entry) => `Level ${entry.level}: ${entry.feature.name}.`);
    const capstone = featureEntries[featureEntries.length - 1];
    if (capstone?.level >= MAX_LEVEL) highlights.push(`Capstone: ${capstone.feature.name}.`);
    return highlights;
  }
  const presentation = getSubclassPresentation(classId, subclassId);
  return presentation.features.slice(0, 3).map((feature) => `Focus: ${feature}`);
}

const codexClassGuides = {
  guardian: {
    roleTag: "Tank",
    description: "An unyielding protector who turns pressure into control. Guardian play rewards patience, timing, and survival.",
    coreStyle: [
      "Absorb punishment while keeping the fight stable.",
      "Use Stamina skills to control tempo and protect yourself.",
      "Wins through endurance instead of explosive turns.",
      "Best for players who like defensive certainty.",
    ],
    mechanics: [
      { name: "Guarded", text: "Reduces incoming damage during dangerous turns." },
      { name: "Stun", text: "Can deny enemy action when control skills land." },
      { name: "Heavy Defense", text: "High armor and class protection keep you standing." },
    ],
  },
  warrior: {
    roleTag: "Martial",
    description: "A direct weapon master built around pressure, damage, and grit. Warriors turn one Major Action into repeated, punishing attacks.",
    coreStyle: [
      "Leans on Body, weapons, and Stamina.",
      "Basic Attack becomes stronger at key milestones.",
      "Weapon skills add control, burst, or survival tools.",
      "Subclasses choose fury or defense.",
    ],
    mechanics: [
      { name: "Extra Attack", text: "Basic Attack gains more strikes as Warrior levels rise." },
      { name: "Executioner", text: "Damages weakened enemies harder." },
      { name: "Veteran's Grit", text: "Can survive one lethal hit at higher levels." },
    ],
  },
  rogue: {
    roleTag: "Precision",
    description: "A precise striker who rewards timing and vulnerable targets. Stalkers thrive on openings, status effects, and critical pressure.",
    coreStyle: [
      "Uses Body for attacks with Mind-driven tricks.",
      "High value on the first hit of combat.",
      "Pairs weapon skills with Poison, Frozen, and other weaknesses.",
      "Subclasses choose assassination or skirmishing.",
    ],
    mechanics: [
      { name: "Sneak Attack", text: "First successful hit each combat deals bonus damage." },
      { name: "Exploit Weakness", text: "Punishes enemies suffering negative status effects." },
      { name: "Deathmark", text: "Marks one target for a doubled future hit." },
    ],
  },
  magician: {
    roleTag: "Caster",
    description: "A studied spellcaster who turns Soul and Mana into reliable arcane pressure. Magicians favor spell accuracy, shields, and elemental control.",
    coreStyle: [
      "Uses Soul-based spells and Mana management.",
      "Balances damage, control, and defensive wards.",
      "Unlocks stronger spell economy over time.",
      "Subclasses choose raw elements or disciplined study.",
    ],
    mechanics: [
      { name: "Empowered Casting", text: "Spells gain extra damage." },
      { name: "Double Cast", text: "Can repeat a standalone spell once per combat." },
      { name: "Mana Ward", text: "Adds defensive or resource utility." },
    ],
  },
  sorcerer: {
    roleTag: "Blaster",
    description: "A volatile channel for destructive power. Channelers hit hard, burn bright, and trust force over restraint.",
    coreStyle: [
      "Focuses on Soul-driven spell damage.",
      "Excels at elemental pressure and burst turns.",
      "Uses Mana carefully to avoid running dry.",
      "Subclasses lean into firepower or foresight.",
    ],
    mechanics: [
      { name: "Burn", text: "Damage over time from fire magic." },
      { name: "Frozen", text: "Control from cold and arcane pressure." },
      { name: "High Damage", text: "Trades stability for stronger spell turns." },
    ],
  },
  monk: {
    roleTag: "Hybrid",
    description: "A disciplined ascetic who blends motion, stamina, and inner force. Ascendants solve fights by staying fluid.",
    coreStyle: [
      "Mixes Body attacks with Soul discipline.",
      "Uses quick utility and defensive rhythm.",
      "Can stabilize or cleanse select status effects.",
      "Subclasses emphasize body or spirit.",
    ],
    mechanics: [
      { name: "Minor Utility", text: "Uses quick actions to recover or stabilize." },
      { name: "Status Control", text: "Can answer Bleed or Poison through discipline." },
      { name: "Hybrid Scaling", text: "Rewards spreading stats beyond one focus." },
    ],
  },
  paladin: {
    roleTag: "Hybrid",
    description: "A sworn warrior who blends weapon force with sacred utility. Justicars punish threats while keeping themselves battle-ready.",
    coreStyle: [
      "Combines Body weapons with Soul support.",
      "Uses Heavy armor and restorative tools.",
      "Controls status effects better than most martial classes.",
      "Subclasses choose protection or judgment.",
    ],
    mechanics: [
      { name: "Cleanse", text: "Can remove one negative status through class utility." },
      { name: "Smite", text: "Weapon attacks can carry radiant pressure." },
      { name: "Heavy Armor", text: "Built to survive while advancing." },
    ],
  },
  mystic: {
    roleTag: "Psionic",
    description: "A mind-focused psion who attacks will, perception, and control. Psions win by bending the shape of the encounter.",
    coreStyle: [
      "Uses Mind as the core action stat.",
      "Applies control and disruption through psionic pressure.",
      "Benefits from Soul or Body as secondary support.",
      "Subclasses choose foresight or force.",
    ],
    mechanics: [
      { name: "Mind Lance", text: "Psionic offense that can disrupt foes." },
      { name: "Mental Ward", text: "Defends against control and magical pressure." },
      { name: "Debuff Control", text: "Specializes in weakening enemy options." },
    ],
  },
};

const codexSubclassGuides = {
  warrior: {
    berserker: {
      roleTag: "Aggressor",
      description: "A fury path that turns risk into relentless attacks.",
      playstyle: ["Pushes damage through extra strikes.", "Builds momentum after hits.", "Accepts more incoming damage for pressure."],
      signature: "Frenzy adds another basic attack and makes the Berserker easier to hurt.",
    },
    defender: {
      roleTag: "Protector",
      description: "A shielded path that refuses to fall.",
      playstyle: ["Stacks flat damage reduction.", "Blocks Stun at higher level.", "Survives lethal hits through grit and discipline."],
      signature: "Shield Mastery and Fortress Stance steadily reduce incoming damage.",
    },
  },
  rogue: {
    assassin: {
      roleTag: "Execution",
      description: "A lethal opener built around decisive hits and critical pressure.",
      playstyle: ["Rewards first-hit accuracy.", "Stacks opening damage with critical tools.", "Prepares one devastating empowered hit at level 20."],
      signature: "Death's Opening and Assassinate turn the first successful hit into a major threat.",
    },
    scout: {
      roleTag: "Skirmisher",
      description: "A mobile stalker who reads the battlefield and slips out of danger.",
      playstyle: ["Improves first attacks each turn.", "Recovers Stamina during combat.", "Avoids or weakens incoming attacks."],
      signature: "Quick Read and Ghost Step keep the Scout evasive and accurate.",
    },
  },
  magician: {
    elementalist: {
      roleTag: "Elemental",
      description: "A destructive spell path focused on fire, ice, and lightning.",
      playstyle: ["Adds damage to elemental spells.", "Improves status pressure.", "Builds toward devastating one-combat spell turns."],
      signature: "Elemental Attunement turns elemental spells into the class's sharpest tools.",
    },
    sage: {
      roleTag: "Scholar",
      description: "A disciplined arcane path built around accuracy, economy, and control.",
      playstyle: ["Improves spell reliability.", "Reduces Mana pressure.", "Uses insight and focus to avoid bad turns."],
      signature: "Studied Casting and Perfect Focus make key spells far more dependable.",
    },
  },
  guardian: {
    bulwark: {
      roleTag: "Tank",
      description: "A fortress-minded Guardian who specializes in raw survival.",
      playstyle: ["Prioritizes protection.", "Rewards defensive turns.", "Turns long fights into an advantage."],
      signature: "Durability first, tempo second.",
    },
    sentinel: {
      roleTag: "Warden",
      description: "A watchful Guardian who controls enemy openings.",
      playstyle: ["Keeps pressure on the enemy.", "Pairs defense with disruption.", "Rewards steady tactical choices."],
      signature: "Defensive control with sharper battlefield awareness.",
    },
  },
  monk: {
    body: {
      roleTag: "Martial",
      description: "A physical discipline path for ascendants who master motion and impact.",
      playstyle: ["Leans on Body and Stamina.", "Uses martial rhythm.", "Stays mobile while trading blows."],
      signature: "Body discipline turns movement into offense and resilience.",
    },
    soul: {
      roleTag: "Spiritual",
      description: "A centered discipline path that draws strength from inner force.",
      playstyle: ["Leans on Soul utility.", "Stabilizes through focus.", "Mixes defense with spiritual pressure."],
      signature: "Soul discipline keeps the Ascendant balanced under pressure.",
    },
  },
  sorcerer: {
    pyromancer: {
      roleTag: "Blaster",
      description: "A fire-forward channeler who solves problems by burning through them.",
      playstyle: ["Prioritizes direct spell damage.", "Applies Burn pressure.", "Thrives in short, explosive fights."],
      signature: "Fire magic carries the strongest destructive identity.",
    },
    stormcaller: {
      roleTag: "Storm",
      description: "A lightning-focused channeler who turns control into explosive pressure.",
      playstyle: ["Improves lightning accuracy.", "Punishes Stun and Frozen openings.", "Builds toward decisive storm bursts."],
      signature: "Static Charge and Storm Avatar make lightning spells precise and dangerous.",
    },
  },
  paladin: {
    oathkeeper: {
      roleTag: "Vanguard",
      description: "A devoted justicar who protects through discipline and sacred resolve.",
      playstyle: ["Favors survival and support.", "Uses heavy armor well.", "Keeps status effects under control."],
      signature: "Oaths turn defense into a reliable battle plan.",
    },
    avenger: {
      roleTag: "Judgment",
      description: "A punitive justicar who turns conviction into force.",
      playstyle: ["Leans toward weapon pressure.", "Punishes dangerous foes.", "Blends Soul power with martial impact."],
      signature: "Judgment makes every opening costly.",
    },
  },
  mystic: {
    seer: {
      roleTag: "Psionic",
      description: "A perceptive psion who wins through prediction and mental leverage.",
      playstyle: ["Reads enemy patterns.", "Supports control and debuffs.", "Rewards high Mind investment."],
      signature: "Insight turns the enemy's intent against them.",
    },
    telekinetic: {
      roleTag: "Force",
      description: "A force-wielding psion who turns thought into pressure.",
      playstyle: ["Uses psychic force defensively and offensively.", "Controls space through pressure.", "Pairs Mind with Body or Soul support."],
      signature: "Telekinetic force bends the battlefield without touching it.",
    },
  },
};

const codexHighlightLevels = new Set([3, 5, 7, 10, 13, 15, 17, 20]);

function escapeCodexText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function cleanCodexCopy(value) {
  return String(value ?? "")
    .replace(/\bRogue\b/g, "Stalker")
    .replace(/\brogue\b/g, "stalker")
    .replace(/\bSorcerer\b/g, "Channeler")
    .replace(/\bsorcerer\b/g, "channeler")
    .replace(/\bMonk\b/g, "Ascendant")
    .replace(/\bmonk\b/g, "ascendant")
    .replace(/\bPaladin\b/g, "Justicar")
    .replace(/\bpaladin\b/g, "justicar")
    .replace(/\bMystic\b/g, "Psion")
    .replace(/\bmystic\b/g, "psion")
    .replace(/\bMage\b/g, "Magician")
    .replace(/\bmage\b/g, "magician")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCodexCopy(value) {
  return escapeCodexText(cleanCodexCopy(value));
}

function getCodexClassGuide(classId) {
  const classDef = classes[classId] ?? {};
  return {
    roleTag: classDef.roleTag ?? codexClassGuides[classId]?.roleTag ?? "Class",
    description: codexClassGuides[classId]?.description ?? classDef.shortDescription ?? classDef.description ?? "",
    coreStyle: codexClassGuides[classId]?.coreStyle ?? [classDef.playstyle ?? "A focused adventuring class."],
    mechanics: codexClassGuides[classId]?.mechanics ?? [],
  };
}

function getCodexSubclassGuide(classId, subclassId) {
  const presentation = getSubclassPresentation(classId, subclassId);
  const guide = codexSubclassGuides[classId]?.[subclassId] ?? {};
  return {
    roleTag: guide.roleTag ?? getCodexSubclassRoleTag(classId, subclassId),
    description: guide.description ?? presentation.summary ?? "A focused subclass path.",
    playstyle: guide.playstyle ?? presentation.features?.slice(0, 3) ?? [],
    signature: guide.signature ?? getCodexSubclassSignature(classId, subclassId),
  };
}

function getCodexResourceStyle(classId) {
  return getCodexClassResourceStyle(classId).replace(/^Resource style:\s*/i, "");
}

function renderCodexBulletList(items) {
  const filtered = (items ?? []).filter(Boolean);
  if (!filtered.length) return "";
  return `<ul class="codex-guide-list">${filtered.map((item) => `<li>${formatCodexCopy(item)}</li>`).join("")}</ul>`;
}

function renderCodexMechanics(items) {
  const filtered = (items ?? []).filter(Boolean);
  if (!filtered.length) return "";
  return `<div class="codex-mechanic-grid">${filtered
    .map(
      (item) => `
        <div class="codex-mechanic">
          <strong>${formatCodexCopy(item.name)}</strong>
          <span>${formatCodexCopy(item.text)}</span>
        </div>
      `
    )
    .join("")}</div>`;
}

function formatCodexProgressionItem(entry, item) {
  const description = item.description ? ` - ${item.description}` : "";
  return `<li><strong>Level ${entry.level}</strong><span>${formatCodexCopy(`${item.name}${description}`)}</span></li>`;
}

function getCodexProgressionHighlightEntries(classId) {
  return getClassProgressionEntries(classId)
    .filter((entry) => codexHighlightLevels.has(entry.level) || entry.items.some((item) => /Subclass|Choice|Capstone/i.test(item.name)))
    .slice(0, 8);
}

function renderCodexProgressionList(entries, limitItems = 2) {
  const lines = [];
  entries.forEach((entry) => {
    entry.items.slice(0, limitItems).forEach((item) => lines.push(formatCodexProgressionItem(entry, item)));
  });
  return lines.length ? `<ol class="codex-progression-list">${lines.join("")}</ol>` : `<p class="muted">Progression details are not yet listed.</p>`;
}

function renderCodexFullProgression(classId) {
  const entries = getClassProgressionEntries(classId);
  return `
    <details class="codex-expand">
      <summary>View Full Progression</summary>
      ${renderCodexProgressionList(entries, 99)}
    </details>
  `;
}

function renderCodexSubclassList(classId) {
  const entries = Object.values(subclasses[classId] ?? {});
  if (!entries.length) return `<p class="muted">No subclasses listed yet.</p>`;
  return `<div class="codex-subclass-lines">${entries
    .map((subclass) => {
      const guide = getCodexSubclassGuide(classId, subclass.id);
      return `<div><strong>${formatCodexCopy(subclass.name)}</strong><span>${formatCodexCopy(guide.description)}</span></div>`;
    })
    .join("")}</div>`;
}

function renderCodexSubclassFeatureList(classId, subclassId, full = false) {
  const features = getCodexFeatureEntries(classFeatures[classId]?.[subclassId]);
  if (!features.length) return renderCodexBulletList(getCodexSubclassHighlights(classId, subclassId));
  const selected = full ? features : features.filter((entry) => codexHighlightLevels.has(entry.level)).slice(0, 5);
  return `<ol class="codex-progression-list">${selected
    .map((entry) => `<li><strong>Level ${entry.level}</strong><span>${formatCodexCopy(`${entry.feature.name} - ${entry.feature.description ?? ""}`)}</span></li>`)
    .join("")}</ol>`;
}

function renderCodexSubclassKeyFeatures(classId, subclassId) {
  const features = getCodexFeatureEntries(classFeatures[classId]?.[subclassId]);
  if (!features.length) return renderCodexBulletList(getCodexSubclassHighlights(classId, subclassId));
  return renderCodexBulletList(
    features.slice(0, 4).map((entry) => `${entry.feature.name} - ${entry.feature.description ?? ""}`)
  );
}

function renderCodexSubclassFullProgression(classId, subclassId) {
  const features = getCodexFeatureEntries(classFeatures[classId]?.[subclassId]);
  if (!features.length) return "";
  return `
    <details class="codex-expand">
      <summary>View Full Progression</summary>
      ${renderCodexSubclassFeatureList(classId, subclassId, true)}
    </details>
  `;
}

function createCodexGuideCard({ title, meta, description, iconMarkup, sections, detailsMarkup = "", extraClass = "" }) {
  const card = document.createElement("section");
  card.className = `codex-card codex-guide-card${extraClass ? ` ${extraClass}` : ""}`;
  const sectionMarkup = (sections ?? [])
    .filter((section) => section?.content)
    .map(
      (section) => `
        <div class="codex-guide-section">
          <h4>${formatCodexCopy(section.title)}</h4>
          ${section.content}
        </div>
      `
    )
    .join("");
  card.innerHTML = `
    <div class="codex-guide-hero">
      <div class="codex-card-icon codex-guide-icon">${iconMarkup || getCodexFallbackIcon(title)}</div>
      <div class="codex-guide-title">
        <h3>${formatCodexCopy(title)}</h3>
        ${meta ? `<div class="codex-guide-meta">${formatCodexCopy(meta)}</div>` : ""}
      </div>
    </div>
    ${description ? `<p class="codex-guide-description">${formatCodexCopy(description)}</p>` : ""}
    ${sectionMarkup}
    ${detailsMarkup}
  `;
  return card;
}

function renderCodexClassCards() {
  const grid = document.createElement("div");
  grid.className = "codex-grid codex-guide-grid";
  playableClassIds.forEach((classId) => {
    const classDef = classes[classId];
    if (!classDef) return;
    const guide = getCodexClassGuide(classId);
    grid.append(
      createCodexGuideCard({
        title: classDef.name,
        meta: `${guide.roleTag} | ${getCodexClassArmorLabel(classId)}`,
        description: guide.description,
        iconMarkup: renderCodexClassIcon(classId, classDef.name),
        sections: [
          { title: "Core Style", content: renderCodexBulletList(guide.coreStyle) },
          { title: "Resource Style", content: `<p class="codex-signature">${formatCodexCopy(getCodexResourceStyle(classId))}</p>` },
          { title: "Key Mechanics", content: renderCodexMechanics(guide.mechanics) },
          { title: "Subclasses", content: renderCodexSubclassList(classId) },
          { title: "Progression Highlights", content: renderCodexProgressionList(getCodexProgressionHighlightEntries(classId)) },
        ],
        detailsMarkup: renderCodexFullProgression(classId),
      })
    );
  });
  return grid;
}

function renderCodexSubclassCards() {
  const grid = document.createElement("div");
  grid.className = "codex-grid codex-guide-grid";
  Object.entries(subclasses).forEach(([classId, group]) => {
    Object.values(group).forEach((subclass) => {
      const guide = getCodexSubclassGuide(classId, subclass.id);
      grid.append(
        createCodexGuideCard({
          title: subclass.name,
          meta: `${classes[classId]?.name ?? titleCase(classId)} | ${guide.roleTag}`,
          description: guide.description,
          iconMarkup: renderCodexClassIcon(classId, classes[classId]?.name ?? classId),
          sections: [
            { title: "Playstyle", content: renderCodexBulletList(guide.playstyle) },
            { title: "Signature Mechanic", content: `<p class="codex-signature">${formatCodexCopy(guide.signature)}</p>` },
            { title: "Key Features", content: renderCodexSubclassKeyFeatures(classId, subclass.id) },
            { title: "Progression Highlights", content: renderCodexSubclassFeatureList(classId, subclass.id) },
          ],
          detailsMarkup: renderCodexSubclassFullProgression(classId, subclass.id),
          extraClass: "codex-subclass-guide-card",
        })
      );
    });
  });
  return grid;
}

function createCodexCard(title, subtitle, description, chips = [], bullets = [], iconMarkup = "") {
  const card = document.createElement("section");
  card.className = "codex-card";
  const chipMarkup = chips.map((chip) => `<span class="codex-chip">${chip}</span>`).join("");
  const bulletMarkup = bullets.map((bullet) => `<li>${bullet}</li>`).join("");
  card.innerHTML = `
    <div class="codex-card-main">
      <div class="codex-card-icon">${iconMarkup || getCodexFallbackIcon(title)}</div>
      <div class="codex-card-content">
        <div class="codex-card-header">
          <h3>${title}</h3>
          ${subtitle ? `<span class="muted">${subtitle}</span>` : ""}
        </div>
        ${description ? `<p>${description}</p>` : ""}
        ${chipMarkup ? `<div class="codex-chip-row">${chipMarkup}</div>` : ""}
        ${bulletMarkup ? `<ul class="codex-list">${bulletMarkup}</ul>` : ""}
      </div>
    </div>
  `;
  return card;
}

function renderCodex() {
  if (!elements.codexList) return;
  elements.codexList.innerHTML = "";
  const nav = document.createElement("div");
  nav.className = "subtabs";
  const sections = ["classes", "subclasses", "weapons", "armor", "enemies", "items", "status"];
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
    content = renderCodexClassCards();
  } else if (state.activeCodexSection === "subclasses") {
    content = renderCodexSubclassCards();
  } else if (state.activeCodexSection === "weapons") {
    content = renderCodexCards(
        Object.values(weapons).filter((weapon) => !["crudeBlade", "bite", "boneClaw", "emberBolt", "rustySword"].includes(weapon.id)),
        (weapon) =>
          createCodexCard(
            weapon.name,
            `${formatDice(weapon.damageDice)} ${weapon.damageType}`,
            weapon.special,
            [`Stat: ${titleCase(weapon.stat)}`, `Type: ${weapon.attackKind}`],
            [],
            renderWeaponImage(weapon.id, weapon.name, { compact: true, showName: false, size: "lg" })
          )
    );
  } else if (state.activeCodexSection === "armor") {
    content = renderCodexCards(Object.values(armors), (armor) =>
      createCodexCard(
        armor.name,
        `Defense ${signed(armor.acBonus)}`,
        Object.keys(armor.checkBonuses).length ? "Protective gear with check modifiers." : "Protective gear with no check modifier.",
        Object.entries(armor.checkBonuses).map(([stat, value]) => `${titleCase(stat)} ${signed(value)}`),
        [],
        renderArmorImage(armor.id, armor.name, { compact: true, showName: false, size: "lg" })
      )
    );
  } else if (state.activeCodexSection === "enemies") {
    content = renderCodexCards(Object.entries(enemyTemplates), ([templateId, enemy]) =>
      createCodexCard(
        enemy.name,
        formatEnemyTierLabel(enemy),
        enemy.description ?? `A foe with ${armors[enemy.armorId].name} and ${weapons[enemy.weaponId].name}.`,
        [
          `Resists: ${formatEnemyTraitList(enemy.resistances)}`,
          `Weak to: ${formatEnemyTraitList(enemy.weaknesses)}`,
          `Immune: ${formatEnemyTraitList(enemy.statusImmunities)}`,
          `Status pressure: ${getEnemyNotableStatuses(enemy).join(", ") || "None"}`,
        ],
        [
          `Defense style: ${armors[enemy.armorId]?.name ?? "No Armor"}`,
          `Possible drops: ${getEnemyWeaponDropNames(enemy).join(", ") || "None"}`,
          `Weapon drop chance: ${Math.round((enemy.loot?.weaponChance ?? 0) * 100)}%`,
        ],
        renderCodexEnemyIcon(templateId, enemy.name)
      )
    );
  } else if (state.activeCodexSection === "items") {
    content = renderCodexCards(
      [
        ...Object.values(consumableItems).map((item) => ({
          id: item.id,
          name: item.name,
          use: item.description,
          cost: formatCurrencyCompact(item.cost),
          type: "Consumable",
          icon: renderItemIcon(item),
        })),
        {
          name: "Inn Stay",
          use: "Restore HP, Mana, and Stamina, clear cooldowns, and remove temporary negative effects.",
          cost: formatCurrencyCompact(INN_PRICE),
          type: "Service",
          icon: getCodexFallbackIcon("Inn Stay"),
        },
      ],
      (item) => createCodexCard(item.name, `Cost: ${item.cost}`, item.use, [item.type], [], item.icon)
    );
  } else {
    content = renderCodexCards(Object.entries(statusDefinitions), ([statusId, status]) =>
      createCodexCard(status.name, "", describeStatus(status), [], [`Removal: ${formatStatusRemoval(statusId)}`], renderCodexStatusIcon(statusId, status))
    );
  }
  elements.codexList.append(content);
}

function describeStatus(status) {
  const parts = [status.tooltip];
  if (status.duration) {
    parts.push(`Usually lasts ${status.duration} turn${status.duration === 1 ? "" : "s"}`);
  }
  if (status.damage && status.tick) {
    parts.push(`${status.damage} damage at ${status.tick === "start" ? "the start" : status.tick === "afterAct" ? "after acting" : "the end"} of a turn`);
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
  effects.push(skill.mode === "attack_modifier" ? "Prepares your next Attack" : "Uses its own action");
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
  const endlessMotionBonus = getEndlessMotionFlurryDamageBonus(state.player, skill);
  if (endlessMotionBonus > 0) {
    addLog("Endless Motion extends the Flurry.");
  }

  return {
    skill,
    attack: {
      ...baseAttack,
      name: `${baseAttack.name} + ${skill.name}`,
      classId: skill.classId,
      sourceSkillId: skill.id,
      attackBonus: (baseAttack.attackBonus ?? 0) + (skill.hitBonus ?? 0),
      damageDice: skill.damageDice ?? baseAttack.damageDice,
      damageBonus: (baseAttack.damageBonus ?? 0) + (skill.damageBonus ?? 0) + endlessMotionBonus,
      damageType: skill.damageType ?? baseAttack.damageType,
      status: skill.statusEffect ?? baseAttack.status,
      statusSelf: skill.statusSelf ?? baseAttack.statusSelf,
      statusDurationBonus: skill.statusDurationBonus ?? 0,
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
  if (actionType === "major") {
    markMajorActionUsed(skill.name);
  } else {
    markMinorActionUsed(skill.name);
  }
  spendSkillResource(state.player, skill);
  startSkillCooldown(state.player, skill);

  if (skill.attackKind === "utility") {
    if (skill.id === "secondWind") {
      useSecondWindSkill(state.player);
      if (!state.winner) tickStatuses(state.player, "afterAct");
      finishPlayerAction();
      return;
    }
    if (skill.id === "vanish") {
      useVanishSkill(state.player, skill);
      if (!state.winner) tickStatuses(state.player, "afterAct");
      finishPlayerAction();
      return;
    }
    if (skill.id === "layOnHands") {
      useLayOnHandsSkill(state.player);
      if (!state.winner) tickStatuses(state.player, "afterAct");
      finishPlayerAction();
      return;
    }
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
      if (skill.id === "cleansingLight" || skill.id === "radiantWard") {
        applyCleansingLightHealing(state.player, skill);
      }
    }
    if (skill.statusSelf) {
      maybeApplyStatus(state.player, state.player, skill.statusSelf, skill.name, skill);
    }
    addLog(`${state.player.name} uses ${skill.name}.`);
    if (!state.winner) tickStatuses(state.player, "afterAct");
    finishPlayerAction();
    return;
  }

  const attack = buildStandaloneSkillAttack(skill);
  if (skill.id === "whirlwindCleave") {
    addLog(`${state.player.name} uses Whirlwind Cleave.`);
  }
  if (skill.id === "skullbreaker") {
    addLog(`${state.player.name} uses Skullbreaker.`);
  }
  if (skill.id === "cripplingCut") {
    addLog(`${state.player.name} uses Crippling Cut.`);
  }
  const ignoreResistance = consumeArcaneSurgeForSkill(state.player, skill);
  const firstSpellHit = resolveAttack(state.player, attack, { skill, followUp: true, ignoreResistance });
  if (shouldTriggerDoubleCast(state.player, skill)) {
    state.doubleCastUsed = true;
    if (!state.winner && living(state.enemy)) {
      addLog(`Double Cast triggers — ${state.player.name} casts the spell again.`);
      resolveAttack(state.player, attack, { skill, followUp: true, doubleCast: true });
    }
  }
  if (firstSpellHit && shouldTriggerChainCasting(state.player, skill) && !state.winner && living(state.enemy)) {
    addLog(`Chain Casting triggers — ${state.player.name} releases a second surge.`);
    resolveAttack(state.player, attack, { skill, followUp: true, chainCasting: true });
  }
  if (skill.statusSelf) {
    maybeApplyStatus(state.player, state.player, skill.statusSelf, skill.name, skill);
  }
  if (!state.winner) tickStatuses(state.player, "afterAct");
  finishPlayerAction();
}

function renderInitiative() {
  if (!elements.initiativeList) return;
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
  renderAdminQaPanel();

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
    const trial = getBlockedTierTrial(state.player);
    const finalTrialAvailable = (state.player?.level ?? 1) >= MAX_LEVEL;
    elements.turnText.textContent = "Between battles";
    elements.actionText.textContent = trial
      ? `Tier Trial required before reaching Tier ${trial.nextTier}.`
      : "Review rewards, use items, rest at the inn, or start the next battle.";
    if (elements.betweenBattleText) {
      elements.betweenBattleText.textContent = trial
        ? `Tier Trial required before reaching Tier ${trial.nextTier}. Defeat a Tier ${trial.tier} boss to continue leveling.`
        : finalTrialAvailable
          ? "You have reached max level. Normal battles remain available, or you can challenge a Final Trial."
          : "Recover, shop, and prepare before the next encounter.";
    }
    elements.majorActionStatus.textContent = "-";
    elements.minorActionStatus.textContent = "-";
    setActionButtons(true);
    updateInnButtonState();
    elements.nextEncounterButton.hidden = false;
    elements.nextEncounterButton.disabled = state.pendingLevelUps > 0 || Boolean(trial);
    if (elements.tierTrialButton) {
      elements.tierTrialButton.hidden = !trial;
      elements.tierTrialButton.disabled = state.pendingLevelUps > 0 || !trial;
    }
    if (elements.finalTrialButton) {
      elements.finalTrialButton.hidden = !finalTrialAvailable || Boolean(trial);
      elements.finalTrialButton.disabled = state.pendingLevelUps > 0 || !finalTrialAvailable;
    }
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
  const minorActionAvailable = playerTurnActive && canUseMinorAction();
  const recoverTarget = getRecoverTarget(state.player);
  const negativeStatuses = getNegativeStatuses(state.player);
  elements.recoverButton.disabled = !minorActionAvailable || !recoverTarget;
  elements.recoverButton.title = recoverTarget ? `Minor Action: restore ${recoverTarget.label}.` : "HP, Mana, and Stamina are full.";
  elements.focusButton.disabled = !minorActionAvailable;
  elements.focusButton.title = "Minor Action: gain +1 to the next roll.";
  elements.shakeOffButton.disabled = !minorActionAvailable || !negativeStatuses.length;
  elements.shakeOffButton.title = negativeStatuses.length ? "Minor Action: attempt to remove one negative status." : "No negative status effects to remove.";
  const hasDeathmark = isRogueDeathmarkFeatureActive(state.player);
  elements.deathmarkButton.hidden = !hasDeathmark;
  elements.deathmarkButton.disabled = !minorActionAvailable || state.deathmarkUsed || state.deathmarkActive || state.perfectExecutionActive || !living(state.enemy);
  elements.deathmarkButton.title = state.perfectExecutionActive
    ? "Perfect Execution is already active."
    : state.deathmarkActive
      ? "Deathmark is already active."
      : state.deathmarkUsed
        ? "Deathmark has already been used this combat."
        : "Minor Action: mark the enemy. Your next successful hit doubles final damage.";
  const hasPerfectExecution = isAssassinPerfectExecutionFeatureActive(state.player);
  elements.perfectExecutionButton.hidden = !hasPerfectExecution;
  elements.perfectExecutionButton.disabled = !minorActionAvailable || state.perfectExecutionUsed || state.perfectExecutionActive || state.deathmarkActive || !living(state.enemy);
  elements.perfectExecutionButton.title = state.deathmarkActive
    ? "Deathmark is already active."
    : state.perfectExecutionActive
      ? "Perfect Execution is already active."
      : state.perfectExecutionUsed
        ? "Perfect Execution has already been used this combat."
        : "Minor Action: your next successful hit doubles final damage.";
  const hasArcaneSurge = isMagicianArcaneSurgeFeatureActive(state.player);
  elements.arcaneSurgeButton.hidden = !hasArcaneSurge;
  elements.arcaneSurgeButton.disabled = !minorActionAvailable || state.arcaneSurgeUsed || state.arcaneSurgeActive || !living(state.enemy);
  elements.arcaneSurgeButton.title = state.arcaneSurgeActive
    ? "Arcane Surge is already active."
    : state.arcaneSurgeUsed
      ? "Arcane Surge has already been used this combat."
      : "Minor Action: your next standalone spell ignores enemy resistance.";
  const hasDualElements = isMagicianDualElementsFeatureActive(state.player);
  elements.dualElementsButton.hidden = !hasDualElements;
  elements.dualElementsButton.disabled = !minorActionAvailable || state.dualElementsUsed || state.dualElementsActive || !living(state.enemy);
  elements.dualElementsButton.title = state.dualElementsActive
    ? "Dual Elements is already active."
    : state.dualElementsUsed
      ? "Dual Elements has already been used this combat."
      : "Minor Action: your next successful standalone elemental spell attempts a second status.";
  const hasOverchannel = isMagicianOverchannelFeatureActive(state.player);
  elements.overchannelButton.hidden = !hasOverchannel;
  elements.overchannelButton.disabled = !minorActionAvailable || state.overchannelUsed || state.overchannelActive || state.cataclysmActive || state.masterOfMagicActive || !living(state.enemy);
  elements.overchannelButton.title = state.overchannelActive
    ? "Overchannel is already active."
    : state.cataclysmActive || state.masterOfMagicActive
      ? "Another spell empowerment is already active."
    : state.overchannelUsed
      ? "Overchannel has already been used this combat."
      : "Minor Action: your next successful standalone spell deals +50% final damage.";
  const hasCataclysm = isMagicianCataclysmFeatureActive(state.player);
  elements.cataclysmButton.hidden = !hasCataclysm;
  elements.cataclysmButton.disabled = !minorActionAvailable || state.cataclysmUsed || state.cataclysmActive || state.overchannelActive || state.masterOfMagicActive || !living(state.enemy);
  elements.cataclysmButton.title = state.cataclysmActive
    ? "Cataclysm is already active."
    : state.overchannelActive || state.masterOfMagicActive
      ? "Another spell empowerment is already active."
      : state.cataclysmUsed
        ? "Cataclysm has already been used this combat."
        : "Minor Action: your next successful standalone elemental spell deals double final damage.";
  const hasMasterOfMagic = isMagicianMasterOfMagicFeatureActive(state.player);
  elements.masterOfMagicButton.hidden = !hasMasterOfMagic;
  elements.masterOfMagicButton.disabled = !minorActionAvailable || state.masterOfMagicUsed || state.masterOfMagicActive || state.cataclysmActive || state.overchannelActive || !living(state.enemy);
  elements.masterOfMagicButton.title = state.masterOfMagicActive
    ? "Master of Magic is already active."
    : state.cataclysmActive || state.overchannelActive
      ? "Another spell empowerment is already active."
    : state.masterOfMagicUsed
      ? "Master of Magic has already been used this combat."
      : "Minor Action: your next successful standalone spell deals double final damage.";
  const hasFirestorm = isSorcererPyromancerFirestormActive(state.player);
  elements.firestormButton.hidden = !hasFirestorm;
  elements.firestormButton.disabled = !minorActionAvailable || state.firestormUsed || state.firestormActive || !living(state.enemy);
  elements.firestormButton.title = state.firestormActive
    ? "Firestorm is already active."
    : state.firestormUsed
      ? "Firestorm has already been used this combat."
      : "Minor Action: your next successful standalone fire spell applies Burn automatically.";
  const hasWorldfire = isSorcererPyromancerWorldfireActive(state.player);
  elements.worldfireButton.hidden = !hasWorldfire;
  elements.worldfireButton.disabled =
    !minorActionAvailable || state.worldfireUsed || state.worldfireActive || state.overloadActive || state.arcaneCataclysmActive || state.cataclysmActive || state.masterOfMagicActive || !living(state.enemy);
  elements.worldfireButton.title = state.worldfireActive
    ? "Worldfire is already active."
    : state.overloadActive || state.arcaneCataclysmActive || state.cataclysmActive || state.masterOfMagicActive
      ? "Another double-damage spell effect is already active."
      : state.worldfireUsed
        ? "Worldfire has already been used this combat."
        : "Minor Action: your next successful standalone fire spell deals double final damage and applies Burn.";
  const hasArcJump = isSorcererStormcallerArcJumpActive(state.player);
  elements.arcJumpButton.hidden = !hasArcJump;
  elements.arcJumpButton.disabled = !minorActionAvailable || state.arcJumpUsed || state.arcJumpActive || !living(state.enemy);
  elements.arcJumpButton.title = state.arcJumpActive
    ? "Arc Jump is already active."
    : state.arcJumpUsed
      ? "Arc Jump has already been used this combat."
      : "Minor Action: your next successful standalone lightning spell strikes again for partial damage.";
  const hasStormAvatar = isSorcererStormcallerStormAvatarActive(state.player);
  elements.stormAvatarButton.hidden = !hasStormAvatar;
  elements.stormAvatarButton.disabled =
    !minorActionAvailable || state.stormAvatarUsed || state.stormAvatarActive || state.overloadActive || state.arcaneCataclysmActive || state.cataclysmActive || state.masterOfMagicActive || state.worldfireActive || !living(state.enemy);
  elements.stormAvatarButton.title = state.stormAvatarActive
    ? "Storm Avatar is already active."
    : state.overloadActive || state.arcaneCataclysmActive || state.cataclysmActive || state.masterOfMagicActive || state.worldfireActive
      ? "Another double-damage spell effect is already active."
      : state.stormAvatarUsed
        ? "Storm Avatar has already been used this combat."
        : "Minor Action: your next standalone lightning spell automatically hits and deals double final damage.";
  const hasOverload = isSorcererOverloadFeatureActive(state.player);
  elements.overloadButton.hidden = !hasOverload;
  elements.overloadButton.disabled =
    !minorActionAvailable || state.overloadUsed || state.overloadActive || state.cataclysmActive || state.masterOfMagicActive || state.arcaneCataclysmActive || state.worldfireActive || state.stormAvatarActive || !living(state.enemy);
  elements.overloadButton.title = state.overloadActive
    ? "Overload is already active."
    : state.cataclysmActive || state.masterOfMagicActive || state.arcaneCataclysmActive || state.worldfireActive || state.stormAvatarActive
      ? "Another double-damage spell effect is already active."
      : state.overloadUsed
        ? "Overload has already been used this combat."
        : "Minor Action: your next successful standalone spell deals double final damage.";
  const hasArcaneCataclysm = isSorcererArcaneCataclysmFeatureActive(state.player);
  elements.arcaneCataclysmButton.hidden = !hasArcaneCataclysm;
  elements.arcaneCataclysmButton.disabled =
    !minorActionAvailable || state.arcaneCataclysmUsed || state.arcaneCataclysmActive || state.overloadActive || state.worldfireActive || state.stormAvatarActive || state.cataclysmActive || state.masterOfMagicActive || !living(state.enemy);
  elements.arcaneCataclysmButton.title = state.arcaneCataclysmActive
    ? "Arcane Cataclysm is already active."
    : state.overloadActive || state.worldfireActive || state.stormAvatarActive || state.cataclysmActive || state.masterOfMagicActive
      ? "Another double-damage spell effect is already active."
      : state.arcaneCataclysmUsed
        ? "Arcane Cataclysm has already been used this combat."
        : "Minor Action: your next successful standalone spell deals double final damage.";
  const hasPerfectFocus = isMagicianPerfectFocusFeatureActive(state.player);
  elements.perfectFocusButton.hidden = !hasPerfectFocus;
  elements.perfectFocusButton.disabled = !minorActionAvailable || state.perfectFocusUsed || state.perfectFocusActive || !living(state.enemy);
  elements.perfectFocusButton.title = state.perfectFocusActive
    ? "Perfect Focus is already active."
    : state.perfectFocusUsed
      ? "Perfect Focus has already been used this combat."
      : "Minor Action: your next standalone spell attack automatically hits.";
  const hasInnerReserve = isMonkInnerReserveActive(state.player);
  elements.innerReserveButton.hidden = !hasInnerReserve;
  elements.innerReserveButton.disabled = !minorActionAvailable || state.innerReserveUsed || !living(state.enemy);
  elements.innerReserveButton.title = state.innerReserveUsed
    ? "Inner Reserve has already been used this combat."
    : "Minor Action: restore 25% max Stamina and 25% max Mana.";
  const hasTranscendence = isMonkTranscendenceActive(state.player);
  elements.transcendenceButton.hidden = !hasTranscendence;
  elements.transcendenceButton.disabled = !minorActionAvailable || state.transcendenceUsed || !living(state.enemy);
  elements.transcendenceButton.title = state.transcendenceUsed
    ? "Transcendence has already been used this combat."
    : "Minor Action: reset your Major and Minor action availability.";
  const hasEnlightenment = isMonkSoulEnlightenmentActive(state.player);
  elements.enlightenmentButton.hidden = !hasEnlightenment;
  elements.enlightenmentButton.disabled = !minorActionAvailable || state.enlightenmentUsed || !living(state.enemy);
  elements.enlightenmentButton.title = state.enlightenmentUsed
    ? "Enlightenment has already been used this combat."
    : "Minor Action: gain Guarded and reset your Major and Minor action availability.";
  const hasImmovableBastion = isImmovableBastionFeatureActive(state.player);
  elements.immovableBastionButton.hidden = !hasImmovableBastion;
  elements.immovableBastionButton.disabled = !minorActionAvailable || state.immovableBastionUsed || state.immovableBastionActive || state.eternalBastionActive || !living(state.enemy);
  elements.immovableBastionButton.title = state.eternalBastionActive
    ? "Another bastion effect is already active."
    : state.immovableBastionUsed
      ? "Immovable Bastion has already been used this combat."
      : "Minor Action: reduce incoming damage by 75% until your next turn.";
  const hasEternalBastion = isEternalBastionFeatureActive(state.player);
  elements.eternalBastionButton.hidden = !hasEternalBastion;
  elements.eternalBastionButton.disabled = !minorActionAvailable || state.eternalBastionUsed || state.eternalBastionActive || state.immovableBastionActive || !living(state.enemy);
  elements.eternalBastionButton.title = state.immovableBastionActive
    ? "Another bastion effect is already active."
    : state.eternalBastionUsed
      ? "Eternal Bastion has already been used this combat."
      : "Minor Action: reduce incoming damage by 75% until your next turn.";
  const hasJudgmentWall = isJudgmentWallFeatureActive(state.player);
  elements.judgmentWallButton.hidden = !hasJudgmentWall;
  elements.judgmentWallButton.disabled = !minorActionAvailable || state.judgmentWallUsed || state.judgmentWallActive || !living(state.enemy);
  elements.judgmentWallButton.title = state.judgmentWallUsed
    ? "Judgment Wall has already been used this combat."
    : "Minor Action: counterattack missed enemy attacks until your next turn.";
  const hasDivineChampion = isDivineChampionFeatureActive(state.player);
  elements.divineChampionButton.hidden = !hasDivineChampion;
  elements.divineChampionButton.disabled = !minorActionAvailable || state.divineChampionUsed || state.divineChampionActive || !living(state.enemy);
  elements.divineChampionButton.title = state.divineChampionActive
    ? "Divine Champion is already active."
    : state.divineChampionUsed
      ? "Divine Champion has already been used this combat."
      : "Minor Action: cleanse yourself, gain Shielded, and double your next Smite or Blessed Strike.";
  const hasEternalOath = isEternalOathFeatureActive(state.player);
  elements.eternalOathButton.hidden = !hasEternalOath;
  elements.eternalOathButton.disabled = !minorActionAvailable || state.eternalOathUsed || state.eternalOathActive;
  elements.eternalOathButton.title = state.eternalOathActive
    ? "Eternal Oath is already active."
    : state.eternalOathUsed
      ? "Eternal Oath has already been used this combat."
      : "Minor Action: gain Shielded and reduce incoming damage by 50% until your next turn.";
  const hasWrathIncarnate = isWrathIncarnateFeatureActive(state.player);
  elements.wrathIncarnateButton.hidden = !hasWrathIncarnate;
  elements.wrathIncarnateButton.disabled = !minorActionAvailable || state.wrathIncarnateUsed || state.wrathIncarnateActive || !living(state.enemy);
  elements.wrathIncarnateButton.title = state.wrathIncarnateActive
    ? "Wrath Incarnate is already active."
    : state.wrathIncarnateUsed
      ? "Wrath Incarnate has already been used this combat."
      : "Minor Action: your next Smite or Blessed Strike crits and applies Stun if it hits.";
  const hasPsionicRecovery = isPsionicRecoveryFeatureActive(state.player);
  elements.psionicRecoveryButton.hidden = !hasPsionicRecovery;
  elements.psionicRecoveryButton.disabled = !minorActionAvailable || state.psionicRecoveryUsed;
  elements.psionicRecoveryButton.title = state.psionicRecoveryUsed
    ? "Psionic Recovery has already been used this combat."
    : "Minor Action: clear one negative status, or restore 20% max HP.";
  const hasTrueSight = isTrueSightFeatureActive(state.player);
  elements.trueSightButton.hidden = !hasTrueSight;
  elements.trueSightButton.disabled = !minorActionAvailable || state.trueSightUsed || state.trueSightActive || state.gravityBreakActive || !living(state.enemy);
  elements.trueSightButton.title = state.gravityBreakActive
    ? "Gravity Break is already active."
    : state.trueSightActive
      ? "True Sight is already active."
      : state.trueSightUsed
        ? "True Sight has already been used this combat."
        : "Minor Action: your next Mind attack auto-hits and deals double final damage.";
  const hasPerfectPrediction = isPerfectPredictionFeatureActive(state.player);
  elements.perfectPredictionButton.hidden = !hasPerfectPrediction;
  elements.perfectPredictionButton.disabled = !minorActionAvailable || state.perfectPredictionUsed || state.perfectPredictionActive;
  elements.perfectPredictionButton.title = state.perfectPredictionActive
    ? "Perfect Prediction is already active."
    : state.perfectPredictionUsed
      ? "Perfect Prediction has already been used this combat."
      : "Minor Action: the next enemy attack automatically misses.";
  const hasGravityBreak = isGravityBreakFeatureActive(state.player);
  elements.gravityBreakButton.hidden = !hasGravityBreak;
  elements.gravityBreakButton.disabled = !minorActionAvailable || state.gravityBreakUsed || state.gravityBreakActive || state.trueSightActive || !living(state.enemy);
  elements.gravityBreakButton.title = state.trueSightActive
    ? "True Sight is already active."
    : state.gravityBreakActive
      ? "Gravity Break is already active."
      : state.gravityBreakUsed
        ? "Gravity Break has already been used this combat."
        : "Minor Action: your next Mind attack deals double damage and applies Stun if it hits.";
  const hasLivingWall = isLivingWallFeatureActive(state.player);
  elements.livingWallButton.hidden = !hasLivingWall;
  elements.livingWallButton.disabled = !minorActionAvailable || state.livingWallUsed || state.livingWallActive;
  elements.livingWallButton.title = state.livingWallActive
    ? "Living Wall is already active."
    : state.livingWallUsed
      ? "Living Wall has already been used this combat."
      : "Minor Action: reduce incoming damage by 50% until your next turn.";
  elements.endTurnButton.disabled = !playerTurnActive;
  elements.clearSkillButton.hidden = !selectedSkill || !playerTurnActive;
  elements.innButton.disabled = true;
  elements.innButton.title = "Stay at the Inn is available between battles.";
  elements.nextEncounterButton.hidden = true;
}

function setActionButtons(disabled) {
  elements.attackButton.disabled = disabled;
  elements.majorSkillButton.disabled = disabled;
  elements.minorSkillButton.disabled = disabled;
  elements.recoverButton.disabled = disabled;
  elements.focusButton.disabled = disabled;
  elements.shakeOffButton.disabled = disabled;
  elements.deathmarkButton.disabled = disabled;
  elements.perfectExecutionButton.disabled = disabled;
  elements.arcaneSurgeButton.disabled = disabled;
  elements.dualElementsButton.disabled = disabled;
  elements.overchannelButton.disabled = disabled;
  elements.cataclysmButton.disabled = disabled;
  elements.masterOfMagicButton.disabled = disabled;
  elements.firestormButton.disabled = disabled;
  elements.worldfireButton.disabled = disabled;
  elements.arcJumpButton.disabled = disabled;
  elements.stormAvatarButton.disabled = disabled;
  elements.overloadButton.disabled = disabled;
  elements.arcaneCataclysmButton.disabled = disabled;
  elements.perfectFocusButton.disabled = disabled;
  elements.innerReserveButton.disabled = disabled;
  elements.transcendenceButton.disabled = disabled;
  elements.enlightenmentButton.disabled = disabled;
  elements.immovableBastionButton.disabled = disabled;
  elements.eternalBastionButton.disabled = disabled;
  elements.judgmentWallButton.disabled = disabled;
  elements.divineChampionButton.disabled = disabled;
  elements.eternalOathButton.disabled = disabled;
  elements.wrathIncarnateButton.disabled = disabled;
  elements.psionicRecoveryButton.disabled = disabled;
  elements.trueSightButton.disabled = disabled;
  elements.perfectPredictionButton.disabled = disabled;
  elements.gravityBreakButton.disabled = disabled;
  elements.livingWallButton.disabled = disabled;
  elements.endTurnButton.disabled = disabled;
  elements.majorSkillButton.hidden = true;
  elements.minorSkillButton.hidden = true;
  elements.deathmarkButton.hidden = true;
  elements.perfectExecutionButton.hidden = true;
  elements.arcaneSurgeButton.hidden = true;
  elements.dualElementsButton.hidden = true;
  elements.overchannelButton.hidden = true;
  elements.cataclysmButton.hidden = true;
  elements.masterOfMagicButton.hidden = true;
  elements.firestormButton.hidden = true;
  elements.worldfireButton.hidden = true;
  elements.arcJumpButton.hidden = true;
  elements.stormAvatarButton.hidden = true;
  elements.overloadButton.hidden = true;
  elements.arcaneCataclysmButton.hidden = true;
  elements.perfectFocusButton.hidden = true;
  elements.innerReserveButton.hidden = true;
  elements.transcendenceButton.hidden = true;
  elements.enlightenmentButton.hidden = true;
  elements.immovableBastionButton.hidden = true;
  elements.eternalBastionButton.hidden = true;
  elements.judgmentWallButton.hidden = true;
  elements.divineChampionButton.hidden = true;
  elements.eternalOathButton.hidden = true;
  elements.wrathIncarnateButton.hidden = true;
  elements.psionicRecoveryButton.hidden = true;
  elements.trueSightButton.hidden = true;
  elements.perfectPredictionButton.hidden = true;
  elements.gravityBreakButton.hidden = true;
  elements.livingWallButton.hidden = true;
  elements.clearSkillButton.hidden = true;
}

async function startNextEncounter() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles || state.pendingLevelUps > 0 || isTierTrialRequired(state.player)) return;
  state.enemy = createScaledEnemy(state.player.level);
  await startEncounterWithEnemy(`New encounter: ${state.enemy.name} level ${state.enemy.level}.`, "combat start");
}

async function startTierTrial() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles || state.pendingLevelUps > 0) return;
  const trial = getBlockedTierTrial(state.player);
  if (!trial) return;
  const bosses = getBossEnemiesForTier(trial.tier);
  if (!bosses.length) return;
  const boss = bosses[Math.floor(Math.random() * bosses.length)];
  state.enemy = createScaledEnemy(getTierCap(trial.tier), boss.id, { enemyType: "boss", isTierTrial: true, trialTier: trial.tier });
  await startEncounterWithEnemy(`Tier ${trial.tier} Trial: ${state.enemy.name} level ${state.enemy.level}.`, "tier trial start");
}

async function startFinalTrial() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles || state.pendingLevelUps > 0 || (state.player.level ?? 1) < MAX_LEVEL) return;
  const bosses = getBossEnemiesForTier(5);
  if (!bosses.length) return;
  const boss = bosses[Math.floor(Math.random() * bosses.length)];
  state.enemy = createScaledEnemy(MAX_LEVEL, boss.id, { enemyType: "boss", isFinalTrial: true, trialTier: 5 });
  await startEncounterWithEnemy(`Final Trial: ${state.enemy.name} level ${state.enemy.level}.`, "final trial start");
}

async function startEncounterWithEnemy(logLine, saveReason) {
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
  resetCombatFeatureFlags();
  state.lastRewards = [];
  elements.nextEncounterButton.hidden = true;
  rollInitiative();
  state.progress.battlesFought += 1;
  addLog(logLine);
  addLog(`${state.enemy.name} Defense: ${getAcFormula(state.enemy)}.`);
  await saveAdventure(saveReason);
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
  const openMindIgnoresPenalties = shouldOpenMindIgnorePenalties(attacker, skill);
  return buildD20Parts(attacker, skill.statUsed.toLowerCase(), {
    classBonus: getClassAttackBonus(attacker, skill.attackKind),
    classLabel: attacker.classDef ? attacker.classDef.name : "Class",
    equipmentBonus: skill.hitBonus ?? 0,
    equipmentLabel: skill.name,
    specialBonus: getFirstAttackBonus(attacker) + extraHitBonus,
    specialLabel: "Special",
    statusBonus: openMindIgnoresPenalties ? 0 : getStatusHitPenalty(attacker),
  });
}

function isRogueWeaponAttack(attacker, attackOrSkill) {
  if (normalizeClassId(attacker?.classDef, "") !== "rogue") return false;
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "rogue") return false;
  return true;
}

function isScoutQuickReadActive(attacker) {
  return (
    attacker?.id === "player" &&
    normalizeClassId(attacker?.classDef, "") === "rogue" &&
    attacker?.subclassId === "scout" &&
    (attacker?.level ?? 1) >= 3
  );
}

function getWatchfulEyeHitPenalty(attacker, defender) {
  return attacker?.id !== "player" && isGuardianSentinel(defender, 3) ? -1 : 0;
}

function getQuickReadHitBonus(attacker, attackOrSkill) {
  if (!isScoutQuickReadActive(attacker)) return 0;
  if (state.quickReadUsedThisTurn) return 0;
  if (!isRogueWeaponAttack(attacker, attackOrSkill)) return 0;
  return 2;
}

function isMonkBodyFlowingStrikesActive(attacker) {
  return (
    attacker?.id === "player" &&
    normalizeClassId(attacker?.classDef, "") === "monk" &&
    attacker?.subclassId === "body" &&
    (attacker?.level ?? 1) >= 7
  );
}

function isMonkBodyFlowingStrikesAttack(attacker, attackOrSkill) {
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "monk") return false;
  return normalizeClassId(attacker?.classDef, "") === "monk";
}

function getFlowingStrikesHitBonus(attacker, attackOrSkill) {
  if (!isMonkBodyFlowingStrikesActive(attacker)) return 0;
  if (state.flowingStrikesUsedThisTurn) return 0;
  if (!isMonkBodyFlowingStrikesAttack(attacker, attackOrSkill)) return 0;
  return 2;
}

function markFlowingStrikesAttempt(attacker, attackOrSkill) {
  if (!isMonkBodyFlowingStrikesActive(attacker)) return;
  if (!isMonkBodyFlowingStrikesAttack(attacker, attackOrSkill)) return;
  state.flowingStrikesUsedThisTurn = true;
}

function isMagicianSageStudiedCastingActive(attacker) {
  return (
    attacker?.id === "player" &&
    normalizeClassId(attacker?.classDef, "") === "magician" &&
    attacker?.subclassId === "sage" &&
    (attacker?.level ?? 1) >= 3
  );
}

function isStudiedCastingSpellSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function getStudiedCastingHitBonus(attacker, skill) {
  if (!isMagicianSageStudiedCastingActive(attacker)) return 0;
  if (!isStudiedCastingSpellSkill(skill)) return 0;
  return 2;
}

function isMagicianSageArcaneInsightActive(attacker) {
  return (
    attacker?.id === "player" &&
    normalizeClassId(attacker?.classDef, "") === "magician" &&
    attacker?.subclassId === "sage" &&
    (attacker?.level ?? 1) >= 10
  );
}

function isArcaneInsightSpellSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell";
}

function getArcaneInsightHitBonus(attacker, skill) {
  if (!isMagicianSageArcaneInsightActive(attacker)) return 0;
  if (state.arcaneInsightUsed) return 0;
  if (!isArcaneInsightSpellSkill(skill)) return 0;
  return 2;
}

function isSorcererStormcallerStaticChargeActive(attacker) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return attacker?.id === "player" && classId === "sorcerer" && attacker?.subclassId === "stormcaller" && (attacker?.level ?? 1) >= 3;
}

function isStaticChargeLightningSpell(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell" && skill?.damageType === "lightning";
}

function getStaticChargeHitBonus(attacker, skill) {
  if (!isSorcererStormcallerStaticChargeActive(attacker)) return 0;
  if (!isStaticChargeLightningSpell(skill)) return 0;
  return 2;
}

function isSorcererStormcallerConductiveShockActive(attacker) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return attacker?.id === "player" && classId === "sorcerer" && attacker?.subclassId === "stormcaller" && (attacker?.level ?? 1) >= 7;
}

function isConductiveShockLightningSpell(source) {
  return source?.mode === "standalone" && source?.attackKind === "spell" && source?.damageType === "lightning";
}

function hasConductiveShockVulnerability(combatant) {
  return hasStatus(combatant, "stun") || hasStatus(combatant, "freeze");
}

function getConductiveShockDamageBonus(attacker, defender, attackOrSkill, finalDamage) {
  if (!isSorcererStormcallerConductiveShockActive(attacker)) return 0;
  if (!isConductiveShockLightningSpell(attackOrSkill)) return 0;
  if (!hasConductiveShockVulnerability(defender) || finalDamage < 1) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.25));
}

function isSorcererStormcallerArcJumpActive(attacker) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return attacker?.id === "player" && classId === "sorcerer" && attacker?.subclassId === "stormcaller" && (attacker?.level ?? 1) >= 10;
}

function isArcJumpEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell" && skill?.damageType === "lightning";
}

function getArcJumpDamage(caster, skill, finalDamage) {
  if (!isSorcererStormcallerArcJumpActive(caster)) return 0;
  if (!state.arcJumpActive || !isArcJumpEligibleSkill(skill) || finalDamage < 1) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.5));
}

function resetArcJump() {
  state.arcJumpUsed = false;
  state.arcJumpActive = false;
}

function isSorcererStormcallerStormAvatarActive(attacker) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return attacker?.id === "player" && classId === "sorcerer" && attacker?.subclassId === "stormcaller" && (attacker?.level ?? 1) === 20;
}

function isStormAvatarEligibleSkill(skill) {
  return skill?.mode === "standalone" && skill?.attackKind === "spell" && skill?.damageType === "lightning";
}

function consumeStormAvatarForSkill(caster, skill) {
  if (!isSorcererStormcallerStormAvatarActive(caster)) return false;
  if (!state.stormAvatarActive || !isStormAvatarEligibleSkill(skill)) return false;
  state.stormAvatarActive = false;
  return true;
}

function getStormAvatarDamageBonus(caster, skill, finalDamage, triggered) {
  if (!triggered || !isSorcererStormcallerStormAvatarActive(caster)) return 0;
  if (!isStormAvatarEligibleSkill(skill) || finalDamage < 1) return 0;
  return finalDamage;
}

function resetStormAvatar() {
  state.stormAvatarUsed = false;
  state.stormAvatarActive = false;
}

function isSorcererStormcallerThunderheadActive(attacker) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return attacker?.id === "player" && classId === "sorcerer" && attacker?.subclassId === "stormcaller" && (attacker?.level ?? 1) >= 15;
}

function isThunderheadLightningStunSpell(source) {
  return source?.mode === "standalone" && source?.attackKind === "spell" && source?.damageType === "lightning" && source?.status?.id === "stun";
}

function getThunderheadStatusChanceBonus(attacker, source) {
  if (!isSorcererStormcallerThunderheadActive(attacker)) return 0;
  if (!isThunderheadLightningStunSpell(source)) return 0;
  return 15;
}

function getArcaneInsightPenaltyOffset(attacker, skill) {
  if (!getArcaneInsightHitBonus(attacker, skill)) return 0;
  return Math.max(0, -getStatusHitPenalty(attacker));
}

function consumeArcaneInsight(attacker, skill) {
  if (!getArcaneInsightHitBonus(attacker, skill)) return false;
  state.arcaneInsightUsed = true;
  return true;
}

function resetArcaneInsight() {
  state.arcaneInsightUsed = false;
}

function markQuickReadAttempt(attacker, attackOrSkill) {
  if (!isScoutQuickReadActive(attacker)) return;
  if (!isRogueWeaponAttack(attacker, attackOrSkill)) return;
  state.quickReadUsedThisTurn = true;
}

function getScoutUntouchableHitPenalty(attacker, defender) {
  return (
    attacker?.id !== "player" &&
    defender?.id === "player" &&
    normalizeClassId(defender?.classDef, "") === "rogue" &&
    defender?.subclassId === "scout" &&
    (defender?.level ?? 1) >= 20
  )
    ? -2
    : 0;
}

function getVanishedHitPenalty(attacker, defender) {
  if (attacker?.id === "player" || defender?.id !== "player") return 0;
  if (normalizeClassId(defender?.classDef, "") !== "rogue") return 0;
  const vanished = (defender?.statuses ?? []).find((status) => status.id === "vanished");
  return vanished ? (vanished.enemyHitPenalty ?? -1) : 0;
}

function hasAssassinLethalPrecision(attacker, attackOrSkill) {
  if (attacker?.subclassId !== "assassin") return false;
  if ((attacker?.level ?? 1) < 7) return false;
  return isRogueWeaponAttack(attacker, attackOrSkill);
}

function getCritThreshold(attacker, attackOrSkill) {
  const baseCritMin = attackOrSkill?.critMin ?? 20;
  const rogueCritReduction = normalizeClassId(attacker?.classDef, "") === "rogue" ? getClassPassiveRank(attacker) : 0;
  const existingThreshold = clamp(baseCritMin - rogueCritReduction, 2, 20);
  if (hasAssassinLethalPrecision(attacker, attackOrSkill)) {
    return Math.max(18, Math.min(existingThreshold, 18));
  }
  return existingThreshold;
}

function getEffectiveCritMin(attacker, attackOrSkill) {
  return getCritThreshold(attacker, attackOrSkill);
}

function isAssassinAssassinateActive(attacker) {
  return (
    normalizeClassId(attacker?.classDef, "") === "rogue" &&
    attacker?.subclassId === "assassin" &&
    (attacker?.level ?? 1) >= 15
  );
}

function shouldTriggerAssassinate(attacker, attackOrSkill, hit) {
  if (!hit || state.assassinateUsed) return false;
  if (!isAssassinAssassinateActive(attacker)) return false;
  return isRogueWeaponAttack(attacker, attackOrSkill);
}

function getClassPassiveDamageBonus(attacker, attack) {
  const rank = getClassPassiveRank(attacker);
  if (rank <= 0) return 0;
  if (attacker?.classDef?.id === "warrior" && attack?.attackKind !== "spell") return rank;
  if (attacker?.classDef?.id === "sorcerer" && attack?.attackKind === "spell") return rank;
  return 0;
}

function getEmpoweredCastingBonus(attacker, attackOrSkill) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "magician" || (attacker?.level ?? 1) < 5) return 0;
  if (attackOrSkill?.attackKind !== "spell") return 0;
  return 2;
}

function getSorcererArcaneSurgeBonus(attacker, attackOrSkill) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "sorcerer" || (attacker?.level ?? 1) < 5) return 0;
  if (attackOrSkill?.classId !== "sorcerer" || attackOrSkill?.attackKind !== "spell") return 0;
  if (!attackOrSkill?.damageDice) return 0;
  return 3;
}

function getSorcererRawPowerBonus(attacker, attackOrSkill) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "sorcerer" || (attacker?.level ?? 1) < 13) return 0;
  if (attackOrSkill?.classId !== "sorcerer" || attackOrSkill?.attackKind !== "spell") return 0;
  if (!attackOrSkill?.damageDice) return 0;
  return 2;
}

function getMonkSpiritStrikesDamageBonus(attacker, attackOrSkill) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "monk" || (attacker?.level ?? 1) < 15) return 0;
  if (attackOrSkill?.attackKind !== "weapon") return 0;
  if (attackOrSkill?.classId && attackOrSkill.classId !== "monk") return 0;
  return 2;
}

function isMonkSoulInnerLightActive(attacker) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return classId === "monk" && attacker?.subclassId === "soul" && (attacker?.level ?? 1) >= 3;
}

function getInnerLightDamageBonus(attacker, attackOrSkill) {
  if (!isMonkSoulInnerLightActive(attacker)) return 0;
  if (attackOrSkill?.classId !== "monk") return 0;
  if (attackOrSkill?.attackKind === "utility") return 0;
  if (!attackOrSkill?.damageDice && !attackOrSkill?.damageBonus && !attackOrSkill?.sourceSkillId) return 0;
  return 2;
}

function isMonkSoulAstralFistAttack(attacker, attackOrSkill) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "monk" || attacker?.subclassId !== "soul" || (attacker?.level ?? 1) < 15) return false;
  if (attacker?.weapon?.id !== "unarmed") return false;
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "monk") return false;
  return true;
}

function getAstralFistDamageBonus(attacker, attackOrSkill) {
  return isMonkSoulAstralFistAttack(attacker, attackOrSkill) ? 2 : 0;
}

function maybeApplyAstralFistStun(attacker, defender, attackOrSkill) {
  if (!isMonkSoulAstralFistAttack(attacker, attackOrSkill) || !living(defender)) return;
  maybeApplyStatus(attacker, defender, { id: "stun" }, "Astral Fist", {
    ...attackOrSkill,
    status: { id: "stun" },
    baseEffectChance: 15,
    effectScalingStat: "soul",
    effectChancePerStat: 4,
    maxEffectChance: 60,
  });
}

function getIronBodyUnarmedDamageBonus(attacker, attackOrSkill) {
  if (!isMonkBodyIronBodyActive(attacker)) return 0;
  if (attackOrSkill?.attackKind !== "weapon") return 0;
  if (attackOrSkill?.classId && attackOrSkill.classId !== "monk") return 0;
  return attacker?.weapon?.id === "unarmed" ? 1 : 0;
}

function getCrushingCounterDamageBonus(attacker, finalDamage) {
  if (!state.crushingCounterActive || !isGuardianSentinel(attacker, 7) || finalDamage < 1) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.25));
}

function isMonkBodyEndlessMotionActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return classId === "monk" && combatant?.subclassId === "body" && (combatant?.level ?? 1) >= 10;
}

function getEndlessMotionFlurryDamageBonus(attacker, skill) {
  if (!isMonkBodyEndlessMotionActive(attacker)) return 0;
  return skill?.id === "flurry" ? 2 : 0;
}

function isPaladinWeaponAttack(attacker, attackOrSkill) {
  if (!isPaladinClass(attacker)) return false;
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "paladin") return false;
  return true;
}

function getDivineSmiteDamageBonus(attacker, attackOrSkill) {
  return isPaladinWeaponAttack(attacker, attackOrSkill) && (attacker?.level ?? 1) >= 5 ? 2 : 0;
}

function getVengefulSmiteDamageBonus(attacker, attackOrSkill) {
  if (!isPaladinAvenger(attacker, 3)) return 0;
  return attackOrSkill?.id === "smite" || attackOrSkill?.sourceSkillId === "blessingStrike" || attackOrSkill?.id === "blessingStrike" ? 2 : 0;
}

function getHolyJudgmentDamageBonus(attacker, defender, finalDamage) {
  if (!isPaladinClass(attacker) || (attacker?.level ?? 1) < 15 || finalDamage < 1 || !hasNegativeStatus(defender)) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.25));
}

function getRighteousExecutionDamageBonus(attacker, defender, attackOrSkill, finalDamage) {
  if (!isPaladinAvenger(attacker, 15) || finalDamage < 1) return 0;
  if (!defender || (defender.maxHp ?? 0) <= 0 || defender.hp > defender.maxHp * 0.3) return 0;
  if (attackOrSkill?.damageType !== "lightning" && getDivineSmiteDamageBonus(attacker, attackOrSkill) <= 0) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.5));
}

function isPaladinSmiteOrBlessedStrike(attackOrSkill) {
  return attackOrSkill?.id === "smite" || attackOrSkill?.id === "blessingStrike" || attackOrSkill?.sourceSkillId === "blessingStrike";
}

function getDivineChampionDamageBonus(attacker, attackOrSkill, finalDamage) {
  if (!state.divineChampionActive || !isPaladinClass(attacker) || (attacker?.level ?? 1) < 20 || finalDamage < 1) return 0;
  return isPaladinSmiteOrBlessedStrike(attackOrSkill) ? finalDamage : 0;
}

function getJudgmentBrandDamageBonus(attacker, defender, attackOrSkill, finalDamage) {
  if (!state.judgmentBrandActive || !isPaladinAvenger(attacker, 7) || finalDamage < 1) return 0;
  if (state.brandedTargetId && state.brandedTargetId !== (defender?.id ?? "enemy")) return 0;
  if (!isPaladinWeaponAttack(attacker, attackOrSkill)) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.25));
}

function shouldApplyJudgmentBrand(attacker, attackOrSkill) {
  return isPaladinAvenger(attacker, 7) && attackOrSkill?.id === "smite";
}

function clearJudgmentBrand() {
  state.judgmentBrandActive = false;
  state.brandedTargetId = null;
}

function canTriggerWrathIncarnateCrit(attacker, attackOrSkill) {
  return state.wrathIncarnateActive && isPaladinAvenger(attacker, 20) && isPaladinSmiteOrBlessedStrike(attackOrSkill);
}

function triggerRelentlessVengeance(attacker) {
  if (!isPaladinAvenger(attacker, 10) || state.relentlessVengeanceUsed || attacker?.id !== "player") return;
  state.relentlessVengeanceUsed = true;
  if (state.majorActionUsed) {
    state.majorActionUsed = false;
    syncActionState();
    addLog("Relentless Vengeance restores a Major Action.");
  } else {
    addLog("Relentless Vengeance is ready, but no Major Action was spent.");
  }
}

function isMysticClass(combatant) {
  return normalizeClassId(combatant?.classDef, "") === "mystic";
}

function isMysticSeer(combatant, level = 1) {
  return isMysticClass(combatant) && combatant?.subclassId === "seer" && (combatant?.level ?? 1) >= level;
}

function isMysticTelekinetic(combatant, level = 1) {
  return isMysticClass(combatant) && combatant?.subclassId === "telekinetic" && (combatant?.level ?? 1) >= level;
}

function isMysticMindAttack(attacker, attackOrSkill) {
  if (!isMysticClass(attacker)) return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "mystic") return false;
  if (String(attackOrSkill?.stat ?? attackOrSkill?.statUsed ?? "").toLowerCase() !== "mind") return false;
  return attackOrSkill?.attackKind !== "utility";
}

function getMindPierceDefenseReduction(attacker, attackOrSkill) {
  return isMysticMindAttack(attacker, attackOrSkill) && (attacker?.level ?? 1) >= 5 ? 2 : 0;
}

function getForesightHitBonus(attacker, attackOrSkill) {
  if (!isMysticSeer(attacker, 3) || state.foresightUsed || !isMysticMindAttack(attacker, attackOrSkill)) return 0;
  return 2;
}

function markForesightAttempt(attacker, attackOrSkill) {
  if (getForesightHitBonus(attacker, attackOrSkill) > 0) state.foresightUsed = true;
}

function shouldOpenMindIgnorePenalties(attacker, attackOrSkill) {
  return isMysticSeer(attacker, 10) && isMysticMindAttack(attacker, attackOrSkill);
}

function getForcePushDamageBonus(attacker, attackOrSkill) {
  return isMysticTelekinetic(attacker, 3) && isMysticMindAttack(attacker, attackOrSkill) ? 2 : 0;
}

function getCrushingGripDamageBonus(attacker, defender, attackOrSkill, finalDamage) {
  if (!isMysticTelekinetic(attacker, 10) || !isMysticMindAttack(attacker, attackOrSkill) || finalDamage < 1 || !hasStatus(defender, "weakened")) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.25));
}

function getMentalOverloadStatusChanceBonus(actor, source) {
  return isMysticClass(actor) && (actor?.level ?? 1) >= 15 && isMysticMindAttack(actor, source) ? 10 : 0;
}

function getParalyzingVisionStatusChanceBonus(actor, source) {
  if (!isMysticSeer(actor, 15) || !isMysticMindAttack(actor, source)) return 0;
  return source?.status?.id === "stun" || source?.status?.id === "freeze" ? 15 : 0;
}

function consumeTrueSightForSkill(caster, skill) {
  if (!state.trueSightActive || !isMysticClass(caster) || (caster?.level ?? 1) < 20 || !isMysticMindAttack(caster, skill)) return false;
  addLog("True Sight makes the attack automatically hit.");
  return true;
}

function consumeGravityBreakForSkill(caster, skill) {
  if (!state.gravityBreakActive || !isMysticTelekinetic(caster, 20) || !isMysticMindAttack(caster, skill)) return false;
  return true;
}

function getTrueSightDamageBonus(attacker, attackOrSkill, finalDamage, triggered) {
  if (!triggered || !isMysticMindAttack(attacker, attackOrSkill) || finalDamage < 1) return 0;
  return finalDamage;
}

function getGravityBreakDamageBonus(attacker, attackOrSkill, finalDamage, triggered) {
  if (!triggered || !isMysticMindAttack(attacker, attackOrSkill) || finalDamage < 1) return 0;
  return finalDamage;
}

function shouldTriggerPsychicEcho(attacker, attackOrSkill, finalDamage) {
  return isMysticMindAttack(attacker, attackOrSkill) && (attacker?.level ?? 1) >= 10 && !state.psychicEchoUsed && finalDamage >= 1;
}

function getPsychicEchoDamage(finalDamage) {
  return Math.max(1, Math.floor(finalDamage * 0.5));
}

const ELEMENTAL_ATTUNEMENT_DAMAGE_TYPES = new Set(["fire", "ice", "lightning"]);
const UNSTABLE_ELEMENTS_STATUS_BY_DAMAGE_TYPE = {
  fire: "burn",
  ice: "freeze",
  lightning: "stun",
};
const DUAL_ELEMENTS_SECONDARY_STATUS_BY_DAMAGE_TYPE = {
  fire: "stun",
  ice: "burn",
  lightning: "freeze",
};

function getElementalAttunementBonus(attacker, attackOrSkill, attack = attackOrSkill) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "magician" || attacker?.subclassId !== "elementalist" || (attacker?.level ?? 1) < 3) return 0;
  if (attackOrSkill?.mode !== "standalone" || attackOrSkill?.attackKind !== "spell") return 0;
  if (!ELEMENTAL_ATTUNEMENT_DAMAGE_TYPES.has(attack?.damageType)) return 0;
  return 2;
}

function getUnstableElementsStatusChanceBonus(attacker, source) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "magician" || attacker?.subclassId !== "elementalist" || (attacker?.level ?? 1) < 7) return 0;
  if (source?.mode !== "standalone" || source?.attackKind !== "spell") return 0;
  const expectedStatusId = UNSTABLE_ELEMENTS_STATUS_BY_DAMAGE_TYPE[source.damageType];
  if (!expectedStatusId || source.status?.id !== expectedStatusId) return 0;
  return 10;
}

function isArmored(combatant) {
  return getArmorBonus(combatant) > 0;
}

function getDamageBonusParts(attacker, defender, attack, attackOrSkill = attack) {
  const parts = [];
  const classBonus = attacker.classDef?.damageBonus ?? 0;
  const subclass = getSubclassDef(attacker);
  const isElementalistLegacyDamageBonus =
    normalizeClassId(attacker?.classDef, "") === "magician" && attacker?.subclassId === "elementalist";
  const isPyromancerBurningSoulDamageBonus =
    normalizeClassId(attacker?.classDef, "") === "sorcerer" && attacker?.subclassId === "pyromancer";
  const subclassDamageBonus = isElementalistLegacyDamageBonus || isPyromancerBurningSoulDamageBonus
    ? 0
    : subclass?.damageBonusTypes && !subclass.damageBonusTypes.includes(attack.damageType)
      ? 0
      : subclass?.damageBonus ?? 0;
  const levelBonus = getLevelDamageBonus(attacker);
  const passiveDamageBonus = getClassPassiveDamageBonus(attacker, attack);
  const bloodlustBonus = getBloodlustBonus(attacker, attack);
  const empoweredCastingBonus = getEmpoweredCastingBonus(attacker, attackOrSkill);
  const sorcererArcaneSurgeBonus = getSorcererArcaneSurgeBonus(attacker, attackOrSkill);
  const sorcererRawPowerBonus = getSorcererRawPowerBonus(attacker, attackOrSkill);
  const elementalAttunementBonus = getElementalAttunementBonus(attacker, attackOrSkill, attack);
  const burningSoulBonus = getBurningSoulDamageBonus(attacker, attackOrSkill);
  const ironBodyBonus = getIronBodyUnarmedDamageBonus(attacker, attackOrSkill);
  const vengefulSmiteBonus = getVengefulSmiteDamageBonus(attacker, attackOrSkill);

  if ((attack.damageBonus ?? 0) !== 0) parts.push({ label: attack.name, value: attack.damageBonus });
  if (classBonus !== 0) parts.push({ label: attacker.classDef.name, value: classBonus });
  if (subclassDamageBonus !== 0) parts.push({ label: subclass.name, value: subclassDamageBonus });
  if (passiveDamageBonus !== 0) parts.push({ label: getClassPassiveFeature(attacker.classDef.id)?.name ?? "Class feature", value: passiveDamageBonus });
  if (empoweredCastingBonus !== 0) parts.push({ label: "Empowered Casting", value: empoweredCastingBonus });
  if (sorcererArcaneSurgeBonus !== 0) parts.push({ label: "Arcane Surge", value: sorcererArcaneSurgeBonus });
  if (sorcererRawPowerBonus !== 0) parts.push({ label: "Raw Power", value: sorcererRawPowerBonus });
  if (elementalAttunementBonus !== 0) parts.push({ label: "Elemental Attunement", value: elementalAttunementBonus });
  if (burningSoulBonus !== 0) parts.push({ label: "Burning Soul", value: burningSoulBonus });
  if (ironBodyBonus !== 0) parts.push({ label: "Iron Body", value: ironBodyBonus });
  if (vengefulSmiteBonus !== 0) parts.push({ label: "Vengeful Smite", value: vengefulSmiteBonus });
  if (bloodlustBonus !== 0) parts.push({ label: "Bloodlust", value: bloodlustBonus });
  if (attack.id === "sword" && isArmored(defender)) parts.push({ label: "Armored target", value: 1 });
  if (levelBonus !== 0) parts.push({ label: "Level", value: levelBonus });
  return parts;
}

function shouldApplyExecutioner(attacker, defender, attackOrSkill) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (classId !== "warrior" || (attacker?.level ?? 1) < 15) return false;
  if (!defender || (defender.maxHp ?? 0) <= 0 || defender.hp > defender.maxHp * 0.3) return false;
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "warrior") return false;
  return true;
}

function shouldApplySneakAttack(attacker, finalDamage) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return (
    attacker?.id === "player" &&
    classId === "rogue" &&
    (attacker?.level ?? 1) >= 5 &&
    !state.sneakAttackUsed &&
    finalDamage >= 1
  );
}

function getSneakAttackBonus(attacker, finalDamage) {
  if (!shouldApplySneakAttack(attacker, finalDamage)) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.5));
}

function shouldApplyDeathsOpening(attacker, finalDamage) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return (
    attacker?.id === "player" &&
    classId === "rogue" &&
    attacker?.subclassId === "assassin" &&
    (attacker?.level ?? 1) >= 3 &&
    !state.deathsOpeningUsed &&
    finalDamage >= 1
  );
}

function getDeathsOpeningBonus(attacker, finalDamage) {
  if (!shouldApplyDeathsOpening(attacker, finalDamage)) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.5));
}

function hasNegativeStatus(combatant) {
  return (combatant?.statuses ?? []).some((status) => statusDefinitions[status.id]?.negative === true);
}

function shouldApplyExploitWeakness(attacker, defender, attackOrSkill, finalDamage) {
  const classId = normalizeClassId(attacker?.classDef, "");
  if (attacker?.id !== "player" || classId !== "rogue" || (attacker?.level ?? 1) < 17) return false;
  if (!hasNegativeStatus(defender) || finalDamage < 1) return false;
  if (attackOrSkill?.attackKind !== "weapon") return false;
  if (attackOrSkill?.classId && normalizeClassId(attackOrSkill.classId, "") !== "rogue") return false;
  return true;
}

function getExploitWeaknessBonus(attacker, defender, attackOrSkill, finalDamage) {
  if (!shouldApplyExploitWeakness(attacker, defender, attackOrSkill, finalDamage)) return 0;
  return Math.max(1, Math.floor(finalDamage * 0.25));
}

function isAssassinKillersRhythmActive(combatant) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return combatant?.id === "player" && classId === "rogue" && combatant?.subclassId === "assassin" && (combatant?.level ?? 1) >= 10;
}

function triggerKillersRhythm(attacker) {
  if (!isAssassinKillersRhythmActive(attacker) || state.killersRhythmUsedThisTurn) return;
  state.killersRhythmUsedThisTurn = true;
  addLog(`Killer\u2019s Rhythm triggers \u2014 ${attacker.name} is ready to strike again.`);
}

function shouldCheckShadowFlurry(attacker, options = {}) {
  const classId = normalizeClassId(attacker?.classDef, "");
  return (
    attacker?.id === "player" &&
    classId === "rogue" &&
    (attacker?.level ?? 1) >= 10 &&
    !state.shadowFlurryChecked &&
    !state.shadowFlurryUsed &&
    !options.shadowFlurry
  );
}

function recordShadowFlurryAttempt(attacker, hit, options = {}) {
  if (!shouldCheckShadowFlurry(attacker, options)) return false;
  state.shadowFlurryChecked = true;
  if (!hit) return false;
  state.shadowFlurryUsed = true;
  return true;
}

function getWhirlwindCleaveSingleTargetBonus(skill, finalDamage) {
  if (skill?.id !== "whirlwindCleave" || finalDamage < 1) return 0;
  const bonusPercent = skill.singleTargetDamageBonusPercent ?? 0.25;
  return Math.max(1, Math.floor(finalDamage * bonusPercent));
}

function canTriggerVeteransGrit(combatant, incomingDamage) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return (
    combatant?.id === "player" &&
    classId === "warrior" &&
    (combatant?.level ?? 1) >= 13 &&
    !state.veteranGritUsed &&
    incomingDamage > 0 &&
    combatant.hp - incomingDamage <= 0
  );
}

function canTriggerUnbreakable(combatant, incomingDamage) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return (
    combatant?.id === "player" &&
    classId === "warrior" &&
    combatant?.subclassId === "defender" &&
    (combatant?.level ?? 1) >= 15 &&
    !state.unbreakableUsed &&
    incomingDamage > 0 &&
    combatant.hp - incomingDamage <= 0
  );
}

function shouldTriggerEvasion(combatant, incomingDamage) {
  const classId = normalizeClassId(combatant?.classDef, "");
  const maxHp = combatant?.maxHp ?? 0;
  return (
    combatant?.id === "player" &&
    classId === "rogue" &&
    (combatant?.level ?? 1) >= 13 &&
    !state.evasionUsed &&
    incomingDamage >= 1 &&
    incomingDamage >= maxHp * 0.25
  );
}

function applyEvasionReduction(combatant, incomingDamage) {
  if (!shouldTriggerEvasion(combatant, incomingDamage)) return incomingDamage;
  state.evasionUsed = true;
  addLog(`Evasion triggers — ${combatant.name} twists away and reduces the damage.`);
  return Math.max(1, Math.floor(incomingDamage * 0.5));
}

function shouldTriggerGhostStep(combatant, incomingDamage, options = {}) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return (
    options.isHit === true &&
    options.attacker?.id &&
    options.attacker.id !== "player" &&
    combatant?.id === "player" &&
    classId === "rogue" &&
    combatant?.subclassId === "scout" &&
    (combatant?.level ?? 1) >= 15 &&
    !state.ghostStepUsed &&
    incomingDamage > 0
  );
}

function applyGhostStepPrevention(combatant, incomingDamage, options = {}) {
  if (!shouldTriggerGhostStep(combatant, incomingDamage, options)) return incomingDamage;
  state.ghostStepUsed = true;
  addLog(`Ghost Step triggers \u2014 ${combatant.name} slips away from the attack.`);
  return 0;
}

function shouldTriggerMonkGhostStep(combatant, incomingDamage, options = {}) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return (
    options.isHit === true &&
    options.attacker?.id &&
    options.attacker.id !== "player" &&
    combatant?.id === "player" &&
    classId === "monk" &&
    combatant?.subclassId === "soul" &&
    (combatant?.level ?? 1) >= 10 &&
    !state.monkGhostStepUsed &&
    incomingDamage > 0
  );
}

function applyMonkGhostStepPrevention(combatant, incomingDamage, options = {}) {
  if (!shouldTriggerMonkGhostStep(combatant, incomingDamage, options)) return incomingDamage;
  state.monkGhostStepUsed = true;
  addLog(`Ghost Step \u2014 ${combatant.name} slips beyond the attack.`);
  return 0;
}

function isGuardianStonebloodActive(target) {
  return isGuardianClass(target) && (target?.level ?? 1) >= 13;
}

function isGuardianIronFortressActive(target) {
  return isGuardianBulwark(target, 10);
}

function shouldTriggerUnbreakableLine(combatant, incomingDamage, options = {}) {
  const classId = normalizeClassId(combatant?.classDef, "");
  return (
    options.isHit === true &&
    options.attacker?.id &&
    options.attacker.id !== "player" &&
    combatant?.id === "player" &&
    classId === "guardian" &&
    (combatant?.level ?? 1) >= 10 &&
    !state.unbreakableLineUsed &&
    incomingDamage > 0
  );
}

function applyUnbreakableLinePrevention(combatant, incomingDamage, options = {}) {
  if (!shouldTriggerUnbreakableLine(combatant, incomingDamage, options)) return incomingDamage;
  state.unbreakableLineUsed = true;
  addLog(`Unbreakable Line \u2014 ${combatant.name} holds the line.`);
  return 0;
}

function shouldTriggerDivineShelter(combatant, incomingDamage, options = {}) {
  return (
    options.isHit === true &&
    options.attacker?.id &&
    options.attacker.id !== "player" &&
    combatant?.id === "player" &&
    isPaladinOathkeeper(combatant, 10) &&
    !state.divineShelterUsed &&
    incomingDamage > 0
  );
}

function applyDivineShelterPrevention(combatant, incomingDamage, options = {}) {
  if (!shouldTriggerDivineShelter(combatant, incomingDamage, options)) return incomingDamage;
  state.divineShelterUsed = true;
  addLog("Divine Shelter negates the attack.");
  return 0;
}

function canTriggerSacredResolve(combatant, incomingDamage) {
  return (
    combatant?.id === "player" &&
    isPaladinClass(combatant) &&
    (combatant?.level ?? 1) >= 10 &&
    !state.sacredResolveUsed &&
    incomingDamage > 0 &&
    combatant.hp - incomingDamage <= 0
  );
}

function shouldTriggerPremonition(combatant, incomingDamage, options = {}) {
  return (
    options.isHit === true &&
    options.attacker?.id &&
    options.attacker.id !== "player" &&
    combatant?.id === "player" &&
    isMysticSeer(combatant, 7) &&
    !state.premonitionUsed &&
    incomingDamage > 0
  );
}

function applyPremonitionPrevention(combatant, incomingDamage, options = {}) {
  if (!shouldTriggerPremonition(combatant, incomingDamage, options)) return incomingDamage;
  state.premonitionUsed = true;
  addLog("Premonition avoids the attack.");
  return 0;
}

function getInvisibleHandReduction(defender, damage) {
  if (!isMysticTelekinetic(defender, 15) || state.invisibleHandUsed || damage < 1) return 0;
  return Math.max(1, Math.floor(damage * 0.5));
}

function getWeakenedFinalDamageReduction(attacker, defender, finalDamage) {
  if (!hasStatus(attacker, "weakened") || finalDamage < 1 || defender?.id !== "player") return 0;
  return Math.floor(finalDamage * 0.25);
}

function getDominatingPresenceDamageReduction(attacker, defender, finalDamage) {
  if (!isGuardianSentinel(defender, 15) || finalDamage < 1) return 0;
  if (!hasStatus(attacker, "stun") && !hasStatus(attacker, "freeze")) return 0;
  return Math.floor(finalDamage * 0.25);
}

function isMindOverMatterActive(combatant) {
  return (
    combatant?.id === "player" &&
    normalizeClassId(combatant?.classDef, "") === "magician" &&
    combatant?.subclassId === "sage" &&
    (combatant?.level ?? 1) >= 15
  );
}

function shouldTriggerMindOverMatter(combatant, incomingDamage, options = {}) {
  return (
    options.isHit === true &&
    options.attacker?.id &&
    options.attacker.id !== "player" &&
    isMindOverMatterActive(combatant) &&
    !state.mindOverMatterUsed &&
    incomingDamage > 0
  );
}

function applyMindOverMatterPrevention(combatant, incomingDamage, options = {}) {
  if (!shouldTriggerMindOverMatter(combatant, incomingDamage, options)) return incomingDamage;
  state.mindOverMatterUsed = true;
  addLog(`Mind Over Matter \u2014 ${combatant.name} nullifies the attack.`);
  return 0;
}

function resetMindOverMatter() {
  state.mindOverMatterUsed = false;
}

function applyFlatDamageReduction(currentDamage, reduction, logMessage) {
  if (reduction <= 0 || currentDamage <= 0) return currentDamage;
  const reducedDamage = Math.max(0, currentDamage - reduction);
  if (reducedDamage !== currentDamage) addLog(logMessage);
  return reducedDamage;
}

function applyIncomingDamageModifiers(defender, damage, options = {}) {
  if (options.ignoreDamageReduction) {
    const safeDamage = Math.max(0, damage);
    const wouldReduce =
      safeDamage > 0 &&
      (getShieldMasteryReduction(defender) > 0 ||
        getShieldWallReduction(defender) > 0 ||
        getReinforcedGuardReduction(defender) > 0 ||
        getFortressHeartReduction(defender) > 0 ||
        getGuardianLastStandReduction(defender) > 0 ||
        getHeavyMomentumReduction(defender) > 0 ||
        getFortressStanceReduction(defender) > 0 ||
        getMountainStanceReduction(defender, safeDamage) > 0 ||
        getGuardianBastionReduction(defender, safeDamage) > 0 ||
        getAuraOfProtectionReduction(defender) > 0 ||
        getEternalOathReduction(defender, safeDamage) > 0 ||
        getLivingWallReduction(defender, safeDamage) > 0);
    if (wouldReduce) {
      addLog("Living Weapon ignores damage reduction.");
    }
    return safeDamage;
  }
  let modifiedDamage = Math.max(0, damage);
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getShieldWallReduction(defender), "Shield Wall reduces damage by 1.");
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getShieldMasteryReduction(defender), "Shield Mastery reduces damage by 1.");
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getReinforcedGuardReduction(defender), "Reinforced Guard reduces damage by 1.");
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getFortressHeartReduction(defender), "Fortress Heart reduces damage by 2.");
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getGuardianLastStandReduction(defender), "Last Stand reduces damage by 2.");
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getHeavyMomentumReduction(defender), "Heavy Momentum reduces damage by 1.");
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getFortressStanceReduction(defender), "Fortress Stance reduces damage by 3.");
  const mountainStanceReduction = getMountainStanceReduction(defender, modifiedDamage);
  if (mountainStanceReduction > 0) {
    modifiedDamage = Math.max(0, modifiedDamage - mountainStanceReduction);
    addLog("Mountain Stance reduces damage.");
  }
  const guardianBastionReduction = getGuardianBastionReduction(defender, modifiedDamage);
  if (guardianBastionReduction > 0) {
    modifiedDamage = Math.max(0, modifiedDamage - guardianBastionReduction);
    addLog(state.eternalBastionActive ? "Eternal Bastion reduces incoming damage." : "Immovable Bastion reduces incoming damage.");
  }
  modifiedDamage = applyFlatDamageReduction(modifiedDamage, getAuraOfProtectionReduction(defender), "Aura of Protection reduces damage by 2.");
  const eternalOathReduction = getEternalOathReduction(defender, modifiedDamage);
  if (eternalOathReduction > 0) {
    modifiedDamage = Math.max(0, modifiedDamage - eternalOathReduction);
    addLog("Eternal Oath reduces incoming damage by 50%.");
  }
  const invisibleHandReduction = getInvisibleHandReduction(defender, modifiedDamage);
  if (invisibleHandReduction > 0) {
    state.invisibleHandUsed = true;
    modifiedDamage = Math.max(0, modifiedDamage - invisibleHandReduction);
    addLog("Invisible Hand reduces incoming damage.");
  }
  const livingWallReduction = getLivingWallReduction(defender, modifiedDamage);
  if (livingWallReduction > 0) {
    modifiedDamage = Math.max(0, modifiedDamage - livingWallReduction);
    addLog("Living Wall reduces incoming damage by 50%.");
  }
  if (isBerserkerFrenzyActive(defender) && modifiedDamage >= 1) {
    const extraDamage = Math.max(1, Math.ceil(modifiedDamage * 0.1));
    modifiedDamage += extraDamage;
    addLog(`Frenzy leaves ${defender.name} exposed: +${extraDamage} damage.`);
  }
  return modifiedDamage;
}

function applyIncomingDamage(combatant, incomingDamage, options = {}) {
  const modifiedDamage = applyIncomingDamageModifiers(combatant, incomingDamage, options);
  const ghostStepDamage = applyGhostStepPrevention(combatant, modifiedDamage, options);
  const monkGhostStepDamage = applyMonkGhostStepPrevention(combatant, ghostStepDamage, options);
  const unbreakableLineDamage = applyUnbreakableLinePrevention(combatant, monkGhostStepDamage, options);
  const divineShelterDamage = applyDivineShelterPrevention(combatant, unbreakableLineDamage, options);
  const premonitionDamage = applyPremonitionPrevention(combatant, divineShelterDamage, options);
  const mindOverMatterDamage = applyMindOverMatterPrevention(combatant, premonitionDamage, options);
  const safeDamage = options.isHit === true ? applyEvasionReduction(combatant, mindOverMatterDamage) : mindOverMatterDamage;
  if (canTriggerVeteransGrit(combatant, safeDamage)) {
    combatant.hp = 1;
    state.veteranGritUsed = true;
    addLog(`Veteranâ€™s Grit triggers â€” ${combatant.name} refuses to fall.`);
    return;
  }
  if (canTriggerUnbreakable(combatant, safeDamage)) {
    combatant.hp = 1;
    state.unbreakableUsed = true;
    addLog(`Unbreakable triggers â€” ${combatant.name} stands firm at 1 HP.`);
    return;
  }
  if (canTriggerSacredResolve(combatant, safeDamage)) {
    combatant.hp = 1;
    state.sacredResolveUsed = true;
    addLog(`Sacred Resolve triggers \u2014 ${combatant.name} stands at 1 HP.`);
    return;
  }
  combatant.hp = Math.max(0, combatant.hp - safeDamage);
  if (safeDamage > 0 && combatant?.id === "player" && isGuardianSentinel(combatant, 7)) {
    state.crushingCounterActive = true;
  }
}

function applyDamageTraits(defender, damage, damageType, options = {}) {
  let finalDamage = damage;
  const notes = [];
  if (defender.resistances.includes(damageType)) {
    if (!options.ignoreResistance) {
      finalDamage = Math.floor(finalDamage / 2);
      notes.push(`${defender.name} resists ${damageType}`);
    }
  }
  if (defender.weaknesses.includes(damageType)) {
    finalDamage += 2;
    notes.push(`${defender.name} is weak to ${damageType} +2`);
  }
  const reduction = getClassDamageReduction(defender) + getStatusDamageReduction(defender);
  if (reduction > 0) {
    if (options.ignoreDamageReduction) {
      notes.push("Living Weapon ignores damage reduction");
    } else {
      finalDamage = Math.max(0, finalDamage - reduction);
      notes.push(`${defender.name} reduces damage by ${reduction}`);
    }
  }
  return { finalDamage, notes };
}

function applyStatus(target, statusId, sourceName, sourceLevel = 1, options = {}) {
  const def = statusDefinitions[statusId];
  if (!def) return false;
  if (isStatusImmune(target, statusId)) {
    addLog(getStatusImmunityLog(target, statusId));
    return false;
  }
  const durationBonus = Math.max(0, options.durationBonus ?? 0);
  const sourceClassId = normalizeClassId(options.sourceClassId, "");
  const sourceSubclassId = options.sourceSubclassId ?? null;
  const existing = target.statuses.find((status) => status.id === statusId);
  if (existing) {
    existing.duration = Math.max(existing.duration, def.duration + durationBonus);
    existing.sourceLevel = Math.max(existing.sourceLevel ?? 1, sourceLevel);
    if (sourceClassId) existing.sourceClassId = sourceClassId;
    if (sourceSubclassId) existing.sourceSubclassId = sourceSubclassId;
  } else {
    target.statuses.push({
      id: statusId,
      duration: def.duration + durationBonus,
      sourceLevel,
      ...(sourceClassId ? { sourceClassId } : {}),
      ...(sourceSubclassId ? { sourceSubclassId } : {}),
    });
  }
  addLog(`${sourceName} applies ${def.name} to ${target.name}.`);
  if (statusId === "shielded" && isPaladinOathkeeper(target, 3)) {
    addLog("Sacred Vow grants +1 Defense while Shielded.");
  }
  if (statusId === "shielded" && isMysticTelekinetic(target, 7)) {
    addLog("Kinetic Shield grants +1 Defense while Shielded.");
  }
  if (durationBonus > 0 && statusId === "burn") {
    addLog("Burning Soul extends Burn by 1 turn.");
  }
  triggerRelentlessGuard(options.sourceCombatant, target, statusId);
  return true;
}

function triggerRelentlessGuard(source, target, statusId) {
  if (statusId !== "stun" || target?.id !== "enemy" || !isGuardianSentinel(source, 10)) return;
  applyStatus(source, "guarded", "Relentless Guard", source.level ?? 1, {
    sourceClassId: source.classDef?.id,
    sourceSubclassId: source.subclassId,
  });
  addLog("Relentless Guard grants Guarded.");
}

function isStatusImmune(target, statusId) {
  if (!target || !statusId) return false;
  if ((statusId === "stun" || statusId === "freeze") && isGuardianIronFortressActive(target)) return true;
  if (statusId === "stun" && isGuardianStonebloodActive(target)) return true;
  if (isPaladinOathkeeper(target, 15) && isUnbrokenOathStatus(statusId)) return true;
  if (statusId === "stun" && isMysticClass(target) && (target?.level ?? 1) >= 13) return true;
  if (isMonkBodyAdamantSoulActive(target) && isAdamantSoulStatus(statusId)) return true;
  if (statusId === "stun" && isIronWillActive(target)) return true;

  const directImmunities = new Set(target.statusImmunities ?? []);
  const templateId = target.templateId ?? target.id;
  const templateImmunities = enemyTemplates[templateId]?.statusImmunities ?? [];
  templateImmunities.forEach((immunity) => directImmunities.add(immunity));

  // Older saved combats may not have templateId/statusImmunities on the enemy snapshot.
  const normalizedName = String(target.name ?? "").toLowerCase();
  if (normalizedName === "skeleton") {
    (enemyTemplates.skeleton.statusImmunities ?? []).forEach((immunity) => directImmunities.add(immunity));
  }

  return directImmunities.has(statusId);
}

function getStatusImmunityLog(target, statusId) {
  if ((statusId === "stun" || statusId === "freeze") && isGuardianIronFortressActive(target)) {
    const statusName = statusDefinitions[statusId]?.name ?? statusId;
    return `Iron Fortress prevents ${statusName}.`;
  }
  if (statusId === "stun" && isGuardianStonebloodActive(target)) return "Stoneblood prevents Stun.";
  if (isPaladinOathkeeper(target, 15) && isUnbrokenOathStatus(statusId)) {
    const statusName = statusDefinitions[statusId]?.name ?? statusId;
    return `Unbroken Oath prevents ${statusName}.`;
  }
  if (statusId === "stun" && isMysticClass(target) && (target?.level ?? 1) >= 13) return "Mental Fortress prevents Stun.";
  if (isMonkBodyAdamantSoulActive(target) && statusId === "bleed") return "Adamant Soul prevents Bleed.";
  if (isMonkBodyAdamantSoulActive(target) && statusId === "stun") return "Adamant Soul prevents Stun.";
  if (statusId === "stun" && isIronWillActive(target)) return "Iron Will prevents Stun.";
  const statusName = statusDefinitions[statusId]?.name ?? statusId;
  return `${target.name} is immune to ${statusName}.`;
}

function maybeApplyStatus(source, target, status, sourceName, effectSource = null) {
  if (!status) return;
  const statusName = statusDefinitions[status.id]?.name ?? status.id;
  if (isStatusImmune(target, status.id)) {
    addLog(getStatusImmunityLog(target, status.id));
    return;
  }
  const chance = calculateEffectChance(source, effectSource ?? { status });
  if (!chance) return;
  if (getMentalOverloadStatusChanceBonus(source, effectSource ?? { status }) > 0) {
    addLog("Mental Overload increases status chance.");
  }
  if (getParalyzingVisionStatusChanceBonus(source, effectSource ?? { status }) > 0) {
    addLog("Paralyzing Vision increases status chance.");
  }
  const statusRoll = rollStatusChance(chance.chancePercent);
  const rollValue = statusRoll.rollValue;
  if (chance.usesScaling) {
    addLog(`${statusName} chance: ${chance.chancePercent}% (${chance.baseEffectChance}% base + ${chance.effectScalingStat} scaling, max ${chance.maxEffectChance}%).`);
  } else {
    addLog(`${statusName} chance: ${chance.chancePercent}%.`);
  }
  if (statusRoll.succeeds) {
    addLog(`Rolled ${rollValue} -> ${statusName} applied.`);
    applyStatus(target, status.id, sourceName, source?.level ?? 1, {
      durationBonus: getBurningSoulBurnDurationBonus(source, effectSource ?? { status }, status.id) + Math.max(0, effectSource?.statusDurationBonus ?? 0),
      sourceClassId: source?.classDef?.id,
      sourceSubclassId: source?.subclassId,
      sourceCombatant: source,
    });
  } else {
    addLog(`Rolled ${rollValue} -> No ${statusName.toLowerCase()}.`);
  }
}

function isInfernoHeartBurn(status, combatant) {
  if (status?.id !== "burn") return false;
  if (status.sourceClassId) {
    return status.sourceClassId === "sorcerer" && status.sourceSubclassId === "pyromancer" && (status.sourceLevel ?? 1) >= 15;
  }
  return combatant?.id === "enemy" && isSorcererPyromancerInfernoHeartActive(state.player);
}

function getStatusTickDamage(status, def, combatant) {
  const sourceLevel = status.sourceLevel ?? combatant?.level ?? 1;
  if (status.id === "burn") {
    const baseDamage = def.damage + Math.floor(sourceLevel / 25);
    if (isInfernoHeartBurn(status, combatant)) {
      addLog("Inferno Heart doubles Burn damage.");
      return baseDamage * 2;
    }
    return baseDamage;
  }
  if (status.id === "bleed") return def.damage + Math.floor(sourceLevel / 30);
  if (status.id === "poison") return def.damage + Math.floor(sourceLevel / 35);
  return def.damage;
}

function tickStatuses(combatant, timing) {
  combatant.statuses = combatant.statuses.filter((status) => {
    const def = statusDefinitions[status.id];
    if (isStatusImmune(combatant, status.id)) {
      addLog(getStatusImmunityLog(combatant, status.id));
      return false;
    }
    if (def.tick === timing && def.damage) {
      const tickDamage = getStatusTickDamage(status, def, combatant);
      applyIncomingDamage(combatant, tickDamage);
      addLog(`${combatant.name} suffers ${tickDamage} ${def.damageType} from ${def.name}.`);
    }
    if (timing === "end" && !def.expiresAtStartOfNextPlayerTurn) {
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
    return false;
  }

  if (attacker.id === "player" && !options.followUp) {
    markMajorActionUsed(options.skill?.name ?? "Attack");
  } else if (attacker.id !== "player" && !options.followUp) {
    state.actionUsed = true;
  }
  const defender = targetFor(attacker);
  const attackOrSkill = options.skill ?? attack;
  if (attacker.id === "enemy" && defender?.id === "player" && state.perfectPredictionActive && isMysticSeer(defender, 20)) {
    state.perfectPredictionActive = false;
    addLog("Perfect Prediction \u2014 the enemy attack misses.");
    return false;
  }
  const attackDie = roll(20);
  const focusBonus = consumeNextRollBonus(attacker);
  if (focusBonus > 0) {
    addLog(`${attacker.name}'s Focus adds +${focusBonus} to this roll.`);
  }
  const recklessBonus = getRecklessSlaughterHitBonus(attacker, defender, attackOrSkill);
  if (recklessBonus > 0) {
    if (isBerserkerRecklessSlaughterActive(attacker)) {
      addLog("Reckless Slaughter sharpens the attack: +2 hit.");
    } else if (isBerserkerRecklessSlaughterActive(defender)) {
      addLog(`Reckless Slaughter leaves ${defender.name} exposed: enemy +2 hit.`);
    }
  }
  const quickReadBonus = getQuickReadHitBonus(attacker, attackOrSkill);
  if (quickReadBonus > 0) {
    addLog("Quick Read sharpens the strike: +2 hit.");
  }
  const flowingStrikesBonus = getFlowingStrikesHitBonus(attacker, attackOrSkill);
  if (flowingStrikesBonus > 0) {
    addLog("Flowing Strikes sharpens the first blow: +2 hit.");
  }
  const studiedCastingBonus = getStudiedCastingHitBonus(attacker, options.skill);
  if (studiedCastingBonus > 0) {
    addLog("Studied Casting sharpens the spell: +2 hit.");
  }
  const arcaneInsightBonus = getArcaneInsightHitBonus(attacker, options.skill);
  const arcaneInsightPenaltyOffset = getArcaneInsightPenaltyOffset(attacker, options.skill);
  if (consumeArcaneInsight(attacker, options.skill)) {
    addLog("Arcane Insight guides the spell: +2 hit, penalties ignored.");
  }
  const staticChargeBonus = getStaticChargeHitBonus(attacker, options.skill);
  if (staticChargeBonus > 0) {
    addLog("Static Charge sharpens the lightning strike: +2 hit.");
  }
  const foresightBonus = getForesightHitBonus(attacker, attackOrSkill);
  if (foresightBonus > 0) {
    addLog("Foresight sharpens the attack: +2 hit.");
  }
  const openMindIgnoresPenalties = shouldOpenMindIgnorePenalties(attacker, attackOrSkill) && getStatusHitPenalty(attacker) < 0;
  if (openMindIgnoresPenalties) {
    addLog("Open Mind ignores hit penalties.");
  }
  const untouchablePenalty = getScoutUntouchableHitPenalty(attacker, defender);
  if (untouchablePenalty < 0) {
    addLog("Untouchable hinders the attack: -2 hit.");
  }
  const vanishedPenalty = getVanishedHitPenalty(attacker, defender);
  const watchfulEyePenalty = getWatchfulEyeHitPenalty(attacker, defender);
  if (watchfulEyePenalty < 0) {
    addLog("Watchful Eye hinders the attack: -1 hit.");
  }
  markQuickReadAttempt(attacker, attackOrSkill);
  markFlowingStrikesAttempt(attacker, attackOrSkill);
  markForesightAttempt(attacker, attackOrSkill);
  const extraHitBonus =
    (options.extraHitBonus ?? 0) +
    focusBonus +
    recklessBonus +
    quickReadBonus +
    flowingStrikesBonus +
    studiedCastingBonus +
    arcaneInsightBonus +
    arcaneInsightPenaltyOffset +
    staticChargeBonus +
    foresightBonus +
    untouchablePenalty +
    vanishedPenalty +
    watchfulEyePenalty;
  const parts = options.skill ? getSkillParts(attacker, options.skill, extraHitBonus) : getAttackParts(attacker, attack, extraHitBonus);
  const attackTotal = attackDie + sumParts(parts);
  const mindPierceReduction = getMindPierceDefenseReduction(attacker, attackOrSkill);
  if (mindPierceReduction > 0) {
    addLog("Mind Pierce weakens the target's Defense.");
  }
  const defenderAc = Math.max(0, getAc(defender) - mindPierceReduction);
  const isNaturalTwenty = attackDie === 20;
  const naturalCrit = isNaturalTwenty || attackDie >= getEffectiveCritMin(attacker, attackOrSkill);
  const perfectFocusTriggers = consumePerfectFocusForSkill(attacker, options.skill);
  const stormAvatarTriggers = consumeStormAvatarForSkill(attacker, options.skill);
  const trueSightTriggers = consumeTrueSightForSkill(attacker, attackOrSkill);
  const gravityBreakTriggers = consumeGravityBreakForSkill(attacker, attackOrSkill);
  const hit = perfectFocusTriggers || stormAvatarTriggers || trueSightTriggers || naturalCrit || (attackDie !== 1 && attackTotal >= defenderAc);
  const assassinateTriggers = shouldTriggerAssassinate(attacker, attackOrSkill, hit);
  const wrathIncarnateTriggers = hit && canTriggerWrathIncarnateCrit(attacker, attackOrSkill);
  const isCrit = naturalCrit || assassinateTriggers || wrathIncarnateTriggers;
  const shadowFlurryTriggers = recordShadowFlurryAttempt(attacker, hit, options);
  attacker.hasAttacked = true;

  if (hit) {
    const damageDice = isCrit
      ? { ...attack.damageDice, count: attack.damageDice.count * 2 }
      : attack.damageDice;
    const executionerApplies = shouldApplyExecutioner(attacker, defender, attackOrSkill);
    const damageRoll = rollDamageDice(damageDice);
    const damageBonusParts = getDamageBonusParts(attacker, defender, attack, attackOrSkill);
    const bloodlustBonus = getBloodlustBonus(attacker, attack);
    const totalDamage = damageRoll.total + sumParts(damageBonusParts);
    const livingWeaponIgnoresDamageReduction = isMonkBodyLivingWeaponUnarmedAttack(attacker, attackOrSkill);
    const traitResult = applyDamageTraits(defender, Math.max(0, totalDamage), attack.damageType, {
      ignoreResistance: Boolean(options.ignoreResistance),
      ignoreDamageReduction: livingWeaponIgnoresDamageReduction,
    });
    const innerLightBaseBonus = getInnerLightDamageBonus(attacker, attackOrSkill);
    const innerLightTraitResult = innerLightBaseBonus > 0
      ? applyDamageTraits(defender, innerLightBaseBonus, "lightning", {
          ignoreResistance: Boolean(options.ignoreResistance),
          ignoreDamageReduction: livingWeaponIgnoresDamageReduction,
        })
      : { finalDamage: 0, notes: [] };
    const astralFistBaseBonus = getAstralFistDamageBonus(attacker, attackOrSkill);
    const astralFistTraitResult = astralFistBaseBonus > 0
      ? applyDamageTraits(defender, astralFistBaseBonus, "lightning", {
          ignoreResistance: Boolean(options.ignoreResistance),
          ignoreDamageReduction: livingWeaponIgnoresDamageReduction,
        })
      : { finalDamage: 0, notes: [] };
    const spiritStrikesBaseBonus = getMonkSpiritStrikesDamageBonus(attacker, attackOrSkill);
    const spiritStrikesTraitResult = spiritStrikesBaseBonus > 0
      ? applyDamageTraits(defender, spiritStrikesBaseBonus, "lightning", {
          ignoreResistance: Boolean(options.ignoreResistance),
          ignoreDamageReduction: livingWeaponIgnoresDamageReduction,
        })
      : { finalDamage: 0, notes: [] };
    const divineSmiteBaseBonus = getDivineSmiteDamageBonus(attacker, attackOrSkill);
    const divineSmiteTraitResult = divineSmiteBaseBonus > 0
      ? applyDamageTraits(defender, divineSmiteBaseBonus, "lightning", {
          ignoreResistance: Boolean(options.ignoreResistance),
          ignoreDamageReduction: livingWeaponIgnoresDamageReduction,
        })
      : { finalDamage: 0, notes: [] };
    const forcePushBaseBonus = getForcePushDamageBonus(attacker, attackOrSkill);
    const forcePushTraitResult = forcePushBaseBonus > 0
      ? applyDamageTraits(defender, forcePushBaseBonus, "lightning", {
          ignoreResistance: Boolean(options.ignoreResistance),
          ignoreDamageReduction: livingWeaponIgnoresDamageReduction,
        })
      : { finalDamage: 0, notes: [] };
    const executionerBonus = executionerApplies && traitResult.finalDamage >= 1
      ? Math.max(1, Math.floor(traitResult.finalDamage * 0.5))
      : 0;
    const normalFinalDamage =
      traitResult.finalDamage +
      innerLightTraitResult.finalDamage +
      astralFistTraitResult.finalDamage +
      spiritStrikesTraitResult.finalDamage +
      divineSmiteTraitResult.finalDamage +
      forcePushTraitResult.finalDamage +
      executionerBonus;
    const whirlwindBonus = getWhirlwindCleaveSingleTargetBonus(options.skill, normalFinalDamage);
    const preSneakDamage = normalFinalDamage + whirlwindBonus;
    const exploitWeaknessBonus = getExploitWeaknessBonus(attacker, defender, attackOrSkill, preSneakDamage);
    const preSneakDamageWithExploit = preSneakDamage + exploitWeaknessBonus;
    const sneakAttackBonus = getSneakAttackBonus(attacker, preSneakDamageWithExploit);
    const deathsOpeningBonus = getDeathsOpeningBonus(attacker, preSneakDamageWithExploit);
    const preKindlingDamage = preSneakDamageWithExploit + sneakAttackBonus + deathsOpeningBonus;
    const kindlingBonus = getKindlingDamageBonus(attacker, defender, attackOrSkill, preKindlingDamage);
    const conductiveShockBonus = getConductiveShockDamageBonus(attacker, defender, attackOrSkill, preKindlingDamage);
    const preDeathmarkDamage = preKindlingDamage + kindlingBonus + conductiveShockBonus;
    const deathmarkBonus = getDeathmarkDamageBonus(attacker, defender, preDeathmarkDamage);
    const perfectExecutionBonus = deathmarkBonus > 0 ? 0 : getPerfectExecutionDamageBonus(attacker, attackOrSkill, preDeathmarkDamage);
    const preMasterDamage = preDeathmarkDamage + deathmarkBonus + perfectExecutionBonus;
    const cataclysmBonus = getCataclysmDamageBonus(attacker, options.skill, preMasterDamage, options);
    const overchannelBonus = cataclysmBonus > 0 ? 0 : getOverchannelDamageBonus(attacker, options.skill, preMasterDamage, options);
    const preMasterDamageWithSpellEmpowerment = preMasterDamage + cataclysmBonus + overchannelBonus;
    const masterOfMagicBonus = cataclysmBonus > 0 || overchannelBonus > 0
      ? 0
      : getMasterOfMagicDamageBonus(attacker, options.skill, preMasterDamageWithSpellEmpowerment, options);
    const preOverloadDamage = preMasterDamageWithSpellEmpowerment + masterOfMagicBonus;
    const overloadBonus = cataclysmBonus > 0 || masterOfMagicBonus > 0
      ? 0
      : getOverloadDamageBonus(attacker, options.skill, preOverloadDamage, options);
    const preArcaneCataclysmDamage = preOverloadDamage + overloadBonus;
    const arcaneCataclysmBonus = cataclysmBonus > 0 || masterOfMagicBonus > 0 || overloadBonus > 0
      ? 0
      : getArcaneCataclysmDamageBonus(attacker, options.skill, preArcaneCataclysmDamage, options);
    const preWorldfireDamage = preArcaneCataclysmDamage + arcaneCataclysmBonus;
    const worldfireBonus = cataclysmBonus > 0 || masterOfMagicBonus > 0 || overloadBonus > 0 || arcaneCataclysmBonus > 0
      ? 0
      : getWorldfireDamageBonus(attacker, options.skill, preWorldfireDamage, options);
    const preStormAvatarDamage = preWorldfireDamage + worldfireBonus;
    const stormAvatarBonus = cataclysmBonus > 0 || masterOfMagicBonus > 0 || overloadBonus > 0 || arcaneCataclysmBonus > 0 || worldfireBonus > 0
      ? 0
      : getStormAvatarDamageBonus(attacker, options.skill, preStormAvatarDamage, stormAvatarTriggers);
    const preWildCastingDamage = preStormAvatarDamage + stormAvatarBonus;
    const wildCastingResult = applyWildCasting(attacker, defender, options.skill, attack, preWildCastingDamage);
    const preGuardianDamage = preWildCastingDamage + wildCastingResult.damageBonus;
    const crushingCounterBonus = getCrushingCounterDamageBonus(attacker, preGuardianDamage);
    const prePaladinDamage = preGuardianDamage + crushingCounterBonus;
    const judgmentBrandBonus = getJudgmentBrandDamageBonus(attacker, defender, attackOrSkill, prePaladinDamage);
    const preHolyJudgmentDamage = prePaladinDamage + judgmentBrandBonus;
    const holyJudgmentBonus = getHolyJudgmentDamageBonus(attacker, defender, preHolyJudgmentDamage);
    const preRighteousExecutionDamage = preHolyJudgmentDamage + holyJudgmentBonus;
    const righteousExecutionBonus = getRighteousExecutionDamageBonus(attacker, defender, attack, preRighteousExecutionDamage);
    const preDivineChampionDamage = preRighteousExecutionDamage + righteousExecutionBonus;
    const divineChampionBonus = getDivineChampionDamageBonus(attacker, attackOrSkill, preDivineChampionDamage);
    const preMysticDamage = preDivineChampionDamage + divineChampionBonus;
    const crushingGripBonus = getCrushingGripDamageBonus(attacker, defender, attackOrSkill, preMysticDamage);
    const preTrueSightDamage = preMysticDamage + crushingGripBonus;
    const doubleDamageAlreadyApplied =
      deathmarkBonus > 0 ||
      perfectExecutionBonus > 0 ||
      cataclysmBonus > 0 ||
      masterOfMagicBonus > 0 ||
      overloadBonus > 0 ||
      arcaneCataclysmBonus > 0 ||
      worldfireBonus > 0 ||
      stormAvatarBonus > 0 ||
      divineChampionBonus > 0;
    const trueSightBonus = doubleDamageAlreadyApplied ? 0 : getTrueSightDamageBonus(attacker, attackOrSkill, preTrueSightDamage, trueSightTriggers);
    const preGravityBreakDamage = preTrueSightDamage + trueSightBonus;
    const gravityBreakBonus = trueSightBonus > 0 ? 0 : getGravityBreakDamageBonus(attacker, attackOrSkill, preGravityBreakDamage, gravityBreakTriggers);
    const preEnemyReductionDamage = preGravityBreakDamage + gravityBreakBonus;
    const weakenedReduction = getWeakenedFinalDamageReduction(attacker, defender, preEnemyReductionDamage);
    const dominatingPresenceReduction = getDominatingPresenceDamageReduction(attacker, defender, preEnemyReductionDamage - weakenedReduction);
    const finalDamage = Math.max(0, preEnemyReductionDamage - weakenedReduction - dominatingPresenceReduction);
    const arcJumpTriggers = state.arcJumpActive && isSorcererStormcallerArcJumpActive(attacker) && isArcJumpEligibleSkill(options.skill);
    const arcJumpDamage = arcJumpTriggers ? getArcJumpDamage(attacker, options.skill, finalDamage) : 0;
    const spellEchoTriggers = shouldTriggerSpellEcho(attacker, options.skill, finalDamage);
    if (sneakAttackBonus > 0) {
      state.sneakAttackUsed = true;
    }
    if (deathsOpeningBonus > 0) {
      state.deathsOpeningUsed = true;
    }
    if (assassinateTriggers) {
      state.assassinateUsed = true;
    }
    if (deathmarkBonus > 0 || perfectExecutionBonus > 0) {
      clearDeathmark();
      clearPerfectExecution();
    }
    if (cataclysmBonus > 0 || overchannelBonus > 0 || masterOfMagicBonus > 0 || overloadBonus > 0 || arcaneCataclysmBonus > 0 || worldfireBonus > 0 || stormAvatarBonus > 0) {
      state.cataclysmActive = false;
      state.overchannelActive = false;
      state.masterOfMagicActive = false;
      state.overloadActive = false;
      state.arcaneCataclysmActive = false;
      state.worldfireActive = false;
      state.stormAvatarActive = false;
    }
    if (spellEchoTriggers) {
      state.spellEchoUsed = true;
    }
    if (crushingCounterBonus > 0) {
      state.crushingCounterActive = false;
    }
    if (judgmentBrandBonus > 0) {
      clearJudgmentBrand();
    }
    if (divineChampionBonus > 0) {
      state.divineChampionActive = false;
    }
    if (trueSightBonus > 0) {
      state.trueSightActive = false;
    }
    if (gravityBreakBonus > 0) {
      state.gravityBreakActive = false;
    }
    if (wrathIncarnateTriggers) {
      state.wrathIncarnateActive = false;
    }
    applyIncomingDamage(defender, finalDamage, { isHit: true, attacker, ignoreDamageReduction: livingWeaponIgnoresDamageReduction });
    if (arcJumpTriggers) {
      state.arcJumpActive = false;
    }
    const bonusText = damageBonusParts.length ? ` + ${damageBonusParts.map((part) => `${part.label} ${part.value}`).join(" + ")}` : "";
    const traitNotes = [...new Set([...traitResult.notes, ...innerLightTraitResult.notes, ...astralFistTraitResult.notes, ...spiritStrikesTraitResult.notes, ...divineSmiteTraitResult.notes, ...forcePushTraitResult.notes])];
    const traitText = traitNotes.length ? ` ${traitNotes.join("; ")}.` : "";
    const sourceName = options.skill?.name ?? attack.name;
    const critText = isCrit ? " CRITICAL HIT!" : "";

    addLog(`${attacker.name} uses ${sourceName}: ${formatRollMath(attackDie, parts)} vs ${defender.name} Defense ${defenderAc} -> HIT.${critText} Damage ${formatDice(damageDice)} (${damageRoll.rolls.join(", ")})${bonusText} = ${finalDamage} ${attack.damageType}.${traitText}`);
    if (executionerBonus > 0) {
      addLog(`Executioner triggers: +${executionerBonus} damage against a weakened foe.`);
    }
    if (whirlwindBonus > 0) {
      const whirlwindLog = options.skill?.singleTargetDamageBonusPercent > 0.25
        ? "Whirlwind Cleave+ tears through the lone foe"
        : "Whirlwind Cleave crashes through the lone foe";
      addLog(`${whirlwindLog}: +${whirlwindBonus} damage.`);
    }
    if (sneakAttackBonus > 0) {
      addLog(`Sneak Attack! ${attacker.name} exploits an opening for +${sneakAttackBonus} damage.`);
    }
    if (deathsOpeningBonus > 0) {
      addLog(`Death\u2019s Opening triggers: +${deathsOpeningBonus} damage.`);
    }
    if (kindlingBonus > 0) {
      addLog(`Kindling triggers: +${kindlingBonus} fire damage against a Burning foe.`);
    }
    if (conductiveShockBonus > 0) {
      addLog(`Conductive Shock triggers: +${conductiveShockBonus} lightning damage against a vulnerable foe.`);
    }
    if (assassinateTriggers) {
      addLog("Assassinate triggers \u2014 the hit becomes a critical strike.");
    }
    if (exploitWeaknessBonus > 0) {
      addLog(`Exploit Weakness triggers: +${exploitWeaknessBonus} damage against a vulnerable foe.`);
    }
    if (deathmarkBonus > 0) {
      addLog("Deathmark triggers: damage doubled.");
    }
    if (perfectExecutionBonus > 0) {
      addLog("Perfect Execution triggers: damage doubled.");
    }
    if (overchannelBonus > 0) {
      addLog(`Overchannel adds +${overchannelBonus} spell damage.`);
    }
    if (cataclysmBonus > 0) {
      addLog("Cataclysm doubles the spell\u2019s damage.");
    }
    if (masterOfMagicBonus > 0) {
      addLog("Master of Magic doubles the spell\u2019s damage.");
    }
    if (overloadBonus > 0) {
      addLog("Overload doubles the spell\u2019s damage.");
    }
    if (arcaneCataclysmBonus > 0) {
      addLog("Arcane Cataclysm doubles the spell\u2019s damage.");
    }
    if (worldfireBonus > 0) {
      applyWorldfireBurn(attacker, defender, options.skill);
    }
    if (stormAvatarBonus > 0) {
      addLog("Storm Avatar makes the spell hit and doubles its damage.");
    }
    if (wildCastingResult.damageBonus > 0) {
      addLog(`Wild Casting adds +${wildCastingResult.damageBonus} spell damage.`);
    }
    if (crushingCounterBonus > 0) {
      addLog(`Crushing Counter triggers: +${crushingCounterBonus} damage.`);
    }
    if (judgmentBrandBonus > 0) {
      addLog(`Judgment Brand triggers: +${judgmentBrandBonus} damage.`);
    }
    if (holyJudgmentBonus > 0) {
      addLog(`Holy Judgment triggers: +${holyJudgmentBonus} damage.`);
    }
    if (righteousExecutionBonus > 0) {
      addLog(`Righteous Execution triggers: +${righteousExecutionBonus} holy damage.`);
    }
    if (divineChampionBonus > 0) {
      addLog("Divine Champion doubles the strike's damage.");
    }
    if (crushingGripBonus > 0) {
      addLog(`Crushing Grip triggers: +${crushingGripBonus} damage.`);
    }
    if (trueSightBonus > 0) {
      addLog("True Sight doubles the Mind attack's damage.");
    }
    if (gravityBreakBonus > 0) {
      addLog("Gravity Break doubles the attack and applies Stun.");
    }
    if (wrathIncarnateTriggers) {
      addLog("Wrath Incarnate turns the strike into a critical hit.");
    }
    if (weakenedReduction > 0) {
      addLog("Weakened reduces the attack's damage.");
    }
    if (dominatingPresenceReduction > 0) {
      addLog("Dominating Presence weakens the enemy's attack.");
    }
    if (innerLightBaseBonus > 0) {
      addLog("Inner Light adds +2 spiritual damage.");
    }
    if (astralFistBaseBonus > 0) {
      addLog("Astral Fist adds +2 spiritual damage.");
    }
    if (spiritStrikesBaseBonus > 0) {
      addLog("Spirit Strikes adds +2 spiritual damage.");
    }
    if (divineSmiteBaseBonus > 0) {
      addLog("Divine Smite adds +2 holy damage.");
    }
    if (forcePushBaseBonus > 0) {
      addLog("Force Push adds +2 psionic damage.");
    }
    if (getVengefulSmiteDamageBonus(attacker, attackOrSkill) > 0) {
      addLog("Vengeful Smite adds +2 damage.");
    }
    if (getIronBodyUnarmedDamageBonus(attacker, attackOrSkill) > 0) {
      addLog("Iron Body adds +1 unarmed damage.");
    }
    if (arcJumpDamage > 0 && living(defender)) {
      applyIncomingDamage(defender, arcJumpDamage, { isHit: true, attacker });
      addLog(`Arc Jump strikes again for ${arcJumpDamage} lightning damage.`);
    }
    if (getEmpoweredCastingBonus(attacker, attackOrSkill) > 0) {
      addLog("Empowered Casting adds +2 spell damage.");
    }
    if (getSorcererArcaneSurgeBonus(attacker, attackOrSkill) > 0) {
      addLog("Arcane Surge adds +3 spell damage.");
    }
    if (getSorcererRawPowerBonus(attacker, attackOrSkill) > 0) {
      addLog("Raw Power adds +2 spell damage.");
    }
    if (getElementalAttunementBonus(attacker, attackOrSkill, attack) > 0) {
      addLog("Elemental Attunement adds +2 elemental damage.");
    }
    if (getBurningSoulDamageBonus(attacker, attackOrSkill) > 0) {
      addLog("Burning Soul adds +2 fire damage.");
    }
    if (spellEchoTriggers && living(defender)) {
      const echoDamage = getSpellEchoDamage(finalDamage);
      applyIncomingDamage(defender, echoDamage, { isHit: true, attacker });
      addLog(`Spell Echo repeats the spell for ${echoDamage} damage.`);
    }
    if (bloodlustBonus > 0) {
      addLog(`Bloodlust adds +${bloodlustBonus} damage.`);
    }
    gainBloodlustStack(attacker, attack);
    if (!wildCastingResult.statusHandled) {
      maybeApplyStatus(attacker, defender, attack.status, sourceName, attackOrSkill);
    }
    if (attackOrSkill?.classId === "guardian" || attackOrSkill?.classId === "paladin") {
      maybeApplyStatus(attacker, attacker, attack.statusSelf, sourceName, attackOrSkill);
    }
    if (shouldApplyJudgmentBrand(attacker, attackOrSkill) && living(defender)) {
      state.judgmentBrandActive = true;
      state.brandedTargetId = defender.id ?? "enemy";
      addLog("Judgment Brand marks the enemy.");
    }
    if (wrathIncarnateTriggers && living(defender)) {
      applyStatus(defender, "stun", "Wrath Incarnate", attacker.level ?? 1, {
        sourceClassId: attacker.classDef?.id,
        sourceSubclassId: attacker.subclassId,
        sourceCombatant: attacker,
      });
    }
    if (gravityBreakBonus > 0 && living(defender)) {
      applyStatus(defender, "stun", "Gravity Break", attacker.level ?? 1, {
        sourceClassId: attacker.classDef?.id,
        sourceSubclassId: attacker.subclassId,
        sourceCombatant: attacker,
      });
    }
    maybeApplyAstralFistStun(attacker, defender, attackOrSkill);
    applyFirestorm(attacker, defender, options.skill);
    maybeApplyDualElements(attacker, defender, options.skill);
    if (!living(defender)) {
      clearDeathmarkIfTarget(defender);
    }
    if (defender.id === "enemy" && !living(defender)) {
      triggerKillersRhythm(attacker);
      triggerGodOfCarnage(attacker);
      triggerRelentlessVengeance(attacker);
    }
    if (shouldTriggerPsychicEcho(attacker, attackOrSkill, finalDamage) && !state.winner && living(defender)) {
      state.psychicEchoUsed = true;
      const echoDamage = getPsychicEchoDamage(finalDamage);
      applyIncomingDamage(defender, echoDamage, { isHit: true, attacker });
      addLog(`Psychic Echo repeats the attack for ${echoDamage} damage.`);
    }
    checkWinner();
    if (shadowFlurryTriggers && !state.winner && living(defender)) {
      addLog(`Shadow Flurry triggers â€” ${attacker.name} strikes again.`);
      resolveAttack(attacker, attacker.weapon, { followUp: true, shadowFlurry: true });
    }
    return true;
  }

  addLog(`${attacker.name} uses ${options.skill?.name ?? attack.name}: ${formatRollMath(attackDie, parts)} vs ${defender.name} Defense ${defenderAc} -> MISS.`);
  maybeTriggerJudgmentWallCounter(attacker, defender, options);
  return false;
}

function maybeTriggerJudgmentWallCounter(attacker, defender, options = {}) {
  if (!state.judgmentWallActive || options.judgmentWallCounter) return;
  if (attacker?.id !== "enemy" || defender?.id !== "player" || !isJudgmentWallFeatureActive(defender) || state.winner || !living(attacker)) return;
  addLog("Judgment Wall counterattacks.");
  resolveAttack(defender, defender.weapon, { followUp: true, judgmentWallCounter: true });
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

function getRestoredResourceKeys(itemDef) {
  const resourceKey = itemDef.restoreType === "hp" ? "hp" : itemDef.restoreType;
  const maxKey = resourceKey === "hp" ? "maxHp" : `max${titleCase(resourceKey)}`;
  return { resourceKey, maxKey };
}

function calculateConsumableRestoreAmount(target, itemDef) {
  const { maxKey } = getRestoredResourceKeys(itemDef);
  let amount = 0;
  if (Number.isFinite(itemDef.restorePercent)) {
    amount = Math.ceil((target[maxKey] ?? 0) * itemDef.restorePercent);
  } else {
    amount = itemDef.restoreRange ? rollRange(itemDef.restoreRange) : 0;
  }
  return amount;
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
    const restoreAmount = calculateConsumableRestoreAmount(state.player, itemDef);
    const { resourceKey, maxKey } = getRestoredResourceKeys(itemDef);
    const oldValue = state.player[resourceKey];
    state.player[resourceKey] = Math.min(state.player[maxKey], state.player[resourceKey] + restoreAmount);
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
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
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

function equipOwnedWeapon(weaponId) {
  if (!state.player) return;
  if (!isBetweenBattles()) {
    addLog("Weapons can only be swapped between battles.");
    renderCombat();
    return;
  }
  if (!canEquipWeaponId(state.player, weaponId)) {
    addLog(`${state.player.name} cannot equip ${safeEntityName(weapons, weaponId)}.`);
    renderCombat();
    return;
  }
  state.player.weapon = weapons[weaponId];
  addLog(`${state.player.name} equips ${state.player.weapon.name}.`);
  renderCombat();
  void saveAdventure("equipment");
}

function sellConsumableItem(itemId) {
  if (!state.player || !isBetweenBattles()) return;
  const item = consumableItems[itemId];
  const quantity = state.player.inventory.consumables[itemId] ?? 0;
  if (!item || quantity <= 0) return;
  const sellValue = getConsumableSellValue(item);
  if (currencyToCopper(sellValue) <= 0) return;
  state.player.inventory.consumables[itemId] = quantity - 1;
  addCurrency(state.player.inventory, sellValue);
  addLog(`Sold ${item.name} for ${formatCurrencyCompact(sellValue)}.`);
  renderCombat();
  void saveAdventure("sale");
}

function sellOwnedWeapon(weaponId) {
  if (!state.player || !isBetweenBattles()) return;
  const inventory = state.player.inventory;
  const weaponIndex = inventory.weapons.indexOf(weaponId);
  if (weaponIndex < 0 || weaponId === "unarmed") return;
  const weaponName = safeEntityName(weapons, weaponId);
  const equipped = state.player.weapon?.id === weaponId;
  if (equipped) {
    const fallbackWeaponId = findFallbackWeaponId(state.player, weaponId);
    if (fallbackWeaponId) {
      const confirmed = window.confirm(`Sell equipped ${weaponName}? ${safeEntityName(weapons, fallbackWeaponId)} will be equipped instead.`);
      if (!confirmed) return;
      state.player.weapon = weapons[fallbackWeaponId];
    } else if (getValidWeaponIdsForClass(state.player.classDef?.id).includes("unarmed")) {
      const confirmed = window.confirm(`Sell equipped ${weaponName}? You will switch to Unarmed.`);
      if (!confirmed) return;
      if (!inventory.weapons.includes("unarmed")) inventory.weapons.push("unarmed");
      state.player.weapon = weapons.unarmed;
    } else {
      addLog(`${weaponName} cannot be sold without another valid weapon available.`);
      renderCombat();
      return;
    }
  }
  inventory.weapons.splice(weaponIndex, 1);
  const sellValue = getWeaponSellValue(weaponId);
  addCurrency(inventory, sellValue);
  addLog(`Sold ${weaponName} for ${formatCurrencyCompact(sellValue)}.`);
  renderCombat();
  void saveAdventure("sale");
}

function checkWinner() {
  if (!living(state.enemy)) {
    state.winner = state.player;
    state.gameState = GAME_STATES.victory;
    resetCombatFeatureFlags();
    clearCombatStatuses(state.player, state.enemy);
    awardLoot(state.player, state.enemy);
  } else if (!living(state.player)) {
    state.winner = state.enemy;
    state.gameState = GAME_STATES.defeat;
    state.combatEnded = true;
    state.player.selectedSkillId = null;
    resetCombatFeatureFlags();
    clearCombatStatuses(state.player, state.enemy);
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
  resetCombatFeatureFlags();
  clearCombatStatuses(state.player, state.enemy);
  addLog(`${state.player.name} keeps current HP, Mana, Stamina, and cooldowns between battles. Combat statuses fade.`);
  state.gameState = GAME_STATES.betweenBattles;
  void saveAdventure("combat");
}

async function handleCharacterDeath(snapshot) {
  if (!state.currentAdventureId || !state.user) return;
  if (state.deathRecordInFlight) return;
  state.deathRecordInFlight = true;
  const adventureId = state.currentAdventureId;
  try {
    await apiRequest(`/api/death/${adventureId}`, {
      method: "POST",
      body: JSON.stringify({ snapshot }),
    });
    if (state.currentAdventureId === adventureId) {
      state.currentAdventureId = null;
    }
    await refreshHub();
  } catch (error) {
    state.deathRecordInFlight = false;
    addLog(`Death record error: ${error.message}`);
  }
}

function stayAtInn() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles) return;
  if (!playerNeedsInnRest(state.player)) {
    addLog("You are already fully rested.");
    renderCombat();
    return;
  }
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
  normalizePlayerProgression(state.player);
  const unlockedSkills = new Set(state.player.unlockedSkills ?? []);
  const upgradedSkills = new Set(state.player.upgradedSkills ?? []);
  const skillOptions = (choice.skills ?? [])
    .filter((skillId) => skills[skillId] && !unlockedSkills.has(skillId))
    .map((skillId) => ({ type: "skill", id: skillId }));
  const upgradeOptions = (choice.upgrades ?? [])
    .filter((upgradeId) => {
      const upgrade = skillUpgrades[upgradeId];
      return upgrade && unlockedSkills.has(upgrade.targetSkillId) && !upgradedSkills.has(upgradeId);
    })
    .map((upgradeId) => ({ type: "upgrade", id: upgradeId }));
  return [...skillOptions, ...upgradeOptions];
}

function describeUpgradeChanges(upgrade) {
  const changes = upgrade?.changes ?? {};
  const parts = [];
  if (changes.damageDice) parts.push(`Damage becomes ${formatDice(changes.damageDice)}`);
  if (changes.damageBonus !== undefined) parts.push(`Damage bonus ${signed(changes.damageBonus)}`);
  if (changes.hitBonus !== undefined) parts.push(`Hit bonus ${signed(changes.hitBonus)}`);
  if (changes.resourceCost !== undefined) parts.push(`Cost becomes ${changes.resourceCost}`);
  if (changes.cooldownTurns !== undefined) parts.push(`Cooldown becomes ${changes.cooldownTurns}`);
  if (changes.baseEffectChance !== undefined) parts.push(`Status chance improves`);
  if (changes.statusDurationBonus !== undefined) parts.push(`Status lasts ${changes.statusDurationBonus} turn longer`);
  return parts.length ? parts : ["Improves the existing skill."];
}

function describeProgressionChoiceOption(option) {
  if (option.type === "skill") {
    const skill = getSkillById(option.id, state.player);
    const availability = { cooldownRemaining: 0, reason: "" };
    return {
      title: skill.name,
      body: skill.description,
      features: getSkillTooltipText(skill, state.player, availability).split("\n").slice(1),
    };
  }
  const upgrade = skillUpgrades[option.id];
  const targetSkill = getSkillById(upgrade.targetSkillId, state.player);
  return {
    title: upgrade.name,
    body: upgrade.summary,
    features: [`Upgrades ${targetSkill?.name ?? formatProgressionNameFromId(upgrade.targetSkillId)}`, ...describeUpgradeChanges(upgrade)],
  };
}

function unlockSkill(player, skillId) {
  normalizePlayerProgression(player);
  if (player.unlockedSkills.includes(skillId)) {
    return null;
  }
  player.unlockedSkills.push(skillId);
  const skill = getSkillById(skillId, player);
  return `New skill unlocked: ${skill.name} â€” ${skill.description}`;
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
  return `Skill upgraded: ${skill.name} â€” ${upgrade.summary}`;
}

function unlockClassFeature(player, featureId) {
  normalizePlayerProgression(player);
  if (player.unlockedFeatures.includes(featureId)) {
    return null;
  }
  const classId = normalizeClassId(player.classDef?.id, "");
  const feature = findClassCoreFeature(classId, featureId) ?? getClassPassiveFeatureById(featureId);
  if (!feature) return null;
  player.unlockedFeatures.push(featureId);
  return `Class feature unlocked: ${feature.name} - ${feature.description}`;
}

function unlockSubclassFeature(player, featureId) {
  normalizePlayerProgression(player);
  if (!featureId || player.unlockedFeatures.includes(featureId)) {
    return null;
  }
  const classId = normalizeClassId(player.classDef?.id, "");
  const feature = findSubclassFeature(classId, player.subclassId, featureId);
  if (!feature) return null;
  player.unlockedFeatures.push(featureId);
  return `Subclass feature unlocked: ${feature.name ?? formatProgressionNameFromId(featureId)} - ${feature.description}`;
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
  (progression.features ?? []).forEach((featureId) => {
    const message = unlockClassFeature(player, featureId);
    if (message) results.push(message);
  });
  const subclassFeatureId = progression.subclassFeatures?.[player.subclassId];
  if (subclassFeatureId) {
    const message = unlockSubclassFeature(player, subclassFeatureId);
    if (message) results.push(message);
  }
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
  const xp = getEnemyXpReward(enemy);
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
  if (enemy.isTierTrial && enemy.trialTier) {
    normalizePlayerTierTrials(player);
    player.progression.tierTrialsCompleted[enemy.trialTier] = true;
    rewards.push(`Tier ${enemy.trialTier} Trial completed`);
    addLog(`Tier ${enemy.trialTier} Trial completed. Tier ${enemy.trialTier + 1} is unlocked.`);
  }
  if (enemy.isFinalTrial) {
    rewards.push("Final Trial completed");
    addLog(`${enemy.name} falls. Final Trial completed.`);
  }
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

function getEnemyXpTargetFights(level) {
  if (level <= 2) return 3;
  if (level <= 5) return 4;
  if (level <= 9) return 5;
  if (level <= 14) return 6;
  if (level <= 17) return 7;
  return 8;
}

function getEnemyXpReward(enemy) {
  const level = clamp(enemy?.level ?? 1, 1, MAX_LEVEL);
  const levelSpan =
    level < MAX_LEVEL
      ? getTotalXpForLevel(level + 1) - getTotalXpForLevel(level)
      : getTotalXpForLevel(MAX_LEVEL) - getTotalXpForLevel(MAX_LEVEL - 1);
  const comparableTemplates = Object.values(enemyTemplates).filter(
    (template) => template.enemyType === (enemy?.enemyType ?? "standard") && template.tier === (enemy?.tier ?? getTierForLevel(level))
  );
  const averageTemplateXp =
    comparableTemplates.reduce((total, template) => total + (template.loot?.xp ?? 0), 0) / Math.max(1, comparableTemplates.length);
  const templateWeight = Math.max(0.5, (enemy?.loot?.xp ?? averageTemplateXp) / averageTemplateXp);
  const bossMultiplier = enemy?.enemyType === "boss" ? 1.6 : 1;
  return Math.max(1, Math.round((levelSpan / getEnemyXpTargetFights(level)) * templateWeight * bossMultiplier));
}

function awardXp(player, amount) {
  const oldLevel = player.level;
  const oldMaxHp = player.maxHp;
  const oldMaxMana = player.maxMana;
  const oldMaxStamina = player.maxStamina;
  const previousXp = player.xp ?? 0;
  player.xp = Math.min(getTotalXpForLevel(MAX_LEVEL), previousXp + amount);
  const awardedXp = player.xp - previousXp;
  const targetLevel = getLevelForXp(player.xp);
  const maxUnlockedLevel = getMaxUnlockedLevel(player);
  player.level = Math.min(targetLevel, maxUnlockedLevel);
  recalculateHp(player, oldMaxHp);
  recalculateResources(player, oldMaxMana, oldMaxStamina);
  addLog(`${player.name} gains ${awardedXp} XP (${player.xp} total).`);
  if (player.level > oldLevel) {
    const gainedLevels = [];
    for (let level = oldLevel + 1; level <= player.level; level += 1) {
      gainedLevels.push(level);
    }
    state.pendingLevelQueue.push(...gainedLevels);
    state.pendingLevelUps += player.level - oldLevel;
    addLog(`${player.name} reaches level ${player.level}. Level up will continue after rewards.`);
  } else if (targetLevel > player.level) {
    const trial = getBlockedTierTrial(player);
    if (trial) addLog(`Tier Trial required before reaching Tier ${trial.nextTier}.`);
  }
  void saveAdventure("xp");
}

function getSubclassPresentation(classId, subclassId) {
  const description = subclassDescriptions[classId]?.[subclassId];
  if (description) return description;
  const subclass = subclasses[classId]?.[subclassId];
  if (!subclass) return { summary: "Subclass path.", features: [] };
  const features = [];
  if (subclass.acBonus) features.push(`${signed(subclass.acBonus)} Defense`);
  if (subclass.damageBonus) features.push(`${signed(subclass.damageBonus)} damage`);
  Object.entries(subclass.checkBonuses ?? {}).forEach(([stat, bonus]) => {
    if (bonus) features.push(`${signed(bonus)} ${titleCase(stat)} checks`);
  });
  return { summary: "Subclass specialization.", features };
}

function renderLevelUpStatPills() {
  elements.levelStatPills.innerHTML = "";
  const level = getCurrentLevelUpLevel();
  if (!doesLevelGrantStatIncrease(level)) {
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = "No stat increase this level.";
    elements.levelStatPills.append(note);
    return;
  }
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
      updateLevelProgressionInfo();
      renderLevelUpValidation();
      renderSubclassPills();
    });
    elements.subclassPills.append(button);
  });
}

function getLevelProgressionNotes(level, progression, grantsStat, progressionChoiceOptions) {
  const levelNotes = [];
  levelNotes.push(formatPowerTier(level));
  if ((progression.skills ?? []).length) {
    levelNotes.push(`Unlocks: ${(progression.skills ?? []).map((skillId) => getSkillById(skillId, state.player)?.name ?? formatProgressionNameFromId(skillId)).join(", ")}`);
  }
  if ((progression.upgrades ?? []).length) {
    levelNotes.push(`Major upgrade: ${(progression.upgrades ?? []).map((upgradeId) => skillUpgrades[upgradeId]?.name ?? formatProgressionNameFromId(upgradeId)).join(", ")}`);
  }
  if ((progression.features ?? []).length) {
    const classId = normalizeClassId(state.player.classDef?.id, "");
    levelNotes.push(
      `Feature: ${(progression.features ?? [])
        .map((featureId) => findClassCoreFeature(classId, featureId)?.name ?? getClassPassiveFeatureById(featureId)?.name ?? formatProgressionNameFromId(featureId))
        .join(", ")}`
    );
  }
  if (Object.keys(progression.subclassFeatures ?? {}).length) {
    const classId = normalizeClassId(state.player.classDef?.id, "");
    const selectedSubclassId = state.levelUpDraft?.subclass ?? state.player.subclassId;
    const subclassFeatureEntries =
      selectedSubclassId && progression.subclassFeatures[selectedSubclassId]
        ? [[selectedSubclassId, progression.subclassFeatures[selectedSubclassId]]]
        : Object.entries(progression.subclassFeatures);
    levelNotes.push(
      `Subclass feature: ${subclassFeatureEntries
        .map(([subclassId, featureId]) => {
          const subclassName = subclasses[classId]?.[subclassId]?.name ?? formatProgressionNameFromId(subclassId);
          const feature = findSubclassFeature(classId, subclassId, featureId);
          return `${subclassName}: ${feature?.name ?? formatProgressionNameFromId(featureId)}`;
        })
        .join(", ")}`
    );
  }
  if (progressionChoiceOptions.length) levelNotes.push("Choice: unlock a new skill or upgrade an existing one.");
  if (progression.subclass) levelNotes.push("Subclass selection unlocks at this level.");
  if (!grantsStat) levelNotes.push("No stat increase this level.");
  return levelNotes;
}

function updateLevelProgressionInfo() {
  const level = getCurrentLevelUpLevel();
  const progression = getCurrentLevelProgression();
  const grantsStat = doesLevelGrantStatIncrease(level);
  const progressionChoiceOptions = getProgressionChoiceOptions(level);
  elements.levelProgressionInfo.textContent = getLevelProgressionNotes(level, progression, grantsStat, progressionChoiceOptions).join(" ");
}

function showLevelUp() {
  const level = getCurrentLevelUpLevel();
  const progression = getCurrentLevelProgression();
  const grantsStat = doesLevelGrantStatIncrease(level);
  const progressionChoiceOptions = getProgressionChoiceOptions(level);
  state.levelUpDraft = { stat: null, subclass: shouldChooseSubclassForLevelUp(level) ? null : state.player.subclassId, progressionChoice: null };
  elements.levelUpScreen.hidden = false;
  elements.levelUpText.textContent =
    state.pendingLevelUps > 1
      ? `${state.player.name} is resolving level ${level}. ${grantsStat ? "Choose one improvement now." : "Resolve this level to continue."} ${state.pendingLevelUps} level-ups remain.`
      : `${state.player.name} reached level ${level}. ${grantsStat ? "Choose one improvement to continue the journey." : "No stat increase is granted this level."}`;
  updateLevelProgressionInfo();
  elements.subclassSection.hidden = !shouldChooseSubclassForLevelUp(level);
  elements.progressionChoiceSection.hidden = !progressionChoiceOptions.length;
  renderLevelUpStatPills();
  if (shouldChooseSubclassForLevelUp(level)) renderSubclassPills();
  if (progressionChoiceOptions.length) renderProgressionChoicePills();
  renderLevelUpValidation();
}

function renderLevelUpValidation() {
  const level = getCurrentLevelUpLevel();
  const needsStat = doesLevelGrantStatIncrease(level);
  const stat = state.levelUpDraft.stat;
  if (needsStat && !stat) {
    elements.levelValidationText.textContent = "Choose one stat to increase.";
    elements.applyLevelButton.disabled = true;
    return;
  }
  if (needsStat && state.player.stats[stat] >= MAX_STAT) {
    elements.levelValidationText.textContent = `${titleCase(stat)} is already ${MAX_STAT}.`;
    elements.applyLevelButton.disabled = true;
    return;
  }
  if (shouldChooseSubclassForLevelUp() && !state.levelUpDraft.subclass) {
    elements.levelValidationText.textContent = "Choose a subclass before confirming.";
    elements.applyLevelButton.disabled = true;
    return;
  }
  if (getProgressionChoiceOptions(level).length && !state.levelUpDraft.progressionChoice) {
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
  const needsStat = doesLevelGrantStatIncrease(level);
  const stat = state.levelUpDraft.stat;
  if (needsStat && (!stat || state.player.stats[stat] >= MAX_STAT)) {
    renderLevelUpValidation();
    return;
  }

  const oldMaxHp = state.player.maxHp;
  const oldMaxMana = state.player.maxMana;
  const oldMaxStamina = state.player.maxStamina;
  const shouldChooseSubclass = shouldChooseSubclassForLevelUp(level);
  if (needsStat) {
    state.player.stats[stat] = clamp(state.player.stats[stat] + 1, MIN_STAT, MAX_STAT);
  }
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
    needsStat
      ? `${state.player.name} gains +1 ${titleCase(stat)}. Max HP is now ${state.player.maxHp}, Mana ${state.player.maxMana}, Stamina ${state.player.maxStamina}.`
      : `${state.player.name} reaches ${formatPowerTier(level)}. Max HP is now ${state.player.maxHp}, Mana ${state.player.maxMana}, Stamina ${state.player.maxStamina}.`
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
    state.livingWallActive = false;
    state.immovableBastionActive = false;
    state.eternalBastionActive = false;
    state.judgmentWallActive = false;
    state.eternalOathActive = false;
    clearVanishAtTurnStart(combatant);
    resetQuickRead();
    resetFlowingStrikes();
    resetWildCasting();
    clearAdamantSoulStatuses(combatant);
    clearUnbrokenOathStatuses(combatant);
    applyScoutFlowState(combatant);
    applyMonkPerfectFlow(combatant);
    applyMonkSoulSpiritFlow(combatant);
    applyMonkStillness(combatant);
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
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
    return;
  }
  if (!canUseMajorAction()) {
    renderCombat();
    return;
  }
  const prepared = takePreparedAttackModifier(state.player.weapon);
  const attackCount = getBasicAttackCount(state.player);
  if (attackCount === 4 && isMonkBodyLivingWeaponUnarmedAttack(state.player, prepared.skill ?? prepared.attack)) {
    addLog("Living Weapon unleashes a storm of strikes.");
  }
  resolveAttack(state.player, prepared.attack);
  for (let attackIndex = 1; attackIndex < attackCount && !state.winner && living(state.enemy); attackIndex += 1) {
    addLog(getBasicAttackFollowUpLog(state.player, attackIndex));
    resolveAttack(state.player, state.player.weapon, { followUp: true });
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
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
  }, ENEMY_ACTION_DELAY_MS);
}

function endPlayerTurnEarly() {
  if (state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.isResolvingEnemyTurn || state.winner) return;
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
    return;
  }
  addLog(`${state.player.name} ends turn.`);
  renderCombat();
  window.setTimeout(advanceTurn, TURN_ADVANCE_DELAY_MS);
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
elements.characterButton.addEventListener("click", showCharacterModal);
elements.inventoryButton.addEventListener("click", showInventoryModal);

elements.weaponSelect.addEventListener("change", renderBuilder);
elements.startButton.addEventListener("click", startCombat);
elements.attackButton.addEventListener("click", performPrimaryAction);
elements.majorSkillButton.addEventListener("click", useSelectedSkill);
elements.minorSkillButton.addEventListener("click", useSelectedSkill);
elements.recoverButton.addEventListener("click", useRecoverAction);
elements.focusButton.addEventListener("click", useFocusAction);
elements.shakeOffButton.addEventListener("click", useShakeItOffAction);
elements.deathmarkButton.addEventListener("click", useDeathmarkAction);
elements.perfectExecutionButton.addEventListener("click", usePerfectExecutionAction);
elements.arcaneSurgeButton.addEventListener("click", useArcaneSurgeAction);
elements.dualElementsButton.addEventListener("click", useDualElementsAction);
elements.overchannelButton.addEventListener("click", useOverchannelAction);
elements.cataclysmButton.addEventListener("click", useCataclysmAction);
elements.masterOfMagicButton.addEventListener("click", useMasterOfMagicAction);
elements.firestormButton.addEventListener("click", useFirestormAction);
elements.worldfireButton.addEventListener("click", useWorldfireAction);
elements.arcJumpButton.addEventListener("click", useArcJumpAction);
elements.stormAvatarButton.addEventListener("click", useStormAvatarAction);
elements.overloadButton.addEventListener("click", useOverloadAction);
elements.arcaneCataclysmButton.addEventListener("click", useArcaneCataclysmAction);
elements.perfectFocusButton.addEventListener("click", usePerfectFocusAction);
elements.innerReserveButton.addEventListener("click", useInnerReserveAction);
elements.transcendenceButton.addEventListener("click", useTranscendenceAction);
elements.enlightenmentButton.addEventListener("click", useEnlightenmentAction);
elements.immovableBastionButton.addEventListener("click", useImmovableBastionAction);
elements.eternalBastionButton.addEventListener("click", useEternalBastionAction);
elements.judgmentWallButton.addEventListener("click", useJudgmentWallAction);
elements.divineChampionButton.addEventListener("click", useDivineChampionAction);
elements.eternalOathButton.addEventListener("click", useEternalOathAction);
elements.wrathIncarnateButton.addEventListener("click", useWrathIncarnateAction);
elements.psionicRecoveryButton.addEventListener("click", usePsionicRecoveryAction);
elements.trueSightButton.addEventListener("click", useTrueSightAction);
elements.perfectPredictionButton.addEventListener("click", usePerfectPredictionAction);
elements.gravityBreakButton.addEventListener("click", useGravityBreakAction);
elements.livingWallButton.addEventListener("click", useLivingWallAction);
elements.clearSkillButton.addEventListener("click", () => {
  if (state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.isResolvingEnemyTurn) return;
  state.player.selectedSkillId = null;
  addLog(`${state.player.name} clears the prepared skill.`);
  renderCombat();
});
elements.endTurnButton.addEventListener("click", endPlayerTurnEarly);
elements.nextEncounterButton.addEventListener("click", startNextEncounter);
elements.tierTrialButton.addEventListener("click", startTierTrial);
elements.finalTrialButton.addEventListener("click", startFinalTrial);
elements.rewardContinueButton.addEventListener("click", hideRewardModal);
elements.progressionContinueButton.addEventListener("click", hideProgressionModal);
elements.infoCloseButton.addEventListener("click", hideInfoModal);
elements.codexCloseButton.addEventListener("click", hideCodexModal);
elements.characterCloseButton.addEventListener("click", hideCharacterModal);
elements.inventoryCloseButton.addEventListener("click", hideInventoryModal);
elements.cancelDeleteAdventureButton.addEventListener("click", hideDeleteAdventureModal);
elements.confirmDeleteAdventureButton.addEventListener("click", confirmDeleteAdventure);
elements.adminQaClassSelect.addEventListener("change", () => updateAdminQaSubclassOptions(elements.adminQaClassSelect.value));
elements.adminQaRebuildButton.addEventListener("click", rebuildAdminQaProgression);
elements.adminQaSetLevelButton.addEventListener("click", setAdminQaLevel);
elements.adminQaGold10Button.addEventListener("click", () => grantAdminQaGold(10));
elements.adminQaGold100Button.addEventListener("click", () => grantAdminQaGold(100));
elements.adminQaResetCombatButton.addEventListener("click", resetAdminQaCombatState);
elements.adminQaAddButton.addEventListener("click", addAdminQaItem);
elements.adminQaStartCombatButton.addEventListener("click", startAdminQaCombat);
elements.adminQaApplyPlayerStatusButton.addEventListener("click", () => applyAdminQaStatus("player"));
elements.adminQaApplyEnemyStatusButton.addEventListener("click", () => applyAdminQaStatus("enemy"));
elements.adminQaPlayerHpFullButton.addEventListener("click", () => setAdminQaPlayerResource("hp", "full"));
elements.adminQaPlayerHpOneButton.addEventListener("click", () => setAdminQaPlayerResource("hp", "one"));
elements.adminQaPlayerManaFullButton.addEventListener("click", () => setAdminQaPlayerResource("mana", "full"));
elements.adminQaPlayerStaminaFullButton.addEventListener("click", () => setAdminQaPlayerResource("stamina", "full"));
elements.adminQaClearStatusesButton.addEventListener("click", clearAdminQaStatuses);
elements.adminQaClearCooldownsButton.addEventListener("click", clearAdminQaCooldowns);
elements.adminQaResetFlagsButton.addEventListener("click", resetAdminQaFlagsOnly);
elements.adminQaEnemyHpFullButton.addEventListener("click", () => setAdminQaEnemyHp("full"));
elements.adminQaEnemyHpThirtyButton.addEventListener("click", () => setAdminQaEnemyHp("thirty"));
elements.adminQaEnemyHpOneButton.addEventListener("click", () => setAdminQaEnemyHp("one"));
elements.adminQaD20OneButton.addEventListener("click", () => forceAdminQaD20(1));
elements.adminQaD20TenButton.addEventListener("click", () => forceAdminQaD20(10));
elements.adminQaD20FifteenButton.addEventListener("click", () => forceAdminQaD20(15));
elements.adminQaD20TwentyButton.addEventListener("click", () => forceAdminQaD20(20));
elements.adminQaD20CustomButton.addEventListener("click", forceAdminQaCustomD20);
elements.adminQaStatusSuccessButton.addEventListener("click", () => forceAdminQaStatusRoll("success"));
elements.adminQaStatusFailButton.addEventListener("click", () => forceAdminQaStatusRoll("fail"));
elements.adminQaStatusCustomButton.addEventListener("click", forceAdminQaCustomStatusRoll);
elements.adminQaDamageMinButton.addEventListener("click", () => forceAdminQaDamageRoll("min"));
elements.adminQaDamageMaxButton.addEventListener("click", () => forceAdminQaDamageRoll("max"));
elements.adminQaClearOverridesButton.addEventListener("click", clearAdminQaOverrides);
elements.adminCopyDebugButton.addEventListener("click", copyAdminDebugSummary);
elements.deleteAdventureModal.addEventListener("click", (event) => {
  if (event.target === elements.deleteAdventureModal) hideDeleteAdventureModal();
});
elements.characterModal.addEventListener("click", (event) => {
  if (event.target === elements.characterModal) hideCharacterModal();
});
elements.inventoryModal.addEventListener("click", (event) => {
  if (event.target === elements.inventoryModal) hideInventoryModal();
});
elements.innButton.addEventListener("click", stayAtInn);
elements.inventoryList.addEventListener("click", (event) => {
  const equipWeaponButton = event.target.closest("[data-equip-weapon]");
  if (equipWeaponButton) {
    equipOwnedWeapon(equipWeaponButton.dataset.equipWeapon);
    return;
  }
  const sellWeaponButton = event.target.closest("[data-sell-weapon]");
  if (sellWeaponButton) {
    sellOwnedWeapon(sellWeaponButton.dataset.sellWeapon);
    return;
  }
  const sellItemButton = event.target.closest("[data-sell-item]");
  if (sellItemButton) {
    sellConsumableItem(sellItemButton.dataset.sellItem);
    return;
  }
  const infoItemButton = event.target.closest("[data-info-item]");
  if (infoItemButton) {
    const item = consumableItems[infoItemButton.dataset.infoItem];
    if (item) showItemInfoModal(item);
    return;
  }
  const button = event.target.closest("[data-use-item]");
  if (button) {
    useConsumableItem(button.dataset.useItem);
    return;
  }
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
  if (!(target instanceof Element)) return;
  const actionTarget = target.closest("[data-continue], [data-delete], [data-new-slot]");
  if (!(actionTarget instanceof HTMLElement)) return;
  const continueId = actionTarget.dataset.continue;
  const deleteId = actionTarget.dataset.delete;
  if (continueId) {
    try {
      await continueAdventure(continueId);
    } catch (error) {
      elements.hubValidationText.textContent = error.message;
    }
    return;
  }
  if (deleteId) {
    showDeleteAdventureModal(deleteId);
    return;
  }
  if (actionTarget.dataset.newSlot !== undefined) {
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
document.addEventListener("visibilitychange", handleMusicFocusChange);
window.addEventListener("blur", handleMusicFocusChange);
window.addEventListener("beforeunload", pauseAllMusicImmediately);
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
