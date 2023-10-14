import { Box, Enemy } from "./renderers";

let score = 0;
let multiplier = 1;
let multiplierTimer = 0;
let bestMultiplier = 1;
let kills = 0;
let spawnLength = 1000;
let spawnTimer = 1000; // game ticks until next spawn

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
  entities[`enemy${totalSpawnedEnemies}`] = { x: 800 * Math.random(),  y: 600 * Math.random(), renderer: <Enemy />, isAlive: true };

  currentEnemies++;
  totalSpawnedEnemies++;
  return entities;
}

export { UpdateState };