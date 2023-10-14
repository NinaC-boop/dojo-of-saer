import { Box, MeleeEnemy, RangedEnemy } from "./renderers";

let score = 0;
let multiplier = 1;
let multiplierTimer = 0;
let bestMultiplier = 1;
let kills = 0;
let spawnLength = 800;
let spawnTimer = 800; // game ticks until next spawn

let maxEnemies = 5;
let currentEnemies = 0;
let totalSpawnedEnemies = 0;

const UpdateState = (entities, { input }) => {
  if (entities) {
    entities = spawnEnemies(entities);
  }

  return entities;
};

function spawnEnemies(entities) {
  spawnTimer--;
  if (spawnTimer <= 0) {
    console.log('spawning new enemies...')
    while (currentEnemies < maxEnemies) { 
      entities = addEnemy(entities);
    }
    spawnTimer = Math.random() * spawnLength / 2 + spawnLength;

    console.log(`current enemies: ${currentEnemies}`);
  }
  return entities;
}

function addEnemy(entities) {
  let enemy;

  switch (Math.round(Math.random())) {
    case 0:
      enemy = { x: 800 * Math.random(),  y: 600 * Math.random(), renderer: <RangedEnemy />, isAlive: true, type: 'ranged' };
      break;
    default:
      enemy = { x: 800 * Math.random(),  y: 600 * Math.random(), renderer: <MeleeEnemy />, isAlive: true, type: 'melee' };
      break;
  }

  entities[`enemy${totalSpawnedEnemies}`] = enemy;
  currentEnemies++;
  totalSpawnedEnemies++;
  return entities;
}

export { UpdateState };