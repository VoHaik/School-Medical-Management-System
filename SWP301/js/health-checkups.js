// Health Check-ups page JavaScript functionality

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
    const modal = document.getElementById('scheduleCheckupModal');
    const scheduleBtn = document.getElementById('scheduleCheckupBtn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelCheckupBtn');
    const saveBtn = document.getElementById('saveCheckupBtn');

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Event listeners for modal
    if (scheduleBtn) scheduleBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Save check-up schedule
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Form validation
            const studentSelect = document.getElementById('student-select-checkup');
            const checkupTemplate = document.getElementById('checkup-template');
            const checkupDate = document.getElementById('checkup-date');
            const checkupTime = document.getElementById('checkup-time');
            const checkupLocation = document.getElementById('checkup-location');

            let isValid = true;
            
            // Basic validation
            if (!studentSelect.value) {
                markInvalid(studentSelect);
                isValid = false;
            } else {
                markValid(studentSelect);
            }
            
            if (!checkupTemplate.value) {
                markInvalid(checkupTemplate);
                isValid = false;
            } else {
                markValid(checkupTemplate);
            }
            
            if (!checkupDate.value) {
                markInvalid(checkupDate);
                isValid = false;
            } else {
                markValid(checkupDate);
            }
            
            if (!checkupTime.value) {
                markInvalid(checkupTime);
                isValid = false;
            } else {
                markValid(checkupTime);
            }
            
            if (!checkupLocation.value) {
                markInvalid(checkupLocation);
                isValid = false;
            } else {
                markValid(checkupLocation);
            }

            if (isValid) {
                // In a real application, we would send data to the server here
                // For now, we'll just show a success message and close the modal
                alert('Check-up scheduled successfully!');
                closeModal();
                
                // Reset form
                document.querySelector('#scheduleCheckupModal form').reset();
                
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

    // Calendar functionality
    const calendarDays = document.querySelectorAll('.calendar-day:not(.disabled)');
    const calendarHeader = document.querySelector('.calendar-header h4');
    const prevMonthBtn = document.querySelector('.calendar-header .btn:first-child');
    const nextMonthBtn = document.querySelector('.calendar-header .btn:last-child');
    
    // Current date for the calendar
    let currentMonth = 4; // May (0-based would be 4)
    let currentYear = 2023;
    
    function updateCalendarHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        if (calendarHeader) {
            calendarHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }
    }
    
    // Initialize calendar
    updateCalendarHeader();
    
    // Event listeners for calendar navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendarHeader();
            // In a real app, we would regenerate the calendar grid here
            simulateCalendarChange();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendarHeader();
            // In a real app, we would regenerate the calendar grid here
            simulateCalendarChange();
        });
    }
    
    // For demo purposes, just change some event indicators
    function simulateCalendarChange() {
        const hasEvents = document.querySelectorAll('.calendar-day.has-events');
        hasEvents.forEach(day => {
            day.classList.remove('has-events');
            day.removeAttribute('data-events');
        });
        
        // Add random events to calendar
        const allDays = document.querySelectorAll('.calendar-day:not(.disabled)');
        const randomDays = Array.from(allDays).sort(() => 0.5 - Math.random()).slice(0, 6);
        
        randomDays.forEach(day => {
            const events = Math.floor(Math.random() * 8) + 1;
            day.classList.add('has-events');
            day.setAttribute('data-events', events);
        });
    }
    
    // Make calendar days clickable
    if (calendarDays) {
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                // Remove active class from all days
                calendarDays.forEach(d => d.classList.remove('active'));
                
                // Add active class to clicked day
                day.classList.add('active');
                
                // In a real app, we would load events for this day
                if (day.classList.contains('has-events')) {
                    const events = day.getAttribute('data-events');
                    alert(`${events} check-ups scheduled for this day. In a real application, these would be shown below the calendar.`);
                }
            });
        });
    }

    // Filter functionality for check-up history
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const studentFilter = document.getElementById('student-filter').value;
            const classFilter = document.getElementById('class-filter').value;
            const checkupTypeFilter = document.getElementById('checkup-type-filter').value;
            const dateFromFilter = document.getElementById('date-from-filter').value;
            const dateToFilter = document.getElementById('date-to-filter').value;
            
            // In a real application, this would filter data from the server or local data
            console.log('Applying filters:');
            console.log('Student:', studentFilter);
            console.log('Class:', classFilter);
            console.log('Check-up Type:', checkupTypeFilter);
            console.log('Date From:', dateFromFilter);
            console.log('Date To:', dateToFilter);
            
            // For demonstration, we'll just show a message
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
        });
    }

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

    // Action buttons in tables
    document.querySelectorAll('.data-table .btn.icon').forEach(button => {
        button.addEventListener('click', function(e) {
            const action = this.querySelector('i').className;
            const row = this.closest('tr');
            const studentName = row.cells[1]?.textContent || 'this student';
            
            if (action.includes('fa-play')) {
                // Start check-up
                if (confirm(`Start check-up for ${studentName}?`)) {
                    const statusCell = row.querySelector('.status');
                    if (statusCell) {
                        statusCell.className = 'status in-progress';
                        statusCell.textContent = 'In Progress';
                    }
                    
                    // Update row buttons
                    row.querySelectorAll('.btn.icon').forEach(btn => btn.remove());
                    const actions = document.createElement('div');
                    actions.innerHTML = `
                        <button class="btn icon" title="Complete"><i class="fas fa-check"></i></button>
                        <button class="btn icon" title="View Details"><i class="fas fa-eye"></i></button>
                    `;
                    row.cells[row.cells.length - 1].appendChild(actions);
                }
            } else if (action.includes('fa-check')) {
                // Complete check-up
                if (confirm(`Mark check-up for ${studentName} as completed?`)) {
                    const statusCell = row.querySelector('.status');
                    if (statusCell) {
                        statusCell.className = 'status completed';
                        statusCell.textContent = 'Completed';
                    }
                    
                    // Update row buttons
                    row.querySelectorAll('.btn.icon').forEach(btn => btn.remove());
                    const actions = document.createElement('div');
                    actions.innerHTML = `
                        <button class="btn icon" title="View Details"><i class="fas fa-file-alt"></i></button>
                        <button class="btn icon" title="Print Report"><i class="fas fa-print"></i></button>
                    `;
                    row.cells[row.cells.length - 1].appendChild(actions);
                }
            } else if (action.includes('fa-calendar-alt')) {
                // Reschedule
                alert(`Reschedule check-up for ${studentName}. In a real application, this would open a rescheduling form.`);
            } else if (action.includes('fa-times')) {
                // Cancel
                if (confirm(`Cancel check-up for ${studentName}?`)) {
                    // For demo purposes, just hide the row
                    row.style.display = 'none';
                }
            } else if (action.includes('fa-file-alt') || action.includes('fa-eye')) {
                // View details
                alert(`View details for ${studentName}. In a real application, this would open a detailed view.`);
            } else if (action.includes('fa-print')) {
                // Print report
                alert(`Print report for ${studentName}. In a real application, this would generate a printable report.`);
            }
        });
    });

    // Form validation for program creation
    const programForm = document.querySelector('#screenings .card form');
    if (programForm) {
        programForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const programName = document.getElementById('program-name');
            const screeningType = document.getElementById('screening-type');
            const startDate = document.getElementById('start-date-screening');
            const endDate = document.getElementById('end-date-screening');
            
            let isValid = true;
            
            if (!programName.value.trim()) {
                markInvalid(programName);
                isValid = false;
            } else {
                markValid(programName);
            }
            
            if (!screeningType.value) {
                markInvalid(screeningType);
                isValid = false;
            } else {
                markValid(screeningType);
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
                alert('Screening program created successfully!');
                this.reset();
            }
        });
    }

    // Template card actions
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        // Use template button
        const useTemplateBtn = card.querySelector('.btn.primary');
        if (useTemplateBtn && !card.classList.contains('add-new')) {
            useTemplateBtn.addEventListener('click', () => {
                const templateName = card.querySelector('h4').textContent;
                openModal();
                
                // Pre-select the template in the modal
                const templateSelect = document.getElementById('checkup-template');
                if (templateSelect) {
                    Array.from(templateSelect.options).forEach(option => {
                        if (option.text === templateName) {
                            option.selected = true;
                        }
                    });
                }
            });
        }
        
        // Add new template
        if (card.classList.contains('add-new')) {
            card.addEventListener('click', () => {
                alert('Create new template. In a real application, this would open a template creation form.');
            });
        }
        
        // Edit template
        const editBtn = card.querySelector('.btn.icon i.fa-edit');
        if (editBtn) {
            editBtn.parentElement.addEventListener('click', () => {
                const templateName = card.querySelector('h4').textContent;
                alert(`Edit template: ${templateName}. In a real application, this would open an edit form.`);
            });
        }
        
        // Delete template
        const deleteBtn = card.querySelector('.btn.icon i.fa-trash-alt');
        if (deleteBtn) {
            deleteBtn.parentElement.addEventListener('click', () => {
                const templateName = card.querySelector('h4').textContent;
                if (confirm(`Are you sure you want to delete the "${templateName}" template?`)) {
                    // For demo purposes, just hide the card
                    card.style.display = 'none';
                }
            });
        }
    });
});
