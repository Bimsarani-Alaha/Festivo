import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../src/Components/views/User/SignUp';
import LoginForm from '../src/Components/views/User/Login';
import "./index.css"

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default App;