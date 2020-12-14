import React from 'react'
import { Link } from 'react-router-dom'
import SwapHistory from './SwapHistory'

export default class Page extends React.Component {
  render() {
    return (
      <div className="component-app">
        <div className="text-center">Router works fine!</div>
        <Link className="text-center" to="/">click to go back</Link>
      </div>
    )
  }
}