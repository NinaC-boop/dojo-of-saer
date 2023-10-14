
import ReactDOM from 'react-dom/client';
import './index.css';

import React, { PureComponent } from "react";
import { GameEngine } from "react-game-engine";
import { Box } from "./renderers";
import { Move } from "./movement"
import { UpdateState } from "./state";

export default class SimpleGame extends PureComponent {
  render() {
    return (
      <GameEngine
        style={{ width: 800, height: 600, backgroundColor: "blue" }}
        systems={[Move, UpdateState]}
        entities={{
          //-- Notice that each entity has a unique id (required)
          //-- and a renderer property (optional). If no renderer
          //-- is supplied with the entity - it won't get displayed.
          box1: { x: 200,  y: 200, renderer: <Box />, isAlive: true}
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
