import React from 'react';
import classes from './signups.module.css';

const Genderinput = ({ gender, setGender }) => {
    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    return (
        <div className={classes.radioContainer}>
            <label className={classes.labelText}>
                <input
                    className={classes.maleInput}
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={handleGenderChange}
                />
                Male
            </label>
            <label className={classes.labelText}>
                <input
                    className={classes.femaleInput}
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={handleGenderChange}
                />
                Female
            </label>
        </div>
    );
};

export default Genderinput;
