import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserService from "../User/UserService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaUserPlus, FaTrash, FaEdit, FaEye, FaBars, FaTimes, FaHome, FaUsers, FaCog, FaSave, FaArrowLeft, FaCheckCircle, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  gender: string;
}

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const navigate = useNavigate();
  const tableRef = useRef<HTMLTableElement>(null);
  const { userId } = useParams();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await UserService.getAllUsers(token);
      
      if (response && Array.isArray(response)) {
        setUsers(response);
      } else if (response && response.ourUsersList) {
        setUsers(response.ourUsersList);
      } else {
        console.error("Unexpected API response format:", response);
        setError("Unexpected data format received from server");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let results = users;

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(term)) ||
        user.role.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      results = results.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(results);
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await UserService.deleteUser(userId, token);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const title = "User Management Report";
      const date = new Date().toLocaleDateString();
      
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text(title, 14, 20);
      doc.setFontSize(11);
      doc.text(`Generated on: ${date}`, 14, 28);
      
      autoTable(doc, {
        head: [["ID", "Name", "Email", "Phone", "Role"]],
        body: filteredUsers.map(user => [
          user.id,
          user.name,
          user.email,
          user.phoneNumber || "N/A",
          user.role
        ]),
        startY: 35,
        theme: "grid",
        headStyles: {
          fillColor: [212, 175, 55],
          textColor: [0, 0, 0],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 40 }
      });
      
      doc.save(`user-management-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleEdit = (userId: string) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditingUser({ ...userToEdit });
      setIsEditing(true);
      setUpdateError(null);
    } else {
      console.error("User not found for editing");
      toast.error("User data not available for editing. Please try again.");
    }
  };

  const handleView = (userId: string) => {
    const userToView = users.find(user => user.id === userId);
    if (userToView) {
      setViewingUser({ ...userToView });
      setIsViewing(true);
    } else {
      console.error("User not found for viewing");
      toast.error("User data not available for viewing. Please try again.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setUpdateError(null);
      
      const userUpdateData = {
        name: editingUser.name,
        email: editingUser.email,
        phoneNumber: editingUser.phoneNumber || "",
        role: editingUser.role,
        gender: editingUser.gender || "other",
        password: ""
      };

      const response = await UserService.updateUser(editingUser.id, userUpdateData, token);
      
      if (response && response.status === "OK") {
        // Update the users list with the updated user data
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === editingUser.id ? { ...user, ...userUpdateData } : user
          )
        );
        toast.success("User updated successfully!");
        setIsEditing(false);
        setEditingUser(null);
        // No need to call fetchUsers() here since we're updating the state directly
      } else {
        throw new Error(response?.message || "Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      setUpdateError(error.message || "Failed to update user. Please try again.");
      toast.error(error.message || "Failed to update user. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return;
    
    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: value
    });
  };

  const renderEditForm = () => {
    if (!editingUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit User</h3>
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditingUser(null);
                setUpdateError(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft size={20} />
            </button>
          </div>
          
          {updateError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{updateError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingUser.name}
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
                value={editingUser.email}
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
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={editingUser.phoneNumber || ""}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={editingUser.gender || "other"}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={editingUser.role}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingUser(null);
                  setUpdateError(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderViewModal = () => {
    if (!viewingUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">User Details</h3>
            <button 
              onClick={() => {
                setIsViewing(false);
                setViewingUser(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p className="mt-1 text-sm text-gray-900">{viewingUser.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1 text-sm text-gray-900">{viewingUser.email}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
              <p className="mt-1 text-sm text-gray-900">{viewingUser.phoneNumber || "N/A"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Gender</h4>
              <p className="mt-1 text-sm text-gray-900">{viewingUser.gender || "Not specified"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Role</h4>
              <p className="mt-1 text-sm text-gray-900 capitalize">{viewingUser.role}</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setIsViewing(false);
                  setViewingUser(null);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition-transform duration-200 ease-in-out 
        w-64 bg-gradient-to-b from-yellow-600 to-yellow-700 text-white z-30 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-yellow-500">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-yellow-300 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center p-2 rounded hover:bg-yellow-500 hover:bg-opacity-30 transition-colors duration-200"
              >
                <FaHome className="mr-3 text-yellow-300" /> Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/users" 
                className="flex items-center p-2 rounded bg-yellow-500 bg-opacity-30 font-medium"
              >
                <FaUsers className="mr-3 text-yellow-300" /> User Management
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className="flex items-center p-2 rounded hover:bg-yellow-500 hover:bg-opacity-30 transition-colors duration-200"
              >
                <FaCog className="mr-3 text-yellow-300" /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm md:hidden z-20">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="text-gray-500 hover:text-gray-600"
            >
              <FaBars size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">User Management</h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <div className="flex space-x-4">
                <button
                  onClick={exportToPDF}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                >
                  <FaFilePdf className="mr-2" /> Export PDF
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end">
                 
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading users...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-yellow-600 to-yellow-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user: User) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.phoneNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                user.role === 'manager' ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                              >
                                <FaTrash className="mr-1" /> Delete
                              </button>
                              <button
                                onClick={() => handleEdit(user.id)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => handleView(user.id)}
                                className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                              >
                                <FaEye className="mr-1" /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit User Modal */}
      {isEditing && renderEditForm()}

      {/* View User Modal */}
      {isViewing && renderViewModal()}
    </div>
  );
}

export default UserManagementPage;