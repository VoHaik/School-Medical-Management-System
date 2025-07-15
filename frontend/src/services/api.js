import apiClient from '../utils/api';

// Parent Registration API functions
export const submitParentRegistration = async (registrationData) => {
  try {
    const response = await apiClient.post('/parent-registration/submit', registrationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting parent registration:', error);
    throw error;
  }
};

export const getAllParentRegistrationRequests = async () => {
  try {
    const response = await apiClient.get('/parent-registration/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching parent registration requests:', error);
    throw error;
  }
};

export const getParentRegistrationRequestsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`/parent-registration/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parent registration requests by status:', error);
    throw error;
  }
};

export const approveParentRegistrationRequest = async (requestId, adminUserId) => {
  try {
    const response = await apiClient.post(`/parent-registration/${requestId}/approve`, {
      adminUserId: adminUserId
    });
    return response.data;
  } catch (error) {
    console.error('Error approving parent registration request:', error);
    throw error;
  }
};

export const declineParentRegistrationRequest = async (requestId, adminUserId, reason) => {
  try {
    const response = await apiClient.post(`/parent-registration/${requestId}/decline`, {
      adminUserId: adminUserId,
      reason: reason
    });
    return response.data;
  } catch (error) {
    console.error('Error declining parent registration request:', error);
    throw error;
  }
};

// User Management API functions
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await apiClient.post(`/admin/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
};

export const activateUser = async (userId) => {
  try {
    const response = await apiClient.post(`/admin/users/${userId}/activate`);
    return response.data;
  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Blog Post API functions
export const getAllBlogPosts = async () => {
  try {
    const response = await apiClient.get('/blog');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

export const getBlogPostById = async (id) => {
  try {
    const response = await apiClient.get(`/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

export const getBlogPostsByAuthor = async (authorId) => {
  try {
    const response = await apiClient.get(`/blog/author/${authorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts by author:', error);
    throw error;
  }
};

export const getMyBlogPosts = async () => {
  try {
    const response = await apiClient.get('/blog/my-posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching my blog posts:', error);
    throw error;
  }
};

export const createBlogPost = async (blogPostData) => {
  try {
    const response = await apiClient.post('/blog', blogPostData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id, blogPostData) => {
  try {
    const response = await apiClient.put(`/blog/${id}`, blogPostData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id) => {
  try {
    const response = await apiClient.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Re-export apiClient for convenience
export default apiClient;