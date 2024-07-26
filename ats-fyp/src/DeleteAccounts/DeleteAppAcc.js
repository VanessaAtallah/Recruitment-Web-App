import React, { useState, useEffect } from 'react';
import AppSideMenu from '../SideMenu/AppSideMenu';
import axios from 'axios';
import './DeleteAppAcc.css'; 
import { jwtDecode } from 'jwt-decode';
import { FaTrash } from 'react-icons/fa';

function DeleteAppAcc() {
  const [applicantInfo, setApplicantInfo] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const getApplicantInfo = async () => {
        const token = localStorage.getItem("token");

      try {
        const decodedToken = jwtDecode(token);
        const appId = decodedToken.id;
        const response = await axios.get(`http://localhost:8800/api/applicantProfile?appId=${appId}`);

        setApplicantInfo(response.data);
      } catch (error) {
        console.error('Error fetching applicant info:', error);
      }
    };

    getApplicantInfo();
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
    const appId = decodedToken.id;
  
    try {
      await axios.delete(`http://localhost:8800/api/delete-applicant-account?appId=${appId}`);
      // Optionally, you can redirect to a different page or perform any other actions after deleting the account
      console.log('Account deleted successfully');
     // Clear the token
     localStorage.removeItem('token');

     // Redirect to the home page
     window.location.href = '/';
    
    } catch (error) {
      console.error('Error deleting applicant account:', error);
    }
    setShowDeleteConfirmation(false);
  };
  
  return (
    <div>
      <div className="sideMenuContainer">
        <AppSideMenu />
      </div>
      <div className="contentContainer">
        {applicantInfo ? (
          <div className='infoProfile'>
            <h1>Profile</h1><br></br>
            <p><i className="fas fa-user"></i> <span>{applicantInfo.first_name} {applicantInfo.last_name}</span></p>
            <p><i className="fas fa-envelope"></i> <span>{applicantInfo.email}</span></p>
            <p><i className="fas fa-birthday-cake"></i> <span>{applicantInfo.date_of_birth.split('T')[0]}</span></p>
            <p><i className="fas fa-map-marker-alt"></i> <span>{applicantInfo.address}</span></p>
            <p><i className="fas fa-phone"></i> <span>{applicantInfo.phone_number}</span></p>
            {applicantInfo.gender === 'male' && <p><i className="fas fa-mars"></i> <span>{applicantInfo.gender}</span></p>}
            {applicantInfo.gender === 'female' && <p><i className="fas fa-venus"></i> <span>{applicantInfo.gender}</span></p>}            
            <div className='delete-account'>
            <button className='delete-account-button'  onClick={handleDeleteConfirmation}>Delete Account &nbsp;&nbsp;<FaTrash/></button>
            </div>
          </div>
        ) : (
          <p>Loading applicant info...</p>
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
export default DeleteAppAcc;