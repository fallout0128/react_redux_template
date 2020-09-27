import React from "react";
import "./App.css"

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="component-app text-red">
        Hello world!
      </div>
    );
  }
}