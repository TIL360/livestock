import React from 'react';

const Modal = ({ show, onClose, onSubmit }) => {
    const [admNo, setAdmNo] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(admNo);
        setAdmNo(''); // Clear the input
    };

    if (!show) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h2>Enter Admission Number</h2>
                <form onSubmit={handleSubmit}>
                    <input
                    className='mx-2 shadow p-2 rounded-pill border-3 border-info'
                        type="text"
                        value={admNo}
                        onChange={(e) => setAdmNo(e.target.value)}
                        placeholder="Admission Number"
                        required
                    />
                    <div>
                        <button type="submit" className='btn btn-success'>Submit</button>
                        <button type="button" className='btn btn-secondary' onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        minWidth: '200px',
        minHeight: '200px',
    },
};

export default Modal;
