import express from 'express';
import prisma from '../db/client.js';

const router = express.Router();

// GET /api/reviews?mapId=1
router.get('/', async (req, res) => {
  try {
    const { mapId = 1 } = req.query;

    const reviews = await prisma.review.findMany({
      where: {
        mapId: parseInt(mapId),
        status: 'APPROVED',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        rating: true,
        text: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ reviews, count: reviews.length });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { email, firstName, mapId = 1, rating, text } = req.body;

    if (!email || !firstName || !rating || !text) {
      return res.status(400).json({
        error: 'Email, firstName, rating, and text are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify user has purchased this map
    const purchase = await prisma.purchase.findFirst({
      where: {
        email,
        mapId: parseInt(mapId),
        status: 'completed',
      },
    });

    if (!purchase) {
      return res.status(403).json({
        error: 'You must purchase this map to leave a review',
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        email,
        firstName,
        mapId: parseInt(mapId),
        purchaseId: purchase.id,
        rating: parseInt(rating),
        text,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      message: 'Review submitted. It will appear after moderation.',
      review: {
        id: review.id,
        status: review.status,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
