// auth.js - Authentication utility functions

/**
 * Send an authenticated request to the API
 * @param {string} url - The URL to send the request to
 * @param {Object} options - Request options (method, headers, body, etc.)
 * @returns {Promise} - The fetch promise
 */
function sendAuthenticatedRequest(url, options = {}) {
    const token = localStorage.getItem('token');

    if (!token) {
        return Promise.reject(new Error('No authentication token found'));
    }

    // Set up default options
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Merge options
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    // Add Authorization header if token exists
    if (token) {
        mergedOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, mergedOptions)
        .then(response => {
            // If unauthorized, redirect to login page
            if (response.status === 401) {
                console.error('Unauthorized request. Redirecting to login page.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                throw new Error('Unauthorized');
            }
            return response;
        });
}

/**
 * Check if the user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

/**
 * Get the current user from localStorage
 * @returns {Object|null} - The user object or null if not authenticated
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Logout the current user
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}
