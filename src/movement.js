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
let hitbox = 20;


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

const Move = (entities, { input }) => {
    entities = MovePlayer(entities, { input });
    entities = MoveEnemies(entities, { input });
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
    const box1 = entities["box1"];
    const angle = getAngleFromPlayer();
    
    const indicatorDistanceX = Math.cos(angle) * distanceFromPlayer;
    const indicatorDistanceY = Math.sin(angle) * distanceFromPlayer;

    indicator.x = box1.x + indicatorDistanceX;
    indicator.y = box1.y + indicatorDistanceY;

    return entities;
}

const MovePlayer = (entities, { input }) => {
    //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
    //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
    //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
    //-- That said, it's probably worth considering performance implications in either case.


    if (playerState !== PlayerState.Attack) {
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
    const box1 = entities["box1"];

    switch (playerState) {
        case PlayerState.Run:
        
            playerX = box1.x;
            playerY = box1.y;

            if (playerX !== mouseX && playerY !== mouseY) {
              box1.x = playerX + (mouseX - playerX) * playerSpeed;
              box1.y = playerY + (mouseY - playerY) * playerSpeed;
            }
            break;
        case PlayerState.Attack:
            box1.isAttacking = true;
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

            box1.x += velocityX;
            box1.y += velocityY;


            break;
        case PlayerState.Dead:
            // show death animtion

            
            // play death sound
            break;
        default:
            break;
    }


  

  
    return entities;
};

const MoveEnemies = (entities, { input }) => {
    const player = entities["box1"];
    let numEntities = Object.keys(entities).length;
    for (let i = 0; i < numEntities && numEntities !== 1; i++) {
        const enemy = entities[`e${i}`];
        if (enemy && player) {
            const distanceToPlayer = getDistanceBetweenPlayerAndEntity(player, enemy);
            switch(enemy.type) {
                case 'ranged':
                    if (distanceToPlayer > enemyRangedRange) {
                        applyEnemyState(player, EnemyState.RangedMovement, enemy, enemySpeed);
                    } else if (distanceToPlayer < enemyFleeRange) {
                        applyEnemyState(player, EnemyState.Flee, enemy, enemySpeed * 2);
                    } else {
                        applyEnemyState(player, EnemyState.RangedAttack, enemy, 0);
                        // attack
                    }
                    break;
                case 'melee':
                default:
                    // if distance is in melee range, attack with melee attack
                    if (distanceToPlayer < enemyMeleeRange) {
                        // attack
                        applyEnemyState(player, EnemyState.MeleeAttack, enemy, enemySpeed);
                    } else {
                        applyEnemyState(player, EnemyState.Follow, enemy, enemySpeed);
                    }
                    break
            }
        }
    }
  
    return entities;
};

const ShootBullet = (entities) => {
    return entities;
}

const EnemyState = {
    Follow: 0,
    MeleeAttack: 1,
    RangedMovement: 2,
    Flee: 3,
    RangedAttack: 4,
}

function applyEnemyState(player, enemyState, entity, speed) {
    switch (enemyState) {
        case EnemyState.MeleeAttack:
            entity.x = entity.x + (player.x - entity.x) * 1.5;
            entity.y = entity.y + (player.y - entity.y) * 1.5;
            entity.isAttacking = true;
            break;
        // todo: ranged attack animation
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


    return entity;
}

function getDistanceBetweenPlayerAndEntity(player, entity) {
    return Math.abs(Math.sqrt((player.x - entity.x)**2 + (player.y - entity.y)**2));
}

const UpdateEntities = (entities, { input }) => {
    const player = entities["box1"];
    let numEntities = Object.keys(entities).length;
    for (let i = 0; i < numEntities && numEntities !== 1; i++) {
        const enemy = entities[`e${i}`];
        const bullet = entities[`b${i}`];
        if (enemy) {
            const distanceToPlayer = Math.round(getDistanceBetweenPlayerAndEntity(player, enemy));
            if (distanceToPlayer < hitbox) {
                if (player.isAttacking === false) {
                    player.isAlive = false;
                } else {
                    console.log('you have hit the enemy')
                    enemy.isAlive = false;
                }
            }
        } else if (bullet) {
            const distanceToPlayer = Math.round(getDistanceBetweenPlayerAndEntity(player, bullet));
            if (distanceToPlayer < hitbox) {
                if (player.isAttacking === false) {
                    player.isAlive = false;
                } else {
                    console.log('you have hit the bullet')
                    bullet.isAlive = false;
                }
            }
        }
    }
  
    return entities;
};

export { Move, MoveIndicator, UpdateEntities };