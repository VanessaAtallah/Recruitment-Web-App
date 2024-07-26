import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Appsignup from './signup/Appsignup';
import Appsignin from './SignIn/appsignin';
import Recsignup from './signup/recsignup';
import Recsignin from './SignIn/recsignin';
import CreateJob from './Addjob/CreateJob';
import Editordeletejob from './Addjob/Editordeletejob';
import AllJobs from './AllJobs/AllJobs';
import Interview from './Interviews/Interview';
import WelcomePage from './Welcome/WelcomePage';
import UpdateJob from './Addjob/UpdateJob';
import ViewJob from './Addjob/ViewJob';
import Test from './Assessment/Test';
import ApplicantsPage from './Addjob/ApplicantsPage';
import Applications from './Applications/Applications';
import AllAssessments from './DisplayAssessment/AllAssessments';
import AssessmentCorrectionPage from './DisplayAssessment/AssessmentCorrectionPage';

import Communication from './AppCommunication/Communication';
import RecCommunication from './AppCommunication/RecCommunication'

import DeleteAppAcc from './DeleteAccounts/DeleteAppAcc';
import DeleteRecAcc from './DeleteAccounts/DeleteRecAcc';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/Recsignin" element={<Recsignin />} />
        <Route path="/Recsignup" element={<Recsignup />} />
        <Route path="/Appsignin" element={<Appsignin />} />
        <Route path="/Appsignup" element={<Appsignup />} />
        <Route path="/AllJobs" element={<AllJobs />} />
        <Route path="/Addjob" element={<CreateJob />} />
        <Route path="/EditOrDeleteJobs" element={<Editordeletejob />} />
        <Route path="/applicants/:jobId" element={<ApplicantsPage />} />
        <Route path="/Interview" element={<Interview />} />
        <Route path="/UpdateJob" element={<UpdateJob />} />
        <Route path="/ViewJob" element={<ViewJob />} />
        <Route path="/AllAssessments" element={<AllAssessments />} />
        <Route path="/questions/:assessmentId" element={<AssessmentCorrectionPage />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/Applications" element={<Applications />} />

        <Route path ="/Communication" element={<Communication />} />
        <Route path ="/RecCommunication" element={<RecCommunication />} />

        <Route path="/ApplicantProfile" element={<DeleteAppAcc/>}/>
        <Route path="/RecruiterProfile" element={<DeleteRecAcc/>}/>

      </Routes>
    </div>
  );
}

export default App;
