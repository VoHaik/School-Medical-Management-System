import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

const StudentProfile = () => {
  const { currentUser, getAuthAxios } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    className: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  // Define loadProfileData function before using it
  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/student-profile');

      setProfileData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toLocaleDateString('en-US') : '',
        gender: response.data.gender || '',
        className: response.data.className || ''
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);

      // Check if this is a "Student profile not found" error
      if (error.response && error.response.data && error.response.data.message === "Student profile not found") {
        setMessage('Your student profile needs to be created. Please fill in your details.');
        setMessageType('info');
        setIsEditing(true); // Automatically switch to edit mode

        // Initialize with user data we already have
        setProfileData({
          fullName: currentUser?.fullName || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || '',
          dateOfBirth: '',
          gender: '',
          className: ''
        });
      } else {
        setMessage('Error loading profile data. Please try again later.');
        setMessageType('error');

        // Try to populate with current user data
        setProfileData({
          fullName: currentUser?.fullName || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || '',
          dateOfBirth: '',
          gender: '',
          className: ''
        });
      }

      setLoading(false);
    }
  }, [getAuthAxios, currentUser]);

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
    // Reset form data if canceling edit
    if (isEditing) {
      loadProfileData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const authAxios = getAuthAxios();

      // Prepare data for submission
      const submitData = {
        ...profileData,
        // Convert date string to ISO format if needed
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : null
      };

      // First try to update the profile
      let response;
      try {
        response = await authAxios.put('/api/student-profile', submitData);
      } catch (updateError) {
        // If update fails because profile doesn't exist, try to create it
        if (updateError.response && updateError.response.status === 400 &&
            updateError.response.data && updateError.response.data.message === "Student profile not found") {

          // Try to create a new profile
          response = await authAxios.post('/api/student-profile', submitData);
        } else {
          // Re-throw if it's a different error
          throw updateError;
        }
      }

      setMessage(response.data.message || 'Profile updated successfully!');
      setMessageType('success');
      setIsEditing(false);

      // Reload profile data to show updated information
      loadProfileData();
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage(error.response?.data?.message || 'Error saving profile. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                <i className="fas fa-edit mr-2"></i> Edit Profile
              </button>
            )}
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 
              messageType === 'error' ? 'bg-red-100 text-red-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              {message}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="className">
                      Class Name
                    </label>
                    <input
                      type="text"
                      id="className"
                      name="className"
                      value={profileData.className}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-lg">{profileData.fullName || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg">{profileData.email || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-lg">{profileData.phone || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-lg">{profileData.dateOfBirth || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-lg">{profileData.gender || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Class Name</p>
                    <p className="text-lg">{profileData.className || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
