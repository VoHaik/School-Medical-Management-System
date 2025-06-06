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

    // Enhanced categories with colors
    const categories = [
        { id: 1, name: 'Health Tips', icon: '🏥', color: '#10b981', color2: '#059669' },
        { id: 2, name: 'Mental Health', icon: '🧠', color: '#8b5cf6', color2: '#7c3aed' },
        { id: 3, name: 'Nutrition', icon: '🥗', color: '#f59e0b', color2: '#d97706' },
        { id: 4, name: 'Physical Activity', icon: '🏃', color: '#ef4444', color2: '#dc2626' },
        { id: 5, name: 'School Health Services', icon: '⚕️', color: '#3b82f6', color2: '#2563eb' }
    ];

    const isStudent = currentUser && currentUser.roles && (
        currentUser.roles.includes('ROLE_STUDENT') ||
        currentUser.roles.includes('ROLE_Student') ||
        currentUser.roles.includes('ROLE_PARENT') ||
        currentUser.roles.includes('ROLE_Parent')
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
        if (post.id === null || post.id === undefined) return false;
        if (typeof post.id !== 'number' && isNaN(Number(post.id))) return false;
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
            console.log('Raw API response:', response); // Debug log
            console.log('Response data:', response.data); // Debug log
            console.log('Response data type:', typeof response.data); // Debug log
            console.log('Response data length:', Array.isArray(response.data) ? response.data.length : 'Not an array'); // Debug log
            
            const postsData = response.data || [];
            console.log('Posts data before cleaning:', postsData); // Debug log
            
            const cleanedPosts = cleanPostsData(postsData);
            console.log('Posts after cleaning:', cleanedPosts); // Debug log
            
            setAllPosts(cleanedPosts);
        } catch (error) {
            console.error('Error loading all posts:', error);
            console.error('Error response:', error.response); // Debug log
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
            console.log('My posts response:', response.data); // Debug log
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

    const testBackendConnection = async () => {
        try {
            console.log('Testing backend connection...');
            const response = await axios.get('/api/blog');
            console.log('Backend connection successful:', response.status);
            console.log('Current blog posts in database:', response.data);
            if (Array.isArray(response.data) && response.data.length > 0) {
                showMessage(`Backend is running correctly. Found ${response.data.length} blog posts.`, 'success');
            } else {
                showMessage('Backend is running correctly. No blog posts found in database.', 'info');
            }
        } catch (error) {
            console.error('Backend connection failed:', error);
            if (error.code === 'ERR_NETWORK') {
                showMessage('Backend server is not running on port 8080', 'error');
            } else {
                showMessage(`Backend error: ${error.response?.status || error.message}`, 'error');
            }
        }
    };

    const createTestPost = async () => {
        try {
            const response = await axios.post('/api/blog/test-create');
            console.log('Test post created:', response.data);
            showMessage('Test post created successfully!', 'success');
            loadAllPosts();
        } catch (error) {
            console.error('Error creating test post:', error);
            showMessage('Failed to create test post', 'error');
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadAllPosts();
        if (isStudent) {
            loadMyPosts();
        }
    }, [isStudent]);

    // Enhanced render functions
    const renderMessage = () => {
        if (!message) return null;

        return (
            <div className={`alert alert-${messageType === 'error' ? 'danger' : messageType === 'success' ? 'success' : 'info'} alert-dismissible fade show rounded-3 shadow-sm`}>
                <i className={`fas ${messageType === 'error' ? 'fa-exclamation-triangle' : messageType === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2`}></i>
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
        );
    };    const renderCreateForm = () => {
        if (!isStudent) return null;

        return (
            <div className={`blog-editor-container mb-5 ${showCreateForm ? 'expanded' : ''}`} style={{borderRadius: '1.5rem'}}>
                {/* Enhanced Header với glassmorphism effect */}
                <div
                    className="editor-header border-0 p-4 position-relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '1.5rem 1.5rem 0 0',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                    }}
                >
                    {/* Animated background pattern */}
                    <div
                        className="position-absolute w-100 h-100"
                        style={{
                            top: 0,
                            left: 0,
                            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            animation: 'float 6s ease-in-out infinite'
                        }}
                    ></div>
                    
                    <div className="d-flex justify-content-between align-items-center position-relative" style={{zIndex: 2}}>
                        <div className="d-flex align-items-center">
                            <div className="editor-icon-container me-3 p-3 rounded-circle" style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <i className={`fas ${editingPostId ? 'fa-edit' : 'fa-feather-alt'} text-white`} style={{fontSize: '1.5rem'}}></i>
                            </div>
                            <div>
                                <h4 className="mb-1 text-white fw-bold">
                                    {editingPostId ? 'Edit Your Story' : 'Create Your Story'}
                                </h4>
                                <p className="mb-0 text-white-50">
                                    {editingPostId ? 'Polish your thoughts and update your post' : 'Share your knowledge and experiences with the community'}
                                </p>
                            </div>
                        </div>
                        {!showCreateForm && (
                            <button
                                className="btn btn-light btn-lg rounded-pill px-4 shadow-sm"
                                onClick={() => setShowCreateForm(true)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                }}                            >
                                <i className="fas fa-plus me-2 text-primary"></i>
                                <span className="fw-semibold">Start Writing</span>
                            </button>
                        )}
                          {/* Test buttons for debugging */}
                        <button
                            type="button"
                            className="btn btn-outline-info btn-sm ms-3"
                            onClick={testBackendConnection}
                            style={{
                                borderRadius: '30px',
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <i className="fas fa-wifi me-2"></i>
                            Test Backend
                        </button>
                        
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm ms-2"
                            onClick={createTestPost}
                            style={{
                                borderRadius: '30px',
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <i className="fas fa-vial me-2"></i>
                            Create Test Post
                        </button>
                    </div>
                </div>

                {showCreateForm && (
                    <div className="editor-body" style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
                        borderRadius: '0 0 1.5rem 1.5rem',
                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.1)'
                    }}>
                        <form onSubmit={handleSubmit} className="p-5">
                            {/* Title & Category Row với enhanced styling */}
                            <div className="row g-4 mb-4">
                                <div className="col-lg-8">
                                    <div className="form-floating mb-0">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter your story title..."
                                            required
                                            style={{
                                                border: '2px solid #e1e8f7',
                                                borderRadius: '1rem',
                                                fontSize: '1.1rem',
                                                height: '65px',
                                                background: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#667eea';
                                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
                                                e.target.style.background = 'rgba(255, 255, 255, 1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e1e8f7';
                                                e.target.style.boxShadow = 'none';
                                                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                                            }}
                                        />
                                        <label htmlFor="title" className="d-flex align-items-center text-muted">
                                            <i className="fas fa-heading me-2 text-primary"></i>
                                            Story Title *
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="form-floating mb-0">
                                        <select
                                            className="form-select form-select-lg"
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            style={{
                                                border: '2px solid #e1e8f7',
                                                borderRadius: '1rem',
                                                height: '65px',
                                                background: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.icon} {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="categoryId" className="d-flex align-items-center text-muted">
                                            <i className="fas fa-tags me-2 text-primary"></i>
                                            Category
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Summary với enhanced design */}
                            <div className="mb-4">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="summary"
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleInputChange}
                                        placeholder="Brief summary..."
                                        style={{
                                            border: '2px solid #e1e8f7',
                                            borderRadius: '1rem',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            height: '60px'
                                        }}
                                    />
                                    <label htmlFor="summary" className="d-flex align-items-center text-muted">
                                        <i className="fas fa-file-alt me-2 text-primary"></i>
                                        Summary (Optional)
                                    </label>
                                </div>
                                <div className="form-text ms-3 mt-2">
                                    <i className="fas fa-lightbulb me-1 text-warning"></i>
                                    A compelling summary helps readers understand your post at a glance
                                </div>
                            </div>

                            {/* Enhanced Content Editor */}
                            <div className="mb-4">
                                <label htmlFor="content" className="form-label fw-bold d-flex align-items-center mb-3">
                                    <div className="editor-label-icon me-3 p-2 rounded-circle" style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white'
                                    }}>
                                        <i className="fas fa-feather-alt"></i>
                                    </div>
                                    <div>
                                        <span className="text-dark">Your Story Content *</span>
                                        <div className="text-muted fw-normal small">Express your thoughts, share your experiences</div>
                                    </div>
                                </label>
                                
                                {/* Content writing area với toolbar giả */}
                                <div className="content-editor-container" style={{
                                    border: '2px solid #e1e8f7',
                                    borderRadius: '1rem',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    overflow: 'hidden'
                                }}>
                                    {/* Mock toolbar for visual appeal */}
                                    <div className="editor-toolbar p-3 border-bottom" style={{
                                        background: 'linear-gradient(135deg, #f8faff 0%, #eef4ff 100%)',
                                        borderBottom: '1px solid #e1e8f7'
                                    }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="toolbar-group d-flex gap-1">
                                                <span className="toolbar-btn badge bg-light text-muted px-2 py-1 rounded">
                                                    <i className="fas fa-bold"></i>
                                                </span>
                                                <span className="toolbar-btn badge bg-light text-muted px-2 py-1 rounded">
                                                    <i className="fas fa-italic"></i>
                                                </span>
                                                <span className="toolbar-btn badge bg-light text-muted px-2 py-1 rounded">
                                                    <i className="fas fa-list-ul"></i>
                                                </span>
                                            </div>
                                            <div className="vr"></div>
                                            <small className="text-muted d-flex align-items-center">
                                                <i className="fas fa-info-circle me-1"></i>
                                                <span id="charCount">{formData.content.length} characters</span>
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <textarea
                                        className="form-control border-0"
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        rows="12"
                                        placeholder="Start writing your story here... 

💡 Share your experiences, knowledge, or insights
📝 Use clear paragraphs to organize your thoughts  
🎯 Be authentic and helpful to your readers
✨ Don't forget to proofread before publishing"
                                        required
                                        style={{
                                            resize: 'vertical',
                                            minHeight: '300px',
                                            fontSize: '1rem',
                                            lineHeight: '1.7',
                                            background: 'transparent'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Enhanced Tags Input */}
                            <div className="mb-5">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="health, wellness, tips..."
                                        style={{
                                            border: '2px solid #e1e8f7',
                                            borderRadius: '1rem',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            height: '60px'
                                        }}
                                    />
                                    <label htmlFor="tags" className="d-flex align-items-center text-muted">
                                        <i className="fas fa-hashtag me-2 text-primary"></i>
                                        Tags
                                    </label>
                                </div>
                                <div className="form-text ms-3 mt-2 d-flex align-items-center">
                                    <i className="fas fa-tags me-2 text-info"></i>
                                    <span>Separate tags with commas. Good tags help others discover your content!</span>
                                </div>
                                
                                {/* Tag suggestions */}
                                <div className="mt-3 ms-3">
                                    <small className="text-muted d-block mb-2">💡 Suggested tags:</small>
                                    <div className="d-flex flex-wrap gap-2">
                                        {['health', 'wellness', 'tips', 'lifestyle', 'medical', 'fitness', 'nutrition', 'mental-health'].map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className="btn btn-outline-primary btn-sm rounded-pill"
                                                onClick={() => {
                                                    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
                                                    if (!currentTags.includes(tag)) {
                                                        const newTags = [...currentTags, tag].filter(t => t).join(', ');
                                                        setFormData(prev => ({...prev, tags: newTags}));
                                                    }
                                                }}
                                                style={{fontSize: '0.8rem'}}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Action Buttons */}
                            <div className="d-flex gap-3 justify-content-end align-items-center pt-4 border-top" style={{borderColor: '#e1e8f7 !important'}}>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary btn-lg rounded-pill px-4" 
                                    onClick={resetForm}
                                    style={{
                                        borderWidth: '2px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(108, 117, 125, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <i className="fas fa-times me-2"></i>
                                    Cancel
                                </button>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-lg rounded-pill px-5 text-white fw-bold"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.3s ease',
                                        minWidth: '160px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                    }}
                                >
                                    <i className={`fas ${editingPostId ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>
                                    {editingPostId ? 'Update Story' : 'Publish Story'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    };

    const renderPostCard = (post, showActions = false) => {
        if (!post || typeof post !== 'object' || !post.title) {
            console.error('Invalid post object:', post);
            return null;
        }

        if (post.id === null || post.id === undefined || typeof post.id === 'object') {
            console.error('Invalid post.id:', post.id, 'Post:', post);
            return null;
        }

        const category = getCategoryInfo(post.categoryId);
        const isExpanded = expandedPost === post.id;

        return (
            <div
                key={String(post.id)}
                className="card mb-4 border-0 shadow-sm"
                style={{
                    transition: 'all 0.3s ease',
                    borderRadius: '1rem',
                    overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                }}
            >
                {/* Enhanced Card Header with Gradient */}
                <div
                    className="card-header border-0 p-4"
                    style={{
                        background: `linear-gradient(135deg, ${category.color || '#667eea'} 0%, ${category.color2 || '#764ba2'} 100%)`,
                        color: 'white'
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="category-icon p-3 rounded-circle bg-white bg-opacity-20"
                                style={{fontSize: '1.3rem'}}
                            >
                                {category.icon}
                            </div>
                            <div>
                <span className="badge bg-white bg-opacity-20 text-white fw-normal px-3 py-2 rounded-pill">
                  {category.name}
                </span>
                                <div className="mt-2">
                                    <small className="text-white-50 d-flex align-items-center">
                                        <i className="fas fa-user-circle me-2"></i>
                                        By {post.author?.fullName || post.author?.username || (typeof post.author === 'string' ? post.author : null) || currentUser?.fullName || 'Anonymous'}
                                        <span className="mx-2">•</span>
                                        <i className="fas fa-calendar-alt me-1"></i>
                                        {formatDate(post.createdAt || new Date())}
                                    </small>
                                </div>
                            </div>
                        </div>
                        {showActions && (
                            <div className="dropdown">
                                <button
                                    className="btn btn-link text-white p-2 rounded-circle"
                                    data-bs-toggle="dropdown"
                                    style={{fontSize: '1.2rem'}}
                                >
                                    <i className="fas fa-ellipsis-v"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
                                    <li>
                                        <button className="dropdown-item py-2 rounded-2" onClick={() => handleEdit(post)}>
                                            <i className="fas fa-edit me-2 text-primary"></i>Edit Post
                                        </button>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item py-2 text-danger rounded-2" onClick={() => handleDelete(post.id)}>
                                            <i className="fas fa-trash-alt me-2"></i>Delete Post
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Card Body */}
                <div className="card-body p-4">
                    <h4 className="card-title fw-bold mb-3" style={{color: '#1f2937', lineHeight: '1.3'}}>
                        {post.title}
                    </h4>

                    {post.summary && (
                        <div className="summary-section mb-4 p-3 rounded-3" style={{
                            backgroundColor: '#f8fafc',
                            borderLeft: '4px solid ' + (category.color || '#667eea'),
                            fontSize: '1rem'
                        }}>
                            <i className="fas fa-quote-left me-2" style={{color: category.color || '#667eea'}}></i>
                            <span className="fst-italic text-muted">{post.summary}</span>
                        </div>
                    )}

                    <div className="content-section mb-4">
                        {isExpanded ? (
                            <div>
                                <div
                                    className="content-expanded p-3 rounded-3"
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        backgroundColor: '#fafbfc',
                                        border: '1px solid #e5e7eb',
                                        fontSize: '1rem',
                                        lineHeight: '1.7'
                                    }}
                                >
                                    {post.content}
                                </div>
                                <button
                                    className="btn btn-outline-primary btn-sm mt-3 rounded-pill"
                                    onClick={() => setExpandedPost(null)}
                                >
                                    <i className="fas fa-chevron-up me-2"></i>
                                    Show less
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{fontSize: '1rem', lineHeight: '1.6', color: '#4b5563'}}>
                                    {truncateContent(post.content)}
                                </p>
                                {post.content && post.content.length > 150 && (
                                    <button
                                        className="btn btn-primary btn-sm rounded-pill"
                                        onClick={() => setExpandedPost(post.id)}
                                        style={{background: category.color || '#667eea', border: 'none'}}
                                    >
                                        <i className="fas fa-chevron-down me-2"></i>
                                        Read more...
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="tags-section mt-4 pt-3" style={{borderTop: '1px solid #f3f4f6'}}>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <i className="fas fa-tags text-muted me-2"></i>
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="badge rounded-pill px-3 py-2 me-2 mb-2"
                                        style={{
                                            backgroundColor: category.color + '20',
                                            color: category.color || '#6b7280',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            border: '1px solid ' + (category.color + '40' || '#e5e7eb')
                                        }}
                                    >
                    #{typeof tag === 'string' ? tag : String(tag)}
                  </span>
                                ))}
                            </div>
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
                    <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted fs-5">Loading blog posts...</p>
                </div>
            );
        }

        if (activeTab === 'all') {
            return (
                <div>
                    <div className="section-header mb-4 p-3 rounded-3" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
                        <h4 className="mb-0 d-flex align-items-center">
                            <i className="fas fa-globe text-primary me-3"></i>
                            All Blog Posts
                            <span className="badge bg-primary ms-3">{Array.isArray(allPosts) ? allPosts.length : 0}</span>
                        </h4>
                    </div>
                    {!Array.isArray(allPosts) || allPosts.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="empty-state p-5 rounded-3" style={{background: '#f8fafc'}}>
                                <i className="fas fa-newspaper display-1 text-muted mb-3"></i>
                                <h5>No blog posts available</h5>
                                <p className="text-muted">Be the first to share your health knowledge!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="posts-grid">
                            {allPosts.filter(validatePost).map(post => renderPostCard(post, false))}
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === 'my' && isStudent) {
            return (
                <div>
                    <div className="section-header mb-4 p-3 rounded-3" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
                        <h4 className="mb-0 d-flex align-items-center">
                            <i className="fas fa-user-edit text-primary me-3"></i>
                            My Blog Posts
                            <span className="badge bg-primary ms-3">{Array.isArray(posts) ? posts.length : 0}</span>
                        </h4>
                    </div>
                    {!Array.isArray(posts) || posts.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="empty-state p-5 rounded-3" style={{background: '#f8fafc'}}>
                                <i className="fas fa-edit display-1 text-muted mb-3"></i>
                                <h5>You haven't created any posts yet</h5>
                                <p className="text-muted">Start sharing your health experiences and knowledge!</p>
                                <button
                                    className="btn btn-primary btn-lg rounded-pill px-4"
                                    onClick={() => setShowCreateForm(true)}
                                    style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
                                >
                                    <i className="fas fa-plus-circle me-2"></i>
                                    Create Your First Post
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="posts-grid">
                            {posts.filter(validatePost).map(post => renderPostCard(post, true))}
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="student-blog-container" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '100vh',
            paddingTop: '2rem',
            paddingBottom: '2rem'
        }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Enhanced Hero Header */}
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
                                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 0V4h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
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
                                                className={`nav-link px-4 py-3 fw-semibold rounded-3 ${activeTab === 'all' ? 'active shadow-sm' : 'text-muted'}`}
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
                                                <span className="badge ms-2" style={{
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
                                                    className={`nav-link px-4 py-3 fw-semibold rounded-3 ${activeTab === 'my' ? 'active shadow-sm' : 'text-muted'}`}
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
                                                    <span className="badge ms-2" style={{
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
