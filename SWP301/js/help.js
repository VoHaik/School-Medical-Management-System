// Help & Documentation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHelp();
});

function initializeHelp() {
    setupSearch();
    setupFAQ();
    setupSidebarToggle();
    setupLiveChat();
    setupScrollToSection();
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('helpSearch');
    const helpSections = document.querySelectorAll('.help-section');
    const helpCards = document.querySelectorAll('.help-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Show all sections and cards
                helpSections.forEach(section => {
                    section.classList.remove('hidden');
                });
                helpCards.forEach(card => {
                    card.classList.remove('hidden');
                });
                clearHighlights();
            } else {
                filterContent(searchTerm);
            }
        });
    }
}

function filterContent(searchTerm) {
    const helpSections = document.querySelectorAll('.help-section');
    
    helpSections.forEach(section => {
        const sectionText = section.textContent.toLowerCase();
        const cards = section.querySelectorAll('.help-card');
        let sectionHasMatch = false;
        
        // Check cards within this section
        cards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.classList.remove('hidden');
                sectionHasMatch = true;
                highlightText(card, searchTerm);
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Check section title and description
        if (sectionText.includes(searchTerm)) {
            sectionHasMatch = true;
            highlightText(section.querySelector('h2'), searchTerm);
        }
        
        // Show/hide section based on matches
        if (sectionHasMatch) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

function highlightText(element, searchTerm) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
}

function clearHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// FAQ functionality
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Sidebar toggle functionality
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// Live chat functionality
function setupLiveChat() {
    const liveChatBtn = document.getElementById('liveChatBtn');
    
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function() {
            openLiveChat();
        });
    }
}

function openLiveChat() {
    // Simulate live chat opening
    showNotification('Live chat is not available at the moment. Please use email or phone support.', 'info');
    
    // In a real implementation, this would open a chat widget
    // Example: window.open('https://chat.schoolhealthms.com', 'chat', 'width=400,height=600');
}

// Scroll to section functionality
function setupScrollToSection() {
    // Add smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function removeNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+F or Cmd+F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('helpSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('helpSearch');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    }
});

// Print functionality
function printHelp() {
    window.print();
}

// Share functionality
function shareHelp() {
    if (navigator.share) {
        navigator.share({
            title: 'School Health Management System - Help',
            text: 'Get help with using the School Health Management System',
            url: window.location.href
        });
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Help page URL copied to clipboard!', 'success');
        });
    }
}

// Feedback functionality
function submitFeedback(rating, comment) {
    // Simulate feedback submission
    console.log('Feedback submitted:', { rating, comment });
    showNotification('Thank you for your feedback!', 'success');
    
    // In a real implementation, this would send data to the server
    // fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ rating, comment }) })
}

// Add CSS for notifications
const notificationCSS = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-left: 4px solid #007bff;
    max-width: 400px;
    transform: translateX(120%);
    transition: transform 0.3s ease;
    z-index: 1000;
}

.notification.show {
    transform: translateX(0);
}

.notification.hide {
    transform: translateX(120%);
}

.notification-content {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-content i:first-child {
    color: #007bff;
    font-size: 1.2rem;
}

.notification-content span {
    flex: 1;
    color: #333;
    line-height: 1.4;
}

.notification-close {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.notification-close:hover {
    background-color: #f0f0f0;
}

.notification-success {
    border-left-color: #28a745;
}

.notification-success .notification-content i:first-child {
    color: #28a745;
}

.notification-error {
    border-left-color: #dc3545;
}

.notification-error .notification-content i:first-child {
    color: #dc3545;
}

.notification-warning {
    border-left-color: #ffc107;
}

.notification-warning .notification-content i:first-child {
    color: #ffc107;
}
`;

// Inject notification CSS
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);
