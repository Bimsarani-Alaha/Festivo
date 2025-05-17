import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faSync, faTimes, faFilePdf, faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

interface EventBookingData {
  eventName: string;
  eventTheme: string;
  eventDate: string;
  eventType: 'Indoor' | 'Outdoor' | 'Pool' | '';
  noOfGuest: number;
  specialRequest: string;
  selectedPackage?: {
    packageId: number | string;
    packageName: string;
    packagePrice: number;
  };
}

interface DataItem {
  id: string;
  name: string;
  email: string;
  phoneNumber: number | null;
  address: string;
  cardNumber: number | null;
  cardType: string;
  expDate: string;
  cvv: number | null;
  orderSummery: string;
  amount: number;
  eventBooking?: EventBookingData; // Add event booking data
}

interface DataTableProps {
  onDelete?: (item: DataItem) => void;
}

const DataTable: React.FC<DataTableProps> = ({ onDelete }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState<Partial<DataItem>>({});
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const { toPDF, targetRef } = usePDF({ filename: 'payment-record.pdf' });
  const handleViewNavigation = (item: DataItem) => {
    navigate(`/EventBookingsTable`);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/public/getAllPayment');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payment records. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: DataItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      phoneNumber: item.phoneNumber,
      address: item.address,
      cardType: item.cardType,
      expDate: item.expDate,
      orderSummery: item.orderSummery,
      amount: item.amount // This is now the total amount
    });
    setSuccessMessage(null);
  };

  const handleViewModal = (item: DataItem) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  
  // Perform validation based on field name
  let error = '';
  if (name === 'name') {
    error = validateName(value);
  } else if (name === 'phoneNumber') {
    error = validatePhone(value);
  } else if (name === 'expDate') {
    error = validateExpDate(value);
  } else if (name === 'email') {
    error = validateEmail(value);
  }
  
  setErrors(prev => ({ ...prev, [name]: error }));
  
  setFormData(prev => ({
    ...prev,
    [name]: name === 'phoneNumber' || name === 'amount' ? Number(value) : value
  }));
};

  // Add these validation functions at the top of your component
const validateName = (name: string) => {
  if (!name) return 'Name is required';
  if (/[0-9]/.test(name)) return 'Name should not contain numbers';
  return '';
};

const validatePhone = (phone: string | number | null) => {
  if (!phone) return 'Phone number is required';
  const phoneStr = phone.toString();
  if (!/^\d+$/.test(phoneStr)) return 'Phone should contain only numbers';
  if (phoneStr.length !== 9) return 'Phone must be 10 digits';
  return '';
};

const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return '';
};


const validateExpDate = (expDate: string) => {
  if (!expDate) return 'Expiration date is required';
  if (!/^\d{2}\/\d{2}$/.test(expDate)) return 'Format must be MM/YY';
  
  const [month, year] = expDate.split('/').map(Number);
  if (month < 1 || month > 12) return 'Month must be 01-12';
  
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card is expired';
  }
  
  return '';
};

// Update the state to track validation errors
const [errors, setErrors] = useState<Record<string, string>>({
  name: '',
  phoneNumber: '',
  expDate: '',
  email: '' // Add email to errors state
});


  // Update the handleSubmit to check for errors before submitting
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingItem) return;

  // Validate all fields before submitting
  const validationErrors = {
    name: validateName(formData.name || ''),
    phoneNumber: validatePhone(formData.phoneNumber || ''),
    expDate: validateExpDate(formData.expDate || ''),
    email: validateEmail(formData.email || '') // Add email validation

  };

  setErrors(validationErrors);

  // Check if there are any errors
  if (Object.values(validationErrors).some(error => error)) {
    return;
  }

  try {
    setLoading(true);
    await axios.put(`http://localhost:8080/public/updatePayment/${editingItem.id}`, formData);
    setSuccessMessage('Payment record updated successfully!');
    await fetchData();
    setTimeout(() => {
      setEditingItem(null);
    }, 1500);
  } catch (err) {
    setError('Failed to update payment record. Please try again.');
    console.error('Error updating data:', err);
  } finally {
    setLoading(false);
  }
};

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

const formatPhoneNumber = (phoneNumber: number | null): string => {
  if (!phoneNumber) return 'N/A';
  return phoneNumber.toString();
};

  const maskCardNumber = (cardNumber: number | null): string => {
    if (!cardNumber) return 'N/A';
    const numStr = cardNumber.toString();
    return `•••• •••• •••• ${numStr.slice(-4)}`;
  };

  const formatCurrency = (amount: number): string => {
    return 'Rs. ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      (item.phoneNumber && formatPhoneNumber(item.phoneNumber).includes(searchTerm))
    );
  });

  const handleShare = async (item: DataItem) => {
    setIsSharing(true);
    setSelectedItem(item);
    try {
      if (navigator && navigator.share) {
        await navigator.share({
          title: `Payment Record - ${item.name}`,
          text: `Payment details for ${item.name}\nEmail: ${item.email}\nAmount: ${formatCurrency(item.amount)}`,
          url: window.location.href,
        });
      } else {
        const text = `Payment Record Details:
Name: ${item.name}
Email: ${item.email}
Phone: ${formatPhoneNumber(item.phoneNumber)}
Amount: ${formatCurrency(item.amount)}
Card Type: ${item.cardType}
Last 4 Digits: ${item.cardNumber ? item.cardNumber.toString().slice(-4) : 'N/A'}`;
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
        }
      }
    } catch (err) {
      console.error('Error sharing:', err);
      setError('Failed to share payment details. Please try again or copy manually.');
    } finally {
      setIsSharing(false);
    }
  };

  const generatePdfForRecord = (item: DataItem) => {
    setSelectedItem(item);
    setTimeout(() => {
      toPDF();
    }, 100);
  };

  return (

    <div className="container mx-auto px-4 py-8">
      {/* PDF content */}
      <div ref={targetRef} className="p-4" style={{ position: 'absolute', left: '-9999px' }}>
        {selectedItem && (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Payment Receipt</h2>
            <div className="border-b pb-4 mb-4">
              <p className="text-sm text-gray-500">Transaction ID: {selectedItem.id}</p>
              <p className="text-lg font-semibold">{selectedItem.name}</p>
              <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{selectedItem.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm">{formatPhoneNumber(selectedItem.phoneNumber)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-sm mb-4">{selectedItem.address || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Card Type</p>
                <p className="text-sm">{selectedItem.cardType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Card Number</p>
                <p className="text-sm">{maskCardNumber(selectedItem.cardNumber)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                <p className="text-sm">{selectedItem.expDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CVV</p>
                <p className="text-sm">{selectedItem.cvv ? '•••' : 'N/A'}</p>
              </div>
            </div>
          
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(selectedItem.amount)}</p>
            </div>
            
            <div className="mt-8 text-xs text-gray-500">
              <p>Generated on: {new Date().toLocaleString()}</p>
              <p className="mt-2">This is an official payment receipt</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Records</h1>
        <button 
          onClick={fetchData} 
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faSync} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email or Phone"
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={fetchData} 
            className="ml-4 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Payment Record Details</h2>
              <button 
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatPhoneNumber(selectedItem.phoneNumber)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.address || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Card Type</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.cardType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Card Number</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {maskCardNumber(selectedItem.cardNumber)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiration Date</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.expDate || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CVV</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedItem.cvv ? '•••' : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatCurrency(selectedItem.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t flex justify-end space-x-2">
                <button
                  onClick={() => generatePdfForRecord(selectedItem)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleViewNavigation(selectedItem)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  View Full Details
                </button>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-semibold">Edit Payment Record</h2>
        <button 
          onClick={() => setEditingItem(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Name Field */}
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name || ''}
        onChange={(e) => {
          const value = e.target.value;
          // Prevent numbers
          if (/^[A-Za-z\s]*$/.test(value)) {
            handleInputChange(e);
          }
        }}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errors.name ? 'border-red-500' : ''
        }`}
        required
      />
      {errors.name && (
        <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
      )}
    </div>

    {/* Email Field */}
<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
    Email *
  </label>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email || ''}
    onChange={(e) => {
      handleInputChange(e);
      // Validate email on change
      setErrors(prev => ({
        ...prev,
        email: validateEmail(e.target.value)
      }));
    }}
    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
      errors.email ? 'border-red-500' : ''
    }`}
    required
  />
  {errors.email && (
    <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
  )}
</div>

    {/* Phone Number Field */}
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
        Phone Number
      </label>
      <input
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        value={formData.phoneNumber || ''}
        onChange={handleInputChange}
        maxLength={10}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errors.phoneNumber ? 'border-red-500' : ''
        }`}
        required
      />
      {errors.phoneNumber && (
        <p className="text-red-500 text-xs italic mt-1">{errors.phoneNumber}</p>
      )}
    </div>

    {/* Address Field */}
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
        Address
      </label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address || ''}
        onChange={handleInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>

    {/* Card Type Field */}
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardType">
        Card Type
      </label>
      <select
        id="cardType"
        name="cardType"
        value={formData.cardType || ''}
        onChange={handleInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option value="">Select Card Type</option>
        <option value="Visa">Visa</option>
        <option value="Mastercard">Mastercard</option>
        <option value="American Express">American Express</option>
        <option value="Discover">Discover</option>
      </select>
    </div>

    {/* Expiration Date Field */}
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expDate">
        Expiration Date
      </label>
      <input
        type="text"
        id="expDate"
        name="expDate"
        placeholder="MM/YY"
        value={formData.expDate || ''}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
          }
          const [month, year] = value.split('/');
          const isValidMonth = !month || (parseInt(month) >= 1 && parseInt(month) <= 12);
          handleInputChange({
            ...e,
            target: {
              ...e.target,
              value: value
            }
          });
          errors.expDate = value.length === 5 && !isValidMonth ? 'Invalid month' : '';
        }}
        maxLength={5}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errors.expDate ? 'border-red-500' : ''
        }`}
        required
      />
      {errors.expDate && (
        <p className="text-red-500 text-xs italic mt-1">{errors.expDate}</p>
      )}
    </div>

    {/* Amount Field */}
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
        Total Amount (Rs.)
      </label>
      <input
        type="number"
        id="amount"
        name="amount"
        value={formData.amount || ''}
        onChange={handleInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
        min="0"
      />
    </div>
  </div>

  <div className="flex justify-end mt-4">
    <button
      type="button"
      onClick={() => setEditingItem(null)}
      className="mr-2 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      disabled={loading || Object.values(errors).some(error => error)}
    >
      {loading ? 'Updating...' : 'Update'}
    </button>
  </div>
</form>

    </div>
  </div>
)}

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-yellow-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Card Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Card Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Total Amount (Rs.)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <a href={`mailto:${item.email}`} className="text-blue-500 hover:underline">{item.email}</a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.phoneNumber ? (
                          <a href={`tel:${item.phoneNumber}`} className="hover:text-blue-500">
                            {formatPhoneNumber(item.phoneNumber)}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.cardType || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{maskCardNumber(item.cardNumber)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <button onClick={() => handleViewModal(item)} className="text-blue-600 hover:text-blue-800 mx-1">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button onClick={() => handleEdit(item)} className="text-yellow-600 hover:text-yellow-800 mx-1">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          onClick={() => generatePdfForRecord(item)} 
                          className="text-red-600 hover:text-red-800 mx-1"
                          title="Export PDF"
                        >
                          <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                        <button 
                          onClick={() => handleShare(item)} 
                          className={`text-green-600 hover:text-green-800 mx-1 relative`}
                          disabled={isSharing}
                          title="Share"
                        >
                          <FontAwesomeIcon icon={isSharing ? faSync : faShare} className={isSharing ? 'animate-spin' : ''} />
                          {copiedId === item.id && (
                            <span className="absolute -top-8 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </span>
                          )}
                        </button>
                        <button onClick={() => onDelete?.(item)} className="text-red-600 hover:text-red-800 mx-1" title="Delete">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No matching records found' : 'No payment records available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (item: DataItem) => {
    try {
      if (window.confirm('Are you sure you want to delete this record?')) {
        await axios.delete(`http://localhost:8080/public/deletePayment/${item.id}`);
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div key={refreshKey}>
      <DataTable 
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;