import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classes from './create.module.css'; 
import Sidebar1 from '../SideMenu/RecSideMenu.js';
import { useNavigate } from 'react-router-dom';
import UpdateJob from './UpdateJob.js';
import ViewJob from './ViewJob.js';
import { jwtDecode } from 'jwt-decode'; // Importing jwtDecode function
import Assessment from '../Assessment/assessment';

// Functional component EditorDeleteJob
function EditorDeleteJob() {
    // State variables using useState hook
    const [jobs, setJobs] = useState([]); // Holds list of jobs
    const [selectedJobId, setSelectedJobId] = useState(null); // Holds the ID of the selected job
    const [selectedJobData, setSelectedJobData] = useState(null); // Holds data of the selected job
    const [error, setError] = useState(null); // Holds error message
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Boolean to control visibility of update form
    const [updateFormData, setUpdateFormData] = useState(null); // Holds data for updating job
    const navigate = useNavigate(); // Hook for navigating
    const [showViewPopup, setShowViewPopup] = useState(false); // Boolean to control visibility of view popup
    const [viewJobData, setViewJobData] = useState(null); // Holds data of the job for viewing
    const [applicants, setApplicants] = useState([]); // Holds list of applicants for a job
    const [showPopup, setShowPopup] = useState(false); // Boolean to control visibility of a general popup
    const [showAssessmentPopup, setShowAssessmentPopup] = useState(false); // Boolean to control visibility of assessment popup
    const [selectedJobIdForAssessment, setSelectedJobIdForAssessment] = useState(null); // Holds the ID of the job for assessment


    // useEffect hook to fetch jobs when component mounts
    useEffect(() => {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token to get recruiter ID
                const decodedToken = jwtDecode(token);
                const recruiter_id = decodedToken.id;
                // Fetch jobs associated with the recruiter ID
                axios.get(`http://localhost:8800/getrecruiterjobs?recruiter_id=${recruiter_id}`)
                    .then(response => {
                        setJobs(response.data.result); // Set jobs state with fetched data
                    })
                    .catch(error => {
                        console.error('Error fetching jobs:', error);
                        setError(error.message); // Set error state if request fails
                    });
            } catch (err) {
                console.log('Error decoding token:', err);
            }
        }
    }, []); // Empty dependency array means this effect runs only once when the component mounts

    // Function to handle viewing details of a job
    const handleView = (jobId) => {
        setSelectedJobId(jobId); // Set selected job ID
        const selectedJob = jobs.find(job => job.job_id === jobId); // Find the job in the list
        if (selectedJob) {
            setSelectedJobData(selectedJob); // Set selected job data
            setViewJobData(selectedJob); // Set data for viewing job
            setShowViewPopup(true); // Show view popup
        } else {
            console.error('Selected job not found');
        }
    };

    // Function to handle viewing applicants for a job
    const handleViewApplicants = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:8800/getapplicants/${jobId}`);
            setApplicants(response.data); // Set list of applicants
            navigate(`/applicants/${jobId}`); // Navigate to applicants page for this job
        } catch (error) {
            console.error('Error fetching applicants:', error);
            setError(error.message); // Set error state if request fails
        }
    };

    // Function to handle editing a job
    const handleEdit = (jobId) => {
        setSelectedJobId(jobId); // Set selected job ID
        const selectedJob = jobs.find(job => job.job_id === jobId); // Find the job in the list
        setSelectedJobData(selectedJob); // Set selected job data
        setUpdateFormData(selectedJob); // Set data for updating job
        setShowUpdateForm(true); // Show update form
    };

    // Function to handle deleting a job
    const handleDelete = (jobId) => {
        axios.delete(`http://localhost:8800/deletejob/${jobId}`)
            .then(response => {
                console.log(response);
                setJobs(jobs.filter(job => job.job_id !== jobId)); // Remove the deleted job from the list
            })
            .catch(error => {
                console.error('Error deleting job:', error);
                setError(error.message); // Set error state if request fails
            });
    };

    // Function to handle submitting updated job data
    const handleSubmit = (updatedData) => {
        const formattedDeadline = new Date(updatedData.app_deadline).toISOString().split('T')[0];
        updatedData.app_deadline = formattedDeadline;

        axios.put(`http://localhost:8800/updatejob/${selectedJobId}`, updatedData)
            .then(response => {
                console.log(response);
                setShowUpdateForm(false); // Hide update form
            })
            .catch(error => {
                console.error('Error updating job:', error);
                setError(error.message); // Set error state if request fails
            });
    };

    // Function to handle assessment button click
    const handleAssessmentClick = async (jobId) => {
        setSelectedJobIdForAssessment(jobId); // Set selected job ID for assessment
        const selectedJob = jobs.find(job => job.job_id === jobId); // Find the job in the list
        if (!selectedJob) {
            console.error('Selected job not found for ID:', jobId);
            return;
        }

        if (selectedJob.steps) {
            const jobSteps = selectedJob.steps.split(',');
            if (jobSteps.some(step => step.trim().startsWith('5- Assessment'))) {
                // Check if there is already an assessment for this job
                try {
                    const response = await axios.get(`http://localhost:8800/checkAssessmentPresence/${jobId}`);
                    if (response.data.length > 0) {
                        alert('An assessment already exists for this job.');
                        return;
                    }
                } catch (error) {
                    console.error('Error checking assessment:', error);
                    setError(error.message); // Set error state if request fails
                    return;
                }

                // If no assessment exists, show the assessment popup
                setShowAssessmentPopup(true);
            } else {
                alert('There is no test in the hiring process for this job.');
            }
        } else {
            console.error('Job steps not found for selected job:', selectedJob);
        }
    };

    // Rendering JSX
    return (
        <Sidebar1>
            <div>
                <h1 className={classes.h11}>My Jobs</h1>
                {jobs.length === 0 ? (
                    <p className={classes.noApplications}>You haven't posted any job yet.</p>
                ) : (
                    jobs.map(job => (
                        <div className={classes.jobcontainer} key={job.job_id}>
                            <p className={classes.jobtitle}>{job.job_title}</p>
                            <p className={classes.jobothers}>{job.company_name}</p>
                            <p className={classes.jobothers}>{job.job_function}</p>
                            <div className={classes.jobactions}>
                                <button className={classes.edit} onClick={() => handleEdit(job.job_id)}>Edit</button>
                                <button className={classes.delete} onClick={() => handleDelete(job.job_id)}>Delete</button>
                                <button className={classes.viewb} onClick={() => handleView(job.job_id)}>View</button>
                                <button className={classes.viewApplicants} onClick={() => handleViewApplicants(job.job_id)}>Applicants</button>
                                <button className={classes.assessment} onClick={() => handleAssessmentClick(job.job_id)}>Assessment</button>
                            </div>
                        </div>
                    ))
                )}

                {/* Conditional rendering of popups */}
                {showUpdateForm && <Overlay />}
                {showViewPopup && <Overlay />}
                {showAssessmentPopup && <Overlay />}

                {showUpdateForm && (
                    <div className={classes.popup}>
                        <div className={classes.popupContent}>
                            <button className={classes.closeButton} onClick={() => setShowUpdateForm(false)}>X</button>
                            <UpdateJob
                                initialData={updateFormData}
                                onSubmit={handleSubmit}
                                onCancel={() => setShowUpdateForm(false)}
                            />
                        </div>
                    </div>
                )}

                {showViewPopup && (
                    <div className={classes.popup}>
                        <div className={classes.popupContent}>
                            <button className={classes.closeButton} onClick={() => setShowViewPopup(false)}>X</button>
                            <ViewJob
                                initialData={viewJobData}
                                onCancel={() => setShowViewPopup(false)}
                            />
                        </div>
                    </div>
                )}

                {showAssessmentPopup && (
                    <div className={classes.popup}>
                        <div className={classes.popupContent}>
                            <button className={classes.closeButton} onClick={() => setShowAssessmentPopup(false)}>X</button>
                            <Assessment jobId={selectedJobIdForAssessment} onSubmit={(e) => handleSubmit(e, selectedJobIdForAssessment)}/>
                        </div>
                    </div>
                )}

            </div>
        </Sidebar1>
    );
}

// Overlay component for darkening background during popups
const Overlay = () => <div className={classes.overlay}></div>;

export default EditorDeleteJob;

