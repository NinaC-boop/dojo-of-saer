import React, { PureComponent } from "react";

//hello
class Box extends PureComponent {
  render() {
    const size = 30;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundImage: 'url(https://img.itch.zone/aW1nLzgwOTE0OTQuZ2lm/original/rY%2F0Cw.gif)', backgroundSize: 'cover', backgroundColor: this.props.colour ? this.props.colour : undefined, left: x, top: y }} />
    );
  }
}

class Particle extends PureComponent {
  render() {
    const size = 5;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    const sprite = this.props.particleSprite ? <div style={{ position: "absolute", width: size, height: size, backgroundColor: this.props.colour ? this.props.colour : "red", left: x, top: y }} /> : 
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: this.props.colour ? this.props.colour : "red", left: x, top: y }} />;

      return sprite;
  }
}

class Indicator extends PureComponent {
  render() {
    const size = 5;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: "yellow", left: x, top: y }} />
    );
  }
}

export { Box, Indicator };


class MeleeEnemy extends PureComponent {
  render() {
    const size = 30;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundImage: "url(https://openseauserdata.com/files/0e8c6265a67343510206c81a4765dee6.png)", backgroundSize: 'cover', left: x, top: y }} />
    );
  }
}

class RangedEnemy extends PureComponent {
  render() {
    const size = 30;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundImage: 'url(https://art.pixilart.com/thumb/d3ce805b67c19bb.png)', backgroundSize: 'cover', left: x, top: y }} />
    );
  }
}

class Bullet extends PureComponent {
  render() {
    const width = 30;
    const height = 3;
    const x = this.props.x - width / 2;
    const y = this.props.y - height / 2;
    return (
      <div style={{ position: "absolute", width: width, height: height, backgroundColor: "yellow", left: x, top: y, transform: `rotate(${this.props.rotation}deg)` }} />
    );
  }
}

class Scoreboard extends PureComponent {
  render() {
    return (
      <div style={{ position: "absolute", WebkitTextStroke: "1px black", color: "white", left: 20, top: 20 }}>
        { this.props.score }
      </div>
    );
  }
}

class Multiplier extends PureComponent {
  render() {
    return (
      <div style={{ position: "absolute", WebkitTextStroke: "1px black", color: "white", textAlign: 'right', width: this.props.gameWidth - 20, left: 20, top: this.props.gameHeight - 40 }}>
        { `x ${this.props.multiplier}` }
      </div>
    );
  }
}

class Title extends PureComponent {
  render() {
    return (
      <div style={{ WebkitTextStroke: "1px black", color: "white", margin: "auto", display: this.props.isPlaying ? "none" : "flex", alignItems: "center", justifyContent: "center" }}>
        Click to play
      </div>
    );
  }
}

export { MeleeEnemy, RangedEnemy, Bullet, Scoreboard, Multiplier, Particle, Title };