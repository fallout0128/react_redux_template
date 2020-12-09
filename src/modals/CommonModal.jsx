import React from 'react'
import Modal from 'react-modal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    padding: 0,
    border: 0
  }
}

export default function({ contentLabel, isOpen, buttons, onRequestClose, children }) {
  return (
    <Modal
      isOpen={isOpen}
      //onAfterOpen={afterOpenModal}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel={contentLabel}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{contentLabel}</h5>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer d-flex justify-content-center">
          {buttons}
        </div>
      </div>
    </Modal>
  )
}