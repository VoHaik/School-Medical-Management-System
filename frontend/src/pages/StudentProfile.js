import React, { useState, useEffect, useContext } from 'react';
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

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/student-profile');
      
      setProfileData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toLocaleDateString() : '',
        gender: response.data.gender || '',
        className: response.data.className || ''
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Error loading profile data. Please try again later.');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadProfileData(); // Reload original data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.put('/api/student-profile', {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        gender: profileData.gender,
        className: profileData.className
      });
      
      if (response.data.success) {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        setIsEditing(false);
        loadProfileData(); // Reload updated data
      } else {
        setMessage(response.data.message || 'Error updating profile. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again later.');
      setMessageType('error');
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4 text-gradient">My Profile</h2>
            <p className="text-xl text-gray-600">View and update your personal information</p>
          </div>

          {message && (
            <div className={`mb-6 text-center font-medium rounded-lg py-3 ${
              messageType === 'success' ? 'bg-green-100 text-green-700 p-4' : 'bg-red-100 text-red-700 p-4'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={handleEditClick}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center"
                >
                  <i className="fas fa-edit mr-2"></i> Edit Profile
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-indigo-600 text-3xl"></i>
                <p className="mt-2 text-gray-600">Loading profile data...</p>
              </div>
            ) : (
              <>
                {/* View Mode */}
                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-full md:w-1/3 text-gray-500 font-medium">Full Name</div>
                      <div className="w-full md:w-2/3 font-semibold">{profileData.fullName || 'Not provided'}</div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-full md:w-1/3 text-gray-500 font-medium">Email</div>
                      <div className="w-full md:w-2/3">{profileData.email || 'Not provided'}</div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-full md:w-1/3 text-gray-500 font-medium">Phone</div>
                      <div className="w-full md:w-2/3">{profileData.phone || 'Not provided'}</div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-full md:w-1/3 text-gray-500 font-medium">Date of Birth</div>
                      <div className="w-full md:w-2/3">{profileData.dateOfBirth || 'Not provided'}</div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-full md:w-1/3 text-gray-500 font-medium">Gender</div>
                      <div className="w-full md:w-2/3">{profileData.gender || 'Not provided'}</div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="w-full md:w-1/3 text-gray-500 font-medium">Class</div>
                      <div className="w-full md:w-2/3">{profileData.className || 'Not provided'}</div>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col">
                      <label htmlFor="fullName" className="text-gray-500 font-medium mb-1">Full Name</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        value={profileData.fullName}
                        onChange={handleChange}
                        className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-gray-500 font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={profileData.email}
                        onChange={handleChange}
                        className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="phone" className="text-gray-500 font-medium mb-1">Phone</label>
                      <input 
                        type="text" 
                        id="phone" 
                        name="phone" 
                        value={profileData.phone}
                        onChange={handleChange}
                        className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="gender" className="text-gray-500 font-medium mb-1">Gender</label>
                      <select 
                        id="gender" 
                        name="gender" 
                        value={profileData.gender}
                        onChange={handleChange}
                        className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="className" className="text-gray-500 font-medium mb-1">Class</label>
                      <input 
                        type="text" 
                        id="className" 
                        name="className" 
                        value={profileData.className}
                        onChange={handleChange}
                        className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all flex justify-center items-center"
                      >
                        <i className="fas fa-save mr-2"></i> Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all flex justify-center items-center"
                      >
                        <i className="fas fa-times mr-2"></i> Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentProfile;