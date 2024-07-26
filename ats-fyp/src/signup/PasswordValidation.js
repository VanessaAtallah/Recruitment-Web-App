import React, { useState } from 'react';
import classes from './signups.module.css'; 
import '@fortawesome/fontawesome-free/css/all.css';

// PasswordValidation component for handling password input with show/hide functionality
const PasswordValidation = ({ password, setPassword }) => {
    // State to manage the visibility of the password
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the visibility of the password
    const handleTogglePassword = (e) => {
        // Prevent the click event from propagating to the form, avoiding form submission
        e.stopPropagation();
         // Prevent the default button behavior (specific to this button, not the form submit button)
         e.preventDefault();
        // Toggle the showPassword state
        setShowPassword(!showPassword);
    };

    return (
        <div className={classes.passwordContainer}>
            {/* Input field for the password */}
            <input 
                className={classes.input1}
                type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                placeholder="Password" 
                id="password" 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update the password state on change
            />
            {/* Button to toggle the visibility of the password */}
            <button 
                className={classes.eyeButton}
                onClick={handleTogglePassword} // Handle the button click to toggle password visibility
            >
                {/* Icon to indicate the current state of password visibility */}
                {showPassword ? (
                    <i className="fa fa-eye-slash"></i> // Show "eye-slash" icon when the password is visible
                ) : (
                    <i className="fa fa-eye"></i> // Show "eye" icon when the password is hidden
                )}
            </button>
        </div>
    );
};

export default PasswordValidation;
