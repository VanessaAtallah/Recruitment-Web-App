import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import classes from './signin.module.css'; // Import CSS classes from the CSS module
import validation from './recsigninvalidation'; // Import validation function
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import necessary hooks from React Router
import ats from './ats.png'; // Import image
import PasswordValidation from '../signup/PasswordValidation'; // Import PasswordValidation component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon component
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icon

const SignInForm = () => {
  // State to manage form data (email and password)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the search parameters from the current location (URL)
    const searchParams = new URLSearchParams(location.search);
  
    // Extract the 'email' and 'password' query parameters from the URL
    const email = searchParams.get('email');
    const password = searchParams.get('password');
  
    // If 'email' parameter is present in the URL, update the email field in the form data
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  
    // If 'password' parameter is present in the URL, update the password field in the form data
    if (password) {
      setFormData(prev => ({ ...prev, password }));
    }
  }, [location.search]);
  
  // State to manage form validation errors
  const [errors, setErrors] = useState({});

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validation(formData)); // Validate form data and set errors

    // Check if there are no validation errors
    if (errors.email === "" && errors.password === "") {
      // If no validation errors, make a POST request to sign in
      axios.post('http://localhost:8800/recsignin', formData)
        .then(res => {
          if (res.data.errors) {
            setErrors([res.data.errors]); // Set errors if any returned from the server
          } else {
            setErrors([]); // Clear errors
            if (res.data.Login) {
              localStorage.setItem("token", res.data.token); // Store token in local storage
              navigate('/EditOrDeleteJobs'); // Redirect to specified route
            } else {
              alert('no such record'); // Show alert if no such record found
            }
          }
        })
        .catch(err => console.log(err)); // Log any errors
    }
  };

  return (
    <div className={classes.container1}>
       <div className={classes.container2}>
          <div className={classes.leftContainer}>
                <img src={ats} alt="Sign in" className={classes.picture1} /> {/* Image */}
          </div>

          <div className={classes.rightContainer}>
          <FontAwesomeIcon icon={faArrowLeft} className={classes.goToHome} onClick={() => navigate('/')}/> {/* Back icon */}
                <div className={classes.heading2}>Welcome to RecruitWave</div> {/* Heading */}
                <form action="" className={classes.form} onSubmit={handleSubmit}>
                  <div className={classes.heading1}>Sign in as a Recruiter</div> {/* Subheading */}
                  <div>
                        <input className={classes.input1} type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required /> {/* Email input */}
                        {errors.email && <span>{errors.email}</span>} {/* Display email validation error */}
                        <PasswordValidation // Password input with validation
                          password={formData.password}
                          setPassword={(value) => setFormData({ ...formData, password: value })}
                        />
                        {errors.password && <span>{errors.password}</span>} {/* Display password validation error */}
                        <button className={classes.signinbutton} type="submit" onSubmit={handleSubmit} value="Sign In">Sign In</button> {/* Submit button */}
       <p className={classes.createaccount}>Don't have an account? <Link to="/Recsignup">Create one.</Link></p> {/* Link to sign up page */}
                  </div>
                </form>
          </div>

       </div>
      
       
    </div>
  );
};

export default SignInForm;
