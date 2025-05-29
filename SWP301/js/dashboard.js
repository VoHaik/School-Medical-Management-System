// Dashboard functionality for School Health Management System

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Mobile sidebar toggle
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.querySelector('.content-header .header-left').prepend(mobileToggle);
    
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && 
            !sidebar.contains(event.target) && 
            !mobileToggle.contains(event.target) && 
            sidebar.classList.contains('mobile-active')) {
            sidebar.classList.remove('mobile-active');
        }
    });
    
    // Notifications and Messages Popups
    const notificationIcon = document.querySelector('.notification-icon');
    const messageIcon = document.querySelector('.message-icon');
    
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            alert('Notifications feature coming soon!');
        });
    }
    
    if (messageIcon) {
        messageIcon.addEventListener('click', function() {
            alert('Messages feature coming soon!');
        });
    }
    
    // Initialize charts if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
    
    // Sample function to initialize charts
    function initCharts() {
        // This would contain chart initialization code if Chart.js is included
        console.log('Charts would be initialized here if Chart.js was loaded');
    }
    
    // Add event listeners to interactive elements
    const viewButtons = document.querySelectorAll('.card-action');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cardTitle = this.closest('.card-header').querySelector('h2').textContent;
            alert(`You clicked to view all ${cardTitle}. This feature is coming soon!`);
        });
    });
    
    const reminderButtons = document.querySelectorAll('.reminder-action .btn-sm');
    reminderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const reminderTitle = this.closest('.reminder-item').querySelector('h4').textContent;
            alert(`You clicked on ${reminderTitle}. This feature is coming soon!`);
        });
    });
    
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const newsTitle = this.closest('.news-item').querySelector('h4').textContent;
            alert(`You clicked to read more about "${newsTitle}". This feature is coming soon!`);
        });
    });
});
