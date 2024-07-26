import React, { useState, useEffect } from "react";
import SmallCalendar from "./SmallCalendar";
import "../interview.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Sidebar({ onScheduleInterview, interviewToEdit, onCancelEdit, onUpdateInterview }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [interviewFormat, setInterviewFormat] = useState("");
  const [interviewRequirements, setInterviewRequirements] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobsWithApplicants, setJobsWithApplicants] = useState([]);
  const [interviewScheduled, setInterviewScheduled] = useState(false); // New state to track if interview is scheduled
  const [jobTitle, setJobTitle] = useState(""); // Add jobTitle state variable


  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleScheduleInterview = async () => {
    const interviewDate = `${selectedDate} from ${startTime} to ${endTime}`;
    const interviewDetails = {
      interviewDate,
      format: interviewFormat,
      requirements: interviewRequirements,
      applicantId: selectedApplicant,
      jobId,
      applicantName: applicantName,
    };
  
    try {
      const response = await axios.post('http://localhost:8800/api/interviews', interviewDetails);
      console.log('Interview scheduled:', response.data);
      // Pass the interview details and job title to the parent component for updating the scheduled interviews
      onScheduleInterview(interviewDetails, jobTitle, applicantName);
      setInterviewScheduled(true);

       // Reset form fields after successful scheduling
    /*setSelectedDate("");
    setStartTime("");
    setEndTime("");
    setSelectedApplicant("");
    setInterviewFormat("");
    setInterviewRequirements("");
    setJobId("");*/


    } catch (error) {
      console.error('Error scheduling interview:', error);
      // Display an error message to the user
      alert('An error occurred while scheduling the interview. Please try again later.');
    }
  };
  
  useEffect(() => {
    const fetchApplicantsByJob = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const recruiter_id = decodedToken.id;
      try {
        const response = await axios.get(`http://localhost:8800/api/applications?recruiter_id=${recruiter_id}`);
          // Check if response data exists and is an array
        if (response.data && Array.isArray(response.data)) {
           // Object to store jobs with their applicants
          const jobs = {};
          // Iterate over each application submission
          response.data.forEach((submission) => {
            // If the job doesn't exist in the 'jobs' object, initialize it
            if (!jobs[submission.job_id]) {
              jobs[submission.job_id] = { title: submission.job_title, applicants: [], steps: submission.steps };
            }
             // Push the current submission to the corresponding job's applicants array
            jobs[submission.job_id].applicants.push(submission);
          });
          // Convert the 'jobs' object into an array of [key, value] pairs and set it to state
          setJobsWithApplicants(Object.entries(jobs));
        } else {
          // If response data is not an array or is empty, set jobs with applicants to an empty array
          setJobsWithApplicants([]);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
          // Set jobs with applicants to an empty array in case of error
        setJobsWithApplicants([]);
      }
    };
    fetchApplicantsByJob();
  }, []);

  const handleApplicantSelection = (applicantId, jobId, applicantName) => {
    setSelectedApplicant(applicantId);
    setApplicantName(applicantName);
    setJobId(jobId);
  };

 

  return (
    <div className="sidebar-interview">
      <button className="create-event-button" onClick={handleScheduleInterview}>
        Schedule Interview
      </button>
      <SmallCalendar onDateSelected={setSelectedDate} />
      <br></br>
      <div className="interview-time">
        <label htmlFor="start-time"><b>Start</b> </label>
        <input
          type="time"
          id="start-time"
          name="start-time"
          value={startTime}
          onChange={handleStartTimeChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="end-time"><b>End</b> &nbsp;</label>
        <input
          type="time"
          id="end-time"
          name="end-time"
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </div>
      <div className="interview-format">

        <label htmlFor="interview-format"><b>Interview Format</b> </label>
        <select
          id="interview-format"
          value={interviewFormat}
          onChange={(e) => setInterviewFormat(e.target.value)}
        >
          <option value="">Select format</option>
          <option value="In-person">In-person</option>
          <option value="Phone">Phone</option>
          <option value="Video">Video</option>
        </select>
      </div>
      <div className="interview-requirements">

        <label htmlFor="interview-requirements"><b>Interview Requirements</b></label>
        <textarea
          id="interview-requirements"
          value={interviewRequirements}
          onChange={(e) => setInterviewRequirements(e.target.value)}
        />
      </div>
      <div className="list-of-applicants">
  {jobsWithApplicants.length === 0 ? (
    <p className="no-applicants-to-schedule">No one has applied for any of your jobs yet.</p>
  ) : (
    jobsWithApplicants.map(([jobId, { title, applicants, steps }]) => (
      <div key={jobId}>
        <h3>Job: {title}</h3>
        {steps && steps.includes("4- Interview") ? (
          applicants.map((submission, index) => (
            <div key={submission.applicant_name}>
              <input
                type="radio"
                id={`applicant-${submission.submission_id}`}
                name={"selectedApplicant"}
                value={submission.applicant_id}
                onChange={() => handleApplicantSelection(submission.applicant_id, jobId, submission.applicant_name)}
              />
              <label htmlFor={`applicant-${submission.submission_id}`}>{submission.applicant_name}</label>
            </div>
          ))
        ) : (
          <p>There is no interview in the hiring process for this job.</p>
        )}
      </div>
    ))
  )}
</div>


     

    </div>
  );
}

export default Sidebar;