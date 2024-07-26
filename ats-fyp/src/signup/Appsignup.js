import React, { useState } from 'react';
import EmailValidation from './EmailValidation';
import classes from './signups.module.css';
import axios from 'axios';
import ats from './ats.png';
import PasswordValidation from './PasswordValidation';
import PhonenumberValidation from './PhonenumberValidation';
import Genderinput from './Genderinput';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Appsignup() {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [exist, setExist] = useState(false);
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        date:"",
        email: "",
        password: "",
        address: "",
        phonenumber: "",
        gender:"",
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const userData = {
            firstname: data.firstname,
            lastname: data.lastname,
            date: data.date,
            email: data.email,
            password: data.password,
            address: data.address,
            phonenumber: data.phonenumber,
            gender:data.gender,
        };

        axios.post("http://localhost:8800/appsignup", userData)
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    setSuccess(true);
                    alert("Success alert!");
                    navigate(`/appsignin?email=${data.email}&password=${data.password}`);
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    setExist(true);
                    alert("Email already taken");
                }
                if (error.response) {
                    setError(true);
                    alert("Server error,try submitting again.");
                }
                if (error.request) {
                    setError(true);
                    alert("Server error,try submitting again.")
                }
            });
    };

    return (
        <div className={classes.container1}>
            <div className={classes.container2}>
                <div className={classes.leftContainer}>
                    <img src={ats} alt="Sign up" className={classes.picture1} />
                </div>

                <div className={classes.rightContainer}>
                <FontAwesomeIcon icon={faArrowLeft} className={classes.goToHome} onClick={() => navigate('/')}/>
                  <div className={classes.heading2}>Welcome to RecruitWave</div> 
                    <form action="" className={classes.form} onSubmit={handleSignUp}>
                        <div className={classes.heading1}>Sign Up As An Applicant</div>
                        <div>
                            <input className={classes.input1} type="text" placeholder="First Name" name="firstname" value={data.firstname} onChange={handleChange} required />
                            <input className={classes.input1} type="text" placeholder="Last Name" name="lastname" value={data.lastname} onChange={handleChange} required />
                            <input className={classes.input1} type="date" name="date" value={data.date} onChange={handleChange} required />
                            <EmailValidation email={data.email} setEmail={value => setData({...data, email: value})} />
                            <PasswordValidation password={data.password} setPassword={(value) => setData({ ...data, password: value })}/>
                            <input className={classes.input1} type="text" required placeholder="Address" name="address" value={data.address} onChange={handleChange} />
                            <PhonenumberValidation phonenumber={data.phonenumber} setPhoneNumber={value => setData({...data, phonenumber: value})} />
                            <Genderinput gender={data.gender} setGender={value => setData({...data, gender: value})}/>
                            <button className={classes.signupbutton} type="submit">
                                Sign Up 
                            </button>
                        </div>
                    </form>

                </div>
            </div>
           {/* Link to login page for existing members */} 
            <p className={classes.p2}><Link to="/Appsignin"> Already a member?</Link></p>
          </div>
        
    );
}

export default Appsignup;

