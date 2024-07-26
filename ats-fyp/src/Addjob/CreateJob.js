import axios from 'axios';
import React, { useState } from 'react';
import CreatableSelect from "react-select/creatable";
import classes from './create.module.css';
import Sidebar1 from '../SideMenu/RecSideMenu.js';
import {jwtDecode} from "jwt-decode";


function CreateJob() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [exist, setExist] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedJobCategories, setSelectedJobCategories] = useState([]);
    const [selectedSteps, setSelectedSteps] = useState([]);
    const [isChecked, setIsChecked] = useState([]);
    const [recId, setRecId] = useState();


    const skillsOptions = [
        { value: "JavaScript", label: "JavaScript" },
        { value: "C++", label: "C++" },
        { value: "HTML", label: "HTML" },
        { value: "CSS", label: "CSS" },
        { value: "React", label: "React" },
        { value: "Node", label: "Node" },
        { value: "MongoDB", label: "MongoDB" },
        { value: "Redux", label: "Redux" },
    ];

    const languagesOptions = [
        { value: "Arabic", label: "Arabic" },
        { value: "English", label: "English" },
        { value: "French", label: "French" },
        { value: "Spanish", label: "Spanish" },
        { value: "German", label: "German" },
        { value: "Italian", label: "Italian" },
    ];

    const jobCategoriesOptions = [
        {value: "Administrative/Clerical", label: "Administrative/Clerical"},
        {value: "Sales/Marketing", label: "Sales/Marketing"},
        {value: "Customer Service", label: "Customer Service"},
        {value: "Information Technology", label: "Information Technology"},
        {value: "Healthcare/Medical", label: "Healthcare/Medical"},
        {value: "Education/Training", label: "Education/Training"},
        {value: "Finance/Accounting", label: "Finance/Accounting"},
        {value: "Engineering", label: "Engineering"},
        {value: "Human Resources", label: "Human Resources"},
        {value: "Legal", label: "Legal"},
        {value: "Retail", label: "Retail"},
        {value: "Manufacturing/Production", label: "Manufacturing/Production"},
        {value: "Hospitality/Travel", label: "Hospitality/Travel"},
        {value: "Construction/Trades", label: "Construction/Trades"},
        {value: "Media/Communications", label: "Media/Communications"},
        {value: "Art/Design", label: "Art/Design"},
        {value: "Science/Research", label: "Science/Research"},
        {value: "Government/Public Sector", label: "Government/Public Sector"},
        {value: "Nonprofit/Volunteering", label: "Nonprofit/Volunteering"},
        {value: "Consulting/Business Strategy", label: "Consulting/Business Strategy"},
        {value: "Real Estate", label: "Real Estate"},
        {value: "Transportation/Logistics", label: "Transportation/Logistics"},
        {value: "Food Service", label: "Food Service"},
        {value: "Social Services", label: "Social Services"},
        {value: "Automotive", label: "Automotive"},
        {value: "Agriculture/Forestry", label: "Agriculture/Forestry"},
        {value: "Energy/Utilities", label: "Energy/Utilities"},
        {value: "Environmental", label: "Environmental"},
        {value: "Fashion/Beauty", label: "Fashion/Beauty"},
        {value: "Sports/Recreation", label: "Sports/Recreation"},
        {value: "Writing/Editing", label: "Writing/Editing"},
        {value: "Photography/Videography", label: "Photography/Videography"},
        {value: "Music/Entertainment", label: "Music/Entertainment"},
        {value: "Security/Law Enforcement", label: "Security/Law Enforcement"},
        {value: "Telecommunications", label: "Telecommunications"},
        {value: "Insurance", label: "Insurance"},
        {value: "Research and Development", label: "Research and Development"},
        {value: "Pharmaceuticals", label: "Pharmaceuticals"},
        {value: "Architecture", label: "Architecture"},
        {value: "Remote/Telecommuting", label: "Remote/Telecommuting"},
        {value: "Biotechnology", label: "Biotechnology"},
        {value: "Aviation/Aerospace", label: "Aviation/Aerospace"},
        {value: "Marine/Shipbuilding", label: "Marine/Shipbuilding"},
        {value: "Psychology/Counseling", label: "Psychology/Counseling"},
        {value: "Fitness/Wellness", label: "Fitness/Wellness"},
        {value: "Event Planning/Management", label: "Event Planning/Management"},
        {value: "Public Relations/Communications", label: "Public Relations/Communications"},
        {value: "Interior Design", label: "Interior Design"},
        {value: "Religious/Spiritual", label: "Religious/Spiritual"},
        {value: "Veterinary/Animal Care", label: "Veterinary/Animal Care"},
        {value: "Cryptocurrency/Blockchain", label: "Cryptocurrency/Blockchain"},
        {value: "Nanotechnology", label: "Nanotechnology"},
        {value: "Supply Chain/Procurement", label: "Supply Chain/Procurement"},
        {value: "Import/Export", label: "Import/Export"},
        {value: "Waste Management/Recycling", label: "Waste Management/Recycling"},
        {value: "Geology/Geosciences", label: "Geology/Geosciences"},
        {value: "Archaeology", label: "Archaeology"},
        {value: "Translation/Interpretation", label: "Translation/Interpretation"},
        {value: "Forensic Science", label: "Forensic Science"},
        {value: "Social Media Management", label: "Social Media Management"},
        {value: "Software Engineer", label: "Software Engineer"},
        {value: "Data Scientist", label: "Data Scientist"},
        {value: "IT Specialist", label:"IT Specialist"},
        {value: "Nurse", label:"Nurse"},
        {value: "Doctor", label:"Medical Researcher"},
        {value:"Teacher", label:"Teacher"},
        {value:"Professor", label:"Professor"},
        {value:"Education Administrator", label:"Education Administrator"},
        {value: "Marketing Manager", label:"Marketing Manager"},
        {value: "Financial Analyst", label: "Financial Analyst"},
        {value: "Human Resources Specialist", label: "Human Resources Specialist"},
        {value: "Actor", label:"Actor"},
        {value: "Graphic Designer", label:"Graphic Designer"},
        {value: "Biologist", label:"Biologist"},
        {value:"Chemist", label:"Chemist"},
        {value:"Physicist", label:"Physicist"},
        {value:"Civil Engineer", label:"Civil Engineer"},
        {value: "Mechanical Engineer", label:"Mechanical Engineer"},
        {value:"Electrical Engineer", label:"Electrical Engineer"},
        {value: "Administrative Assistant", label:"Administrative Assistant"},
        {value:"Office Manager", label:"Office Manager"},
        {value:"Executive Assistant", label:"Executive Assistant"},
        {value:"Hotel Manager", label:"Hotel Manager"},
        {value:"Chef", label:"Chef"},
        {value:"Event Planner", label:"Event Planner"},
        {value:"Sales Representative", label:"Sales Representative"},
        {value:"Account Manager", label:"Account Manager"},
        {value:"Retail Associate", label:"Retail Associate"},
    ];
    const steps = [
        { value: "1- Apply to the job", label: "1- Apply to the job" },
        { value: "2- Resume Review", label: "2- Resum Review" },
        { value: "3- Stay Informed", label: "3- Stay Informed" },
        { value: "4- Interview", label: "4- Interview" },
        { value: "5- Assessment", label: "5- Assessment" },
        { value: "6- Decision Making", label: "6- Decision Making" },

    ];

    const [data, setData] = useState({
        jobcategory:"",
        jobtitle: "",
        companyname: "",
        jobfunction: "",
        emptype: "",
        arrangment: "",
        edlevel: "",
        languages: "",
        skills:"",
        explevel: "",
        location: "",
        minsalary: "",
        maxsalary:"",
        saltype:"",
        benefits: "",
        appdeadline: "",
        logo:"",
        steps:"",
        additionalReq: "",
        
    });

    
    const handleChange0 = (name, selectedValue) => {
        setData({
            ...data,
            [name]: selectedValue 
        });
    };
    
    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (isChecked.includes(value)) {
            setIsChecked(isChecked.filter(item => item !== value));
        } else {
            setIsChecked([...isChecked, value]);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if(token){
            try{
                const decodedToken = jwtDecode(token);
                const recId = decodedToken.id;
                const userData = {
                    ...data,
                    skills: selectedSkills.map(skill => skill.value).join(", "),
                    languages: selectedLanguages.map(language => language.value).join(", "),
                    jobcategory: selectedJobCategories.map(category => category.value).join(", "),
                    jobtitle: data.jobtitle,
                    companyname: data.companyname,
                    jobfunction: data.jobfunction,
                    emptype: data.emptype,
                    arrangment: data.arrangment,
                    edlevel: data.edlevel,
                    explevel: data.explevel,
                    location: data.location,
                    minsalary: data.minsalary,
                    maxsalary: data.maxsalary,
                    saltype: data.saltype,
                    benefits: isChecked.join(", "),
                    postingdate: new Date().toISOString(), // Automatically set to current date and time
                    appdeadline: data.appdeadline,
                    logo: data.logo,
                    steps: selectedSteps.map(steps => steps.value).join(", "),
                    additionalReq: data.additionalReq,
                };
    
                await axios.post("http://localhost:8800/addjob", {...userData, recId})
                    .then((response) => {
                        console.log(userData);
                        console.log(response);
                        if (response.status === 201) {
                            setSuccess(true);
                            // Clear form fields
                            setData({
                                jobcategory:"",
                                jobtitle: "",
                                companyname: "",
                                jobfunction: "",
                                emptype: "",
                                arrangment: "",
                                edlevel: "",
                                languages: "",
                                skills:"",
                                explevel: "",
                                location: "",
                                minsalary: "",
                                maxsalary:"",
                                saltype:"",
                                benefits: "",
                                appdeadline: "",
                                logo:"",
                                steps:"",
                                additionalReq: "",
                            });
                            // Clear selected options
                            setSelectedLanguages([]);
                            setSelectedSkills([]);
                            setSelectedSteps([]);
                            setSelectedJobCategories([]); // Reset Job Category field
                            
                            // Reset checkbox state
                            setIsChecked([]);
                        }
                    })
                    .catch((error) => {
                        if (error.status === 401) {
                            setExist(true);
                        }
                        if (error.response) {
                            setError(true);
                        }
                        if (error.request) {
                            setError(true);
                        }
                    });
            } catch(err) {
                console.log('Error decoding token:', err);
            }
    
        }
    };
    
    
    

    return (

        <Sidebar1>

   
        <div>
             <div className={classes.inputbox1}>
             <label>Job Category:</label>
             <CreatableSelect
    // Enable multiple selection of options
    isMulti
    // Callback function to handle changes in selected options
    onChange={setSelectedJobCategories}
    // List of predefined options to choose from
    options={jobCategoriesOptions}
    // Currently selected options
    value={selectedJobCategories}
/>
                            </div>
            
            {/*Form*/}
            <div className={classes.jobFormContainer}>
                <div className={classes.containertitle}>Create a Job</div>
                <form onSubmit={handleAdd} className={classes.userdetails}>
                    <div>
                        <div className={classes.inputbox}>
                            <label>Job Title</label>
                            <input type="text" name="jobtitle" placeholder='Full-Stack Developer' value={data.jobtitle} onChange={handleInputChange} required />
                        </div>
                        <div className={`${classes.inputbox} ${classes.a1}`} >
                            <label>Company Name</label>
                            <input type="text" placeholder="Ex: Microsoft" name="companyname" value={data.companyname} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div>
                        <div className={classes.inputbox}>
                            <label>Job function</label>
                            <input type="text" placeholder="Software Developer" name="jobfunction" value={data.jobfunction} onChange={handleInputChange} required />
                        </div>
                        <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Employment Type</label>
                            <select value={data.emptype} onChange={(e) => handleChange0("emptype", e.target.value)} required>
                                <option value="">Employment type</option>
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
                    </div>
                    <div>
                        <div className={classes.inputbox}>
                            <label>Work Arrangement</label>
                            <select value={data.arrangment} onChange={(e) => handleChange0("arrangment", e.target.value)} required>
                                <option value="">Work arrangement</option>
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
                            <select value={data.edlevel} onChange={(e) => handleChange0("edlevel", e.target.value)} required>
                                <option  value="">Education level</option>
                                <option  value="High School Diploma">High School Diploma</option>
                                <option value="Associate's Degree">Associate's Degree</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="Master's Degree">Master's Degree</option>
                                <option  value="Doctorate or Ph.D.">Doctorate or Ph.D.</option>
                                <option value="Professional Degree (e.g., MD, JD, MBA)">Professional Degree (e.g., MD, JD, MBA)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className={classes.inputbox}>
                            <label>Languages</label>
                            <CreatableSelect
                    isMulti
                    onChange={setSelectedLanguages}
                    options={languagesOptions}
                    value={selectedLanguages}
                />
                        </div>
                        <div className={`${classes.inputbox} ${classes.a3}`}>
                            <label>Required Skills</label>
                            <CreatableSelect
                    isMulti
                    onChange={setSelectedSkills}
                    options={skillsOptions}
                    value={selectedSkills}
                />
                        </div>
                        <div className={classes.inputbox}>
                            <label>Experience Level</label>
                            <input type='text'name='explevel' placeholder='2-3 years of experience' value={data.explevel} onChange={handleInputChange} required />
                        </div>
                        <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Job Location</label>
                            <input type='location' placeholder='Beirut-Lebanon' name="location" value={data.location} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div>
                        <div className={classes.inputbox}>
                            <label>Minimum salary</label>
                            <input type="text" placeholder="$20k" name="minsalary" value={data.minsalary} onChange={handleInputChange} required />
                        </div>
                        <div className={`${classes.inputbox} ${classes.a1}`}>
                            <label>Maximum salary</label>
                            <input type="text" placeholder="$120k" name="maxsalary" value={data.maxsalary} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div>
                        <div className={classes.inputbox}>
                            <label>Salary type</label>
                            <select value={data.saltype} onChange={(e) => handleChange0("saltype", e.target.value)} required>
                                <option value="">Salary type</option>
                                <option value="Hourly">Hourly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        <div>
                            <label>Benefits</label>
                            <div>
                                <input
                                    type='checkbox'
                                    value="Health Insurance"
                                    checked={isChecked.includes("Health Insurance")}
                                    onChange={handleCheckboxChange}
                                />
                                <span>Health Insurance</span>
                            </div>
                            <div>
                            
<input
    // Set the input type to checkbox
    type='checkbox'
    // Specify the value associated with this checkbox
    value="Retirement Plans"
    // Determine if the checkbox should be checked
    // 'isChecked' is assumed to be an array of selected values
    // The checkbox will be checked if "Retirement Plans" is included in 'isChecked'
    checked={isChecked.includes("Retirement Plans")}
    // Callback function to handle changes when the checkbox is toggled
    // 'handleCheckboxChange' will manage the checkbox's state when user interacts with it
    onChange={handleCheckboxChange}
/>

                                <span>Retirement Plans</span>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    value="Paid Time Off(PTO)"
                                    checked={isChecked.includes("Paid Time Off(PTO)")}
                                    onChange={handleCheckboxChange}
                                />
                                <span>Paid Time Off (PTO)</span>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    value="Flexible Work Arrangements"
                                    checked={isChecked.includes("Flexible Work Arrangements")}
                                    onChange={handleCheckboxChange}
                                />
                                <span>Flexible Work Arrangements</span>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    value="Employee Wellness Programs"
                                    checked={isChecked.includes("Employee Wellness Programs")}
                                    onChange={handleCheckboxChange}
                                />
                                <span>Employee Wellness Programs</span>
                            </div>
                            <div>
                                <input
                                    type='checkbox'
                                    value="Professional Development Opportunities"
                                    checked={isChecked.includes("Professional Development Opportunities")}
                                    onChange={handleCheckboxChange}
                                />
                                <span>Professional Development Opportunities</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        
                        
                    </div>
                    <div>
                       
                        <div className={classes.inputbox}>
                            <label>Application Deadline</label>
                            <input type="date" placeholder="Application Deadline" name="appdeadline" value={data.appdeadline} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div>
                        <div className={classes.inputbox}>
                            <label>Company Logo</label>
                            <input
                                type="url"
                                placeholder='Paste your company logo URL'
                                name='logo'
                                value={data.logo}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className={classes.inputbox}>
                            <label>Recruitment Process Stages</label>
                            <CreatableSelect
                    isMulti
                    onChange={setSelectedSteps}
                    options={steps}
                    value={selectedSteps}
                />
                        
                        </div>
                        <div className={classes.inputbox}>
                            
                            <label>Additional Requirement</label>
                            <textarea type="text" placeholder="Additional Requirement" name="additionalReq" value={data.additionalReq} onChange={handleInputChange} rows={5} cols={43} />
                        </div>
                    </div>
                    <button className={classes.btn} onSubmit={handleAdd}>
                        <span className={classes.btntextone}>Post Your Job</span>
                        <span className={classes.btntexttwo}>Done!</span>
                    </button>
                </form>
            </div>
        </div>
        </Sidebar1>
    )
}

export default CreateJob;