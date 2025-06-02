// Medications functionality for School Health Management System

document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('medication-modal');
    const requestBtn = document.getElementById('request-medication-btn');
    const noDataRequestBtn = document.getElementById('no-data-request-btn');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const medicationForm = document.getElementById('medication-form');
    
    // Open modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
        medicationForm.reset(); // Reset form when closing
    }
    
    // Add event listeners for opening modal
    if (requestBtn) {
        requestBtn.addEventListener('click', openModal);
    }
    
    if (noDataRequestBtn) {
        noDataRequestBtn.addEventListener('click', openModal);
    }
    
    // Add event listeners for closing modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Student selector functionality
    const studentSelector = document.getElementById('student-select');
    if (studentSelector) {
        studentSelector.addEventListener('change', function() {
            const studentId = this.value;
            loadStudentMedications(studentId);
        });
    }
    
    // Placeholder function to simulate loading student data
    function loadStudentMedications(studentId) {
        console.log(`Loading medications for student: ${studentId}`);
        // This would fetch data from a server in a real application
        
        // For demo purposes, show a loading indicator
        const mainContent = document.querySelector('.main-content');
        
        // Create and show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div><p>Loading medication data...</p>';
        mainContent.appendChild(loadingOverlay);
        
        // Simulate loading delay
        setTimeout(() => {
            // Remove loading overlay
            loadingOverlay.remove();
            
            // For demo purposes, if student2 is selected, show no medications
            if (studentId === 'student2') {
                document.querySelector('.table-responsive').style.display = 'none';
                document.querySelector('.no-data-message').style.display = 'flex';
            } else {
                document.querySelector('.table-responsive').style.display = 'block';
                document.querySelector('.no-data-message').style.display = 'none';
            }
        }, 1500);
    }
    
    // View medication history button
    const historyBtn = document.getElementById('medication-history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            alert('Medication history feature coming soon!');
        });
    }
    
    // Action buttons for medications
    const actionButtons = document.querySelectorAll('.action-buttons .btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.title;
            const row = this.closest('tr');
            const medicationName = row.cells[0].textContent;
            
            if (action === 'Delete') {
                const confirmed = confirm(`Are you sure you want to delete ${medicationName}?`);
                if (confirmed) {
                    alert(`${medicationName} has been deleted.`);
                    row.remove();
                    
                    // Check if there are any rows left
                    const tableBody = document.querySelector('.data-table tbody');
                    if (tableBody.rows.length === 0) {
                        document.querySelector('.table-responsive').style.display = 'none';
                        document.querySelector('.no-data-message').style.display = 'flex';
                    }
                }
            } else if (action === 'Edit') {
                alert(`Edit form for ${medicationName} will open. This feature is coming soon!`);
            } else if (action === 'View Details') {
                alert(`Details for ${medicationName} will be displayed. This feature is coming soon!`);
            }
        });
    });
    
    // Log time filter
    const logTimeFilter = document.getElementById('log-time-filter');
    if (logTimeFilter) {
        logTimeFilter.addEventListener('change', function() {
            const timeRange = this.value;
            
            // This would filter logs based on the selected time range in a real application
            console.log(`Filtering logs by: ${timeRange}`);
            
            // For demo purposes, just show an alert
            if (timeRange === 'custom') {
                alert('Custom date range picker will open. This feature is coming soon!');
            } else {
                alert(`Logs filtered to show: ${timeRange}`);
            }
        });
    }
    
    // Pagination buttons
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.innerHTML.includes('fa-chevron-left') ? 'previous' : 'next';
            alert(`Loading ${direction} page. This feature is coming soon!`);
        });
    });
    
    // File upload preview
    const fileInput = document.getElementById('prescription-file');
    const fileName = document.querySelector('.file-name');
    
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = 'No file chosen';
            }
        });
    }
    
    // Form submission
    if (medicationForm) {
        medicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, this would send form data to the server
            alert('Medication request submitted successfully!');
            closeModal();
            
            // Simulate showing the new medication in the table
            setTimeout(() => {
                alert('Your medication request has been sent to the school health staff for approval.');
            }, 500);
        });
    }
});
