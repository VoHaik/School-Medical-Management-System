// Vaccinations page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Modal functionality
    const modal = document.getElementById('addVaccinationModal');
    const addBtn = document.getElementById('addVaccinationBtn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelVaccinationBtn');
    const saveBtn = document.getElementById('saveVaccinationBtn');

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Event listeners for modal
    if (addBtn) addBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Save vaccination record
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Form validation
            const studentSelect = document.getElementById('student-select');
            const vaccineSelect = document.getElementById('vaccine-select');
            const vaccinationDate = document.getElementById('vaccination-date');
            const batchSelect = document.getElementById('vaccine-batch');

            let isValid = true;
            
            // Basic validation
            if (!studentSelect.value) {
                markInvalid(studentSelect);
                isValid = false;
            } else {
                markValid(studentSelect);
            }
            
            if (!vaccineSelect.value) {
                markInvalid(vaccineSelect);
                isValid = false;
            } else {
                markValid(vaccineSelect);
            }
            
            if (!vaccinationDate.value) {
                markInvalid(vaccinationDate);
                isValid = false;
            } else {
                markValid(vaccinationDate);
            }
            
            if (!batchSelect.value) {
                markInvalid(batchSelect);
                isValid = false;
            } else {
                markValid(batchSelect);
            }

            if (isValid) {
                // In a real application, we would send data to the server here
                // For now, we'll just show a success message and close the modal
                alert('Vaccination record saved successfully!');
                closeModal();
                
                // Reset form
                document.querySelector('#addVaccinationModal form').reset();
                
                // In a real application, we would refresh the data or add the new record to the table
            }
        });
    }

    function markInvalid(element) {
        element.style.borderColor = 'red';
        // Add a small message below the field
        const errorMsg = document.createElement('small');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'This field is required';
        errorMsg.style.color = 'red';
        
        // Remove any existing error messages
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) {
            element.parentNode.removeChild(existingError);
        }
        
        element.parentNode.appendChild(errorMsg);
    }

    function markValid(element) {
        element.style.borderColor = '';
        // Remove error message if it exists
        const errorMsg = element.parentNode.querySelector('.error-message');
        if (errorMsg) {
            element.parentNode.removeChild(errorMsg);
        }
    }

    // Filter functionality for vaccination history
    const gradeFilter = document.getElementById('grade-filter');
    const vaccineFilter = document.getElementById('vaccine-filter');
    const dateFromFilter = document.getElementById('date-from');
    const dateToFilter = document.getElementById('date-to');

    const applyFilters = () => {
        // In a real application, this would filter data from the server or local data
        console.log('Applying filters:');
        console.log('Grade:', gradeFilter?.value);
        console.log('Vaccine Type:', vaccineFilter?.value);
        console.log('Date From:', dateFromFilter?.value);
        console.log('Date To:', dateToFilter?.value);
        
        // For demonstration, we'll just show a message
        if (gradeFilter && vaccineFilter) {
            const filterInfo = document.createElement('div');
            filterInfo.className = 'filter-info';
            filterInfo.textContent = 'Filters applied! In a real application, the table would be updated.';
            filterInfo.style.margin = '10px 0';
            filterInfo.style.padding = '10px';
            filterInfo.style.backgroundColor = '#e3f2fd';
            filterInfo.style.borderRadius = '4px';
            
            // Remove any existing filter info
            const existingInfo = document.querySelector('.filter-info');
            if (existingInfo) {
                existingInfo.parentNode.removeChild(existingInfo);
            }
            
            // Add the filter info after the filters
            const filtersElement = document.querySelector('.filters');
            if (filtersElement) {
                filtersElement.after(filterInfo);
                
                // Auto-remove after 3 seconds
                setTimeout(() => {
                    if (filterInfo.parentNode) {
                        filterInfo.parentNode.removeChild(filterInfo);
                    }
                }, 3000);
            }
        }
    };

    // Add event listeners to filters
    if (gradeFilter) gradeFilter.addEventListener('change', applyFilters);
    if (vaccineFilter) vaccineFilter.addEventListener('change', applyFilters);
    if (dateFromFilter) dateFromFilter.addEventListener('change', applyFilters);
    if (dateToFilter) dateToFilter.addEventListener('change', applyFilters);

    // Interactive progress bars (just for demonstration)
    const setRandomProgress = () => {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            // Don't change bars that are at 100%
            if (bar.style.width !== '100%') {
                // Random progress between current value and +10%
                const currentWidth = parseInt(bar.style.width) || 0;
                const newWidth = Math.min(currentWidth + Math.floor(Math.random() * 10), 100);
                bar.style.width = `${newWidth}%`;
                bar.textContent = `${newWidth}%`;
                
                // Change color when nearing completion
                if (newWidth > 80) {
                    bar.style.backgroundColor = '#4caf50';
                }
            }
        });
    };

    // Simulate progress updates (for demo purposes only)
    // In a real application, this would be based on actual data
    setInterval(setRandomProgress, 30000);

    // Inventory management - add event listeners to action buttons
    document.querySelectorAll('.data-table .btn.icon').forEach(button => {
        button.addEventListener('click', function(e) {
            const action = this.querySelector('i').className;
            const row = this.closest('tr');
            const itemName = row.cells[0].textContent;
            
            if (action.includes('fa-edit')) {
                // In a real app, this would open an edit form
                alert(`Edit ${itemName}`);
            } else if (action.includes('fa-trash-alt')) {
                if (confirm(`Are you sure you want to delete ${itemName} from inventory?`)) {
                    // In a real app, this would send a delete request to the server
                    alert(`${itemName} deleted`);
                    // For demo purposes, hide the row
                    row.style.display = 'none';
                }
            } else if (action.includes('fa-check')) {
                if (confirm(`Mark vaccination for ${itemName} as completed?`)) {
                    // Update status cell
                    const statusCell = row.querySelector('.status');
                    if (statusCell) {
                        statusCell.className = 'status approved';
                        statusCell.textContent = 'Completed';
                    }
                }
            }
        });
    });

    // Form validation for campaign creation
    const campaignForm = document.querySelector('.campaigns-list + .card form');
    if (campaignForm) {
        campaignForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const campaignName = document.getElementById('campaign-name');
            const vaccineType = document.getElementById('vaccine-type');
            const startDate = document.getElementById('start-date');
            const endDate = document.getElementById('end-date');
            
            let isValid = true;
            
            if (!campaignName.value.trim()) {
                markInvalid(campaignName);
                isValid = false;
            } else {
                markValid(campaignName);
            }
            
            if (!vaccineType.value) {
                markInvalid(vaccineType);
                isValid = false;
            } else {
                markValid(vaccineType);
            }
            
            if (!startDate.value) {
                markInvalid(startDate);
                isValid = false;
            } else {
                markValid(startDate);
            }
            
            if (!endDate.value) {
                markInvalid(endDate);
                isValid = false;
            } else if (startDate.value && new Date(endDate.value) <= new Date(startDate.value)) {
                markInvalid(endDate);
                const errorMsg = endDate.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'End date must be after start date';
                }
                isValid = false;
            } else {
                markValid(endDate);
            }
            
            if (isValid) {
                alert('Vaccination campaign created successfully!');
                this.reset();
            }
        });
    }

    // Initialize tooltip functionality for icons
    initTooltips();
});

// Initialize tooltips for icons
function initTooltips() {
    const icons = document.querySelectorAll('.btn.icon');
    
    icons.forEach(icon => {
        const iconClass = icon.querySelector('i').className;
        let tooltipText = '';
        
        if (iconClass.includes('fa-check')) tooltipText = 'Mark as Completed';
        else if (iconClass.includes('fa-times')) tooltipText = 'Cancel';
        else if (iconClass.includes('fa-edit')) tooltipText = 'Edit';
        else if (iconClass.includes('fa-trash-alt')) tooltipText = 'Delete';
        else if (iconClass.includes('fa-file-alt')) tooltipText = 'View Details';
        else if (iconClass.includes('fa-print')) tooltipText = 'Print';
        else if (iconClass.includes('fa-envelope')) tooltipText = 'Send Reminder';
        else if (iconClass.includes('fa-comment')) tooltipText = 'Add Comment';
        
        if (tooltipText) {
            icon.setAttribute('title', tooltipText);
            
            // Simple CSS-only tooltip using title attribute
            // In a real application, you might want to use a more sophisticated tooltip library
        }
    });
}
