const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apexcart_db';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB connected successfully to: ${MONGO_URI}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
}

module.exports = connectDB;
