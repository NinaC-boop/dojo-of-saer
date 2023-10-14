import React, { PureComponent } from "react";

//hello
class Box extends PureComponent {
  render() {
    const size = 30;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: "red", left: x, top: y }} />
    );
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
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: "black", left: x, top: y }} />
    );
  }
}

class RangedEnemy extends PureComponent {
  render() {
    const size = 30;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: "green", left: x, top: y }} />
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
      <div style={{ position: "absolute", width: width, height: height, backgroundColor: "yellow", left: x, top: y }} />
    );
  }
}

export { MeleeEnemy, RangedEnemy, Bullet };