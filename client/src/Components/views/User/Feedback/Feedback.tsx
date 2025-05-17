import { useState } from 'react';

interface FeedbackData {
  rate: number;
  review: string;
}

const FeedbackPage = () => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !review) {
      setError('Please provide both a rating and review');
      return;
    }

    const feedbackData: FeedbackData = {
      rate: rating,
      review: review
    };

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/public/addFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const result = await response.json();
      console.log('Feedback submitted:', result);
      setIsSubmitted(true);
      setReview('');
      setRating(null);
      setTimeout(() => setIsSubmitted(false), 3000);
      
    } catch (err) {
      let errorMessage = 'An error occurred while submitting feedback';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Error submitting feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          {/* Feedback Form */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-yellow-600 mb-2">Share Your Feedback</h2>
              <p className="text-gray-600 mb-6">We value your experience with Festivo</p>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  Thank you for your feedback! We appreciate your input.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Rating Section */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-gray-700 mb-4">How would you rate your experience?</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-4xl transition-all hover:scale-110 focus:outline-none ${
                          rating && star <= rating 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating && (
                    <p className="mt-2 text-sm text-gray-600">
                      You rated {rating} {rating === 1 ? 'star' : 'stars'}
                    </p>
                  )}
                </div>

                {/* Review Textarea */}
                <div className="mb-8">
                  <label htmlFor="review" className="block text-lg font-medium text-gray-700 mb-4">
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    rows={5}
                    required
                  />
                </div>

                

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!rating || !review || isLoading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-yellow-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
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

export default FeedbackPage;