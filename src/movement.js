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




let attackAnimation = 200;

const PlayerState = {
    Run: 0,
    Attack: 1,
    Dead: 2,
    Idle: 3,
}

let playerState = PlayerState.Idle;
let setDistance = 50;


const Move = (entities, { input }) => {
    entities = MovePlayer(entities, { input });
    entities = MoveEnemies(entities, { input });
    // entities = MoveIndicator(entities, { input });
  
    return entities;
};

const distanceFromPlayer = 30;
const getAngleFromPlayer = () => {
    // if negative the mouse is behind the player
    const distanceX = mouseX - playerX;
}

const MoveIndicator = (entities, { input }) => {
    // const { payload } = input.find(x => x.name === "onMouseMove") || {}
    const indicator = entities["indicator"];


    // console.log(mouseX)
    // console.log(mouseY)
    // if (payload) {
        indicator.x = playerX + distanceFromPlayer;
        indicator.y = playerY + distanceFromPlayer;
    // }

    return entities;
}

const MovePlayer = (entities, { input }) => {
    //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
    //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
    //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
    //-- That said, it's probably worth considering performance implications in either case.

    let defaultPayload = undefined;

    if (playerState !== PlayerState.Attack) {
        if (input.some(x => x.name === "onMouseDown")) {
            // playerState = PlayerState.Attack;
            // defaultPayload = input.find(x => x.name === "onMouseDown").payload;
        } else if (input.some(x => x.name === "onMouseMove")) {
            playerState = PlayerState.Run;
            defaultPayload = input.find(x => x.name === "onMouseMove").payload;
        }
    }

  
    if (defaultPayload) {
        // console.log(input[0]);
      mouseX = defaultPayload.pageX;
      mouseY = defaultPayload.pageY;
    }
    const box1 = entities["box1"];
    switch (playerState) {
        case PlayerState.Run:
            // setDistance = 50;
            // const { payload } = input.find(x => x.name === "onMouseMove") || {};
            // defaultPayload = payload;
        
            playerX = box1.x;
            playerY = box1.y;
          
            if (playerX !== mouseX && playerY !== mouseY) {
              box1.x = playerX + (mouseX - playerX) * playerSpeed;
              box1.y = playerY + (mouseY - playerY) * playerSpeed;
            }
            break;
        case PlayerState.Idle:
            // setDistance = 20;
            break;
        case PlayerState.Attack:
            // attackAnimation -= 1;
            // if (attackAnimation <= 0) {
            //     attackAnimation = 200;
            //     playerState = PlayerState.IDLE;
            //     break;
            // }

            
            // const attackSpeed = 5;

            // const dx = mouseX - playerX;
            // const dy = mouseY - playerY;

            // const distance = Math.sqrt(dx * dx + dy * dy);
            // const angle = Math.atan2(dx, dy);

            // const offsetX = Math.cos(angle) * attackSpeed;
            // const offsetY = Math.sin(angle) * attackSpeed;


            // if (setDistance > 0) {
            //     box1.x += offsetX;
            //     box1.y += offsetY;
            // }
            // setDistance -= Math.abs(distance)

            break;
        default:
            break;
    }


  

  
    return entities;
};

const MoveEnemies = (entities, { input }) => {
    let numEntities = Object.keys(entities).length;
    for (let i = 0; i < numEntities && numEntities !== 1; i++) {
        const enemy = entities[`enemy${i}`];
        if (enemy) {
            const distanceToPlayer = getDistanceBetweenPlayerAndEntity(enemy);
            switch(enemy.type) {
                case 'ranged':
                    if (distanceToPlayer > enemyRangedRange) {
                        applyEnemyState(EnemyState.RangedMovement, enemy, enemySpeed);
                    } else if (distanceToPlayer < enemyFleeRange) {
                        applyEnemyState(EnemyState.Flee, enemy, enemySpeed * 2);
                    } else {
                        // attack
                    }
                    break;
                case 'melee':
                default:
                    // if distance is in melee range, attack with melee attack
                    if (distanceToPlayer < enemyMeleeRange) {
                        // attack
                        applyEnemyState(EnemyState.MeleeAttack, enemy, enemySpeed);
                    } else {
                        applyEnemyState(EnemyState.Follow, enemy, enemySpeed);
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
    RangedMovement: 2,
    Flee: 3,
}

function applyEnemyState(enemyState, entity, speed) {
    if (entity) {
        switch (enemyState) {
            case EnemyState.MeleeAttack:
                entity.x = entity.x + (playerX - entity.x) * 1.5;
                entity.y = entity.y + (playerY - entity.y) * 1.5;
                break;
            case EnemyState.RangedMovement:
                entity.x = entity.x + (playerX - entity.x) * speed;
                entity.y = entity.y + (playerY - entity.y) * speed;
                break;
            case EnemyState.Flee:
                entity.x = entity.x - (playerX - entity.x) * speed;
                entity.y = entity.y - (playerY - entity.y) * speed;
                break;
            case EnemyState.Follow:
            default:
                entity.x = entity.x + (playerX - entity.x) * speed;
                entity.y = entity.y + (playerY - entity.y) * speed;
                break;
        }
    }
    return entity;
}

function getDistanceBetweenPlayerAndEntity(entity) {
    return Math.abs(Math.sqrt((playerX - entity.x)**2 + (playerY - entity.y)**2));
}

export { Move, MoveIndicator };