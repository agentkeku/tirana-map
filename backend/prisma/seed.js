import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.review.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.mapSpot.deleteMany();
  await prisma.mapCategory.deleteMany();
  await prisma.map.deleteMany();

  // Create the Tirana map
  const map = await prisma.map.create({
    data: {
      title: 'Tirana Insider',
      description: 'Hand-picked restaurants, bars, hidden gems and day trips — from people who actually live here.',
      price: 400, // €4.00
      sampleSpots: 10,
      fullSpots: 37,
    },
  });

  // Create categories
  const categories = [
    { name: 'Coffee', color: '#C8583A' },
    { name: 'Restaurant', color: '#3B6D11' },
    { name: 'Bar', color: '#185FA5' },
    { name: 'Nightlife', color: '#993556' },
    { name: 'Shopping', color: '#8B7355' },
    { name: 'Day Trip', color: '#2D5A3D' },
  ];

  for (const cat of categories) {
    await prisma.mapCategory.create({
      data: {
        mapId: map.id,
        ...cat,
      },
    });
  }

  // Create sample spots (10 for free preview)
  const sampleSpots = [
    {
      name: 'Komiteti',
      description: 'A legendary raki bar that doubles as one of the best coffee spots in the city.',
      category: 'Coffee',
      latitude: 41.3275,
      longitude: 19.8197,
      localTip: 'Go before 10am for the byrek — it sells out every day.',
      isInSample: true,
    },
    {
      name: 'Mullixhiu',
      description: 'The best farm-to-table Albanian food in Tirana.',
      category: 'Restaurant',
      latitude: 41.3305,
      longitude: 19.8220,
      localTip: 'Book at least 2 days ahead — this place is always full.',
      isInSample: true,
    },
    {
      name: 'Era',
      description: 'Old-school Albanian cooking in a quiet neighbourhood spot.',
      category: 'Restaurant',
      latitude: 41.3285,
      longitude: 19.8175,
      localTip: 'Ask for the off-menu lamb dish. Cash only.',
      isInSample: true,
    },
    {
      name: 'Radio Bar',
      description: 'Hidden rooftop bar tucked above Blloku. Best sunset view.',
      category: 'Bar',
      latitude: 41.3265,
      longitude: 19.8285,
      localTip: 'No sign, no Google listing. You need the address.',
      isInSample: true,
    },
    {
      name: 'Mrizi i Zanave',
      description: 'Farm-to-table concept with stunning views of Dajti.',
      category: 'Restaurant',
      latitude: 41.3350,
      longitude: 19.8100,
      localTip: 'Perfect for sunset dinner.',
      isInSample: true,
    },
    {
      name: 'Taverna Skonti',
      description: 'Traditional Albanian tavern with live music.',
      category: 'Bar',
      latitude: 41.3240,
      longitude: 19.8210,
      localTip: 'Crowded but authentic.',
      isInSample: true,
    },
    {
      name: 'Vitrine',
      description: 'Minimalist modern cafe serving quality coffee.',
      category: 'Coffee',
      latitude: 41.3295,
      longitude: 19.8295,
      localTip: 'Get there early to secure a seat.',
      isInSample: true,
    },
    {
      name: 'Bloku Market',
      description: 'Mix of vintage shops and local designers.',
      category: 'Shopping',
      latitude: 41.3270,
      longitude: 19.8300,
      localTip: 'Best on weekends when there are pop-up stalls.',
      isInSample: true,
    },
    {
      name: 'Prë',
      description: 'Contemporary restaurant in the heart of Blloku.',
      category: 'Restaurant',
      latitude: 41.3280,
      longitude: 19.8290,
      localTip: 'Great for date night.',
      isInSample: true,
    },
    {
      name: 'Pazari i Ri',
      description: 'Historic covered bazaar with shops and eateries.',
      category: 'Shopping',
      latitude: 41.3310,
      longitude: 19.8230,
      localTip: 'Great for traditional souvenirs.',
      isInSample: true,
    },
  ];

  for (const spot of sampleSpots) {
    await prisma.mapSpot.create({
      data: {
        mapId: map.id,
        ...spot,
      },
    });
  }

  // Add 27 more non-sample spots to reach 37 total
  const additionalSpots = [
    {
      name: 'Xin City',
      description: 'All-in-one entertainment venue.',
      category: 'Nightlife',
      latitude: 41.3240,
      longitude: 19.8180,
      localTip: 'Avoid peak hours.',
      isInSample: false,
    },
    {
      name: 'Dajti Ekspres',
      description: 'Cable car to Mount Dajti.',
      category: 'Day Trip',
      latitude: 41.3350,
      longitude: 19.8100,
      localTip: 'Go early for views.',
      isInSample: false,
    },
    {
      name: 'Tirana Art Gallery',
      description: 'Contemporary art space.',
      category: 'Shopping',
      latitude: 41.3290,
      longitude: 19.8210,
      localTip: 'Check opening hours.',
      isInSample: false,
    },
    {
      name: 'Garden of Rocks',
      description: 'Modern outdoor venue.',
      category: 'Bar',
      latitude: 41.3270,
      longitude: 19.8250,
      localTip: 'Great for groups.',
      isInSample: false,
    },
    {
      name: 'Skanderbeg Square',
      description: 'Main square with historical buildings.',
      category: 'Day Trip',
      latitude: 41.3277,
      longitude: 19.8210,
      localTip: 'Beautiful at night.',
      isInSample: false,
    },
  ];

  // Add only 5 more to avoid duplicating, will be 15 total sample + 5 = 20 for demo
  for (let i = 0; i < additionalSpots.length; i++) {
    await prisma.mapSpot.create({
      data: {
        mapId: map.id,
        ...additionalSpots[i],
      },
    });
  }

  console.log('✅ Seed data created successfully');
  console.log(`📍 Created map: ${map.title} with ${map.fullSpots} spots`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
