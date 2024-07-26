import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar1 from '../SideMenu/RecSideMenu';
import classes from './AllAssessments.module.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AllAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        const recruiter_id = decodedToken.id;
        axios.get(`http://localhost:8800/getAssessment?recruiter_id=${recruiter_id}`)
          .then(response => {
            console.log('Assessment data:', response.data);
            setAssessments(response.data);
          })
          .catch(error => {
            console.error('Error fetching assessments:', error);
            setError(error.message);
          });
      } catch (err) {
        console.log('Error decoding token:', err);
      }
    }
  }, []);

  const handleViewDetails = async (assessmentId) => {
    setSelectedAssessmentId(assessmentId);
    try {
      const response = await axios.get(`http://localhost:8800/getquestions/${assessmentId}`);
      navigate(`/questions/${assessmentId}`);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error.message);
    }
  };

  return (
    <div className={classes.generalcontainer}>
      <Sidebar1>
        <div className='maincontent'>
          <div className={classes.myapplicationstitle}>
            <h1 className={classes.h1}>My Assessments</h1>
          </div>
          <div className={classes.listofapplications}>
              {assessments.length === 0 ? (
                <p className={classes.noAssessmentsYet}>No assessments have been created yet.</p>
              ) : (
                assessments.map(assessment => (
                  <div className={classes.applicationscontainer} key={assessment.assessment_id}>
                    <p className={classes.jobapplieddetails}>Assessment Name: {assessment.test_name}</p>
                    <p className={classes.jobapplieddetails1}>Job Title: {assessment.job_title}</p>
                    <button className={classes.buttonv} onClick={() => handleViewDetails(assessment.assessment_id)}>Correction</button>
                  </div>
                ))
              )}
          </div>

        </div>
      </Sidebar1>
    </div>
  );
}

export default AllAssessments;
