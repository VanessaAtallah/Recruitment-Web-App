import React, { useState } from 'react';
import EmailValidation from './EmailValidation';
import classes from './signups.module.css';
import axios from 'axios';
import ats from './ats.png';
import PasswordValidation from './PasswordValidation';
import PhonenumberValidation from './PhonenumberValidation';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Recsignup() {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [success, setSuccess] = useState(false); // State for tracking success status
    const [error, setError] = useState(false); // State for tracking error status
    const [exist, setExist] = useState(false); // State for tracking if the email already exists
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        address: "",
        phonenumber: "",
        type: "",
        companyName: "", 
    });

    // Handle input changes and update the data state
    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    // Handle form submission
    const handleSignUp = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const userData = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: data.password,
            address: data.address,
            phonenumber: data.phonenumber,
            type: data.type,
            companyName: data.companyName, 
        };

        // Make a POST request to the server
        axios.post("http://localhost:8800/recsignup", userData)
            .then((response) => {
                console.log(response);
                console.log(response.status);
                if (response.status === 201) { // Check if the response status is 201 (Created)
                    setSuccess(true);
                    alert('success');
                    // Navigate to the sign-in page with email and password query parameters
                    navigate(`/recsignin?email=${data.email}&password=${data.password}`);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) { // If email is already taken
                    setExist(true);
                    alert("Email already taken");
                }
                if (error.response) { // If there is a server error
                    setError(true);
                    alert("Server error, try submitting again.");
                }
                if (error.request) { // If there is no response from the server
                    setError(true);
                    alert("Server error, try submitting again.");
                }
            });
    };

    return (
        <div className={classes.container1}>
            <div className={classes.container2}>
                <div className={classes.leftContainer}>
                    <img src={ats} alt="Sign up" className={classes.picture1} /> {/* Image on the left side */}
                </div>

                <div className={classes.rightContainer}>
                    <FontAwesomeIcon icon={faArrowLeft} className={classes.goToHome} onClick={() => navigate('/')} /> {/* Back to home button */}
                    <div className={classes.heading2}>Welcome to RecruitWave</div>
                    <form action="" className={classes.form} onSubmit={handleSignUp}> {/* Form submission handler */}
                        <div className={classes.heading1}>Sign Up As A Recruiter</div>
                        <div>
                            {/* Input fields for user details */}
                            <input className={classes.input1} type="text" placeholder="First Name" name="firstname" value={data.firstname} onChange={handleChange} required />
                            <input className={classes.input1} type="text" placeholder="Last Name" name="lastname" value={data.lastname} onChange={handleChange} required />
                            <EmailValidation email={data.email} setEmail={value => setData({ ...data, email: value })} /> {/* Email validation component */}
                            <PasswordValidation password={data.password} setPassword={(value) => setData({ ...data, password: value })} /> {/* Password validation component */}
                            <PhonenumberValidation phonenumber={data.phonenumber} setPhoneNumber={value => setData({ ...data, phonenumber: value })} /> {/* Phone number validation component */}
                            <select className={classes.input1} value={data.type} name='type' onChange={handleChange} required> {/* Dropdown for recruiter type */}
                                <option value="">select recruiter type...</option>
                                <option value="HR">HR</option>
                                <option value="Company">Company</option>
                                <option value="Third Party">Third Party</option>
                            </select>
                            {/* Conditionally render company name and address inputs if the recruiter type is 'Company' */}
                            {data.type === "Company" &&
                                <>
                                    <input className={classes.input1} type="text" placeholder="Company Name" name="companyName" value={data.companyName} onChange={handleChange} required />
                                    <input className={classes.input1} type="text" placeholder="Company Address" name="address" value={data.address} onChange={handleChange} required />
                                </>
                            }
                            <button className={classes.signupbutton} type="submit">
                                Sign Up
                            </button> {/* Sign up button */}
                        </div>
                    </form>
                </div>
            </div>
            <p className={classes.p1}><Link to="/Recsignin">Already a member?</Link></p> {/* Link to sign-in page */}
        </div>
    );
}

export default Recsignup;
