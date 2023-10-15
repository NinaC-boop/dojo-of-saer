import { Bullet } from "./renderers";
import { AnimationHandler, AnimationType } from './animation';

let mouseX = 0;
let mouseY = 0;
let playerSpeed = 0.01;
let playerX = -1;
let playerY = -1;
let enemySpeed = 0.005;
let enemyMeleeRange = 50;
let enemyRangedRange = 300;
let enemyFleeRange = 100;
let gameWidth = 800;
let gameHeight = 600;
let hitbox = 30;
let bulletCounter = 0;
let enemyBulletCooldown = 200;


const ATTACK_ANIMATION_DURATION = 70;
let attackAnimation = ATTACK_ANIMATION_DURATION;
const distanceToTravel = 200;
const distanceFromPlayer = 50;


let currentTravelled = 0;
let defaultPayload = undefined;

const PlayerState = {
    Run: 0,
    Attack: 1,
    Dead: 2,
    Idle: 3,
}

let playerState = PlayerState.Idle;
const animationHandler = new AnimationHandler();
const Move = (entities, { input }) => {
    entities = MovePlayer(entities, { input });
    entities = MoveEnemies(entities, { input });
    entities = MoveBullets(entities, { input });
    // entities = MoveIndicator(entities, { input });
  
    return entities;
};


const getAngleFromPlayer = () => {
    // if negative the mouse is behind the player
    const distanceX = mouseX - playerX;

    // if negative the mouse is above the player
    const distanceY = mouseY - playerY;

    return Math.atan2(distanceY, distanceX);
}

const MoveIndicator = (entities, { input }) => {
    const indicator = entities["indicator"];
    const player = entities["player"];
    const angle = getAngleFromPlayer();
    
    const indicatorDistanceX = Math.cos(angle) * distanceFromPlayer;
    const indicatorDistanceY = Math.sin(angle) * distanceFromPlayer;

    indicator.x = player.x + indicatorDistanceX;
    indicator.y = player.y + indicatorDistanceY;

    return entities;
}

const MovePlayer = (entities, { input }) => {
    //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
    //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
    //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
    //-- That said, it's probably worth considering performance implications in either case.


    if (playerState !== PlayerState.Attack && playerState !== PlayerState.Dead) {
        if (input.some(x => x.name === "onMouseDown")) {
            playerState = PlayerState.Attack;
            defaultPayload = input.find(x => x.name === "onMouseDown").payload;
        } else if (input.some(x => x.name === "onMouseMove")) {
            playerState = PlayerState.Run;
            defaultPayload = input.find(x => x.name === "onMouseMove").payload;
        }
    }

    if (defaultPayload) {
      mouseX = defaultPayload.pageX;
      mouseY = defaultPayload.pageY;
    }
    const player = entities["player"];

    switch (playerState) {
        case PlayerState.Run:
            player.isAttacking = false;
        
            playerX = player.x;
            playerY = player.y;

            if (playerX !== mouseX && playerY !== mouseY) {
              player.x = playerX + (mouseX - playerX) * playerSpeed;
              player.y = playerY + (mouseY - playerY) * playerSpeed;
            }
            break;
        case PlayerState.Attack:
            player.isAttacking = true;
            attackAnimation -= 1;
            if (attackAnimation <= 0) {
                attackAnimation = ATTACK_ANIMATION_DURATION;
                currentTravelled = 0;
                playerState = PlayerState.Run;
                break;
            }

            if (currentTravelled > distanceToTravel) {
                break;
            }
            const timeTaken = 30;
            const angle = getAngleFromPlayer();
            
            let distanceToMoveX = Math.cos(angle) * distanceToTravel;
            let distanceToMoveY = Math.sin(angle) * distanceToTravel;

            const velocityX =  distanceToMoveX / timeTaken;
            const velocityY =  distanceToMoveY / timeTaken;

            const totalTravelled = Math.sqrt(velocityX * velocityX + velocityY * velocityY)

            currentTravelled += totalTravelled;

            player.x += velocityX;
            player.y += velocityY;

            // leave trail particles eventually


            break;
        case PlayerState.Dead:
            // show death animtion
            if (animationHandler.hasEnded()) {
                break;
            }
            animationHandler.play(player, "player", AnimationType.Dead);
            animationHandler.handleAnimationTime();
            // player.colour = "purple"
            
            // play death sound

            // restart game
            break;
        default:
            player.isAttacking = false;
            break;
    }


  

  
    return entities;
};

const MoveEnemies = (entities, { input }) => {
    const player = entities["player"];
    let numEntities = Object.keys(entities).length;
    for (let i = 0; i < numEntities && numEntities !== 1; i++) {
        const enemy = entities[`e${i}`];
        if (enemy && player) {
            const distanceToPlayer = getDistanceBetweenPlayerAndEntity(player, enemy);
            switch(enemy.type) {
                case 'ranged':
                    if (distanceToPlayer > enemyRangedRange) {
                        applyEnemyState(player, EnemyState.RangedMovement, enemy, enemySpeed, entities);
                    } else if (distanceToPlayer < enemyFleeRange) {
                        applyEnemyState(player, EnemyState.Flee, enemy, enemySpeed * 2, entities);
                    } else {
                        applyEnemyState(player, EnemyState.RangedAttack, enemy, 0, entities);
                        // attack
                    }
                    break;
                case 'melee':
                default:
                    // if distance is in melee range, attack with melee attack
                    if (distanceToPlayer < enemyMeleeRange) {
                        // attack
                        applyEnemyState(player, EnemyState.MeleeAttack, enemy, enemySpeed, entities);
                    } else {
                        applyEnemyState(player, EnemyState.Follow, enemy, enemySpeed, entities);
                    }
                    break
            }
        }
    }
  
    return entities;
};

const EnemyState = {
    Follow: 0,
    MeleeAttack: 1,
    RangedAttack: 2,
    RangedMovement: 3,
    Flee: 4,
}

function applyEnemyState(player, enemyState, entity, speed, entities) {
    // if there's a cooldown, do animation
    if (entity.cooldown && entity.cooldown > 0) {
        switch (enemyState) {
            case EnemyState.MeleeAttack:
            case EnemyState.RangedAttack:
            case EnemyState.RangedMovement:
            case EnemyState.Flee:
            case EnemyState.Follow:
            default:
                return entities;
        }
    }

    switch (enemyState) {
        case EnemyState.MeleeAttack:
            entity.x = entity.x + (player.x - entity.x) * 1.5;
            entity.y = entity.y + (player.y - entity.y) * 1.5;
            entity.isAttacking = true;
            break;
        case EnemyState.RangedAttack:
            entity.isAttacking = true;
            entity.cooldown = enemyBulletCooldown;
            return AddBullet(player, entity, entities);
        case EnemyState.RangedMovement:
            entity.x = entity.x + (player.x - entity.x) * speed;
            entity.y = entity.y + (player.y - entity.y) * speed;
            entity.isAttacking = true;
            break;
        case EnemyState.Flee:
            entity.x = entity.x - (player.x - entity.x) * speed;
            entity.y = entity.y - (player.y - entity.y) * speed;
            entity.isAttacking = false;
            break;
        case EnemyState.Follow:
        default:
            entity.x = entity.x + (player.x - entity.x) * speed;
            entity.y = entity.y + (player.y - entity.y) * speed;
            entity.isAttacking = false;
            break;
    }

    return entities;
}

function getDistanceBetweenPlayerAndEntity(player, entity) {
    return Math.abs(Math.sqrt((player.x - entity.x)**2 + (player.y - entity.y)**2));
}


const MoveBullets = (entities, { input }) => {
    for (let i = 0; i < bulletCounter; i++) {
        const bullet = entities[`b${i}`];
        if (bullet) {
            bullet.x += bullet.uX;
            bullet.y += bullet.uY;
            if (isBulletOutOfBounds(bullet)) {
                delete entities[`b${i}`];
            }
        }
    }
  
    return entities;
};

// shoots a bullet from the entity to the player
const AddBullet = (player, entity, entities) => {
    const mX = player.x - entity.x;
    const mY = player.y - entity.y;
    const [uX, uY] = calcUnitVectorFromVector(mX, mY);
    const rotation = calcAngleDegreesFromVector(mX, mY);
    console.log(rotation)
    const bullet = { x: entity.x,  y: entity.y, renderer: <Bullet />, isAlive: true, type: 'ranged', isAttacking: true, rotation, uX, uY };
    entities[`b${bulletCounter}`] = bullet;
    bulletCounter++;
    return entities;
}

function calcAngleDegreesFromVector(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
}

function calcUnitVectorFromVector(x, y) {
    const magnitude = Math.sqrt(x * x + y * y);
    return [x / magnitude, y / magnitude];
}

function isBulletOutOfBounds(bullet) {
    if (bullet.x < 0 || bullet.x > gameWidth || bullet.y < 0 || bullet.y > gameHeight) {
        return true;
    }
    return false;
}

const UpdateEntities = (entities, { input }) => {
    const player = entities["player"];
    let numEntities = Object.keys(entities).length;
    for (let i = 0; i < numEntities && numEntities !== 1; i++) {
        const enemy = entities[`e${i}`];
        const bullet = entities[`b${i}`];
        if (enemy) {
            const distanceToPlayer = Math.round(getDistanceBetweenPlayerAndEntity(player, enemy));
            if (distanceToPlayer < hitbox) {
                if (player.isAttacking === false) {
                    player.isAlive = false;
                    playerState = PlayerState.Dead;
                } else {
                    console.log('you have hit the enemy')
                    enemy.isAlive = false;
                }
            }

            if (enemy.cooldown > 0) {
                enemy.cooldown--;
            }
        } else if (bullet) {
            const distanceToPlayer = Math.round(getDistanceBetweenPlayerAndEntity(player, bullet));
            if (distanceToPlayer < hitbox) {
                if (player.isAttacking === false) {
                    player.isAlive = false;
                    playerState = PlayerState.Dead;
                } else {
                    bullet.isAlive = false;
                }
            }
        }
    }
  
    return entities;
};

export { Move, MoveIndicator, UpdateEntities };