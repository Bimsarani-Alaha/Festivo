import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./index.css";

// User Components
import SignUp from './Components/views/User/SignUp';
import LoginForm from './Components/views/User/Login';
import FeedbackPage from './Components/views/User/Feedback/Feedback';
import UserManagementDashboard from './Components/views/Admin/UserManagement';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/FeedbackPage" element={<FeedbackPage />} />
        <Route path="/UserManagementDashboard" element={<UserManagementDashboard />} />
       
       
      </Routes>
    </Router>
  );
};

export default App;
