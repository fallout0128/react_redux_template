import React from 'react'
import './style.css'

export default function (field) {
  const { meta, value, suffix, prefix, className, onChange, input } = field
  const { touched, error } = meta
  const errorMes = error

  return (
    <React.Fragment>
      <div className="d-flex input" >
        {prefix}
        <input
          className={`form-control ${className}`}
          value={value}
          onChange={onChange}
          {...input}
        />
        {suffix}
      </div>
      <small className={`text-danger`}>
        {touched? errorMes : ''}
      </small>
    </React.Fragment>
  )
}