import express from 'express';
import Stripe from 'stripe';
import prisma from '../db/client.js';
import { sendPurchaseReceiptEmail } from '../services/email.js';
import { generateDownloadToken, generateMapJSON } from '../utils/helpers.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, firstName, and lastName are required' });
    }

    // Get the Tirana map
    const map = await prisma.map.findFirst({
      where: { title: 'Tirana Insider' },
    });

    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: map.title,
              description: map.description,
            },
            unit_amount: map.price, // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
      customer_email: email,
      metadata: {
        email,
        firstName,
        lastName,
        mapId: map.id.toString(),
      },
    });

    res.json({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error('Error in checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/checkout-webhook (Stripe webhook)
router.post('/checkout-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Extract metadata
      const { email, firstName, lastName, mapId } = session.metadata;

      // Generate download token
      const downloadToken = generateDownloadToken();

      // Create purchase record
      const purchase = await prisma.purchase.create({
        data: {
          email,
          firstName,
          lastName,
          mapId: parseInt(mapId),
          stripePaymentId: session.payment_intent,
          amount: session.amount_total,
          status: 'completed',
          downloadToken,
        },
      });

      // Get full map spots
      const fullSpots = await prisma.mapSpot.findMany({
        where: { mapId: parseInt(mapId) },
      });

      // Generate download link (in production, this would be a secure URL)
      const downloadLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/download/${downloadToken}`;

      // Send purchase receipt email
      await sendPurchaseReceiptEmail(email, firstName, downloadLink);

      console.log(`✅ Purchase completed for ${email}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

export default router;
