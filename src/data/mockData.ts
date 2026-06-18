import { Product, User, Order, ServiceBooking, Dispute, Review, AppNotification } from '../types';
import { getProductImage } from '../utils/productImages';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-monstera',
    name: 'Monstera Deliciosa (Swiss Cheese Plant)',
    category: 'Plants',
    subCategory: 'Indoor',
    price: 35,
    stock: 18,
    description: 'A popular indoor plant known for its dramatic, heart-shaped leaves with unique fenestrations. It is relatively easy to care for and brings an instant tropical vibe to any living room.',
    careInstructions: {
      light: 'Bright indirect sunlight. Avoid direct scorching sun.',
      water: 'Water once a week or when the top 2 inches of soil feel dry.',
      difficulty: 'Easy',
      placement: 'Living room, bedroom corners, or office spaces.'
    },
    // Updated image for Monstera
    image: getProductImage('prod-monstera', 'Monstera Deliciosa (Swiss Cheese Plant)', 'Plants'),
    sellerId: 'nursery-1',
    sellerName: 'Green Leaves Oasis',
    rating: 4.8,
    reviewsCount: 32
  },
  {
    id: 'prod-snake',
    name: 'Sansevieria Trifasciata (Snake Plant)',
    category: 'Plants',
    subCategory: 'Indoor',
    price: 24,
    stock: 25,
    description: 'An incredibly robust plant that is perfect for beginners. It features stiff, vertical leaves resembling swords and is highly effective at purifying indoor air.',
    careInstructions: {
      light: 'Can tolerate low light, but thrives in indirect medium-to-bright light.',
      water: 'Extremely drought-tolerant. Water once every 2-3 weeks only.',
      difficulty: 'Easy',
      placement: 'Any room, including low-light corners or offices.'
    },
    // Updated image for Snake Plant
    image: getProductImage('prod-snake', 'Sansevieria Trifasciata (Snake Plant)', 'Plants'),
    sellerId: 'nursery-1',
    sellerName: 'Green Leaves Oasis',
    rating: 4.9,
    reviewsCount: 48
  },
  {
    id: 'prod-peace-lily',
    name: 'Spathiphyllum (Peace Lily)',
    category: 'Plants',
    subCategory: 'Flowering',
    price: 28,
    stock: 12,
    description: 'Elegant dark green leaves crowned by stunning white flag-like spathes. Excellent for home decoration, peace lilies droop visually to tell you exactly when they need water.',
    careInstructions: {
      light: 'Partial shade or filtered indirect light. Sensitive to direct sun.',
      water: 'Water thoroughly when soil is dry, or when leaves begin to flag.',
      difficulty: 'Moderate',
      placement: 'Warm rooms, bathrooms with windows, or shaded tabletops.'
    },
    // Updated image for Peace Lily
    image: getProductImage('prod-peace-lily', 'Spathiphyllum (Peace Lily)', 'Plants'),
    sellerId: 'nursery-2',
    sellerName: 'Urbano Blooms',
    rating: 4.6,
    reviewsCount: 19
  },
  {
    id: 'prod-orchid',
    name: 'Phalaenopsis Moth Orchid',
    category: 'Plants',
    subCategory: 'Flowering',
    price: 42,
    stock: 8,
    description: 'An exquisite flowering orchid with long cascades of vibrant blossoms. It is a stunning center-piece that can bloom for several months under correct care.',
    careInstructions: {
      light: 'Bright, indirect eastern or northern window light.',
      water: 'Water once every 7-10 days, letting the roots dry slightly between finger touches.',
      difficulty: 'Challenging',
      placement: 'Dining room centerpieces, window sills, or display shelves.'
    },
    // Updated image for Orchid
    image: getProductImage('prod-orchid', 'Phalaenopsis Moth Orchid', 'Plants'),
    sellerId: 'nursery-2',
    sellerName: 'Urbano Blooms',
    rating: 4.5,
    reviewsCount: 14
  },
  {
    id: 'prod-areca',
    name: 'Dypsis Lutescens (Areca Palm)',
    category: 'Plants',
    subCategory: 'Outdoor',
    price: 49,
    stock: 10,
    description: 'A magnificent feathery-leafed palm that adds a lush architectural presence to patios, gardens, or bright entryways. Acts as a natural humidifier.',
    careInstructions: {
      light: 'Bright filtered light. Can tolerate some direct morning sun.',
      water: 'Keep the soil lightly moist, but never let roots sit in standing water.',
      difficulty: 'Moderate',
      placement: 'Patios, bright entryways, large living room corners.'
    },
    // Updated image for Areca Palm
    image: getProductImage('prod-areca', 'Dypsis Lutescens (Areca Palm)', 'Plants'),
    sellerId: 'nursery-1',
    sellerName: 'Green Leaves Oasis',
    rating: 4.7,
    reviewsCount: 21
  },
  {
    id: 'prod-tomato-seeds',
    name: 'Heirloom Beefsteak Tomato Seeds',
    category: 'Seeds',
    subCategory: 'Organic',
    price: 4.99,
    stock: 100,
    description: 'High-germination heirloom tomato seeds. Yields massive, juicy, full-flavored tomatoes perfect for slicing, salads, and home cooking.',
    careInstructions: {
      light: 'Full direct sun, minimum 6-8 hours daily.',
      water: 'Water deeply and regularly at the base, keeping soil consistently moist.',
      difficulty: 'Easy',
      placement: 'Outdoor kitchen gardens, raised beds, or large vegetable planters.'
    },
    // Updated image for Tomato Seeds (Showing plant/fruit)
    image: getProductImage('prod-tomato-seeds', 'Heirloom Beefsteak Tomato Seeds', 'Seeds'),
    sellerId: 'nursery-2',
    sellerName: 'Urbano Blooms',
    rating: 4.9,
    reviewsCount: 56
  },
  {
    id: 'prod-lavender-seeds',
    name: 'French Lavender Seeds (Premium Organic)',
    category: 'Seeds',
    subCategory: 'Outdoor',
    price: 6.5,
    stock: 75,
    description: 'Aromatic French lavender seeds. Plants grow into beautiful purple stems with relaxing natural scents that attract bees and butterflies.',
    careInstructions: {
      light: 'Requires absolute full sun and dry conditions to germinate successfully.',
      water: 'Sparse watering. Prefers loose, sandy, well-draining dry soils.',
      difficulty: 'Moderate',
      placement: 'Garden borders, rocky pathways, sunny patio window beds.'
    },
    // Updated image for Lavender Seeds (Showing plants)
    image: getProductImage('prod-lavender-seeds', 'French Lavender Seeds (Premium Organic)', 'Seeds'),
    sellerId: 'nursery-1',
    sellerName: 'Green Leaves Oasis',
    rating: 4.4,
    reviewsCount: 29
  },
  {
    id: 'prod-ceramic-pot',
    name: 'Nordic Pastel Ceramic Pot',
    category: 'Pots',
    subCategory: 'Accessories',
    price: 19.99,
    stock: 40,
    description: 'A direct-crafted minimalistic ceramic planter finished with a soft matte pastel varnish. Includes single central drainage hole and dynamic drip tray.',
    careInstructions: {
      light: 'Weatherproof. Suitable for interior countertops or open porches.',
      water: 'Wipe down with a damp cotton cloth to preserve the premium glaze.',
      difficulty: 'Easy',
      placement: 'Decorative shelves, side tables, and office desks.'
    },
    // Updated image for Ceramic Pot
    image: getProductImage('prod-ceramic-pot', 'Nordic Pastel Ceramic Pot', 'Pots'),
    sellerId: 'nursery-2',
    sellerName: 'Urbano Blooms',
    rating: 4.8,
    reviewsCount: 37
  },
  {
    id: 'prod-ergonomic-trowel',
    name: 'Cast-Aluminum Digging Trowel',
    category: 'Tools',
    subCategory: 'Hand Tools',
    price: 14.5,
    stock: 30,
    description: 'Heavy duty, rust-resistant cast aluminum handle trowel. Ergonomic rubber grip handle decreases wrist fatigue and enables easier weed-digging.',
    careInstructions: {
      light: 'Store in dry toolbox away from constant coastal dampness.',
      water: 'Rinse with clean water after use and wipe completely dry before storing.',
      difficulty: 'Easy',
      placement: 'Gardening shed, tool bag, or backyard hangar.'
    },
    // Updated image for Digging Trowel
    image: getProductImage('prod-ergonomic-trowel', 'Cast-Aluminum Digging Trowel', 'Tools'),
    sellerId: 'nursery-1',
    sellerName: 'Green Leaves Oasis',
    rating: 4.7,
    reviewsCount: 22
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    password: 'green123',
    role: 'customer',
    phone: '+1 (555) 349-2041',
    address: '452 Elmwood Avenue, Apartment 3B, New York, NY',
    joinedDate: '2025-10-12',
    // Updated avatar for Sarah (Friendly Female)
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  } as User,
  {
    id: 'nursery-1',
    name: 'Alex Rivera',
    email: 'alex@greenleaves.com',
    password: 'green123',
    role: 'nursery',
    phone: '+1 (555) 892-0943',
    address: '89 Nursery Road, Long Island, NY',
    joinedDate: '2025-02-15',
    // Updated avatar for Alex (Male Nursery Owner)
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    companyName: 'Green Leaves Oasis',
    verified: true,
    balance: 540.00
  } as User,
  {
    id: 'nursery-2',
    name: 'Priya Sharma',
    email: 'priya@urbanoblooms.com',
    password: 'green123',
    role: 'nursery',
    phone: '+1 (555) 124-9042',
    address: '210 Greenhouses Boulevard, Brooklyn, NY',
    joinedDate: '2025-05-18',
    // Updated avatar for Priya (Female Nursery Owner)
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    companyName: 'Urbano Blooms',
    verified: false, // Pending verification initially to show Admin Approval!
    balance: 185.50
  } as User,
  {
    id: 'gardener-1',
    name: 'Robert Miller',
    email: 'robert.miller@example.com',
    password: 'green123',
    role: 'gardener',
    phone: '+1 (555) 438-9901',
    address: 'Brooklyn Heights, NY',
    joinedDate: '2025-01-20',
    // Updated avatar for Robert (Experienced Male Gardener)
    avatar: 'https://images.unsplash.com/photo-1570114094297-b2e04e43e742?w=150&auto=format&fit=crop&q=80',
    companyName: 'Robert’s Master Gardening Services',
    verified: true,
    balance: 320.00,
    services: [
      { id: 'serv-r-1', name: 'Home Gardening & Sorting', pricePerHour: 40, description: 'General backyard flowerbed weeding, mulching, and planting setup.' },
      { id: 'serv-r-2', name: 'Lawn Maintenance & Edges', pricePerHour: 35, description: 'Precision lawn mowing, hedge trimming, and edge maintenance.' },
      { id: 'serv-r-3', name: 'Plant Care & Pruning', pricePerHour: 45, description: 'Selective pruning of delicate roses and custom botanical nutrition.' }
    ]
  } as User,
  {
    id: 'gardener-2',
    name: 'Elena Rostova',
    email: 'elena.g@example.com',
    password: 'green123',
    role: 'gardener',
    phone: '+1 (555) 765-8832',
    address: 'Astoria, Queens, NY',
    joinedDate: '2025-03-01',
    // Updated avatar for Elena (Freelance Female Gardener)
    avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&auto=format&fit=crop&q=80',
    companyName: 'Lush Greenery & Lawn Design',
    verified: false, // Pending verification initially to show Admin Approval!
    balance: 0.00,
    services: [
      { id: 'serv-e-1', name: 'Premium Organic Lawn Reseeding', pricePerHour: 35, description: 'Full organic lawn diagnostic, aerating, and premium seed disbursement.' },
      { id: 'serv-e-2', name: 'Shrub Shaving & Pruning', pricePerHour: 38, description: 'Aesthetic pruning of decorative hedges and garden layouts.' }
    ]
  } as User,
  {
    id: 'gardener-3',
    name: 'Thomas Wu',
    email: 'thomas.wu@example.com',
    password: 'green123',
    role: 'gardener',
    phone: '+1 (555) 234-5678',
    address: 'Manhattan Core, NY',
    joinedDate: '2025-04-14',
    // Updated avatar for Thomas (Modern Male Gardener)
    avatar: 'https://images.unsplash.com/photo-1520155707862-5b32817388d6?w=150&auto=format&fit=crop&q=80',
    companyName: 'Eco-Lawn Specialists',
    verified: true,
    balance: 150.00,
    services: [
      { id: 'serv-t-1', name: 'Landscape Design Consultation', pricePerHour: 45, description: 'Bespoke design for home terrace, pathways planning and hardscape integration.' },
      { id: 'serv-t-2', name: 'Backyard Weed Extirpation', pricePerHour: 40, description: 'Removal of deep-seated weeds and placement of natural bark mulch filters.' }
    ]
  } as User,
  {
    id: 'user-admin',
    name: 'Marcus Vance',
    email: 'admin@greennest.com',
    password: 'green123',
    role: 'admin',
    phone: '+1 (555) 100-2000',
    address: 'GreenNest HQ, New York, NY',
    joinedDate: '2025-01-01',
    // Updated avatar for Admin (Corporate Male)
    avatar: 'https://images.unsplash.com/photo-1519085360754-a8118171f87c?w=150&auto=format&fit=crop&q=80'
  } as User
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    customerId: 'user-cust-1',
    customerName: 'Sarah Jenkins',
    items: [
      {
        productId: 'prod-monstera',
        productName: 'Monstera Deliciosa (Swiss Cheese Plant)',
        price: 35,
        quantity: 1,
        // MatchUpdated image link for data consistency
        image: getProductImage('prod-monstera', 'Monstera Deliciosa (Swiss Cheese Plant)', 'Plants')
      },
      {
        productId: 'prod-ceramic-pot',
        productName: 'Nordic Pastel Ceramic Pot',
        price: 19.99,
        quantity: 2,
        // MatchUpdated image link for data consistency
        image: getProductImage('prod-ceramic-pot', 'Nordic Pastel Ceramic Pot', 'Pots')
      }
    ],
    totalAmount: 74.98,
    status: 'Pending',
    shippingAddress: '452 Elmwood Avenue, Apartment 3B, New York, NY',
    phone: '+1 (555) 349-2041',
    orderDate: '2026-05-21',
    sellerId: 'nursery-1'
  },
  {
    id: 'ord-1002',
    customerId: 'user-cust-1',
    customerName: 'Sarah Jenkins',
    items: [
      {
        productId: 'prod-snake',
        productName: 'Sansevieria Trifasciata (Snake Plant)',
        price: 24,
        quantity: 1,
        // MatchUpdated image link for data consistency
        image: getProductImage('prod-snake', 'Sansevieria Trifasciata (Snake Plant)', 'Plants')
      }
    ],
    totalAmount: 24.00,
    status: 'Delivered',
    shippingAddress: '452 Elmwood Avenue, NY',
    phone: '+1 (555) 349-2041',
    orderDate: '2026-05-15',
    sellerId: 'nursery-1'
  }
];

export const INITIAL_BOOKINGS: ServiceBooking[] = [
  {
    id: 'bk-5001',
    customerId: 'user-cust-1',
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 349-2041',
    customerAddress: '452 Elmwood Avenue, Apartment 3B, New York, NY',
    gardenerId: 'gardener-1',
    gardenerName: 'Robert Miller',
    serviceType: 'Home Gardening',
    date: '2026-05-26',
    timeSlot: '09:00 AM - 12:00 PM',
    status: 'Pending',
    notes: 'Need weeding in the backyard flower beds and re-potting of 4 heavy indoor plants.',
    price: 120.00 // $40/hr * 3 hrs
  },
  {
    id: 'bk-5002',
    customerId: 'user-cust-1',
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 349-2041',
    customerAddress: '452 Elmwood Avenue, NY',
    gardenerId: 'gardener-3',
    gardenerName: 'Thomas Wu',
    serviceType: 'Lawn Maintenance',
    date: '2026-05-18',
    timeSlot: '02:00 PM - 05:00 PM',
    status: 'Completed',
    notes: 'Standard lawn mowing and edges trimming.',
    price: 150.00
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp-3001',
    referenceId: 'ord-1001',
    referenceType: 'Order',
    customerName: 'Sarah Jenkins',
    vendorName: 'Green Leaves Oasis',
    subject: 'Delayed shipment coordination',
    description: 'The order has been pending for 2 days now, and I would like to verify when it will be dispatched as the weather is hot and I am worried about the plants.',
    status: 'Open',
    date: '2026-05-23'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    entityId: 'prod-monstera',
    customerName: 'Alice Green',
    rating: 5,
    comment: 'Arrived in perfect, lush condition! The soil was still moist, and it had zero broken leaves. Exceeded my expectations.',
    date: '2026-04-18'
  },
  {
    id: 'rev-2',
    entityId: 'prod-monstera',
    customerName: 'Dave Cooper',
    rating: 4,
    comment: 'Beautiful plant, quite large. It took about 4 days to adjust to my bedroom light but it is thriving now.',
    date: '2026-05-02'
  },
  {
    id: 'rev-3',
    entityId: 'gardener-1',
    customerName: 'Sarah Jenkins',
    rating: 5,
    comment: 'Robert is an exceptional gardener! He pruned our backyard roses perfectly and gave us great plant advice.',
    date: '2025-04-29'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  // Admin notifications
  {
    id: 'notif-adm-1',
    role: 'admin',
    title: 'New Dispute Filed',
    message: 'Sarah Jenkins filed a dispute regarding Delayed shipment on order #ord-1001.',
    type: 'dispute',
    read: false,
    date: '2026-05-23'
  },
  {
    id: 'notif-adm-2',
    role: 'admin',
    title: 'Awaiting Business Verification',
    message: 'Nursery "Urbano Blooms" (Priya Sharma) registered their catalog license and is awaiting verification.',
    type: 'verify',
    read: false,
    date: '2026-05-22'
  },
  {
    id: 'notif-adm-3',
    role: 'admin',
    title: 'Awaiting Gardener Accreditation',
    message: 'Elena Rostova registered as freelance Gardener and is awaiting license verification.',
    type: 'verify',
    read: false,
    date: '2026-05-21'
  },

  // Customer notifications (targeted for user-cust-1)
  {
    id: 'notif-cust-1',
    userId: 'user-cust-1',
    role: 'customer',
    title: 'Gardening Session Completed!',
    message: 'Thomas Wu has marked your Lawn Maintenance session (bk-5002) as completed. Balance earned updated.',
    type: 'booking',
    read: false,
    date: '2026-05-18'
  },
  {
    id: 'notif-cust-2',
    userId: 'user-cust-1',
    role: 'customer',
    title: 'Order Dispatched!',
    message: 'Your parcel of plants from "Green Leaves Oasis" has been shipped! Check tracking.',
    type: 'order',
    read: true,
    date: '2026-05-15'
  },
  {
    id: 'notif-cust-3',
    role: 'customer',
    title: 'Eco-Nursery Spring Discount',
    message: 'GreenNest live discount! Get 10% off on all organic flower seeds through May.',
    type: 'info',
    read: false,
    date: '2026-05-20'
  },

  // Nursery/Gardener vendor notifications
  {
    id: 'notif-vend-1',
    userId: 'nursery-1',
    role: 'nursery',
    title: 'New Customer Order!',
    message: 'You have received order #ord-1001 from customer Sarah Jenkins. Ready for dispatch.',
    type: 'order',
    read: false,
    date: '2026-05-23'
  },
  {
    id: 'notif-vend-2',
    userId: 'gardener-1',
    role: 'gardener',
    title: 'Scheduling Booking Request',
    message: 'Sarah Jenkins sent a new Home Gardening & Sorting booking request for May 28.',
    type: 'booking',
    read: false,
    date: '2026-05-22'
  },
  {
    id: 'notif-vend-3',
    userId: 'nursery-2',
    role: 'nursery',
    title: 'Pending Verify Check',
    message: 'Admin is currently auditing Urbano Blooms LLC registration documents.',
    type: 'verify',
    read: true,
    date: '2026-05-22'
  }
];