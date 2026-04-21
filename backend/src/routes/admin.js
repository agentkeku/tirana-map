import express from 'express';
import prisma from '../db/client.js';
import { sendReviewApprovalEmail } from '../services/email.js';

const router = express.Router();

// Middleware for admin authentication (simple password check)
const adminAuth = (req, res, next) => {
  const { adminPassword } = req.body;
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /api/admin/purchases
router.get('/purchases', async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        amount: true,
        status: true,
        downloadCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ purchases, count: purchases.length });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/reviews?status=PENDING
router.get('/reviews', async (req, res) => {
  try {
    const { status = 'PENDING' } = req.query;

    const reviews = await prisma.review.findMany({
      where: { status },
      include: {
        purchase: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ reviews, count: reviews.length });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/reviews/:reviewId
router.patch('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const review = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: {
        status,
        approvedAt: new Date(),
        moderatedBy: 'admin',
      },
    });

    // Send email if approved
    if (status === 'APPROVED') {
      await sendReviewApprovalEmail(review.email, review.firstName);
    }

    res.json({ message: `Review ${status.toLowerCase()}`, review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/reviews/:reviewId
router.delete('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.review.delete({
      where: { id: parseInt(reviewId) },
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.mapCategory.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({ categories, count: categories.length });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/categories
router.post('/categories', async (req, res) => {
  try {
    const { mapId, name, color, adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await prisma.mapCategory.create({
      data: {
        mapId: parseInt(mapId),
        name,
        color: color || '#C8583A',
      },
    });

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/categories/:categoryId
router.patch('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, color, adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const category = await prisma.mapCategory.update({
      where: { id: parseInt(categoryId) },
      data: {
        ...(name && { name }),
        ...(color && { color }),
      },
    });

    res.json({ message: 'Category updated', category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/categories/:categoryId
router.delete('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.mapCategory.delete({
      where: { id: parseInt(categoryId) },
    });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
