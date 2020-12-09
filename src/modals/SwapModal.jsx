import React, { useState } from 'react'
import { Field, reduxForm } from 'redux-form'
import { NumericInput, rules } from '../components/reduxform'
import CommonModal from './CommonModal'
import { useRequest } from '../hooks'
import { util } from '../logic/utils'
import { Coin } from '../logic'

function SwapModal({ isOpen, onClose, change, children, handleSubmit }) {
  const decimals = 8
  const rate = '10234.234'

  const { errors, doRequest } = useRequest({
    url: 'http://invalid.http',
    method: 'get', 
    onSuccess: console.log
  })

  const fields = {
    from: 'from',
    to: 'to'
  }

  async function onSubmit(data) {
    console.log(data)
    await doRequest()
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
          <div class="form-group">
            <Field 
              name={fields.from} 
              decimals={4}
              component={NumericInput} 
              onChange={util.debounce((v) => {
                const fiat = Coin
                  .fromBtc((v || 0).toString(), decimals)
                  .fiat(rate)

                change(fields.to, fiat)
              }, 1000)}
              validate={[ rules.required ]}
              precision={10}
              validate={[ rules.required ]} 
            />  
          </div>
          <div class="form-group">
            <Field 
              name={fields.to} 
              precision={2}
              component={NumericInput}
              validate={[ rules.required ]} 
            />  
          </div>
        </form>
        {errors}
      </div>
    </CommonModal>
  )
}

export default reduxForm({
  form: 'SwapValidation'
})(SwapModal)