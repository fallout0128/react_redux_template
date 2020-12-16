import { reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { forceModalUnmount, withRequest } from '../hoc'
import SwapModalComponent, { fields } from './SwapModalComponent'

const form = 'SwapValidation'
const reduxFormContainer = forceModalUnmount(
  reduxForm({ form })(withRequest(SwapModalComponent))
)

const selector = formValueSelector(form)

function mapStateToProps(state, props) {
  const balance = {
    sat: '1000000000',
    btc: '1'
  }
  const initCurrencyFrom = props.initCurrencyFrom || 'BTC'
  const initCurrencyTo = props.initCurrencyTo || 'ETH'
  const currencyFrom = initCurrencyFrom
  const currencyTo = selector(state, fields.currencyTo) || initCurrencyTo
  const amountFrom = selector(state, fields.from)
  const amountTo = selector(state, fields.to)

  return {
    initCurrencyFrom,
    initCurrencyTo,
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

