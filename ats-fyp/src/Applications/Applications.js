import React, { useState, useEffect } from 'react';
import Sidebar1 from '../SideMenu/AppSideMenu';
import './Applications.css'; 
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode';
import Test from '../Assessment/Test'; 

function Applications() {
    // State hooks to manage state variables
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [isTestOpen, setTestOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [testCompleted, setTestCompleted] = useState({});

    // useEffect hook to fetch applications when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decode the JWT token to get applicant ID
                const applicantId = decodedToken.id;
                axios.get(`http://localhost:8800/get-my-applications?applicant_id=${applicantId}`)
                    .then(response => {
                        setJobs(response.data.result); // Set the jobs state with the response data
                    })
                    .catch(error => {
                        console.error('Error fetching your applications:', error.response.data.error || error.message);
                        setError(error.response.data.error || error.message); // Set error state if there's an error
                    });
            } catch (err) {
                console.log('Error decoding token:', err);
            }
        }

        // Retrieve test completion state from localStorage
        const savedTestCompleted = JSON.parse(localStorage.getItem('testCompleted')) || {};
        setTestCompleted(savedTestCompleted); // Set the testCompleted state
    }, []); // Empty dependency array means this effect runs once on component mount

    // Function to handle opening the test popup
    const openTestPopup = async (jobId) => {
        try {
            const assessmentId = await fetchAssessmentId(jobId); // Fetch the assessment ID for the job
            if (assessmentId !== null) {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const applicantId = decodedToken.id;
                    const testKey = `${applicantId}-${jobId}`;

                    // Check if the test has already been completed
                    /*if (testCompleted[testKey]) {
                        alert('You already completed this assessment');
                        return;
                    }*/

                    try {
                        const insertResponse = await axios.post('http://localhost:8800/insert-assessment', {
                            appId: applicantId,
                            assessmentId: assessmentId
                        });
                        const applicantAssessmentId = insertResponse.data.applicantAssessmentId;
                        console.log('Inserted into applicant_assessments, ID:', applicantAssessmentId);

                        setSelectedJobId(jobId); // Set the selected job ID
                        setTestOpen(true); // Open the test popup

                        // Update testCompleted state and save to localStorage
                        setTestCompleted(prevState => ({
                            ...prevState,
                            [testKey]: true
                        }));
                        localStorage.setItem('testCompleted', JSON.stringify({ ...testCompleted, [testKey]: true }));
                    } catch (error) {
                        console.error('Error inserting into applicant_assessments:', error.response.data.error || error.message);
                        alert('An error occurred while inserting into applicant_assessments.');
                    }
                }
            } else {
                alert('This job does not have an assessment yet.');
            }
        } catch (error) {
            console.error('Error opening test popup:', error);
            alert('An error occurred while opening the test popup.');
        }
    };

    // Function to fetch the assessment ID for a specific job
    const fetchAssessmentId = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:8800/get-assessment-id/${jobId}`);
            const assessmentId = response.data;
            return assessmentId;
        } catch (error) {
            console.error('Error fetching assessment ID:', error.response.data.error || error.message);
            alert('An error occurred while fetching assessment ID.');
            return null;
        }
    };

    return (
        <div className='general-container'>
            <Sidebar1> {/* Sidebar component */}
                <div className='main-content'>
                    <div className='my-applications-title'>
                        <h1>My Applications</h1>
                    </div>
                    <div className='list-of-applications'>
                  
{jobs.length > 0 ? (
    // Map over each job in the jobs array
    jobs.map(job => {
        // Decode the JWT token to get the applicant ID
        const applicantId = jwtDecode(localStorage.getItem('token')).id;
        // Create a unique key for the test using applicant ID and job ID
        const testKey = `${applicantId}-${job.job_id}`;

        // Return the JSX for each job
        return (
            // Use job ID as the key for each job item
            <div key={job.job_id} className='applications-container'>
                {/* Display job details */}
                <p className='job-applied-details'><b>Job:</b> <span>{job.job_title}</span></p>
                <p className='job-applied-details'><b>Company:</b> <span>{job.company_name}</span></p>
                <p className='job-applied-details'><b>Function:</b> <span>{job.job_function}</span></p>
                {/* Check if the job status is 'accepted' and if the test duration is available */}
                {job.status === 'accepted' && job.test_duration ? (
                    <p className='job-applied-details'><b>Assessment Duration:</b> <span>{job.test_duration}</span></p>
                ) : (
                    <p className='job-applied-details'></p>
                )}
                <div>
                    {/* Display the job status */}
                    {job.status !== 'accepted' ? (
                        <p style={{ color: 'red' }}><b>{job.status}</b></p>
                    ) : (
                        // If the job status is 'accepted' and includes '5- Assessment' step
                        job.steps.includes('5- Assessment') ? (
                            // Check if the test for this job has been completed
                            testCompleted[testKey] ? (
                                <p style={{ color: 'green' }}><b>Test completed</b></p>
                            ) : (
                                // Button to start the test if it hasn't been completed
                                <button className='start-test-button' onClick={() => openTestPopup(job.job_id)}>Start test</button>
                            )
                        ) : (
                            // If steps do not include '5- Assessment', display accepted message
                            <p style={{ color: 'green' }}><b>accepted</b></p>
                        )
                    )}
                </div>
            </div>
        );
    })
) : (
    // Display message if no applications are found
    <p className='no-apply-yet'>No applications found.</p>
)}

                    </div>
                </div>
            </Sidebar1>
            {isTestOpen && (
                <div className="popup-test">
                    <div className="popup-inner-test">
                        <span className="close-test" onClick={() => setTestOpen(false)}>&times;</span>
                        <Test jobId={selectedJobId} onClose={() => setTestOpen(false)} /> {/* Test component */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Applications;
