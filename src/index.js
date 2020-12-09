import React from "react";
import ReactDOM from "react-dom"
import Modal from 'react-modal'
import Routes from "./routes"
import "./index.css"

Modal.setAppElement('#root')

ReactDOM.render(<Routes/>, document.getElementById("root"))