import React from 'react'
import { Field } from 'redux-form'
import { NumericInput, rules } from '../components/reduxform'
import CommonModal from './CommonModal'
import SuccessModal from './SuccessModal'
import { util, format } from '../logic/utils'
import { Coin } from '../logic'

function parse(decimals) {
  return (v) => {
    return v? format.decimals((v).toString(), decimals).toString() : undefined
  }
}

function normalize(v) {
  return v? v.replace(',', '.') : undefined
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
      rate: '2',
      from: {
        max: '100',
        min: '0.1',
        decimals: 8,
        loading: false
      },
      to: {
        max: '100000',
        min: '1',
        decimals: 4,
        loading: false
      },
      fixedRate: false
    }
    
    const { from, to } = this.state
    this.betweenRuleFrom = rules.betweenBtc(from.min, from.max, from.decimals)
    this.beetweenRuleTo =  rules.betweenBtc(to.min, to.max, to.decimals)
  }

  setSuccess = () => setState({ success: true })

  async componentDidMount() {
    const { change, initCurrencyFrom, initCurrencyTo } = this.props
    change(fields.currencyFrom, initCurrencyFrom || 'BTC')
    change(fields.currencyTo, initCurrencyTo || 'LTC')
  }

  renderCurrencyOption(name, readonly) {
    return (
      <Field 
        name={name} 
        readOnly={readonly}
        style="border: none" 
        component="select"
        onChange={(e, v) => this.onCurrencyChanged(v)}
        validate={[ rules.required ]}
        
      >
        <option value="BTC">BTC</option>
        <option value="LTC">LTC</option>
        <option value="ETH">ETH</option>
      </Field>
    )
  }

  onCurrencyChanged = async (from, to) => {
    const { doRequest, currencyTo, currencyFrom } = this.props

    const res = await doRequest({
      url: 'https://www.bitfi.com/exchange/minimum',
      method: 'get',
      body: {
        fromSymbol: currencyFrom.toLowerCase(),
        toSymbol: currencyTo.toLowerCase()
      }
    })

    console.log(res)
    //this.onValueChanged(from, to)
    //console.log(`On currency changed ${from} ${to}`)
  }

  onValueChangedFrom = util.debounce(async (v) => {
    try {
      const { doRequest, currencyFrom, currencyTo, valid, change } = this.props
      
      const body = {
        fromSymbol: currencyFrom.toLowerCase(),
        toSymbol: currencyTo.toLowerCase(),
        amountFrom: v,
        fixedRate: this.state.fixedRate
      }
      console.log('REQUEST')
      const res = await doRequest({
        url: 'https://www.bitfi.com/exchange/estimate',
        method: 'post',
        body
      })
      console.log(res)
      this.setLoading(false, 'to', () => {
        return res && res.amountTo && change(fields.to, res.amountTo)
      })
    }
    catch (exc) {
      this.setLoading(false, 'to')
    }
  }, DEBOUNCE_MSEC)

  setLoading = (value, name, callback) => {
    this.setState({ [name]: { ...this.state[name], loading: value } }, () => {
      value && this.props.change(fields[name], '')
      callback && callback()
    })
  }

  onValueChangedTo = util.debounce(async (v) => {
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
    }
    catch (exc) {
      this.setLoading(false, 'from')
    }
  }, DEBOUNCE_MSEC)

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

    return (
      <React.Component>
        <button 
          type="submit" 
          className="btn btn-primary" 
          onClick={handleSubmit(this.onSubmit)}
        >
          Swap
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

  render() {
    const { isOpen, onClose, change, errors } = this.props
    const { success, from, to, rate, loading, fixedRate } = this.state
    //const { currencyFrom, currencyTo, amountTo, amountFrom } = this.props
    //console.log(currencyFrom, amountFrom, currencyTo, amountTo)
    
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
            onClick={() => this.setState({ fixedRate: false })} 
            className={`btn ${!fixedRate? 'btn-success' : 'btn-link'}`}
          >
            Floating rate
          </button>
          <button 
            onClick={() => this.setState({ fixedRate: true })} 
            className={`btn ${fixedRate? 'btn-success' : 'btn-link'}`}
          >
            Fixed rate
          </button>
        </div>
        <form>
          <div className="form-group">
            <Field 
              readOnly={from.loading}
              placeholder={from.loading? '...' : ''}
              name={fields.from} 
              parse={parse(from.decimals)}
              format={(v) => v && v.replace(',', '.')}
              component={NumericInput} 
              onChange={(e, v) => {
                /*
                  const fiat = Coin
                    .fromBtc((v || 0).toString(), from.decimals)
                    .fiat(rate)
                */

                //change(fields.to, fiat)
                this.setLoading(true, 'to')
                this.onValueChangedFrom(v)
              }}
              validate={[ rules.required, this.betweenRuleFrom ]}
              suffix={this.renderCurrencyOption(fields.currencyFrom)}
            />
          </div>
          
          <button
            type="button"
            onClick={this.swapCurrencies} 
            className="btn btn-link"
          >
            vice versa
          </button>

          <div className="form-group">
            <Field 
              readOnly={to.loading}
              placeholder={to.loading? '...' : ''}
              name={fields.to} 
              parse={parse(2)}
              component={NumericInput}
              onChange={(e, v) => {
                /*
                  const btc = Coin
                    .fromFiat((v || 0).toString(), to.decimals, rate, 2)
                    .btc

                  change(fields.from, btc)
                */
                this.setLoading(true, 'from')
                this.setState({ fixedRate: true })
                this.onValueChangedTo(v)
              }}
              validate={[ rules.required, this.beetweenRuleTo ]} 
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
