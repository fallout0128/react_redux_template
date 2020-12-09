import React from 'react'
import NumericInput from 'react-numeric-input'
import './style.css'

export default function (field) {
  const { touched, error } = field.meta
  let errorMes = error

  return (
    <React.Fragment>
      <NumericInput 
        className="form-control"
        value={field.value}
        {...field.input}
      />
      <small className={`text-danger`}>
        {touched? errorMes : ''}
      </small>
    </React.Fragment>
  )
}