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
import CheckoutPage from "../src/Components/views/Payment/Paymentform";
import DataTable from "../src/Components/views/Payment/PaymentData"
import CreateEventPage from "./views/eventThemePage/EventThemePage";
import DisplayEventTheme from "./views/eventThemePage/DisplayEventTheme";
import SupplierSignup from "./Components/views/Supplier/SupplierSignup.tsx";
import SupplierLogin from "./Components/views/Supplier/SupplierLogin.tsx";
import SupplierPage from "./views/supplierPage/SupplierPage.tsx"
import AllEventThemes from "./views/eventThemePage/allEventThemes.tsx";
import AddProductPage from "./views/SupplierProducts/AddProductPage.tsx";
import SupplierOnboardingForm from "./views/supplierPage/SupplierOnboardingForm.tsx";
import AdminSupplierProducts from "./views/adminPage/AdminSupplierProducts.tsx";
import SupplierPaymentPage from "./views/adminPage/SupplierPaymentPage.tsx";



const AdminProtectedRoute = () => {
    const role = getRole();

    if (role != "ADMIN") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

const SupplierProtectedRoute = () => {
    const role = getRole();

    if (role != "SUPPLIER") {
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
            <Route path="/SupplierLogin" element={<SupplierLogin />} />
            <Route path="/SupplierSignup" element={<SupplierSignup />} />
            <Route
                path="/DisplayEventTheme/:eventName"
                element={<DisplayEventTheme />}
            />


            <Route element={<UserProtectedRoute />}>
                <Route path="/FeedbackPage" element={<FeedbackPage />} />
                <Route path="/Eventbooking" element={<Eventbooking />} />
                <Route path="/CheckoutPage" element={<CheckoutPage />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/FeedbackList" element={<FeedbackList />} />
                <Route path="/EventBookingsTable" element={<EventBookingsTable />} />
                <Route path="/DataTable" element={<DataTable />} />
                <Route
                    path="/UserManagementDashboard"
                    element={<UserManagementDashboard />}
                />
                <Route
                    path="/admin/EventTheme"
                    element={<CreateEventPage />}
                />
                <Route
                    path="/admin/allEventThemes"
                    element={<AllEventThemes />}
                />
                <Route
                    path="/admin/supplierProducts"
                    element={<AdminSupplierProducts />}
                />
                <Route
                    path="/admin/supplierAcceptedProducts"
                    element={<SupplierPaymentPage />}
                />


            </Route>
            <Route element={<SupplierProtectedRoute />}>
                <Route path="/supplier/SupplierPage" element={<SupplierPage />} />
                <Route path="/supplier/addItem" element={<AddProductPage />} />
                <Route path="/supplier/supplierOnboardingForm" element={<SupplierOnboardingForm />} />

            </Route>

        </Routes>
    );
};

export default AppRoutes;//upload
