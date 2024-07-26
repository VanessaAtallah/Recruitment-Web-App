import React, { useState, useRef, useEffect} from "react";
import axios from 'axios';
import classes from './Resume.module.css';
import {jwtDecode} from "jwt-decode";


import { FaBirthdayCake, FaEnvelope, FaPlus,FaGithub, FaLink, FaLinkedin, FaMap, FaPhone, FaTimes} from 'react-icons/fa';



function Resume(props) {
    const [data, setData] = useState({ // State for form data
        image:'',
        appname: '',
        position: '',
        profsummary: '',
        university:[],
        educationyear:[],
        degree:[],
        company: [],
        dates:[],
        position:[],
        responsibilities:[],
        references:[],
        skill: [], 
        year:[],
        award: [],
        year1: [],
        certification:[],
        hobbies: [],
        email: '',
        phoneNumber: '',
        address: '',
        birthdate: '',
        languages:[],
        links:'',
        github:'',
        linkedin:'',
        coverLetter:'' ,
        status: '',
        jobId: '',
    });
   

  
  
    const formRef = useRef(null); // Ref for the form element
    const canvasRef = useRef(null); // Ref for the canvas element
    
    
    const [educationBlocks, setEducationBlocks] = useState([
        {
          university: '',
          educationyear: '',
          degree: '',
        },
      ]);
      const [experienceBlocks, setExperienceBlocks] = useState([
        {
          company: '',
          dates: '',
          position: '',
          responsibilities: '',

        }
      ])

      const [referencesBlocks, setReferenceBlocks] = useState([
        {
          references:'',

        }
      ])

      const [skillBlocks, setSkillBlocks] = useState([
        {
          skill:'',

        }
      ])

      const [awardBlocks, setAwardBlocks] = useState([
        {
          year:'',
          award:'',

        }
      ])

      
      const [certBlocks, setCertBlocks] = useState([
        {
          year1:'',
          certification:'',

        }
      ])

      const addCertBlock = () => {
        setCertBlocks([...certBlocks, {
          year1:'',
          certification:'',
        }]);
    };


      const addEducationBlock = () => {
        setEducationBlocks((prevBlocks) => [
          ...prevBlocks,
          {
            university: '',
            educationyear: '',
            degree: '',
          },
        ]);
      };

      const addExperienceBlock = () => {
        setExperienceBlocks((prevBlocks) => [
          ...prevBlocks,
          {
            company: '',
            dates: '',
            position: '',
            responsibilities: '',
          }
        ]);
    };

    const addReferenceBlock = () => {
      setReferenceBlocks([...referencesBlocks, {
          references:'',
      }]);
  };

  const addSkillBlock = () => {
    setSkillBlocks([...skillBlocks, {
        skill:'',
    }]);
};

const addAwardBlock = () => {
  setAwardBlocks([...awardBlocks, {
    year: '',
    award: '',
     
     
  }]);
};


const [hobBlocks, sethobBlocks] = useState([
  {
    hobbies:'',
 

  }
])
const addHobBlock = () => {
  sethobBlocks((prevBlocks) => [
    ...prevBlocks,
    {
      hobbies:'',
    },
  ]);
};


const [lanBlocks, setlanBlocks] = useState([
  {
    languages:'',
 

  }
])
const addlanBlock = () => {
  setlanBlocks((prevBlocks) => [
    ...prevBlocks,
    {
      languages:'',
    },
  ]);
};
    

    const [imageSrc, setImageSrc] = useState('https://via.placeholder.com/150x100');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [exist, setExist] = useState(false);
    const [coverLetterFile, setCoverLetterFile] = useState(null);
    const [status, setStatus] = useState('');
    
    const date = new Date(); // Get the current date and time
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' '); // Format the date to 'YYYY-MM-DD HH:MM:SS'
   
    // Function to handle changes in the selected cover letter file
    const handleCoverLetterChange = (event) => {
  // Update the state with the selected cover letter file
  setCoverLetterFile(event.target.files[0]);
};


 
   // Function to handle image upload
const handleImageUpload = (e) => {
  // Get the selected file from the event
  const file = e.target.files[0];

  // Create a new FileReader instance to read the file content
  const reader = new FileReader();

  // Set up a callback function to be executed when the file is loaded
  reader.onload = () => {
      // Extract the URL from the reader result, which contains the image data
      const imageUrl = reader.result;

      // Set the extracted URL as the image source
      setImageSrc(imageUrl);
  };

  // Check if a file is selected
  if (file) {
      // Start uploading process
      setUploading(true);

      // Read the file content as a data URL
      reader.readAsDataURL(file);
  }
};

    
    const handleImageRemove = () => {
        setImageSrc('https://via.placeholder.com/150x100'); // Resetting image source to placeholder URL
        setUploading(false); // Resetting uploading state to false to hide the "Uploading..." message
        const uploadInput = document.getElementById("upload-input");
        if (uploadInput) {
            uploadInput.value = ""; // Clearing the file input value to allow re-uploading the same image
        }
        
    };
    
   
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setData(prevData => ({
          ...prevData,
          [name]: value
      }));
  };


       
  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");

    // Decode the token to get appId and jobId
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const appId = decodedToken.id;
    const jobId = props.jobId;

    // Create FormData object
    const formData = new FormData();

    // Append cover letter file
    formData.append('coverLetter', coverLetterFile);

    // Append other form data fields
    Object.entries(data).forEach(([key, value]) => {
        // Append single value fields directly
        formData.append(key, value);
    });

    // Append education blocks data
    educationBlocks.forEach((block, index) => {
        // Append each input of the education block
        formData.append(`university[${index}]`, block.university);
        formData.append(`educationyear[${index}]`, block.educationyear);
        formData.append(`degree[${index}]`, block.degree);
      });
      experienceBlocks.forEach((block, index) => {
        formData.append(`company[${index}]`, block.company);
        formData.append(`dates[${index}]`, block.dates);
        formData.append(`position[${index}]`, block.position);
        formData.append(`responsibilities[${index}]`, block.responsibilities);
      });
      referencesBlocks.forEach((block, index) => {
        formData.append(`references[${index}]`, block.references);
      });

      skillBlocks.forEach((block, index) => {
        formData.append(`skill[${index}]`, block.skill);
      });

      hobBlocks.forEach((block, index) => {
        formData.append(`hobbies[${index}]`, block.hobbies);
      });

      lanBlocks.forEach((block, index) => {
        formData.append(`languages[${index}]`, block.languages);
      });

      awardBlocks.forEach((block, index) => {
        formData.append(`year[${index}]`, block.year);
        formData.append(`award[${index}]`, block.award);
      });

      certBlocks.forEach((block, index) => {
        formData.append(`year1[${index}]`, block.year1);
        formData.append(`certification[${index}]`, block.certification);
      });
  
  
  

    // Append appId and jobId
    formData.append('appId', appId);
    formData.append('jobId', jobId);

    try {
        // Sending POST request to '/submit' endpoint with formData
        const response = await axios.post('http://localhost:8800/submit', formData);
        console.log(response.data); // Logging response data from the server

        if (response.data.message) {
          alert('Submission Successful'); // Display success message
          props.onClose(); // Call the onClose function passed from the parent
          props.onApply();
      } else {
          alert('No such records'); // Display error message
          props.onClose(); // Call the onClose function passed from the parent
          props.onApply();
      }
      
            
        
        // Resetting form data after successful submission
        
        setData({ 
          image:'',
          appname: '',
          position: '',
          profsummary: '',
          university:[],
          educationyear:[],
          degree:[],
          company: [],
          dates:[],
          position:[],
          responsibilities:[],
          references:[],
          skill: [], 
          year:[],
          award: [],
          year1: [],
          certification:[],
          hobbies: [],
          email: '',
          phoneNumber: '',
          address: '',
          birthdate: '',
          languages:[],
          links:'',
          github:'',
          linkedin:'',
          coverLetter:'' ,
          status: '',
          jobId: '',
      });
        setCoverLetterFile(null); // Reset cover letter file state
        // You can also show a success message to the user or redirect to another page
        
    } catch (error) {
        console.error('Error submitting resume:', error);
        // Handle error - Show error message to the user or handle accordingly
    }
    
};

    
    const handleInputChangeEdu = (value, index) => {
        const updatedBlocks = [...educationBlocks];
        updatedBlocks[index] = value;
        setEducationBlocks(updatedBlocks);
      };
      
      const removeEducationBlock = (index) => {
        const updatedBlocks = [...educationBlocks];
        updatedBlocks.splice(index, 1);
        setEducationBlocks(updatedBlocks);
      };

      const handleInputChangeExp = (value, index) => {
        const updatedBlocks = [...experienceBlocks];
        updatedBlocks[index] = value;
        setExperienceBlocks(updatedBlocks);
      };
      
    
    const removeExperienceBlock = (index) => {
      const updatedBlocks = [...experienceBlocks];
      updatedBlocks.splice(index, 1);
      setExperienceBlocks(updatedBlocks);
    };
    
      
    const handleInputChangeRef = (value, index) => {
      const updatedBlocks = [...referencesBlocks];
      updatedBlocks[index] = value;
      setReferenceBlocks(updatedBlocks);
    };
    
    const removeRefBlock = (index) => {
      const updatedBlocks = [...referencesBlocks];
      updatedBlocks.splice(index, 1);
      setReferenceBlocks(updatedBlocks);
    };

  // Function to handle input change for a skill block
const handleInputChangeSkill = (value, index) => {
  // Create a copy of the skillBlocks array
  const updatedBlocks = [...skillBlocks];

  // Update the value at the specified index
  updatedBlocks[index] = value;

  // Update the state with the modified array
  setSkillBlocks(updatedBlocks);
};

    
    // Function to remove a skill block from the array
const removeSkillBlock = (index) => {
  // Create a copy of the skillBlocks array
  const updatedBlocks = [...skillBlocks];

  // Remove the block at the specified index
  updatedBlocks.splice(index, 1);

  // Update the state with the modified array
  setSkillBlocks(updatedBlocks);
};

    const handleInputChangeAward = (value, index) => {
      const updatedBlocks = [...awardBlocks];
      updatedBlocks[index] = value;
      setAwardBlocks(updatedBlocks);
    };
    
    const removeAwardBlock = (index) => {
      const updatedBlocks = [...awardBlocks];
      updatedBlocks.splice(index, 1);
      setAwardBlocks(updatedBlocks);
    };

    const handleInputChangeCert = (value, index) => {
      const updatedBlocks = [...certBlocks];
      updatedBlocks[index] = value;
      setCertBlocks(updatedBlocks);
    };
    
    const removeCertBlock = (index) => {
      const updatedBlocks = [...certBlocks];
      updatedBlocks.splice(index, 1);
      setCertBlocks(updatedBlocks);
    };

    const handleInputChangehob = (value, index) => {
      const updatedBlocks = [...hobBlocks];
      updatedBlocks[index] = value;
      sethobBlocks(updatedBlocks);
    };
    
    const removeBlockhob = (index) => {
      const updatedBlocks = [...hobBlocks];
      updatedBlocks.splice(index, 1);
      sethobBlocks(updatedBlocks);
    };

    const handleInputChangelan = (value, index) => {
      const updatedBlocks = [...lanBlocks];
      updatedBlocks[index] = value;
      setlanBlocks(updatedBlocks);
    };
    
    const removeBlocklan = (index) => {
      const updatedBlocks = [...lanBlocks];
      updatedBlocks.splice(index, 1);
      setlanBlocks(updatedBlocks);
    };
   
   



    return (
        <div>
 <form ref={formRef} onSubmit={handleAdd}>
            <div className={classes.imagebox}>
                <img src={imageSrc} alt="uploaded image" value={data.image}
                onClick={handleImageRemove} // Added event handler to remove the image on click 
                />
                {!uploading && (
                    <label htmlFor="upload-input" className={classes.uploadlabel}>
                        Upload Your image
                        <input
                            id="upload-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }} />
                    </label>
                )}
                {uploading && <div className="uploading-message">Uploading...</div>}
            </div>

            
                {/* Render your form inputs */}
                <div><input className={classes.inputField1}type="text" name="appname" placeholder="Name" onChange={handleInputChange} value={data.appname} required /></div>
                <div><input className={classes.inputField2}type="text" name="position" placeholder="Position" onChange={handleInputChange} value={data.position} required /></div>
                <div><textarea type="text" className={classes.inputField3}name="profsummary" placeholder="Professional Summary" onChange={handleInputChange} value ={data.profsummary}rows={3} cols={50}required /></div>
                
                <div>
                <label className={classes.label1}>
                    Education
                </label>

                <div className={classes.educationContainer}>
                {educationBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
      <input  className={classes.educationItemInput}
  type="text"
  placeholder="University"
  name="university"
  value={data.university[index]} // Assuming index is the index of the mapped element
  onChange={(e) =>
    handleInputChangeEdu({ ...block, university: e.target.value }, index)
  }
/>

        <input className={classes.educationItemInput}
          type="text"
          placeholder="Education Year"
          name="educationyear"
          value={block.educationyear}
          onChange={(e) =>
            handleInputChangeEdu({ ...block, educationyear: e.target.value }, index)
          }
        />
        <input className={classes.educationItemInput}
          type="text"
          placeholder="Degree"
          name="degree"
          value={block.degree}
          onChange={(e) =>
            handleInputChangeEdu({ ...block, degree: e.target.value }, index)
          }
        />
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeEducationBlock(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addEducationBlock}>
  <FaPlus />
</div>
                </div>
                </div>

               
                <div>
                <label className={classes.label2}>
                    Work Experience
                </label>

                <div className={classes.experienceContainer}>
                {experienceBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
        <input  className={classes.educationItemInput}
          type="text"
          placeholder="Company Name | 2021-2023"
          name="company"
          value={block.company}
          onChange={(e) =>
            handleInputChangeExp({ ...block, company: e.target.value }, index)
          }
        />
        <input  className={classes.educationItemInput}
          type="text"
          placeholder="2 - 3 years of experience"
          name="dates"
          value={block.dates}
          onChange={(e) =>
            handleInputChangeExp({ ...block, dates: e.target.value }, index)
          }
        />
        <input  className={classes.educationItemInput}
          type="text"
          placeholder="Position"
          name="position"
          value={block.position}
          onChange={(e) =>
            handleInputChangeExp({ ...block, position: e.target.value }, index)
          }
        />
        <input  className={classes.educationItemInput}
          type="text"
          placeholder="Responsibilities"
          name="responsibilities"
          value={block.responsibilities}
          onChange={(e) =>
            handleInputChangeExp({ ...block, responsibilities: e.target.value }, index)
          }
        />
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeExperienceBlock(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addExperienceBlock}>
  <FaPlus />
</div>
                </div>
                </div>
                    <label className={classes.label3}>
                    References
                </label>
                <div className={classes.referenceContainer}>
                {referencesBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
        <input  className={classes.educationItemInput}
          type="text"
          placeholder="Jane Smith - Project Manager - (555) 123-4567"
          name="references"
          value={block.references}
          onChange={(e) =>
            handleInputChangeRef({ ...block, references: e.target.value }, index)
          }
        />
  
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeRefBlock(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addReferenceBlock}>
  <FaPlus />
</div>
                
                <div>
      <FaGithub className={classes.icon1} />
      <div><input type="text" className={classes.inputField11} name ="github" placeholder="https://github.com" onChange={handleInputChange} value={data.github}/></div>
    </div>
    <div>
      <FaPhone className={classes.icon2} />
      <div><input type="text" className={classes.inputField12} name ="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} value={data.phoneNumber}/></div>
    </div>
    <div>
      <FaEnvelope className={classes.icon3} />
      <div><input type="text" className={classes.inputField13} name ="email" placeholder="example@example.com" onChange={handleInputChange} value={data.email}/></div>
    </div>
    <div>
      <FaMap className={classes.icon4} />
      <div><textarea type="text" className={classes.inputField14} name ="address" placeholder="123 Street Name, City, Country" onChange={handleInputChange}rows={1} cols={40} value={data.address}/></div>
    </div>
    <div>
      <FaBirthdayCake className={classes.icon5} />
      <div><input type="date" className={classes.inputField15} name ="birthdate" onChange={handleInputChange} value={data.birthdate} /></div>
    </div>
    <div>
      <FaLink className={classes.icon6} />
      <div><input type="text" className={classes.inputField16} name ="links" placeholder="https://example.com" onChange={handleInputChange} value={data.links}/></div>
    </div>
    <div>
      <FaLinkedin className={classes.icon7} />
      <div><input type="text" className={classes.inputField17} name ="linkedin" placeholder="John Smith" onChange={handleInputChange} value={data.linkedin}/></div>
    </div>
    <div>
    <label className={classes.label4}>
        Skills
    </label>
   
           <div className={classes.skillContainer}>
                {skillBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
        <input
         className={classes.educationItemInput}
          type="text"
          placeholder="Skills"
          name="skill"
          value={block.skill}
          onChange={(e) =>
            handleInputChangeSkill({ ...block, skill: e.target.value }, index)
          }
        />
  
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeSkillBlock(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addSkillBlock}>
  <FaPlus />
</div>
           
        </div>
</div>


<div>
    <label className={classes.label4}>
        Awards
    </label>
   
           <div >
                {awardBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
        <input className={classes.educationItemInput}
          type="text"
          placeholder="Year"
          name="year"
          value={block.year}
          onChange={(e) =>
            handleInputChangeAward({ ...block, year: e.target.value }, index)
          }
        />
         <input className={classes.educationItemInput}
          type="text"
          placeholder="Award"
          name="award"
          value={block.award}
          onChange={(e) =>
            handleInputChangeAward({ ...block, award: e.target.value }, index)
          }
        />
  
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeAwardBlock(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addAwardBlock}>
  <FaPlus />
</div>
           
        </div>
</div>

<div>
    <label className={classes.label4}>
       Certifications
    </label>
   
           <div className={classes.certContainer}>
                {certBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
        <input className={classes.educationItemInput}
          type="text"
          placeholder="Year"
          name="year1"
          value={block.year1}
          onChange={(e) =>
            handleInputChangeCert({ ...block, year1: e.target.value }, index)
          }
        />
         <input className={classes.educationItemInput}
          type="text"
          placeholder="Certified Full-Stack Developer"
          name="certification"
          value={block.cert}
          onChange={(e) =>
            handleInputChangeCert({ ...block, certification: e.target.value }, index)
          }
        />
  
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeCertBlock(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addCertBlock}>
  <FaPlus />
</div>
           
        </div>
</div><div>
<label className={classes.label4}>
        Hobbies
    </label>
   
           <div className={classes.hobContainer}>
                {hobBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
        <input className={classes.educationItemInput}
          type="text"
          placeholder="hobbies"
          name="hobbies"
          value={block.hobbies}
          onChange={(e) =>
            handleInputChangehob({ ...block, hobbies: e.target.value }, index)
          }
        />
  
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeBlockhob(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addHobBlock}>
  <FaPlus />
</div>
           
        </div>
</div>
                </div>        

                <div>
                <label className={classes.label4}>
       Languages
    </label>
   
           <div className={classes.lanContainer}>
                {lanBlocks.map((block, index) => (
  <div className={classes.educationBlock} key={index}>
    <div className={classes.educationItem}>
      <div>
        <input className={classes.educationItemInput}
          type="text"
          placeholder="English"
          name="languages"
          value={block.languages}
          onChange={(e) =>
            handleInputChangelan({ ...block, languages: e.target.value }, index)
          }
        />
  
      </div>
      <FaTimes
        className={classes.removeIcon}
        onClick={() => removeBlocklan(index)}
      />
    </div>
  </div>
))}
<div className={classes.addEducationBlock} onClick={addlanBlock}>
  <FaPlus />
</div>
           
        </div>
</div>
        <form>
        <label className={classes.pdf}>Upload your cover letter here (PDF):</label><br />
        <input type="file" id="coverLetterFile" onChange={handleCoverLetterChange} className={classes.coverletter} />
       </form>
       <button className={classes.btn} onClick={() => {
      
        
}}>
    <span className={classes.btntextone}>Submit</span>
    <span className={classes.btntexttwo}>Done!</span>
</button>

                    </form>
                </div>  
               
                  
        
    );

};
export default Resume;

