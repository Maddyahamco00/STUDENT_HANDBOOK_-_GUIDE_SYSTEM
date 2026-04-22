// filepath: frontend/public/js/main.js
// Student Handbook Guide System - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize any global functionality
  console.log('Student Handbook Guide System loaded');
  
  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(function(alert) {
    setTimeout(function() {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(function() {
        alert.remove();
      }, 500);
    }, 5000);
  });
  
  // Form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#ef4444';
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
      }
    });
  });
  
  // Password confirmation validation for registration
  const registerForm = document.querySelector('form[action*="register"]');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirm_password');
      
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        e.preventDefault();
        alert('Passwords do not match!');
        confirmPassword.style.borderColor = '#ef4444';
      }
    });
  }
});

// Utility function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Utility function to show loading state
function showLoading(button) {
  const originalText = button.textContent;
  button.textContent = 'Loading...';
  button.disabled = true;
  button.dataset.originalText = originalText;
}

// Utility function to hide loading state
function hideLoading(button) {
  button.textContent = button.dataset.originalText || 'Submit';
  button.disabled = false;
}

// Confirm delete actions
function confirmDelete(message) {
  return confirm(message || 'Are you sure you want to delete this item?');
}

// Scroll to element smoothly
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Export utilities for use in other scripts
window.StudentHandbook = {
  formatDate,
  showLoading,
  hideLoading,
  confirmDelete,
  scrollToElement
};