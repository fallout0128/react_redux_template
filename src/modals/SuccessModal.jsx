import React from 'react'
import CommonModal from './CommonModal'

export default function({ isOpen, onClose, children }) {
  function renderButtons() {
    return (
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={onClose}
      >
        Close
      </button>
    )
  }

  return (
    <CommonModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Success"
      buttons={renderButtons()}
    >
      {children || 'Success'}
    </CommonModal>
  )
}