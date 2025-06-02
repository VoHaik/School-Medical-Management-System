// Authentication script for login and registration

document.addEventListener('DOMContentLoaded', function() {
    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Validate form
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }
            
            // For demonstration, we'll just show a success message
            // In a real application, you would send this data to a server
            showAlert('Login successful! Redirecting...', 'success');
            
            // Simulate login success and redirect
            setTimeout(() => {
                // For demo purposes, redirect to dashboard
                // In a real app, this would happen after server validation
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }
    
    // Registration Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const userType = document.querySelector('input[name="userType"]:checked').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validate form
            if (firstName.trim() === '' || lastName.trim() === '') {
                showAlert('Please enter your full name', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePhone(phone)) {
                showAlert('Please enter a valid phone number', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showAlert('You must agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            // For demonstration, we'll just show a success message
            // In a real application, you would send this data to a server
            showAlert('Registration successful! Redirecting...', 'success');
            
            // Simulate registration success and redirect
            setTimeout(() => {
                // For demo purposes, redirect to login
                // In a real app, this would happen after server validation
                window.location.href = 'login.html';
            }, 2000);
        });
    }
    
    // Form validation helpers
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        // Simple validation for demonstration
        return phone.length >= 10;
    }
    
    // Alert function for form feedback
    function showAlert(message, type) {
        // Check if an alert already exists and remove it
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `form-alert alert-${type}`;
        alertElement.textContent = message;
        
        // Insert alert before the form
        const form = document.querySelector('form');
        form.parentNode.insertBefore(alertElement, form);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }
    
    // Password visibility toggle
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.title = 'Show password';
        
        // Insert toggle button after password field
        field.parentNode.insertBefore(toggleBtn, field.nextSibling);
        
        // Add click event to toggle password visibility
        toggleBtn.addEventListener('click', function() {
            if (field.type === 'password') {
                field.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                this.title = 'Hide password';
            } else {
                field.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
                this.title = 'Show password';
            }
        });
    });
});
