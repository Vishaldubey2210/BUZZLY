'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Connection = require('./models/Connection');
const Event = require('./models/Event');
const Notification = require('./models/Notification');
const Venue = require('./models/Venue');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/buzzly';

const seedUsers = [
  { buzzName: 'Arjun Sharma', handle: 'arjun_s', email: 'arjun@buzzly.app', headline: 'Craft Beer Enthusiast & Bar Hopper 🍺', bio: 'Always chasing the next great IPA. Mumbai local, Bandra regular.', city: 'Mumbai', drinkPreferences: ['beer', 'spirit'], xp: 2450, level: 3,
    drinkJourney: [
      { title: 'Craft Beer Blogger', place: 'Self-employed', description: 'Writing about Mumbai\'s craft beer scene since 2022', isCurrent: true, startDate: new Date('2022-01-01') },
      { title: 'Bartender', place: 'The Tipsy Bear, Bandra', description: 'Weekends only. Learnt to pour the perfect pint.', startDate: new Date('2020-06-01'), endDate: new Date('2022-01-01') },
    ],
    badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }, { id: 'xp_1000', name: 'Rising Star', icon: '⭐' }],
  },
  { buzzName: 'Priya Nair', handle: 'priya_nair', email: 'priya@buzzly.app', headline: 'Wine Sommelier in Training 🍷 | Bengaluru', bio: 'Wine lover, vineyard visitor, aspiring sommelier. Sula is life.', city: 'Bengaluru', drinkPreferences: ['wine', 'cocktail'], xp: 1800, level: 2,
    drinkJourney: [{ title: 'Wine Educator', place: 'The Grape Escape, Indiranagar', description: 'Hosting weekly wine tasting sessions', isCurrent: true, startDate: new Date('2023-03-01') }],
    badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }],
  },
  { buzzName: 'Rohan Mehta', handle: 'rohan_m', email: 'rohan@buzzly.app', headline: 'Single Malt Collector | Whiskey Connoisseur 🥃', bio: 'Whiskey collector. 47 bottles and counting. Always finding the next dram.', city: 'Delhi', drinkPreferences: ['spirit', 'beer'], xp: 3200, level: 4,
    drinkJourney: [{ title: 'Whiskey Curator', place: 'The Vault, Hauz Khas', description: 'Curating rare whiskey experiences', isCurrent: true, startDate: new Date('2021-09-01') }],
    badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }, { id: 'xp_1000', name: 'Rising Star', icon: '⭐' }, { id: 'ten_posts', name: 'Buzz Starter', icon: '🌟' }],
  },
  { buzzName: 'Ananya Kapoor', handle: 'ananya_k', email: 'ananya@buzzly.app', headline: 'Mixologist in Training ✨ | Mumbai Bar Scene', bio: 'Cocktail aficionado. Shaking things up one drink at a time.', city: 'Mumbai', drinkPreferences: ['cocktail', 'wine'], xp: 980, level: 1, drinkJourney: [], badges: [] },
  { buzzName: 'Vikram Patel', handle: 'vikram_p', email: 'vikram@buzzly.app', headline: 'IPA Only Club 🍺 | Ahmedabad Craft Scene', bio: 'Rooftop sessions & craft IPAs. Ahmedabad\'s biggest craft beer advocate.', city: 'Ahmedabad', drinkPreferences: ['beer'], xp: 1450, level: 2, drinkJourney: [], badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }] },
  { buzzName: 'Zara Khan', handle: 'zara_k', email: 'zara@buzzly.app', headline: 'Sober Social | Non-Alcoholic Drinks Expert 🌿', bio: 'Proving you don\'t need alcohol to have a great time. Kombucha queen.', city: 'Mumbai', drinkPreferences: ['na'], xp: 750, level: 1, drinkJourney: [], badges: [] },
  { buzzName: 'Dev Malhotra', handle: 'dev_m', email: 'dev@buzzly.app', headline: 'Rum & Reggaeton | Goa Dreams 🏝️', bio: 'Goa-based cocktail explorer. Beach bars are my office.', city: 'Goa', drinkPreferences: ['spirit', 'cocktail'], xp: 4100, level: 5,
    drinkJourney: [
      { title: 'Head Bartender', place: 'Thalassa, Vagator', description: 'Crafting signature cocktails for beach sunsets', isCurrent: true, startDate: new Date('2021-01-01') },
      { title: 'Bar Manager', place: 'Curlies Beach Shack, Anjuna', description: 'Managed bar operations for 3 years', startDate: new Date('2018-01-01'), endDate: new Date('2021-01-01') },
    ],
    badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }, { id: 'xp_1000', name: 'Rising Star', icon: '⭐' }, { id: 'xp_5000', name: 'Buzz Legend', icon: '👑' }],
  },
  { buzzName: 'Meera Singh', handle: 'meera_s', email: 'meera@buzzly.app', headline: 'Prosecco Princess 👑 | Hyderabad Nightlife', bio: 'Hyderabad bar-hopper. Prosecco is always the answer.', city: 'Hyderabad', drinkPreferences: ['wine', 'cocktail'], xp: 2100, level: 3, drinkJourney: [], badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }] },
  { buzzName: 'Kabir Roy', handle: 'kabir_r', email: 'kabir@buzzly.app', headline: 'Single Malt Only | Kolkata Whisky Scene 🥃', bio: 'No blends. No compromises. The art of single malt appreciation.', city: 'Kolkata', drinkPreferences: ['spirit'], xp: 3800, level: 4,
    drinkJourney: [{ title: 'Whisky Brand Ambassador', place: 'Amrut Distilleries', description: 'Representing India\'s finest single malt whisky', isCurrent: true, startDate: new Date('2020-06-01') }],
    badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }, { id: 'xp_1000', name: 'Rising Star', icon: '⭐' }],
  },
  { buzzName: 'Tara Joshi', handle: 'tara_j', email: 'tara@buzzly.app', headline: 'Margarita Monday Always 🍹 | Chennai Beach Life', bio: 'Margarita evangelist. Chennai cocktail scene advocate.', city: 'Chennai', drinkPreferences: ['cocktail', 'beer'], xp: 1250, level: 2, drinkJourney: [], badges: [{ id: 'first_post', name: 'First Pour', icon: '🍺' }] },
];

const postTemplates = [
  { content: 'Just tried the new IPA from White Owl Brewery. The citrus notes are absolutely insane 🍊🍺 Anyone else been? #CraftBeer #Mumbai', category: 'beer' },
  { content: 'Rooftop at Aer tonight. The skyline never gets old. Mumbai 💛 This is why I love this city.', category: 'cocktail' },
  { content: 'Finally got my hands on a bottle of Amrut Fusion. This is world-class whisky made right here in India 🥃 Absolutely blown away.', category: 'spirit' },
  { content: 'Wine tasting at Grover Zampa Vineyards was worth every minute of the drive from Bengaluru 🍷 The Chenin Blanc was exceptional.', category: 'wine' },
  { content: 'Mocktail game strong tonight. Virgin mojito with fresh Goa limes hits completely different 🌿 Who said sober can\'t be fun?', category: 'na' },
  { content: 'Anyone been to Social lately? Their craft cocktail menu this season is absolutely 🔥 The smoked negroni is a masterpiece.', category: 'cocktail' },
  { content: 'Discovered a tiny bar in Bandra that serves 47 different gins. My life is now complete. #GinAndTonic #Mumbai', category: 'spirit' },
  { content: 'Saturday brunch + Bloody Mary = perfect Sunday reset 🍅 The one at Bastian hits different every single time.', category: 'cocktail' },
  { content: 'Biryani + Kingfisher = the original Indian combo. Fight me. 🍺🍛 #MumbaiLife', category: 'beer' },
  { content: 'Trying to recreate that Old Fashioned from The Bombay Canteen at home. Failing gloriously but it\'s a beautiful process.', category: 'spirit' },
  { content: 'Blue Tokai cold brew + good company = still the vibe at this rooftop 🌙 You don\'t need alcohol to enjoy the city nights.', category: 'na' },
  { content: 'Sula Sauvignon Blanc on a rainy Pune evening. Nature said yes. 🍷🌧️ Perfect pairing for a cozy night in.', category: 'wine' },
  { content: 'Beer Olympics champion 3 years running. The trophy is... my beer belly. Worth it. 🏆🍺 #BeerOlympics', category: 'beer' },
  { content: 'Just joined the Delhi Whisky Appreciation Club. There are gems in this city that nobody talks about. The rabbit hole is deep.', category: 'spirit' },
  { content: 'Aperol Spritz season has officially started in Goa. Beach, sunset, orange drink. Come find me. 🧡', category: 'cocktail' },
  { content: 'The craft beer revolution in Bengaluru is real. Toit, Arbor, Windmills — this city is becoming the IPA capital of India 🍺', category: 'beer' },
  { content: 'Visited 3 rooftop bars in Mumbai this weekend. The view from Asilo at St. Regis is unbeatable. How do people live near there?', category: 'cocktail' },
  { content: 'Finally tried the SMWS release we\'ve all been waiting for. Notes of dried fruit, dark chocolate, and complete joy 🥃 #Whisky', category: 'spirit' },
  { content: 'For those asking — yes, you can have an amazing night out without drinking. Kombucha craft scene in Mumbai is exploding 🌿', category: 'na' },
  { content: 'That first sip of a perfectly poured Guinness on a cold evening. Nothing in the world compares. Nothing. 🖤🍺', category: 'beer' },
];

const seedVenues = [
  { name: 'The Tipsy Bear', type: 'bar', city: 'Mumbai', address: 'Hill Road, Bandra West', description: 'Bandra\'s favourite craft beer den. 30+ taps, live music Fridays.', specialties: ['craft beer', 'IPAs', 'craft cocktails'], tags: ['live music', 'rooftop', 'happy hour'], rating: 4.5, priceRange: '₹₹', openingHours: '4 PM – 1 AM', location: { type: 'Point', coordinates: [72.8315, 19.0548] }, isFeatured: true, image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&q=80&w=800', isVerified: true },
  { name: 'Aer Rooftop', type: 'rooftop', city: 'Mumbai', address: 'Four Seasons Hotel, Worli', description: 'Mumbai\'s highest rooftop bar. Stunning skyline views, premium cocktails.', specialties: ['signature cocktails', 'fine spirits', 'champagne'], tags: ['rooftop', 'skyline view', 'premium', 'date night'], rating: 4.7, priceRange: '₹₹₹₹', openingHours: '5 PM – 1 AM', location: { type: 'Point', coordinates: [72.8361, 19.0612] }, isFeatured: true, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800', isVerified: true },
  { name: 'Hops & Barley', type: 'brewery', city: 'Mumbai', address: 'Kala Ghoda, Fort', description: 'Award-winning microbrewery in the heart of Mumbai. Farm-to-glass philosophy.', specialties: ['craft beer', 'barrel-aged ales', 'seasonal brews'], tags: ['microbrewery', 'heritage area', 'food pairing'], rating: 4.6, priceRange: '₹₹', openingHours: '12 PM – 12 AM', location: { type: 'Point', coordinates: [72.8290, 19.0465] }, image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800', isVerified: true },
  { name: 'Toit Brewpub', type: 'brewery', city: 'Bengaluru', address: '100 Feet Road, Indiranagar', description: 'Bengaluru\'s legendary craft brewery. The IPA that started it all for many.', specialties: ['craft beer', 'wheat beer', 'stout', 'food'], tags: ['brewpub', 'crowd favourite', 'live music'], rating: 4.4, priceRange: '₹₹', openingHours: '11 AM – 11 PM', location: { type: 'Point', coordinates: [77.6410, 12.9716] }, isFeatured: true, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800', isVerified: true },
  { name: 'Social Bandra', type: 'bar', city: 'Mumbai', address: 'Linking Road, Bandra', description: 'The original Social. Workspace by day, buzzing bar by night. Iconic.', specialties: ['cocktails', 'mocktails', 'craft beer', 'food'], tags: ['co-work', 'late night', 'budget friendly', 'events'], rating: 4.3, priceRange: '₹₹', openingHours: '9 AM – 1 AM', location: { type: 'Point', coordinates: [72.8379, 19.0578] }, image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=800' },
  { name: 'Thalassa', type: 'bar', city: 'Goa', address: 'Siolim Village, Vagator', description: 'Greek taverna meets Goa vibes. Cliff-top views, amazing cocktails, legendary sunsets.', specialties: ['cocktails', 'Greek wines', 'sangria'], tags: ['sunset views', 'cliffside', 'Greek food', 'instagrammable'], rating: 4.8, priceRange: '₹₹₹', openingHours: '12 PM – 11 PM', location: { type: 'Point', coordinates: [73.7516, 15.6038] }, isFeatured: true, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', isVerified: true },
];

const seedEvents = [
  { title: 'Mumbai Craft Beer Festival 2026', description: '50+ breweries, live music, street food. India\'s biggest craft beer event returns!', venue: { name: 'BKC Exhibition Ground', address: 'Bandra Kurla Complex', city: 'Mumbai' }, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), category: 'beer', isFeatured: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800' },
  { title: 'Whiskey & Jazz Night', description: 'Intimate evening pairing premium single malts with live jazz. Limited to 50 guests.', venue: { name: 'The Leela Palace', address: 'Sahar Airport Road', city: 'Mumbai' }, date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), category: 'spirit', isFeatured: true, image: 'https://images.unsplash.com/photo-1514362453360-8f94243c9996?auto=format&fit=crop&q=80&w=800' },
  { title: 'Wine & Canvas: Sula Edition', description: 'Paint, sip and connect! Guided painting session with curated Sula wines.', venue: { name: 'Studio Pepperfry', address: 'Lower Parel', city: 'Mumbai' }, date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), category: 'wine', image: 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?auto=format&fit=crop&q=80&w=800' },
  { title: 'Bengaluru Cocktail Masterclass', description: 'Learn from top bartenders. Create 3 signature cocktails. Perfect for beginners.', venue: { name: 'Toit Brewpub', address: 'Indiranagar', city: 'Bengaluru' }, date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), category: 'cocktail', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800' },
  { title: 'Sober Social: Kombucha Evening', description: 'Wellness-forward social with craft kombucha, mocktails, and zero-proof spirits.', venue: { name: 'Bombay Salad Co.', address: 'Khar West', city: 'Mumbai' }, date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), category: 'other', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800' },
];

async function seed() {
  try {
    console.log('🍺 Buzzly LinkedIn-Parity Seeder — Connecting...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected\n');

    // Clear
    const emails = seedUsers.map(u => u.email);
    await User.deleteMany({ email: { $in: emails } });
    await Venue.deleteMany({});
    await Event.deleteMany({});

    const hashedPassword = await bcrypt.hash('Buzzly@123', 12);
    const createdUsers = await User.insertMany(
      seedUsers.map(u => ({
        ...u,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.handle}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        refreshToken: null,
      }))
    );
    console.log(`✅ ${createdUsers.length} users`);

    // Clear posts/comments for seed users
    await Post.deleteMany({ author: { $in: createdUsers.map(u => u._id) } });

    const postData = postTemplates.map((tmpl, i) => ({
      content: tmpl.content,
      drinkCategory: tmpl.category,
      vibeTag: ['Lit', 'Chill', 'Classy', 'Wild', 'Cozy', 'Rooftop'][i % 6],
      author: createdUsers[i % createdUsers.length]._id,
      likes: createdUsers.filter((_, idx) => idx !== i % createdUsers.length).slice(0, Math.floor(Math.random() * 6) + 1).map(u => u._id),
      hashtags: (tmpl.content.match(/#[a-zA-Z0-9]+/g) || []).map(t => t.slice(1).toLowerCase()),
      createdAt: new Date(Date.now() - i * 2.5 * 60 * 60 * 1000),
    }));
    const createdPosts = await Post.insertMany(postData);
    console.log(`✅ ${createdPosts.length} posts`);

    // Comments
    const commentTexts = ['This is incredible! 🍻', 'Where is this? Need to visit!', 'Totally agree!', 'Can confirm, went last week 🔥', 'Adding this to my list', 'The vibes look amazing!', 'Hit me up next time!', 'Mumbai represent! 🙌', 'This is the way 🍺'];
    const commentData = [];
    for (const post of createdPosts.slice(0, 10)) {
      const n = Math.floor(Math.random() * 3) + 1;
      for (let c = 0; c < n; c++) {
        const commenter = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        commentData.push({ post: post._id, author: commenter._id, content: commentTexts[Math.floor(Math.random() * commentTexts.length)] });
      }
    }
    const comments = await Comment.insertMany(commentData);
    for (const comment of comments) await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: 1 } });
    console.log(`✅ ${comments.length} comments`);

    // Connections
    await Connection.deleteMany({ requester: { $in: createdUsers.map(u => u._id) } });
    const pairs = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9],[0,8],[1,9],[2,7]];
    const connData = pairs.map(([a, b]) => ({ requester: createdUsers[a]._id, recipient: createdUsers[b]._id, status: 'accepted' }));
    connData.push({ requester: createdUsers[3]._id, recipient: createdUsers[9]._id, status: 'pending' });
    const connections = await Connection.insertMany(connData);
    console.log(`✅ ${connections.length} connections`);

    // Follows
    await User.findByIdAndUpdate(createdUsers[0]._id, { following: [createdUsers[1]._id, createdUsers[2]._id], followers: [createdUsers[3]._id] });
    await User.findByIdAndUpdate(createdUsers[1]._id, { followers: [createdUsers[0]._id], following: [createdUsers[5]._id] });

    // Venues
    const venueData = seedVenues.map((v, i) => ({ ...v, createdBy: createdUsers[i % createdUsers.length]._id, followers: createdUsers.slice(0, Math.floor(Math.random() * 4) + 1).map(u => u._id) }));
    const createdVenues = await Venue.insertMany(venueData);
    console.log(`✅ ${createdVenues.length} venues`);

    // Events
    const eventData = seedEvents.map((e, i) => ({ ...e, createdBy: createdUsers[i % createdUsers.length]._id, attendees: createdUsers.slice(0, Math.floor(Math.random() * 5) + 2).map(u => u._id) }));
    const createdEvents = await Event.insertMany(eventData);
    console.log(`✅ ${createdEvents.length} events`);

    // Notifications
    await Notification.deleteMany({ recipient: createdUsers[0]._id });
    await Notification.insertMany([
      { recipient: createdUsers[0]._id, sender: createdUsers[1]._id, type: 'like', content: 'liked your post ❤️', referenceId: createdPosts[0]._id, isRead: false },
      { recipient: createdUsers[0]._id, sender: createdUsers[2]._id, type: 'connection_request', content: 'sent you a pour request 🍻', referenceId: connections[0]._id, isRead: false },
      { recipient: createdUsers[0]._id, sender: createdUsers[3]._id, type: 'comment', content: 'commented on your post 💬', referenceId: createdPosts[0]._id, isRead: false },
      { recipient: createdUsers[0]._id, sender: createdUsers[4]._id, type: 'follow', content: 'started following you 🍻', isRead: true },
    ]);
    console.log('✅ Notifications');

    console.log('\n🎉 Seed complete!');
    console.log('   Login: arjun@buzzly.app / Buzzly@123');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
