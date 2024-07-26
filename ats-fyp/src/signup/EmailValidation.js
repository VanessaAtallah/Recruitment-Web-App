import React, { useState } from 'react';
import classes from './signups.module.css'; // Import CSS classes from the CSS module

const EmailValidation = ({ email, setEmail }) => {
    // State to manage email validation status
    const [isValid, setIsValid] = useState(true);

    // Function to validate email format
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
        const isValidEmail = emailRegex.test(email); // Check if email matches the regex
        setIsValid(isValidEmail); // Update isValid state based on validation result
    };

    return (
        <div>
            {/* Email input field */}
            <input 
                className={classes.input1} // Apply the CSS class to the input field
                type="text" 
                placeholder="Email" 
                id="email" 
                name="email"
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
                onBlur={validateEmail} // Validate email on blur (when focus leaves the input)
                value={email} // Set input value to the current email state
            />
            {/* Error message displayed if email is not valid */}
            {!isValid && <span className={classes.error}>Please enter a valid email address</span>}
        </div>
    );
};

export default EmailValidation;
