const { seedTestProfile } = require("../storage");

const result = seedTestProfile();

console.log(`Seeded test profile "${result.username}" (${result.userId}).`);
console.log(`Characters repaired/created: ${result.characters.length}`);
result.characters.forEach((character) => {
  console.log(`- ${character.name} (${character.classId}/${character.subclassId})`);
});
