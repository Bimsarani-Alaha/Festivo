import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "./UserService";
import CompanyLogo from "../Images/Logo.jpg";

type FormData = {
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: "USER";
};

type FormErrors = {
  name?: string;
  email?: string;
  gender?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    gender: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for name field to only allow letters and spaces
    if (name === "name") {
      const lettersOnlyValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData({
        ...formData,
        [name]: lettersOnlyValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }

    if (apiError) setApiError("");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Full name should only contain letters";
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.phoneNumber.match(/^\d{10}$/)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit number";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // Remove confirmPassword from the data being sent to the API
      const { confirmPassword, ...userData } = formData;
      await UserService.register(userData);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        }
      }

      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/LoginForm");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FAEAB1] via-[#E5BA73] to-[#C58940] bg-fixed">
      <div className="max-w-md w-full mx-auto bg-[#FAF3E0] p-8 rounded-xl shadow-2xl border border-[#C58940]">
        <div className="flex justify-center mb-8">
          <img 
            src={CompanyLogo} 
            alt="Company Logo" 
            className="h-20 object-contain transition-transform hover:scale-105" 
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-3 text-[#C58940]">
          Create Account <span className="text-yellow-500">✨</span>
        </h1>
        <p className="text-[#8D6E63] text-center mb-8 text-sm">
          Join our exclusive community today! <span className="text-yellow-500">🎊</span>
        </p>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border ${errors.name ? 'border-red-500' : 'border-[#C58940]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C58940] bg-white placeholder-[#BCAAA4] text-[#5D4037]`} 
              placeholder="👤 Full Name"
              pattern="[a-zA-Z\s]*"
              title="Only letters and spaces are allowed"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="relative">
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border ${errors.email ? 'border-red-500' : 'border-[#C58940]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C58940] bg-white placeholder-[#BCAAA4] text-[#5D4037]`} 
              placeholder="✉️ Email Address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <select 
                id="gender" 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-10 border ${errors.gender ? 'border-red-500' : 'border-[#C58940]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C58940] bg-white text-[#5D4037]`}
              >
                <option value="">⚥ Select Gender</option>
                <option value="MALE">♂️ Male</option>
                <option value="FEMALE">♀️ Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div className="relative">
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  handleChange({
                    target: {
                      name: e.target.name,
                      value: value
                    }
                  } as unknown as ChangeEvent<HTMLInputElement>);
                }}
                className={`w-full px-4 py-3 pl-10 border ${errors.phoneNumber ? 'border-red-500' : 'border-[#C58940]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C58940] bg-white placeholder-[#BCAAA4] text-[#5D4037]`} 
                placeholder="📱 Phone Number"
                maxLength={10}
                inputMode="numeric"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="relative">
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border ${errors.password ? 'border-red-500' : 'border-[#C58940]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C58940] bg-white placeholder-[#BCAAA4] text-[#5D4037]`} 
              placeholder="🔒 Password (min 8 chars)"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-[#C58940]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C58940] bg-white placeholder-[#BCAAA4] text-[#5D4037]`} 
              placeholder="🔒 Confirm Password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full bg-[#C58940] text-white py-3 px-4 rounded-lg hover:bg-[#B17A3A] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C58940] focus:ring-offset-2 mt-4 font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-[#8D6E63] mt-4">
            Already have an account?{" "}
            <button
              type="button"
              className="text-[#C58940] hover:text-[#B17A3A] font-medium hover:underline"
              onClick={() => navigate("/loginForm")}
            >
              Sign in 🔑
            </button>
          </p>
        </form>

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-xl font-bold text-[#C58940] mb-2">Registration Successful!</h2>
              <p className="mb-6 text-gray-700">
                Your account has been created successfully. You can now login with your credentials.
              </p>
              <button
                type="button"
                onClick={closeSuccessModal}
                className="px-6 py-2 bg-[#C58940] text-white rounded-lg hover:bg-[#B17A3A]"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;