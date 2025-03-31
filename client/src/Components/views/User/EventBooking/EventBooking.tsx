import { useState } from 'react';

const EventBooking = () => {
  const [eventName, setEventName] = useState('Birthday');
  const [eventTheme, setEventTheme] = useState('Fairy Tale Magic');
  const [eventType, setEventType] = useState<'Indoor' | 'Outdoor' | ''>('');
  const [guestCount, setGuestCount] = useState(0);
  const [specialRequest, setSpecialRequest] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<'Basic' | 'Premium' | 'Luxury' | null>(null);
  const [eventDate, setEventDate] = useState('');

  const incrementGuests = () => setGuestCount(prev => prev + 1);
  const decrementGuests = () => setGuestCount(prev => Math.max(0, prev - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      eventName,
      eventTheme,
      eventType,
      guestCount,
      specialRequest,
      selectedPackage,
      eventDate
    });
    alert('Booking submitted successfully!');
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
  disabled={!selectedPackage}
>
  Pay Now
</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Gold Themed Footer */}
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
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-yellow-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-yellow-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-yellow-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-yellow-500 pb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Event Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-yellow-500 pb-2">Our Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Weddings</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Corporate Events</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Birthdays</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Conferences</a></li>
                <li><a href="#" className="text-yellow-100 hover:text-white transition-colors">Exhibitions</a></li>
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
            <p className="mt-2 text-sm">Creating golden moments that last forever</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventBooking;