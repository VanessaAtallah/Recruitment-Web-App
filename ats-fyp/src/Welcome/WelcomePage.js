import React from 'react';
import image1 from './image1.png';
import image2 from './image2.png';
import image3 from './image3.png';
import './WelcomePage.css';
import Carousel from './Carousel'; 
import { Link } from 'react-router-dom';
import i1 from './i1.png';
import i2 from './i2.png';



function Home_page() {
  const images = [ image1, image2, image3];
    
  
   
  return (
    <div>
      
      <Carousel images={images}/>

      <div className="textOverlay">
      <h1 className="welcoming">Welcome to Recruit Wave</h1>
            <p className="titles">Empowering Your Hiring Process</p>
            <p className="description">Recruit Wave is your all-in-one solution for streamlining recruitment</p>
            
            <div>
            <Link to="/Recsignin">
                    <button className="button-welcome">I'm a Recruiter</button>
                </Link>
                <Link to="/Appsignin">
                    <button className="button-welcome1">I'm an Applicant</button>
                </Link>
            </div>


      </div>

      <section>
        <div>
        <p className="title1">About Recruit Wave</p>
        </div>
      </section>

      <section className="section">
        <div className="p1">
          <p className="paragraph1">Recruit Wave is a cutting-edge applicant tracking system designed to simplify and streamline your hiring process. With powerful features and an intuitive interface, Recruit Wave empowers recruiters 
          and applicants alike, making the journey from job posting to hire a seamless experience.</p>
        </div>
      </section>
      
      
     
      
      <section className="section">
        <div className="imagetextcontainer">
        <p className="title2">Why Choose Recruit Wave</p>
           <p className="p1">With Recruit Wave, you can say goodbye to the complexities of traditional 
           hiring processes. Our platform offers advanced tools for resume management, 
           candidate tracking, and communication, all in one convenient location. 
           Join the wave of recruiters and applicants who have chosen Recruit Wave for their hiring needs.</p>
             </div>
             <img src={i1} className='i1'/>
      </section>

      <section className="section">
        <div className="imagetextcontainer1">
        <p className="title3">Our Mission</p>
           <p className="p1">At Recruit Wave, our mission is to revolutionize the recruitment industry 
           by providing innovative solutions that connect talented individuals with top employers. 
           We are committed to delivering a superior hiring experience for both recruiters and applicants,
            ensuring mutual success in every placement</p>
             </div>
             <img src={i2} className='i2'/>
            
      </section>
      <section className="section">
        <div className="imagetextcontainer2">
        <p className="title4">Ready to take your hiring process to the next level? </p>
        <p className="p2">Join Recruit Wave today and discover a world of possibilities. </p>
        <p className="p3">Whether you're a recruiter looking for top talent or an applicant seeking your next opportunity, Recruit Wave is your go-to platform for success.</p>
          
             </div>
            
            
      </section>
      
      
       <footer className="section">
   
        <div className="copyrights">
        <footer>
        <div className="col">
                                                                    
       <h4>Contact</h4>
      <p><strong>Address: </strong>Lebanon</p>
      <p><strong>Phone:</strong>+961 79 19 4006</p>
          <div className="follow">
           <h4>Follow Us</h4>
   <div>
   <i class="fa-brands fa-instagram"></i>
                                                                               
  <i class="fa-brands fa-facebook"></i>
   </div>

  </div>  </div>
    <div className="col">
    <h4>About</h4>
    <a href="#">About Us</a>
  
    </div>
  <div className="col">
   <h4>My Account</h4>
   <a href="#">Sign In</a>
                                                                        
  </div>
                                                                   
  </footer>
        
        <h5 style={{marginLeft:'45%'}}> © 2024, Recruit Wave Website</h5>

      </div>
      
      </footer>
       
    </div>
  );
}                                                                             

export default Home_page;
