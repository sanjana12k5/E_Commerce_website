const mongoose = require('mongoose');
const connectDB = require('./connection');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Admin = require('./models/Admin');

const DEFAULT_PRODUCTS = [
  {
    productId: "prod-1",
    title: "AeroBuds Pro Wireless",
    category: "Electronics",
    price: 149.99,
    image: "",
    description: "Next-gen noise-cancelling wireless earbuds featuring spatial audio, custom fitting silicone tips, IPX4 sweat resistance, and a smart charging case with up to 36 hours of battery life.",
    rating: 4.8,
    reviews: 86
  },
  {
    productId: "prod-2",
    title: "CyberPunk Tactile Keyboard",
    category: "Gaming",
    price: 189.50,
    image: "",
    description: "Hot-swappable tactile mechanical keyboard built with premium custom PBT keycaps, dual-mode wireless (2.4Ghz/Bluetooth), and customizable reactive RGB underglow.",
    rating: 4.9,
    reviews: 142
  },
  {
    productId: "prod-3",
    title: "Minimalist Leather Backpack",
    category: "Apparel",
    price: 110.00,
    image: "",
    description: "Water-resistant, hand-crafted full-grain leather backpack. Features a dedicated 16-inch padded laptop sleeve, secret luggage pass-through, and modular organization compartments.",
    rating: 4.7,
    reviews: 54
  },
  {
    productId: "prod-4",
    title: "GlowSphere Desk Lamp",
    category: "Home & Office",
    price: 75.00,
    image: "",
    description: "Elegant ambient RGB sphere desk light with dimmable natural light controls, smart home integration, and an integrated 15W Qi wireless fast charging base.",
    rating: 4.6,
    reviews: 98
  },
  {
    productId: "prod-5",
    title: "Titanium EDC Bolt Pen",
    category: "Accessories",
    price: 45.00,
    image: "",
    description: "CNC-machined grade 5 titanium alloy bolt-action writing tool. Designed to last a lifetime, featuring a knurled grip, balanced weight distribution, and Schmidt ink refills.",
    rating: 4.5,
    reviews: 31
  },
  {
    productId: "prod-6",
    title: "Ergonomic Memory Foam Cushion",
    category: "Home & Office",
    price: 59.99,
    image: "",
    description: "Premium orthopedic seat cushion crafted with supportive memory foam. Relieves tailbone pressure, promotes posture correction, and features a breathable mesh cover.",
    rating: 4.4,
    reviews: 120
  }
];

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin1234'
};

async function seed() {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(DEFAULT_PRODUCTS);
      console.log(`✅ Seeded ${DEFAULT_PRODUCTS.length} products`);
    } else {
      console.log(`⏭️  Products collection already has ${productCount} documents — skipping`);
    }

    // Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const admin = new Admin(DEFAULT_ADMIN);
      await admin.save(); // triggers pre-save bcrypt hash
      console.log(`✅ Seeded default admin user (username: "${DEFAULT_ADMIN.username}")`);
    } else {
      console.log(`⏭️  Admins collection already has ${adminCount} documents — skipping`);
    }

    // Report Orders
    const orderCount = await Order.countDocuments();
    console.log(`📦 Orders collection has ${orderCount} documents`);

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
