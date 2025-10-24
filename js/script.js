document.addEventListener('DOMContentLoaded', () => {
  /* ===== Product Color Variants Configuration ===== */
  const productVariants = {
    "Men's Formal Button Down Shirt": {
      colors: [
        { name: "White", image: "https://m.media-amazon.com/images/I/71SWxE7+arL._SY741_.jpg" },
        { name: "Black", image: "https://m.media-amazon.com/images/I/615W1abrC2L._SY741_.jpg" },
        { name: "Maroon", image: "https://m.media-amazon.com/images/I/61qkmzkjztL._SY741_.jpg" },
        { name: "Blue", image: "https://m.media-amazon.com/images/I/61Krw8gk0aL._SY741_.jpg" }
      ]
    },
    "Cotton Blend Full Sleeve Shirt": {
      colors: [
        { name: "Blue", image: "https://m.media-amazon.com/images/I/41SOayJ-rSL._SY741_.jpg" },
        { name: "Sand", image: "https://m.media-amazon.com/images/I/41Yr1Ac41aL._SY741_.jpg" },
        { name: "White", image: "https://m.media-amazon.com/images/I/41fVBvTC-PL._SY741_.jpg" }
      ]
    },
    "Premium Casual Washed Shirt": {
      colors: [
        { name: "Green", image: "https://m.media-amazon.com/images/I/71XX0OTaPbL._SX569_.jpg" },
        { name: "Blue", image: "https://m.media-amazon.com/images/I/71E137by9DL._SX569_.jpg" },
        { name: "Khaki", image: "https://m.media-amazon.com/images/I/71xQxOKNZqL._SX569_.jpg" },
        { name: "Rust", image: "https://m.media-amazon.com/images/I/710FV9BANKL._SX569_.jpg" }
      ]
    },
    "Women's Cotton Zipper Tshirt": {
      colors: [
        { name: "Black", image: "https://m.media-amazon.com/images/I/610uC4XZ7HL._SY741_.jpg" },
        { name: "Magenta", image: "https://m.media-amazon.com/images/I/A1wBuArpcTL._SY741_.jpg" },
        { name: "Violet", image: "https://m.media-amazon.com/images/I/71WNCy4EpiL._SY741_.jpg" }
      ]
    },
    "Women's Mandarin Collar Shirt": {
      colors: [
        { name: "Maroon", image: "https://m.media-amazon.com/images/I/51Ru4pJNWVL._SY741_.jpg" },
        { name: "Mustard", image: "https://m.media-amazon.com/images/I/615wLZfEX2L._SY741_.jpg" },
        { name: "Peach", image: "https://m.media-amazon.com/images/I/61DzLOgSykL._SY741_.jpg" },
        { name: "Green", image: "https://m.media-amazon.com/images/I/61RldknKuJL._SY741_.jpg" }
      ]
    }
  };

  /* ===== Thumbnail Gallery ===== */
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.thumb');
  const productTitle = document.querySelector('.details h2');
  const productPrice = document.querySelector('.details .price');
  const originalPrice = document.querySelector('.original-price');
  const discountElement = document.querySelector('.discount');
  const swatchesContainer = document.querySelector('.swatches');

  function updateColorSwatches(productName) {
    const variants = productVariants[productName];
    if (variants) {
      swatchesContainer.innerHTML = '';
      variants.colors.forEach((color, index) => {
        const swatch = document.createElement('span');
        swatch.className = `swatch ${index === 0 ? 'active' : ''}`;
        swatch.dataset.colour = color.name;
        swatch.dataset.image = color.image;
        
        // Set background color based on color name
        const colorMap = {
          'White': '#ffffff',
          'Black': '#000000',
          'Maroon': '#800000',
          'Blue': '#0000ff',
          'Sand': '#f4a460',
          'Green': '#008000',
          'Khaki': '#f0e68c',
          'Rust': '#b7410e',
          'Magenta': '#ff00ff',
          'Violet': '#ee82ee',
          'Mustard': '#ffdb58',
          'Peach': '#ffdab9'
        };
        
        swatch.style.background = colorMap[color.name] || '#cccccc';
        if (color.name === 'White') {
          swatch.style.border = '1px solid #ccc';
        }
        
        swatch.addEventListener('click', handleSwatchClick);
        swatchesContainer.appendChild(swatch);
      });
    }
  }

  function handleSwatchClick() {
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(s => s.classList.remove('active'));
    this.classList.add('active');
    localStorage.setItem('selectedColour', this.dataset.colour);
    
    // Update main image
    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.src = this.dataset.image;
      mainImage.alt = `${productTitle.textContent} - ${this.dataset.colour}`;
      mainImage.style.opacity = '1';
    }, 200);
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update active class
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Update main image with fade effect
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainImage.src = thumb.src;
        mainImage.alt = thumb.alt;
        mainImage.style.opacity = '1';
      }, 200);

      // Update product name and price
      productTitle.textContent = thumb.dataset.name;
      productPrice.textContent = thumb.dataset.price;
      
      // Update original price and discount if available
      if (thumb.dataset.originalPrice) {
        originalPrice.textContent = thumb.dataset.originalPrice;
        originalPrice.style.display = 'block';
        
        const currentPrice = parseFloat(thumb.dataset.price.replace('$', ''));
        const originalPriceValue = parseFloat(thumb.dataset.originalPrice.replace('$', ''));
        const discount = Math.round(((originalPriceValue - currentPrice) / originalPriceValue) * 100);
        discountElement.textContent = `Save ${discount}%`;
        discountElement.style.display = 'inline-block';
      } else {
        originalPrice.style.display = 'none';
        discountElement.style.display = 'none';
      }
      
      // Update color swatches for the selected product
      updateColorSwatches(thumb.dataset.name);
      
      // Update bundle section if it contains the current product
      updateBundlePricing(thumb.dataset.name, thumb.dataset.price);
    });
  });

  /* ===== Size Selector ===== */
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      sizeOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      localStorage.setItem('selectedSize', option.dataset.size);
    });
  });

  /* ===== Quantity Selector ===== */
  const quantityInput = document.getElementById('quantity');
  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');

  decreaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
      quantityInput.value = currentValue + 1;
    }
  });

  quantityInput.addEventListener('change', () => {
    let value = parseInt(quantityInput.value);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 10) value = 10;
    quantityInput.value = value;
  });

  /* ===== Add to Cart Functionality ===== */
  const addToCartBtn = document.getElementById('addToCart');
  const buyNowBtn = document.getElementById('buyNow');
  const cartCount = document.getElementById('cartCount');
  let cartItems = 0;

  addToCartBtn.addEventListener('click', () => {
    const selectedSize = document.querySelector('.size-option.active').dataset.size;
    const selectedColour = document.querySelector('.swatch.active').dataset.colour;
    const quantity = parseInt(quantityInput.value);
    
    cartItems += quantity;
    cartCount.textContent = cartItems;
    
    showToast(`${quantity} ${productTitle.textContent} (${selectedColour}) added to cart!`);
    
    // Save to localStorage
    const cartItem = {
      name: productTitle.textContent,
      price: productPrice.textContent,
      size: selectedSize,
      colour: selectedColour,
      quantity: quantity,
      image: mainImage.src
    };
    
    saveToCart(cartItem);
  });

  buyNowBtn.addEventListener('click', () => {
    addToCartBtn.click();
    showToast('Proceeding to checkout...', 'success');
    // In a real app, this would redirect to checkout
  });

  /* ===== Wishlist Functionality ===== */
  const wishlistBtn = document.querySelector('.btn-wishlist');
  wishlistBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
      this.style.color = '#dc3545';
      this.style.borderColor = '#dc3545';
      showToast('Added to wishlist!');
    } else {
      this.style.color = '#6c757d';
      this.style.borderColor = '#dee2e6';
      showToast('Removed from wishlist');
    }
  });

  /* ===== Pair Well With Add Buttons ===== */
  const addPairButtons = document.querySelectorAll('.btn-add-pair');
  addPairButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.card');
      const productName = card.querySelector('h4').textContent;
      const productPrice = card.querySelector('p').textContent;
      
      cartItems++;
      cartCount.textContent = cartItems;
      showToast(`${productName} added to cart!`);
    });
  });

  /* ===== Quick Add Buttons ===== */
  const quickAddButtons = document.querySelectorAll('.btn-quick-add');
  quickAddButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.card');
      const productName = card.querySelector('h4').textContent;
      const productPrice = card.querySelector('.card-price').textContent;
      
      cartItems++;
      cartCount.textContent = cartItems;
      showToast(`${productName} added to cart!`);
    });
  });

  /* ===== Bundle Functionality ===== */
  const bundleCheckboxes = document.querySelectorAll('.bundle-item input');
  const bundleTotal = document.querySelector('.bundle-total strong');
  const regularPrice = document.querySelector('.regular-price');
  const saveAmount = document.querySelector('.save-amount');
  const bundleBtn = document.querySelector('.bundle-btn');

  function updateBundlePricing() {
    let total = 0;
    let regularTotal = 0;
    
    bundleCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const priceText = checkbox.nextElementSibling.textContent;
        const price = parseFloat(priceText.match(/\$([\d.]+)/)[1]);
        total += price;
        
        // Calculate regular price (assuming 25% discount on bundle)
        regularTotal += price / 0.75;
      }
    });
    
    bundleTotal.textContent = `$${total.toFixed(2)}`;
    regularPrice.textContent = `$${regularTotal.toFixed(2)}`;
    saveAmount.textContent = `$${(regularTotal - total).toFixed(2)}`;
  }

  bundleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateBundlePricing);
  });

  bundleBtn.addEventListener('click', () => {
    let selectedCount = 0;
    bundleCheckboxes.forEach(checkbox => {
      if (checkbox.checked) selectedCount++;
    });
    
    if (selectedCount > 0) {
      cartItems += selectedCount;
      cartCount.textContent = cartItems;
      showToast(`Bundle with ${selectedCount} items added to cart!`);
    } else {
      showToast('Please select at least one item from the bundle', 'error');
    }
  });

  /* ===== Size Chart Modal ===== */
  const sizeChartModal = document.getElementById('sizeChartModal');
  const sizeChartBtn = document.getElementById('sizeChartBtn');
  const sizeChartClose = sizeChartModal.querySelector('.close');

  sizeChartBtn.addEventListener('click', () => sizeChartModal.classList.add('active'));
  sizeChartClose.addEventListener('click', () => sizeChartModal.classList.remove('active'));
  sizeChartModal.addEventListener('click', e => {
    if(e.target === sizeChartModal) sizeChartModal.classList.remove('active');
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') sizeChartModal.classList.remove('active');
  });

  /* ===== Compare Colours Modal ===== */
  const compareModal = document.getElementById('compareModal');
  const compareBtn = document.getElementById('compareBtn');
  const compareArea = document.getElementById('compareColours');
  const compareClose = compareModal.querySelector('.close');

  compareBtn.addEventListener('click', () => {
    compareArea.innerHTML = '';
    const currentProduct = productTitle.textContent;
    const variants = productVariants[currentProduct];
    
    if (variants) {
      variants.colors.forEach(color => {
        const container = document.createElement('div');
        container.style.textAlign = 'center';
        container.style.margin = '10px';
        
        const img = document.createElement('img');
        img.src = color.image;
        img.alt = color.name;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.border = '2px solid #dee2e6';
        
        const label = document.createElement('div');
        label.textContent = color.name;
        label.style.marginTop = '0.5rem';
        label.style.fontWeight = 'bold';
        
        container.appendChild(img);
        container.appendChild(label);
        compareArea.appendChild(container);
      });
    }
    
    compareModal.classList.add('active');
  });

  compareClose.addEventListener('click', () => compareModal.classList.remove('active'));
  compareModal.addEventListener('click', e => {
    if(e.target === compareModal) compareModal.classList.remove('active');
  });

  /* ===== Tabs ===== */
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      tabContents.forEach(c => {
        c.classList.remove('active');
        if(c.id === target) c.classList.add('active');
      });
    });
  });

  /* ===== Toast Notification ===== */
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type === 'error') {
      toast.classList.add('error');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /* ===== Cart Management ===== */
  function saveToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /* ===== Load previous selections ===== */
  const savedColour = localStorage.getItem('selectedColour');
  if(savedColour) {
    // Color will be set when swatches are created
  }

  const savedSize = localStorage.getItem('selectedSize');
  if(savedSize) {
    sizeOptions.forEach(o => {
      o.classList.toggle('active', o.dataset.size === savedSize);
    });
  }

  // Initialize color swatches for default product
  updateColorSwatches(productTitle.textContent);

  // Initialize bundle pricing
  updateBundlePricing();

  // Initialize cart count
  const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems = savedCart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = cartItems;
});

// Bundle pricing update function for product changes
function updateBundlePricing(productName, productPrice) {
  const bundleItems = document.querySelectorAll('.bundle-item');
  bundleItems.forEach(item => {
    const label = item.querySelector('label');
    if (label.textContent.includes(productName)) {
      label.textContent = label.textContent.replace(/\$[\d.]+/, productPrice);
    }
  });
  
  // Recalculate bundle total if needed
  const event = new Event('change');
  document.querySelectorAll('.bundle-item input').forEach(checkbox => {
    checkbox.dispatchEvent(event);
  });
}
// Add this to the end of your existing script.js
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.header-nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (currentPage === linkPage || (currentPage === '' && linkPage === 'home.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', setActiveNav);