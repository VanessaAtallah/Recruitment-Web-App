import React, { useState } from 'react';
import { FaTh, FaBars, FaUserAlt, FaCommentAlt, FaSuitcase } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import './SideMenu.css';
import logo from './Logo.png';

const Sidebar1 = ({children}) => {

  const[isOpen ,setIsOpen] = useState(false);
  const toggle = () => setIsOpen (!isOpen);
  const menuItem=[
      {
          path:"/Applications",
          name:"Dashboard",
          icon:<FaTh/>
      },
      {
          path:"/AllJobs",
          name:"Job list",
          icon:<FaSuitcase/>
      },
      {
          path:"/Communication",
          name:"Communication",
          icon:<FaCommentAlt/>
      },
      {
          path:"/ApplicantProfile",
          name:"Profile",
          icon:<FaUserAlt/>
      }
  ]
  return (
      <div className="container">
         <div style={{width: isOpen ? "205px" : "50px"}} className="sidebar">
             <div className="top_section">
                 <img alt='logo' className="logo-menu" src={logo} style={{display: isOpen ? "block" : "none"}} width='50px' height='50px'/>
                 <div style={{marginLeft: isOpen ? "10px" : "0px"}} className="bars">
                     <FaBars onClick={toggle}/>
                 </div>
             </div>
             <div className="title-menu" style={{ display: isOpen ? "block" : "none" }}>&nbsp; Recruit Wave</div><br></br>
             {
                 menuItem.map((item, index)=>(
                     <NavLink to={item.path} key={index} className="link" activeclassName="active">
                         <div className="icon">{item.icon}</div>
                         <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                     </NavLink>
                 ))
             }
         </div>
         <main className="content">{children}</main>
      </div>
  );
};


export default Sidebar1;

