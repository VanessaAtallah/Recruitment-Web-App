import React, { useState, useEffect } from 'react';
import classes from './create.module.css';

function ViewJob({ initialData,  onCancel }) {
    const [data, setData] = useState(initialData);
   
    

    useEffect(() => {
        setData(initialData || {}); // Ensure initialData is not null or undefined
    }, [initialData]);


    return (
        <div className={classes.container}>
                <div className={classes.containertitle}>View Job</div>
        <form>
            <div className={classes.inputbox}>
            <label>Job Title</label>
            <input type="text" name="job_title" value={data.job_title}  readOnly />
            </div>
            <div className={`${classes.inputbox} ${classes.a1}`} >
                            <label>Company Name</label>
            <input type="text" name="company_name" value={data.company_name}  readOnly /></div>
            <div className={classes.inputbox}>
                            <label>Job function</label>
            <input type="text" name="job_function" value={data.job_function}  readOnly /></div>
            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Employment Type</label>
           
            <input type ="text" name='employment_type' value={data.employment_type}  readOnly/>
                                </div>
                            <div className={classes.inputbox}>
                            <label>Work Arrangement</label>
                            <input type="text" name="work_arrangement" value={data.work_arrangement} readOnly />
            </div>

            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Education Level</label>
                            <input type="text" name=" education_level" value={data.education_level}  readOnly />
                           
                        </div>

            
                        <div className={classes.inputbox}>
    <label>Languages</label>
    <input type="text" name="languages" value={data.languages}  readOnly />
   
</div>
<div className={`${classes.inputbox} ${classes.a1}`}>
    <label>Required Skills</label>

            <input type="text" name="required_skills" value={data.required_skills}  readOnly />
        
                </div>

                <div className={classes.inputbox}>
                <label>Experience Level</label>
            <input type="text" name="experience_level" value={data.experience_level}  readOnly /></div>
            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Job Location</label>
            
            <input type="text" name="job_location" value={data.job_location} readOnly/></div>
            <div className={classes.inputbox}>
                <label>Salary Range</label>
            <input type="text" name="salary_range" value={data.salary_range}  readOnly /></div>
            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Salary type</label>
                            <input type="text" name="salary_type" value={data.salary_type}  readOnly /> </div>
                            <div className={classes.inputbox}>
                <label>Benefits</label>          
            <input type="text" name="benefits" value={data.benefits}  readOnly /></div>
            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Job Posting Date</label>
            <input type="text" name="posting_date" value={data.posting_date}  readOnly /></div>
            <div className={classes.inputbox}>
                            <label>Application Deadline</label>
            <input type="text" name="app_deadline" value={data.app_deadline} readOnly /></div>

            <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Company Logo</label>          
            <input type="text" name="logo" value={data.logo} readOnly /></div>
            
            <div className={classes.inputbox}>
                            <label>Recruitment Process Stages</label>
            <input type="text" name="steps" value={data.steps} readOnly /></div>

            <div className={classes.inputbox}>
                            <label>Additional Requirement</label>
            <input type="text" name="additional_requirements" value={data.additional_requirements}  readOnly /></div>
            <div className={classes.jobactions}>
                            <button className={classes.done} onClick = {onCancel}>Done</button>
                            </div>
                          
                            
            
        </form>
        </div>
    );
}

export default ViewJob;
