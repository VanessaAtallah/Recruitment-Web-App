import React, { useState } from 'react';
import './assessment.css';
import { FaPlus, FaTimes } from 'react-icons/fa'; // Importing icons for UI
import axios from 'axios'; // Importing Axios for HTTP requests
import { Link } from 'react-router-dom'; // Importing Link for navigation

const TestForm = (props) => {
    // State variables for test name, duration, and questions
    const [testName, setTestName] = useState('');
    const [duration, setDuration] = useState('');
    const [questions, setQuestions] = useState([]);

    // Function to handle submission of the form
    const handleClick = () => {
        handleSubmit();
    };

    // Function to add a new question to the form
    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { text: '', type: 'single', choices: [''], correctAnswer: [] }
        ]);
    };

    // Function to handle changes in question fields
    const handleQuestionChange = (index, field, value) => {
    // Create a copy of the questions array
    const newQuestions = [...questions];
    // Update the specified field of the question at the given index
    newQuestions[index][field] = value;
    // Update the state with the modified questions array
    setQuestions(newQuestions);
};


    // Function to handle changes to a choice in a multiple choice question
const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    // Create a copy of the questions array
    const newQuestions = [...questions];
    // Update the value of the specified choice in the copied array
    newQuestions[questionIndex].choices[choiceIndex] = value;
    // Update the state with the modified questions array
    setQuestions(newQuestions);
};


   // Function to add a new choice to a multiple choice question
const handleAddChoice = (questionIndex) => {
    // Create a copy of the questions array
    const newQuestions = [...questions];
    // Add an empty string as a new choice to the specified question in the copied array
    newQuestions[questionIndex].choices.push('');
    // Update the state with the modified questions array
    setQuestions(newQuestions);
};


   // Function to remove a choice from a multiple choice question
const handleRemoveChoice = (questionIndex, choiceIndex) => {
    // Create a copy of the questions array
    const newQuestions = [...questions];
    // Remove the choice at the specified index from the choices array of the specified question in the copied array
    newQuestions[questionIndex].choices.splice(choiceIndex, 1);
    // Update the state with the modified questions array
    setQuestions(newQuestions);
};


   // Function to handle changes to correct answers in multiple choice questions
const handleCorrectAnswerChange = (questionIndex, choiceIndex) => {
    // Create a copy of the questions array
    const newQuestions = [...questions];
    // Retrieve the question object at the specified index
    const question = newQuestions[questionIndex];
    // Retrieve the selected choice
    const choice = question.choices[choiceIndex];

    // Check the type of the question
    if (question.type === 'single') {
        // If it's a single choice question, replace the correct answer with the selected choice
        question.correctAnswer = [choice];
    } else {
        // If it's a multiple choice question
        const correctIndex = question.correctAnswer.indexOf(choice);
        if (correctIndex === -1) {
            // If the selected choice is not already in the correct answer array, add it
            question.correctAnswer.push(choice);
        } else {
            // If the selected choice is already in the correct answer array, remove it
            question.correctAnswer.splice(correctIndex, 1);
        }
    }

    // Update the state with the modified questions array
    setQuestions(newQuestions);
};

    // Function to remove a question from the form
const handleRemoveQuestion = (questionIndex) => {
    // Create a copy of the questions array
    const newQuestions = [...questions];
    // Remove the question at the specified index
    newQuestions.splice(questionIndex, 1); // splice method is used to remove elements from an array.
    // It takes two parameters: 
    //the starting index from which to remove elements and the number of elements to remove.
    // Update the state with the new questions array
    setQuestions(newQuestions);
};


    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            // Send test data to backend API
            const testResponse = await axios.post('http://localhost:8800/assessments', {
                test_name: testName,
                test_duration: duration,
                job_id1: props.jobId // Include the job ID in the request
            });
            const assessment_id = testResponse.data.id;

            // Send question data to backend API
            const questionData = questions.map((question) => ({
                text: question.text,
                type: question.type,
                choices: question.choices,
                correctAnswer: question.type === 'multiple' ? question.correctAnswer.join(',') : question.correctAnswer,
            }));
            await axios.post('http://localhost:8800/questions', {assessment_id, questionData });
        } catch (error) {
            // Handle error
            alert('Failed to create test');
            console.log(error);
        }
    };

    return (
        <div className="form-container" >
            {/* Input fields for test name and duration */}
            <label> Test Name: <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} /> </label>
            <label> Duration (in minutes): <input type="text" pattern='[0-9]{2}:[0-5][0-9]' value={duration} onChange={(e) => setDuration(e.target.value)} /> </label>
            {/* Mapping through questions to render question inputs */}
            {questions.map((question, index) => (
                <div key={index} className="question-container">
                    {/* Button to remove a question */}
                    <button className='remove-question' type="button" onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
                    <label> Question {index + 1}:
                        {/* Input field for question text */}
                        <input type="text" value={question.text} onChange={(e) => handleQuestionChange(index, 'text', e.target.value)} />
</label>
<label> Type:
    {/* Dropdown menu to select question type */}
    <select value={question.type} onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}>
        <option value="single">Single Choice</option>
        <option value="multiple">Multiple Choice</option>
        <option value="text">Text</option>
    </select>
</label>
{/* Rendering choices for multiple choice questions */}
{question.type !== 'text' ? (
    question.choices.map((choice, choiceIndex) => (
        <div key={choiceIndex}>
            {/* Radio or checkbox input for choices */}
            <input type={question.type === 'single' ? 'radio' : 'checkbox'} name={`question${index}`} checked={question.correctAnswer.includes(choice)} onChange={() => handleCorrectAnswerChange(index, choiceIndex)} />
            {/* Input field for choice text */}
            <input type="text" value={choice} onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)} />
            {/* Button to remove a choice */}
            {question.choices.length > 1 && (
                <button className='remove-choice' type="button" onClick={() => handleRemoveChoice(index, choiceIndex)}><FaTimes /></button>
            )}
        </div>
    ))
) : (
    // Textarea for text-based question
    <div>
        <textarea value={question.correctAnswer} onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}/>
    </div>
)}
{/* Button to add a choice */}
{question.type !== 'text' && (
    <button className='add-choice' type="button" onClick={() => handleAddChoice(index)}><FaPlus /></button>
)}
</div>
))}
{/* Button to add a new question */}
<br></br>
<button className='add-question' type="button" onClick={handleAddQuestion}>Add Question</button><br></br><br></br>
{/* Link to navigate to all assessments page */}
<div>
<Link to="/AllAssessments" onClick={handleClick}><button className='create-test'>Create Test</button></Link>
</div>
</div>
);
};

export default TestForm;
