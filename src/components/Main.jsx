import React from "react"
import { Field } from 'redux-form'
import { Link } from 'react-router-dom'
import { rules, TextInput } from '../components/reduxform'
import Counter from './Counter'
import { SwapModal } from '../modals'
import SwapHistory from './SwapHistory'
import "./Main.css"

export default class Main extends React.Component {
  constructor(props) {
    super(props)

    this.fields = {
      test: 'test'
    }
  }

  componentDidMount = () => {
    this.props.fetchData()
  }

  onSubmit = (data) => {
    console.log(data)
  }

  render() {
    const { loading, data, handleSubmit } = this.props
    return (
      <div className="component-app text-red">
        
        <div className="text-center">
          {loading? 'Loading...' : data}   
        </div>
        <Counter/>
        <Link className="text-center" to="/login">Check router</Link>

        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            readOnly={loading}
            className={`form-control`}
            name={this.fields.test}
            component={TextInput}
            
          />
          <button type="submit" className="mt-1 w-100 btn btn-primary">
            submit
          </button>
        </form>

        <SwapModal 
          isOpen={this.state.modal} 
          onClose={() => this.setState({ modal: false })} 
        />
        <button 
          className="btn btn-primary mt-2" 
          onClick={() => this.setState({ modal: true })}
        >
          show modal
        </button>

        <SwapHistory/>
      </div>
    );
  }
}