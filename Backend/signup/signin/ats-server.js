// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pdfParse = require('pdf-parse');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const pdf = require('pdf-parse');
const multer = require('multer');
const request = require('request');

// Create an Express application
const app = express();
app.use(cors());
app.use(express.json());

// Set the port for the server to listen on
const port = 8800;

// Use the body-parser middleware to parse JSON data in requests
app.use(bodyParser.json());

// Database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vanessa123',
  database: 'fypats',
  port: 3307
});

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Connect to the database
db.connect((err) => {
  if (err) {
    // Log an error if the database connection fails
    console.error('Database connection failed:', err.message);
  } else {
    // Log a success message if connected to the database
    console.log('Connected to the database');
  }
});

app.use(fileUpload());
app.use('/', express.static('public'));


// New endpoint for fetching all jobs
app.get('/allJobs', (req, res) => {
  const selectJobsQuery = 'SELECT *, IF(app_deadline < NOW(), "closed", job_status) AS job_status FROM job ORDER BY job_id DESC';
  db.query(selectJobsQuery, (err, result) => {
      if (err) {
          console.error('Error fetching jobs:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(result);
      }
  });
});

// New endpoint for updating job status based on app deadline
app.put('/updateJobStatus', (req, res) => {
  const updateJobStatusQuery = 'UPDATE job SET job_status = "closed" WHERE app_deadline < NOW() AND job_status != "closed"';
  db.query(updateJobStatusQuery, (err, result) => {
      if (err) {
          console.error('Error updating job status:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json({ message: 'Job statuses updated successfully' });
      }
  });
});


// Route to handle recruiter sign-in
app.post('/recsignin', (req, res) => {
  const { email, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET || '093ae12f-8108-4e11-bfb4-191838b3f60f'; 
  console.log('Received sign in request for email:', email); // Add this line
  const selectUserQuery = 'SELECT * FROM recruiter WHERE email = ?';
  db.query(selectUserQuery, [email], (err, result) => {
    if (err) {
      console.log('User login failed:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const { id, email: userEmail, password: hashedPassword } = result[0];
      bcrypt.compare(password, hashedPassword, (err, passwordMatch) => {
        if (err) {
          console.error('Password comparison failed:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (!passwordMatch) {
          res.status(401).json({ error: 'Invalid credentials' });
        } else {

          //console.log('User logged in successfully:', email); // Add this line
          //res.json({ id, email: userEmail });

          const recruiterId = result[0].recruiter_id;
          const token = jwt.sign({ id: recruiterId }, jwtSecret,{expiresIn:'1h'}); // Generate JWT token
          console.log('User logged in successfully:', recruiterId); // Add this line
          res.json({Login: true, token, result }); // Send the token back to the client side

        }
      });
    }
  });
});


//ApplicantRegister
app.post('/appsignup', (req, res) =>{
    //Extracting data from the request body
    const{ firstname,lastname,date,email,password,address, phonenumber,gender} = req.body;
    //Check if the user already exists
    const checkUserquery ="SELECT * FROM applicant WHERE email = ? ";
    db.query(checkUserquery, [email], (err,result) =>{
        if(err){
            //error in the query
            console.error('User registration failed:', err);
            res.status(500).json({error: 'Internal Server Error in email'});
        }else if(result.length>0){
            //User already exists
            //if there is at least one row in the result, it means the user with 
      //the provided email already exists.
      res.status(401).json({error:'email already taken'});
        }else{
            //user does not exist, proceed with registration
            bcrypt.hash(password, 10,(hashErr,hash) =>{
                if(hashErr){
                    console.error('Password hashing failed:', hashErr);
                    res.status(500).json({error: 'Internal Server Error hashing'});
                }else{
                    const insertUserQuery = 'INSERT INTO applicant(first_name,last_name,date_of_birth,email,password,address,phone_number, gender) VALUES (?,?,?,?,?,?,?,?)';
                    db.query(insertUserQuery,[ firstname,lastname,date,email,hash,address,phonenumber,gender],(insertErr) =>{
                        if(insertErr){
                            console.error('User registration failed:',insertErr);
                            res.status(500).json({error:'Internal Server Error'});
                        }else{
                            res.status(201).json({message: 'User registered successfully'});
                        }
                    })
                }
            })
        }
    })
})




app.post('/addjob', async (req, res) => {
  // Extracting data from the request body
  const {jobcategory, jobtitle, companyname, jobfunction, emptype, arrangment, edlevel, languages, skills, explevel, location, minsalary, maxsalary, saltype, benefits, appdeadline, logo, additionalReq, steps, recId } = req.body;

  // Concatenate minsalary and maxsalary into a single string
  const salaryRange = `${minsalary}-${maxsalary}`;

  // Your SQL query to insert job data into the database
  const insertUserQuery0 = 'INSERT INTO job(job_category, job_title, company_name, job_function, employment_type, work_arrangement, education_level, languages, required_skills, experience_level, job_location, salary_range, salary_type, benefits, posting_date, app_deadline, logo, additional_requirements, steps, recruiter_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

// Get the current date and time
const formattedPostingDate = new Date()
    // Convert the date to an ISO string format
    .toISOString()
    // Extract the first 19 characters to get 'YYYY-MM-DDTHH:MM:SS'
    .slice(0, 19)
    // Replace the 'T' separator with a space to format as 'YYYY-MM-DD HH:MM:SS'
    .replace('T', ' ');
 
await db.query(insertUserQuery0, [jobcategory, jobtitle, companyname, jobfunction, emptype, arrangment, edlevel, languages, skills, explevel, location, salaryRange, saltype, benefits, formattedPostingDate, appdeadline, logo, additionalReq, steps, recId], (insertErr, result) => {

    if (insertErr) {
      console.error('Job creation failed:', insertErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {

      res.status(201).json({ message: 'Job created successfully', result });
    }
  });
});



        
// Fetch single job route
app.get('/getjob/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const getJobQuery = 'SELECT * FROM job WHERE job_id = ?'; 
  db.query(getJobQuery, [jobId], (err, result) => {
      if (err) {
          console.error('Error fetching job:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          if (result.length > 0) {
              res.status(200).json(result[0]); // Assuming result is an array with a single job object
          } else {
              res.status(404).json({ error: 'Job not found' });
          }
      }
  });
});


app.delete('/deletejob/:jobId', (req, res) => {
  const jobId = req.params.jobId;

  // First, delete associated submissions
  const deleteSubmissionsQuery = 'DELETE FROM submission WHERE job_id=?';
  db.query(deleteSubmissionsQuery, [jobId], (err, result) => {
    if (err) {
      console.error('Error deleting submissions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // After deleting submissions, delete associated interviews
    const deleteInterviewsQuery = 'DELETE FROM interview WHERE job_id2=?';
    db.query(deleteInterviewsQuery, [jobId], (err, result) => {
      if (err) {
        console.error('Error deleting interviews:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      

        // After deleting questions, delete associated answers
        const deleteAnswersQuery = 'DELETE FROM applicant_answers WHERE question_id IN (SELECT question_id FROM questions WHERE assessment_id IN (SELECT assessment_id FROM assessments WHERE job_id1=?))';
        db.query(deleteAnswersQuery, [jobId], (err, result) => {
          if (err) {
            console.error('Error deleting answers:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          // After deleting interviews, delete associated questions
      const deleteQuestionsQuery = 'DELETE FROM questions WHERE assessment_id IN (SELECT assessment_id FROM assessments WHERE job_id1=?)';
      db.query(deleteQuestionsQuery, [jobId], (err, result) => {
        if (err) {
          console.error('Error deleting questions:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }


        const deleteApplicantAssessmentQuery = 'DELETE FROM applicant_assessments WHERE assessment_id3 IN (SELECT assessment_id FROM assessments WHERE job_id1=?)';
        db.query(deleteApplicantAssessmentQuery, [jobId], (err, result) => {
          if (err) {
            console.error('Error deleting questions:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
          

          // After deleting answers, delete associated assessments
          const deleteAssessmentsQuery = 'DELETE FROM assessments WHERE job_id1=?';
          db.query(deleteAssessmentsQuery, [jobId], (err, result) => {
            if (err) {
              console.error('Error deleting assessments:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            // After deleting assessments, proceed to delete the job
            const deleteJobQuery = 'DELETE FROM job WHERE job_id=?';
            db.query(deleteJobQuery, [jobId], (err, result) => {
              if (err) {
                console.error('Error deleting job:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
              }

              if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Job deleted successfully' });
              } else {
                res.status(404).json({ error: 'Job not found' });
              }
            });
          });
          });
        });
      });
    });
  });
});


app.put('/updatejob/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const {
    job_title,
    company_name,
    job_function,
    employment_type,
    work_arrangement,
    education_level,
    languages,
    required_skills,
    experience_level,
    job_location,
    salary_range,
    salary_type,
    benefits,
    app_deadline,
    logo,
    steps,
    job_status,
    additional_requirements
  } = req.body;

  // Construct the updatedJobData object
  const updatedJobData = {
    job_title,
    company_name,
    job_function,
    employment_type,
    work_arrangement,
    education_level,
    languages,
    required_skills,
    experience_level,
    job_location,
    salary_range,
    salary_type,
    benefits,
    app_deadline,
    logo,
    steps,
    job_status,
    additional_requirements
  };

  // Your SQL query to update the job data in the database
  const updateJobQuery = `UPDATE job SET ? WHERE job_id = ?`;

  // Execute the SQL query
  db.query(updateJobQuery, [updatedJobData, jobId], (err, result) => {
    if (err) {
      console.error('Error updating job:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // After updating the job details, also update the job status
      const updateJobStatusQuery = 'UPDATE job SET job_status = CASE WHEN app_deadline < NOW() THEN "closed" ELSE "active" END WHERE job_id = ?';
      db.query(updateJobStatusQuery, [jobId], (statusErr, statusResult) => {
        if (statusErr) {
          console.error('Error updating job status:', statusErr);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'Job updated successfully' });
        }
      });
    }
  });
});


app.get('/checkAssessmentPresence/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const checkAssessmentQuery = `SELECT * FROM assessments WHERE job_id1 = ?`;
  db.query(checkAssessmentQuery, [jobId], (err, result) => {
      if (err) {
          console.error('Error checking assessment:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(result);
      }
  });
});


//Get applicants related to the signed in recruiter (and group them by the job title) so he can schedule them interviews

app.get('/api/applications', (req, res) => {
  const recruiter_id = req.query.recruiter_id;
  console.log(recruiter_id);
  try {


    const getApplicationsQuery = `SELECT submission.submission_id, submission.applicant_name, submission.applicant_id, job.job_id, job.job_title, job.steps, submission.status FROM submission JOIN job ON submission.job_id = job.job_id WHERE job.recruiter_id = ? AND submission.status = 'accepted'; `;


    db.query(getApplicationsQuery, [recruiter_id], (err, result) => {
      if (err) {
        console.error('Error fetching applicants:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      console.log(result);
      console.log('success');
      res.json(result);
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/scheduled-interviews', async (req, res) => {
  const { recruiter_id } = req.query;
  try {
    const getScheduledInterviewsQuery = `SELECT interview.interview_id, interview.interview_date, interview.interview_format, interview.interview_requirements, submission.applicant_name, job.job_title FROM interview JOIN submission ON interview.applicant_id2 = submission.applicant_id JOIN job ON interview.job_id2 = job.job_id WHERE job.recruiter_id = ? GROUP BY interview.interview_id, interview.interview_date, interview.interview_format, interview.interview_requirements, submission.applicant_name, job.job_title`;

    await db.query(getScheduledInterviewsQuery, [recruiter_id], (err, result) => {
      if (err) {
        console.error('Error fetching scheduled interviews:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        console.log('Interviews:', result);
        res.json(result);
      }
    });
  } catch (error) {
    console.error('Error fetching scheduled interviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/interviews', async (req, res) => {
  const { interviewDate, format, requirements, applicantId, jobId } = req.body;
  const insertInterviewQuery = 'INSERT INTO interview (interview_date, interview_format, interview_requirements, applicant_id2, job_id2) VALUES (?, ?, ?, ?, ?)';
  db.query(insertInterviewQuery, [interviewDate, format, requirements, applicantId, jobId], async (err, result) => {
    if (err) {
      console.error('Error inserting interview:', err);
      res.status(500).json({ message: 'Internal Server Error' });

    } else {
      // Fetch the applicant name from the database
      const getApplicantNameQuery = 'SELECT applicant_name FROM submission WHERE applicant_id = ?';
      db.query(getApplicantNameQuery, [applicantId], (err, applicantResult) => {
        if (err) {
          console.error('Error fetching applicant name:', err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const applicantName = applicantResult[0].applicant_name;
          // Include the applicant name in the response
          res.status(200).json({ message: 'Interview scheduled successfully', applicantName });
        }
      });
    }
  });
});


app.delete('/api/delete-interview/:interviewId', (req, res) => {
  const interviewId = req.params.interviewId;
  try {
    const deleteInterviewQuery = 'DELETE FROM interview WHERE interview_id = ?';
    db.query(deleteInterviewQuery, [interviewId], (err, result) => {
      if (err) {
        console.error('Error deleting interview:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        console.log('Interview deleted successfully');
        res.status(200).json({ message: 'Interview deleted successfully' });
      }
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update interview feedback route
app.put('/api/update-interview-feedback/:interviewId', (req, res) => {
  const { interviewId } = req.params;
  const { feedback } = req.body;

  db.query(
    'UPDATE interview SET interview_feedback = ? WHERE interview_id = ?',
    [feedback, interviewId],
    (error, results) => {
      if (error) {
        console.error('Error updating interview feedback:', error);
        res.status(500).json({ error: 'An error occurred while updating interview feedback' });
        return;
      }
      res.status(200).json({ message: 'Interview feedback updated successfully' });
    }
  );
});


// Update interview status to 'done' if interview end time has passed
app.put('/api/update-interview-status/:interviewId', (req, res) => {
  const { interviewId } = req.params;

        db.query(
          'UPDATE interview SET interview_status = ? WHERE interview_id = ?',
          ['done', interviewId],
          (error, results) => {
            if (error) {
              console.error('Error updating interview status:', error);
              res.status(500).json({ error: 'An error occurred while updating interview status' });
              return;
            }
            res.status(200).json({ message: 'Interview status updated to "done" successfully' });
          }
        );
});

// get interview status to display it
app.get('/api/interview-status/:interviewId', (req, res) => {
  const { interviewId } = req.params;

  // Query the database to get the status for the interview with the given ID
  db.query(
      'SELECT interview_status FROM interview WHERE interview_id = ?',
      [interviewId],
      (error, results) => {
          if (error) {
              console.error('Error fetching interview status:', error);
              res.status(500).json({ error: 'An error occurred while fetching interview status' });
              return;
          }

          if (results.length === 0) {
              res.status(404).json({ error: 'Interview not found' });
              return;
          }

          // Return the status as a JSON response
          res.status(200).json({ interview_status: results[0].interview_status });
      }
  );
});



// Resume and Cover Letter submission route
app.post('/submit', async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    console.log('Incoming request files:', req.files);

    let coverLetterText = '';

    // Check if coverLetter file is uploaded
    if (req.files && req.files.coverLetter) {
      const coverLetterFile = req.files.coverLetter.data;
      console.log('Cover letter data:', coverLetterFile);

      // Use pdf-parse library to extract text from the PDF data
      const data = await pdf(coverLetterFile);
      coverLetterText = data.text;
    }

    // Extract other relevant data from the request body
    const { image, appname, position, profsummary, university, educationyear, degree, workExperience, expdate, yearsofexp, workexpdetails, references, github, phoneNumber, email, address, birthdate, links, linkedin, skills, year, award, year1, certification, hobbies, languages, status, appId, jobId } = req.body;

    // Extract array inputs
    const universities = Object.keys(req.body)
      .filter(key => key.indexOf('university[') === 0)
      .map(key => req.body[key]);

    const educationYears = Object.keys(req.body)
      .filter(key => key.indexOf('educationyear[') === 0)
      .map(key => req.body[key]);

    const degrees = Object.keys(req.body)
      .filter(key => key.indexOf('degree[') === 0)
      .map(key => req.body[key]);

    const company = Object.keys(req.body)
      .filter(key => key.indexOf('company[') === 0)
      .map(key => req.body[key]);

    const dates = Object.keys(req.body)
      .filter(key => key.indexOf('dates[') === 0)
      .map(key => req.body[key]);

  // Extracting all keys from the request body
const workposition = Object.keys(req.body)
// Filtering keys that start with 'position['
.filter(key => key.indexOf('position[') === 0)
// Mapping filtered keys to their corresponding values in the request body
.map(key => req.body[key]);


    const responsibilities = Object.keys(req.body)
      .filter(key => key.indexOf('responsibilities[') === 0)
      .map(key => req.body[key]);

    const reference = Object.keys(req.body)
      .filter(key => key.indexOf('references[') === 0)
      .map(key => req.body[key]);

    const skill = Object.keys(req.body)
      .filter(key => key.indexOf('skill[') === 0)
      .map(key => req.body[key]);

  const hobby = Object.keys(req.body)
  .filter(key => key.indexOf('hobbies[') === 0)
  .map(key => req.body[key]);

    const language = Object.keys(req.body)
      .filter(key => key.indexOf('languages[') === 0)
      .map(key => req.body[key]);

    const awardyear = Object.keys(req.body)
      .filter(key => key.indexOf('year[') === 0)
      .map(key => req.body[key]);

    const award1 = Object.keys(req.body)
      .filter(key => key.startsWith('award['))
      .map(key => req.body[key]);

    const certyear = Object.keys(req.body)
      .filter(key => key.startsWith('year1['))
      .map(key => req.body[key]);

    const cert = Object.keys(req.body)
      .filter(key => key.startsWith('certification['))
      .map(key => req.body[key]);

    const jwtSecret = process.env.JWT_SECRET || '093ae12f-8608-4e11-bfb4-191838b3f60f';
    const concatenatedAward = `${awardyear.join(', ')} - ${award1.join(', ')}`;
    const concatenatedCert = `${certyear.join(', ')} - ${cert.join(', ')}`;

    const defaultStatus = 'on hold';
    const insertResumeQuery = 'INSERT INTO submission(image, applicant_name, app_position, professional_name, university, education_year, degree, work_exp, exp_date, years_of_exp, work_exp_details, work_references, github, phone_number, email, address, date_of_birth, links, linkedin, skills, awards, certifications, hobbies, languages, coverLetter, status, applicant_id, job_id, matched_words) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Fetch job details based on jobId
    const jobDetailsQuery = 'SELECT job_title, job_function, education_level, languages, required_skills, experience_level, job_location, additional_requirements FROM job WHERE job_id = ?';
    db.query(jobDetailsQuery, [jobId], (err, results) => {
      if (err) {
        console.error('Error fetching job details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const jobDetails = results[0];

        let jobText = `${jobDetails.job_title} ${jobDetails.job_function} ${jobDetails.education_level} ${jobDetails.languages} ${jobDetails.experience_level} ${jobDetails.additional_requirements} ${jobDetails.required_skills} ${jobDetails.job_location}`;

        let resumeText = `${position} ${profsummary} ${degree} ${workExperience} ${yearsofexp} ${workexpdetails} ${skills} ${award} ${certification} ${hobbies} ${languages}`;
        const commonWordsToIgnore = ['and', 'the', 'of', 'to', 'with', 'from', 'is', 'are', 'it', 'a', 'an', 'but', 'or', 'nor', 'at', 'by', 'for', 'in', 'into', 'on', 'onto', 'I', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'was', 'were', 'be', 'being', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'shall', 'should', 'will', 'would', 'may', 'might', 'must'];
        const commonCharactersToIgnore = ['-', ',', '.', ':', ';', '(', ')', '[', ']', '{', '}', '"', '\''];


        commonCharactersToIgnore.forEach(char => {
          // Replace all occurrences of a specified character (stored in the variable 'char') in the string 'jobText' with an empty string.
jobText = 
// Call the 'replace' method on the 'jobText' string.
jobText.replace(
    // Create a regular expression using the 'RegExp' constructor.
    new RegExp(
        // Escapes the character specified by 'char' so it is treated as a literal character in the regular expression.
        '\\' + char,
        // The 'g' flag ensures that the replacement is global (i.e., all occurrences are replaced, not just the first one).
        'g'
    ),
    // The replacement string is an empty string, effectively removing all occurrences of the specified character.
    ''
);
          resumeText = resumeText.replace(new RegExp('\\' + char, 'g'), '');
        });

        // Convert the resume text to lowercase and split it into words based on whitespace, then filter out common words to ignore
const resumeWords = resumeText.toLowerCase().split(/\s+/).filter(word => !commonWordsToIgnore.includes(word.toLowerCase()));

// Convert the job description text to lowercase and split it into words based on whitespace, then filter out common words to ignore
const jobWords = jobText.toLowerCase().split(/\s+/).filter(word => !commonWordsToIgnore.includes(word.toLowerCase()));

// Find the words that appear in both the resume and the job description by filtering resumeWords for words that are also in jobWords
const matchedWords = resumeWords.filter(word => jobWords.includes(word));

     // Extract skills from the job details
// Define a constant named 'jobSkills'.
const jobSkills = 
    // Access the 'required_skills' property of the 'jobDetails' object.
    jobDetails.required_skills
    // Convert the string to lowercase to ensure consistency.
    .toLowerCase()
    // Split the string into an array using ',' as the delimiter.
    .split(',')
    // Iterate through each element of the array.
    .map(
        // Trim any leading or trailing whitespace from each element.
        skill => skill.trim()
    );

const joblanguages = jobDetails.languages.toLowerCase().split(',').map(language => language.trim());
const jobhobbies = jobDetails.additional_requirements.toLowerCase().split(',').map(hobbies => hobbies.trim());
const jobawards = jobDetails.additional_requirements.toLowerCase().split(',').map(awards => awards.trim());
const jobcertification = jobDetails.additional_requirements.toLowerCase().split(',').map(certification => certification.trim());
const jobeducation = [jobDetails.additional_requirements, jobDetails.job_function, jobDetails.job_title, jobDetails.education_level].join(',').toLowerCase();
const jobexperience = [jobDetails.additional_requirements, jobDetails.job_function, jobDetails.job_title, jobDetails.education_level, jobDetails.work_arrangement, jobDetails.experience_level].join(',').toLowerCase();

        // Extract skills from the applicant's CV
        const applicantSkills = skill.join(',').toLowerCase().split(',').map(skill => skill.trim());
        const applicantlanguages = language.join(',').toLowerCase().split(',').map(language => language.trim());
        const applicanthobbies = hobby.join(',').toLowerCase().split(',').map(hobbies => hobbies.trim());
        const applicantcertification = cert.join(',').toLowerCase().split(',').map(certification => certification.trim());
        const applicantaward = award1.join(',').toLowerCase().split(',').map(awards => awards.trim());
        const applicanteducation = [universities, degrees, educationYears].join(',').toLowerCase().split(',').map(value => value.trim());
        const applicantexperience = [company, dates, workposition, responsibilities].join(',').toLowerCase().split(',').map(value1 => value1.trim());


        // Compare skills
       // Define a constant named 'matchedSkills'.
const matchedSkills = 
// Filter the 'applicantSkills' array.
applicantSkills.filter(
    // For each skill in the array, check if it exists in the 'jobSkills' array.
    skill => jobSkills.includes(skill)
);

        const matchedLanguages = applicantlanguages.filter(language=> joblanguages.includes(language));
        const matchedhobbies = applicanthobbies.filter(hobbies=> jobhobbies.includes(hobbies));
        const matchedawards = applicantaward.filter(awards=> jobawards.includes(awards));
        const matchedcertification = applicantcertification.filter(certification=> jobcertification.includes(certification));
        // Compare applicant's education with job requirements
        const matchedEducation = applicanteducation .filter(university => jobeducation.includes(university.toLowerCase()));

       // Compare applicant's experience with job requirements
        const matchedExperience = applicantexperience .filter(comp => jobexperience.includes(comp.toLowerCase()));
        // Update matched words count
        const matchedWordsCount = matchedWords.length + matchedSkills.length + matchedLanguages.length + matchedhobbies.length + matchedawards.length + matchedcertification.length + matchedEducation.filter(Boolean).length + matchedExperience.filter(Boolean).length;

        // Log matched words and skills
        console.log('Matched Words:', matchedWords);
        console.log('Matched Skills:', matchedSkills);
        console.log('Matched Languages:', matchedLanguages);
        console.log('Matched Hobbies:', matchedhobbies);
        console.log('Matched Awards:', matchedawards);
        console.log('Matched Certifications:', matchedcertification);
        console.log('Matched Education:', matchedEducation);
        console.log('Matched Experience:', matchedExperience);

      
        db.query(insertResumeQuery, [image, appname, position, profsummary, universities.join(','), educationYears.join(','), degrees.join(','), company.join(','), workposition.join(','), dates.join(','), responsibilities.join(','), reference.join(','), github, phoneNumber, email, address, birthdate, links, linkedin, skill.join(','), concatenatedAward, concatenatedCert, hobby.join(','), language.join(','), coverLetterText, defaultStatus, appId, jobId, matchedWordsCount], (insertErr, results) => {
          if (insertErr) {
            console.error('Add Resume failed:', insertErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log('Submission of application');
            res.status(200).json({ message: 'Application submitted successfully' });
          }
        });
      }
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Route to create a new test
app.post('/assessments', (req, res) => {
  const { test_name,test_duration, job_id1 } = req.body;
  const date = new Date();
  const test = { test_name, test_duration, job_id1 ,date };

  db.query('INSERT INTO assessments SET ?', test, (err, result) => {
      if (err) {
          console.error('Error creating test:', err);
          res.status(500).json({ error: 'Failed to create test' });
          return;
      }
      console.log(result);
      res.json({ id: result.insertId, result });
  });
});

// Route to create new questions
app.post('/questions', (req, res) => {
  const { assessment_id, questionData } = req.body;

  const questionValues = questionData.map((question) => [
    assessment_id,
    question.text,
    question.type,
    question.choices.join(','),
    question.correctAnswer,
]);
const insertQuestionsQuery = 'INSERT INTO questions (assessment_id, text, type, choices, correctAnswer) VALUES (?, ?, ?, ?, ?)';
questionValues.forEach((values) => {
    db.query(insertQuestionsQuery, values,
        (err, result) => {
            if (err) {
                console.error('Error creating questions:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
        }
    );
});

});

app.get('/questions', (req, res) => {
  const jobId = req.query.job_id1;
  console.log(jobId);
  if (!jobId) {
    res.status(400).json({ error: 'Job ID is required' });
    return;
  }

  db.query('SELECT * FROM assessments WHERE job_id1 = ?', jobId, (err, result) => {
    if (err) {
      console.error('Error fetching assessment details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    const assessmentId = result[0].assessment_id;
    db.query('SELECT * FROM questions WHERE assessment_id = ?', assessmentId, (err, result) => {
      if (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      const questions = result.map((question) => ({

        ...question,
        choices: question.choices.split(','), // Assuming choices are stored as a comma-separated string
        type: question.type // Make sure 'type' is a field in your questions table
      }));

      // Fetch test details from the assessments table
      db.query('SELECT test_name, test_duration, date FROM assessments WHERE assessment_id = ?', assessmentId, (err, testResult) => {

        if (err) {
          console.error('Error fetching test details:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        if (testResult.length === 0) {
          res.status(404).json({ error: 'Test details not found' });
          return;
        }

        const testDetails = testResult[0]; // Assuming test details are stored in a single row

        res.json({ questions: questions, testDetails: testDetails, assessmentId: assessmentId});
      });
    });
  });
});

// Route to insert into applicant_assessments
app.post('/insert-assessment', async (req, res) => {
  const { appId, assessmentId } = req.body;
  try {
      // Perform the insertion into applicant_assessments table
      const insertAssessmentQuery = 'INSERT INTO applicant_assessments (applicant_id3, completed, assessment_id3) VALUES (?, true, ?)';
      const insertAssessmentResult = await db.query(insertAssessmentQuery, [appId, assessmentId]);
      
      // Assuming the query returns the newly inserted applicant_assessment_id
      const applicantAssessmentId = insertAssessmentResult.insertId;

      res.json({ applicantAssessmentId });
  } catch (error) {
      console.error('Error inserting into applicant_assessments:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// Route to insert into applicant_answers
app.post('/insert-answers', async (req, res) => {
  const { answers} = req.body;
  try {
      // Perform the insertion into applicant_answers table
      const answerValues = answers.map((answer) => [
          answer.questionId,
          answer.answer,
          answer.applicantAssessmentId,
      ]);
      const insertAnswersQuery = 'INSERT INTO applicant_answers (question_id, answers, applicant_assessment_id) VALUES ?';
      await db.query(insertAnswersQuery, [answerValues]);

      res.json({ success: true });
  } catch (error) {
      console.error('Error inserting into applicant_answers:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/recsignup', (req, res) => {
  // Extracting data from the request body
  const { firstname, lastname, email, password, address, phonenumber, type, companyName } = req.body;

  // Check if the user already exists
  const checkUserquery = "SELECT * FROM recruiter WHERE email =? ";
  db.query(checkUserquery, [email], (err, result) => {
    if (err) {
      // Error in the query
      console.error('User registration failed:', err);
      res.status(500).json({ error: 'Internal Server Error in email' });
    } else if (result.length > 0) {
      // User already exists
      res.status(401).json({ error: 'email already taken' });
    } else {
      // User does not exist, proceed with registration
      bcrypt.hash(password, 10, (hashErr, hash) => {
        if (hashErr) {
          console.error('Password hashing failed:', hashErr);
          res.status(500).json({ error: 'Internal Server Error hashing' });
        } else {
          const insertUserQuery = 'INSERT INTO recruiter(first_name,last_name,email,password,address,phone_number,rec_type, company_name) VALUES (?,?,?,?,?,?,?,?)';
          db.query(insertUserQuery, [firstname, lastname, email, hash, address, phonenumber, type, companyName], (insertErr) => {
            if (insertErr) {
              console.error('User registration failed:', insertErr);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              // Generate JWT token
              const jwtSecret = process.env.JWT_SECRET || '093ae12f-8108-4e11-bfb4-191838b3f60f';
              const recruiterId = result.insertId;
              const token = jwt.sign({ id: recruiterId }, jwtSecret, { expiresIn: '1h' });

              // Send the token back to the client side
              res.status(201).json({ message: 'User registered successfully', token });
            }
          });
        }
      });
    }
  });
});
//appsignin
app.post('/appsignin', (req, res) => {
  const { email, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET || '093ae12f-8608-4e11-bfb4-191838b3f60f';
  console.log('Received sign in request for email:', email);
  const selectUserQuery = 'SELECT * FROM applicant WHERE email = ?';
  db.query(selectUserQuery, [email], async (err, result) => {
    if (err) {
      console.error('User login failed:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    } else {
      let { id, email: userEmail, password: hashedPassword } = result[0];
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      let appId = result[0].applicant_id;

      const token = jwt.sign({ id: appId }, jwtSecret, { expiresIn: '1h' });
      console.log('User logged in successfully: ', appId);
      res.json({ id: appId, email: userEmail, token }); // Sending response
    }
  });
});

// Define route to update applicant status
app.post('/updateStatus', (req, res) => {
  const { applicantId,jobId, status } = req.body;
  
  // Update status in the database based on applicantId
  db.query('UPDATE submission SET status = ? WHERE applicant_id = ? AND job_id = ?', [status, applicantId, jobId], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Status updated successfully' });
    }
  });
});


// Endpoint to fetch applicants for a specific job and rank them based on matched_words
app.get('/getapplicants/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const selectApplicantsQuery = 'SELECT s.*, a.* FROM submission s JOIN applicant a ON s.applicant_id = a.applicant_id WHERE s.job_id = ? ORDER BY s.matched_words DESC';
  
  db.query(selectApplicantsQuery, [jobId], (err, results) => {
      if (err) {
          console.error('Error fetching applicants:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.json(results);
      }
  });
});




app.get('/getcv/:submissionId', (req, res) => {
  const submissionId  = req.params.submissionId;
  const getJobQuery = 'SELECT * FROM submission WHERE submission_id = ?'; 
  db.query(getJobQuery, [submissionId], (err, result) => {
      if (err) {
          console.error('Error fetching CV:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          if (result.length > 0) {
              res.status(200).json(result[0]); // Assuming result is an array with a single job object
          } else {
              res.status(404).json({ error: 'CV not found' });
          }
      }
  });
});


app.get('/getrecruiterjobs', async (req,res) => {
  const recId = req.query.recruiter_id;
  console.log(recId);
  if (!recId) {
    return res.status(400).json({ error: 'Recruiter ID is required' });
  }
  const getApplicationsQuery = 'SELECT * FROM job WHERE recruiter_id = ?';
  await db.query(getApplicationsQuery, [recId], (err,result) => {
    if (err) {
      console.error('error getting your job postings:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'got your job postings', result });
    }
  });
});

app.get('/get-my-applications', async (req, res) => {
  const appId = req.query.applicant_id;
  console.log(appId);
  if (!appId) {
      return res.status(400).json({ error: 'Applicant ID is required' });
  }
  const getApplicationsQuery = `
  SELECT job.*, submission.status, assessments.test_duration
  FROM job
  JOIN submission ON job.job_id = submission.job_id
  LEFT JOIN assessments ON job.job_id = assessments.job_id1
  WHERE submission.applicant_id = ?
  `;
  await db.query(getApplicationsQuery, [appId], (err, result) => {
      if (err) {
          console.error('error getting your applications:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(201).json({ message: 'got your applications', result });
      }
  });
});





app.get('/getAssessment', async (req, res) => {
  const { recruiter_id } = req.query;
  try {
    const getAssessmentQuery = `SELECT assessments.*, job.job_title 
                                FROM assessments 
                                JOIN job ON assessments.job_id1 = job.job_id 
                                WHERE job.recruiter_id = ?`;

    await db.query(getAssessmentQuery, [recruiter_id], (err, result) => {
      if (err) {
        console.error('Error fetching assessments:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        console.log('Assessments:', result);
        res.json(result);
      }
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/getquestions/:assessmentId', (req, res) => {
  const assessmentId = req.params.assessmentId;
  const selectQuestionsQuery = `
    SELECT q.*, a.test_name 
    FROM questions q 
    INNER JOIN assessments a ON q.assessment_id = a.assessment_id
    WHERE q.assessment_id = ?
  `;

  db.query(selectQuestionsQuery, [assessmentId], (err, questionResults) => {
    if (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ questions: questionResults });
  });
});

/// Endpoint to get assessment_id from assessments table
app.get('/get-assessment-id/:jobId', async (req, res) => {
  // Extract jobId from the request parameters
  const jobId = req.params.jobId;

  // Query to count the number of records in the assessments table with the given job_id1
  const countQuery = 'SELECT COUNT(*) AS count FROM assessments WHERE job_id1 = ?';

  // Execute the count query
  db.query(countQuery, [jobId], (err, countResult) => {
    if (err) {
      // Log error and send 500 Internal Server Error response if there's an error during the query
      console.error('Error counting records:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Extract the count from the query result
      const count = countResult[0].count;
      if (count > 0) {
        // If count is greater than 0, proceed to select the assessment_id
        const selectAssessmentIdQuery = 'SELECT assessment_id FROM assessments WHERE job_id1 = ?';
        db.query(selectAssessmentIdQuery, [jobId], (selectErr, results) => {
          if (selectErr) {
            // Log error and send 500 Internal Server Error response if there's an error during the query
            console.error('Error fetching assessment ID:', selectErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Extract the assessment_id from the query result
            const assessmentId = results[0].assessment_id;
            // Send the assessment_id as a JSON response
            res.json(assessmentId);
            // Log the assessment_id for debugging purposes
            console.log(assessmentId);
          }
        });
      } else {
        // If no records are found, return null
        res.json(null);
      }
    }
  });
});



// Endpoint to get assessment_id from assessments table
app.get('/get-appassessment-id', async (req, res) => {
  
  const selectLastAssessmentIdQuery = 'SELECT applicant_assessment_id FROM applicant_assessments ORDER BY applicant_assessment_id DESC LIMIT 1';
  
  db.query(selectLastAssessmentIdQuery ,  (err, results) => {
      if (err) {
          console.error('Error fetching ', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.json(results);
      }
      const applicantAssessmentId = results[0].applicant_assessment_id;
      console.log(applicantAssessmentId);
  });
});


//endpoint to check if the test has already been graded or not
app.get('/getAssessmentInfo', (req, res) => {
  const { assessmentId, applicantId } = req.query;
  const selectAssessmentInfoQuery = 'SELECT score, feedback FROM applicant_assessments WHERE assessment_id3 = ? AND applicant_id3 = ?';
  db.query(selectAssessmentInfoQuery, [assessmentId, applicantId], (err, result) => {
    if (err) {
      console.error('Error fetching assessment info:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        const { score, feedback } = result[0];
        res.status(200).json({ score, feedback });
      } else {
        res.status(404).json({ error: 'Assessment info not found' });
      }
    }
  });
});



app.get('/getApplicants', (req, res) => {
  const { assessmentId } = req.query;

  const getApplicantsQuery = `
    SELECT *
    FROM applicant AS a
    JOIN applicant_assessments AS aa ON aa.applicant_id3 = a.applicant_id
    WHERE aa.assessment_id3 = ?`;

  // Execute the SQL query to fetch applicants for the specified assessment
  db.query(getApplicantsQuery, [assessmentId], (err, results) => {
    if (err) {
      console.error('Error fetching applicants:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the list of applicants in the response
    res.json(results);
  });
});

app.get('/getApplicantAnswers', (req, res) => {
  const { assessmentId , applicantId} = req.query;

  const getApplicantAnswersQuery = `
  SELECT q.text, aa.answers 
  FROM questions AS q
  JOIN applicant_answers AS aa ON q.question_id = aa.question_id
  JOIN applicant_assessments AS aas ON aa.applicant_assessment_id = aas.applicant_assessment_id
  JOIN assessments AS a ON aas.assessment_id3 = a.assessment_id
  WHERE a.assessment_id = ? AND aas.applicant_id3 = ?;
  `;

  db.query(getApplicantAnswersQuery, [assessmentId, applicantId], (err, results) => {
    if (err) {
      console.error('Error fetching applicant answers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the list of applicant answers in the response
    res.json(results);
  });
});

// Backend endpoint to update score
app.post('/update-assessment-score', async (req, res) => {
  const { applicantId, assessmentId, score } = req.body;
  try {
    // Perform the update in the applicant_assessments table
    const updateAssessmentQuery = 'UPDATE applicant_assessments SET score = ? WHERE applicant_id3 = ? AND assessment_id3 = ?';
    await db.query(updateAssessmentQuery, [score, applicantId, assessmentId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Backend endpoint to update feedback
app.post('/update-assessment-feedback', async (req, res) => {
  const { applicantId, assessmentId, feedback } = req.body;
  try {
    // Perform the update in the applicant_assessments table
    const updateAssessmentQuery = 'UPDATE applicant_assessments SET feedback = ? WHERE applicant_id3 = ? AND assessment_id3 = ?';
    await db.query(updateAssessmentQuery, [feedback, applicantId, assessmentId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the endpoint to check resume presence
app.get('/checkResumePresence', (req, res) => {
  const jobId = req.query.jobId;
  const applicantId = req.query.applicantId;
  const checkResumeQuery = `SELECT * FROM submission WHERE job_id = ? AND applicant_id = ?`;

  // Execute the SQL query
  db.query(checkResumeQuery, [jobId, applicantId], (err, result) => {
      if (err) {
          console.error('Error checking resume:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          // Check if a submission record exists
          if (result.length > 0) {
            
              
              res.status(200).json({ applied: true});
          } else {
              res.status(200).json({ applied: false });
          }
      }
  });
});

app.get('/get-interview-app', (req, res) => {
  const applicantId = req.query.applicantId;
  const getInterviewQuery = `
      SELECT interview.*, job.*
      FROM interview
      INNER JOIN job ON interview.job_id2 = job.job_id
      WHERE applicant_id2 = ?
  `;
 
  db.query(getInterviewQuery, [applicantId], (err, result) => {
      if (err) {
          console.error('Error fetching interview details:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      res.json(result);
  });
});

app.get('/get-assessment-app', (req, res) => {
  const applicantId = req.query.applicantId;
  const getAssessmentQuery = `
      SELECT applicant_assessments.*, assessments.*
      FROM applicant_assessments
      JOIN assessments ON applicant_assessments.assessment_id3 = assessments.assessment_id
      WHERE applicant_id3 = ? 
  `;

  db.query(getAssessmentQuery, [applicantId], (err, result) => {
      if (err) {
          console.error('Error fetching assessment details:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      res.json(result);
  });
});

app.get('/get-applicants', (req, res) => {
  const recruiterId = req.query.recruiterId;
 const getEmailQuery = `
    SELECT applicant.*, job.job_title
    FROM applicant
    JOIN submission ON submission.applicant_id = applicant.applicant_id
    JOIN job ON job.job_id = submission.job_id
    JOIN recruiter ON job.recruiter_id = recruiter.recruiter_id
    WHERE job.recruiter_id = ?`;

  db.query(getEmailQuery, [recruiterId], (err, result) => {
    if (err) {
      console.error('Error fetching emails:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(result);
  });
});


app.get('/api/applicantProfile', async (req, res) => {
  const appId = req.query.appId;

  console.log(appId, 'profile');
  try {
    await db.query('SELECT * FROM applicant WHERE applicant_id = ?', [appId] , (err, result) => {
    if (result && result.length > 0) {
          res.json(result[0]);
        } else {
          res.status(404).json({ message: 'Applicant not found' });
        }
    });
   
  } catch (error) {
    console.error('Error fetching applicant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/recruiterProfile', async (req, res) => {
  const recruiterId = req.query.recruiterId;

  console.log(recruiterId, 'profile');
  try {
    await db.query('SELECT * FROM recruiter WHERE recruiter_id = ?', [recruiterId] , (err, result) => {
    if (result && result.length > 0) {
          res.json(result[0]); 
        } else {
          res.status(404).json({ message: 'Recruiter not found' });
        }
    });
   
  } catch (error) {
    console.error('Error fetching recruiter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/delete-applicant-account', async (req, res) => {
  const appId = req.query.appId;
  try {
    // Delete data from the 'submission' table where applicant_id matches
    await db.query('DELETE FROM submission WHERE applicant_id = ?', [appId]);
    
    // Delete data from the 'applicant_answers' table where applicant_assessment_id is in the set of assessments for the given applicant
    await db.query('DELETE FROM applicant_answers WHERE applicant_assessment_id IN (SELECT applicant_assessment_id FROM applicant_assessments WHERE applicant_id3 = ?)', [appId]);
    
    // Delete data from the 'applicant_assessments' table where applicant_id matches
    await db.query('DELETE FROM applicant_assessments WHERE applicant_id3 = ?', [appId]);

    // Delete data from the 'interview' table where applicant_id matches
    await db.query('DELETE FROM interview WHERE applicant_id2 = ?', [appId]);
    
    // Delete data from the 'applicant' table where applicant_id matches
    await db.query('DELETE FROM applicant WHERE applicant_id = ?', [appId]);

    res.status(200).send('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.delete('/api/delete-recruiter-account', async (req, res) => {
  const recId = req.query.recId;
  try {
    await db.query('DELETE FROM submission WHERE job_id IN (SELECT job_id FROM job WHERE recruiter_id = ?)' , [recId]);
    await db.query('DELETE FROM interview WHERE job_id2 IN (SELECT job_id FROM job WHERE recruiter_id = ?)' , [recId]);
    await db.query( 'DELETE FROM applicant_answers WHERE question_id IN (SELECT question_id FROM questions WHERE assessment_id IN (SELECT assessment_id FROM assessments WHERE job_id1 IN (SELECT job_id FROM job WHERE recruiter_id = ?)))', [recId]);
    await db.query('DELETE FROM applicant_assessments WHERE assessment_id3 IN (SELECT assessment_id FROM assessments WHERE job_id1 IN (SELECT job_id FROM job WHERE recruiter_id = ?))', [recId]);
    await db.query('DELETE FROM questions WHERE assessment_id IN (SELECT assessment_id FROM assessments WHERE job_id1 IN (SELECT job_id FROM job WHERE recruiter_id = ?))', [recId]);
    await db.query('DELETE FROM assessments WHERE job_id1 IN (SELECT job_id FROM job WHERE recruiter_id = ?)' , [recId]);
    await db.query('DELETE FROM job WHERE recruiter_id =?', [recId]);
    await db.query('DELETE FROM recruiter WHERE recruiter_id =?' , [recId]);

    res.status(200).send('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Internal Server Error');
  }
});




// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});