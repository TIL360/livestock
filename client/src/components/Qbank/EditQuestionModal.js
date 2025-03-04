import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const EditQuestionModal = ({ question, onUpdate, onClose }) => {
    const [updatedQuestion, setUpdatedQuestion] = useState(question);

    useEffect(() => {
        setUpdatedQuestion(question);
    }, [question]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedQuestion((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(updatedQuestion);
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Question:</label>
                        <input 
                            type="text" 
                            name="question" 
                            value={updatedQuestion.question} 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Chapter:</label>
                        <input 
                            type="text" 
                            name="chapter" 
                            value={updatedQuestion.chapter} 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Marks:</label>
                        <input 
                            type="number" 
                            name="marks" 
                            value={updatedQuestion.marks} 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                    </div>
                    {/* Add more fields as necessary */}
                    <Button type="submit" variant="primary">Update Question</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditQuestionModal;
