import React from 'react'
import styles from './style.css'

console.log(styles)

export default function (field) {
  const { meta, placeholder, readOnly, value, suffix, prefix, className, onChange, input } = field
  const { touched, error } = meta
  const errorMes = error

  return (
    <React.Fragment>
      <div className={`d-flex ${styles.commonInput}`}>
        {prefix}
        <input
          readOnly={readOnly}
          placeholder={placeholder}
          autocomplete="off"
          type="number"
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