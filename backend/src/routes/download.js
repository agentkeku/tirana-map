import express from 'express';
import prisma from '../db/client.js';
import { generateMapJSON } from '../utils/helpers.js';

const router = express.Router();

// GET /api/download/:token
router.get('/download/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find purchase by download token
    const purchase = await prisma.purchase.findUnique({
      where: { downloadToken: token },
      include: { map: true },
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Invalid or expired download link' });
    }

    // Get all spots for the map
    const spots = await prisma.mapSpot.findMany({
      where: { mapId: purchase.mapId },
    });

    // Generate map JSON
    const mapJSON = generateMapJSON(spots);

    // Update download count
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        downloadCount: { increment: 1 },
        downloadedAt: new Date(),
      },
    });

    // Send as JSON file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${purchase.map.title.replace(/\s+/g, '_')}_map.json"`
    );
    res.send(JSON.stringify(mapJSON, null, 2));
  } catch (error) {
    console.error('Error in download:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
