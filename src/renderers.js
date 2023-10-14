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

export { Box };


class Enemy extends PureComponent {
  render() {
    const size = 30;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: "black", left: x, top: y }} />
    );
  }
}

export { Enemy };