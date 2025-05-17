import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons';
import UserService from './UserService';
import companyLogo from '../Images/Logo.jpg';

interface TokenPayload {
  exp: number;
  [key: string]: any;
}

interface User {
  name?: string;
  email?: string;
  [key: string]: any;
}

interface LoginResponse {
  token: string;
  role: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  refreshToken: string;
  expirationTime: string;
  message: string;
  statusCode: number;
}

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const decodeToken = (token: string): TokenPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await UserService.login(email, password) as LoginResponse;
      console.log('Login API Response:', response);
  
      if (response.token) {
        console.log('JWT Token:', response.token);
        
        const decodedToken = decodeToken(response.token);
        if (decodedToken) {
          console.log('Decoded Token Payload:', decodedToken);
          console.log('Token Expiration:', new Date(decodedToken.exp * 1000));
        }
  
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
  
        if (response.role === 'SUPPLIER') {
          // If the user is a SUPPLIER, prevent the login
          throw new Error('Suppliers are not allowed to log in.');
        }
  
        // Store user details directly from response
        localStorage.setItem('name', response.name || '');
        localStorage.setItem('email', response.email || '');
        localStorage.setItem('phoneNumber', response.phoneNumber || '');
        
        console.log('Stored user data:', {
          name: localStorage.getItem('name'),
          email: localStorage.getItem('email'),
          phoneNumber: localStorage.getItem('phoneNumber')
        });
  
        if (response.role === 'ADMIN') { //if a admin login to the page
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.warn('Login successful but no token received');
        throw new Error('Authentication failed - no token received');
      }
    } catch (err: any) {
      console.error('Login error details:', {
        error: err,
        response: err.response,
        request: err.request,
        message: err.message
      });
  
      if (err.response) {
        setError(err.response.data?.message || `Login failed (Status: ${err.response.status})`);
      } else if (err.request) {
        setError('No response from server. Check your connection.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col relative" style={{
      background: "linear-gradient(135deg, #FAEAB1 0%, #E5BA73 50%, #C58940 100%)",
      backgroundAttachment: 'fixed'
    }}>
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md relative">
          {/* Form Container */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-xl border border-[#E5BA73]"
          >
            {/* Company Logo */}
            <div className="flex justify-center mb-6">
              <div className="transition-transform duration-300 hover:scale-105 p-2 bg-[#C58940]/10 rounded-full border-2 border-[#C58940]/30">
                <img 
                  src={companyLogo} 
                  alt="Company Logo" 
                  className="h-20 w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = 'https://via.placeholder.com/150?text=Company+Logo';
                  }}
                />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#5D4037]">Welcome Back!</h2>
              <p className="mt-2 text-base text-gray-600">Login to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C58940] focus:border-[#C58940] bg-white text-gray-700 placeholder-gray-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C58940] focus:border-[#C58940] bg-white text-gray-700 placeholder-gray-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full bg-[#C58940] text-white py-3 px-4 text-lg font-semibold rounded-md hover:bg-[#B17A3A] transition duration-300 shadow-md ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm space-y-2">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/SignUp" className="text-[#C58940] hover:text-[#B17A3A] font-semibold underline underline-offset-4">
                  Create Account
                </Link>
              </p>
              <p className="text-gray-600">
                If you are a supplier,{' '}
                <Link to="/SupplierLogin" className="text-[#C58940] hover:text-[#B17A3A] font-semibold underline underline-offset-4">
                  click here
                </Link>
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
