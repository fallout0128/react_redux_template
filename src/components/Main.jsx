import React from "react"
import { Link } from 'react-router-dom'
import "./Main.css"

export default class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchData()
  }

  render() {
    const { loading, data } = this.props
    return (
      <div className="component-app text-red">
        
        <div className="text-center">
          {loading? 'Loading...' : data}   
        </div>
        <Link className="text-center" to="/login">Check router</Link>
      </div>
    );
  }
}