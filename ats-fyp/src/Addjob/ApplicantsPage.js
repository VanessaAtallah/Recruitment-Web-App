import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import classes from './ApplicantsPage.module.css';
import CVPopup from './CVPopup';
import Sidebar1 from '../SideMenu/RecSideMenu.js'; 

function ApplicantsPage() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [error, setError] = useState(null);
  const [cvData, setCVData] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/getapplicants/${jobId}`);
        setApplicants(response.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError(error.message);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleApplicantClick = async (applicant) => {
    setSelectedApplicant(applicant);
    try {
      const cvResponse = await axios.get(`http://localhost:8800/getcv/${applicant.submission_id}`);
      setCVData(cvResponse.data);
    } catch (error) {
      console.error('Error fetching CV:', error);
      // Handle error, show error message to the user, etc.
    }
  };
  


  const handleClosePopup = () => {
    setSelectedApplicant(null);
    setCVData(null); // Reset CV data when closing the popup
  };

  const handleAccept = () => {
    // Handle accept logic (if needed)
    // You can add logic here to update the database, if required
    console.log('Applicant accepted');
  };


  

  return (
    <Sidebar1>
<div>
  {error && <p className={classes.error}>Error: {error}</p>}
  <div className={classes.applicantGrid}>
  {applicants.length === 0 ? (
    <p className={classes.noOneApplied}>No one applied for this job yet.</p>
  ) : (
    applicants.map(applicant => (
      <div key={applicant.submission_id} className={classes.applicantBox} onClick={() => handleApplicantClick(applicant)}>
        <p className={classes.info1}><b>Name:</b> {applicant.first_name} {''} {applicant.last_name}</p>
        <p className={classes.info2}><b>Email:</b> {applicant.email}</p>
        <p className={classes.info3}><b>Phone Number:</b> {applicant.phone_number}</p>
        <p className={classes.info4}><b>Address:</b> {applicant.address}</p>
        <p className={classes.info5}><b>Gender:</b> {applicant.gender}</p>
      </div>
    ))
  )}
</div>

  {selectedApplicant && (
    <CVPopup
      selectedApplicant={selectedApplicant}
      cvData={cvData}
      onClose={handleClosePopup}
      onAccept={handleAccept}
    
    />
  )}
</div>
</Sidebar1>

  );
}

export default ApplicantsPage;
