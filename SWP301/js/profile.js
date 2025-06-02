// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Edit Profile Modal
    const editProfileBtn = document.querySelector('.btn-primary');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // In a real application, this would open a modal for editing
            alert('Edit Profile functionality would open a modal here.');
        });
    }
    
    // Change Password Modal
    const changePasswordBtn = document.querySelector('.btn-secondary');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            // In a real application, this would open a modal for changing password
            alert('Change Password functionality would open a modal here.');
        });
    }
    
    // Edit Information Buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real application, this would make the fields editable
            const card = this.closest('.card');
            const cardTitle = card.querySelector('.card-header h3').textContent;
            alert(`Edit ${cardTitle} functionality would be triggered here.`);
        });
    });
    
    // Add Student Button
    const addStudentBtn = document.querySelector('.btn-add');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', function() {
            // In a real application, this would open a modal for adding a student
            alert('Add Student functionality would open a modal here.');
        });
    }
    
    // View Student Details
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentName = this.closest('.student-card').querySelector('h4').textContent;
            alert(`View details for ${studentName} would be triggered here.`);
        });
    });
    
    // Avatar Update
    const avatarUpdate = document.querySelector('.avatar-update');
    if (avatarUpdate) {
        avatarUpdate.addEventListener('click', function() {
            // In a real application, this would open a file picker
            alert('Update profile picture functionality would be triggered here.');
        });
    }
    
    // Date Filter for Activity History
    const dateFilter = document.getElementById('activity-date');
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            const selectedDate = this.value;
            alert(`Filter activities by date: ${selectedDate}`);
            // In a real application, this would filter the activities
        });
    }
    
    // Save Notification Settings
    const saveNotificationsBtn = document.querySelector('.btn-save');
    if (saveNotificationsBtn) {
        saveNotificationsBtn.addEventListener('click', function() {
            // In a real application, this would save the notification settings
            alert('Notification settings saved successfully!');
        });
    }
    
    // Toggle Switch Functionality
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const notificationText = this.closest('.notification-option').querySelector('p').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            // In a real application, this would update the notification setting
            console.log(`${notificationText} notifications ${status}`);
        });
    });
});
