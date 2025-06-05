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
    { id: 1, name: 'Health Tips', icon: '🏥', color: '#10b981', color2: '#059669' },
    { id: 2, name: 'Mental Health', icon: '🧠', color: '#8b5cf6', color2: '#7c3aed' },
    { id: 3, name: 'Nutrition', icon: '🥗', color: '#f59e0b', color2: '#d97706' },
    { id: 4, name: 'Physical Activity', icon: '🏃', color: '#ef4444', color2: '#dc2626' },
    { id: 5, name: 'School Health Services', icon: '⚕️', color: '#3b82f6', color2: '#2563eb' }
  ];

  const isStudent = currentUser && currentUser.roles && (
    currentUser.roles.includes('ROLE_STUDENT') || 
    currentUser.roles.includes('ROLE_PARENT')
  );

  // Utility functions
  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const validatePost = (post) => {
    if (!post || typeof post !== 'object') return false;
    if (!post.title || typeof post.title !== 'string') return false;
    if (post.id === null || post.id === undefined || typeof post.id === 'object') return false;
    return true;
  };

  const cleanPostsData = (rawPosts) => {
    if (!Array.isArray(rawPosts)) return [];
    return rawPosts.filter(validatePost);
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
      const cleanedPosts = cleanPostsData(postsData);
      setAllPosts(cleanedPosts);
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
      const cleanedPosts = cleanPostsData(postsData);
      setPosts(cleanedPosts);
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
      <div className={`card mb-4 border-0 shadow-lg ${showCreateForm ? 'border-primary' : ''}`}>
        <div className="card-header bg-gradient text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              {editingPostId ? '✏️ Edit Post' : '✍️ Create New Blog Post'}
            </h5>
            {!showCreateForm && (
              <button 
                className="btn btn-light btn-sm"
                onClick={() => setShowCreateForm(true)}
              >
                ➕ New Post
              </button>
            )}
          </div>
        </div>
        
        {showCreateForm && (
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label fw-bold">
                      <i className="fas fa-heading me-2"></i>Title *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
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
                    <label htmlFor="categoryId" className="form-label fw-bold">
                      <i className="fas fa-tags me-2"></i>Category
                    </label>
                    <select
                      className="form-select form-select-lg"
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
                <label htmlFor="summary" className="form-label fw-bold">
                  <i className="fas fa-file-alt me-2"></i>Summary
                </label>
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
                <label htmlFor="content" className="form-label fw-bold">
                  <i className="fas fa-edit me-2"></i>Content *
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="8"
                  placeholder="Write your blog content here. Share your thoughts, experiences, or health tips!"
                  required
                  style={{minHeight: '200px'}}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tags" className="form-label fw-bold">
                  <i className="fas fa-hashtag me-2"></i>Tags
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas (e.g., health, wellness, tips)"
                />
                <div className="form-text">
                  <i className="fas fa-info-circle me-1"></i>
                  Separate tags with commas
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <i className={editingPostId ? "fas fa-save me-2" : "fas fa-paper-plane me-2"}></i>
                  {editingPostId ? 'Update Post' : 'Publish Post'}
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

    // Safety check for post.id to ensure it's a primitive value
    if (post.id === null || post.id === undefined || typeof post.id === 'object') {
      console.error('Invalid post.id:', post.id, 'Post:', post);
      return null;
    }

    const category = getCategoryInfo(post.categoryId);
    const isExpanded = expandedPost === post.id;
    
    return (
      <div key={String(post.id)} className="card mb-3 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary">{category.icon} {category.name}</span>
              <small className="text-muted">
                By {post.author?.fullName || post.author?.username || (typeof post.author === 'string' ? post.author : null) || currentUser?.fullName || 'Anonymous'} • {formatDate(post.createdAt || new Date())}
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
            allPosts.filter(validatePost).map(post => renderPostCard(post, false))
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
            posts.filter(validatePost).map(post => renderPostCard(post, true))
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container-fluid py-4" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Enhanced Header */}
            <div className="text-center mb-5">
              <div className="hero-section p-5 rounded-4 shadow-lg mb-4" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                  opacity: 0.1
                }} />
                <div style={{position: 'relative', zIndex: 1}}>
                  <h1 className="display-3 fw-bold mb-3">
                    <i className="fas fa-hospital-alt me-3"></i>
                    Student Health Blog
                  </h1>
                  <p className="lead fs-4 mb-4">
                    Share your health experiences, tips, and knowledge with fellow students
                  </p>
                  {isStudent && (
                    <div className="mt-4">
                      <button 
                        className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-sm"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          border: '2px solid transparent'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                        }}
                      >
                        <i className={`fas ${showCreateForm ? 'fa-times' : 'fa-plus-circle'} me-2`}></i>
                        {showCreateForm ? 'Cancel' : 'Create New Post'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Alert */}
            {renderMessage()}

            {/* Create Form */}
            {renderCreateForm()}

            {/* Enhanced Navigation Tabs */}
            <div className="nav-tabs-container mb-5">
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-0">
                  <ul className="nav nav-pills nav-fill p-3 m-0" style={{background: '#f8f9fa', borderRadius: '0.75rem'}}>
                    <li className="nav-item">
                      <button 
                        className={`nav-link px-4 py-3 fw-semibold rounded-3 transition-all ${activeTab === 'all' ? 'active shadow-sm' : 'text-muted'}`}
                        onClick={() => setActiveTab('all')}
                        style={{
                          transition: 'all 0.3s ease',
                          border: 'none',
                          backgroundColor: activeTab === 'all' ? '#667eea' : 'transparent',
                          color: activeTab === 'all' ? 'white' : '#6b7280',
                          fontSize: '1rem'
                        }}
                      >
                        <i className="fas fa-globe me-2"></i>
                        All Posts
                        <span className="badge bg-light text-dark ms-2" style={{
                          backgroundColor: activeTab === 'all' ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                          color: activeTab === 'all' ? 'white' : '#374151'
                        }}>
                          {Array.isArray(allPosts) ? allPosts.length : 0}
                        </span>
                      </button>
                    </li>
                    {isStudent && (
                      <li className="nav-item">
                        <button 
                          className={`nav-link px-4 py-3 fw-semibold rounded-3 transition-all ${activeTab === 'my' ? 'active shadow-sm' : 'text-muted'}`}
                          onClick={() => setActiveTab('my')}
                          style={{
                            transition: 'all 0.3s ease',
                            border: 'none',
                            backgroundColor: activeTab === 'my' ? '#667eea' : 'transparent',
                            color: activeTab === 'my' ? 'white' : '#6b7280',
                            fontSize: '1rem'
                          }}
                        >
                          <i className="fas fa-user-edit me-2"></i>
                          My Posts
                          <span className="badge bg-light text-dark ms-2" style={{
                            backgroundColor: activeTab === 'my' ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                            color: activeTab === 'my' ? 'white' : '#374151'
                          }}>
                            {Array.isArray(posts) ? posts.length : 0}
                          </span>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBlog;
