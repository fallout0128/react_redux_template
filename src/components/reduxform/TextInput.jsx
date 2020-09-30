import React from 'react'

function TextInput(field) {
  const { touched, error } = field.meta
  let errorMes = error
  const errorStyle = `${touched && error? 'text-red' : ''}`

  return (
    <React.Fragment>
      <div className={field.outerClassName}>
        <input
          value={field.value}
          readOnly={field.readOnly}
          className={`${field.className} ${errorStyle}`}
          type={field.type || "text"}
          disabled={field.disabled}
          style={field.style}
          placeholder={field.placeholder || ""}
          onInput={field.onChange}
          {...field.input}
        />
        {field.children}
      </div>
      <small className={`text-danger`}>
        {touched? errorMes : ''}
      </small>
    </React.Fragment>
  )
}

export default TextInput