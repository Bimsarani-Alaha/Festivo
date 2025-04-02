import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SignUp from "./Components/views/User/SignUp";
import LoginForm from "./Components/views/User/Login";
import FeedbackPage from "./Components/views/User/Feedback/Feedback";
import UserManagementDashboard from "./Components/views/Admin/UserManagement";
import Eventbooking from "./Components/views/User/EventBooking/EventBooking";
import EventBookingsTable from "./Components/views/User/EventBooking/EventBookingData";
import FeedbackList from "./Components/views/User/Feedback/FeedbackData";
import HomePage from "./views/homePage/HomePage";
import AdminDashboard from "./views/adminPage/AdminPage";
import { getRole } from "./customHooks/roleExtract";
import getUserDetails from "./customHooks/extractJwt";

const AdminProtectedRoute = () => {
  const role = getRole();

  if (role != "ADMIN") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const UserProtectedRoute = () => {
  const userDetails = getUserDetails();
  const user = userDetails?.sub;

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/LoginForm" element={<LoginForm />} />

      <Route element={<UserProtectedRoute />}>
        <Route path="/FeedbackPage" element={<FeedbackPage />} />
        <Route path="/Eventbooking" element={<Eventbooking />} />
      </Route>

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/FeedbackList" element={<FeedbackList />} />
        <Route path="/EventBookingsTable" element={<EventBookingsTable />} />
        <Route
          path="/UserManagementDashboard"
          element={<UserManagementDashboard />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
