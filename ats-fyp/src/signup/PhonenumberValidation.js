import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2'; // Import the PhoneInput component
import 'react-phone-input-2/lib/style.css'; // Import the default styles for PhoneInput
import classes from './signups.module.css'; 

function PhonenumberValidation({ phoneNumber, setPhoneNumber }) {
    // State to manage phone number validation status
    const [valid, setValid] = useState(true);

    // Function to handle phone number changes
    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value); // Update phone number state
        setValid(validatePhoneNumber(value)); // Validate the entered phone number
    };

    // Function to validate the phone number format
    const validatePhoneNumber = (phoneNumber) => {
        const phoneNumberPattern = /^\d{11}$/; // Regular expression for 11-digit phone number
        return phoneNumberPattern.test(phoneNumber); // Check if the entered phone number matches the pattern
    };

    return (
        <div className={classes.input1}> {/* Container for the phone number input */}
            <PhoneInput
                inputStyle={{ width: '100%' }} // Adjust the width of the input box
                country={'lb'} // Set the default country to Lebanon with correct ISO 3166-1 alpha-2 code
                value={phoneNumber} // Set the value of the phone number input
                onChange={handlePhoneNumberChange} // Handle changes to the phone number input
                inputProps={{ //object
                    required: true, // Make the input field required
                }}
            />
            {/* Error message displayed if phone number is not valid */}
            {!valid && <span className={classes.error}>Please enter a valid phone number</span>}
        </div>
    );
};

export default PhonenumberValidation;
