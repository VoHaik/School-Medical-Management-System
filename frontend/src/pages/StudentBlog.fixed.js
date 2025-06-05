import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const StudentBlog = () => {
  const { getAuthAxios, currentUser } = useContext(AuthContext);
  
  // State management
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    categoryId: 1,
    summary: ''
  });

  const categories = [
    { id: 1, name: 'Health Tips', icon: '🏥' },
    { id: 2, name: 'Mental Health', icon: '🧠' },
    { id: 3, name: 'Nutrition', icon: '🥗' },
    { id: 4, name: 'Physical Activity', icon: '🏃' },
    { id: 5, name: 'School Health Services', icon: '⚕️' }
  ];

  const isStudent = currentUser && currentUser.roles && currentUser.roles.includes('ROLE_STUDENT');

  // Utility functions
  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content || typeof content !== 'string') return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Load functions
  const loadAllPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog');
      const postsData = response.data || [];
      
      // Ensure we have an array of valid post objects
      if (Array.isArray(postsData)) {
        setAllPosts(postsData);
      } else {
        console.error('Invalid all posts data received:', postsData);
        setAllPosts([]);
      }
    } catch (error) {
      console.error('Error loading all posts:', error);
      setAllPosts([]);
      showMessage('Failed to load blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMyPosts = async () => {
    if (!isStudent) return;
    
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/blog/my-posts');
      const postsData = response.data || [];
      
      // Ensure we have an array of valid post objects
      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else {
        console.error('Invalid posts data received:', postsData);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error loading my posts:', error);
      if (error.response?.status === 404) {
        setPosts([]);
      } else {
        showMessage('Failed to load your posts', 'error');
        setPosts([]);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      tags: '',
      categoryId: 1,
      summary: ''
    });
    setEditingPostId(null);
    setShowCreateForm(false);
  };

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      showMessage('Please fill in title and content', 'error');
      return;
    }

    try {
      const authAxios = getAuthAxios();
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingPostId) {
        await authAxios.put(`/api/blog/${editingPostId}`, postData);
        showMessage('Post updated successfully!', 'success');
      } else {
        await authAxios.post('/api/blog', postData);
        showMessage('Post created successfully!', 'success');
      }

      resetForm();
      loadMyPosts();
      loadAllPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      showMessage('Failed to save post. Please try again.', 'error');
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.join(', ') : '',
      categoryId: post.categoryId || 1,
      summary: post.summary || ''
    });
    setEditingPostId(post.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const authAxios = getAuthAxios();
      await authAxios.delete(`/api/blog/${postId}`);
      showMessage('Post deleted successfully!', 'success');
      loadMyPosts();
      loadAllPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      showMessage('Failed to delete post', 'error');
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAllPosts();
    if (isStudent) {
      loadMyPosts();
    }
  }, [isStudent]);

  // Render functions
  const renderMessage = () => {
    if (!message) return null;
    
    return (
      <div className={`alert alert-${messageType === 'error' ? 'danger' : messageType === 'success' ? 'success' : 'info'} alert-dismissible fade show`}>
        {message}
        <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
      </div>
    );
  };

  const renderCreateForm = () => {
    if (!isStudent) return null;

    return (
      <div className="card mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {editingPostId ? '✏️ Edit Post' : '✍️ Create New Blog Post'}
          </h5>
          <button 
            className="btn btn-light btn-sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'New Post'}
          </button>
        </div>
        
        {showCreateForm && (
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter an engaging title for your blog post"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="categoryId" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="summary" className="form-label">Summary</label>
                <input
                  type="text"
                  className="form-control"
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief summary of your post (optional)"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="content" className="form-label">Content *</label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="8"
                  placeholder="Write your blog content here. Share your thoughts, experiences, or health tips!"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="tags" className="form-label">Tags</label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas (e.g., health, wellness, tips)"
                />
                <div className="form-text">Separate tags with commas</div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingPostId ? '💾 Update Post' : '📝 Publish Post'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  const renderPostCard = (post, showActions = false) => {
    // Safety check - ensure post is a valid object with required properties
    if (!post || typeof post !== 'object' || !post.title) {
      console.error('Invalid post object:', post);
      return null;
    }

    const category = getCategoryInfo(post.categoryId);
    const isExpanded = expandedPost === post.id;
    
    return (
      <div key={post.id} className="card mb-3 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary">{category.icon} {category.name}</span>
              <small className="text-muted">
                By {post.author || currentUser?.fullName || 'Anonymous'} • {formatDate(post.createdAt || new Date())}
              </small>
            </div>
            {showActions && (
              <div className="dropdown">
                <button className="btn btn-link btn-sm" data-bs-toggle="dropdown">
                  ⋮
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => handleEdit(post)}>✏️ Edit</button></li>
                  <li><button className="dropdown-item text-danger" onClick={() => handleDelete(post.id)}>🗑️ Delete</button></li>
                </ul>
              </div>
            )}
          </div>

          <h5 className="card-title">{post.title}</h5>
          
          {post.summary && (
            <p className="text-muted fst-italic">{post.summary}</p>
          )}

          <div className="card-text">
            {isExpanded ? (
              <div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                <button 
                  className="btn btn-link p-0 text-primary"
                  onClick={() => setExpandedPost(null)}
                >
                  Show less
                </button>
              </div>
            ) : (
              <div>
                <p>{truncateContent(post.content)}</p>
                {post.content && post.content.length > 150 && (
                  <button 
                    className="btn btn-link p-0 text-primary"
                    onClick={() => setExpandedPost(post.id)}
                  >
                    Read more...
                  </button>
                )}
              </div>
            )}
          </div>

          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="badge bg-light text-dark me-1">
                  #{typeof tag === 'string' ? tag : String(tag)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading blog posts...</p>
        </div>
      );
    }

    if (activeTab === 'all') {
      return (
        <div>
          <h4 className="mb-3">📰 All Blog Posts</h4>
          {!Array.isArray(allPosts) || allPosts.length === 0 ? (
            <div className="text-center py-5">
              <h5>No blog posts available</h5>
              <p className="text-muted">Be the first to share your health knowledge!</p>
            </div>
          ) : (
            allPosts.map(post => renderPostCard(post, false))
          )}
        </div>
      );
    }

    if (activeTab === 'my' && isStudent) {
      return (
        <div>
          <h4 className="mb-3">📝 My Blog Posts</h4>
          {!Array.isArray(posts) || posts.length === 0 ? (
            <div className="text-center py-5">
              <h5>You haven't created any posts yet</h5>
              <p className="text-muted">Start sharing your health experiences and knowledge!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            posts.map(post => renderPostCard(post, true))
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="mb-4">
            <h2 className="display-6">🏥 Student Health Blog</h2>
            <p className="lead text-muted">
              Share your health experiences, tips, and knowledge with fellow students
            </p>
          </div>

          {/* Message Alert */}
          {renderMessage()}

          {/* Create Form */}
          {renderCreateForm()}

          {/* Navigation Tabs */}
          <ul className="nav nav-pills mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                📰 All Posts
              </button>
            </li>
            {isStudent && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'my' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my')}
                >
                  📝 My Posts ({Array.isArray(posts) ? posts.length : 0})
                </button>
              </li>
            )}
          </ul>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentBlog;
