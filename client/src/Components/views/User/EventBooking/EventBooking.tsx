import { useState, useEffect } from 'react';

interface EventData {
  eventName: string;
  eventTheme: string;
  eventDate: string;
  eventType: string;
  noOfGuest: number;
  specialRequest: string;
  eventPackage: 'Basic' | 'Premium' | 'Luxury';
}

const EventBooking = () => {
  const [eventName, setEventName] = useState('Birthday');
  const [eventTheme, setEventTheme] = useState('Fairy Tale Magic');
  const [eventType, setEventType] = useState<'Indoor' | 'Outdoor' | 'Pool' | ''>('');
  const [guestCount, setGuestCount] = useState(0);
  const [specialRequest, setSpecialRequest] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<'Basic' | 'Premium' | 'Luxury' | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [touchedFields, setTouchedFields] = useState({
    eventName: false,
    eventTheme: false,
    eventDate: false,
    eventType: false,
    guestCount: false,
    package: false
  });

  // Set minimum date to today
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const incrementGuests = () => {
    setGuestCount(prev => prev + 1);
    setTouchedFields(prev => ({ ...prev, guestCount: true }));
  };

  const decrementGuests = () => {
    setGuestCount(prev => Math.max(0, prev - 1));
    setTouchedFields(prev => ({ ...prev, guestCount: true }));
  };

  const handleBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!eventName.trim()) {
      errors.push('Event name is required');
    } else if (eventName.trim().length < 3) {
      errors.push('Event name must be at least 3 characters');
    }

    if (!eventTheme.trim()) {
      errors.push('Event theme is required');
    } else if (eventTheme.trim().length < 3) {
      errors.push('Event theme must be at least 3 characters');
    }

    if (!eventDate) {
      errors.push('Event date is required');
    } else if (new Date(eventDate) < new Date(minDate)) {
      errors.push('Event date must be today or in the future');
    }

    if (!eventType) {
      errors.push('Event type is required');
    }

    if (guestCount <= 0) {
      errors.push('Number of guests must be at least 1');
    }

    if (!selectedPackage) {
      errors.push('Please select a package');
    }

    setError(errors.join(', '));
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouchedFields({
      eventName: true,
      eventTheme: true,
      eventDate: true,
      eventType: true,
      guestCount: true,
      package: true
    });

    if (!validateForm()) return;

    const eventData: EventData = {
      eventName,
      eventTheme,
      eventDate,
      eventType,
      noOfGuest: guestCount,
      specialRequest,
      eventPackage: selectedPackage as 'Basic' | 'Premium' | 'Luxury'
    };

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/public/addEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const result = await response.json();
      console.log('Booking successful:', result);
      
      // Show success message
      setShowSuccess(true);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred while submitting the booking');
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error submitting booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEventName('Birthday');
    setEventTheme('Fairy Tale Magic');
    setEventType('');
    setGuestCount(0);
    setSpecialRequest('');
    setSelectedPackage(null);
    setEventDate('');
    setError('');
    setTouchedFields({
      eventName: false,
      eventTheme: false,
      eventDate: false,
      eventType: false,
      guestCount: false,
      package: false
    });
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-grow p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-6">
            <h1 className="text-2xl font-bold">Event Booking Form</h1>
            <p className="text-yellow-100 mt-1">Plan your perfect event with us</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Advanced Success Popup */}
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 animate-pop-in">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-6">Your event has been successfully booked. We've sent a confirmation to your email.</p>
                  
                  <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-700 mb-3">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Event:</span>
                        <span className="font-medium">{eventName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Theme:</span>
                        <span className="font-medium">{eventTheme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{new Date(eventDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Package:</span>
                        <span className="font-medium">{selectedPackage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Guests:</span>
                        <span className="font-medium">{guestCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={resetForm}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    Create Another Booking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Event Details Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event name:</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  onBlur={() => handleBlur('eventName')}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    touchedFields.eventName && !eventName.trim() ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  minLength={3}
                  maxLength={50}
                />
                {touchedFields.eventName && !eventName.trim() && (
                  <p className="text-red-500 text-xs mt-1">Event name is required</p>
                )}
                {touchedFields.eventName && eventName.trim().length > 0 && eventName.trim().length < 3 && (
                  <p className="text-red-500 text-xs mt-1">Event name must be at least 3 characters</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Theme:</label>
                <input
                  type="text"
                  value={eventTheme}
                  onChange={(e) => setEventTheme(e.target.value)}
                  onBlur={() => handleBlur('eventTheme')}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    touchedFields.eventTheme && !eventTheme.trim() ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  minLength={3}
                  maxLength={50}
                />
                {touchedFields.eventTheme && !eventTheme.trim() && (
                  <p className="text-red-500 text-xs mt-1">Event theme is required</p>
                )}
                {touchedFields.eventTheme && eventTheme.trim().length > 0 && eventTheme.trim().length < 3 && (
                  <p className="text-red-500 text-xs mt-1">Event theme must be at least 3 characters</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <div className={`flex items-center p-3 border rounded-md ${
                  touchedFields.eventDate && !eventDate ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <span className="mr-2">📅</span>
                  <input
                    type="date"
                    value={eventDate}
                    min={minDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    onBlur={() => handleBlur('eventDate')}
                    className="flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-transparent"
                    required
                  />
                </div>
                {touchedFields.eventDate && !eventDate && (
                  <p className="text-red-500 text-xs mt-1">Event date is required</p>
                )}
                {touchedFields.eventDate && eventDate && new Date(eventDate) < new Date(minDate) && (
                  <p className="text-red-500 text-xs mt-1">Please select today or a future date</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type:</label>
                <div className={`p-3 border rounded-md ${
                  touchedFields.eventType && !eventType ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="eventType"
                        checked={eventType === 'Indoor'}
                        onChange={() => setEventType('Indoor')}
                        onBlur={() => handleBlur('eventType')}
                        className="text-yellow-600 focus:ring-yellow-500"
                        required
                      />
                      <span className="ml-2">Indoor</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="eventType"
                        checked={eventType === 'Outdoor'}
                        onChange={() => setEventType('Outdoor')}
                        onBlur={() => handleBlur('eventType')}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2">Outdoor</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="eventType"
                        checked={eventType === 'Pool'}
                        onChange={() => setEventType('Pool')}
                        onBlur={() => handleBlur('eventType')}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2">Pool</span>
                    </label>
                  </div>
                </div>
                {touchedFields.eventType && !eventType && (
                  <p className="text-red-500 text-xs mt-1">Please select an event type</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests:</label>
                <div className={`flex items-center p-3 border rounded-md ${
                  touchedFields.guestCount && guestCount <= 0 ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <button
                    type="button"
                    onClick={decrementGuests}
                    className="px-4 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300 transition-colors"
                    disabled={guestCount <= 0}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 bg-gray-100 text-center flex-1">{guestCount}</span>
                  <button
                    type="button"
                    onClick={incrementGuests}
                    className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                {touchedFields.guestCount && guestCount <= 0 && (
                  <p className="text-red-500 text-xs mt-1">At least 1 guest is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special request:</label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Type Here...."
                  className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {specialRequest.length}/500 characters
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              {/* Packages */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Package:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Basic', 'Premium', 'Luxury'].map((pkg) => (
                    <div 
                      key={pkg}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPackage === pkg 
                          ? 'border-yellow-500 ring-2 ring-yellow-200 bg-yellow-50' 
                          : 'border-gray-200 hover:border-yellow-300'
                      } ${
                        touchedFields.package && !selectedPackage ? 'ring-1 ring-red-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedPackage(pkg as 'Basic' | 'Premium' | 'Luxury');
                        setTouchedFields(prev => ({ ...prev, package: true }));
                      }}
                    >
                      <h3 className="font-bold text-lg mb-2">{pkg}</h3>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        {pkg === 'Basic' && (
                          <>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Simple decor
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Basic Photography
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Standard Catering
                            </li>
                          </>
                        )}
                        {pkg === 'Premium' && (
                          <>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Custom decor
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Pro Photography
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Themed Catering
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Live streaming
                            </li>
                          </>
                        )}
                        {pkg === 'Luxury' && (
                          <>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Highend decor
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Cinematic coverage
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Premium Catering
                            </li>
                            <li className="flex items-center">
                              <span className="mr-2">•</span> Live entertainment
                            </li>
                          </>
                        )}
                      </ul>
                      <p className="font-bold text-lg">
                        Rs. {pkg === 'Basic' ? '30,000.00' : pkg === 'Premium' ? '50,000.00' : '80,000.00'}
                      </p>
                    </div>
                  ))}
                </div>
                {touchedFields.package && !selectedPackage && (
                  <p className="text-red-500 text-sm mt-2">Please select a package</p>
                )}
              </div>

              {/* Pay Now Button */}
              <div className="mt-8">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-medium text-lg disabled:opacity-50 shadow-lg hover:shadow-yellow-200/50 flex items-center justify-center"
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
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-yellow-600 to-yellow-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="bg-white text-yellow-600 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
                Festivo Events
              </h3>
              <p className="mb-4 text-yellow-100">
                Creating unforgettable experiences with golden touches since 2015.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-yellow-500 pb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-yellow-500 pb-2">Contact Us</h4>
              <address className="not-italic space-y-2">
                <div className="flex items-start">
                  <svg className="h-5 w-5 mt-0.5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-yellow-100">123 Golden Avenue, Event City</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-yellow-100">0707230078</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-yellow-100">festivo@gmail.com</span>
                </div>
              </address>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-yellow-500 mt-8 pt-8 text-center text-yellow-200">
            <p>&copy; {new Date().getFullYear()} Festivo Event Planners. All rights reserved.</p>
          </div>
        </div>
      </footer>
     
    </div>
  );
};

export default EventBooking;