import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAlert } from '../hooks/useAlert'; // Import useAlert hook
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const NurseBlog = () => {
    const { getAuthAxios, currentUser } = useContext(AuthContext);
    const { successAlert, errorAlert, deleteConfirm } = useAlert(); // Initialize useAlert hook

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

    // Enhanced categories for health professionals
    const categories = [
        { id: 1, name: 'Health Education', icon: '📚', color: '#10b981', color2: '#059669', description: 'Educational content for students and parents' },
        { id: 2, name: 'Mental Health', icon: '🧠', color: '#8b5cf6', color2: '#7c3aed', description: 'Mental wellness and psychological health' },
        { id: 3, name: 'Nutrition Guidelines', icon: '🥗', color: '#f59e0b', color2: '#d97706', description: 'Nutritional advice and healthy eating' },
        { id: 4, name: 'Physical Activity', icon: '🏃', color: '#ef4444', color2: '#dc2626', description: 'Exercise and physical wellness' },
        { id: 5, name: 'Health Alerts', icon: '⚠️', color: '#f97316', color2: '#ea580c', description: 'Important health notifications and alerts' },
        { id: 6, name: 'Preventive Care', icon: '🛡️', color: '#06b6d4', color2: '#0891b2', description: 'Disease prevention and health maintenance' }
    ];

    // Check if user is a nurse
    const isNurse = currentUser && currentUser.roles && (
        currentUser.roles.includes('SCHOOLNURSE') ||
        currentUser.roles.includes('ROLE_SCHOOLNURSE')
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateContent = (content, maxLength = 200) => {
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
            const errorDetails = handleApiError(error, 'Failed to load blog posts');
            console.error('Error loading all posts:', errorDetails);
            setAllPosts([]);
            showMessage(errorDetails.message, errorDetails.type);
        } finally {
            setLoading(false);
        }
    };

    const loadMyPosts = async () => {
        if (!isNurse) return;
        try {
            const authAxios = getAuthAxios();
            const response = await authAxios.get('/api/blog/my-posts');
            const postsData = response.data || [];
            const cleanedPosts = cleanPostsData(postsData);
            setPosts(cleanedPosts);
        } catch (error) {
            const errorDetails = handleApiError(error, 'Failed to load your posts');
            console.error('Error loading my posts:', errorDetails);
            setPosts([]);
            showMessage(errorDetails.message, errorDetails.type);
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
                showMessage('Post published successfully!', 'success');
            }

            resetForm();
            loadMyPosts();
            loadAllPosts();
        } catch (error) {
            const errorDetails = handleApiError(error, 'Failed to save post');
            console.error('Error saving post:', errorDetails);
            showMessage(errorDetails.message, 'error');
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
        const confirmed = await deleteConfirm('Are you sure you want to delete this post?');
        if (!confirmed) return;

        try {
            const authAxios = getAuthAxios();
            await authAxios.delete(`/api/blog/${postId}`);
            successAlert('Post deleted successfully!');
            loadMyPosts();
            loadAllPosts();
        } catch (error) {
            const errorDetails = handleApiError(error, 'Failed to delete post');
            console.error('Error deleting post:', errorDetails);
            showMessage(errorDetails.message, 'error');
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadAllPosts();
        if (isNurse) {
            loadMyPosts();
        }
    }, [isNurse]);

    // Render functions
    const renderMessage = () => {
        if (!message) return null;

        return (
            <div className={`alert alert-${messageType === 'error' ? 'danger' : messageType === 'success' ? 'success' : 'info'} alert-dismissible fade show rounded-3 shadow-sm`}>
                <i className={`fas ${messageType === 'error' ? 'fa-exclamation-triangle' : messageType === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2`}></i>
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
        );
    };

    const renderCreateForm = () => {
        if (!isNurse) return null;

        return (
            <div className={`blog-editor-container mb-5 ${showCreateForm ? 'expanded' : ''}`} style={{borderRadius: '1.5rem'}}>
                {/* Enhanced Header with medical theme */}
                <div
                    className="editor-header border-0 p-4 position-relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '1.5rem 1.5rem 0 0',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    {/* Medical pattern background */}
                    <div
                        className="position-absolute w-100 h-100"
                        style={{
                            top: 0,
                            left: 0,
                            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1 -20 0M30 20v20M20 30h20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            animation: 'float 6s ease-in-out infinite'
                        }}
                    ></div>
                    
                    <div className="d-flex justify-content-between align-items-center position-relative" style={{zIndex: 2}}>
                        <div className="d-flex align-items-center">
                            <div className="editor-icon-container me-3 p-3 rounded-circle" style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <i className={`fas ${editingPostId ? 'fa-edit' : 'fa-stethoscope'} text-white`} style={{fontSize: '1.5rem'}}></i>
                            </div>
                            <div>
                                <h4 className="mb-1 text-white fw-bold">
                                    {editingPostId ? 'Edit Health Article' : 'Create Health Article'}
                                </h4>
                                <p className="mb-0 text-white-50">
                                    {editingPostId ? 'Update your health content for the school community' : 'Share professional health guidance and education'}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-light btn-lg rounded-pill px-4"
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className={`fas ${showCreateForm ? 'fa-times' : 'fa-plus-circle'} me-2`}></i>
                                {showCreateForm ? 'Cancel' : 'New Article'}
                            </button>
                        </div>
                    </div>
                </div>

                {showCreateForm && (
                    <div className="editor-body" style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                        borderRadius: '0 0 1.5rem 1.5rem',
                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)'
                    }}>
                        <form onSubmit={handleSubmit} className="p-5">
                            {/* Title & Category Row */}
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
                                            placeholder="Enter article title..."
                                            required
                                            style={{
                                                border: '2px solid #d1fae5',
                                                borderRadius: '1rem',
                                                fontSize: '1.1rem',
                                                height: '65px',
                                                background: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                        <label htmlFor="title" className="d-flex align-items-center text-muted">
                                            <i className="fas fa-heading me-2 text-success"></i>
                                            Article Title
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="form-floating">
                                        <select
                                            className="form-select form-select-lg"
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            style={{
                                                border: '2px solid #d1fae5',
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
                                            <i className="fas fa-folder-medical me-2 text-success"></i>
                                            Category
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-4">
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        id="summary"
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleInputChange}
                                        placeholder="Brief summary of the article..."
                                        rows="3"
                                        style={{
                                            border: '2px solid #d1fae5',
                                            borderRadius: '1rem',
                                            minHeight: '100px',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            resize: 'vertical'
                                        }}
                                    />
                                    <label htmlFor="summary" className="d-flex align-items-center text-muted">
                                        <i className="fas fa-file-alt me-2 text-success"></i>
                                        Summary (Optional)
                                    </label>
                                </div>
                                <div className="form-text ms-3 mt-2">
                                    <i className="fas fa-lightbulb me-2 text-warning"></i>
                                    A brief summary helps readers understand the article's main points quickly.
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Write your health article content here..."
                                        required
                                        rows="10"
                                        style={{
                                            border: '2px solid #d1fae5',
                                            borderRadius: '1rem',
                                            minHeight: '250px',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            resize: 'vertical'
                                        }}
                                    />
                                    <label htmlFor="content" className="d-flex align-items-center text-muted">
                                        <i className="fas fa-pen-fancy me-2 text-success"></i>
                                        Article Content
                                    </label>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mb-4">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="health, wellness, prevention, nutrition..."
                                        style={{
                                            border: '2px solid #d1fae5',
                                            borderRadius: '1rem',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            height: '60px'
                                        }}
                                    />
                                    <label htmlFor="tags" className="d-flex align-items-center text-muted">
                                        <i className="fas fa-hashtag me-2 text-success"></i>
                                        Tags
                                    </label>
                                </div>
                                <div className="form-text ms-3 mt-2 d-flex align-items-center">
                                    <i className="fas fa-tags me-2 text-info"></i>
                                    <span>Separate tags with commas. Use medical and health-related keywords.</span>
                                </div>
                                
                                {/* Professional tag suggestions */}
                                <div className="mt-3 ms-3">
                                    <small className="text-muted d-block mb-2">💡 Professional tags:</small>
                                    <div className="d-flex flex-wrap gap-2">
                                        {['preventive-care', 'health-education', 'wellness', 'nutrition', 'mental-health', 'hygiene', 'immunization', 'first-aid'].map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className="btn btn-outline-success btn-sm rounded-pill"
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

                            {/* Action Buttons */}
                            <div className="d-flex gap-3 justify-content-end align-items-center pt-4 border-top" style={{borderColor: '#d1fae5 !important'}}>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary btn-lg rounded-pill px-4" 
                                    onClick={resetForm}
                                    style={{
                                        borderWidth: '2px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="fas fa-times me-2"></i>
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-success btn-lg rounded-pill px-5"
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        border: 'none',
                                        fontWeight: '600',
                                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className={`fas ${editingPostId ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>
                                    {editingPostId ? 'Update Article' : 'Publish Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    };

    const renderPostCard = (post) => {
        const category = getCategoryInfo(post.categoryId);
        const isExpanded = expandedPost === post.id;

        return (
            <div 
                key={post.id} 
                className="card border-0 rounded-4 shadow-sm mb-4 overflow-hidden position-relative"
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                }}
            >
                {/* Category Badge */}
                <div 
                    className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill text-white fw-semibold"
                    style={{
                        background: `linear-gradient(135deg, ${category.color} 0%, ${category.color2} 100%)`,
                        fontSize: '0.8rem',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                >
                    {category.icon} {category.name}
                </div>

                <div className="card-body p-4">
                    {/* Author Info */}
                    <div className="d-flex align-items-center mb-3">
                        <div 
                            className="author-avatar me-3 d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: '45px',
                                height: '45px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}
                        >
                            <i className="fas fa-user-nurse"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-bold text-dark">
                                {post.authorName || 'School Nurse'}
                            </h6>
                            <small className="text-muted d-flex align-items-center">
                                <i className="fas fa-stethoscope me-1"></i>
                                {post.authorTitle || 'Healthcare Professional'}
                                <span className="mx-2">•</span>
                                <i className="fas fa-calendar me-1"></i>
                                {formatDate(post.createdAt)}
                            </small>
                        </div>
                    </div>

                    {/* Title */}
                    <h5 className="card-title mb-3 fw-bold" style={{
                        color: '#1f2937',
                        lineHeight: '1.4'
                    }}>
                        {post.title}
                    </h5>

                    {/* Summary */}
                    {post.summary && (
                        <div className="summary-section mb-3 p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                            border: '1px solid #bbf7d0'
                        }}>
                            <small className="text-muted d-block mb-1">
                                <i className="fas fa-quote-left me-1"></i>
                                Summary
                            </small>
                            <p className="mb-0" style={{
                                fontStyle: 'italic',
                                color: '#065f46',
                                fontSize: '0.95rem'
                            }}>
                                {post.summary}
                            </p>
                        </div>
                    )}

                    {/* Content */}
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
                                    className="btn btn-outline-success btn-sm mt-3 rounded-pill"
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
                                {post.content && post.content.length > 200 && (
                                    <button
                                        className="btn btn-success btn-sm rounded-pill"
                                        onClick={() => setExpandedPost(post.id)}
                                        style={{background: category.color || '#10b981', border: 'none'}}
                                    >
                                        <i className="fas fa-chevron-down me-2"></i>
                                        Read more...
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="tags-section mt-4 pt-3" style={{borderTop: '1px solid #f3f4f6'}}>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <i className="fas fa-tags text-muted me-2"></i>
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="badge rounded-pill"
                                        style={{
                                            background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                                            color: '#374151',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            padding: '0.4rem 0.8rem'
                                        }}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons for nurse's own posts */}
                    {isNurse && activeTab === 'my' && (
                        <div className="action-buttons mt-4 pt-3 d-flex gap-2" style={{borderTop: '1px solid #f3f4f6'}}>
                            <button
                                className="btn btn-outline-primary btn-sm rounded-pill"
                                onClick={() => handleEdit(post)}
                            >
                                <i className="fas fa-edit me-2"></i>
                                Edit
                            </button>
                            <button
                                className="btn btn-outline-danger btn-sm rounded-pill"
                                onClick={() => handleDelete(post.id)}
                            >
                                <i className="fas fa-trash me-2"></i>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div className="nurse-blog-container" style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            minHeight: '100vh',
            paddingTop: '2rem',
            paddingBottom: '2rem'
        }}>
            <div className="container">
                {/* Header */}
                <div className="blog-header text-center mb-5">
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <div 
                            className="header-icon me-3 p-3 rounded-circle"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white'
                            }}
                        >
                            <i className="fas fa-heartbeat" style={{fontSize: '2rem'}}></i>
                        </div>
                        <div>
                            <h1 className="display-5 fw-bold mb-2" style={{color: '#065f46'}}>
                                Health Education Hub
                            </h1>
                            <p className="lead text-muted mb-0">
                                Professional health guidance and educational content for our school community
                            </p>
                        </div>
                    </div>
                    
                    {isNurse && (
                        <div className="nurse-welcome p-4 rounded-4 mb-4" style={{
                            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                            border: '1px solid #bbf7d0'
                        }}>
                            <h5 className="text-success mb-2">
                                <i className="fas fa-user-nurse me-2"></i>
                                Welcome, Healthcare Professional
                            </h5>
                            <p className="mb-0 text-muted">
                                Share your expertise to educate and promote health awareness in our school community.
                            </p>
                            {!showCreateForm && (
                                <div className="mt-3">
                                    <button
                                        className="btn btn-success btn-lg rounded-pill px-4"
                                        onClick={() => setShowCreateForm(true)}
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            border: 'none',
                                            fontWeight: '600',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                                        }}
                                    >
                                        <i className="fas fa-plus-circle me-2"></i>
                                        Create New Article
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Message Alert */}
                {renderMessage()}

                {/* Create Form */}
                {renderCreateForm()}

                {/* Navigation Tabs */}
                <div className="nav-tabs-container mb-5">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-0">
                            <ul className="nav nav-pills nav-fill p-3 m-0" style={{background: '#f8f9fa', borderRadius: '1rem'}}>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link px-4 py-3 fw-semibold rounded-3 ${activeTab === 'all' ? 'active shadow-sm' : 'text-muted'}`}
                                        onClick={() => setActiveTab('all')}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            border: 'none',
                                            backgroundColor: activeTab === 'all' ? '#10b981' : 'transparent',
                                            color: activeTab === 'all' ? 'white' : '#6b7280',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <i className="fas fa-globe me-2"></i>
                                        All Articles
                                        <span className="badge ms-2" style={{
                                            backgroundColor: activeTab === 'all' ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                                            color: activeTab === 'all' ? 'white' : '#374151'
                                        }}>
                                            {Array.isArray(allPosts) ? allPosts.length : 0}
                                        </span>
                                    </button>
                                </li>
                                {isNurse && (
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link px-4 py-3 fw-semibold rounded-3 ${activeTab === 'my' ? 'active shadow-sm' : 'text-muted'}`}
                                            onClick={() => setActiveTab('my')}
                                            style={{
                                                transition: 'all 0.3s ease',
                                                border: 'none',
                                                backgroundColor: activeTab === 'my' ? '#10b981' : 'transparent',
                                                color: activeTab === 'my' ? 'white' : '#6b7280',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <i className="fas fa-user-edit me-2"></i>
                                            My Articles
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

                {/* Posts Content */}
                <div className="posts-content">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Loading health articles...</p>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-12">
                                {activeTab === 'all' ? (
                                    allPosts.length > 0 ? (
                                        <div>
                                            {allPosts.map(renderPostCard)}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <div className="empty-state p-5">
                                                <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
                                                <h5 className="text-muted">No Health Articles Yet</h5>
                                                <p className="text-muted">
                                                    {isNurse 
                                                        ? "Be the first to share health knowledge with our school community!"
                                                        : "Our healthcare professionals haven't published any articles yet."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    posts.length > 0 ? (
                                        <div>
                                            {posts.map(renderPostCard)}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <div className="empty-state p-5">
                                                <i className="fas fa-pen-alt fa-3x text-muted mb-3"></i>
                                                <h5 className="text-muted">You Haven't Published Any Articles</h5>
                                                <p className="text-muted">
                                                    Start sharing your professional health knowledge with the school community.
                                                </p>
                                                <button
                                                    className="btn btn-success btn-lg rounded-pill px-4 mt-3"
                                                    onClick={() => setShowCreateForm(true)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        border: 'none',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    <i className="fas fa-plus-circle me-2"></i>
                                                    Create Your First Article
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .nurse-blog-container .card:hover {
                    transition: all 0.3s ease;
                }
                
                .nurse-blog-container .btn:hover {
                    transform: translateY(-1px);
                }
                
                .nurse-blog-container .form-control:focus,
                .nurse-blog-container .form-select:focus {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25) !important;
                    background: rgba(255, 255, 255, 1) !important;
                }
            `}</style>
        </div>
    );
};

export default NurseBlog;
