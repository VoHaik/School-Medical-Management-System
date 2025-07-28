import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAlert } from '../hooks/useAlert';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import theme, { colorPalette } from '../theme';

const NurseBlog = () => {
    const { getAuthAxios, currentUser } = useContext(AuthContext);
    const { successAlert, errorAlert, deleteConfirm } = useAlert();

    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [expandedPost, setExpandedPost] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        categoryId: 1,
        summary: ''
    });

    const categories = [
        { id: 1, name: 'Health Education', icon: '📚', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', description: 'Educational content for students and parents' },
        { id: 2, name: 'Mental Health', icon: '🧠', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', description: 'Mental wellness and psychological health' },
        { id: 3, name: 'Nutrition Guidelines', icon: '🥗', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', description: 'Nutritional advice and healthy eating' },
        { id: 4, name: 'Physical Activity', icon: '🏃', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', description: 'Exercise and physical wellness' },
        { id: 5, name: 'Health Alerts', icon: '⚠️', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', description: 'Important health notifications and alerts' },
        { id: 6, name: 'Preventive Care', icon: '🛡️', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', description: 'Disease prevention and health maintenance' }
    ];

    const isNurse = currentUser && currentUser.roles && (
        currentUser.roles.includes('SCHOOLNURSE') ||
        currentUser.roles.includes('ROLE_SCHOOLNURSE')
    );

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

    useEffect(() => {
        loadAllPosts();
        if (isNurse) {
            loadMyPosts();
        }
    }, [isNurse]);

    const renderMessage = () => {
        if (!message) return null;

        const messageConfig = {
            success: { bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', color: '#065f46', icon: 'check-circle', borderColor: '#10b981' },
            error: { bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', color: '#991b1b', icon: 'exclamation-triangle', borderColor: '#ef4444' },
            info: { bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', color: '#1e40af', icon: 'info-circle', borderColor: '#3b82f6' }
        };

        const config = messageConfig[messageType] || messageConfig.info;

        return (
            <div className="fixed-top mx-auto mt-4" style={{zIndex: 9999, maxWidth: '500px', left: '50%', transform: 'translateX(-50%)', position: 'relative', overflow: 'hidden'}}>
                <div className="alert shadow-lg border-0 rounded-4 p-4"
                     style={{
                         background: config.bg,
                         color: config.color,
                         backdropFilter: 'blur(15px)',
                         animation: 'slideDown 0.5s ease-out',
                         border: `3px solid ${config.borderColor}30`,
                         boxShadow: `0 10px 30px ${config.borderColor}20`,
                         maxWidth: '100%'
                     }}>
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center rounded-circle me-3"
                             style={{
                                 width: '40px',
                                 height: '40px',
                                 background: `${config.borderColor}20`,
                                 border: `2px solid ${config.borderColor}40`
                             }}>
                            <i className={`fas fa-${config.icon}`} style={{fontSize: '1.2rem', color: config.borderColor}}></i>
                        </div>
                        <div className="fw-semibold flex-grow-1" style={{maxWidth: '80%'}}>{message}</div>
                        <button
                            type="button"
                            className="btn-close ms-3 opacity-75"
                            onClick={() => setMessage('')}
                            style={{
                                filter: `brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(5174%) hue-rotate(${messageType === 'success' ? '130' : messageType === 'error' ? '346' : '217'}deg) brightness(97%) contrast(95%)`
                            }}
                        ></button>
                    </div>
                </div>
            </div>
        );
    };

    const renderCreateForm = () => {
        if (!isNurse) return null;

        return (
            <div className={`create-form-container mb-5 ${showCreateForm ? 'show' : ''}`} style={{position: 'relative', maxWidth: '100%', overflow: 'hidden'}}>
                <div className="card border-0 shadow-xl rounded-4 overflow-hidden"
                     style={{
                         background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                         transform: showCreateForm ? 'scale(1)' : 'scale(0.98)',
                         opacity: showCreateForm ? 1 : 0.9,
                         transition: 'all 0.5s ease-in-out',
                         border: '1px solid rgba(16, 185, 129, 0.05)',
                         maxWidth: '100%'
                     }}>

                    <div className="card-header border-0 p-5"
                         style={{
                             background: 'linear-gradient(135deg, #10b981 0%, #059669 70%)',
                             color: 'white',
                             position: 'relative',
                             overflow: 'hidden'
                         }}>
                        <div className="position-absolute top-0 start-0 w-100 h-100"
                             style={{
                                 background: 'url("data:image/svg+xml,%3Csvg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.08"%3E%3Ccircle cx="25" cy="25" r="5"/%3E%3C/g%3E%3C/svg%3E")',
                                 opacity: 0.4
                             }}>
                        </div>
                        <div className="d-flex justify-content-between align-items-center position-relative">
                            <div className="d-flex align-items-center">
                                <div className="p-3 rounded-full me-4"
                                     style={{
                                         background: 'rgba(255,255,255,0.3)',
                                         backdropFilter: 'blur(8px)',
                                         border: '1px solid rgba(255,255,255,0.4)'
                                     }}>
                                    <i className={`fas ${editingPostId ? 'fa-edit' : 'fa-plus'} text-white`} style={{fontSize: '2rem'}}></i>
                                </div>
                                <div>
                                    <h3 className="mb-2 fw-bold text-shadow">{editingPostId ? 'Edit Article' : 'Create New Article'}</h3>
                                    <p className="mb-0 text-white opacity-90" style={{fontSize: '1.2rem'}}>Share your expertise with elegance</p>
                                </div>
                            </div>
                            <button
                                className="btn btn-light btn-lg rounded-full px-4 fw-semibold"
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                style={{
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                                }}
                            >
                                <i className={`fas ${showCreateForm ? 'fa-times' : 'fa-pen'} me-2 text-primary`}></i>
                                {showCreateForm ? 'Cancel' : 'New Article'}
                            </button>
                        </div>
                    </div>

                    {showCreateForm && (
                        <div className="card-body p-5" style={{maxWidth: '100%', overflow: 'hidden'}}>
                            <form onSubmit={handleSubmit} className="needs-validation">
                                <div className="row g-4">
                                    <div className="col-md-8">
                                        <label className="form-label fw-bold mb-3 text-dark" style={{fontSize: '1.2rem'}}>
                                            <i className="fas fa-heading me-2 text-primary"></i>
                                            Article Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg rounded-4"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter a captivating title..."
                                            required
                                            style={{
                                                border: '2px solid #e0e7ff',
                                                transition: 'all 0.3s ease-in-out',
                                                fontSize: '1.2rem',
                                                padding: '1.2rem 1.5rem',
                                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                                maxWidth: '100%'
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold mb-3 text-dark" style={{fontSize: '1.2rem'}}>
                                            <i className="fas fa-tags me-2 text-primary"></i>
                                            Category
                                        </label>
                                        <select
                                            className="form-select form-select-lg rounded-4"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            style={{
                                                border: '2px solid #e0e7ff',
                                                transition: 'all 0.3s ease-in-out',
                                                fontSize: '1.2rem',
                                                padding: '1.2rem 1.5rem',
                                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                                maxWidth: '100%'
                                            }}
                                        >
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.icon} {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="form-label fw-bold mb-3 text-dark" style={{fontSize: '1.2rem'}}>
                                        <i className="fas fa-file-alt me-2 text-primary"></i>
                                        Summary (Optional)
                                    </label>
                                    <textarea
                                        className="form-control rounded-4"
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Brief summary of your article..."
                                        style={{
                                            border: '2px solid #e0e7ff',
                                            transition: 'all 0.3s ease-in-out',
                                            fontSize: '1.1rem',
                                            padding: '1.2rem 1.5rem',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                            maxWidth: '100%'
                                        }}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="form-label fw-bold mb-3 text-dark" style={{fontSize: '1.2rem'}}>
                                        <i className="fas fa-align-left me-2 text-primary"></i>
                                        Content
                                    </label>
                                    <textarea
                                        className="form-control rounded-4"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        rows="10"
                                        placeholder="Write your article content here..."
                                        required
                                        style={{
                                            border: '2px solid #e0e7ff',
                                            transition: 'all 0.3s ease-in-out',
                                            fontSize: '1.1rem',
                                            padding: '1.2rem 1.5rem',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                            maxWidth: '100%'
                                        }}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="form-label fw-bold mb-3 text-dark" style={{fontSize: '1.2rem'}}>
                                        <i className="fas fa-hashtag me-2 text-primary"></i>
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control rounded-4"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="health, wellness, prevention (comma separated)"
                                        style={{
                                            border: '2px solid #e0e7ff',
                                            transition: 'all 0.3s ease-in-out',
                                            fontSize: '1.1rem',
                                            padding: '1.2rem 1.5rem',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                            maxWidth: '100%'
                                        }}
                                    />
                                </div>

                                <div className="mt-5 d-flex gap-3 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-lg rounded-full px-5 fw-semibold"
                                        onClick={resetForm}
                                        style={{
                                            border: '2px solid #d1d5db',
                                            transition: 'all 0.3s ease-in-out'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-lg rounded-full px-5 text-white fw-semibold"
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 70%)',
                                            border: 'none',
                                            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)',
                                            transition: 'all 0.3s ease-in-out'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.3)';
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
            </div>
        );
    };

    const renderPostCard = (post) => {
        const category = getCategoryInfo(post.categoryId);
        const isExpanded = expandedPost === post.id;
        const isListView = viewMode === 'list';

        return (
            <div className={`card border-0 shadow-lg h-100 ${isListView ? 'mb-4' : ''}`}
                 style={{
                     borderRadius: '24px',
                     transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                     background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
                     overflow: 'hidden',
                     border: '1px solid rgba(0,0,0,0.02)',
                     maxWidth: '100%'
                 }}
                 onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)';
                     e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)';
                 }}
                 onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'translateY(0) scale(1)';
                     e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
                 }}>

                <div className="position-relative overflow-hidden"
                     style={{
                         background: `${category.gradient}10`,
                         padding: '1.5rem',
                         borderBottom: `1px solid ${category.color}10`
                     }}>
                    <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge rounded-pill px-3 py-2 text-white fw-bold"
                              style={{
                                  background: category.gradient,
                                  boxShadow: `0 6px 20px ${category.color}20`,
                                  fontSize: '0.9rem',
                                  letterSpacing: '0.5px',
                                  padding: '0.5rem 1rem',
                                  maxWidth: 'fit-content'
                              }}>
                            <span style={{fontSize: '1.2rem', marginRight: '8px'}}>{category.icon}</span>
                            {category.name}
                        </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 w-100 h-2"
                         style={{background: category.gradient, opacity: 0.7}}>
                    </div>
                </div>

                <div className="card-body p-4" style={{paddingTop: '2.5rem', maxWidth: '100%'}}>
                    <h5 className="card-title fw-bold mb-4 text-dark"
                        style={{
                            fontSize: isListView ? '1.6rem' : '1.4rem',
                            lineHeight: '1.3',
                            letterSpacing: '-0.5px',
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                        {post.title}
                    </h5>

                    <div className="d-flex align-items-center mb-4">
                        <div className="rounded-full me-3 d-flex align-items-center justify-content-center text-white position-relative"
                             style={{
                                 width: '50px',
                                 height: '50px',
                                 background: category.gradient,
                                 boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                             }}>
                            <i className="fas fa-user-nurse" style={{fontSize: '1.3rem'}}></i>
                            <div className="position-absolute bottom-0 end-0 bg-success rounded-full"
                                 style={{width: '12px', height: '12px', border: '2px solid white'}}>
                            </div>
                        </div>
                        <div>
                            <div className="fw-bold text-dark" style={{fontSize: '1.1rem'}}>
                                {post.authorName || 'School Nurse'}
                            </div>
                            <small className="text-muted">
                                <i className="fas fa-clock me-1"></i>
                                {formatDate(post.createdAt)}
                            </small>
                        </div>
                    </div>

                    {post.summary && (
                        <div className="mb-4 p-4 rounded-4"
                             style={{
                                 background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                 border: '1px solid rgba(0,0,0,0.03)',
                                 borderLeft: `5px solid ${category.color}80`,
                                 maxWidth: '100%'
                             }}>
                            <p className="mb-0 text-muted fst-italic" style={{fontSize: '1.1rem', lineHeight: '1.6'}}>
                                <i className="fas fa-quote-left me-2 opacity-50"></i>
                                {post.summary}
                                <i className="fas fa-quote-right ms-2 opacity-50"></i>
                            </p>
                        </div>
                    )}

                    <div className="content-section">
                        <p className="text-muted" style={{lineHeight: '1.7', fontSize: '1.1rem', color: '#4b5563', maxWidth: '100%'}}>
                            {isExpanded ? post.content : truncateContent(post.content, isListView ? 300 : 150)}
                        </p>

                        {post.content && post.content.length > (isListView ? 300 : 150) && (
                            <button
                                className="btn btn-sm btn-outline-primary rounded-full px-4 fw-semibold"
                                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                                style={{
                                    border: `2px solid ${category.color}`,
                                    color: category.color,
                                    transition: 'all 0.3s ease-in-out'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = category.gradient;
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = category.color;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} me-2`}></i>
                                {isExpanded ? 'Show Less' : 'Read More'}
                            </button>
                        )}
                    </div>

                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="mt-4 d-flex flex-wrap gap-2" style={{maxWidth: '100%'}}>
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="badge rounded-pill px-3 py-2 fw-normal"
                                    style={{
                                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease-in-out',
                                        border: '1px solid #d1d5db',
                                        fontSize: '0.9rem',
                                        maxWidth: 'fit-content'
                                    }}
                                    onClick={() => setSearchTerm(tag)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = category.gradient;
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                        e.currentTarget.style.boxShadow = `0 4px 15px ${category.color}40`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                                        e.currentTarget.style.color = '#374151';
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <i className="fas fa-hashtag me-1" style={{fontSize: '0.8rem'}}></i>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {isNurse && activeTab === 'my' && (
                        <div className="mt-4 pt-4 border-top d-flex gap-3" style={{borderColor: '#e5e7eb40', maxWidth: '100%'}}>
                            <button
                                className="btn btn-sm btn-outline-primary rounded-full px-4 fw-semibold"
                                onClick={() => handleEdit(post)}
                                style={{
                                    border: '2px solid #3b82f6',
                                    color: '#3b82f6',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#3b82f6';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#3b82f6';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <i className="fas fa-edit me-2"></i>
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger rounded-full px-4 fw-semibold"
                                onClick={() => handleDelete(post.id)}
                                style={{
                                    border: '2px solid #ef4444',
                                    color: '#ef4444',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#ef4444';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#ef4444';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
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

    const getFilteredPosts = () => {
        const postsToFilter = activeTab === 'all' ? allPosts : posts;
        if (!postsToFilter || !Array.isArray(postsToFilter)) return [];
        return postsToFilter.filter(post => {
            if (selectedCategory && post.categoryId !== selectedCategory) return false;
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (post.title && post.title.toLowerCase().includes(searchLower)) ||
                    (post.content && post.content.toLowerCase().includes(searchLower)) ||
                    (post.tags && Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
                    (post.summary && post.summary.toLowerCase().includes(searchLower)) ||
                    (post.authorName && post.authorName.toLowerCase().includes(searchLower))
                );
            }
            return true;
        });
    };

    return (
        <div className="min-vh-100"
             style={{
                 background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f9fafb 100%)',
                 paddingTop: '2.5rem',
                 paddingBottom: '5rem',
                 position: 'relative',
                 overflow: 'hidden',
                 maxWidth: '100vw'
             }}>

            {/* Background Pattern */}
            <div className="position-absolute top-0 start-0 w-100 h-100"
                 style={{
                     background: 'url("data:image/svg+xml,%3Csvg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310b981" fill-opacity="0.02"%3E%3Ccircle cx="35" cy="35" r="5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                     opacity: 0.5,
                     zIndex: 0
                 }}>
            </div>

            {renderMessage()}

            <div className="container position-relative" style={{zIndex: 1, maxWidth: '1200px', margin: '0 auto', overflow: 'hidden'}}>
                {/* Enhanced Hero Section */}
                <div className="text-center mb-6">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-full mb-4 position-relative"
                         style={{
                             width: '120px',
                             height: '120px',
                             background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                             boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)',
                             animation: 'pulse 2s infinite'
                         }}>
                        <i className="fas fa-heartbeat text-white" style={{fontSize: '3rem'}}></i>
                        <div className="position-absolute top-0 start-0 w-100 h-100 rounded-full"
                             style={{
                                 background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 70%)'
                             }}>
                        </div>
                    </div>
                    <h1 className="display-3 fw-bold mb-3 text-shadow"
                        style={{
                            color: '#1e293b',
                            letterSpacing: '-1px',
                            background: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                        Health Education Hub
                    </h1>
                    <p className="lead text-muted mb-0" style={{fontSize: '1.4rem', maxWidth: '650px', margin: '0 auto', fontWeight: 500}}>
                        Empowering our community with professional health insights
                    </p>
                </div>

                {/* Enhanced Nurse Welcome Section */}
                {isNurse && (
                    <div className="card border-0 shadow-xl rounded-4 mb-6 overflow-hidden">
                        <div className="card-body p-5"
                             style={{
                                 background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                                 position: 'relative'
                             }}>
                            <div className="position-absolute top-0 end-0 opacity-15">
                                <i className="fas fa-stethoscope" style={{fontSize: '10rem', color: '#10b981'}}></i>
                            </div>
                            <div className="row align-items-center position-relative">
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-full me-4 d-flex align-items-center justify-content-center position-relative"
                                             style={{
                                                 width: '80px',
                                                 height: '80px',
                                                 background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                 boxShadow: '0 12px 35px rgba(16, 185, 129, 0.3)'
                                             }}>
                                            <i className="fas fa-user-nurse text-white" style={{fontSize: '2rem'}}></i>
                                            <div className="position-absolute bottom-0 end-0 bg-success rounded-full"
                                                 style={{width: '20px', height: '20px', border: '3px solid white'}}>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-2 fw-bold text-dark">Welcome, Healthcare Professional</h4>
                                            <p className="mb-0 text-muted" style={{fontSize: '1.2rem'}}>Ready to inspire with your expertise?</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                    {!showCreateForm && (
                                        <button
                                            className="btn btn-lg rounded-full px-6 text-white fw-bold"
                                            onClick={() => setShowCreateForm(true)}
                                            style={{
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 70%)',
                                                border: 'none',
                                                boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                                                transition: 'all 0.3s ease-in-out',
                                                fontSize: '1.2rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 15px 45px rgba(16, 185, 129, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                                            }}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Create Article
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {renderCreateForm()}

                {/* Enhanced Tabs */}
                <div className="card border-0 shadow-md rounded-4 mb-5 overflow-hidden">
                    <div className="card-body p-4"
                         style={{background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)', maxWidth: '100%'}}>
                        <div className="d-flex gap-3 flex-wrap">
                            <button
                                className={`btn rounded-full px-5 py-3 fw-bold position-relative ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setActiveTab('all')}
                                style={{
                                    background: activeTab === 'all' ? 'linear-gradient(135deg, #10b981 0%, #059669 70%)' : 'transparent',
                                    border: activeTab === 'all' ? 'none' : '2px solid #e0e7ff',
                                    color: activeTab === 'all' ? 'white' : '#64748b',
                                    transition: 'all 0.3s ease-in-out',
                                    fontSize: '1.1rem',
                                    minWidth: '150px'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeTab !== 'all') {
                                        e.currentTarget.style.borderColor = '#10b981';
                                        e.currentTarget.style.color = '#10b981';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== 'all') {
                                        e.currentTarget.style.borderColor = '#e0e7ff';
                                        e.currentTarget.style.color = '#64748b';
                                    }
                                }}
                            >
                                <i className="fas fa-globe me-2"></i>
                                All Articles
                                <span className="badge bg-light text-dark ms-2 rounded-pill px-2">
                                    {Array.isArray(allPosts) ? allPosts.length : 0}
                                </span>
                            </button>
                            {isNurse && (
                                <button
                                    className={`btn rounded-full px-5 py-3 fw-bold ${activeTab === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setActiveTab('my')}
                                    style={{
                                        background: activeTab === 'my' ? 'linear-gradient(135deg, #10b981 0%, #059669 70%)' : 'transparent',
                                        border: activeTab === 'my' ? 'none' : '2px solid #e0e7ff',
                                        color: activeTab === 'my' ? 'white' : '#64748b',
                                        transition: 'all 0.3s ease-in-out',
                                        fontSize: '1.1rem',
                                        minWidth: '150px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== 'my') {
                                            e.currentTarget.style.borderColor = '#10b981';
                                            e.currentTarget.style.color = '#10b981';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== 'my') {
                                            e.currentTarget.style.borderColor = '#e0e7ff';
                                            e.currentTarget.style.color = '#64748b';
                                        }
                                    }}
                                >
                                    <i className="fas fa-user-edit me-2"></i>
                                    My Articles
                                    <span className="badge bg-light text-dark ms-2 rounded-pill px-2">
                                        {Array.isArray(posts) ? posts.length : 0}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters */}
                <div className="card border-0 shadow-md rounded-4 mb-5">
                    <div className="card-body p-4"
                         style={{background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)', maxWidth: '100%'}}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-white border-end-0 rounded-start-4"
                                          style={{border: '2px solid #e0e7ff', borderRight: 'none', padding: '0.9rem 1.2rem'}}>
                                        <i className="fas fa-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 rounded-end-4"
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            border: '2px solid #e0e7ff',
                                            borderLeft: 'none',
                                            fontSize: '1.1rem',
                                            padding: '0.9rem 1.2rem',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                            maxWidth: '100%'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select form-select-lg rounded-4"
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                    style={{
                                        border: '2px solid #e0e7ff',
                                        fontSize: '1.1rem',
                                        padding: '0.9rem 1.2rem',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                        maxWidth: '100%'
                                    }}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.icon} {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <div className="btn-group w-100">
                                    <button
                                        className={`btn btn-lg ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setViewMode('grid')}
                                        style={{
                                            borderRadius: '16px 0 0 16px',
                                            background: viewMode === 'grid' ? 'linear-gradient(135deg, #10b981 0%, #059669 70%)' : 'white',
                                            border: '2px solid #e0e7ff',
                                            color: viewMode === 'grid' ? 'white' : '#64748b',
                                            transition: 'all 0.3s ease-in-out',
                                            width: '50%'
                                        }}
                                    >
                                        <i className="fas fa-th-large"></i>
                                    </button>
                                    <button
                                        className={`btn btn-lg ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setViewMode('list')}
                                        style={{
                                            borderRadius: '0 16px 16px 0',
                                            background: viewMode === 'list' ? 'linear-gradient(135deg, #10b981 0%, #059669 70%)' : 'white',
                                            border: '2px solid #e0e7ff',
                                            color: viewMode === 'list' ? 'white' : '#64748b',
                                            transition: 'all 0.3s ease-in-out',
                                            width: '50%'
                                        }}
                                    >
                                        <i className="fas fa-list"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Results Summary */}
                <div className="d-flex justify-content-between align-items-center mb-6 flex-wrap">
                    <div>
                        <h5 className="mb-2 fw-bold text-dark"
                            style={{fontSize: '1.3rem', letterSpacing: '-0.5px', textShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
                            <i className="fas fa-file-medical me-2 text-primary"></i>
                            Showing {getFilteredPosts().length} {getFilteredPosts().length === 1 ? 'article' : 'articles'}
                        </h5>
                        <p className="text-muted mb-0">
                            {activeTab === 'all' ? 'All published articles' : 'Your articles'}
                            {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                        </p>
                    </div>
                    {(selectedCategory || searchTerm) && (
                        <button
                            className="btn btn-outline-secondary btn-lg rounded-full px-4 fw-semibold"
                            onClick={() => {
                                setSelectedCategory(null);
                                setSearchTerm('');
                            }}
                            style={{
                                border: '2px solid #d1d5db',
                                transition: 'all 0.3s ease-in-out',
                                marginTop: '1rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#6b7280';
                                e.currentTarget.style.borderColor = '#6b7280';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.color = '#6b7280';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <i className="fas fa-times me-2"></i>
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Posts Content */}
                {loading ? (
                    <div className="text-center py-6">
                        <div className="mb-4">
                            <div className="spinner-border text-primary mb-3"
                                 role="status"
                                 style={{
                                     width: '4.5rem',
                                     height: '4.5rem',
                                     color: '#10b981',
                                     borderWidth: '5px',
                                     animation: 'spin 1.5s linear infinite'
                                 }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <h4 className="text-muted fw-bold" style={{fontSize: '1.4rem'}}>Loading articles...</h4>
                        <p className="text-muted">Please wait while we fetch the latest insights</p>
                    </div>
                ) : getFilteredPosts().length > 0 ? (
                    <div className={viewMode === 'grid' ? 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5' : 'd-flex flex-column'} style={{maxWidth: '100%'}}>
                        {getFilteredPosts().map(post => (
                            <div key={post.id} className={viewMode === 'grid' ? 'col' : ''} style={{maxWidth: '100%'}}>
                                {renderPostCard(post)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-full mb-4"
                                 style={{
                                     width: '140px',
                                     height: '140px',
                                     background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                     border: '3px solid #d1d5db',
                                     boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                 }}>
                                <i className="fas fa-file-medical-alt"
                                   style={{fontSize: '3.5rem', color: '#9ca3af'}}></i>
                            </div>
                        </div>
                        <h3 className="text-muted mb-3 fw-bold" style={{fontSize: '1.6rem'}}>No Articles Found</h3>
                        <p className="text-muted mb-4" style={{fontSize: '1.2rem', maxWidth: '550px', margin: '0 auto', lineHeight: '1.6'}}>
                            {searchTerm
                                ? `No articles matching "${searchTerm}" were found. Try adjusting your search terms.`
                                : selectedCategory
                                    ? `No articles in this category yet. Be the first to contribute!`
                                    : activeTab === 'my'
                                        ? "You haven't published any articles yet. Share your expertise!"
                                        : "No articles have been published yet. Check back soon."
                            }
                        </p>
                        {activeTab === 'my' && isNurse && (
                            <button
                                className="btn btn-lg rounded-full px-6 text-white fw-bold"
                                onClick={() => setShowCreateForm(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 70%)',
                                    border: 'none',
                                    boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                                    transition: 'all 0.3s ease-in-out',
                                    fontSize: '1.2rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 15px 45px rgba(16, 185, 129, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                                }}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Create Your First Article
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 20px 50px rgba(16, 185, 129, 0.4);
                    }
                    50% {
                        transform: scale(1.02);
                        box-shadow: 0 25px 60px rgba(16, 185, 129, 0.5);
                    }
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .create-form-container {
                    transition: all 0.5s ease-in-out;
                }

                .create-form-container:not(.show) {
                    max-height: 100px;
                    overflow: hidden;
                }

                .create-form-container.show {
                    max-height: 3000px;
                }

                .form-control:focus, .form-select:focus {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.2), 0 0 15px rgba(16, 185, 129, 0.1) !important;
                    transform: scale(1.01);
                }

                .btn {
                    transition: all 0.3s ease-in-out;
                }

                .card {
                    border: 1px solid rgba(0,0,0,0.02) !important;
                    background: linear-gradient(145deg, #ffffff 0%, #f9fafb 100%);
                    max-width: 100%;
                }

                .badge {
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .input-group-text {
                    background: white;
                }

                .content-section p {
                    margin-bottom: 1.5rem;
                }

                .text-shadow {
                    text-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                /* Enhanced responsive design */
                @media (max-width: 768px) {
                    .display-3 {
                        font-size: 2.5rem !important;
                    }

                    .btn-group {
                        flex-direction: column;
                        height: auto !important;
                    }

                    .btn-group .btn {
                        border-radius: 16px !important;
                        margin-bottom: 0.5rem;
                        width: 100%;
                    }

                    .btn-group .btn:last-child {
                        margin-bottom: 0;
                    }

                    .card-body {
                        padding: 1.5rem !important;
                    }

                    .container {
                        padding: 0 1rem;
                        max-width: 100%;
                    }

                    .row > div {
                        margin-bottom: 1rem;
                    }
                }

                @media (max-width: 576px) {
                    .d-flex.gap-3 {
                        flex-direction: column;
                        gap: 1rem !important;
                    }

                    .btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .lead {
                        font-size: 1.2rem !important;
                    }

                    .d-flex.justify-content-between {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .btn-outline-secondary {
                        width: 100%;
                    }
                }

                /* Smooth scrolling */
                html {
                    scroll-behavior: smooth;
                }

                /* Enhanced focus states */
                *:focus {
                    outline: 2px solid #10b981;
                    outline-offset: 2px;
                }

                .form-control:focus, .form-select:focus, .btn:focus {
                    outline: none;
                }

                /* Loading animation */
                .spinner-border {
                    border-width: 5px;
                    animation: spin 1.5s linear infinite;
                }

                /* Enhanced shadows */
                .shadow-md {
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06) !important;
                }

                .shadow-lg {
                    box-shadow: 0 15px 40px rgba(0,0,0,0.08) !important;
                }

                .shadow-xl {
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 12px;
                }

                ::-webkit-scrollbar-track {
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                    border-radius: 6px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                    border-radius: 6px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
                }

                /* Additional animations */
                .card:hover .position-absolute {
                    transform: scale(1.05);
                    transition: transform 0.4s ease-in-out;
                }

                .badge:hover {
                    animation: pulse 0.8s ease-in-out;
                }

                /* Glassmorphism effect for certain elements */
                .alert {
                    backdrop-filter: blur(15px) !important;
                }

                /* Gradient text effect */
                .display-3 {
                    background: linear-gradient(135deg, #1e293b 0%, #10b981 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Enhanced button hover effects */
                .btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                }

                .btn-lg:hover:not(:disabled) {
                    transform: translateY(-4px);
                }

                /* Card hover glow effect */
                .card:hover {
                    box-shadow: 0 25px 50px rgba(16, 185, 129, 0.08) !important;
                }

                /* Form focus glow */
                .form-control:focus, .form-select:focus {
                    box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.1) !important;
                }

                /* Improved text readability */
                .text-dark {
                    color: #1e293b !important;
                }

                .text-muted {
                    color: #64748b !important;
                }

                /* Enhanced border radius consistency */
                .rounded-full {
                    border-radius: 9999px !important;
                }

                .rounded-4 {
                    border-radius: 1.5rem !important;
                }

                /* Smooth transitions for all interactive elements */
                .btn, .card, .badge, .form-control, .form-select, .input-group-text {
                    transition: all 0.4s ease-in-out;
                }

                /* Loading state improvements */
                .spinner-border {
                    border-width: 5px;
                }

                /* Enhanced mobile responsiveness */
                @media (max-width: 991px) {
                    .col-md-8, .col-md-4 {
                        margin-bottom: 1.5rem;
                    }
                }

                /* Accessibility improvements */
                .btn:focus-visible {
                    outline: 2px solid #10b981;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.25);
                }

                /* Enhanced visual hierarchy */
                h1, h2, h3, h4, h5, h6 {
                    letter-spacing: -0.025em;
                    line-height: 1.2;
                }

                /* Improved spacing consistency */
                .mb-6 {
                    margin-bottom: 3.5rem !important;
                }

                .py-6 {
                    padding-top: 3.5rem !important;
                    padding-bottom: 3.5rem !important;
                }

                .p-4 {
                    padding: 2rem !important;
                }

                .p-5 {
                    padding: 3rem !important;
                }

                /* Enhanced gradient backgrounds */
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #10b981 0%, #059669 70%) !important;
                }

                /* Improved animation performance */
                .card, .btn {
                    will-change: transform;
                }

                /* Dark mode preparation */
                @media (prefers-color-scheme: dark) {
                    .card {
                        background: linear-gradient(145deg, #1e293b 0%, #111827 100%) !important;
                        color: white !important;
                    }
                }
                /* Cải thiện căn giữa và giới hạn kích thước cho tiêu đề chính */
                .display-3 {
                    font-size: 2.5rem !important; /* Giảm kích thước cho màn hình nhỏ */
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .lead {
                    font-size: 1.2rem !important;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                /* Tối ưu hóa phần chào mừng cho nhân viên y tế */
                .card-body p {
                    font-size: 1.1rem !important;
                    margin-bottom: 0;
                }
                .card-body h4 {
                    font-size: 1.5rem !important;
                }

                /* Cải thiện hiển thị nút Create Article và form */
                .create-form-container {
                    max-width: 100%;
                    overflow: hidden;
                }
                .card-header {
                    padding: 1.5rem !important; /* Giảm padding để tránh tràn */
                }
                .btn-lg {
                    font-size: 1rem !important; /* Điều chỉnh kích thước nút */
                    padding: 0.75rem 1.5rem !important;
                }

                /* Sửa lỗi badge trên tab All Articles và My Articles */
                .badge {
                    position: relative;
                    top: -1px;
                    padding: 0.2rem 0.6rem !important;
                    font-size: 0.8rem !important;
                    min-width: 2rem;
                    text-align: center;
                }

                /* Tối ưu hóa thanh tìm kiếm */
                .input-group {
                    max-width: 100%;
                }
                .input-group-text, .form-control {
                    font-size: 1rem !important; /* Điều chỉnh kích thước font */
                    padding: 0.75rem 1rem !important;
                }
                .input-group-text {
                    border-right: 1px solid #e0e7ff !important; /* Đảm bảo đường viền */
                }

                /* Cải thiện dropdown danh mục */
                .form-select {
                    max-width: 100%;
                    padding: 0.75rem 1rem !important;
                    font-size: 1rem !important;
                }

                /* Sửa phần tóm tắt bài viết */
                .d-flex.justify-content-between {
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                h5 {
                    font-size: 1.2rem !important; /* Giảm kích thước để tránh tràn */
                    margin-bottom: 0.5rem !important;
                }
                .text-muted {
                    font-size: 0.9rem !important;
                }

                /* Đảm bảo responsive trên màn hình nhỏ */
                @media (max-width: 768px) {
                    .display-3 {
                        font-size: 2rem !important;
                    }
                    .lead {
                        font-size: 1rem !important;
                    }
                    .card-body {
                        padding: 1rem !important;
                    }
                    .btn-group {
                        flex-direction: column;
                    }
                    .btn-group .btn {
                        width: 100%;
                        margin-bottom: 0.5rem !important;
                        border-radius: 0.5rem !important;
                    }
                    .btn-group .btn:last-child {
                        margin-bottom: 0 !important;
                    }
                    .input-group, .form-select {
                        margin-bottom: 1rem !important;
                    }
                    .d-flex.justify-content-between {
                        flex-direction: column;
                        align-items: flex-start !important;
                    }
                }

                /* Giới hạn kích thước tổng thể để tránh tràn */
                .container {
                    max-width: 100% !important;
                    padding: 0 1rem !important;
                    overflow: hidden;
                }
                .card {
                    max-width: 100% !important;
                    overflow: hidden;
                }
                .row > div {
                    margin-bottom: 1rem !important;
                }

                /* Giảm hiệu ứng để tránh lệch bố cục */
                .card:hover {
                    transform: translateY(-4px) scale(1.005) !important;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                }
                .btn:hover:not(:disabled) {
                    transform: translateY(-2px) !important;
                }
            `}</style>
        </div>
    );
};

export default NurseBlog;