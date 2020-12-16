import React, { useState, useEffect } from 'react'
import styles from './Dropdown.css'

export default function({ 
  elements, 
  selectedIndex = 0, 
  onChange, 
  renderItem,
  readOnly
}) {
  const [noResult, setNoResult] = useState(false)
  const [items, setItems] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [selected, setSelected] = useState(selectedIndex)
  
  useEffect(() => {
    const items = elements.map(el => ({ ...el, show: true }))
    setItems(items)
  }, [elements])

  const filter = (word) => {
    const updatedItems = items.map(item => ({ ...item, show: item.value.toLowerCase().startsWith(word)}))
    const hidden = updatedItems.filter(({ show }) => !show).length
    setNoResult(hidden === items.length)
    setItems(updatedItems)
  }

  const renderItems = () => {
    return (items.map((item, i) => item.show && i !== selected? 
      renderItem? 
        renderItem(item, i, () => onSelected(i)) :
        <div onClick={() => onSelected(i)}>
          <a className="w-100  p-0">{item.value}</a> 
        </div>
      : undefined
    ))
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const onSelected = (index) => {
    setSelected(index)
    toggleMenu()
    onChange && onChange(items[index].value, index)
  }

  const renderMenu = () => {
    return (
      <div className={`w-100 ${styles['dropdown-menu']}`}>
        <form className="px-4 py-2">
          <input 
            type="search" 
            className="form-control" 
            placeholder="BTC"
            onChange={v => filter(v.target.value.trim().toLowerCase())}
          />
        </form>
        {renderItems()}
        {
          noResult && 
            <div className={`dropdown-header ${styles['dropdown-header']}`}>
              No coins found
            </div>
        }
      </div> 
    )
  }
  
  return (
    <div className={styles['dropdown']}>
      <button 
        disabled={readOnly}
        onClick={toggleMenu} 
        className="btn btn-secondary dropdown-toggle" 
        type="button" 
      >
        {items[selected] && items[selected].value}
      </button>
      {showMenu? renderMenu() : undefined}
    </div>
  )
}