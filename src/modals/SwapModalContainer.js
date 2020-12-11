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

function mapStateToProps(state) {
  const currencyFrom = selector(state, fields.currencyFrom) || 'BTC'
  const currencyTo = selector(state, fields.currencyTo) || 'LTC'
  const amountFrom = selector(state, fields.from)
  const amountTo = selector(state, fields.to)

  return {
    currencyTo,
    currencyFrom,
    amountFrom,
    amountTo
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormContainer)

