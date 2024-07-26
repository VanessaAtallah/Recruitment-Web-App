import React, { useState, useEffect } from 'react';
import classes from './create.module.css';
import CreatableSelect from "react-select/creatable";

function UpdateJob({ initialData, onSubmit, onCancel }) {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const handleChange0 = (name, value) => {
        setData({
            ...data,
            [name]: value // Update the state with both the name and value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data); // Pass updated job data to parent component for submission
    };

    return (
        
        <div className={classes.container}>
                <div className={classes.containertitle}>Update Job</div>
        <form onSubmit={handleSubmit}>
            <div className={classes.inputbox}>
            <label>Job Title</label>
            <input type="text" name="job_title" value={data.job_title} onChange={handleInputChange} required />
            </div>
            <div className={`${classes.inputbox} ${classes.a1}`} >
                            <label>Company Name</label>
            <input type="text" name="company_name" value={data.company_name} onChange={handleInputChange} required /></div>
            <div className={classes.inputbox}>
                            <label>Job function</label>
            <input type="text" name="job_function" value={data.job_function} onChange={handleInputChange} required /></div>
            <div className={`${classes.inputbox} ${classes.a1}`}>
            <label>Employment Type</label>
                    <select value={data.employment_type} onChange={(e) => handleChange0("employment_type", e.target.value)} required>
                        <option value="Full-time Employment">Full-time Employment</option>
                        <option value="Part-time Employment">Part-time Employment</option>
                        <option value="Contract Work">Contract Work</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance Work">Freelance Work</option>
                        <option value="Temporary Employment">Temporary Employment</option>
                        <option value="Consulting">Consulting</option>
                        <option value='Seasonal Work'>Seasonal Work</option>
                    </select>
                </div>
                            <div className={classes.inputbox}>
                            <label>Work Arrangement</label>
                            <select value={data.work_arrangement} onChange={(e) => handleChange0("work_arrangement", e.target.value)} required>
                                
                                <option value="Traditional Office-Based Work">Traditional Office-Based Work</option>
                                <option value="Remote Work">Remote Work</option>
                                <option value="Hybrid Work">Hybrid Work</option>
                                <option value="Flextime">Flextime</option>
                                <option value="Compressed Workweek">Compressed Workweek</option>
                                <option value="Job Sharing">Job Sharing</option>
                                <option value="Shift Work">Shift Work</option>
                            </select>
            </div>

            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Education Level</label>
                            <select value={data.education_level} onChange={(e) => handleChange0("education_level", e.target.value)} required>
                                <option  value="">Choose your education level</option>
                                <option  value="High School Diploma">High School Diploma</option>
                                <option value="Associate's Degree">Associate's Degree</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="Master's Degree">Master's Degree</option>
                                <option  value="Doctorate or Ph.D.">Doctorate or Ph.D.</option>
                                <option value="Professional Degree (e.g., MD, JD, MBA)">Professional Degree (e.g., MD, JD, MBA)</option>
                            </select>
                        </div>

            
                        <div className={classes.inputbox}>
    <label>Languages</label>
    <input type="text" name="languages" value={data.languages} onChange={handleInputChange} required />
   
</div>
<div className={`${classes.inputbox} ${classes.a1}`}>
    <label>Required Skills</label>

            <input type="text" name="required_skills" value={data.required_skills} onChange={handleInputChange} required />
        
                </div>

                <div className={classes.inputbox}>
                <label>Experience Level</label>
            <input type="text" name="experience_level" value={data.experience_level} onChange={handleInputChange} required /></div>
            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Job Location</label>
            
            <input type="text" name="job_location" value={data.job_location} onChange={handleInputChange} required /></div>
            <div className={classes.inputbox}>
                <label>Salary Range</label>
            <input type="text" name="salary_range" value={data.salary_range} onChange={handleInputChange} required /></div>
            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Salary type</label>
            <select  value={data.salary_type} onChange={(e) => handleChange0("salary_type", e.target.value)} required>
                                <option value="Hourly">Hourly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select> </div>
                            <div className={classes.inputbox}>
                <label>Benefits</label>          
            <input type="text" name="benefits" value={data.benefits} onChange={handleInputChange} required /></div>
          
            <div className={classes.inputbox}>
                            <label>Application Deadline</label>
            <input type="text" name="app_deadline" value={data.app_deadline} onChange={handleInputChange} required /></div>

            <div className={classes.inputbox}>
                            <label>Company Logo</label>          
            <input type="text" name="logo" value={data.logo} onChange={handleInputChange} required /></div>
            
            <div className={classes.inputbox}>
                            <label>Recruitment Process Stages</label>
            <input type="text" name="steps" value={data.steps} onChange={handleInputChange} required /></div>

            <div className={classes.inputbox}>
                            <label>Additional Requirement</label>
            <input type="text" name="additional_requirements" value={data.additional_requirements} onChange={handleInputChange} required /></div>
            <div className={classes.jobactions}>
                    <button className={classes.edit} onClick={handleSubmit}>Submit</button>
                            <button className={classes.delete} onClick = {onCancel}>Cancel</button>
                            </div>
                            
            
        </form>
        </div>
    );
}

export default UpdateJob;