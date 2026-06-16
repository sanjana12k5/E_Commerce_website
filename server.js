const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./db/connection');
const Product = require('./db/models/Product');
const Order = require('./db/models/Order');
const Admin = require('./db/models/Admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin authentication constants
const ADMIN_TOKEN = 'apexcart_admin_session_token_secure_98765';

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Serve static assets
app.use(express.static(path.join(__dirname)));

// Admin Authentication Middleware
function requireAdmin(req, res, next) {
  if (req.cookies.admin_token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
}

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid admin username or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid admin username or password' });
    }

    res.cookie('admin_token', ADMIN_TOKEN, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ success: true, message: 'Authenticated successfully' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during authentication' });
  }
});

// Logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Check Session
app.get('/api/admin/check', (req, res) => {
  const isAdmin = req.cookies.admin_token === ADMIN_TOKEN;
  res.json({ isAdmin });
});

// ==========================================
// PRODUCTS API ENDPOINTS
// ==========================================

// Public: Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Admin: Add a product
app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { title, category, price, image, description } = req.body;
    if (!title || !category || isNaN(parseFloat(price)) || !description) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const newProduct = await Product.create({
      productId: `prod-${Date.now()}`,
      title,
      category,
      price: parseFloat(price),
      image: image || "",
      description,
      rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
      reviews: Math.floor(10 + Math.random() * 150)
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Admin: Update a product
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, price, image, description } = req.body;

    if (!title || !category || isNaN(parseFloat(price)) || !description) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const updated = await Product.findOneAndUpdate(
      { productId: id },
      {
        title,
        category,
        price: parseFloat(price),
        image: image || "",
        description
      },
      { new: true }
    );

    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin: Delete a product
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndDelete({ productId: id });

    if (deleted) {
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ==========================================
// ORDERS API ENDPOINTS
// ==========================================

// Public: Place an order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, deliveryAddress, total, items } = req.body;
    if (!customerName || !customerEmail || !deliveryAddress || isNaN(parseFloat(total)) || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid order request' });
    }

    const newOrder = await Order.create({
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerEmail,
      deliveryAddress,
      date: new Date().toLocaleString(),
      total: parseFloat(total),
      items,
      status: 'pending'
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Admin: Get all orders
app.get('/api/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
app.put('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const updated = await Order.findOneAndUpdate(
      { orderId: id },
      { status },
      { new: true }
    );

    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ==========================================
// START SERVER (after MongoDB connection)
// ==========================================

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 ApexCart Server running at http://localhost:${PORT}`);
  });
}

startServer();
