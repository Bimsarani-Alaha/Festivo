import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';


interface ThemePackage {
  id: number | string;
  packageName: string;
  packagePrice: number;
  description: string;
}

interface ThemeData {
  id: string;
  themeName: string;
  eventName: string;
  color: string;
  price: number;
  description?: string;
  featured?: boolean;
  img?: string;
}

interface EventData {
  eventName: string;
  eventTheme: string;
  eventDate: string;
  eventType: 'Indoor' | 'Outdoor' | 'Pool' | '';
  noOfGuest: number;
  specialRequest: string;
  selectedPackage?: ThemePackage;
  packageId?: number | string;  // Add this to match your backend
  packageName?: string;        // Add these fields to make it easier
  packagePrice?: number;       // for backend processing
}

const EventBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTheme = location.state?.selectedTheme as ThemeData | undefined;
  const selectedPackageFromTheme = location.state?.selectedPackage as ThemePackage | undefined;


// Initialize form state with theme data if available
  const [eventName, setEventName] = useState(selectedTheme?.eventName || 'Birthday');
  const [eventTheme, setEventTheme] = useState(selectedTheme?.themeName || 'Fairy Tale Magic');
  const [eventType, setEventType] = useState<'Indoor' | 'Outdoor' | 'Pool' | ''>('');
  const [guestCount, setGuestCount] = useState(0);
  const [specialRequest, setSpecialRequest] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<ThemePackage | null>(selectedPackageFromTheme || null);
  const [eventDate, setEventDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

    setError(errors.join(', '));
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      selectedPackage: selectedPackage || undefined,
      // Add these fields to match your backend requirements
      packageId: selectedPackage?.id,
      packageName: selectedPackage?.packageName,
      packagePrice: selectedPackage?.packagePrice
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
      navigate('/CheckoutPage', { 
        state: { 
          bookingData: eventData,
          bookingId: result.id || Date.now(),
          themeData: selectedTheme
        } 
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error submitting booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEventName(selectedTheme?.eventName || 'Birthday');
    setEventTheme(selectedTheme?.themeName || 'Fairy Tale Magic');
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
  };

  // Get the theme color or default to yellow
  const themeColor = selectedTheme?.color || 'yellow';
  
  // Safely generate gradient classes
  const getGradientClasses = (color: string) => {
    const safeColors = ['yellow', 'blue', 'green', 'red', 'purple', 'pink', 'indigo'];
    const baseColor = safeColors.includes(color) ? color : 'yellow';
    
    return {
      header: `from-${baseColor}-600 to-${baseColor}-700`,
      button: `from-${baseColor}-500 to-${baseColor}-600 hover:from-${baseColor}-600 hover:to-${baseColor}-700`,
      footer: `from-${baseColor}-600 to-${baseColor}-800`,
      text: `text-${baseColor}-100`,
      focus: `focus:ring-${baseColor}-500 focus:border-${baseColor}-500`,
      border: `border-${baseColor}-500`
    };
  };

  const gradientClasses = getGradientClasses(themeColor);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-grow p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with dynamic color */}
          <div className={`bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-6`}>
            <h1 className="text-2xl font-bold">Event Booking Form</h1>
            <p className={`text-yellow-100 mt-1`}>
              {selectedTheme ? `Booking for ${selectedTheme.themeName}` : 'Plan your perfect event with us'}
            </p>
          </div>

           {/* Theme Preview Section */}
          {selectedTheme && (
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row gap-6">
                {selectedTheme.img && (
                  <img 
                    src={selectedTheme.img} 
                    alt={selectedTheme.themeName}
                    className="w-full md:w-1/3 h-48 object-cover rounded-lg border"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{selectedTheme.themeName}</h3>
                  <p className="text-gray-600 mt-2">{selectedTheme.description}</p>
                  <div className="mt-3 flex items-center">
                    <AttachMoneyIcon className="text-gray-700 mr-1" />
                    <span className="font-medium">Starting from Rs. {selectedTheme.price.toLocaleString()}</span>
                  </div>

                     {/* Display selected package if available */}
                  {selectedPackage && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-bold text-gray-800">Selected Package:</h4>
                      <div className="flex justify-between mt-1">
                        <span className="font-medium">{selectedPackage.packageName}</span>
                        <span className="font-bold text-yellow-700">
                          Rs. {selectedPackage.packagePrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{selectedPackage.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
                  className={`w-full p-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
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
                  className={`w-full p-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
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
              {/* confirm Button */}
              <div className="mt-8">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-4 px-6 rounded-lg transition-all duration-300 font-medium text-lg disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center"
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
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventBooking;