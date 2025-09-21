/**
 * Harbour & Field Product Enhancement JavaScript
 * Handles preorder logic, inventory messaging, and enhanced product interactions
 */

class HFProductEnhancements {
  constructor() {
    this.productForm = document.querySelector('product-form');
    this.variantSelectors = document.querySelectorAll('input[name="id"]');
    this.buyButton = document.querySelector('.product-form__cart-submit');
    this.priceDisplay = document.querySelector('.price');
    this.init();
  }

  init() {
    if (!this.productForm) return;

    this.setupVariantChangeHandlers();
    this.setupPreorderLogic();
    this.setupInventoryMessaging();
    this.setupSizeChartModal();
  }

  setupVariantChangeHandlers() {
    this.variantSelectors.forEach(selector => {
      selector.addEventListener('change', () => {
        this.updateProductState();
      });
    });
  }

  setupPreorderLogic() {
    this.updateProductState();
  }

  setupInventoryMessaging() {
    this.updateInventoryMessage();
  }

  setupSizeChartModal() {
    const sizeChartButtons = document.querySelectorAll('[data-open-size-chart]');
    sizeChartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById(`size-chart-${this.getProductId()}`);
        if (modal) {
          modal.showModal();
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  getProductId() {
    const productInfo = document.querySelector('product-info');
    return productInfo ? productInfo.dataset.productId : 'default';
  }

  getSelectedVariant() {
    const selectedId = document.querySelector('input[name="id"]:checked')?.value;
    if (!selectedId) return null;

    // Try to get variant data from the page
    const variantData = window.productVariants || {};
    return variantData[selectedId] || null;
  }

  updateProductState() {
    const variant = this.getSelectedVariant();
    if (!variant) return;

    this.updateBuyButton(variant);
    this.updateInventoryMessage(variant);
    this.updatePreorderState(variant);
  }

  updateBuyButton(variant) {
    if (!this.buyButton) return;

    const isAvailable = variant.available;
    const isPreorder = variant.inventory_policy === 'continue' && variant.inventory_quantity <= 0;

    if (isPreorder) {
      this.buyButton.textContent = 'Pre-order';
      this.buyButton.dataset.preorder = 'true';
      this.buyButton.disabled = false;
    } else if (isAvailable) {
      this.buyButton.textContent = 'Add to cart';
      this.buyButton.dataset.preorder = 'false';
      this.buyButton.disabled = false;
    } else {
      this.buyButton.textContent = 'Sold out';
      this.buyButton.dataset.preorder = 'false';
      this.buyButton.disabled = true;
    }
  }

  updateInventoryMessage(variant) {
    if (!variant) return;

    const existingMessage = document.querySelector('.hf-inventory-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const inventoryQuantity = variant.inventory_quantity || 0;
    const isPreorder = variant.inventory_policy === 'continue' && inventoryQuantity <= 0;
    const isLowStock = inventoryQuantity > 0 && inventoryQuantity <= 5;

    let message = null;

    if (isPreorder) {
      message = this.createInventoryMessage(
        'Pre-order available - ships as soon as stock arrives',
        'hf-inventory-message--preorder'
      );
    } else if (inventoryQuantity === 0) {
      message = this.createInventoryMessage(
        'This item is currently out of stock',
        'hf-inventory-message--out'
      );
    } else if (isLowStock) {
      message = this.createInventoryMessage(
        `Only ${inventoryQuantity} left in stock`,
        'hf-inventory-message--low'
      );
    }

    if (message) {
      this.insertInventoryMessage(message);
    }
  }

  createInventoryMessage(text, className) {
    const message = document.createElement('div');
    message.className = `hf-inventory-message ${className}`;
    message.textContent = text;
    message.setAttribute('aria-live', 'polite');
    return message;
  }

  insertInventoryMessage(message) {
    const insertPoint = document.querySelector('.product-form__buttons') || 
                      document.querySelector('.product-form__cart-submit')?.parentElement;
    
    if (insertPoint) {
      insertPoint.insertBefore(message, insertPoint.firstChild);
    }
  }

  updatePreorderState(variant) {
    const preorderBadge = document.querySelector('.hf-preorder-badge');
    const isPreorder = variant.inventory_policy === 'continue' && variant.inventory_quantity <= 0;

    if (preorderBadge) {
      preorderBadge.style.display = isPreorder ? 'block' : 'none';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new HFProductEnhancements());
} else {
  new HFProductEnhancements();
}

// Enhanced product form submission
document.addEventListener('DOMContentLoaded', function() {
  const productForm = document.querySelector('product-form');
  if (!productForm) return;

  productForm.addEventListener('submit', function(e) {
    const buyButton = this.querySelector('.product-form__cart-submit');
    const isPreorder = buyButton?.dataset.preorder === 'true';
    
    if (isPreorder) {
      // Add preorder confirmation
      const confirmed = confirm('This is a pre-order item. You will be charged now and the item will ship when stock arrives. Continue?');
      if (!confirmed) {
        e.preventDefault();
        return false;
      }
    }
  });
});

// Size chart modal enhancements
document.addEventListener('DOMContentLoaded', function() {
  const sizeChartModals = document.querySelectorAll('.hf-size-chart-modal');
  
  sizeChartModals.forEach(modal => {
    const closeButton = modal.querySelector('[data-close-size-chart]');
    const backdrop = modal;
    
    // Close button
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.close();
        document.body.style.overflow = '';
      });
    }
    
    // Backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
        document.body.style.overflow = '';
      }
    });
    
    // Escape key
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.close();
        document.body.style.overflow = '';
      }
    });
  });
});

// Enhanced variant picker interactions
document.addEventListener('DOMContentLoaded', function() {
  const variantInputs = document.querySelectorAll('input[name="id"]');
  
  variantInputs.forEach(input => {
    input.addEventListener('change', function() {
      // Add visual feedback
      const variantPicker = this.closest('.variant-picker');
      if (variantPicker) {
        variantPicker.classList.add('variant-selected');
        setTimeout(() => {
          variantPicker.classList.remove('variant-selected');
        }, 300);
      }
    });
  });
});

// Add CSS for variant selection feedback
const style = document.createElement('style');
style.textContent = `
  .variant-picker.variant-selected {
    transform: scale(1.02);
    transition: transform 0.3s ease;
  }
  
  .hf-inventory-message {
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
