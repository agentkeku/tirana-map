import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import sampleRoutes from './routes/sample.js';
import checkoutRoutes from './routes/checkout.js';
import downloadRoutes from './routes/download.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Map Selling Platform API',
    version: '1.0.0',
    status: 'running',
  });
});

// Routes
app.use('/api', sampleRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', downloadRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST   /api/sample-request - Request sample map`);
  console.log(`   GET    /api/sample-map - Get sample map data`);
  console.log(`   POST   /api/checkout - Create Stripe checkout`);
  console.log(`   GET    /api/download/:token - Download full map`);
  console.log(`   GET    /api/reviews - Get approved reviews`);
  console.log(`   POST   /api/reviews - Submit a review`);
  console.log(`   GET    /api/admin/purchases - List purchases`);
  console.log(`   GET    /api/admin/reviews - List pending reviews`);
  console.log(`   PATCH  /api/admin/reviews/:id - Approve/reject review`);
  console.log(`   GET    /api/admin/categories - List categories`);
  console.log(`   POST   /api/admin/categories - Create category`);
});
