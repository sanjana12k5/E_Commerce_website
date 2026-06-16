/**
 * ApexCart - Core Application JavaScript Engine
 * Provides state management, local database syncing, UI rendering,
 * and administration workflows.
 */

// ==========================================================================
// 1. STATE & STORAGE INITIALIZATION
// ==========================================================================

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    title: "AeroBuds Pro Wireless",
    category: "Electronics",
    price: 149.99,
    image: "",
    description: "Next-gen noise-cancelling wireless earbuds featuring spatial audio, custom fitting silicone tips, IPX4 sweat resistance, and a smart charging case with up to 36 hours of battery life.",
    rating: 4.8,
    reviews: 86
  },
  {
    id: "prod-2",
    title: "CyberPunk Tactile Keyboard",
    category: "Gaming",
    price: 189.50,
    image: "",
    description: "Hot-swappable tactile mechanical keyboard built with premium custom PBT keycaps, dual-mode wireless (2.4Ghz/Bluetooth), and customizable reactive RGB underglow.",
    rating: 4.9,
    reviews: 142
  },
  {
    id: "prod-3",
    title: "Minimalist Leather Backpack",
    category: "Apparel",
    price: 110.00,
    image: "",
    description: "Water-resistant, hand-crafted full-grain leather backpack. Features a dedicated 16-inch padded laptop sleeve, secret luggage pass-through, and modular organization compartments.",
    rating: 4.7,
    reviews: 54
  },
  {
    id: "prod-4",
    title: "GlowSphere Desk Lamp",
    category: "Home & Office",
    price: 75.00,
    image: "",
    description: "Elegant ambient RGB sphere desk light with dimmable natural light controls, smart home integration, and an integrated 15W Qi wireless fast charging base.",
    rating: 4.6,
    reviews: 98
  },
  {
    id: "prod-5",
    title: "Titanium EDC Bolt Pen",
    category: "Accessories",
    price: 45.00,
    image: "",
    description: "CNC-machined grade 5 titanium alloy bolt-action writing tool. Designed to last a lifetime, featuring a knurled grip, balanced weight distribution, and Schmidt ink refills.",
    rating: 4.5,
    reviews: 31
  },
  {
    id: "prod-6",
    title: "Ergonomic Memory Foam Cushion",
    category: "Home & Office",
    price: 59.99,
    image: "",
    description: "Premium orthopedic seat cushion crafted with supportive memory foam. Relieves tailbone pressure, promotes posture correction, and features a breathable mesh cover.",
    rating: 4.4,
    reviews: 120
  }
];

// App State
let state = {
  products: [],
  cart: [],
  orders: [],
  currentView: "shop", // "shop" or "admin"
  adminTab: "dashboard", // "dashboard", "products", or "orders"
  activeCategory: "All",
  searchQuery: "",
  sortBy: "default",
  theme: "light",
  isAdminLoggedIn: false // admin session tracking
};

// Database Helpers (Client-side localStorage Sync for Cart and Theme only)
const db = {
  saveCart() {
    localStorage.setItem("apexcart_cart", JSON.stringify(state.cart));
  },

  saveTheme() {
    localStorage.setItem("apexcart_theme", state.theme);
  }
};

// ==========================================================================
// 2. VECTOR ILLUSTRATION DYNAMIC GENERATOR
// ==========================================================================

function getProductImageSrc(product) {
  if (product.image && (product.image.startsWith("http") || product.image.startsWith("data:") || product.image.startsWith("/"))) {
    return product.image;
  }
  return generatePremiumSVG(product.title, product.category);
}

function generatePremiumSVG(title, category) {
  let color1 = "#6366f1"; // Indigo
  let color2 = "#a855f7"; // Purple
  let iconContent = "";

  // Assign design gradients and custom paths based on Category
  switch (category) {
    case "Electronics":
      color1 = "#3b82f6"; // Blue
      color2 = "#60a5fa"; // Light Blue
      iconContent = `
        <!-- Earbuds vector art -->
        <circle cx="9" cy="11" r="4" fill="none" stroke="white" stroke-width="1.5"/>
        <path d="M9 11c0-1.5 1-2.5 2.5-2.5h1" stroke="white" stroke-width="1.5" fill="none"/>
        <path d="M12.5 8.5v6c0 1-.5 1.5-1.5 1.5" stroke="white" stroke-width="1.5" fill="none"/>
        <circle cx="15" cy="11" r="4" fill="none" stroke="white" stroke-width="1.5"/>
        <path d="M15 11c0-1.5-1-2.5-2.5-2.5h-1" stroke="white" stroke-width="1.5" fill="none"/>
        <path d="M11.5 8.5v6c0 1 .5 1.5 1.5 1.5" stroke="white" stroke-width="1.5" fill="none"/>
        <rect x="7" y="18" width="10" height="2" rx="1" fill="white" opacity="0.8"/>
      `;
      break;
    case "Gaming":
      color1 = "#ec4899"; // Pink
      color2 = "#f43f5e"; // Rose
      iconContent = `
        <!-- Keyboard / Gamepad art -->
        <rect x="4" y="8" width="16" height="9" rx="2" fill="none" stroke="white" stroke-width="1.5"/>
        <line x1="7" y1="12" x2="9" y2="12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="8" y1="11" x2="8" y2="13" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="14" cy="125" r="0.75" fill="white"/>
        <circle cx="15.5" cy="11.5" r="1" fill="white"/>
        <circle cx="15.5" cy="13.5" r="1" fill="white"/>
        <circle cx="17" cy="12.5" r="1" fill="white"/>
        <path d="M7 15h10" stroke="white" stroke-width="1" stroke-dasharray="1 1"/>
      `;
      break;
    case "Apparel":
      color1 = "#f59e0b"; // Amber
      color2 = "#eab308"; // Yellow
      iconContent = `
        <!-- Backpack / Fashion art -->
        <path d="M6 10v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4z" fill="none" stroke="white" stroke-width="1.5"/>
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" fill="none" stroke="white" stroke-width="1.5"/>
        <rect x="9" y="11" width="6" height="5" rx="1" fill="none" stroke="white" stroke-width="1.2"/>
        <line x1="12" y1="11" x2="12" y2="13" stroke="white" stroke-width="1.2"/>
      `;
      break;
    case "Home & Office":
      color1 = "#10b981"; // Emerald
      color2 = "#059669"; // Active Emerald
      iconContent = `
        <!-- Lamp / Desk item art -->
        <path d="M12 4a4 4 0 0 1 4 4v2H8V8a4 4 0 0 1 4-4z" fill="none" stroke="white" stroke-width="1.5"/>
        <path d="M12 10v7" stroke="white" stroke-width="1.5"/>
        <path d="M8 17h8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <rect x="7" y="18" width="10" height="2" rx="0.5" fill="white" opacity="0.9"/>
      `;
      break;
    case "Accessories":
    default:
      color1 = "#6366f1"; // Indigo
      color2 = "#3b82f6"; // Blue
      iconContent = `
        <!-- Pen / Clock art -->
        <circle cx="12" cy="12" r="8" fill="none" stroke="white" stroke-width="1.5"/>
        <polyline points="12 7 12 12 15 15" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="12" cy="4" r="1" fill="white"/>
        <circle cx="12" cy="20" r="1" fill="white"/>
        <circle cx="4" cy="12" r="1" fill="white"/>
        <circle cx="20" cy="12" r="1" fill="white"/>
      `;
      break;
  }

  // Create unique gradient ID to avoid caching bugs
  const gradId = `grad-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${category.toLowerCase()}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#${gradId})"/>
    <g stroke-linecap="round" stroke-linejoin="round" transform="translate(0, 0)">
      ${iconContent}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}


// ==========================================================================
// 3. TOAST NOTIFICATION SYSTEM
// ==========================================================================

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  // Get icon SVG based on type
  let icon = "";
  if (type === "success") {
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === "danger") {
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  } else if (type === "warning") {
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  } else {
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `;

  container.appendChild(toast);

  // Close actions
  const closeBtn = toast.querySelector(".toast-close");
  const dismiss = () => {
    toast.classList.add("toast-fadeout");
    toast.addEventListener("animationend", (e) => {
      if (e.animationName === "slideOutToast") {
        toast.remove();
      }
    });
  };

  closeBtn.addEventListener("click", dismiss);

  // Auto Dismiss after 3s
  setTimeout(() => {
    if (toast.parentNode) {
      dismiss();
    }
  }, 3000);
}


// ==========================================================================
// 4. USER PORTAL VIEW RENDERING & FILTERS
// ==========================================================================

function getCategoriesCount() {
  const counts = { All: state.products.length };
  state.products.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}

function renderCategoryFilters() {
  const container = document.getElementById("category-filter-list");
  if (!container) return;

  const counts = getCategoriesCount();
  const categories = ["All", "Electronics", "Accessories", "Gaming", "Apparel", "Home & Office"];

  container.innerHTML = categories.map(cat => {
    const activeClass = state.activeCategory === cat ? "active" : "";
    const count = counts[cat] || 0;
    return `
      <button class="category-btn ${activeClass}" data-category="${cat}">
        <span>${cat}</span>
        <span class="category-count">${count}</span>
      </button>
    `;
  }).join("");

  // Add click listeners
  container.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.getAttribute("data-category");
      renderCategoryFilters();
      renderShopGrid();
    });
  });
}

function renderShopGrid() {
  const grid = document.getElementById("product-grid-container");
  const resultsText = document.getElementById("results-count-text");
  if (!grid) return;

  // Filter products
  let filtered = state.products.filter(p => {
    const matchCat = state.activeCategory === "All" || p.category === state.activeCategory;
    const matchQuery = p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                       p.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Sort products
  if (state.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Update counts
  if (resultsText) {
    resultsText.textContent = `Showing ${filtered.length} products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No Products Found</h3>
        <p style="margin-top: 0.5rem;">Try modifying your keyword search or category filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const imgSrc = getProductImageSrc(product);
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-card-img-wrapper" onclick="openDetailsModal('${product.id}')" style="cursor: pointer;">
          <span class="product-card-tag">${product.category}</span>
          <img class="product-card-img" src="${imgSrc}" alt="${product.title}">
        </div>
        <div class="product-card-body">
          <div class="product-card-rating">
            ⭐ <span>${product.rating || "4.5"} (${product.reviews || 20})</span>
          </div>
          <h3 class="product-card-title" onclick="openDetailsModal('${product.id}')">${product.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 0.5rem;">
            ${product.description}
          </p>
          <div class="product-card-footer">
            <span class="product-card-price">$${product.price.toFixed(2)}</span>
            <button class="add-cart-btn" data-id="${product.id}" title="Add to Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Add click listeners to 'Add to Cart' buttons
  grid.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute("data-id");
      addToCart(pId);
    });
  });
}


// ==========================================================================
// 5. CART OPERATIONS & DRAWER VIEW
// ==========================================================================

function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      productId: productId,
      quantity: 1,
      price: product.price // Lock current price
    });
  }

  db.saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast(`Added "${product.title}" to cart.`);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge-count");
  if (!badge) return;
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  badge.textContent = count;
}

function renderCartDrawer() {
  const container = document.getElementById("cart-items-container");
  const footerControls = document.getElementById("cart-footer-controls");
  const subtotalText = document.getElementById("cart-subtotal-price");
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-message">
        <span class="empty-cart-icon">🛒</span>
        <h3>Your Cart is Empty</h3>
        <p>Explore our inventory and find items you love!</p>
      </div>
    `;
    if (footerControls) footerControls.style.display = "none";
    return;
  }

  // Populate list
  let total = 0;
  container.innerHTML = state.cart.map(cartItem => {
    const product = state.products.find(p => p.id === cartItem.productId);
    if (!product) return ""; // In case product was deleted

    const itemTotal = product.price * cartItem.quantity;
    total += itemTotal;
    const imgSrc = getProductImageSrc(product);

    return `
      <div class="cart-item">
        <div class="cart-item-img-wrapper">
          <img class="cart-item-img" src="${imgSrc}" alt="${product.title}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${product.title}</h4>
          <span class="cart-item-price">$${product.price.toFixed(2)}</span>
          <div class="cart-item-qty">
            <button class="qty-btn dec-qty-btn" data-id="${cartItem.productId}">-</button>
            <span class="qty-val">${cartItem.quantity}</span>
            <button class="qty-btn inc-qty-btn" data-id="${cartItem.productId}">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${cartItem.productId}" title="Remove Item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  }).join("");

  if (subtotalText) {
    subtotalText.textContent = `$${total.toFixed(2)}`;
  }
  if (footerControls) {
    footerControls.style.display = "flex";
  }

  // Bind Quantity Adjustment and Remove Buttons
  container.querySelectorAll(".inc-qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-id");
      adjustCartQty(pId, 1);
    });
  });

  container.querySelectorAll(".dec-qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-id");
      adjustCartQty(pId, -1);
    });
  });

  container.querySelectorAll(".remove-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-id");
      removeCartItem(pId);
    });
  });
}

function adjustCartQty(productId, delta) {
  const item = state.cart.find(c => c.productId === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(c => c.productId !== productId);
  }

  db.saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter(c => c.productId !== productId);
  db.saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast("Item removed from cart.", "info");
}

async function handleCheckoutSubmit() {
  const nameInput = document.getElementById("checkout-name");
  const emailInput = document.getElementById("checkout-email");
  const addressInput = document.getElementById("checkout-address");

  if (!nameInput.value || !emailInput.value || !addressInput.value) {
    showToast("Please fill out all fields.", "warning");
    return;
  }

  // Calculate total price
  let totalSum = 0;
  const itemSummaries = state.cart.map(c => {
    const prod = state.products.find(p => p.id === c.productId);
    const title = prod ? prod.title : "Deleted Product";
    totalSum += c.price * c.quantity;
    return {
      productId: c.productId,
      title: title,
      quantity: c.quantity,
      price: c.price
    };
  });

  const orderData = {
    customerName: nameInput.value,
    customerEmail: emailInput.value,
    deliveryAddress: addressInput.value,
    total: totalSum,
    items: itemSummaries
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!res.ok) throw new Error("Order creation failed");
    const newOrder = await res.json();

    // Clear inputs and cart
    nameInput.value = "";
    emailInput.value = "";
    addressInput.value = "";
    state.cart = [];
    db.saveCart();

    // Close Drawer
    toggleCartDrawer(false);

    // Sync Badges and refresh UI
    updateCartBadge();
    renderShopGrid();

    // Success Feedbacks
    showToast(`Order ${newOrder.id} placed successfully!`, "success");
  } catch (err) {
    console.error("Checkout error:", err);
    showToast("Failed to submit order to server", "danger");
  }
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById("cart-drawer-panel");
  const overlay = document.getElementById("cart-drawer-overlay");
  if (!drawer || !overlay) return;

  if (open) {
    overlay.style.display = "block";
    renderCartDrawer();
    // Force browser repaint before slide animation
    setTimeout(() => drawer.classList.add("open"), 10);
  } else {
    drawer.classList.remove("open");
    overlay.style.display = "none";
  }
}


// ==========================================================================
// 6. ADMINISTRATION LIFECYCLE (CRUD & ORDERS)
// ==========================================================================

function renderAdminDashboard() {
  const totalSalesText = document.getElementById("dashboard-total-sales");
  const totalProductsText = document.getElementById("dashboard-total-products");
  const totalOrdersText = document.getElementById("dashboard-total-orders");

  if (!totalSalesText || !totalProductsText || !totalOrdersText) return;

  // Active revenue is sum of all non-cancelled orders
  const revenue = state.orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  totalSalesText.textContent = `$${revenue.toFixed(2)}`;
  totalProductsText.textContent = state.products.length;
  totalOrdersText.textContent = state.orders.length;
}

function renderAdminProducts() {
  const tableBody = document.getElementById("admin-product-table-body");
  if (!tableBody) return;

  if (state.products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
          No products currently in stock. Click "Add New Product" to configure some.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = state.products.map(prod => {
    const imgSrc = getProductImageSrc(prod);
    return `
      <tr>
        <td>
          <div class="product-row-info">
            <div class="table-img-wrapper">
              <img class="table-img" src="${imgSrc}" alt="${prod.title}">
            </div>
            <span class="product-row-title">${prod.title}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-primary">${prod.category}</span>
        </td>
        <td>
          <strong>$${prod.price.toFixed(2)}</strong>
        </td>
        <td>
          <div class="action-buttons" style="justify-content: flex-end;">
            <button class="btn-icon btn-icon-edit" onclick="openProductEditModal('${prod.id}')" title="Edit product information">
              ✏️
            </button>
            <button class="btn-icon btn-icon-delete" onclick="handleProductDelete('${prod.id}')" title="Delete product option">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderAdminOrders() {
  const tableBody = document.getElementById("admin-order-table-body");
  if (!tableBody) return;

  if (state.orders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
          No customer orders placed yet.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = state.orders.map(order => {
    // Items detail line
    const itemsDescription = order.items.map(i => `${i.title} (x${i.quantity})`).join(", ");

    // Status styling
    let statusClass = "badge-warning";
    if (order.status === "shipped") statusClass = "badge-primary";
    if (order.status === "delivered") statusClass = "badge-success";
    if (order.status === "cancelled") statusClass = "badge-danger";

    // Action button configuration
    let actions = "";
    if (order.status === "pending") {
      actions = `
        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="updateOrderStatus('${order.id}', 'shipped')">🚢 Ship</button>
        <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="updateOrderStatus('${order.id}', 'cancelled')">❌ Cancel</button>
      `;
    } else if (order.status === "shipped") {
      actions = `
        <button class="btn btn-success" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="updateOrderStatus('${order.id}', 'delivered')">✅ Deliver</button>
      `;
    } else {
      actions = `<span style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic;">Completed</span>`;
    }

    return `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong>${order.customerName}</strong>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${order.customerEmail}</span>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${order.deliveryAddress}</span>
          </div>
        </td>
        <td style="font-size: 0.85rem; color: var(--text-secondary);">${order.date}</td>
        <td><strong>$${order.total.toFixed(2)}</strong></td>
        <td style="font-size: 0.85rem; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsDescription}">
          ${itemsDescription}
        </td>
        <td><span class="badge ${statusClass}">${order.status}</span></td>
        <td>
          <div class="action-buttons" style="justify-content: flex-end; align-items: center; min-height: 32px;">
            ${actions}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error("Unauthorized admin session");
      throw new Error("Failed to update status");
    }
    
    await loadOrdersFromServer();
    renderAdminOrders();
    renderAdminDashboard();
    showToast(`Order ${orderId} marked as ${newStatus}.`, "info");
  } catch (err) {
    console.error("Order status update error:", err);
    showToast(err.message || "Failed to update order status", "danger");
  }
}

async function handleProductDelete(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  if (confirm(`Are you sure you want to delete the product "${product.title}"?`)) {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized admin session");
        throw new Error("Failed to delete product");
      }

      await loadProductsFromServer();

      // Clean up cart item if matching
      state.cart = state.cart.filter(item => item.productId !== productId);
      db.saveCart();

      // Sync Badges and refresh layouts
      updateCartBadge();
      renderCategoryFilters();
      renderShopGrid();
      renderAdminProducts();
      renderAdminDashboard();

      showToast(`Deleted product "${product.title}"`, "warning");
    } catch (err) {
      console.error("Delete product error:", err);
      showToast(err.message || "Failed to delete product", "danger");
    }
  }
}

// Open modal for Adding New Product
function openProductAddModal() {
  const modal = document.getElementById("product-form-modal");
  const form = document.getElementById("product-crud-form");
  const titleText = document.getElementById("modal-form-title");

  if (!modal || !form) return;

  // Reset inputs
  form.reset();
  document.getElementById("form-product-id").value = "";
  
  // Reset Preview
  const preview = document.getElementById("form-image-preview");
  const placeholder = document.getElementById("form-image-placeholder");
  preview.style.display = "none";
  placeholder.style.display = "flex";

  titleText.textContent = "Add New Product";
  modal.style.display = "flex";
}

// Open modal for Editing Product
window.openProductEditModal = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("product-form-modal");
  const form = document.getElementById("product-crud-form");
  const titleText = document.getElementById("modal-form-title");

  if (!modal || !form) return;

  // Set form fields
  document.getElementById("form-product-id").value = product.id;
  document.getElementById("form-product-title").value = product.title;
  document.getElementById("form-product-category").value = product.category;
  document.getElementById("form-product-price").value = product.price;
  document.getElementById("form-product-image").value = product.image;
  document.getElementById("form-product-description").value = product.description;

  // Set Preview
  const preview = document.getElementById("form-image-preview");
  const placeholder = document.getElementById("form-image-placeholder");
  if (product.image) {
    preview.src = product.image;
    preview.style.display = "block";
    placeholder.style.display = "none";
  } else {
    // Render dynamic SVG mockup in preview
    preview.src = generatePremiumSVG(product.title, product.category);
    preview.style.display = "block";
    placeholder.style.display = "none";
  }

  titleText.textContent = "Edit Product";
  modal.style.display = "flex";
};

async function handleProductFormSubmit() {
  const pId = document.getElementById("form-product-id").value;
  const title = document.getElementById("form-product-title").value;
  const category = document.getElementById("form-product-category").value;
  const priceVal = parseFloat(document.getElementById("form-product-price").value);
  const image = document.getElementById("form-product-image").value;
  const description = document.getElementById("form-product-description").value;

  if (!title || !category || isNaN(priceVal) || priceVal <= 0 || !description) {
    showToast("Please fill out all fields correctly.", "warning");
    return;
  }

  if (pId) {
    // EDIT PROCESS
    try {
      const res = await fetch(`/api/products/${pId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, price: priceVal, image, description })
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized admin session");
        throw new Error("Update failed");
      }
      showToast(`Updated product "${title}" successfully.`);
    } catch (err) {
      console.error("Edit product error:", err);
      showToast(err.message || "Failed to update product", "danger");
      return;
    }
  } else {
    // ADD NEW PROCESS
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, price: priceVal, image, description })
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized admin session");
        throw new Error("Addition failed");
      }
      showToast(`Product "${title}" added to inventory.`);
    } catch (err) {
      console.error("Add product error:", err);
      showToast(err.message || "Failed to add product", "danger");
      return;
    }
  }

  // Save and Sync views
  await loadProductsFromServer();
  renderCategoryFilters();
  renderShopGrid();
  renderAdminProducts();
  renderAdminDashboard();

  // Close modal
  document.getElementById("product-form-modal").style.display = "none";
}

// Global functions accessible from HTML actions
window.handleProductDelete = handleProductDelete;
window.updateOrderStatus = updateOrderStatus;


// ==========================================================================
// 7. PRODUCT DETAIL MODAL FOR END-USERS
// ==========================================================================

window.openDetailsModal = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("product-details-modal");
  if (!modal) return;

  document.getElementById("details-modal-header-category").textContent = product.category;
  document.getElementById("details-view-img").src = getProductImageSrc(product);
  document.getElementById("details-view-title").textContent = product.title;
  document.getElementById("details-view-rating").textContent = `${product.rating || "4.5"} (${product.reviews || 20} reviews)`;
  document.getElementById("details-view-price").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("details-view-desc").textContent = product.description;

  // Bind Add to Cart directly inside the details modal
  const addBtn = document.getElementById("details-modal-add-cart-btn");
  // Remove existing listeners by clone replacement
  const newAddBtn = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(newAddBtn, addBtn);

  newAddBtn.addEventListener("click", () => {
    addToCart(product.id);
    modal.style.display = "none";
  });

  modal.style.display = "flex";
};


// ==========================================================================
// 8. SERVER API INTERACTION HELPERS
// ==========================================================================

async function loadProductsFromServer() {
  try {
    const res = await fetch('/api/products');
    state.products = await res.json();
  } catch (err) {
    console.error("Error loading products:", err);
    showToast("Failed to load products from server.", "danger");
  }
}

async function loadOrdersFromServer() {
  if (!state.isAdminLoggedIn) return;
  try {
    const res = await fetch('/api/orders');
    if (res.status === 401) {
      state.isAdminLoggedIn = false;
      updateAdminViewUI();
      return;
    }
    state.orders = await res.json();
  } catch (err) {
    console.error("Error loading orders:", err);
    showToast("Failed to load orders from server.", "danger");
  }
}

function updateAdminViewUI() {
  const loginContainer = document.getElementById("admin-login-container");
  const adminLayout = document.getElementById("admin-layout");
  if (!loginContainer || !adminLayout) return;

  if (state.isAdminLoggedIn) {
    loginContainer.style.display = "none";
    adminLayout.style.display = "flex";
    switchAdminTab(state.adminTab);
  } else {
    loginContainer.style.display = "flex";
    adminLayout.style.display = "none";
  }
}

async function handleAdminLoginSubmit() {
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const errorMsg = document.getElementById("login-error-msg");

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showToast("Please enter both username and password.", "warning");
    return;
  }

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      state.isAdminLoggedIn = true;
      if (errorMsg) errorMsg.style.display = "none";
      usernameInput.value = "";
      passwordInput.value = "";
      
      showToast("Logged in successfully.", "success");
      
      await loadOrdersFromServer();
      updateAdminViewUI();
    } else {
      if (errorMsg) {
        errorMsg.style.display = "flex";
        // Trigger CSS shake animation by resetting class
        errorMsg.style.animation = 'none';
        errorMsg.offsetHeight; /* trigger reflow */
        errorMsg.style.animation = null;
      }
      showToast("Invalid admin credentials.", "danger");
    }
  } catch (err) {
    console.error("Login error:", err);
    showToast("Failed to authenticate with server.", "danger");
  }
}

async function handleAdminLogout() {
  try {
    const res = await fetch('/api/admin/logout', { method: 'POST' });
    if (res.ok) {
      state.isAdminLoggedIn = false;
      state.orders = [];
      updateAdminViewUI();
      showToast("Logged out successfully.", "info");
    } else {
      showToast("Failed to clear session.", "warning");
    }
  } catch (err) {
    console.error("Logout error:", err);
    showToast("Server communication error.", "danger");
  }
}

async function initApp() {
  // Theme Load (local)
  const localTheme = localStorage.getItem("apexcart_theme");
  state.theme = localTheme || "light";
  document.documentElement.setAttribute("data-theme", state.theme);

  // Cart Load (local)
  const localCart = localStorage.getItem("apexcart_cart");
  state.cart = localCart ? JSON.parse(localCart) : [];
  updateCartBadge();

  // Check backend admin login status
  try {
    const res = await fetch('/api/admin/check');
    const data = await res.json();
    state.isAdminLoggedIn = data.isAdmin;
  } catch (err) {
    console.error("Session check failed:", err);
    state.isAdminLoggedIn = false;
  }

  // Load products from server
  await loadProductsFromServer();

  // Load orders if admin is already logged in
  if (state.isAdminLoggedIn) {
    await loadOrdersFromServer();
  }

  // Render Layouts
  renderCategoryFilters();
  renderShopGrid();
  
  // If current view is admin, sync UI state
  if (state.currentView === "admin") {
    updateAdminViewUI();
  }
}


// ==========================================================================
// 9. TABS, ROUTING & VIEW CONTROLLER
// ==========================================================================

function switchMainView(viewName) {
  state.currentView = viewName;

  const shopView = document.getElementById("user-view");
  const adminView = document.getElementById("admin-view");
  const shopNav = document.getElementById("nav-shop");
  const adminNav = document.getElementById("nav-admin");

  if (!shopView || !adminView || !shopNav || !adminNav) return;

  if (viewName === "shop") {
    shopView.classList.add("active");
    adminView.classList.remove("active");
    shopNav.classList.add("active");
    adminNav.classList.remove("active");
    
    // Refresh Shop
    renderCategoryFilters();
    renderShopGrid();
  } else {
    adminView.classList.add("active");
    shopView.classList.remove("active");
    adminNav.classList.add("active");
    shopNav.classList.remove("active");
    
    // Refresh admin status and render
    updateAdminViewUI();
  }
}

async function switchAdminTab(tabName) {
  state.adminTab = tabName;

  // Toggle active class on sidebar buttons
  const buttons = document.querySelectorAll(".admin-nav-btn");
  buttons.forEach(btn => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Toggle active class on panel elements
  const tabs = document.querySelectorAll(".admin-tab-content");
  tabs.forEach(tab => {
    const tabId = `admin-tab-${tabName}`;
    if (tab.id === tabId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Load appropriate dynamic data
  if (tabName === "dashboard") {
    renderAdminDashboard();
  } else if (tabName === "products") {
    renderAdminProducts();
  } else if (tabName === "orders") {
    await loadOrdersFromServer();
    renderAdminOrders();
  }
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  db.saveTheme();
}


// ==========================================================================
// 10. EVENT LISTENERS SETUP
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  document.getElementById("nav-shop").addEventListener("click", () => switchMainView("shop"));
  document.getElementById("nav-admin").addEventListener("click", () => switchMainView("admin"));
  document.getElementById("header-logo").addEventListener("click", (e) => {
    e.preventDefault();
    switchMainView("shop");
  });
  document.getElementById("hero-shop-btn").addEventListener("click", () => {
    const el = document.querySelector(".shop-layout");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });

  // Theme Toggle
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  // Cart Drawer Opens/Closes
  document.getElementById("cart-trigger").addEventListener("click", () => toggleCartDrawer(true));
  document.getElementById("cart-drawer-close").addEventListener("click", () => toggleCartDrawer(false));
  document.getElementById("cart-drawer-overlay").addEventListener("click", () => toggleCartDrawer(false));

  // Checkout submission
  document.getElementById("checkout-submission-form").addEventListener("submit", handleCheckoutSubmit);

  // Search filter
  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderShopGrid();
  });

  // Sort filter
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderShopGrid();
  });

  // Clear Filters button
  document.getElementById("clear-filters-btn").addEventListener("click", () => {
    state.searchQuery = "";
    state.sortBy = "default";
    state.activeCategory = "All";
    searchBox.value = "";
    sortSelect.value = "default";

    renderCategoryFilters();
    renderShopGrid();
    showToast("Filters cleared.", "info");
  });

  // Admin tabs switching
  document.querySelectorAll(".admin-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");
      switchAdminTab(tabName);
    });
  });

  // Admin Login handling
  const loginForm = document.getElementById("admin-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLoginSubmit);
  }

  // Admin Logout handling
  const logoutBtn = document.getElementById("admin-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleAdminLogout);
  }

  // Add Product modal controls
  document.getElementById("admin-add-product-btn").addEventListener("click", openProductAddModal);
  document.getElementById("product-form-close").addEventListener("click", () => {
    document.getElementById("product-form-modal").style.display = "none";
  });
  document.getElementById("product-form-cancel").addEventListener("click", () => {
    document.getElementById("product-form-modal").style.display = "none";
  });
  document.getElementById("product-form-submit-btn").addEventListener("click", handleProductFormSubmit);

  // Image URL preview sync inside forms
  const imageInput = document.getElementById("form-product-image");
  const preview = document.getElementById("form-image-preview");
  const placeholder = document.getElementById("form-image-placeholder");

  imageInput.addEventListener("input", (e) => {
    const url = e.target.value;
    if (url) {
      preview.src = url;
      preview.style.display = "block";
      placeholder.style.display = "none";
    } else {
      const name = document.getElementById("form-product-title").value || "New Item";
      const cat = document.getElementById("form-product-category").value || "Accessories";
      preview.src = generatePremiumSVG(name, cat);
      preview.style.display = "block";
      placeholder.style.display = "none";
    }
  });

  // User Product Detail modal controls
  document.getElementById("product-details-close").addEventListener("click", () => {
    document.getElementById("product-details-modal").style.display = "none";
  });
  document.getElementById("details-modal-back-btn").addEventListener("click", () => {
    document.getElementById("product-details-modal").style.display = "none";
  });

  // Run initialization
  initApp();
});
