# Map Selling Platform - Backend

Simple email-based map marketplace with Stripe payments, reviews, and admin panel.

## Quick Start

### Prerequisites
- Node.js v18+ 
- PostgreSQL 12+
- Stripe account (free for testing)
- SendGrid account (free tier available)

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - From your Stripe dashboard
- `SENDGRID_API_KEY` - From your SendGrid dashboard
- `ADMIN_PASSWORD` - Password for admin endpoints

3. **Set up database:**
```bash
npx prisma migrate dev
```

This will create tables and seed the Tirana map with 37 spots.

4. **Start the server:**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Sample Map (No auth required)
- `POST /api/sample-request` - Request sample map via email
- `GET /api/sample-map` - Get sample map data

### Checkout & Downloads
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/download/:token` - Download full map (one-time token)

### Reviews
- `GET /api/reviews` - Get approved reviews
- `POST /api/reviews` - Submit review (requires purchase)

### Admin (Requires `adminPassword` in request)
- `GET /api/admin/purchases` - List all purchases
- `GET /api/admin/reviews` - List pending reviews for moderation
- `PATCH /api/admin/reviews/:id` - Approve/reject review
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/:id` - Update category

## Testing with cURL

### Request sample map:
```bash
curl -X POST http://localhost:5000/api/sample-request \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"John"}'
```

### Get sample map data:
```bash
curl http://localhost:5000/api/sample-map
```

### Get approved reviews:
```bash
curl http://localhost:5000/api/reviews?mapId=1
```

### Admin: List purchases:
```bash
curl http://localhost:5000/api/admin/purchases
```

## Database Schema

- **Map** - Map products (title, price, description)
- **MapSpot** - Individual spots/places on the map
- **MapCategory** - Categories (Restaurant, Bar, Coffee, etc.)
- **Purchase** - Purchase records with download tokens
- **Review** - User reviews (PENDING, APPROVED, REJECTED)

## Deployment

For GoDaddy cPanel with Node.js support:

1. Install Node.js via cPanel
2. Create a new Node.js app
3. Set environment variables in cPanel
4. Deploy code via Git or FTP
5. Use PM2 for process management

See `../README.md` for full deployment guide.

## Notes

- Download tokens are single-use and secure
- Admin endpoints use simple password authentication
- In production, use API keys instead of passwords
- Email templates can be customized in `services/email.js`
