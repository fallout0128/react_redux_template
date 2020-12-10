import React, { useState, useEffect } from 'react'
import { Field } from 'redux-form'
import { NumericInput, rules } from '../components/reduxform'
import CommonModal from './CommonModal'
import SuccessModal from './SuccessModal'
import { useRequest } from '../hooks'
import { util, format } from '../logic/utils'
import { Coin } from '../logic'

function parse(decimals) {
  return (v) => format.decimals((v || 0).toString(), decimals).toString()
}

const fields = {
  from: 'from',
  to: 'to'
}

export default function SwapModal({ 
  isOpen, onClose, change, handleSubmit,
  data: { decimals, rate, from, to },
  onValueChanged,
  onCurrencyChanged
}) {
  const [success, setSuccess] = useState(false)
  const fromBetweenRule = rules.betweenBtc(from.min, from.max, decimals)

  const { errors, doRequest } = useRequest({
    url: 'http://invalid.http',
    method: 'get', 
    onSuccess: console.log
  })

  function renderCurrencyOption(name) {
    return (
      <Field 
        name={name} 
        style="border: none" 
        component="select"
        onChange={(e, v) => {
          onCurrencyChanged(v)
        }}
        validate={[ rules.required ]}
      >
        <option selected value="BTC">BTC</option>
        <option value="LTC">LTC</option>
        <option value="ETH">ETH</option>
      </Field>
    )
  }
  async function onSubmit(data) {
    console.log(data)
    setSuccess(true)
  }

  if (success) {
    return (
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
      />
    )
  }

  function renderButtons() {
    return (
      <React.Component>
        <button 
          type="submit" 
          className="btn btn-primary" 
          onClick={handleSubmit(onSubmit)}
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

  return (
    <CommonModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Swap"
      buttons={renderButtons()}
    >
      <div>
        <form>
          <div className="form-group">
            <Field 
              name={fields.from} 
              parse={parse(decimals)}
              component={NumericInput} 
              onChange={util.debounce((e, v) => {
                const fiat = Coin
                  .fromBtc((v || 0).toString(), decimals)
                  .fiat(rate)

                change(fields.to, fiat)
                onValueChanged(v, fiat)
              }, 1000)}
              validate={[ rules.required, fromBetweenRule ]}
              precision={10}
              suffix={renderCurrencyOption('currencyFrom')}
            />
          </div>

          <div className="form-group">
            <Field 
              name={fields.to} 
              parse={parse(2)}
              component={NumericInput}
              onChange={util.debounce((e, v) => {
                const btc = Coin
                  .fromFiat((v || 0).toString(), decimals, rate, 2)
                  .btc

                change(fields.from, btc)
                onValueChanged(btc, v)
              }, 1000)}
              validate={[ rules.required ]} 
              suffix={renderCurrencyOption('currencyTo')}
            />
          </div>
        </form>
        {errors}
      </div>
    </CommonModal>
  )
}

