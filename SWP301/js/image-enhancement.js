// Image Enhancement and Loading Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Handle image loading states
    handleImageLoading();
    
    // Add hover effects to images
    addImageHoverEffects();
    
    // Handle avatar updates
    handleAvatarUpdates();
    
    // Add lazy loading for images
    addLazyLoading();
});

// Handle image loading with fade-in effect
function handleImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                this.src = 'images/avatar-placeholder.svg';
                this.classList.add('loaded');
            });
        }
    });
}

// Add hover effects to specific image types
function addImageHoverEffects() {
    // Hero image parallax effect
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Student card hover effects
    const studentCards = document.querySelectorAll('.student-card');
    studentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.student-avatar img');
            if (avatar) {
                avatar.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.student-avatar img');
            if (avatar) {
                avatar.style.transform = 'scale(1)';
            }
        });
    });
}

// Handle avatar update functionality
function handleAvatarUpdates() {
    const avatarUpdateBtns = document.querySelectorAll('.avatar-update');
    
    avatarUpdateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const avatar = btn.parentElement.querySelector('img');
                        if (avatar) {
                            avatar.src = e.target.result;
                            showSuccessMessage('Avatar updated successfully!');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            input.click();
        });
    });
}

// Add lazy loading for images
function addLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Show success message
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .success-notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Image gallery functionality for medical records
function initImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

// Open image in modal
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeImageModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeImageModal()">&times;</button>
            <img src="${src}" alt="${alt}">
            <div class="modal-caption">${alt}</div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close image modal
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .modal-content img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
    }
    
    .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
        width: 40px;
        height: 40px;
    }
    
    .modal-caption {
        color: white;
        text-align: center;
        margin-top: 10px;
        font-size: 16px;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`;
document.head.appendChild(modalStyles);

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', initImageGallery);
