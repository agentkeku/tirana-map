import express from 'express';
import prisma from '../db/client.js';
import { sendSampleMapEmail } from '../services/email.js';
import { generateMapJSON } from '../utils/helpers.js';

const router = express.Router();

// POST /api/sample-request
router.post('/sample-request', async (req, res) => {
  try {
    const { email, firstName = 'Guest' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get the Tirana map
    const map = await prisma.map.findFirst({
      where: { title: 'Tirana Insider' },
    });

    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    // Get sample spots (first 10)
    const sampleSpots = await prisma.mapSpot.findMany({
      where: {
        mapId: map.id,
        isInSample: true,
      },
      take: 10,
    });

    // Generate map JSON
    const mapJSON = generateMapJSON(sampleSpots);

    // Send email
    await sendSampleMapEmail(email, firstName);

    res.status(200).json({
      message: 'Sample map has been sent to your email',
      email,
      spotsIncluded: sampleSpots.length,
    });
  } catch (error) {
    console.error('Error in sample-request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sample-map (returns the sample map data)
router.get('/sample-map', async (req, res) => {
  try {
    const map = await prisma.map.findFirst({
      where: { title: 'Tirana Insider' },
    });

    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    const sampleSpots = await prisma.mapSpot.findMany({
      where: {
        mapId: map.id,
        isInSample: true,
      },
    });

    const mapJSON = generateMapJSON(sampleSpots);

    res.json({
      map: {
        title: map.title,
        description: map.description,
        price: map.price,
        sampleSpots: map.sampleSpots,
        fullSpots: map.fullSpots,
      },
      data: mapJSON,
    });
  } catch (error) {
    console.error('Error in sample-map:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/map — all spots; sample spots have full data, locked spots have only position + category
router.get('/map', async (req, res) => {
  try {
    const map = await prisma.map.findFirst({
      where: { title: 'Tirana Insider' },
      include: { categories: true },
    });

    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    const allSpots = await prisma.mapSpot.findMany({ where: { mapId: map.id } });

    const spots = allSpots.map((spot) => {
      if (spot.isInSample) {
        return {
          id: spot.id,
          name: spot.name,
          description: spot.description,
          category: spot.category,
          latitude: spot.latitude,
          longitude: spot.longitude,
          localTip: spot.localTip,
          locked: false,
        };
      }
      return {
        id: spot.id,
        category: spot.category,
        latitude: spot.latitude,
        longitude: spot.longitude,
        locked: true,
      };
    });

    res.json({
      map: {
        title: map.title,
        description: map.description,
        price: map.price,
        sampleSpots: map.sampleSpots,
        fullSpots: map.fullSpots,
      },
      categories: map.categories,
      spots,
    });
  } catch (error) {
    console.error('Error in /map:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
