/**
 * Everyday AI - Customer Accounts & Wishlist Management
 * Handles wishlist functionality using localStorage
 */

(function() {
  'use strict';
  
  const WISHLIST_KEY = 'everydayai_wishlist';
  const NOTIFICATION_DURATION = 3000;
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    initializeWishlist();
    loadWishlistDisplay();
    setupNotifications();
  });
  
  /**
   * Initialize wishlist functionality
   */
  function initializeWishlist() {
    // Make toggleWishlist available globally
    window.toggleWishlist = toggleWishlist;
    window.removeFromWishlist = removeFromWishlist;
    window.addToCartFromWishlist = addToCartFromWishlist;
    
    // Update all wishlist buttons on page
    updateWishlistButtons();
    updateWishlistCount();
  }
  
  /**
   * Get wishlist from localStorage
   */
  function getWishlist() {
    try {
      const wishlist = localStorage.getItem(WISHLIST_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist:', error);
      return [];
    }
  }
  
  /**
   * Save wishlist to localStorage
   */
  function saveWishlist(wishlist) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      updateWishlistCount();
      updateWishlistButtons();
      
      // Trigger custom event for other parts of the app
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { count: wishlist.length } 
      }));
    } catch (error) {
      console.error('Error saving wishlist:', error);
      showNotification('Error saving to wishlist', 'error');
    }
  }
  
  /**
   * Toggle product in wishlist
   */
  function toggleWishlist(button) {
    const productId = button.getAttribute('data-product-id');
    const productData = {
      id: productId,
      title: button.getAttribute('data-product-title'),
      url: button.getAttribute('data-product-url'),
      image: button.getAttribute('data-product-image'),
      price: button.getAttribute('data-product-price'),
      priceValue: button.getAttribute('data-product-price-value'),
      variantId: button.getAttribute('data-variant-id'),
      addedAt: new Date().toISOString()
    };
    
    let wishlist = getWishlist();
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex === -1) {
      // Add to wishlist
      wishlist.push(productData);
      saveWishlist(wishlist);
      
      // Update button state
      button.classList.add('in-wishlist');
      button.querySelector('.wishlist-icon-empty').style.display = 'none';
      button.querySelector('.wishlist-icon-filled').style.display = 'block';
      const textElement = button.querySelector('.wishlist-btn-text');
      if (textElement) {
        textElement.textContent = 'Remove from Wishlist';
      }
      
      showNotification(`${productData.title} added to wishlist`, 'success');
    } else {
      // Remove from wishlist
      wishlist.splice(existingIndex, 1);
      saveWishlist(wishlist);
      
      // Update button state
      button.classList.remove('in-wishlist');
      button.querySelector('.wishlist-icon-empty').style.display = 'block';
      button.querySelector('.wishlist-icon-filled').style.display = 'none';
      const textElement = button.querySelector('.wishlist-btn-text');
      if (textElement) {
        textElement.textContent = 'Add to Wishlist';
      }
      
      showNotification(`${productData.title} removed from wishlist`, 'info');
      
      // Reload wishlist display if on account page
      if (document.getElementById('wishlist-items-container')) {
        loadWishlistDisplay();
      }
    }
  }
  
  /**
   * Remove item from wishlist (called from account page)
   */
  function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    const item = wishlist.find(item => item.id === productId);
    
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(wishlist);
    
    if (item) {
      showNotification(`${item.title} removed from wishlist`, 'info');
    }
    
    // Reload display
    loadWishlistDisplay();
  }
  
  /**
   * Add item to cart from wishlist
   */
  function addToCartFromWishlist(productId, variantId) {
    // Add to cart using Shopify Ajax API
    const formData = {
      items: [{
        id: variantId,
        quantity: 1
      }]
    };
    
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      showNotification('Added to cart!', 'success');
      
      // Update cart count if cart display exists
      updateCartCount();
      
      // Optionally remove from wishlist
      // removeFromWishlist(productId);
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      showNotification('Error adding to cart', 'error');
    });
  }
  
  /**
   * Update cart count display
   */
  function updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
          element.textContent = cart.item_count;
        });
      })
      .catch(error => console.error('Error updating cart count:', error));
  }
  
  /**
   * Update wishlist count in header
   */
  function updateWishlistCount() {
    const wishlist = getWishlist();
    const countElements = document.querySelectorAll('#wishlist-count-header, .wishlist-count');
    
    countElements.forEach(element => {
      element.textContent = wishlist.length;
    });
  }
  
  /**
   * Update all wishlist buttons on page
   */
  function updateWishlistButtons() {
    const buttons = document.querySelectorAll('.wishlist-btn');
    const wishlist = getWishlist();
    
    buttons.forEach(button => {
      const productId = button.getAttribute('data-product-id');
      const isInWishlist = wishlist.some(item => item.id === productId);
      
      if (isInWishlist) {
        button.classList.add('in-wishlist');
        button.querySelector('.wishlist-icon-empty').style.display = 'none';
        button.querySelector('.wishlist-icon-filled').style.display = 'block';
        const textElement = button.querySelector('.wishlist-btn-text');
        if (textElement) {
          textElement.textContent = 'Remove from Wishlist';
        }
      } else {
        button.classList.remove('in-wishlist');
        button.querySelector('.wishlist-icon-empty').style.display = 'block';
        button.querySelector('.wishlist-icon-filled').style.display = 'none';
        const textElement = button.querySelector('.wishlist-btn-text');
        if (textElement) {
          textElement.textContent = 'Add to Wishlist';
        }
      }
    });
  }
  
  /**
   * Load and display wishlist items on account page
   */
  function loadWishlistDisplay() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;
    
    const wishlist = getWishlist();
    
    if (wishlist.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p class="empty-title">Your wishlist is empty</p>
          <p class="empty-text">Save items you love for later</p>
          <a href="/collections/all" class="btn-primary-alt">Browse Products</a>
        </div>
      `;
      return;
    }
    
    // Sort by most recently added
    wishlist.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    
    const itemsHTML = wishlist.map(item => `
      <div class="wishlist-item">
        <div class="wishlist-item-image">
          <a href="${item.url}">
            ${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">` : ''}
          </a>
        </div>
        <div class="wishlist-item-info">
          <a href="${item.url}" class="wishlist-item-title">${escapeHtml(item.title)}</a>
          <div class="wishlist-item-price">${item.price}</div>
        </div>
        <div class="wishlist-item-actions">
          <button 
            class="btn-wishlist-action btn-add-to-cart" 
            onclick="addToCartFromWishlist('${item.id}', '${item.variantId}')"
            title="Add to cart"
          >
            Add to Cart
          </button>
          <button 
            class="btn-wishlist-action btn-remove" 
            onclick="removeFromWishlist('${item.id}')"
            title="Remove from wishlist"
          >
            Remove
          </button>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = `<div class="wishlist-items">${itemsHTML}</div>`;
  }
  
  /**
   * Setup notification system
   */
  function setupNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
  }
  
  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    };
    
    notification.innerHTML = `
      ${icons[type]}
      <span>${escapeHtml(message)}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `;
    
    notification.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border-left: 4px solid;
      animation: slideIn 0.3s ease;
      max-width: 100%;
    `;
    
    // Set border color based on type
    if (type === 'success') {
      notification.style.borderColor = '#10b981';
      notification.querySelector('svg').style.color = '#10b981';
    } else if (type === 'error') {
      notification.style.borderColor = '#ef4444';
      notification.querySelector('svg').style.color = '#ef4444';
    } else {
      notification.style.borderColor = '#3b82f6';
      notification.querySelector('svg').style.color = '#3b82f6';
    }
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #6b7280;
      transition: color 0.3s ease;
      margin-left: auto;
    `;
    
    container.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, NOTIFICATION_DURATION);
  }
  
  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
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
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    .notification:hover .notification-close {
      color: #1f2937 !important;
    }
    
    @media (max-width: 640px) {
      #notification-container {
        left: 20px !important;
        right: 20px !important;
        max-width: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      getWishlist,
      saveWishlist,
      toggleWishlist,
      removeFromWishlist,
      addToCartFromWishlist
    };
  }
})();