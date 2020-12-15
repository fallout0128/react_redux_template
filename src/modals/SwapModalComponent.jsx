import React from 'react'
import { change, Field } from 'redux-form'
import { NumericInput, rules, Dropdown } from '../components/reduxform'
import CommonModal from './CommonModal'
import SuccessModal from './SuccessModal'
import { util, format } from '../logic/utils'


function parse(decimals) {
  return (v) => {
    return v? format.decimals((v).toString(), decimals).toString() : undefined
  }
}

const DEBOUNCE_MSEC = 1000

export const fields = {
  from: 'from',
  to: 'to',
  currencyTo: 'currencyTo',
  currencyFrom: 'currencyFrom'
}

export default class SwapModalComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      success: false,
      from: {
        max: '100',
        decimals: 8,
        loading: false
      },
      to: {
        decimals: 8,
        loading: false
      },
      fixedRate: false,
      currencies: {
        fixed: [],
        floating: []
      }
    }
    
    const { from, to } = this.state
    this.notmoreThanBalance = rules.maxBtc(
      props.balance.btc, 
      from.decimals, 
      { 
        included: true, 
        message: v => `
          Insufficient balance: enter value 
          less or equal to ${v} ${this.props.initCurrencyFrom}`
      }
    )
    this.debounced = util.debounce(this.onValueChangedIml, DEBOUNCE_MSEC)
  }

  setSuccess = () => setState({ success: true })

  async componentDidMount() {
    const { change, initCurrencyFrom, initCurrencyTo, doRequest } = this.props
    
    const currencyFrom = initCurrencyFrom 
    const currencyTo = initCurrencyTo

    const res = await doRequest({
      method: 'post',
      url: 'https://www.bitfi.com/exchange/currencies',
      body: {
        filter: 'ALL'
      }
    })
    const fixed = res.filter(v => v.fixedRateEnabled)
    const floating = res.filter(v => !v.fixedRateEnabled)
    
    this.setState({
      currencies: {
        fixed,
        floating
      }
    })

    change(fields.currencyFrom, currencyFrom)
    change(fields.currencyTo, currencyTo)

    
  }

  renderItem = (item, i, onSelected) => (
    <div
      onClick={onSelected}  
      className="w-100 d-flex d-flex justify-content-between pl-4 pr-4"
    >
      <a className="w-100  p-0">{item.value}</a> 
      <div>{item.fixedRate? 'fixed' : ''}</div>
    </div>
  )

  renderCurrencyOption = (name, readonly) => {
    const { initCurrencyFrom } = this.props
    const { currencies: { fixed, floating } } = this.state 
    
    const currencies = [...fixed, ...floating]
    const names = currencies.map(v => ({ 
      fixedRate: v.fixedRateEnabled,
      value: v.currencySymbol.toUpperCase() 
    }))

    return (
      <Field 
        name={name} 
        readOnly={readonly}
        elements={names} 
        component={Dropdown}
        onChange={(v, i) => {
          console.log(v)
          this.onCurrencyChanged(this.props.currencyFrom, v)}
        }
        validate={[ rules.required ]}
        renderItem={this.renderItem}
      >
      </Field>
    )
  }


  onRateTypeChanged = (v) => {
    const { amountFrom } = this.props
    this.setState({ fixedRate: v }, () => {
      this.onValueChanged(amountFrom, fields.to)
    })
  }

  onCurrencyChanged = async (from, to) => {
    this.onValueChanged(this.props.amountFrom, fields.to)
  }

  onValueChanged = async (v, updateField) => {
    this.setLoading(true, updateField)
    return this.debounced(v, updateField)
  }

  onValueChangedIml = async (v, updateField) => {
    try {
      const { doRequest, change, currencyFrom, currencyTo, valid } = this.props
      const fromSymbol = updateField === fields.to? currencyFrom : currencyTo
      const toSymbol = updateField === fields.to? currencyTo : currencyFrom 

      const body = {
        fromSymbol,
        toSymbol,
        amountFrom: v,
        fixedRate: this.state.fixedRate
      }
      
      const res = await doRequest({
        url: 'https://www.bitfi.com/exchange/estimate',
        method: 'post',
        body
      })

      this.setState({ rate: res.rate })
      this.setLoading(false, updateField, () => {
        return res && res.amountTo && change(updateField, res.amountTo)
      })
    }
    catch (exc) {
      this.setState({ rate: null })
      this.setLoading(false, updateField)
      change(updateField, '')
    }
  }

  setLoading = (value, name, callback) => {
    this.setState({ [name]: { ...this.state[name], loading: value } }, () => {
      value && this.props.change(fields[name], '')
      callback && callback()
    })
  }

  onSubmit = (data) => {
    console.log(data)
    //this.setSuccess(true)
  }

  renderButtons = () => {
    const { handleSubmit, onClose } = this.props
    const { from: { loading: loadingFrom }, to: { loading: loadingTo }, errors } = this.state
    const loading = loadingFrom || loadingTo

    return (
      <React.Component>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || errors}
          onClick={handleSubmit(this.onSubmit)}
        >
          {loading? '...' : 'Swap'}
        </button>

        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
        >
          Close
        </button>
      </React.Component>
    )
  }
  
  renderError = ({input, meta, ...props}) => (
    meta.error &&
    <div className="alert alert-danger">
      <small>{meta.error}</small>
    </div>
  )

  render() {
    const { isOpen, onClose, errors, initCurrencyFrom, currencyTo } = this.props
    const { success, from, to, rate, fixedRate } = this.state
    const loading = from.loading || to.loading
    
    if (success) {
      return (
        <SuccessModal
          isOpen={isOpen}
          onClose={onClose}
        />
      )
    }
    return (
      <CommonModal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Swap"
        buttons={this.renderButtons()}
      >
        <div>
        
          <div className="d-flex">
            <button 
              onClick={() => this.onRateTypeChanged(false)} 
              className={`btn ${!fixedRate? 'btn-success' : 'btn-link'}`}
            >
              Floating rate
            </button>
            <button 
              onClick={() => this.onRateTypeChanged(true)} 
              className={`btn ${fixedRate? 'btn-success' : 'btn-link'}`}
            >
              Fixed rate
            </button>
          </div>
          <form>
            <div className="form-group">
              <Field 
                readOnly={from.loading}
                placeholder={from.loading? '...' : 'YOU SEND'}
                name={fields.from} 
                parse={parse(from.decimals)}
                format={(v) => v && v.replace(',', '.')}
                component={NumericInput} 
                onChange={(e, v) => this.onValueChanged(v, fields.to)}
                suffix={<div className="p-2 pr-3">BTC</div>}
              />
            </div>
            
            {
              <div className={`${fixedRate? 'text-success' : ''}`}>
                <small>1 {initCurrencyFrom.toUpperCase()} {fixedRate? '=' : '~'} {(rate && !loading)? parseFloat(rate).toFixed(4) : '...'} {currencyTo.toUpperCase()}</small>
              </div>
            }

            <div className="form-group">
              <Field 
                readOnly={to.loading}
                placeholder={to.loading? '...' : 'YOU RECEIVE'}
                name={fields.to} 
                parse={parse(to.decimals)}
                component={NumericInput}
                onChange={(e, v) => this.setState({ fixedRate: true }, () => 
                    this.onValueChanged(v, fields.from)
                  )
                }
                suffix={this.renderCurrencyOption(fields.currencyTo, loading)}
              />
            </div>
          </form>
          <div>
            <Field 
              name={fields.from} 
              component={this.renderError} 
              validate={[ this.notmoreThanBalance ]}
            />
          </div>
          {errors}
        </div>
      </CommonModal>
    )
  }
}
