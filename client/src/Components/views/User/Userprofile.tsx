import { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaGithub, FaLinkedin, FaTwitter, FaCamera, FaSave, FaEdit, FaLock } from 'react-icons/fa';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bio: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  avatar: string;
}

const UserProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    bio: 'Frontend Developer | React Specialist | UI/UX Enthusiast',
    website: 'https://johndoe.dev',
    github: 'johndoe',
    linkedin: 'in/johndoe',
    twitter: '@johndoe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>({...profile});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // In a real app, you would fetch the user profile here
    // fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setTempProfile({...profile});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProfile({...tempProfile});
      setIsEditing(false);
      setIsLoading(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfile(prev => ({ ...prev, avatar: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <img 
                  src={isEditing ? tempProfile.avatar : profile.avatar} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-white border-opacity-50 object-cover shadow-lg"
                />
                {isEditing && (
                  <>
                    <button 
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
                    >
                      <FaCamera />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>
              <div className="text-center sm:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={tempProfile.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-white bg-opacity-20 rounded px-3 py-1 mb-2 w-full sm:w-auto"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                )}
                <p className="text-blue-100">{profile.bio}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                <p>{successMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mb-6 space-x-3">
              {!isEditing ? (
                <>
                  <button 
                    onClick={handleEditClick}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                  <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
                    <FaLock className="mr-2" /> Change Password
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleCancelEdit}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Saving...'
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Profile Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-600" /> Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={tempProfile.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={tempProfile.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={tempProfile.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.phoneNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={tempProfile.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaGlobe className="mr-2 text-blue-600" /> Social Links
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                      <FaGlobe className="mr-2" /> Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={tempProfile.website}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:underline"
                      >
                        {profile.website}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                      <FaGithub className="mr-2" /> GitHub
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="github"
                        value={tempProfile.github}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <a 
                        href={`https://github.com/${profile.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:underline"
                      >
                        github.com/{profile.github}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                      <FaLinkedin className="mr-2" /> LinkedIn
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="linkedin"
                        value={tempProfile.linkedin}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <a 
                        href={`https://linkedin.com/${profile.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:underline"
                      >
                        linkedin.com/{profile.linkedin}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                      <FaTwitter className="mr-2" /> Twitter
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="twitter"
                        value={tempProfile.twitter}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <a 
                        href={`https://twitter.com/${profile.twitter.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:underline"
                      >
                        {profile.twitter}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings (Additional Section) */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Privacy Settings</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-gray-700">Make profile public</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                      <span className="ml-2 text-gray-700">Show email address</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Email Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                      <span className="ml-2 text-gray-700">Product updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                      <span className="ml-2 text-gray-700">Newsletter</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;