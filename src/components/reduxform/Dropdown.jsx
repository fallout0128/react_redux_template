import React from 'react'
import Dropdown from '../Dropdown'
import styles from './style.css'

export default function (field) {
  const { readOnly, elements, selectedIndex, renderItem } = field
  const { input: { onChange } } = field
  return (
    <Dropdown
      elements={elements}
      readOnly={readOnly}
      selectedIndex={selectedIndex}
      onChange={onChange}
      renderItem={renderItem}
    />
  )
}