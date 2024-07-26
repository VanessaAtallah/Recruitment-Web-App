import React from 'react';
import './AllJobs.module.css'; // Import your CSS file


// Popup component
const Popup = ({ onClose, children }) => (
  <div className="popup">
    <span className="close" onClick={onClose}>&times;</span> {/* Close (X) symbol */}
    {children}
  </div>
);

export default Popup;
