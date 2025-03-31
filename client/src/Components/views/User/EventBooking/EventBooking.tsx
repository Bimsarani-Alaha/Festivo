import { useState } from 'react';

interface EventData {
  eventName: string;
  eventTheme: string;
  eventDate: string;
  eventType: string;
  noOfGuest: number;
  specialRequest: string;
  eventPackage: string;
}

const EventBooking = () => {
  const [eventName, setEventName] = useState('Birthday');
  const [eventTheme, setEventTheme] = useState('Fairy Tale Magic');
  const [eventType, setEventType] = useState<'Indoor' | 'Outdoor' | ''>('');
  const [guestCount, setGuestCount] = useState(0);
  const [specialRequest, setSpecialRequest] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<'Basic' | 'Premium' | 'Luxury' | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const incrementGuests = () => setGuestCount(prev => prev + 1);
  const decrementGuests = () => setGuestCount(prev => Math.max(0, prev - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackage) {
      setError('Please select a package');
      return;
    }

    const eventData: EventData = {
      eventName,
      eventTheme,
      eventDate,
      eventType,
      noOfGuest: guestCount,
      specialRequest,
      eventPackage: selectedPackage
    };

    setIsLoading(true);
    setError('');

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
      alert('Booking submitted successfully!');
      
      // Reset form
      setEventName('Birthday');
      setEventTheme('Fairy Tale Magic');
      setEventType('');
      setGuestCount(0);
      setSpecialRequest('');
      setSelectedPackage(null);
      setEventDate('');
      
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the booking');
      console.error('Error submitting booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-grow p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-6">
            <h1 className="text-2xl font-bold">Event Booking Form</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          {/* Event Details Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event name:</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Theme:</label>
                <input
                  type="text"
                  value={eventTheme}
                  onChange={(e) => setEventTheme(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <div className="flex items-center p-2 border border-gray-300 rounded-md">
                  <span className="mr-2">💡️</span>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="eventType"
                      checked={eventType === 'Indoor'}
                      onChange={() => setEventType('Indoor')}
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
                      className="text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2">Outdoor</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests:</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={decrementGuests}
                    className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100">{guestCount}</span>
                  <button
                    type="button"
                    onClick={incrementGuests}
                    className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special request:</label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Type Here...."
                  className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              {/* Packages */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Package */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPackage === 'Basic' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-gray-200 hover:border-yellow-300'}`}
                  onClick={() => setSelectedPackage('Basic')}
                >
                  <h3 className="font-bold text-lg mb-2">Basic</h3>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center">
                      <span className="mr-2">•</span> Simple decor
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span> Basic Photography
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span> Standard Catering
                    </li>
                  </ul>
                  <p className="font-bold text-lg">Rs. 30,000.00</p>
                </div>

                {/* Premium Package */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPackage === 'Premium' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-gray-200 hover:border-yellow-300'}`}
                  onClick={() => setSelectedPackage('Premium')}
                >
                  <h3 className="font-bold text-lg mb-2">Premium</h3>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
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
                  </ul>
                  <p className="font-bold text-lg">Rs. 50,000.00</p>
                </div>

                {/* Luxury Package */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPackage === 'Luxury' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-gray-200 hover:border-yellow-300'}`}
                  onClick={() => setSelectedPackage('Luxury')}
                >
                  <h3 className="font-bold text-lg mb-2">Luxury</h3>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
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
                  </ul>
                  <p className="font-bold text-lg">Rs. 80,000.00</p>
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="mt-8">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-4 rounded-md hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-medium text-lg disabled:opacity-50 shadow-lg hover:shadow-yellow-200/50"
                  disabled={!selectedPackage || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer (same as before) */}
      <footer className="bg-gradient-to-b from-yellow-600 to-yellow-800 text-white">
        {/* ... existing footer code ... */}
      </footer>
    </div>
  );
};

export default EventBooking;