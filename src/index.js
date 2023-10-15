
import ReactDOM from 'react-dom/client';
import './index.css';

import React, { PureComponent } from "react";
import { GameEngine } from "react-game-engine";
import { Box, Indicator, Scoreboard, Multiplier } from "./renderers";
import { Move, MoveIndicator, UpdateEntities } from "./movement"
import { UpdateState } from "./state";

let gameWidth = 800;
let gameHeight = 600;

export default class SimpleGame extends PureComponent {
  render() {
    return (
      <GameEngine
        style={{ width: gameWidth, height: gameHeight, backgroundColor: "blue" }}
        systems={[Move, UpdateState, MoveIndicator, UpdateEntities]}
        entities={{
          //-- Notice that each entity has a unique id (required)
          //-- and a renderer property (optional). If no renderer
          //-- is supplied with the entity - it won't get displayed.
          player: { x: 200,  y: 200, renderer: <Box />, isAlive: true, isAttacking: false },
          indicator: { x: 205, y: 205, renderer: <Indicator /> },
          scoreboard: { renderer: <Scoreboard />, score: 0 },
          multiplier: { gameWidth, gameHeight, renderer: <Multiplier />, multiplier: 0 },
        }}>

      </GameEngine>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SimpleGame />
  </React.StrictMode>
);
