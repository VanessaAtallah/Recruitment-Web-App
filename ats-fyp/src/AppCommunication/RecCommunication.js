// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar1 from '../SideMenu/RecSideMenu.js'; // Sidebar component
import { jwtDecode } from "jwt-decode"; // JWT decode library

function ApplicantList() {
  // State to store applicants grouped by job title
  const [applicantsByJob, setApplicantsByJob] = useState({});

  useEffect(() => {
    // Get the JWT token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to get recruiter ID
        const decodedToken = jwtDecode(token);
        const recruiterId = decodedToken.id;

        // Fetch applicants for the recruiter from the backend
        axios.get(`http://localhost:8800/get-applicants?recruiterId=${recruiterId}`)
          .then(response => {
            // Group applicants by job title
            const groupedApplicants = {}; //{"Software Engineer": [applicant1, applicant2, ...],}
            response.data.forEach(applicant => { //represents object from the response
              // Check if the job title exists in groupedApplicants
              if (!groupedApplicants[applicant.job_title]) {
                // If not, initialize an empty array for that job title
                groupedApplicants[applicant.job_title] = [];
              }
              // Push the current applicant into the array corresponding to their job title
              groupedApplicants[applicant.job_title].push(applicant);
            });

            // Update state with grouped applicants
            setApplicantsByJob(groupedApplicants);
          })
          .catch(error => {
            // Log any errors during fetching
            console.error('Error fetching applicants:', error);
          });
      } catch (error) {
        // Log any errors during token decoding
        console.error('Error decoding token:', error);
      }
    }
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    // Sidebar component for layout
    <Sidebar1>
      <div>
        {/* Main heading */}
        <h1 style={{ marginLeft: '250px' }}>Send Email To ...</h1>
        
        {/* Iterate over job titles in applicantsByJob */}
        {Object.keys(applicantsByJob).map(jobTitle => (
          <div 
            key={jobTitle} 
            style={{ border: '2px solid #ccc', padding: '10px', marginBottom: '20px', width: '500px', marginLeft: '250px' }}
          >
            {/* Display job title */}
            <h2>Job Title: {' '}{jobTitle}</h2>
            <div>
              {/* Iterate over applicants for each job title */}
              {applicantsByJob[jobTitle].map(applicant => (
                <div key={applicant.email}>
                  <p>
                    <ol>
                      {/* Display applicant's name */}
                      <strong>Name: </strong>{' '}
                      {applicant.first_name} {applicant.last_name}
                      {' '}
                      {/* Display applicant's email as a mailto link */}
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${applicant.email}`}>{applicant.email}</a>
                    </ol>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Sidebar1>
  );
}

export default ApplicantList;
