import { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch, FaSpinner, FaTimes, FaFilePdf, FaCheck, FaTruck } from 'react-icons/fa';
import { usePDF } from 'react-to-pdf';
import { sendOrderToSupplier } from '../../../../api/supplierOrder';

interface BookingData {
  id?: string;
  eventName: string;
  eventTheme: string;
  eventType: string;
  noOfGuest: number;
  specialRequest: string;
  eventPackage: string | null;
  eventDate: string;
}

const EventBookingsTable = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<BookingData>({
    eventName: '',
    eventTheme: '',
    eventType: '',
    noOfGuest: 0,
    specialRequest: '',
    eventPackage: null,
    eventDate: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // PDF generation hook
  const { toPDF, targetRef } = usePDF({
    filename: 'event-bookings-report.pdf',
    page: {
      margin: 20,
      format: 'A4',
      orientation: 'landscape'
    }
  });

  // Fetch all events from API
  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/public/getAllEvent');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => {
    const term = searchTerm.toLowerCase();
    return (
      (booking.eventName?.toLowerCase() || '').includes(term) ||
      (booking.eventTheme?.toLowerCase() || '').includes(term) ||
      (booking.eventPackage?.toLowerCase() || '').includes(term)
    );
  });

  // Delete event
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`http://localhost:8080/public/deleteEvent/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
        
        await fetchEvents();
        setSuccessMessage('Booking deleted successfully!');
        setShowSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete event');
        console.error('Error deleting event:', err);
      }
    }
  };

  // Open edit form
  const handleEdit = (booking: BookingData) => {
    setEditFormData(booking);
    setIsEditing(true);
  };

  const handleToSupplier = (booking: BookingData) => {
    alert("Are You want to send this order to supplier")
    sendOrderToSupplier(booking);
  };

  // Handle form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit updated event
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.id) return;

    try {
      const response = await fetch(`http://localhost:8080/public/updateEvent/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      await fetchEvents();
      setIsEditing(false);
      setSuccessMessage('Booking updated successfully!');
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Error updating event:', err);
    }
  };

  const handleView = (booking: BookingData) => {
    setSelectedBooking(booking);
  };

  // Generate PDF report
  const generateReport = () => {
    toPDF();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with Search */}
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h1 className="text-2xl font-bold">Event Bookings</h1>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className="pl-10 pr-4 py-2 border rounded-md w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={generateReport}
                    className="bg-white text-yellow-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <FaFilePdf className="mr-2" />
                    Generate PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{error}</p>
              </div>
            )}

            {/* Success Message Popup */}
            {showSuccess && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <FaCheck className="text-green-600 text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Success!</h2>
                    <p className="mb-6">{successMessage}</p>
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center items-center p-8">
                <FaSpinner className="animate-spin text-yellow-600 text-2xl" />
                <span className="ml-2">Loading bookings...</span>
              </div>
            )}

            {/* Table for PDF (hidden but included in PDF) */}
            <div ref={targetRef} style={{ position: 'absolute', left: '-9999px' }}>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Event Bookings Report</h2>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Generated on: {new Date().toLocaleDateString()}
                </p>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.eventName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.eventTheme}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.eventType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.eventDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.noOfGuest}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.eventPackage || 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Main Table */}
            {!isLoading && (
              <div className="p-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.eventName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.eventTheme}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.eventType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.noOfGuest}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.eventPackage === 'Basic' 
                                ? 'bg-blue-100 text-blue-800' 
                                : booking.eventPackage === 'Premium' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.eventPackage || 'None'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleView(booking)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="View"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleEdit(booking)}
                                className="text-yellow-600 hover:text-yellow-800 p-1"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => booking.id && handleDelete(booking.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                              <button
                                onClick={() => booking.id && handleToSupplier(booking)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete"
                              >
                                <FaTruck />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          {bookings.length === 0 ? 'No bookings found.' : 'No matching bookings found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* View Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Event Name:</h3>
                      <p className="mt-1">{selectedBooking.eventName}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Theme:</h3>
                      <p className="mt-1">{selectedBooking.eventTheme}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Type:</h3>
                      <p className="mt-1">{selectedBooking.eventType}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Date:</h3>
                      <p className="mt-1">{new Date(selectedBooking.eventDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Number of Guests:</h3>
                      <p className="mt-1">{selectedBooking.noOfGuest}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Package:</h3>
                      <p className="mt-1">{selectedBooking.eventPackage || 'None'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Special Requests:</h3>
                    <p className="mt-1 whitespace-pre-line bg-gray-50 p-3 rounded-md">
                      {selectedBooking.specialRequest || 'No special requests'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Name:</label>
                      <input
                        type="text"
                        name="eventName"
                        value={editFormData.eventName}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Theme:</label>
                      <input
                        type="text"
                        name="eventTheme"
                        value={editFormData.eventTheme}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
                      <select
                        name="eventType"
                        value={editFormData.eventType}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Pool">Pool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                      <input
                        type="date"
                        name="eventDate"
                        value={editFormData.eventDate}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests:</label>
                      <input
                        type="number"
                        name="noOfGuest"
                        value={editFormData.noOfGuest}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package:</label>
                      <select
                        name="eventPackage"
                        value={editFormData.eventPackage || ''}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Package</option>
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests:</label>
                    <textarea
                      name="specialRequest"
                      value={editFormData.specialRequest}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md h-24"
                    />
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      Update Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      
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

export default EventBookingsTable;