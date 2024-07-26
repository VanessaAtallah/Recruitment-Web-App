
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllJobs.modules.css';
import AppSideMenu from '../SideMenu/AppSideMenu';
import Filters from './Filters';
import { FaSearch, FaMapPin } from 'react-icons/fa';
import Resume from '../AllJobs/Resume';

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(12);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [showResumePopup, setShowResumePopup] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [applicantId, setApplicantId] = useState(null); // State to hold the applicantId

    useEffect(() => {
        // Fetch the applicantId from local storage
        const storedApplicantId = localStorage.getItem('applicantId');
        setApplicantId(storedApplicantId);
        fetchJobs();
    }, []);
    

    const fetchJobs = () => {
        axios.get('http://localhost:8800/allJobs')
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
            });
    };

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    const filteredJobs = searchKeyword
        ? jobs.filter(job => job.job_title.toLowerCase().includes(searchKeyword.toLowerCase()))
        : jobs;

    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const togglePopup = (job, type) => {
        if (type === 'details') {
            setSelectedJob(job);
            setShowDetailsPopup(!showDetailsPopup);
        } else if (type === 'resume') {
            setSelectedJob(job);
            console.log('Job ID:', job.job_id);
            console.log('Applicant ID:', applicantId);
            axios.get(`http://localhost:8800/checkResumePresence?jobId=${job.job_id}&applicantId=${applicantId}`)
                .then(response => {
                    console.log('Response:', response.data);
                    if (response.data.applied) {
                        alert("You've already applied for this job.");
                    } else {
                        setShowResumePopup(prevState => !prevState); // Toggle the showResumePopup state
                    }
                })
                .catch(error => {
                    console.error('Error checking resume presence:', error);
                });
        }
    };
    
    

    const handleClosePopup = () => {
        setShowResumePopup(false);
    };

    return (
        <div className='container-jobs'>
            <AppSideMenu />
            <div className='content'>
                <div className='left-section'>
                    <Filters jobs={jobs} setFilteredJobs={setJobs} />
                </div>
                <div className='right-section'>
                    <div className='top-section'>
                        <h1>Job Listings</h1>
                        <span>
                            <input
                                type="text"
                                name="text"
                                className="input-title-job"
                                placeholder="Search here..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <FaSearch className='search-icon' />
                        </span>
                    </div>
                    <div className='bottom-section'>
                        <div className="grid-container">
                            {currentJobs.map(job => (
                                <div key={job.job_id} className="job-item">
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <img src={job.logo} alt='company logo' width='50px' height='50px' />
                                            <h3>{job.job_title}</h3>
                                            <p>{job.company_name}<br></br>
                                            <FaMapPin color='red' />{job.job_location}<br></br>
                                            {job.posting_date.split('T')[0]} - <span className={job.job_status === 'active' ? 'active-status' : 'closed-status'}>{job.job_status}</span></p>
                                        </div>
                                        <div className="flip-card-back">
                                            <p>{job.employment_type}</p>
                                            <p>{job.education_level}</p>
                                            <div className="button-container">
                                                <button className="apply-button" onClick={() => togglePopup(job, 'details')}>Details</button>
                                                <button
                                                    className={`apply-button ${job.job_status === 'closed' ? 'disabled' : ''}`}
                                                    onClick={() => togglePopup(job, 'resume')}
                                                    disabled={job.job_status === 'closed'}
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination jobsPerPage={jobsPerPage} totalJobs={jobs.length} paginate={paginate} />
                    </div>
                </div>
            </div>
            {showDetailsPopup && (
                <>
                    <Overlay />
                    <div className="popup">
                        <div className="popup-inner">
                            <button className="close-button" onClick={() => setShowDetailsPopup(false)}>x</button>
                            {selectedJob && (
                                <>
                                    <h1>{selectedJob.job_function}</h1>
                                    <p> <span> Employment type: </span> {selectedJob.employment_type}</p>
                                    <p> <span> Work arrangement: </span> {selectedJob.work_arrangement}</p>
                                    <p> <span> Education level: </span> {selectedJob.education_level}</p>
                                    <p> <span> Languages: </span> {selectedJob.languages}</p>
                                    <p> <span> Required Skills: </span> {selectedJob.required_skills}</p>
                                    <p> <span> Experience Level: </span> {selectedJob.experience_level}</p>
                                    <p> <span> Salary Range: </span> {selectedJob.salary_range}</p>
                                    <p> <span> Salary type: </span> {selectedJob.salary_type}</p>
                                    <p> <span> Benefits: </span> {selectedJob.benefits}</p>
                                    <p> <span> Hiring Process: </span> {selectedJob.steps}</p>
                                    <p> <span> Additional Requirements: </span> {selectedJob.additional_requirements}</p>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}


            {showResumePopup && (
                <>
                    <Overlay />
                    <div className="popup">
                        <div className="popup-inner1">
                            <button className="close-button" onClick={() => setShowResumePopup(false)}>x</button>
                            {selectedJob && <Resume jobId={selectedJob.job_id} onClose={handleClosePopup} onApply={() => setAppliedJobs([...appliedJobs, selectedJob.job_id])} />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

const Pagination = ({ jobsPerPage, totalJobs, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={() => paginate(number)} href="#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const Overlay = () => (
    <div className="overlay"></div>
);

export default Dashboard;