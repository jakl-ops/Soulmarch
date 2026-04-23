const STAT_LIMIT = 10;
const MIN_STAT = 1;
const MAX_STAT = 10;
const BASE_AC = 10;
const POTION_HEALING = 8;
const POTION_HEALING_MAX = 15;
const POTION_PRICE = { copper: 0, silver: 1, gold: 0 };
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

const statusDefinitions = {
  burn: { name: "Burn", duration: 3, tick: "end", damage: 2, damageType: "fire" },
  freeze: { name: "Freeze", duration: 2, hitPenalty: -2 },
  poison: { name: "Poison", duration: 3, tick: "start", damage: 1, damageType: "physical" },
  stun: { name: "Stun", duration: 1, skipAction: true },
  bleed: { name: "Bleed", duration: 3, tick: "afterAct", damage: 2, damageType: "physical" },
  guarded: { name: "Guarded", duration: 2, damageReduction: 3 },
  shielded: { name: "Shielded", duration: 2, damageReduction: 2 },
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
    status: { id: "bleed", chance: 0.35 },
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "+1 hit, extra physical damage, may cause Bleed.",
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
    status: { id: "burn", chance: 0.55 },
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Soul spell attack with a strong Burn chance.",
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
    name: "Inner Focus",
    classId: "monk",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: "mana",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Gain Shielded and steady your spirit.",
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
    status: { id: "stun", chance: 0.3 },
    resourceType: "stamina",
    resourceCost: 2,
    cooldownTurns: 2,
    description: "Body attack that may Stun.",
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
    status: { id: "poison", chance: 0.3 },
    resourceType: "stamina",
    resourceCost: 1,
    cooldownTurns: 0,
    description: "+2 hit and may Poison.",
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
    status: { id: "freeze", chance: 0.45 },
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
    status: { id: "stun", chance: 0.25 },
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
    status: { id: "freeze", chance: 0.6 },
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Ice spell that often Freezes.",
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
    status: { id: "stun", chance: 0.2 },
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Soul attack with a small Stun chance.",
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
    status: { id: "freeze", chance: 0.25 },
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 1,
    description: "A precise psionic lash that strikes with Mind and may daze the target.",
  },
  thoughtLock: {
    id: "thoughtLock",
    name: "Thought Lock",
    classId: "mystic",
    stat: "mind",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: null,
    resourceCost: 0,
    cooldownTurns: 2,
    description: "Focus your will into a protective mental ward.",
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
    status: { id: "bleed", chance: 0.55 },
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
    status: { id: "stun", chance: 0.3 },
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
    status: { id: "freeze", chance: 0.6 },
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
    status: { id: "stun", chance: 0.25 },
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
    status: { id: "stun", chance: 0.35 },
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
    status: { id: "stun", chance: 0.4 },
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
    status: { id: "poison", chance: 0.55 },
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
    status: { id: "poison", chance: 0.4 },
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
    status: { id: "stun", chance: 0.3 },
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
    status: { id: "burn", chance: 0.7 },
    resourceType: "mana",
    resourceCost: 2,
    cooldownTurns: 1,
    description: "Exploding fire that heavily pressures with Burn.",
  },
  radiantWard: {
    id: "radiantWard",
    name: "Radiant Ward",
    classId: "paladin",
    stat: "soul",
    attackKind: "utility",
    mode: "standalone",
    hitBonus: 0,
    statusSelf: { id: "shielded", chance: 1 },
    resourceType: "mana",
    resourceCost: 1,
    cooldownTurns: 1,
    description: "Wrap yourself in holy light and gain Shielded.",
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
    status: { id: "stun", chance: 0.2 },
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
    changes: { name: "Shield Slam+", damageBonus: 3, cooldownTurns: 1, status: { id: "stun", chance: 0.45 }, description: "A crushing slam with stronger stun pressure." },
  },
  quickStabMastery: {
    id: "quickStabMastery",
    targetSkillId: "quickStab",
    name: "Quick Stab+",
    summary: "Quick Stab draws more blood without waiting on cooldown.",
    changes: { name: "Quick Stab+", damageBonus: 2, cooldownTurns: 0, status: { id: "poison", chance: 0.45 }, description: "A faster, nastier stab with stronger poison." },
  },
  feintMastery: {
    id: "feintMastery",
    targetSkillId: "feint",
    name: "Feint+",
    summary: "Feint becomes more accurate and sharper on the hit.",
    changes: { name: "Feint+", hitBonus: 2, damageBonus: 1, cooldownTurns: 0, status: { id: "freeze", chance: 0.6 }, description: "A perfected feint that bites harder and hinders more." },
  },
  sparkSurgeMastery: {
    id: "sparkSurgeMastery",
    targetSkillId: "sparkSurge",
    name: "Spark Surge+",
    summary: "Spark Surge gains more damage and no cooldown.",
    changes: { name: "Spark Surge+", damageBonus: 4, cooldownTurns: 0, status: { id: "stun", chance: 0.35 }, description: "A surging spell that crackles every turn." },
  },
  frostMarkMastery: {
    id: "frostMarkMastery",
    targetSkillId: "frostMark",
    name: "Frost Mark+",
    summary: "Frost Mark deepens its chill and refreshes faster.",
    changes: { name: "Frost Mark+", damageBonus: 2, cooldownTurns: 0, status: { id: "freeze", chance: 0.75 }, description: "A stronger curse of winter with no cooldown." },
  },
  smiteMastery: {
    id: "smiteMastery",
    targetSkillId: "smite",
    name: "Smite+",
    summary: "Smite strikes brighter and more often.",
    changes: { name: "Smite+", damageBonus: 3, cooldownTurns: 0, status: { id: "stun", chance: 0.3 }, description: "A radiant strike that returns every turn." },
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
    changes: { name: "Mind Spike+", damageBonus: 3, cooldownTurns: 0, status: { id: "freeze", chance: 0.35 }, description: "A perfected psionic lash that refreshes instantly." },
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
  builderHp: document.querySelector("#builderHp"),
  classPills: document.querySelector("#classPills"),
  builderSummaryName: document.querySelector("#builderSummaryName"),
  builderSummaryDescription: document.querySelector("#builderSummaryDescription"),
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
  playerStats: document.querySelector("#playerStats"),
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
  initiativeList: document.querySelector("#initiativeList"),
  turnText: document.querySelector("#turnText"),
  actionText: document.querySelector("#actionText"),
  attackButton: document.querySelector("#attackButton"),
  clearSkillButton: document.querySelector("#clearSkillButton"),
  potionButton: document.querySelector("#potionButton"),
  nextEncounterButton: document.querySelector("#nextEncounterButton"),
  inventoryList: document.querySelector("#inventoryList"),
  sideInventoryList: document.querySelector("#sideInventoryList"),
  inventorySummary: document.querySelector("#inventorySummary"),
  shopCurrency: document.querySelector("#shopCurrency"),
  buyPotionButton: document.querySelector("#buyPotionButton"),
  innButton: document.querySelector("#innButton"),
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
  resetButton: document.querySelector("#resetButton"),
  diceLog: document.querySelector("#diceLog"),
};

const state = {
  user: null,
  currentAdventureId: null,
  activeAdventures: [],
  savePending: false,
  saveMessage: "",
  graveyardEntries: [],
  gameState: GAME_STATES.characterCreation,
  builderSelectedClassId: "warrior",
  player: null,
  enemy: null,
  initiative: [],
  turnIndex: 0,
  actionUsed: false,
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
};

function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
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
      player: state.player,
      enemy: state.enemy,
      initiative: getInitiativeSnapshot(),
      turnIndex: state.turnIndex,
      actionUsed: state.actionUsed,
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
  state.player = snapshot.player;
  normalizePlayerProgression(state.player);
  state.enemy = snapshot.enemy;
  state.turnIndex = snapshot.turnIndex ?? 0;
  state.actionUsed = snapshot.actionUsed ?? false;
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
  skill.tooltipText = `${skill.description} (${skill.mode === "attack_modifier" ? "Modifier Skill" : "Standalone Skill"}; ${skill.statUsed}; ${
    skill.damageDice ? `${formatDice(skill.damageDice)} ${skill.damageType}` : "no direct damage"
  }; ${skill.resourceCost ?? 0} ${resourceLabel(skill.resourceType)}; cooldown ${skill.cooldownTurns ?? 0}${
    skill.status ? `; ${statusDefinitions[skill.status.id].name}` : ""
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
  const negativeStatuses = new Set(["burn", "freeze", "poison", "stun", "bleed"]);
  player.statuses = player.statuses.filter((status) => !negativeStatuses.has(status.id));
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
    consumables: { healthPotion: 1 },
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
  state.player = null;
  state.enemy = null;
  state.initiative = [];
  state.turnIndex = 0;
  state.actionUsed = false;
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

function formatInfoTooltip(label, body) {
  return `<button type="button" class="info-chip tooltip-term" data-info-title="${escapeAttribute(label)}" data-info-body="${escapeAttribute(
    body
  )}" data-tooltip="${escapeAttribute(body)}">${label}<span class="info-chip-icon" aria-hidden="true">i</span></button>`;
}

function formatClassDisplay(classDef) {
  return classDef ? formatInfoTooltip(classDef.name, `${classDef.shortDescription} | ${classDef.roleTag ?? "Class"} | ${classDef.tooltipSummary}`) : "None";
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
    button.innerHTML = `<span class="class-icon">${classDef.icon}</span><span>${classDef.name}</span>`;
    button.addEventListener("click", () => {
      state.builderSelectedClassId = classDef.id;
      renderBuilder();
    });
    elements.classPills.append(button);
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
  elements.totalSpent.textContent = validation.total;
  elements.totalRemaining.textContent = Math.max(0, STAT_LIMIT - validation.total);
  elements.builderSummaryName.textContent = preview.name;
  elements.builderSummaryDescription.textContent = preview.description || "No description";
  elements.builderSummaryClass.innerHTML = formatClassDisplay(previewClass);
  elements.builderSummaryStats.innerHTML = formatStatsMarkup(preview.stats);
  elements.builderSummaryWeapon.textContent = preview.weapon.name;
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
  state.actionUsed = false;
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

function formatStatuses(combatant) {
  if (!combatant.statuses.length) {
    return "none";
  }
  return combatant.statuses.map((status) => `${statusDefinitions[status.id].name} ${status.duration}`).join(", ");
}

function renderCombatant(prefix, combatant) {
  const attackParts = getAttackParts(combatant);
  renderHpBar(elements[`${prefix}HpBar`], combatant);
  elements[`${prefix}Stats`].innerHTML = formatStatsMarkup(combatant.stats);
  elements[`${prefix}Weapon`].textContent = `${combatant.weapon.name}: ${combatant.weapon.special}`;
  elements[`${prefix}Traits`].textContent = formatTraits(combatant);
  elements[`${prefix}Statuses`].textContent = formatStatuses(combatant);
  elements[`${prefix}Ac`].textContent = getAcFormula(combatant);
  elements[`${prefix}Attack`].textContent = `d20 + ${attackParts.map((part) => `${part.label} ${part.value}`).join(" + ")}`;
  elements[`${prefix}Damage`].textContent = `${formatDice(combatant.weapon.damageDice)} ${combatant.weapon.damageType}`;

  if (prefix === "player") {
    elements.playerNameHeading.textContent = combatant.name;
    elements.playerLevelXp.textContent = `Level ${combatant.level}, ${combatant.xp} XP, next ${getNextLevelText(combatant)}`;
    elements.saveStatus.textContent = state.savePending
      ? "Saving..."
      : state.saveMessage || (state.user ? "" : "Not logged in — progress will not be saved.");
    renderResourceBar(elements.playerManaBar, "Mana", combatant.mana, combatant.maxMana, "mana");
    renderResourceBar(elements.playerStaminaBar, "Stamina", combatant.stamina, combatant.maxStamina, "stamina");
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
    elements.enemyTypeLevel.textContent = `${combatant.templateId}, level ${combatant.level}`;
  }
}

function renderInventory() {
  const inventory = state.player.inventory;
  elements.inventoryList.innerHTML = "";
  elements.sideInventoryList.innerHTML = "";
  applyNormalizedCurrency(inventory.currency, inventory.currency);
  elements.inventorySummary.textContent = `Inventory: ${inventory.consumables.healthPotion ?? 0} potion, ${formatCurrencyCompact(inventory.currency)}`;
  const lines = [
    `Currency: ${formatCurrencyDetailed(inventory.currency)}`,
    `Health Potions: ${inventory.consumables.healthPotion ?? 0}`,
    `Owned weapons: ${inventory.weapons.map((id) => weapons[id].name).join(", ")}`,
    `Owned armor: ${inventory.armor.map((id) => armors[id].name).join(", ")}`,
    `Equipped: ${state.player.weapon.name}, ${state.player.armor.name}`,
  ];
  lines.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    elements.inventoryList.append(p);
    const sideP = document.createElement("p");
    sideP.textContent = line;
    elements.sideInventoryList.append(sideP);
  });
  elements.shopCurrency.textContent = `Funds: ${formatCurrencyDetailed(inventory.currency)}.`;
  elements.buyPotionButton.disabled =
    state.gameState !== GAME_STATES.betweenBattles ||
    !canAffordCurrency(inventory.currency, POTION_PRICE);
  elements.innButton.disabled =
    state.gameState !== GAME_STATES.betweenBattles ||
    !canAffordCurrency(inventory.currency, INN_PRICE);
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
  ["overview", "details", "inventory", "codex"].forEach((name) => {
    const panel = document.querySelector(`#${name}Tab`);
    panel.hidden = name !== tabName;
  });
}

function getPlayerSkills() {
  return (state.player?.unlockedSkills ?? []).map((id) => getSkillById(id, state.player)).filter(Boolean);
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
  const skillList = getPlayerSkills();
  const selected = getSelectedSkill();
  elements.selectedSkillText.textContent = selected ? selected.name : "None";
  elements.clearSkillButton.hidden = !selected || state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.actionUsed;
  elements.skillsList.innerHTML = "";
  skillList.forEach((skill) => {
    const availability = canUseSkill(state.player, skill);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `skill-pill${state.player.selectedSkillId === skill.id ? " active" : ""}${availability.usable ? "" : " unavailable"}`;
    button.innerHTML = `<span>${skill.name}</span>${getSkillBadgeText(skill) ? `<span class="skill-badge">${getSkillBadgeText(skill)}</span>` : ""}${
      availability.cooldownRemaining > 0 ? `<span class="cooldown-badge">${availability.cooldownRemaining}</span>` : ""
    }`;
    button.dataset.skillId = skill.id;
    button.dataset.tooltip = `${skill.description}\nMode: ${skill.mode === "attack_modifier" ? "Modifier Skill" : "Standalone Skill"}\nStat: ${skill.statUsed}\nResource: ${
      skill.resourceType ? `${skill.resourceCost} ${resourceLabel(skill.resourceType)}` : "None"
    }\nCooldown: ${skill.cooldownTurns ?? 0}\nCurrent cooldown: ${availability.cooldownRemaining}\nEffect: ${formatSkillEffect(skill)}${
      availability.reason ? `\nUnavailable: ${availability.reason}` : ""
    }`;
    button.disabled = !availability.usable || state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.actionUsed;
    button.addEventListener("click", () => selectSkill(skill.id));
    elements.skillsList.append(button);
  });
  elements.skillInfoPanel.innerHTML = selected
    ? `<strong>${selected.name}</strong>${selected.description} Mode: ${
        selected.mode === "attack_modifier" ? "Modifier Skill" : "Standalone Skill"
      }. Stat: ${selected.statUsed}. Resource: ${
        selected.resourceType ? `${selected.resourceCost} ${resourceLabel(selected.resourceType)}` : "None"
      }. Cooldown: ${selected.cooldownTurns ?? 0}. Effect: ${formatSkillEffect(selected)}.`
    : "Tap a skill to prepare it and read its details here.";
}

function formatStatusRemoval(statusId) {
  if (statusId === "bleed") return "Removed by Bandage";
  return "Ends through duration or explicit recovery";
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
          weapon.name,
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
        { name: "Health Potion", use: `Restore ${POTION_HEALING}-${POTION_HEALING_MAX} HP.`, cost: formatCurrencyCompact(POTION_PRICE) },
        { name: "Inn Stay", use: "Restore HP, Mana, and Stamina; clear cooldowns.", cost: formatCurrencyCompact(INN_PRICE) },
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
  if (status.damage && status.tick) {
    return `${status.damage} damage on ${status.tick} turn timing`;
  }
  if (status.hitPenalty) {
    return `${status.hitPenalty} to hit`;
  }
  if (status.skipAction) {
    return "lose next action";
  }
  if (status.damageReduction) {
    return `reduce incoming damage by ${status.damageReduction}`;
  }
  return "special condition";
}

function formatSkillEffect(skill) {
  const effects = [];
  effects.push(skill.mode === "attack_modifier" ? "Attack modifier" : "Standalone");
  effects.push(`${skill.statUsed}-based`);
  if (skill.hitBonus) effects.push(`${signed(skill.hitBonus)} hit`);
  if (skill.damageDice) effects.push(`${formatDice(skill.damageDice)} ${skill.damageType}`);
  if (skill.damageBonus) effects.push(`${signed(skill.damageBonus)} damage`);
  if (skill.statusEffect) effects.push(`${statusDefinitions[skill.statusEffect.id].name} ${Math.round(skill.statusEffect.chance * 100)}%`);
  if (skill.statusSelf) effects.push(`Self: ${statusDefinitions[skill.statusSelf.id].name}`);
  return effects.length ? `(${effects.join("; ")})` : "";
}

function selectSkill(skillId) {
  if (state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.actionUsed) return;
  const skill = getSkillById(skillId, state.player);
  const availability = canUseSkill(state.player, skill);
  if (!availability.usable) {
    addLog(availability.reason);
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
  const availability = canUseSkill(state.player, skill);
  if (!availability.usable) {
    addLog(availability.reason);
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
  state.actionUsed = true;
  spendSkillResource(state.player, skill);
  startSkillCooldown(state.player, skill);

  if (skill.attackKind === "utility") {
    if (skill.statusSelf) {
      maybeApplyStatus(state.player, state.player, skill.statusSelf, skill.name);
    }
    addLog(`${state.player.name} uses ${skill.name}.`);
    if (!state.winner) tickStatuses(state.player, "afterAct");
    renderCombat();
    window.setTimeout(advanceTurn, 450);
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
  renderCombat();
  window.setTimeout(advanceTurn, 450);
}

function renderInitiative() {
  elements.initiativeList.innerHTML = "";
  state.initiative.forEach((entry, index) => {
    const item = document.createElement("li");
    item.textContent = `${entry.combatant.name}: ${entry.total}`;
    if (index === state.turnIndex && !state.winner) item.classList.add("active");
    elements.initiativeList.append(item);
  });
}

function renderCombat() {
  const active = currentCombatant();
  renderCombatant("player", state.player);
  renderCombatant("enemy", state.enemy);
  renderInitiative();
  renderInventory();
  renderResults();
  renderSkills();
  renderCodex();

  elements.playerCard.classList.toggle("active", active?.id === "player" && !state.winner);
  elements.enemyCard.classList.toggle("active", active?.id === "enemy" && !state.winner);

  if (state.gameState === GAME_STATES.defeat) {
    elements.turnText.textContent = `${state.player.name} was defeated.`;
    elements.actionText.textContent = "Game over. Create a new character to try again.";
    setActionButtons(true);
    elements.attackButton.textContent = "Attack";
    elements.nextEncounterButton.hidden = true;
    return;
  }

  if (state.gameState === GAME_STATES.victory) {
    elements.turnText.textContent = `${state.winner.name} wins.`;
    elements.actionText.textContent = state.pendingLevelUps > 0 ? "Level up is available before the next battle." : "Processing victory.";
    setActionButtons(true);
    elements.attackButton.textContent = "Attack";
    elements.nextEncounterButton.hidden = true;
    return;
  }

  if (state.gameState === GAME_STATES.betweenBattles) {
    elements.turnText.textContent = "Between battles";
    elements.actionText.textContent = "Review rewards, use items, rest at the inn, or start the next battle.";
    setActionButtons(true);
    elements.attackButton.textContent = "Attack";
    elements.potionButton.disabled = (state.player.inventory.consumables.healthPotion ?? 0) <= 0 || state.player.hp >= state.player.maxHp;
    elements.buyPotionButton.disabled = !canAffordCurrency(state.player.inventory.currency, POTION_PRICE);
    elements.innButton.disabled = !canAffordCurrency(state.player.inventory.currency, INN_PRICE);
    elements.nextEncounterButton.hidden = false;
    elements.nextEncounterButton.disabled = state.pendingLevelUps > 0;
    return;
  }

  elements.turnText.textContent = `Round ${state.round}: ${active.name}'s turn`;
  const selectedSkill = getSelectedSkill();
  const playerCanAct = active.id === "player" && !state.actionUsed && !state.isResolvingEnemyTurn;
  elements.attackButton.textContent = selectedSkill?.mode === "standalone" ? `Use ${selectedSkill.name}` : "Attack";
  elements.actionText.textContent = state.actionUsed
    ? "Action used. Advancing turn."
    : selectedSkill
      ? selectedSkill.mode === "attack_modifier"
        ? `Next attack modified by ${selectedSkill.name}.`
        : `${selectedSkill.name} is ready as your action.`
      : "One action available.";
  elements.attackButton.disabled = !playerCanAct;
  elements.potionButton.disabled = !playerCanAct || (state.player.inventory.consumables.healthPotion ?? 0) <= 0 || state.player.hp >= state.player.maxHp;
  elements.clearSkillButton.hidden = !selectedSkill || !playerCanAct;
  elements.buyPotionButton.disabled = true;
  elements.innButton.disabled = true;
  elements.nextEncounterButton.hidden = true;
}

function setActionButtons(disabled) {
  elements.attackButton.disabled = disabled;
  elements.potionButton.disabled = disabled;
  elements.clearSkillButton.hidden = true;
}

async function startNextEncounter() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles || state.pendingLevelUps > 0) return;
  state.enemy = createScaledEnemy(state.player.level);
  state.player.hasAttacked = false;
  state.player.selectedSkillId = null;
  state.gameState = GAME_STATES.inCombat;
  state.turnIndex = 0;
  state.actionUsed = false;
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

function maybeApplyStatus(source, target, status, sourceName) {
  if (!status) return;
  const rollValue = Math.random();
  const chancePercent = Math.round(status.chance * 100);
  if (rollValue <= status.chance) {
    applyStatus(target, status.id, sourceName);
  } else {
    addLog(`${sourceName} status chance ${chancePercent}% -> no effect.`);
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
  if ((state.actionUsed && !options.followUp) || state.winner) {
    addLog(`${attacker.name} cannot act again this turn.`);
    renderCombat();
    return;
  }

  state.actionUsed = true;
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
    maybeApplyStatus(attacker, defender, attack.status, sourceName);
    checkWinner();
    return;
  }

  addLog(`${attacker.name} uses ${options.skill?.name ?? attack.name}: ${formatRollMath(attackDie, parts)} vs ${defender.name} AC ${defenderAc} -> MISS.`);
}

function usePotion() {
  if (!state.player || state.gameState === GAME_STATES.defeat || state.gameState === GAME_STATES.characterCreation) return;
  const usingInCombat = state.gameState === GAME_STATES.inCombat;
  if (usingInCombat && (currentCombatant()?.id !== "player" || state.actionUsed)) return;
  const quantity = state.player.inventory.consumables.healthPotion ?? 0;
  if (quantity <= 0 || state.player.hp >= state.player.maxHp) return;
  if (usingInCombat) state.actionUsed = true;
  state.player.inventory.consumables.healthPotion -= 1;
  const healRoll = rollRange([POTION_HEALING, POTION_HEALING_MAX]);
  const oldHp = state.player.hp;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + healRoll);
  addLog(`${state.player.name} uses Health Potion and recovers ${state.player.hp - oldHp} HP.`);
  if (usingInCombat && !state.winner) {
    tickStatuses(state.player, "afterAct");
  }
  renderCombat();
  void saveAdventure("inventory");
  if (usingInCombat) {
    window.setTimeout(advanceTurn, 450);
  }
}

function buyPotion() {
  if (!state.player || state.gameState !== GAME_STATES.betweenBattles) return;
  if (!spendCurrency(state.player.inventory, POTION_PRICE)) {
    addLog(`${state.player.name} cannot afford a Health Potion.`);
    renderCombat();
    return;
  }
  addInventoryItem(state.player.inventory, "consumables", "healthPotion", 1);
  addLog(`${state.player.name} buys a Health Potion for ${formatCurrencyCompact(POTION_PRICE)}.`);
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
    `${state.player.name} stays at the inn for ${formatCurrencyCompact(INN_PRICE)} and restores to ${state.player.hp} / ${state.player.maxHp} HP, ${state.player.mana} / ${state.player.maxMana} Mana, and ${state.player.stamina} / ${state.player.maxStamina} Stamina.`
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
    state.actionUsed = true;
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
  state.actionUsed = false;
  renderCombat();
  maybeRunEnemyTurn();
}

function performPrimaryAction() {
  if (currentCombatant()?.id !== "player") return;
  const selectedSkill = getSelectedSkill();
  if (selectedSkill?.mode === "standalone") {
    useSelectedSkill();
    return;
  }
  if (!startTurn(state.player)) {
    renderCombat();
    window.setTimeout(advanceTurn, 450);
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
  renderCombat();
  window.setTimeout(advanceTurn, 450);
}

function maybeRunEnemyTurn() {
  if (state.winner || currentCombatant()?.id !== "enemy" || state.isResolvingEnemyTurn) return;
  state.isResolvingEnemyTurn = true;
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

[elements.nameInput, elements.descriptionInput, elements.mindInput, elements.bodyInput, elements.soulInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input !== elements.nameInput && input !== elements.descriptionInput) enforceStatBudget(input);
    renderBuilder();
  });
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => switchPlayerTab(button.dataset.tab));
});

elements.weaponSelect.addEventListener("change", renderBuilder);
elements.armorSelect.addEventListener("change", renderBuilder);
elements.startButton.addEventListener("click", startCombat);
elements.attackButton.addEventListener("click", performPrimaryAction);
elements.clearSkillButton.addEventListener("click", () => {
  if (state.gameState !== GAME_STATES.inCombat || currentCombatant()?.id !== "player" || state.actionUsed) return;
  state.player.selectedSkillId = null;
  addLog(`${state.player.name} clears the prepared skill.`);
  renderCombat();
});
elements.potionButton.addEventListener("click", usePotion);
elements.nextEncounterButton.addEventListener("click", startNextEncounter);
elements.rewardContinueButton.addEventListener("click", hideRewardModal);
elements.progressionContinueButton.addEventListener("click", hideProgressionModal);
elements.infoCloseButton.addEventListener("click", hideInfoModal);
elements.buyPotionButton.addEventListener("click", buyPotion);
elements.innButton.addEventListener("click", stayAtInn);
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

renderBuilder();
activeScreen("auth");
bootSession();
