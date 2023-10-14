import { Box, MeleeEnemy, RangedEnemy } from "./renderers";

let score = 0;
let multiplier = 1;
let multiplierTimer = 0;
let bestMultiplier = 1;
let kills = 0;
let spawnLength = 600;
let spawnTimer = 600; // game ticks until next spawn

let maxEnemies = 5;
let currentEnemies = 0;
let totalSpawnedEnemies = 0;

const UpdateState = (entities, { input }) => {
  if (entities) {
    entities = spawnEnemies(entities);
    entities = UpdatePlayState(entities);
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
      enemy = { x: 800 * Math.random(),  y: 600 * Math.random(), renderer: <RangedEnemy />, isAlive: true, type: 'ranged', isAttacking: false };
      break;
    default:
      enemy = { x: 800 * Math.random(),  y: 600 * Math.random(), renderer: <MeleeEnemy />, isAlive: true, type: 'melee', isAttacking: false };
      break;
  }

  let numEntities = Object.keys(entities).length;
  let i = 0;
  for (i; i < numEntities; i++) {
    if (entities[`e${i}`] === undefined) {
      entities[`e${i}`] = enemy;
      currentEnemies++;
      totalSpawnedEnemies++;
      return entities;
    }
  }
  if (i === numEntities) {
    entities[`e${i}`] = enemy;
  }

  currentEnemies++;
  totalSpawnedEnemies++;
  return entities;
}

function UpdatePlayState(entities) {
  for (const property in entities) {
    const entity = entities[property];
    if (entity && entity.isAlive === false) {
      if (property.startsWith('e')) {
        console.log(`killing ${property}: ${entities[property]}`);
        kills++;
        delete entities[property];
        currentEnemies--;
      }
    }
  }
  return entities;
}

export { UpdateState };