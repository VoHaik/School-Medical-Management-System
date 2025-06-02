// Health Records functionality for School Health Management System

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button
            button.classList.add('active');
            
            // Show the corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Student selector functionality
    const studentSelector = document.getElementById('student-select');
    if (studentSelector) {
        studentSelector.addEventListener('change', function() {
            const studentId = this.value;
            loadStudentData(studentId);
        });
    }
    
    // Placeholder function to simulate loading student data
    function loadStudentData(studentId) {
        console.log(`Loading data for student: ${studentId}`);
        // This would fetch data from a server in a real application
        
        // For demo purposes, show a loading indicator
        const mainContent = document.querySelector('.main-content');
        
        // Create and show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div><p>Loading student data...</p>';
        mainContent.appendChild(loadingOverlay);
        
        // Simulate loading delay
        setTimeout(() => {
            // Remove loading overlay
            loadingOverlay.remove();
            
            // Show a message to simulate data change
            alert(`Student data loaded for ${studentId === 'student1' ? 'Emily Doe' : 'Michael Doe'}`);
        }, 1500);
    }
    
    // Edit buttons functionality
    const editButtons = document.querySelectorAll('.edit-action');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionTitle = this.closest('.card-header').querySelector('h2').textContent;
            alert(`Edit mode for ${sectionTitle}. This feature is coming soon!`);
        });
    });
    
    // View details buttons
    const viewDetailsButtons = document.querySelectorAll('.btn-outline-primary');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventTitle = this.closest('.timeline-content').querySelector('h4').textContent;
            alert(`Viewing details for: ${eventTitle}. This feature is coming soon!`);
        });
    });
    
    // Add new record button
    const addRecordButton = document.querySelector('.header-right .btn-primary');
    if (addRecordButton) {
        addRecordButton.addEventListener('click', function() {
            alert('Add new record feature coming soon!');
        });
    }
    
    // Download buttons for files
    const downloadButtons = document.querySelectorAll('.btn-link');
    downloadButtons.forEach(button => {
        if (button.innerHTML.includes('Download')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const fileName = this.closest('.uploaded-file').textContent.trim().split(' ')[0];
                alert(`Downloading ${fileName}. This feature is coming soon!`);
            });
        }
    });
    
    // Delete buttons for files
    const deleteButtons = document.querySelectorAll('.btn-link.text-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const fileName = this.closest('.uploaded-file').textContent.trim().split(' ')[0];
            const confirmed = confirm(`Are you sure you want to delete ${fileName}?`);
            if (confirmed) {
                alert(`${fileName} has been deleted.`);
                // In a real app, this would send a delete request to the server
            }
        });
    });
    
    // Emergency contact action buttons
    const contactActionButtons = document.querySelectorAll('.contact-actions .btn-icon');
    contactActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.innerHTML.includes('fa-edit') ? 'Edit' : 'Delete';
            const contactName = this.closest('.contact-card').querySelector('h3').textContent;
            
            if (action === 'Delete') {
                const confirmed = confirm(`Are you sure you want to delete ${contactName}?`);
                if (confirmed) {
                    alert(`${contactName} has been deleted.`);
                    // In a real app, this would send a delete request to the server
                }
            } else {
                alert(`Editing ${contactName}. This feature is coming soon!`);
            }
        });
    });
    
    // Add contact button
    const addContactButton = document.querySelector('.add-contact .btn');
    if (addContactButton) {
        addContactButton.addEventListener('click', function() {
            alert('Add new emergency contact feature coming soon!');
        });
    }
});
