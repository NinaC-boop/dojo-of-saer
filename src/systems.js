
let mouseX = 0;
let mouseY = 0;
let speed = 0.03;
let boxx = -1;
let boxy = -1;

let animationTimer = 2000;



const MoveBox = (entities, { input }) => {
  //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
  //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
  //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
  //-- That said, it's probably worth considering performance implications in either case.

  const { payload } = input.find(x => x.name === "onMouseMove") || {};

  if (payload) {
    mouseX = payload.pageX;
    mouseY = payload.pageY;
  }

  const player = entities["player"];
  boxx = player.x;
  boxy = player.y;

  if (boxx !== mouseX && boxy !== mouseY) {
    player.x = boxx + (mouseX - boxx) * speed;
    player.y = boxy + (mouseY - boxy) * speed;
  }

  return entities;
};

export { MoveBox };
