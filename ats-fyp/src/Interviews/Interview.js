import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./interview.css";
import Sidebar from "./components/Sidebar";
import RecSideMenu from "../SideMenu/RecSideMenu";
import { jwtDecode } from "jwt-decode";
import FeedbackForm from "./components/FeedbackForm";
function Interview() {
    // Initialize state for scheduledInterviews using useState hook
    const [scheduledInterviews, setScheduledInterviews] = useState(() => {
    // Retrieve stored interviews from localStorage
    const storedInterviews = localStorage.getItem('scheduledInterviews');
    
    // Parse stored interviews from JSON format if they exist, otherwise initialize as an empty array
    return storedInterviews ? JSON.parse(storedInterviews) : [];
  });
  
  const [editingIndex, setEditingIndex] = useState(null); // State to track the index of the interview being edited
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedInterviewIndex, setSelectedInterviewIndex] = useState(null);
  


  const fetchScheduledInterviews = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const recruiter_id = decodedToken.id;

    try {
        const response = await axios.get(`http://localhost:8800/api/scheduled-interviews?recruiter_id=${recruiter_id}`);
        const interviewsWithStatus = response.data.map(async interview => {
            const statusResponse = await axios.get(`http://localhost:8800/api/interview-status/${interview.interview_id}`);
            return { ...interview, interview_status: statusResponse.data.interview_status };
        });
        //This ensures that all interviews are fetched and their status is resolved before proceeding.
        const interviewsWithResolvedStatus = await Promise.all(interviewsWithStatus);
        setScheduledInterviews(interviewsWithResolvedStatus);
        // Store the resolved interviews in localStorage after converting them to a JSON string
        localStorage.setItem('scheduledInterviews', JSON.stringify(interviewsWithResolvedStatus));
    } catch (error) {
        console.error('Error fetching scheduled interviews:', error);
    }
};


  useEffect(() => {
    fetchScheduledInterviews();
  }, []);

  // Function to delete an interview by index
const deleteInterview = async (index) => {
    // Check if scheduledInterviews array contains an interview at the given index
    if (scheduledInterviews[index]) {
      // Retrieve the interview ID from the scheduledInterviews array
      const interviewId = scheduledInterviews[index].interview_id;
  
      try {
        // Send a DELETE request to the server to delete the interview with the specified ID
        await axios.delete(`http://localhost:8800/api/delete-interview/${interviewId}`);
        
        // Update the scheduledInterviews state by removing the deleted interview
        setScheduledInterviews(prevInterviews => prevInterviews.filter((_, i) => i !== index));
        
       // Update local storage to reflect the updated scheduledInterviews state
      localStorage.setItem(
    'scheduledInterviews', // Key for storing data in local storage
  // Creates a new array without the interview at the specified index and converts it into a JSON string for storage in local storage
   JSON.stringify(scheduledInterviews.filter((_, i) => i !== index))

  );
  
      } catch (error) {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting interview:', error);
      }
    }
  };
  

  const scheduleInterview = async (interviewDetails, jobTitle, applicantName) => {
    const formattedInterview = {
      interview_date: interviewDetails.interviewDate,
      startTime: interviewDetails.startTime,
      endTime: interviewDetails.endTime,
      interview_format: interviewDetails.format,
      interview_requirements: interviewDetails.requirements,
      job_title: jobTitle,
      applicant_name: applicantName,
    };
   
  };
  
  const handleFeedbackClick = (index) => {
    setSelectedInterviewIndex(index);
    setShowFeedbackPopup(true);
};

const handleFeedbackSubmit = async (feedback) => {
  if (selectedInterviewIndex !== null) {
      const interviewDate = scheduledInterviews[selectedInterviewIndex].interview_date;
      const [date, timeRange] = interviewDate.split(' from ');
      const [startTime, endTime] = timeRange.split(' to ');

      const interviewDateTime = new Date(`${date}T${startTime}`);
      const currentDateTime = new Date();

      /*if (interviewDateTime > currentDateTime) {
          alert('You cannot give feedback until after the interview has taken place.');
          return;
      }*/

      const interviewId = scheduledInterviews[selectedInterviewIndex].interview_id;
      try {
          await axios.put(`http://localhost:8800/api/update-interview-feedback/${interviewId}`, {
              feedback: feedback
          });
          // Update the interview in the state
        // Create a shallow copy of the scheduledInterviews array
        const updatedInterviews = [...scheduledInterviews];

     // Update the interview feedback for the selected interview in the copied array
     updatedInterviews[selectedInterviewIndex].interview_feedback = feedback;

    // Update the state with the modified array containing the updated interview feedback
    setScheduledInterviews(updatedInterviews);

          // Close the feedback form pop-up
          setShowFeedbackPopup(false);
      } catch (error) {
          console.error('Error updating interview feedback:', error);
      }
  }
};

// Function to determine if feedback submission is disabled based on interview date
const isFeedbackDisabled = (interviewDate) => {
    // Split the interview date into date and time range
    const [date, timeRange] = interviewDate.split(' from ');
    // Split the time range into start and end time
    const [, endTime] = timeRange.split(' to ');

    // Extract hours and minutes from the end time
    const endTimeParts = endTime.split(':');
    // Create a date object representing the end date and time of the interview
    const endDateTime = new Date(date);
    endDateTime.setHours(parseInt(endTimeParts[0], 10));
    endDateTime.setMinutes(parseInt(endTimeParts[1], 10));

    // Get the current date and time
    const currentDateTime = new Date();

    // Check if current date and time is before the end date and time of the interview
    // If current date and time is before the end date and time, feedback submission is enabled
    // If current date and time is after or equal to the end date and time, feedback submission is disabled
    return currentDateTime < endDateTime;
};


useEffect(() => {
    // Function to update interview status based on current date and time
    const updateInterviewStatus = async () => {
        // Get the current date and time
        const currentDateTime = new Date();

        // Map over scheduled interviews to update their status
        const updatedInterviews = scheduledInterviews.map(interview => {
            // Extract date and time information from interview data
            const [date, timeRange] = interview.interview_date.split(' from ');
            const [, endTime] = timeRange.split(' to ');

            // Calculate the end date and time of the interview
            const endTimeParts = endTime.split(':');
           // Create a new Date object representing the end date and time of the interview
           const endDateTime = new Date(date);

        // Set the hours component of the end date and time using the parsed end time hours
        endDateTime.setHours(parseInt(endTimeParts[0], 10));

       // Set the minutes component of the end date and time using the parsed end time minutes
       endDateTime.setMinutes(parseInt(endTimeParts[1], 10));


            // Update interview status to 'done' if the current time exceeds the end time
            if (currentDateTime > endDateTime && interview.interview_status !== 'done') {
                interview.interview_status = 'done';
                
                // Send a PUT request to update interview status on the server
                axios.put(`http://localhost:8800/api/update-interview-status/${interview.interview_id}`, {
                    interview_status: 'done'
                }).catch(error => {
                    console.error('Error updating interview status:', error);
                });
            }

            return interview;
        });

        // Update the state with the modified interview status
        setScheduledInterviews(updatedInterviews);

        // Update local storage with the modified interview status
        localStorage.setItem('scheduledInterviews', JSON.stringify(updatedInterviews));
    };

    // Execute updateInterviewStatus function at intervals
    const interval = setInterval(() => {
        updateInterviewStatus();
    }, 1000); // Check every second

    // Cleanup function to clear interval
    return () => clearInterval(interval);
}, [scheduledInterviews]);




return (
  <div className="container-interview-page">
      <RecSideMenu />
      <div className="container-without-menu">
          <div>
              <Sidebar onScheduleInterview={scheduleInterview} />
          </div>
          <div>
              {scheduledInterviews.length === 0 ? (
                  <div className="no-interviews">
                      <p>No interviews scheduled</p>
                  </div>
              ) : (
                  <div>
                  {scheduledInterviews.map((interview, index) => (
                        <div key={index} className="scheduled-interview">
                            <button className="cancel-interview-button" onClick={() => deleteInterview(index)}>X</button>
                            <p className="interview-index">Interview {index + 1} - <span className={interview.interview_status === 'scheduled' ? 'status-scheduled' : 'status-done'}> {interview.interview_status}</span></p>                            
                            <p className="interview-details">Date and time: <span>{interview.interview_date}</span></p>
                            <p className="interview-details">Format: <span>{interview.interview_format}</span></p>
                            <p className="interview-details">Requirements: <span>{interview.interview_requirements}</span></p>
                            <p className="interview-details">Applicant: <span>{interview.applicant_name}</span></p>
                            <p className="interview-details">Job: <span>{interview.job_title}</span></p>
                            <button
                                  className="interview-feedback-button"
                                  onClick={() => handleFeedbackClick(index)}
                                  disabled={isFeedbackDisabled(interview.interview_date)}
                                  style={isFeedbackDisabled(interview.interview_date) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                              >
                                  Feedback
                              </button>

                        </div>
                    ))}

                  </div>
              )}
          </div>
          {showFeedbackPopup && (
              <div className="popup-feedback">
                  <div className="popup-inner-feedback">
                      <span className="close-feedback" onClick={() => setShowFeedbackPopup(false)}>&times;</span>
                      <FeedbackForm onClose={() => setShowFeedbackPopup(false)} onSubmit={handleFeedbackSubmit} />
                  </div>
              </div>
          )}
          {editingIndex !== null && (
              <Sidebar
                  onScheduleInterview={scheduleInterview}
                  interviewToEdit={scheduledInterviews[editingIndex]}
                 
              />
          )}
      </div>
  </div>
);
}

export default Interview;