// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    setupEventListeners();
    loadUserData();
});

function initializeSettings() {
    // Load saved settings from localStorage
    loadSettings();
    
    // Set up tab navigation
    setupTabNavigation();
    
    // Initialize form validation
    setupFormValidation();
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            showTab(targetTab);
        });
    });

    // Form inputs auto-save
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', function() {
            saveSettings();
            showSaveIndicator();
        });
    });

    // User management buttons
    setupUserManagement();
    
    // Backup buttons
    setupBackupButtons();
    
    // Policy management
    setupPolicyManagement();
}

function setupTabNavigation() {
    const tabs = document.querySelectorAll('.settings-tab');
    const sections = document.querySelectorAll('.settings-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding section
            const targetTab = this.getAttribute('data-tab');
            const targetSection = document.getElementById(targetTab);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to target tab
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

function saveSettings() {
    const settings = {
        general: {
            schoolName: document.getElementById('school-name')?.value,
            timezone: document.getElementById('timezone')?.value,
            language: document.getElementById('language')?.value,
            academicYear: document.getElementById('academic-year')?.value,
            autoBackup: document.getElementById('auto-backup')?.checked,
            sessionTimeout: document.getElementById('session-timeout')?.value
        },
        notifications: {
            emailNotifications: document.getElementById('email-notifications')?.checked,
            smsNotifications: document.getElementById('sms-notifications')?.checked,
            pushNotifications: document.getElementById('push-notifications')?.checked,
            medicationReminders: document.getElementById('medication-reminders')?.checked,
            appointmentReminders: document.getElementById('appointment-reminders')?.checked,
            lowStockAlerts: document.getElementById('low-stock-alerts')?.checked,
            emergencyAlerts: document.getElementById('emergency-alerts')?.checked
        },
        security: {
            requirePasswordChange: document.getElementById('require-password-change')?.checked,
            passwordExpiry: document.getElementById('password-expiry')?.value,
            twoFactorAuth: document.getElementById('two-factor-auth')?.checked,
            sessionLogging: document.getElementById('session-logging')?.checked,
            dataEncryption: document.getElementById('data-encryption')?.checked
        }
    };
    
    localStorage.setItem('healthSystemSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('healthSystemSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Load general settings
        if (settings.general) {
            setInputValue('school-name', settings.general.schoolName);
            setInputValue('timezone', settings.general.timezone);
            setInputValue('language', settings.general.language);
            setInputValue('academic-year', settings.general.academicYear);
            setInputValue('auto-backup', settings.general.autoBackup);
            setInputValue('session-timeout', settings.general.sessionTimeout);
        }
        
        // Load notification settings
        if (settings.notifications) {
            setInputValue('email-notifications', settings.notifications.emailNotifications);
            setInputValue('sms-notifications', settings.notifications.smsNotifications);
            setInputValue('push-notifications', settings.notifications.pushNotifications);
            setInputValue('medication-reminders', settings.notifications.medicationReminders);
            setInputValue('appointment-reminders', settings.notifications.appointmentReminders);
            setInputValue('low-stock-alerts', settings.notifications.lowStockAlerts);
            setInputValue('emergency-alerts', settings.notifications.emergencyAlerts);
        }
        
        // Load security settings
        if (settings.security) {
            setInputValue('require-password-change', settings.security.requirePasswordChange);
            setInputValue('password-expiry', settings.security.passwordExpiry);
            setInputValue('two-factor-auth', settings.security.twoFactorAuth);
            setInputValue('session-logging', settings.security.sessionLogging);
            setInputValue('data-encryption', settings.security.dataEncryption);
        }
    }
}

function setInputValue(id, value) {
    const input = document.getElementById(id);
    if (input) {
        if (input.type === 'checkbox') {
            input.checked = value;
        } else {
            input.value = value;
        }
    }
}

function setupUserManagement() {
    // Add User button
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }
    
    // Edit and Delete buttons for existing users
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUser(userId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            deleteUser(userId);
        });
    });
}

function loadUserData() {
    // Sample user data - in real app, this would come from API
    const users = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@school.edu',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-05-29 10:30 AM'
        },
        {
            id: 2,
            name: 'Nurse Mary Wilson',
            email: 'mary.wilson@school.edu',
            role: 'staff',
            status: 'active',
            lastLogin: '2025-05-29 09:15 AM'
        },
        {
            id: 3,
            name: 'John Smith',
            email: 'john.smith@parent.com',
            role: 'parent',
            status: 'active',
            lastLogin: '2025-05-28 07:45 PM'
        }
    ];
    
    updateUserTable(users);
}

function updateUserTable(users) {
    const tbody = document.querySelector('#users-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-badge role-${user.role}">${user.role}</span></td>
            <td><span class="status-${user.status}">${user.status}</span></td>
            <td>${user.lastLogin}</td>
            <td>
                <div class="btn-group">
                    <button class="btn-sm btn-edit" data-user-id="${user.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-sm btn-delete" data-user-id="${user.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Re-setup event listeners for new buttons
    setupUserManagement();
}

function showAddUserModal() {
    // In a real application, this would show a modal dialog
    alert('Add User functionality would open a modal dialog here.');
}

function editUser(userId) {
    alert(`Edit user ${userId} functionality would open a modal dialog here.`);
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        alert(`User ${userId} would be deleted here.`);
        // Reload user data
        loadUserData();
    }
}

function setupBackupButtons() {
    const backupNowBtn = document.getElementById('backup-now-btn');
    const restoreBtn = document.getElementById('restore-btn');
    
    if (backupNowBtn) {
        backupNowBtn.addEventListener('click', function() {
            startBackup();
        });
    }
    
    if (restoreBtn) {
        restoreBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
                startRestore();
            }
        });
    }
}

function startBackup() {
    const btn = document.getElementById('backup-now-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Backup...';
        
        // Simulate backup process
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Backup Now';
            showSaveIndicator('Backup completed successfully!');
            updateBackupStatus();
        }, 3000);
    }
}

function startRestore() {
    alert('Restore functionality would be implemented here.');
}

function updateBackupStatus() {
    const lastBackupElement = document.querySelector('.backup-info-item .value');
    if (lastBackupElement) {
        const now = new Date();
        lastBackupElement.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    }
}

function setupPolicyManagement() {
    // Policy form submissions
    const policyForms = document.querySelectorAll('.policy-form');
    policyForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            savePolicy(this);
        });
    });
}

function savePolicy(form) {
    const formData = new FormData(form);
    const policyData = Object.fromEntries(formData.entries());
    
    // Save policy data
    console.log('Saving policy:', policyData);
    showSaveIndicator('Policy saved successfully!');
}

function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSaveIndicator(message = 'Settings saved successfully!') {
    let indicator = document.querySelector('.save-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.innerHTML = `<i class="fas fa-check"></i> ${message}`;
    indicator.classList.add('show');
    
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 3000);
}

// Export functions for external use
window.SettingsManager = {
    showTab,
    saveSettings,
    loadSettings,
    showSaveIndicator
};
