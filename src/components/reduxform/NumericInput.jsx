import React from 'react'
import NumericInput from 'react-numeric-input'
import { util } from '../../logic/utils'
import { format } from '../../logic/utils'
import './style.css'

export default function (field) {
  const { meta, value, decimals, className, onChange, input } = field
  const { touched, error } = meta
  const errorMes = error

  function parse(v) {
    return format.decimals(v.toString(), decimals).toString()
  }

  return (
    <React.Fragment>
      <NumericInput
        parse={parse}
        className={`form-control ${className}`}
        value={value}
        onInput={onChange}
        {...input}
      />
      <small className={`text-danger`}>
        {touched? errorMes : ''}
      </small>
    </React.Fragment>
  )
}