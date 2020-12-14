import { reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { forceModalUnmount, withRequest } from '../hoc'
import SwapModalComponent, { fields } from './SwapModalComponent'

const form = 'SwapValidation'
const reduxFormContainer = forceModalUnmount(
  reduxForm({
    form
  }
)(withRequest(SwapModalComponent)))

const selector = formValueSelector(form)

function mapStateToProps(state, props) {
  const balance = {
    sat: '1000000000',
    btc: '1'
  }
  const currencyFrom = selector(state, fields.currencyFrom) || 'BTC'
  const currencyTo = selector(state, fields.currencyTo) || 'LTC'
  const amountFrom = selector(state, fields.from)
  const amountTo = selector(state, fields.to)

  return {
    initCurrencyFrom: props.initCurrencyFrom || 'BTC',
    initCurrencyTo: props.initCurrencyTo || 'ETH',
    currencyTo,
    currencyFrom,
    amountFrom,
    amountTo,
    balance
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormContainer)

