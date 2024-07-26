import React, { useState } from 'react';
import './Filters.modules.css';
import Sidebar from '../SideMenu/AppSideMenu.js';
import axios from 'axios';
const FiltersButton = ({ jobs, setFilteredJobs }) => {
  const [job_category, setJob_category] = useState('');
  const [work_arrangement, setWork_arrangement] = useState('');
  const [employment_type, setEmployment_type] = useState('');
  const [education_level, setEducation_level] = useState('');
  const [experience_level, setExperienceLevel] = useState('');
  const [job_location, setJobLocation] = useState('');
  const [salary_range, setSalary_range] = useState('');


  const applyFilters = () => {
    let filteredJobs = jobs.filter((job) => {
      let match = true;
      if (job_category && job.job_category!== job_category)  {
        match = false;
      }
      if (work_arrangement && job.work_arrangement !== work_arrangement) {
        match = false;
      }
      if (employment_type && job.employment_type !== employment_type) {
        match = false;
      }
      if (education_level && job.education_level !== education_level) {
        match = false;
      }
      if (experience_level && job.experience_level !== experience_level) {
        match = false;
      }
      if (job_location && job.job_location !== job_location) {
        match = false;
      }
      if (salary_range && job.salary_range !== salary_range) {
        match = false;
      }
      return match;
    });

    setFilteredJobs(filteredJobs);
  };
 
  const resetFilters = () => {
    setJob_category('');
    setWork_arrangement('');
    setEmployment_type('');
    setEducation_level('');
    setExperienceLevel('');
    setJobLocation('');
    setSalary_range('');
    
    // Clearing filters by fetching all jobs again
    fetchJobs();
  };
  const fetchJobs = () => {
    
    console.log("Fetching jobs...");

    axios.get('http://localhost:8800/alljobs')

      .then(response => {
        setFilteredJobs(response.data);
        })
        .catch(error => {
           console.error('Error fetching jobs:', error);
        });
  };

  return (
    <Sidebar>
    <div className="filters-popup">
      <h2 className='filters-title'>Filters</h2>

      <label>
         Job category
        <select  value={job_category} onChange={(e) => setJob_category(e.target.value)}>
            <option value="">Any</option> 
<option value="Administrative/Clerical">Administrative/Clerical</option>
<option value="Sales/Marketing">Sales/Marketing</option>
<option value="Customer Service">Customer Service</option>
<option value="Information Technology">Information Technology</option>
<option value="Healthcare/Medical">Healthcare/Medical</option>
<option value="Education/Training">Education/Training</option>
<option value="Finance/Accounting">Finance/Accounting</option>
<option value="Engineering">Engineering</option>
<option value="Human Resources">Human Resources</option>
<option value="Legal">Legal</option>
<option value="Retail">Retail</option>
<option value="Manufacturing/Production">Manufacturing/Production</option>
<option value="Hospitality/Travel">Hospitality/Travel</option>
<option value="Construction/Trades">Construction/Trades</option>
<option value="Media/Communications">Media/Communications</option>
<option value="Art/Design">Art/Design</option>
<option value="Science/Research">Science/Research</option>
<option value="Government/Public Sector">Government/Public Sector</option>
<option value="Nonprofit/Volunteering">Nonprofit/Volunteering</option>
<option value="Consulting/Business Strategy">Consulting/Business Strategy</option>
<option value="Real Estate">Real Estate</option>
<option value="Transportation/Logistics">Transportation/Logistics</option>
<option value="Food Service">Food Service</option>
<option value="Social Services">Social Services</option>
<option value="Automotive">Automotive</option>
<option value="Agriculture/Forestry">Agriculture/Forestry</option>
<option value="Energy/Utilities">Energy/Utilities</option>
<option value="Environmental">Environmental</option>
<option value="Fashion/Beauty">Fashion/Beauty</option>
<option value="Sports/Recreation">Sports/Recreation</option>
<option value="Writing/Editing">Writing/Editing</option>
<option value="Photography/Videography">Photography/Videography</option>
<option value="Music/Entertainment">Music/Entertainment</option>
<option value="Security/Law Enforcement">Security/Law Enforcement</option>
<option value="Telecommunications">Telecommunications</option>
<option value="Insurance">Insurance</option>
<option value="Research and Development">Research and Development</option>
<option value="Pharmaceuticals">Pharmaceuticals</option>
<option value="Architecture">Architecture</option>
<option value="Remote/Telecommuting">Remote/Telecommuting</option>
<option value="Biotechnology">Biotechnology</option>
<option value="Aviation/Aerospace">Aviation/Aerospace</option>
<option value="Marine/Shipbuilding">Marine/Shipbuilding</option>
<option value="Psychology/Counseling">Psychology/Counseling</option>
<option value="Fitness/Wellness">Fitness/Wellness</option>
<option value="Event Planning/Management">Event Planning/Management</option>
<option value="Public Relations/Communications">Public Relations/Communications</option>
<option value="Interior Design">Interior Design</option>
<option value="Religious/Spiritual">Religious/Spiritual</option>
<option value="Veterinary/Animal Care">Veterinary/Animal Care</option>
<option value="Cryptocurrency/Blockchain">Cryptocurrency/Blockchain</option>
<option value="Nanotechnology">Nanotechnology</option>
<option value="Supply Chain/Procurement">Supply Chain/Procurement</option>
<option value="Import/Export">Import/Export</option>
<option value="Waste Management/Recycling">Waste Management/Recycling</option>
<option value="Geology/Geosciences">Geology/Geosciences</option>
<option value="Archaeology">Archaeology</option>
<option value="Translation/Interpretation">Translation/Interpretation</option>
<option value="Forensic Science">Forensic Science</option>
<option value="Social Media Management">Social Media Management</option>
<option value="Software Engineer">Software Engineer</option>
<option value="Data Scientist">Data Scientist</option>
<option value="IT Specialist">IT Specialist</option>
<option value="Nurse">Nurse</option>
<option value="Doctor">Medical Researcher</option>
<option value="Teacher">Teacher</option>
<option value="Professor">Professor</option>
<option value="Education Administrator">Education Administrator</option>
<option value="Marketing Manager">Marketing Manager</option>
<option value="Financial Analyst">Financial Analyst</option>
<option value="Human Resources Specialist">Human Resources Specialist</option>
<option value="Actor">Actor</option>
<option value="Graphic Designer">Graphic Designer</option>
<option value="Biologist">Biologist</option>
<option value="Chemist">Chemist</option>
<option value="Physicist">Physicist</option>
<option value="Civil Engineer">Civil Engineer</option>
<option value="Mechanical Engineer">Mechanical Engineer</option>
<option value="Electrical Engineer">Electrical Engineer</option>
<option value="Administrative Assistant">Administrative Assistant</option>
<option value="Office Manager">Office Manager</option>
<option value="Executive Assistant">Executive Assistant</option>
<option value="Hotel Manager">Hotel Manager</option>
<option value="Chef">Chef</option>
<option value="Event Planner">Event Planner</option>
<option value="Sales Representative">Sales Representative</option>
<option value="Account Manager">Account Manager</option>
<option value="Retail Associate">Retail Associate</option>

        </select>
      </label>
      <label>
        Work Arrangement
        <select value={work_arrangement} onChange={(e) => setWork_arrangement(e.target.value)}>
              <option value="">Any</option>
              <option value="Traditional Office-Based Work">Traditional Office-Based Work</option>
              <option value="Remote Work">Remote Work</option>
              <option value="Hybrid Work">Hybrid Work</option>
              <option value="Flextime">Flextime</option>
              <option value="Compressed Workweek">Compressed Workweek</option>
              <option value="Job Sharing">Job Sharing</option>
              <option value="Shift Work">Shift Work</option>
        </select>
      </label>
      <label>
        Employment Type
        <select value={employment_type} onChange={(e) => setEmployment_type(e.target.value)}>
          <option value="">Any</option>
          <option value="Full-time Employment">Full-time Employment</option>
                                <option value="Part-time Employment">Part-time Employment</option>
                                <option value="Contract Work">Contract Work</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance Work">Freelance Work</option>
                                <option value="Temporary Employment">Temporary Employment</option>
                                <option value="Consulting">Consulting</option>
                                <option value='Seasonal Work'>Seasonal Work</option>
        </select>
      </label>
      <label>
        Education Level
        <select value={education_level} onChange={(e) => setEducation_level(e.target.value)}>
          <option value="">Any</option>
          <option  value="High School Diploma">High School Diploma</option>
                                <option value="Associate's Degree">Associate's Degree</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="Master's Degree">Master's Degree</option>
                                <option  value="Doctorate or Ph.D.">Doctorate or Ph.D.</option>
                                <option value="Professional Degree (e.g., MD, JD, MBA)">Professional Degree (e.g., MD, JD, MBA)</option>
        </select>
      </label>

      <label>
        Experience Level
        <input
          type="text"
          value={experience_level}
          onChange={(e) => setExperienceLevel(e.target.value)}
          placeholder='2-3 years of experience'
        />
      </label>

      <label>
        Job Location
        <input
          type="text"
          value={job_location}
          onChange={(e) => setJobLocation(e.target.value)}
          placeholder='Beirut-Lebanon'
        />
      </label>

      <label>
        Salary Range
        <input
          type="text"
          value={salary_range}
          onChange={(e) => setSalary_range(e.target.value)}
          placeholder='$1k-$3k'
        />
      </label>
      
      <div className='button-container'>
      <button className="button-filters" onClick={applyFilters}>Apply Filters</button>
      <button  className="button-filters" onClick={resetFilters}>Clear Filters</button>
    </div></div>
    </Sidebar>
  );
};

export default FiltersButton;
