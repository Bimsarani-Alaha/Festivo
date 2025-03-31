import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./index.css";

// User Components
import SignUp from './Components/views/User/SignUp';
import LoginForm from './Components/views/User/Login';
import FeedbackPage from './Components/views/User/Feedback/Feedback';
import UserManagementDashboard from './Components/views/Admin/UserManagement';
import Eventbooking from './Components/views/User/EventBooking/EventBooking';
import EventBookingsTable from './Components/views/User/EventBooking/EventBookingData';
import FeedbackList from './Components/views/User/Feedback/FeedbackData';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/FeedbackPage" element={<FeedbackPage />} />
        <Route path="/UserManagementDashboard" element={<UserManagementDashboard />} />
        <Route path="/Eventbooking" element={<Eventbooking />} />
        <Route path="/EventBookingsTable" element={<EventBookingsTable />} />
        <Route path="/FeedbackList" element={<FeedbackList />} />


      </Routes>
    </Router>
  );
};

export default App;
