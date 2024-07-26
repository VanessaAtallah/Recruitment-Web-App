import React from 'react';
import axios from 'axios';
import classes from './ApplicantsPage.module.css';
import { FaBirthdayCake, FaEnvelope, FaPlus, FaGithub, FaLink, FaLinkedin, FaMap, FaPhone, FaTimes} from 'react-icons/fa';



function CVPopup({ selectedApplicant, onClose, onAccept }) {
  const handleAccept = async () => {
    try {
      await axios.post('http://localhost:8800/updateStatus', { applicantId: selectedApplicant.applicant_id, jobId: selectedApplicant.job_id, status: 'accepted' });
      onAccept();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error
    }
  };

  const handleReject = async () => {
    try {
      await axios.post('http://localhost:8800/updateStatus', { applicantId: selectedApplicant.applicant_id, jobId: selectedApplicant.job_id, status: 'rejected' });
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error
    }
  };

  return (
    <div className="overlay">
    <div className="popup">
      <div className="popup-inner">
        <button className="close-button" onClick={onClose}>&times;</button>
        {selectedApplicant && (
          <div className="applicantBox">
               <div><input className={classes.inputField1} value={selectedApplicant.applicant_name}/></div>
                <div><input className={classes.inputField2} value={selectedApplicant.app_position}  /></div>
                <div><textarea className={classes.inputField3} value ={selectedApplicant.professional_name} rows={3} cols={50} /></div>
                <label className={classes.label1}>
                    Education
                </label>

                <div className={classes.educationContainer}>
              
  <div className={classes.educationBlock}>
  <input  className={classes.educationItemInput}
  value={selectedApplicant.university} />
<input className={classes.educationItemInput}
          value={selectedApplicant.education_year}/>
        <input className={classes.educationItemInput}
value={selectedApplicant.degree} />
   
  </div>
  
</div>

<label className={classes.label4}>
                    Work Experience
                </label>

                <div className={classes.experienceContainer}>
              
  <div className={classes.educationBlock}>
  <input  className={classes.educationItemInput}
  value={selectedApplicant.work_exp} />
<input className={classes.educationItemInput}
          value={selectedApplicant.exp_date} />
        <input className={classes.educationItemInput}
value={selectedApplicant.years_of_exp} />
   
  </div>
  
</div>

<label className={classes.label4}>
                    References
                </label>

                <div className={classes.referenceContainer}>
              
  <div className={classes.educationBlock}>
  <input  className={classes.educationItemInput}
  value={selectedApplicant.work_references}/>
  </div>
  <div>
      <FaGithub className={classes.icon1} />
      <div><input className={classes.inputField11} value={selectedApplicant.github} /></div>
    </div>
    <div>
      <FaPhone className={classes.icon2} />
      <div><input className={classes.inputField12} value={selectedApplicant.phone_number} /></div>
    </div>
    <div>
      <FaEnvelope className={classes.icon3} />
      <div><input className={classes.inputField13}  value={selectedApplicant.email} /></div>
    </div>
    <div>
      <FaMap className={classes.icon4} />
      <div><textarea className={classes.inputField14} value={selectedApplicant.address}/></div>
    </div>
    <div>
      <FaBirthdayCake className={classes.icon5} />
      <div><input  className={classes.inputField15}  value={selectedApplicant.date_of_birth} /></div>
    </div>
    <div>
      <FaLink className={classes.icon6} />
      <div><input className={classes.inputField16} value={selectedApplicant.links} /></div>
    </div>
    <div>
      <FaLinkedin className={classes.icon7} />
      <div><input  className={classes.inputField17} value={selectedApplicant.linkedin} /></div>
    </div>
     <label className={classes.label4}>
        Skills
    </label>
   
           <div className={classes.skillContainer}>
            
  <div className={classes.educationBlock} >
    <div className={classes.educationItem}>
      <div>
      <textarea rows={3} cols={50}
         className={classes.educationItemInput}
          value={selectedApplicant.skills}/>
  
      </div>
  
</div>
</div>
 </div>

 <label className={classes.label4}>
        Awards
    </label>
   
    <div className={classes.educationItem}>
            
  <div className={classes.educationBlock} >
    <div className={classes.educationItem}>
      <div>
        <textarea rows={3} cols={50}
         className={classes.educationItemInput}
          value={selectedApplicant.awards}/>
  
      </div>
  
</div>
</div>
 </div>

 <label className={classes.label4}>
       Certifications
    </label>
   
    <div className={classes.educationItem}>
            
  <div className={classes.educationBlock} >
    <div className={classes.educationItem}>
      <div>
      <textarea rows={3} cols={50}
         className={classes.educationItemInput}
          value={selectedApplicant.certifications}/>
  
      </div>
  
</div>
</div>
 </div>

 <label className={classes.label4}>
        Hobbies
    </label>
    <div className={classes.educationItem}>
            
  <div className={classes.educationBlock} >
    <div className={classes.educationItem}>
      <div>
        <input
         className={classes.educationItemInput}
          value={selectedApplicant.hobbies}/>
  
      </div>
  
</div>
</div>
 </div>

 
 <label className={classes.label4}>
       Languages
    </label>
    <div className={classes.educationItem}>
            
  <div className={classes.educationBlock} >
    <div className={classes.educationItem}>
      <div>
        <input
         className={classes.educationItemInput}
          value={selectedApplicant.languages}/>
  
      </div>
  
</div>
</div>
 </div>
        <label className={classes.coverletter}> Cover Letter: </label>
        <textarea cols={50} rows={4} value = {selectedApplicant.coverletter} className={classes.educationItemInput} />
        <label className={classes.status}> Status: </label>
        <input value = {selectedApplicant.status} className={classes.educationItemInput} />
        
        
        </div> </div>
        )}
        
        <div className={classes.jobactions}>
          <button className={classes.accept} onClick={handleAccept}>Accept</button>
          <button className={classes.reject} onClick={handleReject}>Reject</button>
      </div>
      </div>
      
    </div>
    </div>
      
  );
}

export default CVPopup;
