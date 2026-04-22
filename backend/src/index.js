import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Routes
import sampleRoutes from './routes/sample.js';
import checkoutRoutes from './routes/checkout.js';
import downloadRoutes from './routes/download.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIST = path.join(__dirname, '../../frontend/dist');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', sampleRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', downloadRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Serve built React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Map Selling Platform API', version: '1.0.0', status: 'running' });
  });
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV ?? 'development'})`);
});
