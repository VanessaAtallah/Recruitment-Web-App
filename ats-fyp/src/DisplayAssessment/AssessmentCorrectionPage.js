import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import classes from './AllAssessments.module.css';
import Sidebar1 from '../SideMenu/RecSideMenu.js';

function AssessmentCorrectionPage() {
  const { assessmentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicantAnswers, setSelectedApplicantAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [score, setScore] = useState(''); // Define state for score
  const [feedback, setFeedback] = useState(''); // Define state for feedback
  const [selectedApplicantId, setSelectedApplicantId] = useState(null); // Define state for selected applicant ID
  const [alreadyGraded, setAlreadyGraded] = useState(false); // Define state for indicating if the test has already been graded
  const [hasGrade, setHasGrade] = useState(false); // Define state for indicating if there is a grade
  const [hasFeedback, setHasFeedback] = useState(false); // Define state for indicating if there is feedback
  


  const handleSubmitScore = async () => {
    try {
      // Send a POST request to update assessment with score and feedback
      await axios.post('http://localhost:8800/update-assessment-score', {
        applicantId: selectedApplicantId,
        assessmentId,
        score
      });
      console.log('Assessment updated successfully');
    } catch (error) {
      console.error('Error updating assessment:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      // Send a POST request to update assessment with score and feedback
      await axios.post('http://localhost:8800/update-assessment-feedback', {
        applicantId: selectedApplicantId,
        assessmentId,
        feedback
      });
      console.log('Assessment updated successfully');
    } catch (error) {
      console.error('Error updating assessment:', error);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/getquestions/${assessmentId}`);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message);
      }
    };

    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/getApplicants?assessmentId=${assessmentId}`);
        console.log('Applicants:', response.data);
        setApplicants(response.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError(error.message);
      }
    };

    if (assessmentId) {
      fetchQuestions();
      fetchApplicants();
    }
  }, [assessmentId]);

  const handleClosePopUp = () => {
    setShowPopUp(false); // Hide the pop-up when closed
  };
  
  const handleApplicantClick = async (applicantId) => {
    setShowPopUp(true); // Show the pop-up when an applicant is clicked
    setSelectedApplicantId(applicantId); // Store the selected applicant's ID
    try {
      const response = await axios.get(`http://localhost:8800/getApplicantAnswers?assessmentId=${assessmentId}&applicantId=${applicantId}`);
      console.log('Applicant Answers:', response.data);
      setSelectedApplicantAnswers(response.data); // Store answers for the selected applicant
  
      // Check if there is already a score and feedback for this assessment
      const assessmentInfoResponse = await axios.get(`http://localhost:8800/getAssessmentInfo?assessmentId=${assessmentId}&applicantId=${applicantId}`);
      const { score, feedback } = assessmentInfoResponse.data;
      if (score !== 'N' && feedback !== null) {
        setAlreadyGraded(true); // Set state to indicate that the test has already been graded
      } else {
        setAlreadyGraded(false); // Reset state if the test has not been graded
      }
      setHasGrade(score !== 'N'); // Set state to indicate if there is a grade
      setHasFeedback(feedback !== null); // Set state to indicate if there is feedback
    } catch (error) {
      console.error('Error fetching applicant answers or assessment info:', error);
      setError(error.message);
      // Reset selectedApplicantAnswers state in case of error
      setSelectedApplicantAnswers([]);
    }
  };
  
  
  return (
    <Sidebar1>
    <div className={classes.formcontainer}>
      {/* Render questions and their answers */}
      {questions && questions.map((question, index) => (
        <div key={index} className='question-container'>
          <p className='test-name'><b>{index + 1}. {question.text}</b></p>
          {/* Check question type */}
          {question.type === 'multiple' || question.type === 'single' ? (
            <ol className='green-list'>
              {/* Split choices into an array and map over them */}
              {question.choices.split(',').map((choice, choiceIndex) => (
                <li key={choiceIndex}>{choice}</li>
              ))}
            </ol>
          ) : (
            /* Render choices as plain text if not multiple or single */
            <p>{question.choices}</p>
          )}
          <p className='test-duration'><b>Correct Answer:</b></p> {/* Display answer */}
          <p> {question.correctAnswer}</p>
        </div>
      ))}

      {/* Display applicants' names */}
      <div className={classes.applicantscontainer}>
        <h3>Applicants Who Completed the Test</h3>
        {applicants.length === 0 ? (
          <p className={classes.noOneTookTheTest}>No applicants have completed the test yet.</p>
        ) : (
          applicants.map(applicant => (
            <button key={applicant.applicant_id} className={classes.button1} onClick={() => handleApplicantClick(applicant.applicant_id)}>
              {applicant.first_name} <br></br> {applicant.last_name}
            </button>
          ))
        )}
      </div>


      {/* Render the pop-up if showPopUp state is true */}
      {showPopUp && (
        <div className={classes.popup}>
          <div className={classes.popupContent}>
            <button className={classes.closeButton} onClick={handleClosePopUp}>X</button>
            <h2>Questions and Answers</h2>
            {/* Display questions and answers for the selected applicant */}
            {selectedApplicantAnswers && selectedApplicantAnswers.map((answer, index) => (
              <div key={index}>
                <p><b className={classes.testname}>Question:</b> {answer.text}</p>
                <p><b className={classes.testduration}>Answer:</b> {answer.answers}</p>
              </div>
            ))}

            {hasGrade && !hasFeedback && (
              <p>You have already graded this test, but feedback has not been provided.</p>
            )}
            {!hasGrade && hasFeedback && (
              <p>Feedback has already been provided for this test, but a grade has not been assigned.</p>
            )}
            {hasGrade && hasFeedback && (
              <p>You have already graded this test and provided feedback.</p>
            )}

            <div>
                  {/* Input for score */}
                  <label><b className={classes.label1}> Score:</b></label>
                  <input
                    className={classes.input1}
                    placeholder='A+'
                    type='text'
                    name='score'
                    value={score}
                    onChange={(e) => setScore(e.target.value)} // Update score state
                  />
                    <button className={classes.btn} onClick={handleSubmitScore}>
                    <span className={classes.btntextone}>Submit</span>
                    <span className={classes.btntexttwo}>Done!</span>
                  </button>
            </div>

            <br></br>

            <div>
                {/* Input for feedback */}
                <label><b className={classes.label1}> Assessment Feedback:</b></label>
                <textarea
                  className={classes.input2}
                  type='text'
                  name='assessmentfeedback'
                  cols={20}
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)} // Update feedback state
                />
                <button className={classes.btn} onClick={handleSubmitFeedback}>
                  <span className={classes.btntextone}>Submit</span>
                  <span className={classes.btntexttwo}>Done!</span>
                </button>
            </div>


          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p>Error: {error}</p>}
    </div>
    </Sidebar1>
  );
}

export default AssessmentCorrectionPage;
