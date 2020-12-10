import { reduxForm } from 'redux-form'
import React from 'react'
import { forceModalUnmount } from '../hoc'
import SwapModalComponent from './SwapModalComponent'

function withData(WrappedComponent) {  
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        decimals: 8, 
        rate: '2',
        from: {
          max: '1.23',
          min: '0.1'
        },
        to: {
          max: '2.23',
          min: '0.3'
        }
      }

      this.onCurrencyChanged = this.onCurrencyChanged.bind(this)
      this.onValueChanged = this.onValueChanged.bind(this)
    }

    onCurrencyChanged(from, to) {
      console.log(`On currency changed ${from} ${to}`)
    }

    onValueChanged(from, to) {
      console.log(`On value changed ${from} ${to}`)
    }

    render() {
      return (
        <WrappedComponent 
          {...this.props} 
          data={this.state}
          onValueChanged={this.onValueChanged}
          onCurrencyChanged={this.onCurrencyChanged}
        />
      )
    }
  };
}

const enchanced = withData(SwapModalComponent)

export default forceModalUnmount(
  reduxForm({
    form: 'SwapValidation'
  }
)(enchanced))
