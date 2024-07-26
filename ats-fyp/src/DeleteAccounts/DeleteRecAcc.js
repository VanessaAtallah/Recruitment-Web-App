import React, { useState, useEffect} from 'react'
import RecSideMenu from "../SideMenu/RecSideMenu";
import axios from 'axios';
import './DeleteAppAcc.css'; // Import the CSS file
import { jwtDecode } from 'jwt-decode';
import { FaTrash, FaUserTie, FaBuilding, FaRegBuilding ,FaBriefcase, FaLocationArrow, FaMapMarkedAlt, FaMapPin } from 'react-icons/fa';

function DeleteRecAcc() {
    const [recruiterInfo, setRecruiterInfo] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    
  useEffect(() => {
    const getRecruiterInfo = async () => {
        const token = localStorage.getItem("token");

      try {
        const decodedToken = jwtDecode(token);
        const recruiterId = decodedToken.id;
        const response = await axios.get(`http://localhost:8800/api/recruiterProfile?recruiterId=${recruiterId}`);

        setRecruiterInfo(response.data);
      } catch (error) {
        console.error('Error fetching recruiter info:', error);
      }
    };

    getRecruiterInfo();
  }, []);


const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

 const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const recId = decodedToken.id;
  
    try {
      await axios.delete(`http://localhost:8800/api/delete-recruiter-account?recId=${recId}`);
      // Optionally, you can redirect to a different page or perform any other actions after deleting the account
      console.log('Account deleted successfully');
     // Clear the token
     localStorage.removeItem('token');

     // Redirect to the home page
     window.location.href = '/';
    
    } catch (error) {
      console.error('Error deleting recruiter account:', error);
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <div>
      <div className="sideMenuContainer">
        <RecSideMenu />
      </div>
      <div className="contentContainer">
        {recruiterInfo ? (
          <div className='infoProfile'>
            <h1>Profile</h1><br></br>
            <p><i className="fas fa-user"></i> <span>{recruiterInfo.first_name} {recruiterInfo.last_name}</span></p>
            <p><i className="fas fa-envelope"></i> <span>{recruiterInfo.email}</span></p>
            <p><i className="fas fa-phone"></i> <span>{recruiterInfo.phone_number}</span></p>
            {recruiterInfo.rec_type === 'HR' &&(<p> <FaUserTie /> <span>{recruiterInfo.rec_type}</span></p>)}
            {recruiterInfo.rec_type === 'Company' && ( <p><FaBuilding /> <span>{recruiterInfo.rec_type}</span></p>)}
            {recruiterInfo.rec_type === 'Third Party' &&  ( <p><FaBriefcase />  <span>{recruiterInfo.rec_type}</span> </p>)}
            {recruiterInfo.company_name && (
              <p><FaRegBuilding/> <span>{recruiterInfo.company_name}</span></p>
            )}
            {recruiterInfo.address && (
              <p><FaMapPin/> <span>{recruiterInfo.address}</span></p>
            )}
            <div className='delete-account'>
                <button className='delete-account-button' onClick={handleDeleteConfirmation}>Delete Account &nbsp;&nbsp;<FaTrash/></button>
            </div>
          </div>
        ) : (
          <p>Loading recruiter info...</p>
        )}
      </div>    
      {showDeleteConfirmation && (
        <>
          <div className="overlay-delete-account"></div>
          <div className="popup-delete-account">
            <div className="popup-header-delete-account">
              <span className="close-delete-account" onClick={handleCancelDelete}>&times;</span>
            </div>
            <div className="popup-inner-delete-account">
              <p className='are-you-sure'>Are you sure you want to delete your account?</p>
              <button className='yes-delete-account' onClick={handleConfirmDelete}>Yes</button>&nbsp;&nbsp;
              <button className='no-delete-account' onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DeleteRecAcc;