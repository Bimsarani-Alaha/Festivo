import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faSync, faTimes, faFilePdf, faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';

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
}

interface DataTableProps {
  onView?: (item: DataItem) => void;
  onDelete?: (item: DataItem) => void;
}

const DataTable: React.FC<DataTableProps> = ({ onView, onDelete }) => {
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
  
  const { toPDF, targetRef } = usePDF({ filename: 'payment-record.pdf' });
  
  // Fetch data from API
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

  // Handle edit button click
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
      amount: item.amount
    });
    setSuccessMessage(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phoneNumber' || name === 'amount' ? Number(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/public/updatePayment/${editingItem.id}`, formData);
      setSuccessMessage('Payment record updated successfully!');
      await fetchData(); // Refresh data after update
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

  // Function to handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Function to format the phone number
  const formatPhoneNumber = (phoneNumber: number | null): string => {
    if (!phoneNumber) return 'N/A';
    const numStr = phoneNumber.toString();
    return `(${numStr.substring(0, 3)}) ${numStr.substring(3, 6)}-${numStr.substring(6)}`;
  };

  // Function to mask card number
  const maskCardNumber = (cardNumber: number | null): string => {
    if (!cardNumber) return 'N/A';
    const numStr = cardNumber.toString();
    return `•••• •••• •••• ${numStr.slice(-4)}`;
  };

  // Function to format amount as currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  // Filter data based on the search term
  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      (item.phoneNumber && formatPhoneNumber(item.phoneNumber).includes(searchTerm))
    );
  });

  // Handle share functionality
  const handleShare = async (item: DataItem) => {
    setIsSharing(true);
    setSelectedItem(item);
    try {
      // Check if Web Share API is supported
      if (navigator && navigator.share) {
        await navigator.share({
          title: `Payment Record - ${item.name}`,
          text: `Payment details for ${item.name}\nEmail: ${item.email}\nAmount: ${formatCurrency(item.amount)}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const text = `Payment Record Details:
Name: ${item.name}
Email: ${item.email}
Phone: ${formatPhoneNumber(item.phoneNumber)}
Amount: ${formatCurrency(item.amount)}
Card Type: ${item.cardType}
Last 4 Digits: ${item.cardNumber ? item.cardNumber.toString().slice(-4) : 'N/A'}`;
        
        // Check if clipboard API is available
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
        } else {
          // Fallback for older browsers
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

  // Generate PDF for a single record
  const generatePdfForRecord = (item: DataItem) => {
    setSelectedItem(item);
    setTimeout(() => {
      toPDF();
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Search Bar */}
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

      {/* PDF Content (hidden) */}
      <div ref={targetRef} className="p-4 hidden">
        {selectedItem && (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Payment Receipt</h2>
            <div className="border-b pb-4 mb-4">
              <p className="text-sm text-gray-500">Transaction ID: {selectedItem.id}</p>
              <p className="text-lg font-semibold">{selectedItem.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedItem.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{formatPhoneNumber(selectedItem.phoneNumber)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Card Type</p>
                <p>{selectedItem.cardType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Card Number</p>
                <p>{maskCardNumber(selectedItem.cardNumber)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Exp Date</p>
                <p>{selectedItem.expDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Summary</p>
                <p>{selectedItem.orderSummery}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-xl font-bold">{formatCurrency(selectedItem.amount)}</p>
            </div>
            
            <div className="mt-8 text-xs text-gray-500">
              <p>Generated on: {new Date().toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
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
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
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
                  >
                    <option value="">Select Card Type</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                </div>
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
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderSummery">
                    Order Summary
                  </label>
                  <input
                    type="text"
                    id="orderSummery"
                    name="orderSummery"
                    value={formData.orderSummery || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                    Amount (in cents)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
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
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Amount</th>
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
                        <button onClick={() => onView?.(item)} className="text-blue-600 hover:text-blue-800 mx-1">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button onClick={() => handleEdit(item)} className="text-yellow-600 hover:text-yellow-800 mx-1">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedItem(item);
                            setTimeout(() => toPDF(), 100);
                          }} 
                          className="text-red-600 hover:text-red-800 mx-1"
                        >
                          <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                        <button 
                          onClick={() => handleShare(item)} 
                          className={`text-green-600 hover:text-green-800 mx-1 relative`}
                          disabled={isSharing}
                        >
                          <FontAwesomeIcon icon={isSharing ? faSync : faShare} className={isSharing ? 'animate-spin' : ''} />
                          {copiedId === item.id && (
                            <span className="absolute -top-8 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </span>
                          )}
                        </button>
                        <button onClick={() => onDelete?.(item)} className="text-red-600 hover:text-red-800 mx-1">
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

  const handleView = (item: DataItem) => {
    console.log('View item:', item);
    // Implement view functionality
  };

  const handleDelete = async (item: DataItem) => {
    try {
      if (window.confirm('Are you sure you want to delete this record?')) {
        await axios.delete(`http://localhost:8080/public/deletePayment/${item.id}`);
        // Trigger refresh by updating the key
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div key={refreshKey}>
      <DataTable 
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;