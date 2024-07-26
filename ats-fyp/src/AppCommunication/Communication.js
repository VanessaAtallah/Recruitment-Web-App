import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Applications from "../Applications/Applications";
import './communication.css'; // Import CSS file

function Communication() {
    const [interviewData, setInterviewData] = useState([]);
    const [assessmentData, setAssessmentData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const applicantId = decodedToken.id;
                axios.get(`http://localhost:8800/get-interview-app?applicantId=${applicantId}`)
                    .then(response => {
                        setInterviewData(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching interview data:', error);
                    });
            } catch(err) {
                console.log('Error decoding token:', err);
            }
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const applicantId = decodedToken.id;
                axios.get(`http://localhost:8800/get-assessment-app?applicantId=${applicantId}`)
                    .then(response => {
                        setAssessmentData(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching assessment data:', error);
                    });
            } catch(err) {
                console.log('Error decoding token:', err);
            }
        }
    }, []);

    return (
        <div>
                  <Applications/>
       
                <div>
                    <h1 className="h12">Interview Information</h1>
                    <div className="interview-container">
                        {interviewData.map(interview => (
                            <div key={interview.interview_id} className="interview-box">
                                <p className='job-applied-details'><b>Job Name: </b> <span>{interview.job_title}</span></p>
                                <p className='job-applied-details'><b>Interview Date:</b> <span>{interview.interview_date}</span></p>
                                <p className='job-applied-details'><b>Interview Status:</b> <span>{interview.interview_status}</span> </p>
                                {interview.interview_requirements ? (
                                    <p className='job-applied-details'><b>Interview Requirements: </b> <span>{interview.interview_requirements}</span></p>
                                ) : (
                                    <p style={{ color: 'green' }}><b>No Requirements</b></p>
                                )} 
                                {interview.interview_feedback ? (
                                   <p className='job-applied-details'><b>Interview Feedback: </b><span>{interview.interview_feedback}</span></p>
                                ) : (
                                    <p style={{ color: 'green' }}><b>No Feedback</b></p>
                                )}
                            </div>
                        ))}
                    </div>
                    <h1 className="h12">Assessment Information</h1>
                    <div className="interview-container">
                    <div className='list-of-applications'>
                        {assessmentData.map(applicant_assessments => (
                            <div key={applicant_assessments.applicant_assessments_id} className="assessment-box">
                                 <p className='job-applied-details'><b>Assessment Name:</b> <span>{applicant_assessments.test_name}</span></p>
                                {applicant_assessments.feedback ? (
                                     <p className='job-applied-details'>Assessment Feedback: <span>{applicant_assessments.feedback}</span></p>
                                ) : (
                                    <p style={{ color: 'green' }}><b>No Feedback</b></p>
                                )}
                                {applicant_assessments.score !== 'N' ? (
                                     <p className='job-applied-details'>Assessment Score: <span>{applicant_assessments.score}</span></p>
                                ) : (
                                    <p style={{ color: 'red' }}><b>No Score</b></p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                </div>
      
        </div>
    );
}

export default Communication;
