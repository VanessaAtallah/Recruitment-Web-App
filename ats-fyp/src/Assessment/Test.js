import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './assessment.css';
import { jwtDecode } from "jwt-decode";

const TestDetailsPage = ({ jobId, onClose }) => {
    console.log('Received Job ID:', jobId); // Log the received jobId for debugging
    const [questions, setQuestions] = useState([]); // State to store questions
    const [userAnswers, setUserAnswers] = useState({}); // State to store user answers
    const [testDetails, setTestDetails] = useState({}); // State to store test details
    const [assessmentId, setAssessmentId] = useState(null); // State to store assessment ID
    const [timeLeft, setTimeLeft] = useState(null); // State to store time left for the test
    const [isTestSubmitted, setIsTestSubmitted] = useState(false); // State to track if test is submitted

    // Fetch questions and test details when component mounts or jobId changes
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                console.log('Fetching questions for Job ID:', jobId); // Log fetching action for debugging
                const response = await axios.get(`http://localhost:8800/questions?job_id1=${jobId}`);
                setQuestions(response.data.questions); // Set fetched questions to state
                setTestDetails(response.data.testDetails); // Set fetched test details to state

                // Convert MySQL TIME format to seconds
                const durationParts = response.data.testDetails.test_duration.split(':');
                const durationInSeconds = (parseInt(durationParts[0]) * 3600) + (parseInt(durationParts[1]) * 60) + parseInt(durationParts[2]);
                setTimeLeft(durationInSeconds); // Set time left for the test

                setAssessmentId(response.data.assessmentId); // Set assessment ID
                console.log('response: ', response); // Log response for debugging
            } catch (error) {
                console.error('Failed to fetch questions:', error); // Log error if fetching fails
            }
        };

        fetchQuestions(); // Call the function to fetch questions
    }, [jobId]); // Dependency array ensures useEffect runs when jobId changes

    // Timer effect to handle countdown and auto-submit when time runs out
    useEffect(() => {
        if (timeLeft === 0 && !isTestSubmitted) {
            submitAnswers(); // Auto-submit answers when time runs out
        } else if (timeLeft > 0 && !isTestSubmitted) {
            const timer = setTimeout(() => {
                setTimeLeft(prevTimeLeft => prevTimeLeft - 1); // Decrease time left by 1 second
            }, 1000);
            return () => clearTimeout(timer); // Clear the timer on cleanup
        }
    }, [timeLeft, isTestSubmitted]); // Dependencies ensure effect runs when timeLeft or isTestSubmitted changes

    console.log('Questions:', questions); // Log questions for debugging
    console.log('User Answers:', userAnswers); // Log user answers for debugging
    console.log('Test Details:', testDetails); // Log test details for debugging

    // Function to render appropriate input based on question type
    const renderInput = (question, choice, choiceIndex) => {
        if (question.type === 'single') { // For single choice questions
            return (
                <div key={choiceIndex}>
                    <input type="radio" checked={userAnswers[question.question_id] === choice}
                        onChange={() => handleAnswerChange(question.question_id, choice)} />
                    <span>{choice}</span>
                </div>
            );
        } else if (question.type === 'multiple') { // For multiple choice questions
            return (
                <div key={choiceIndex}>
                    <input type="checkbox" checked={userAnswers[question.question_id]?.includes(choice)}
                        onChange={() => handleMultipleChoiceAnswerChange(question.question_id, choice)} />
                    <span>{choice}</span>
                </div>
            );
        } else { // For text input questions
            return (
                <div key={choiceIndex}>
                    <textarea
                        value={userAnswers[question.question_id] || ''}
                        onChange={(e) => handleTextAnswerChange(question.question_id, e.target.value)}
                    />
                </div>
            );
        }
    };

    // Handle change for single choice questions
    const handleAnswerChange = (questionId, selectedAnswer) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedAnswer
        }));
    };

    // Handle change for text input questions
    const handleTextAnswerChange = (questionId, textAnswer) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: textAnswer
        }));
    };
// Handle change for multiple choice questions
const handleMultipleChoiceAnswerChange = (questionId, selectedChoice) => {
    // Update userAnswers state based on the selected choice
    setUserAnswers(prevAnswers => ({
        ...prevAnswers, // Preserve previous answers
        [questionId]: prevAnswers[questionId]?.includes(selectedChoice) // Check if selected choice is already included
            ? prevAnswers[questionId].filter(choice => choice !== selectedChoice) // If selected choice is included, remove it
            : [...(prevAnswers[questionId] || []), selectedChoice] // If selected choice is not included, add it to the array
    }));
};


    // Function to submit answers to the server
    const submitAnswers = async () => {
        try {
            // Get the applicant_assessment_id from the endpoint
            const response = await axios.get(`http://localhost:8800/get-appassessment-id`);
            const applicantAssessmentId = response.data[0].applicant_assessment_id;

            // Serialize answers with the obtained applicant_assessment_id
           // Serialize user answers for submission
       const serializedAnswers = Object.entries(userAnswers).map(([questionId, answer]) => ({
    questionId, // Assign the question ID to the 'questionId' property
    answer: Array.isArray(answer) ? answer.join(',') : answer, // Convert array answers to comma-separated strings
    applicantAssessmentId // Assign the applicant assessment ID to the 'applicantAssessmentId' property
}));

            // Insert answers into the database
            await axios.post('http://localhost:8800/insert-answers', { answers: serializedAnswers });
            setIsTestSubmitted(true); // Mark test as submitted
            alert('Answers submitted successfully');
            onClose(); // Close the popup
        } catch (error) {
            alert('Failed to submit answers');
            console.error('Error submitting answers:', error);
        }
    };

    return (
        <div className='form-container'>
            <h2 className='test-name'>Test name: {testDetails.test_name || 'Loading...'}</h2>
            <h3 className='test-duration'>This test will close in {timeLeft} seconds</h3>
            <h4 className='test-duration'>Do not close this pop-up before submitting your answers. If you do, the test will be considered as completed.</h4>
            {questions && questions.map((question, index) => (
                <div key={index} className='question-container'>
                    <p><b>{index + 1}. {question.text}</b></p>
                    {question.choices.map((choice, choiceIndex) => (
                        <div key={choiceIndex}>
                            {renderInput(question, choice, choiceIndex)}
                        </div>
                    ))}
                </div>
            ))}
            <button className='create-test' onClick={() => submitAnswers()}>Submit Answers</button>
        </div>
    );
};

export default TestDetailsPage;
