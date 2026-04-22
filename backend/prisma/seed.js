import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.mapSpot.deleteMany();
  await prisma.mapCategory.deleteMany();
  await prisma.map.deleteMany();

  const map = await prisma.map.create({
    data: {
      title: 'Tirana Insider',
      description: 'Hand-picked restaurants, bars, hidden gems and day trips — from people who actually live here.',
      price: 400,
      sampleSpots: 10,
      fullSpots: 37,
    },
  });

  const categories = [
    { name: 'Coffee', color: '#C8583A' },
    { name: 'Restaurant', color: '#3B6D11' },
    { name: 'Bar', color: '#185FA5' },
    { name: 'Nightlife', color: '#993556' },
    { name: 'Shopping', color: '#8B7355' },
    { name: 'Day Trip', color: '#2D5A3D' },
  ];

  for (const cat of categories) {
    await prisma.mapCategory.create({ data: { mapId: map.id, ...cat } });
  }

  const spots = [
    // ── SAMPLE SPOTS (10 free preview) ──────────────────────────────────────
    {
      name: 'Komiteti',
      description: 'A legendary raki bar that doubles as one of the best coffee spots in the city. Packed with communist-era memorabilia.',
      category: 'Coffee',
      latitude: 41.3270,
      longitude: 19.8185,
      localTip: 'Go before 10am for the byrek — it sells out every day.',
      isInSample: true,
    },
    {
      name: 'Mullixhiu',
      description: 'The best farm-to-table Albanian food in Tirana. Every ingredient is sourced from their own farm.',
      category: 'Restaurant',
      latitude: 41.3305,
      longitude: 19.8220,
      localTip: 'Book at least 2 days ahead — this place is always full.',
      isInSample: true,
    },
    {
      name: 'Era',
      description: 'Old-school Albanian cooking in a quiet neighbourhood spot. No frills, no tourists.',
      category: 'Restaurant',
      latitude: 41.3285,
      longitude: 19.8175,
      localTip: 'Ask for the off-menu lamb dish. Cash only.',
      isInSample: true,
    },
    {
      name: 'Radio Bar',
      description: 'Hidden rooftop bar tucked above Blloku with the best sunset view in the city.',
      category: 'Bar',
      latitude: 41.3265,
      longitude: 19.8285,
      localTip: 'No sign, no Google listing. You need the exact address from this map.',
      isInSample: true,
    },
    {
      name: 'Taverna Skonti',
      description: 'Traditional Albanian tavern with live çifteli music on weekends.',
      category: 'Bar',
      latitude: 41.3240,
      longitude: 19.8210,
      localTip: 'Sit inside — the acoustics are much better.',
      isInSample: true,
    },
    {
      name: 'Vitrine',
      description: 'Minimalist modern café serving the best single-origin espresso in Tirana.',
      category: 'Coffee',
      latitude: 41.3295,
      longitude: 19.8295,
      localTip: 'Get there early — the window seats fill up by 9am.',
      isInSample: true,
    },
    {
      name: 'Bloku Market',
      description: 'A mix of vintage shops and local designers tucked inside an old Blloku courtyard.',
      category: 'Shopping',
      latitude: 41.3270,
      longitude: 19.8300,
      localTip: 'Best on weekends when local designers set up pop-up stalls.',
      isInSample: true,
    },
    {
      name: 'Prë',
      description: 'Contemporary restaurant in the heart of Blloku. Modern Albanian cuisine done right.',
      category: 'Restaurant',
      latitude: 41.3280,
      longitude: 19.8290,
      localTip: 'Great for a date night. Ask for the tasting menu.',
      isInSample: true,
    },
    {
      name: 'Pazari i Ri',
      description: 'The beautifully restored New Bazaar — covered market with food stalls, spices, and craftsmen.',
      category: 'Shopping',
      latitude: 41.3310,
      longitude: 19.8230,
      localTip: 'Come Thursday morning — that\'s when the farmers bring in fresh produce.',
      isInSample: true,
    },
    {
      name: 'Hemingway',
      description: 'Iconic Blloku café-bar with a leafy terrace. The social hub of the neighbourhood for 20 years.',
      category: 'Coffee',
      latitude: 41.3268,
      longitude: 19.8215,
      localTip: 'The macchiato is famously strong. Perfect for people-watching.',
      isInSample: true,
    },

    // ── LOCKED SPOTS (27 behind paywall) ────────────────────────────────────
    {
      name: 'Oda',
      description: 'Traditional Albanian home-cooking in a beautifully decorated heritage house. Like eating at a local grandmother\'s table.',
      category: 'Restaurant',
      latitude: 41.3290,
      longitude: 19.8175,
      localTip: 'The fergese (peppers, tomatoes, and cottage cheese) is the dish to order.',
      isInSample: false,
    },
    {
      name: 'Juvenilja',
      description: 'A Tirana institution since the 1970s. Unpretentious Albanian staples at student prices.',
      category: 'Restaurant',
      latitude: 41.3320,
      longitude: 19.8235,
      localTip: 'The lamb tava has been on the menu since opening day. Don\'t skip it.',
      isInSample: false,
    },
    {
      name: 'Il Siciliano',
      description: 'The best pizza in the city, run by a Sicilian family who moved to Tirana in the 90s.',
      category: 'Restaurant',
      latitude: 41.3260,
      longitude: 19.8300,
      localTip: 'Cash only. The Norma pizza sells out by 8pm.',
      isInSample: false,
    },
    {
      name: 'Zgara e Jopit',
      description: 'No-menu grill house where the waiter tells you what\'s good today. Always packed with locals.',
      category: 'Restaurant',
      latitude: 41.3285,
      longitude: 19.8155,
      localTip: 'Point at whatever is on the grill. You cannot go wrong.',
      isInSample: false,
    },
    {
      name: 'Kapiten',
      description: 'Seafood-focused restaurant with fresh catches brought daily from Durrës port.',
      category: 'Restaurant',
      latitude: 41.3292,
      longitude: 19.8295,
      localTip: 'Go on Fridays — the fish is delivered that morning.',
      isInSample: false,
    },
    {
      name: 'Stefan Çej',
      description: 'Classic Tirana restaurant in the city\'s oldest building. Albanian cooking with a focus on offal dishes.',
      category: 'Restaurant',
      latitude: 41.3305,
      longitude: 19.8185,
      localTip: 'The paçe (lamb head soup) is a Tirana ritual on Sunday mornings.',
      isInSample: false,
    },
    {
      name: 'Post Café',
      description: 'Specialty coffee shop inside a converted post office. Great pour-overs and a rotating guest roaster.',
      category: 'Coffee',
      latitude: 41.3262,
      longitude: 19.8275,
      localTip: 'The barista changes the filter method recommendations daily — ask what\'s best.',
      isInSample: false,
    },
    {
      name: 'Café Botanica',
      description: 'Tranquil garden café with plants everywhere and a short but excellent brunch menu.',
      category: 'Coffee',
      latitude: 41.3318,
      longitude: 19.8195,
      localTip: 'Best brunch in the city on Sundays. Arrive before 11am.',
      isInSample: false,
    },
    {
      name: 'Padam',
      description: 'Third-wave coffee bar with a Parisian aesthetic. Cold brew made in-house.',
      category: 'Coffee',
      latitude: 41.3272,
      longitude: 19.8248,
      localTip: 'The cold brew is brewed for 24 hours. Worth the extra wait.',
      isInSample: false,
    },
    {
      name: 'Ozone Rooftop',
      description: 'Open-air rooftop bar on the 8th floor with 360° city views and a proper cocktail menu.',
      category: 'Bar',
      latitude: 41.3255,
      longitude: 19.8290,
      localTip: 'Thursday evenings have live jazz. Book a table — it fills up.',
      isInSample: false,
    },
    {
      name: 'Checkpoint Charlie',
      description: 'Beloved dive bar with cheap beer and walls covered in vinyl records. No frills, just vibes.',
      category: 'Bar',
      latitude: 41.3245,
      longitude: 19.8255,
      localTip: 'The owner plays DJ on weekends. Gets going after midnight.',
      isInSample: false,
    },
    {
      name: 'Garden of Rocks',
      description: 'Outdoor bar in a converted villa garden. Great for large groups on warm evenings.',
      category: 'Bar',
      latitude: 41.3270,
      longitude: 19.8250,
      localTip: 'Bring cash — the card machine breaks more often than not.',
      isInSample: false,
    },
    {
      name: 'Cave Club',
      description: 'Underground nightclub built into a Cold War bunker. The most unique venue in Albania.',
      category: 'Nightlife',
      latitude: 41.3230,
      longitude: 19.8190,
      localTip: 'Opens at midnight. Locals don\'t arrive until 1am.',
      isInSample: false,
    },
    {
      name: 'Folie',
      description: 'The city\'s premier electronic music club. Internationally booked DJs every weekend.',
      category: 'Nightlife',
      latitude: 41.3235,
      longitude: 19.8270,
      localTip: 'Check their Instagram for the weekly lineup. Dress code is enforced.',
      isInSample: false,
    },
    {
      name: 'Fusion Club',
      description: 'Multi-room club with hip-hop, house, and a live stage. Tirana\'s most eclectic nightlife spot.',
      category: 'Nightlife',
      latitude: 41.3242,
      longitude: 19.8245,
      localTip: 'The back room has the best sound system. Ask the bouncer to direct you.',
      isInSample: false,
    },
    {
      name: 'Xin City',
      description: 'All-in-one entertainment complex with clubs, bars, and a casino on the south side of the city.',
      category: 'Nightlife',
      latitude: 41.3240,
      longitude: 19.8180,
      localTip: 'The rooftop bar is separate from the club — free entry and a great view.',
      isInSample: false,
    },
    {
      name: 'Natyral & Organik',
      description: 'The best place to stock up on Albanian olive oils, rakis, and local preserves to take home.',
      category: 'Shopping',
      latitude: 41.3275,
      longitude: 19.8310,
      localTip: 'The small-batch fig raki makes the perfect gift. Ask for the unlabelled bottles.',
      isInSample: false,
    },
    {
      name: 'Tirana East Gate',
      description: 'Modern shopping mall on the east side — useful for pharmacies, international brands, and a supermarket.',
      category: 'Shopping',
      latitude: 41.3345,
      longitude: 19.8450,
      localTip: 'The Mercator supermarket inside has the best selection of local cheese and honey.',
      isInSample: false,
    },
    {
      name: 'Tirana Art Gallery',
      description: 'National gallery with a rotating collection of Albanian contemporary and socialist-realist art.',
      category: 'Shopping',
      latitude: 41.3290,
      longitude: 19.8210,
      localTip: 'Free on Sundays. The socialist-realism permanent collection is unmissable.',
      isInSample: false,
    },
    {
      name: 'Dajti Ekspres',
      description: 'Cable car up to Mount Dajti at 1,613m. Stunning views over Tirana and the Albanian Alps.',
      category: 'Day Trip',
      latitude: 41.3485,
      longitude: 19.8721,
      localTip: 'Go on a clear weekday morning. Weekend queues can be 2 hours long.',
      isInSample: false,
    },
    {
      name: 'Kruja Castle',
      description: 'Medieval castle and bazaar town 30km north. Albania\'s most important historical site — where Skanderbeg held off the Ottomans.',
      category: 'Day Trip',
      latitude: 41.5095,
      longitude: 19.7947,
      localTip: 'Haggle at the bazaar — it\'s expected. The copper craftsmen sell pieces that last a lifetime.',
      isInSample: false,
    },
    {
      name: 'Apollonia',
      description: 'Ancient Greek city ruins 110km south. Less visited than most European ruins — you\'ll often have it almost to yourself.',
      category: 'Day Trip',
      latitude: 40.7192,
      longitude: 19.4703,
      localTip: 'Pair it with a stop in Berat — the UNESCO city is just 30 minutes further.',
      isInSample: false,
    },
    {
      name: 'Lura National Park',
      description: 'Glacial lakes and old-growth forest 150km north of Tirana. Albania\'s best kept natural secret.',
      category: 'Day Trip',
      latitude: 41.7710,
      longitude: 20.2312,
      localTip: 'Only accessible by 4WD in summer. Ask your hotel to arrange a driver who knows the route.',
      isInSample: false,
    },
    {
      name: 'Château Linza',
      description: 'Hilltop winery and restaurant 20km south. Stunning views, estate wines, and a serious kitchen.',
      category: 'Day Trip',
      latitude: 41.2901,
      longitude: 19.7850,
      localTip: 'Book the Sunday lunch — it\'s a 3-hour affair with wine pairings included in the price.',
      isInSample: false,
    },
  ];

  for (const spot of spots) {
    await prisma.mapSpot.create({ data: { mapId: map.id, ...spot } });
  }

  console.log(`✅ Seed complete — ${spots.length} spots created (${spots.filter(s => s.isInSample).length} sample, ${spots.filter(s => !s.isInSample).length} locked)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
