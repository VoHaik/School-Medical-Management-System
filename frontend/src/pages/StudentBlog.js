import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const StudentBlog = () => {
  const { getAuthAxios } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [editingPostId, setEditingPostId] = useState(null);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/blog/my-posts');
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading posts:', error);
      setMessage('Error loading your posts. Please try again later.');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setMessage('Please fill in both title and content.');
      setMessageType('error');
      return;
    }
    
    try {
      const authAxios = getAuthAxios();
      
      if (editingPostId) {
        // Update existing post
        await authAxios.put(`/api/blog/${editingPostId}`, formData);
        setMessage('Blog post updated successfully!');
      } else {
        // Create new post
        await authAxios.post('/api/blog', formData);
        setMessage('Blog post published successfully!');
      }
      
      setMessageType('success');
      setFormData({ title: '', content: '' });
      setEditingPostId(null);
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage('Error saving blog post. Please try again later.');
      setMessageType('error');
    }
  };

  const handleEdit = async (postId) => {
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get(`/api/blog/${postId}`);
      
      setFormData({
        title: response.data.title,
        content: response.data.content
      });
      
      setEditingPostId(postId);
      
      // Scroll to form
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error loading post for edit:', error);
      setMessage('Error loading post for editing. Please try again.');
      setMessageType('error');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const authAxios = getAuthAxios();
        await authAxios.delete(`/api/blog/${postId}`);
        
        setMessage('Blog post deleted successfully!');
        setMessageType('success');
        loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        setMessage('Error deleting blog post. Please try again.');
        setMessageType('error');
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({ title: '', content: '' });
    setEditingPostId(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Student Blog</h2>
            <p className="text-xl text-gray-600">Share your thoughts and experiences with the school community</p>
          </div>

          {message && (
            <div className={`mb-6 text-center font-medium rounded-lg py-3 ${
              messageType === 'success' ? 'bg-green-100 text-green-700 p-4' : 'bg-red-100 text-red-700 p-4'
            }`}>
              {message}
            </div>
          )}

          {/* Create Blog Post Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
            <h3 className="text-2xl font-bold mb-6">
              {editingPostId ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
                  <i className="fas fa-heading text-indigo-500 mr-2"></i>Title
                </label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  required 
                  maxLength="200"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter blog post title"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="content">
                  <i className="fas fa-pen text-indigo-500 mr-2"></i>Content
                </label>
                <textarea 
                  id="content" 
                  name="content" 
                  required 
                  rows="6"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Write your blog post content here..."
                ></textarea>
              </div>

              <div className="flex space-x-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all flex justify-center items-center"
                >
                  {editingPostId ? (
                    <>
                      <i className="fas fa-save mr-2"></i> Update Post
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i> Publish Post
                    </>
                  )}
                </button>
                
                {editingPostId && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all flex justify-center items-center"
                  >
                    <i className="fas fa-times mr-2"></i> Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* My Blog Posts */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6">My Blog Posts</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-indigo-600 text-3xl"></i>
                <p className="mt-2 text-gray-600">Loading your posts...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center text-gray-500">You haven't created any posts yet.</div>
                ) : (
                  posts.map(post => (
                    <div key={post.id} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-semibold">{post.title}</h4>
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEdit(post.id)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(post.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{post.content}</p>
                      <div className="text-sm text-gray-500">
                        <i className="far fa-calendar-alt mr-1"></i> {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentBlog;