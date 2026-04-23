# GAME_RULES.md

## Core System
- The game uses a d20 system based on three stats:
  - Mind (mental, perception, deception, psionics)
  - Body (physical attacks, movement, durability)
  - Soul (magic, spells, spiritual power)

## Action Economy
- Each turn:
  - 1 Major + 1 Minor action
  - OR 2 Minor actions
- Major:
  - Attack
  - Standalone skills
- Minor:
  - Potions
  - Bandages
  - Utility skills

## Skill Model
- Attack = weapon only
- Modifier skill = modifies next Attack
- Standalone skill = replaces Attack

## Resources
- Mana = Soul-based skills
- Stamina = Body-based skills
- Resources restore only via Rest (Inn)

## HP
- Max HP = 18 + (Body × 2) + ((Level - 1) × 4)
- No automatic healing between battles

## Currency
- 10 copper = 1 silver
- 10 silver = 1 gold
- Always stored as integers
- Display format:
  - Inventory: full breakdown
  - Combat: Xg Ys Zc

## Rest System
- "Stay at the Inn" costs 3 silver
- Rest restores:
  - HP
  - Mana
  - Stamina
  - clears cooldowns

## Death
- Death is permanent
- Character is moved to Graveyard
- Graveyard stores a memorial summary

## Status Effects
- Bleed can be removed with Bandage
- Status removal requires explicit action

## Design Philosophy
- No automatic success
- Actions must have tradeoffs
- Systems must be clear and consistent
