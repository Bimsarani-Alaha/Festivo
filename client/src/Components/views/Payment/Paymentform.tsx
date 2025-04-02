import React, { useState, useEffect } from "react";
import visaCard from "../Images/payment.jpeg";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface EventBookingData {
  eventName: string;
  eventTheme: string;
  eventDate: string;
  eventType: string;
  noOfGuest: number;
  specialRequest: string;
  eventPackage: 'Basic' | 'Premium' | 'Luxury';
  packagePrice: number;
}

interface CheckoutFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  cardNumber: string;
  cardType: string;
  expDate: string;
  cvv: string;
  orderSummary: string;
  amount: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  cardNumber?: string;
  cardType?: string;
  expDate?: string;
  cvv?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [bookingData, setBookingData] = useState<EventBookingData>(
    location.state?.bookingData || {
      eventName: 'Birthday Party',
      eventTheme: 'Fairy Tale Magic',
      eventDate: new Date().toISOString().split('T')[0],
      eventType: 'Indoor',
      noOfGuest: 50,
      specialRequest: 'Need vegetarian options',
      eventPackage: 'Premium',
      packagePrice: 50000 // Rs. 50,000 for Premium package
    }
  );

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    cardNumber: "",
    cardType: "Visa",
    expDate: "",
    cvv: "",
    orderSummary: `Event: ${bookingData.eventName}, Package: ${bookingData.eventPackage}`,
    amount: bookingData.packagePrice
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{show: boolean, message: string, transactionId?: string}>({show: false, message: ''});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      orderSummary: `Event: ${bookingData.eventName}, Theme: ${bookingData.eventTheme}, Package: ${bookingData.eventPackage}`,
      amount: bookingData.packagePrice
    }));
  }, [bookingData]);

  // Countdown timer for success message
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success.show) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        navigateToSuccessPage();
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success.show, countdown]);

  const navigateToSuccessPage = () => {
    navigate('/payment-success', {
      state: {
        paymentData: {
          ...formData,
          transactionId: success.transactionId || Date.now().toString()
        },
        bookingData
      }
    });
  };

  // Advanced validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 3) return "Name must be at least 3 characters";
    if (!/^[a-zA-Z\s]*$/.test(name)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits";
    return "";
  };

  const validateAddress = (address: string) => {
    if (!address.trim()) return "Address is required";
    if (address.trim().length < 10) return "Address must be at least 10 characters";
    return "";
  };

  const validateCardNumber = (cardNumber: string) => {
    if (!cardNumber) return "Card number is required";
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return "Card number must be 13-19 digits";
    if (!luhnCheck(cleaned)) return "Invalid card number";
    return "";
  };

  const validateExpDate = (expDate: string) => {
    if (!expDate) return "Expiration date is required";
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expDate)) return "Invalid format (MM/YY)";
    
    const [month, year] = expDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return "Card has expired";
    }
    return "";
  };

  const validateCVV = (cvv: string, cardType: string) => {
    if (!cvv) return "CVV is required";
    if (cardType === "American Express") {
      if (!/^\d{4}$/.test(cvv)) return "American Express requires 4-digit CVV";
    } else {
      if (!/^\d{3}$/.test(cvv)) return "CVV must be 3 digits";
    }
    return "";
  };

  // Luhn algorithm for card validation
  const luhnCheck = (cardNumber: string): boolean => {
    let sum = 0;
    for (let i = 0; i < cardNumber.length; i++) {
      let digit = parseInt(cardNumber[i]);
      if ((cardNumber.length - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name': return validateName(value);
      case 'email': return validateEmail(value);
      case 'phoneNumber': return validatePhone(value);
      case 'address': return validateAddress(value);
      case 'cardNumber': return validateCardNumber(value);
      case 'expDate': return validateExpDate(value);
      case 'cvv': return validateCVV(value, formData.cardType);
      default: return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
    }
    // Format expiration date with slash
    else if (name === 'expDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substring(0, 5);
    }
    // Limit CVV length based on card type
    else if (name === 'cvv') {
      const maxLength = formData.cardType === "American Express" ? 4 : 3;
      formattedValue = value.replace(/\D/g, '').substring(0, maxLength);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Validate field if it's been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, formattedValue)
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phoneNumber: validatePhone(formData.phoneNumber),
      address: validateAddress(formData.address),
      cardNumber: validateCardNumber(formData.cardNumber),
      cardType: formData.cardType ? "" : "Card type is required",
      expDate: validateExpDate(formData.expDate),
      cvv: validateCVV(formData.cvv, formData.cardType)
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      cardNumber: true,
      cardType: true,
      expDate: true,
      cvv: true
    });

    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess({show: false, message: ''});

    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data for the backend
      const paymentData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardType: formData.cardType,
        expDate: formData.expDate,
        cvv: formData.cvv,
        orderSummery: formData.orderSummary,
        amount: formData.amount,
        eventDetails: {
          eventName: bookingData.eventName,
          eventTheme: bookingData.eventTheme,
          eventDate: bookingData.eventDate,
          eventType: bookingData.eventType,
          noOfGuest: bookingData.noOfGuest,
          specialRequest: bookingData.specialRequest,
          eventPackage: bookingData.eventPackage,
          packagePrice: bookingData.packagePrice
        }
      };

      // Send the payment data to the backend
      const response = await axios.post('http://localhost:8080/public/addPayment', paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        const transactionId = response.data.transactionId || Date.now().toString();
        setSuccess({
          show: true,
          message: `Payment confirmed for Rs. ${(formData.amount * 1.1 / 100).toFixed(2)}`,
          transactionId
        });
        setCountdown(5);
        console.log('Payment successful:', response.data);
      } else {
        throw new Error('No response data received');
      }
    } catch (err: any) {
      let errorMessage = 'Payment processing failed. Please try again.';
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = err.response.data?.message || 
                         `Server error: ${err.response.status} - ${err.response.statusText}`;
        } else if (err.request) {
          errorMessage = 'No response received from server. Please check your connection.';
        } else {
          errorMessage = `Request error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-50 flex justify-center items-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-4xl border-2 border-yellow-400 relative">
        {/* Success Message Overlay */}
        {success.show && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full animate-fade-in">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-3">Payment Successful!</h3>
                <div className="mt-2 px-4 py-3">
                  <p className="text-sm text-gray-600">{success.message}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-left text-sm">
                    <div>
                      <p className="font-medium text-gray-500">Transaction ID:</p>
                      <p className="text-gray-900">{success.transactionId}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Amount:</p>
                      <p className="text-gray-900">Rs. {(formData.amount * 1.1 / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Card:</p>
                      <p className="text-gray-900">
                        {formData.cardType} •••• {formData.cardNumber.slice(-4)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Event:</p>
                      <p className="text-gray-900">{bookingData.eventName}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">
                    You'll be redirected to the confirmation page in {countdown} seconds...
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
                    onClick={navigateToSuccessPage}
                  >
                    Go to Confirmation Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gold Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-t-lg -m-6 mb-6 p-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="text-yellow-100 hover:text-white transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <h2 className="text-xl font-semibold text-white">Event Payment</h2>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Section */}
            <div className="md:col-span-2">
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Full Name {touched.name && errors.name && (
                        <span className="text-red-500 text-xs ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {touched.name && errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Email {touched.email && errors.email && (
                        <span className="text-red-500 text-xs ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Phone Number {touched.phoneNumber && errors.phoneNumber && (
                        <span className="text-red-500 text-xs ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">
                  Address {touched.address && errors.address && (
                    <span className="text-red-500 text-xs ml-1">*</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {touched.address && errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
                  Payment Information
                </h3>
                
                {/* Card Type Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Card Type {touched.cardType && errors.cardType && (
                      <span className="text-red-500 text-xs ml-1">*</span>
                    )}
                  </label>
                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white ${
                      touched.cardType && errors.cardType ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                  {touched.cardType && errors.cardType && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardType}</p>
                  )}
                </div>
                
                {/* Card Image */}
                {formData.cardType === "Visa" && (
                  <div className="mb-4">
                    <img 
                      src={visaCard} 
                      alt="Visa Card" 
                      className="w-40 h-auto object-contain border-2 border-yellow-300 rounded-lg p-2 bg-yellow-50" 
                    />
                  </div>
                )}
                
                {/* Card Details */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Card Number {touched.cardNumber && errors.cardNumber && (
                        <span className="text-red-500 text-xs ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        touched.cardNumber && errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {touched.cardNumber && errors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Exp. Date {touched.expDate && errors.expDate && (
                          <span className="text-red-500 text-xs ml-1">*</span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="expDate"
                          placeholder="MM/YY"
                          value={formData.expDate}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                            touched.expDate && errors.expDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {touched.expDate && errors.expDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.expDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        CVV {touched.cvv && errors.cvv && (
                          <span className="text-red-500 text-xs ml-1">*</span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cvv"
                          placeholder={formData.cardType === "American Express" ? "1234" : "123"}
                          value={formData.cvv}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                            touched.cvv && errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      {touched.cvv && errors.cvv && (
                        <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Confirm Payment Button */}
              <button 
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition-colors font-medium shadow-md flex items-center justify-center mt-4 disabled:bg-yellow-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Confirm Payment Rs. {(formData.amount * 1.1 / 100).toFixed(2)}
                  </>
                )}
              </button>
            </div>
            
            {/* Order Summary */}
            <div className="bg-yellow-50 p-5 rounded-lg border-2 border-yellow-200">
              <h3 className="text-lg font-medium mb-4 pb-3 border-b border-yellow-300 text-yellow-800">
                Event Booking Summary
              </h3>
              
              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-800">Event Details</h4>
                  <div className="mt-2 space-y-2 text-sm text-gray-700">
                    <p><span className="font-medium">Event Name:</span> {bookingData.eventName}</p>
                    <p><span className="font-medium">Theme:</span> {bookingData.eventTheme}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(bookingData.eventDate)}</p>
                    <p><span className="font-medium">Type:</span> {bookingData.eventType}</p>
                    <p><span className="font-medium">Guests:</span> {bookingData.noOfGuest}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800">Package Details</h4>
                  <div className="mt-2 space-y-2 text-sm text-gray-700">
                    <p><span className="font-medium">Package:</span> {bookingData.eventPackage}</p>
                    <p><span className="font-medium">Special Requests:</span> {bookingData.specialRequest || 'None'}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Totals */}
              <div className="border-t border-yellow-300 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Package Price</span>
                  <span>Rs. {(bookingData.packagePrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>Rs. {(bookingData.packagePrice * 0.1 / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-yellow-900 pt-2 text-lg">
                  <span>Total Amount</span>
                  <span>Rs. {(formData.amount * 1.1 / 100).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Payment Info */}
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md mt-4 text-sm">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Payment Information</span>
                </div>
                <p className="text-xs">Your payment will be processed securely. A confirmation will be sent to your email.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;