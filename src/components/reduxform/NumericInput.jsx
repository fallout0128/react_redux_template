import React from 'react'
import styles from './style.css'

export default function (field) {
  const { placeholder, readOnly, value, suffix, prefix, className, onChange, input } = field
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
    </React.Fragment>
  )
}