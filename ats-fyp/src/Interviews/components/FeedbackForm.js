import React, { useState } from 'react';

const FeedbackForm = ({ onClose, onSubmit }) => {
    const [feedback, setFeedback] = useState('');

    const handleChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(feedback);
        setFeedback('');
    };

    return (
        <div className="feedback-form">
            <textarea
                placeholder="Enter your feedback here..."
                value={feedback}
                onChange={handleChange}
            />
            <div className="buttons">
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default FeedbackForm;
