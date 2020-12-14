import React from 'react'
import { change, Field } from 'redux-form'
import { NumericInput, rules } from '../components/reduxform'
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
        max: '100000',
        decimals: 8,
        loading: false
      },
      fixedRate: false
    }
    
    const { from, to } = this.state
    this.notmoreThanBalance = rules.maxBtc(props.balance.btc, from.decimals, true)
    this.betweenRuleFrom = () => undefined
    this.onValueChangedFromDebounced = util.debounce(this.onValueChangedFrom, DEBOUNCE_MSEC)
    this.onValueChangedToDebounced = util.debounce(this.onValueChangedTo, DEBOUNCE_MSEC)
    
  }

  setSuccess = () => setState({ success: true })

  async componentDidMount() {
    const { change, initCurrencyFrom, initCurrencyTo } = this.props
    
    const currencyFrom = initCurrencyFrom 
    const currencyTo = initCurrencyTo

    //this.updateMinimum(currencyFrom, currencyTo)
    change(fields.currencyFrom, currencyFrom)
    change(fields.currencyTo, currencyTo)
  }

  updateMinimum = async (fromCurrency, toCurrency) => {
    const { doRequest } = this.props
    const { from } = this.state

    const body = {
      fromSymbol: fromCurrency.toLowerCase(),
      toSymbol: toCurrency.toLowerCase()
    }

    const res = await doRequest({
      url: 'https://www.bitfi.com/exchange/minimum',
      method: 'post',
      body
    })

    console.log(res)

    this.setState({
      from: {
        ...this.state.from,
        min: res.amount
      }
    })

    this.betweenRuleFrom = rules.betweenBtc(from.min, from.max, from.decimals)
  }

  renderCurrencyOption = (name, readonly) => {
    const { initCurrencyFrom } = this.props
    const currencies = [
      'BTC',
      'LTC',
      'ETH'
    ]

    return (
      <Field 
        name={name} 
        readOnly={readonly}
        style="border: none" 
        component="select"
        onChange={(e, v) => this.onCurrencyChanged(this.props.currencyFrom, v)}
        validate={[ rules.required ]}
        
      >
        {currencies.map(c => 
          <option 
            id={c} 
            disabled={initCurrencyFrom.toLowerCase() === c.toLowerCase()}
            value={c}
          >
            {c}
          </option>)
        }
      </Field>
    )
  }

  onRateTypeChanged = (v) => {
    const { amountFrom } = this.props
    this.setState({ fixedRate: v }, () => {
      this.setLoading(true, fields.to)
      this.onValueChangedFrom(amountFrom)
    })    
  }

  onCurrencyChanged = async (from, to) => {
    this.setLoading(true, fields.to, () => {
      change(fields.currencyTo, to)
      this.onValueChangedFrom(this.props.amountFrom, to)
    })
  }

  onValueChangedFrom = async (v, currency = undefined) => {
    try {
      const { doRequest, currencyFrom, touch, valid, change } = this.props
      let { currencyTo } = this.props

      if (currency) {
        currencyTo = currency
      }

      console.log(currency)

      const body = {
        fromSymbol: currencyFrom.toLowerCase(),
        toSymbol: currencyTo.toLowerCase(),
        amountFrom: v,
        fixedRate: this.state.fixedRate
      }
      
      const res = await doRequest({
        url: 'https://www.bitfi.com/exchange/estimate',
        method: 'post',
        body
      })
      this.setLoading(false, 'to', () => {
        return res && res.amountTo && change(fields.to, res.amountTo)
      })
      this.setState({ rate: res.rate })
    }
    catch (exc) {
      this.setState({ rate: null })
      this.setLoading(false, 'to')
      change(fields.to, '')
    }
  }

  setLoading = (value, name, callback) => {
    this.setState({ [name]: { ...this.state[name], loading: value } }, () => {
      value && this.props.change(fields[name], '')
      callback && callback()
    })
  }

  onValueChangedTo = async (v) => {
    try {
      const { doRequest, currencyFrom, currencyTo, valid, change } = this.props
                  
      const body = {
        fromSymbol: currencyTo.toLowerCase(),
        toSymbol: currencyFrom.toLowerCase(),
        amountFrom: v,
        fixedRate: true
      }
      
      const res = await doRequest({
        url: 'https://www.bitfi.com/exchange/estimate',
        method: 'post',
        body
      })

      this.setLoading(false, 'from', () => {
        return res && res.amountTo && change(fields.from, res.amountTo)
      })

      console.log(res)
      this.setState({ rate: res.rate })
    }
    catch (exc) {
      this.setLoading(false, 'from')
      this.setState({ rate: null })
      change(fields.to, '')
    }
  }

  onSubmit = (data) => {
    console.log(data)
    //this.setSuccess(true)
  }

  swapCurrencies = () => {
    const { currencyFrom, currencyTo, change, amountTo, amountFrom } = this.props
    
    const tmp = currencyFrom
    change(fields.currencyFrom, currencyTo)
    change(fields.currencyTo, tmp)
    this.onValueChanged(amountFrom, amountTo)
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
          disabled={loading}
          className="btn btn-secondary" 
          onClick={onClose}
        >
          {loading? '...' : 'Close'}
        </button>
      </React.Component>
    )
  }

  render() {
    const { isOpen, onClose, change, errors, initCurrencyFrom, currencyTo } = this.props
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
                onChange={(e, v) => {
                  this.setLoading(true, fields.to)
                  this.onValueChangedFromDebounced(v)
                }}
                validate={[ rules.required, this.betweenRuleFrom, this.notmoreThanBalance ]}
                suffix={<div className="p-2 pr-3">BTC</div>}
              />
            </div>
            
            {
              <div className={`${fixedRate? 'text-success' : ''}`}>
                  <small>1 {initCurrencyFrom.toUpperCase()} ~ {(rate && !loading)? parseFloat(rate).toFixed(4) : '...'} {currencyTo.toUpperCase()}</small>
              </div>
            }

            <div className="form-group">
              <Field 
                readOnly={to.loading}
                placeholder={to.loading? '...' : 'YOU RECEIVE'}
                name={fields.to} 
                parse={parse(to.decimals)}
                component={NumericInput}
                onChange={(e, v) => {
                  this.setLoading(true, fields.from)
                  this.setState({ fixedRate: true })
                  this.onValueChangedToDebounced(v)
                }}
                validate={[ /*rules.required*/ ]} 
                suffix={this.renderCurrencyOption(fields.currencyTo, loading)}
              />
            </div>
          </form>
          {errors}
        </div>
      </CommonModal>
    )
  }
}
