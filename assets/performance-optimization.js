/**
 * StudyFuel Performance Optimization
 * Implements critical performance improvements
 */

(function() {
  'use strict';
  
  // 1. Defer non-critical resources
  function deferNonCriticalCSS() {
    const linkElements = document.querySelectorAll('link[data-defer]');
    linkElements.forEach(link => {
      link.media = 'all';
    });
  }
  
  // 2. Preconnect to external domains
  function preconnectExternalDomains() {
    const domains = [
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
      'https://cdnjs.cloudflare.com'
    ];
    
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  
  // 3. Lazy load background images
  function lazyLoadBackgrounds() {
    const bgElements = document.querySelectorAll('[data-bg-image]');
    
    if ('IntersectionObserver' in window) {
      const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            element.style.backgroundImage = `url(${element.dataset.bgImage})`;
            bgObserver.unobserve(element);
          }
        });
      });
      
      bgElements.forEach(el => bgObserver.observe(el));
    }
  }
  
  // 4. Debounce scroll and resize events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // 5. Optimize expensive scroll handlers
  const optimizedScrollHandler = debounce(function() {
    // Your scroll logic here
  }, 100);
  
  window.addEventListener('scroll', optimizedScrollHandler);
  
  // 6. Prefetch next page on hover
  function prefetchOnHover() {
    const links = document.querySelectorAll('a[href^="/"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        const href = this.getAttribute('href');
        if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
        }
      }, { once: true });
    });
  }
  
  // 7. Remove unused CSS
  function removeUnusedCSS() {
    // This is a simplified version
    // In production, use tools like PurgeCSS
    console.log('Consider using PurgeCSS for production');
  }
  
  // 8. Compress and cache data
  function setupLocalStorage() {
    try {
      // Test localStorage availability
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      
      // Cache frequently accessed data
      const cacheData = (key, data, ttl = 3600000) => {
        const item = {
          data: data,
          timestamp: Date.now(),
          ttl: ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
      };
      
      const getCachedData = (key) => {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp > parsed.ttl) {
          localStorage.removeItem(key);
          return null;
        }
        
        return parsed.data;
      };
      
      window.StudyFuel = window.StudyFuel || {};
      window.StudyFuel.cache = {
        set: cacheData,
        get: getCachedData
      };
    } catch (e) {
      console.warn('localStorage not available');
    }
  }
  
  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      deferNonCriticalCSS();
      preconnectExternalDomains();
      lazyLoadBackgrounds();
      prefetchOnHover();
      setupLocalStorage();
    });
  } else {
    deferNonCriticalCSS();
    preconnectExternalDomains();
    lazyLoadBackgrounds();
    prefetchOnHover();
    setupLocalStorage();
  }
  
  // Performance monitoring
  if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Performance metric:', entry.name, entry.startTime);
      }
    });
    
    perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
  }
  
})();