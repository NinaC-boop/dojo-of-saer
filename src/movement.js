let mouseX = 0;
let mouseY = 0;
let playerSpeed = 0.01;
let playerX = -1;
let playerY = -1;
let enemySpeed = 0.005;
let enemyMeleeRange = 50;



let attackAnimation = 200;

const PlayerState = {
    Run: 0,
    Attack: 1,
    Dead: 2,
    Idle: 3,
}

let playerState = PlayerState.Idle;
let attackPayload = undefined;


const Move = (entities, { input }) => {
    entities = MovePlayer(entities, { input });
    entities = MoveEnemies(entities, { input });
  
    return entities;
};

const MovePlayer = (entities, { input }) => {
    //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
    //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
    //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
    //-- That said, it's probably worth considering performance implications in either case.

    let defaultPayload = undefined;

    if (playerState !== PlayerState.Attack) {
        if (input.some(x => x.name === "onMouseDown")) {
            playerState = PlayerState.Attack;
            console.log('goes here')
            defaultPayload = input.find(x => x.name === "onMouseDown").payload;
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
            // const { payload } = input.find(x => x.name === "onMouseMove") || {};
            // defaultPayload = payload;
        
            playerX = box1.x;
            playerY = box1.y;
          
            if (playerX !== mouseX && playerY !== mouseY) {
              box1.x = playerX + (mouseX - playerX) * playerSpeed;
              box1.y = playerY + (mouseY - playerY) * playerSpeed;
            }
            break;
        case PlayerState.Attack:
            attackAnimation -= 1;
            if (attackAnimation <= 0) {
                attackAnimation = 200;
                playerState = PlayerState.IDLE;
                break;
            }

            let setDistance = 20;

            const attackSpeed = 5;

            const dx = mouseX - playerX;
            const dy = mouseY - playerY;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dx, dy);

            const offsetX = Math.cos(angle) * attackSpeed;
            const offsetY = Math.sin(angle) * attackSpeed;

            setDistance -= (offsetX + offsetY)
            if (setDistance > 0) {

            }
            box1.x += offsetX;
            box1.y += offsetY;


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
            // if distance is in melee range, attack with melee attack
            if (Math.abs(Math.sqrt((playerX - enemy.x)**2 + (playerY - enemy.y)**2)) < enemyMeleeRange) {
                applyMovementStrategy(MovementStrategy.MeleeAttack, enemy, enemySpeed);
            } else {
                applyMovementStrategy(MovementStrategy.Follow, enemy, enemySpeed);
            }
        }
    }
  
    return entities;
};


const MovementStrategy = {
    Follow: 0,
    MeleeAttack: 1,
}

function applyMovementStrategy(movementStrategy, entity, speed) {
    if (entity) {
        switch (movementStrategy) {
            case MovementStrategy.MeleeAttack:
                entity.x = entity.x + (playerX - entity.x) * 1.5;
                entity.y = entity.y + (playerY - entity.y) * 1.5;
            case MovementStrategy.Follow:
            default:
                entity.x = entity.x + (playerX - entity.x) * speed;
                entity.y = entity.y + (playerY - entity.y) * speed;
        }
    }
    return entity;
}

export { Move };