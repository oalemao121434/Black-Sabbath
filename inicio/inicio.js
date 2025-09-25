// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add to cart functionality
document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;

        // Simple cart notification
        showNotification(`${productName} adicionado ao carrinho!`, 'success');

        // Here you would typically update a cart state or send to backend
        updateCartCount();
    });
});

// Cart count functionality
function updateCartCount() {
    // This is a simple implementation - in a real app, you'd track actual cart items
    let cartCount = parseInt(localStorage.getItem('cartCount') || 0);
    cartCount++;
    localStorage.setItem('cartCount', cartCount);

    // Update cart icon with count (you'd need to modify the HTML for this)
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.setAttribute('data-count', cartCount);
        cartIcon.style.position = 'relative';
        // Add CSS for the count badge in your CSS file
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4ecdc4' : '#ff6b6b',
        color: '#fff',
        padding: '1rem',
        borderRadius: '5px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        zIndex: '1001',
        maxWidth: '300px',
        fontWeight: '500'
    });

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count on load
    updateCartCount();

    // Add loading animation to product images
    const productImages = document.querySelectorAll('.product-card img');
    productImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Add hover effects programmatically
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Simple search/filter functionality (can be expanded)
function filterProducts(searchTerm) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Export functions for potential use in other scripts
window.CelestialStars = {
    showNotification,
    filterProducts,
    updateCartCount
};


