// ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal" style={modalStyle}>
            <div className="modal-content" style={modalContentStyle}>
                <h2 className='text-center'>Confirmation</h2>
                <p style={{fontSize:"20px"}}>Are you sure to generate invoices for next month?</p>
                <button onClick={onConfirm} className="btn btn-success">Yes</button>
                <button onClick={onClose} className="btn btn-danger">No</button>
            </div>
        </div>
    );
};

const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
};

const modalContentStyle = {
    width: '4in',
    height: '4in',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

export default ConfirmationModal;
