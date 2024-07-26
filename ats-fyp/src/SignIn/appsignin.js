import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classes from './signin.module.css';
import validation from './recsigninvalidation';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ats from './ats.png';
import PasswordValidation from '../signup/PasswordValidation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }

    if (password) {
      setFormData(prev => ({ ...prev, password }));
    }
  }, [location.search]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validation(formData));

    if (errors.email === "" && errors.password === "") {
      axios.post('http://localhost:8800/appsignin', formData)
        .then(res => {
          if (res.data.errors) {
            setErrors([res.data.errors]);
          } else {
            setErrors([]);
            const token = res.data.token;
            localStorage.setItem("token", token); // Store the token in local storage
            const decodedToken = jwtDecode(token); // Decode the JWT token
            const applicantId = decodedToken.id; // Extract applicant ID from the decoded token
            console.log('Decoded Token:', decodedToken);
            console.log('Applicant ID:', applicantId);
            localStorage.setItem("applicantId", applicantId); // Store applicant ID in local storage            
            navigate('/Applications');
          }
        })
        .catch(err => {
          setErrors([err.response.data.errors]);
        });
    }
  };

  return (
    <div className={classes.container1}>
      <div className={classes.container2}>

        <div className={classes.leftContainer}>
          <img src={ats} alt="Sign in" className={classes.picture1} />
        </div>

        <div className={classes.rightContainer}>
          <FontAwesomeIcon icon={faArrowLeft} className={classes.goToHome} onClick={() => navigate('/')} />
          <div className={classes.heading2}>Welcome to RecruitWave</div>
          <form action="" className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.heading1}>Sign in as an Applicant</div>
            <div>
              <input className={classes.input1} type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              {errors.email && <span>{errors.email}</span>}
              <PasswordValidation
                password={formData.password}
                setPassword={(value) => setFormData({ ...formData, password: value })}
              />
              {errors.password && <span>{errors.password}</span>}
              <button className={classes.signinbutton} type="submit" onSubmit={handleSubmit} value="Sign In">Sign In</button>
              <p className={classes.createaccount}>Don't have an account? <Link to="/Appsignup">Create one.</Link></p>
            </div>
          </form>
        </div>

      </div>

    </div>

  );
};

export default SignInForm;
