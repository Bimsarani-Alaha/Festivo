import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaSearch, FaSpinner, FaTimes, FaFilePdf, FaCheck, FaStar } from 'react-icons/fa';
import { usePDF } from 'react-to-pdf';

interface Feedback {
  id: string;
  rating: number;
  review: string;
  date: string;
}

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // PDF generation hook
  const { toPDF, targetRef } = usePDF({
    filename: 'feedback-report.pdf',
    page: {
      margin: 20,
      format: 'A4',
      orientation: 'portrait'
    }
  });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:8080/public/getAllFeedback');
        if (!response.ok) {
          throw new Error('Failed to load feedback data');
        }
        const data = await response.json();
        setFeedbackList(data);
        setFilteredFeedback(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load feedback data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    const results = feedbackList.filter(feedback =>
      feedback.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.rating.toString().includes(searchTerm) ||
      feedback.date.includes(searchTerm)
    );
    setFilteredFeedback(results);
  }, [searchTerm, feedbackList]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`http://localhost:8080/public/deleteFeedback/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete feedback');
        }

        const updatedList = feedbackList.filter(feedback => feedback.id !== id);
        setFeedbackList(updatedList);
        setSuccessMessage('Feedback deleted successfully!');
        setShowSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete feedback');
        console.error(err);
      }
    }
  };

  const startEditing = (feedback: Feedback) => {
    setEditingId(feedback.id);
    setEditReview(feedback.review);
    setEditRating(feedback.rating);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditReview('');
    setEditRating(0);
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/public/updateFeedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: editReview,
          rating: editRating
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      const updatedList = feedbackList.map(feedback => 
        feedback.id === id 
          ? { ...feedback, review: editReview, rating: editRating } 
          : feedback
      );
      setFeedbackList(updatedList);
      setEditingId(null);
      setSuccessMessage('Feedback updated successfully!');
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feedback');
      console.error(err);
    }
  };

  const generateReport = () => {
    toPDF();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-yellow-600 mb-2">Customer Feedback</h1>
            <p className="text-lg text-gray-600">Manage and review customer feedback</p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search feedback..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/feedback')}
                className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Add new feedback"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={generateReport}
                className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Generate PDF"
              >
                <FaFilePdf className="mr-2" />
                PDF
              </button>
            </div>
          </div>

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

          {/* PDF Report (hidden) */}
          <div ref={targetRef} style={{ position: 'absolute', left: '-9999px' }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Feedback Report</h2>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Generated on: {new Date().toLocaleDateString()}
              </p>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFeedback.map((feedback) => (
                    <tr key={feedback.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-gray-600">{feedback.rating}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-500">{feedback.review}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {searchTerm ? 'No matching feedback found' : 'No feedback yet'}
              </h3>
              <p className="mt-1 text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Be the first to share your experience!'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFeedback.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                >
                  {editingId === feedback.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditRating(star)}
                              className={`text-3xl ${editRating >= star ? 'text-yellow-500' : 'text-gray-300'} transition-all hover:scale-110`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="edit-review" className="block text-sm font-medium text-gray-700 mb-1">
                          Review
                        </label>
                        <textarea
                          id="edit-review"
                          value={editReview}
                          onChange={(e) => setEditReview(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                          aria-label="Cancel editing"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => saveEdit(feedback.id)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 rounded-full hover:bg-yellow-100"
                          aria-label="Save changes"
                        >
                          <FaCheck className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="flex mb-2 sm:mb-0">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-5 w-5 ${i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-gray-600">{feedback.rating}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">{feedback.date}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line mb-4">{feedback.review}</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => startEditing(feedback)}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                          aria-label="Edit feedback"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(feedback.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                          aria-label="Delete feedback"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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

export default FeedbackList;