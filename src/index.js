
import ReactDOM from 'react-dom/client';
import './index.css';

import React, { PureComponent } from "react";
import { GameEngine } from "react-game-engine";
import { Box, Indicator } from "./renderers";
import { Move, MoveIndicator, UpdateEntities } from "./movement"
import { UpdateState } from "./state";

export default class SimpleGame extends PureComponent {
  render() {
    return (
      <GameEngine
        style={{ width: 800, height: 600, backgroundColor: "blue" }}
        systems={[Move, UpdateState, MoveIndicator, UpdateEntities]}
        entities={{
          //-- Notice that each entity has a unique id (required)
          //-- and a renderer property (optional). If no renderer
          //-- is supplied with the entity - it won't get displayed.
          player: { x: 200,  y: 200, renderer: <Box />, isAlive: true, isAttacking: false},
          indicator: { x: 205, y: 205, renderer: <Indicator/>}
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
