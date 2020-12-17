import React, { useState, useEffect } from 'react'
import styles from './Dropdown.css'

export default function({ 
  elements, 
  selectedIndex = 0, 
  onChange, 
  renderItem,
  readOnly,
  className
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
      <div className={styles['dropdown-menu-container']}>
        <div className={`${styles['dropdown-menu']} pb-3 ${className?.menu}`}>
          <form className=" py-2">
          <input 
            type="search" 
            className="px-4 form-control removeOutline" 
            placeholder="Type to search"
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
      </div> 
    )
  }
  
  return (
    <div className={styles['dropdown']}>
      <button 
        disabled={readOnly}
        onClick={toggleMenu} 
        className={`h-100 btn btn-secondary dropdown-toggle ${styles['dropdown-toggle']} removeOutline`}
        type="button" 
      >
        <strong>{items[selected] && items[selected].value}</strong>
      </button>
      {showMenu? renderMenu() : undefined}
    </div>
  )
}