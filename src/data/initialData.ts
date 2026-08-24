import { Product, Vendor, Coupon, Review, DeliveryExecutive } from '../types';

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'v1',
    businessName: 'Royal Threads India',
    ownerName: 'Vikramaditya Sharma',
    phone: '+91 98765 43210',
    email: 'contact@royalthreads.in',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '1234-5678-9012',
    bankDetails: {
      accountNumber: '91802003884812',
      ifscCode: 'HDFC0000123',
      bankName: 'HDFC Bank',
      accountHolder: 'Royal Threads India'
    },
    address: 'Plot 42, Main Market, Lalgopalganj, UP',
    companyProfile: 'Manufacturers of premium cotton t-shirts, apparel, and fashion accessories.',
    status: 'Approved',
    rating: 4.9,
    joinedDate: '2025-01-15',
    totalSales: 485000,
    walletBalance: 64200,
    pendingEscrow: 18500
  },
  {
    id: 'v2',
    businessName: 'Apex Electronics Labs',
    ownerName: 'Ananya Gupta',
    phone: '+91 91234 56789',
    email: 'support@apexelectronics.com',
    panNumber: 'BHXPG9876K',
    aadhaarNumber: '9876-5432-1098',
    bankDetails: {
      accountNumber: '50100239102931',
      ifscCode: 'ICIC0000456',
      bankName: 'ICICI Bank',
      accountHolder: 'Apex Electronics Labs'
    },
    address: 'Main Bazaar Road, Lalgopalganj, UP',
    companyProfile: 'Authorized regional distributor for high-fidelity audio equipment, smartwatches, and gadgets.',
    status: 'Approved',
    rating: 4.9,
    joinedDate: '2025-02-01',
    totalSales: 1240000,
    walletBalance: 125000,
    pendingEscrow: 45000
  },
  {
    id: 'v3',
    businessName: 'Lalgopalganj Handbag & Accessories',
    ownerName: 'Ramesh Soni',
    phone: '+91 99887 76655',
    email: 'info@lalgopalganjstore.in',
    panNumber: 'SONIR5544P',
    aadhaarNumber: '4567-8901-2345',
    bankDetails: {
      accountNumber: '0012100098231',
      ifscCode: 'SBIN0001122',
      bankName: 'State Bank of India',
      accountHolder: 'Ramesh Soni'
    },
    address: 'Station Road, Lalgopalganj, UP',
    companyProfile: 'Handcrafted leather bags, footwear, and lifestyle essentials.',
    status: 'Approved',
    rating: 4.8,
    joinedDate: '2025-03-10',
    totalSales: 210000,
    walletBalance: 32000,
    pendingEscrow: 8400
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Green Cotton Crew T-Shirt (25% OFF)
  {
    id: 'p1',
    name: 'Classic Forest Green Premium Cotton Crew T-Shirt',
    category: 'Fashion',
    subCategory: 'Men Fashion',
    brand: 'KF Fashion',
    description: '100% combed organic cotton classic fit crew neck T-shirt. Soft, breathable, and pre-shrunk for maximum comfort.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v1',
    vendorName: 'Royal Threads India',
    vendorRating: 4.9,
    vendorPrice: 300,
    shippingCharge: 20,
    companyCharge: 79,
    sellingPrice: 399,
    mrp: 529,
    rating: 4.8,
    reviewsCount: 184,
    stock: 50,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      'Fabric': '100% Premium Cotton',
      'Fit': 'Regular Fit',
      'Available Sizes': 'S, M, L, XL, XXL',
      'Care': 'Machine Wash Cold'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 25,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 1b. Premium Oversized Graphic Hoodie
  {
    id: 'p1b',
    name: 'Urban Oversized Heavyweight Cotton Fleece Hoodie',
    category: 'Fashion',
    subCategory: 'Men Fashion',
    brand: 'Royal Threads',
    description: '350 GSM premium cotton fleece oversized hoodie with kangaroo pocket, ribbed cuffs, and double-layered hood.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v1',
    vendorName: 'Royal Threads India',
    vendorRating: 4.9,
    vendorPrice: 650,
    shippingCharge: 20,
    companyCharge: 229,
    sellingPrice: 899,
    mrp: 1499,
    rating: 4.9,
    reviewsCount: 92,
    stock: 45,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      'Fabric': '100% Cotton Fleece (350 GSM)',
      'Fit': 'Relaxed Oversized Fit',
      'Available Sizes': 'S, M, L, XL, XXL',
      'Care': 'Gentle Machine Wash'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 40,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 1c. Traditional Handcrafted Anarkali Kurti
  {
    id: 'p1c',
    name: 'Ethnic Rayon Printed Anarkali Kurti & Pant Set',
    category: 'Fashion',
    subCategory: 'Women Fashion',
    brand: 'Royal Threads',
    description: 'Elegant festive printed Anarkali kurti with matching cigarette pants and chiffon dupatta.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v1',
    vendorName: 'Royal Threads India',
    vendorRating: 4.9,
    vendorPrice: 800,
    shippingCharge: 20,
    companyCharge: 379,
    sellingPrice: 1199,
    mrp: 1999,
    rating: 4.8,
    reviewsCount: 124,
    stock: 35,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      'Fabric': '100% Pure Rayon',
      'Pattern': 'Floral Gold Block Print',
      'Available Sizes': 'S, M, L, XL, XXL',
      'Care': 'Hand Wash Separately'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 40,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 1d. Slim Fit Stretch Denim Jeans
  {
    id: 'p1d',
    name: 'Men Premium Dark Indigo Stretch Denim Jeans',
    category: 'Fashion',
    subCategory: 'Men Fashion',
    brand: 'KF Fashion',
    description: 'High-stretch, breathable cotton-elastane denim tailored with reinforced rivets and stylish fade wash.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v1',
    vendorName: 'Royal Threads India',
    vendorRating: 4.9,
    vendorPrice: 700,
    shippingCharge: 20,
    companyCharge: 279,
    sellingPrice: 999,
    mrp: 1799,
    rating: 4.7,
    reviewsCount: 88,
    stock: 40,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      'Fabric': '98% Cotton, 2% Elastane',
      'Fit': 'Slim Tapered Fit',
      'Available Sizes': 'S, M, L, XL, XXL',
      'Waist': 'Mid-Rise'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 44,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 2. Black Smartwatch (20% OFF)
  {
    id: 'p2',
    name: 'Apex Pro Black Dial Luxury Wristwatch',
    category: 'Electronics',
    subCategory: 'Wearables',
    brand: 'Apex Tech',
    description: 'Premium black dial stainless steel casing with minimalist hour markers and Japanese quartz movement.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v2',
    vendorName: 'Apex Electronics Labs',
    vendorRating: 4.9,
    vendorPrice: 1500,
    shippingCharge: 20,
    companyCharge: 479,
    sellingPrice: 1999,
    mrp: 2499,
    rating: 4.9,
    reviewsCount: 312,
    stock: 35,
    specifications: {
      'Display': 'Scratch-resistant Sapphire Glass',
      'Strap': 'Black Premium Leather',
      'Water Resistance': '50m Waterproof'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 20,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 3. Pink Leather Handbag (30% OFF)
  {
    id: 'p3',
    name: 'Luxury Rose Pink Leather Top-Handle Tote Handbag',
    category: 'Accessories',
    subCategory: 'Bags',
    brand: 'Luxe Craft',
    description: 'Crafted from premium water-resistant vegan leather. Features spacious main compartment, gold metal zippers, and detachable shoulder strap.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v3',
    vendorName: 'Lalgopalganj Handbag & Accessories',
    vendorRating: 4.8,
    vendorPrice: 900,
    shippingCharge: 20,
    companyCharge: 379,
    sellingPrice: 1299,
    mrp: 1855,
    rating: 4.8,
    reviewsCount: 145,
    stock: 20,
    specifications: {
      'Material': 'Vegan Premium Leather',
      'Closure': 'Gold Plated Zipper',
      'Pockets': '3 Inner Dividers + 1 Back Zipper'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 30,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 4. Black Wireless Headphones (15% OFF)
  {
    id: 'p4',
    name: 'Apex Sonic Wireless Noise Cancelling Over-Ear Headphones',
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'Apex Sonic',
    description: 'Ultra-clear deep bass, 40mm dynamic drivers, soft memory foam cushion earcups, 40-hour continuous playback.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v2',
    vendorName: 'Apex Electronics Labs',
    vendorRating: 4.9,
    vendorPrice: 1200,
    shippingCharge: 20,
    companyCharge: 479,
    sellingPrice: 1699,
    mrp: 1999,
    rating: 4.9,
    reviewsCount: 280,
    stock: 40,
    specifications: {
      'Driver': '40mm Titanium Drivers',
      'Playtime': '40 Hours Non-stop',
      'Mic': 'Dual Noise-Isolating Mic'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 15,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 5. Blue Sports Running Shoes (25% OFF)
  {
    id: 'p5',
    name: 'Pro-Glide Royal Blue Lightweight Mesh Sports Shoes',
    category: 'Shoes',
    subCategory: 'Footwear',
    brand: 'AeroMotion',
    description: 'Ergonomic air-cushioned running sneakers with high-traction rubber sole and ultra-breathable knit upper mesh.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v3',
    vendorName: 'Lalgopalganj Handbag & Accessories',
    vendorRating: 4.8,
    vendorPrice: 800,
    shippingCharge: 20,
    companyCharge: 379,
    sellingPrice: 1199,
    mrp: 1599,
    rating: 4.7,
    reviewsCount: 98,
    stock: 30,
    specifications: {
      'Sole': 'Anti-skid EVA Rubber',
      'Upper': 'Jacquard Knit Breathable Fabric',
      'Weight': '220g Per Shoe'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 25,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  },
  // 6. Green Stainless Water Bottle (20% OFF)
  {
    id: 'p6',
    name: 'Hydro-Flask 1000ml Matte Forest Green Insulated Bottle',
    category: 'Kitchen',
    subCategory: 'Home',
    brand: 'EcoHydro',
    description: 'Double-wall vacuum insulated 18/8 stainless steel bottle. Keeps drinks cold for 24 hours or hot for 12 hours. Sweat-free leakproof cap.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop'
    ],
    vendorId: 'v1',
    vendorName: 'Royal Threads India',
    vendorRating: 4.9,
    vendorPrice: 350,
    shippingCharge: 20,
    companyCharge: 129,
    sellingPrice: 499,
    mrp: 624,
    rating: 4.8,
    reviewsCount: 162,
    stock: 60,
    specifications: {
      'Capacity': '1000 ml',
      'Material': 'BPA-Free 18/8 Food Grade Stainless Steel',
      'Insulation': 'Vacuum Hot & Cold 24 Hours'
    },
    isFlashSale: true,
    isBestSeller: true,
    discountPercentage: 20,
    pincodeAvailability: ['229413', '230201'],
    estimatedDeliveryTime: '24 Hours Express'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'KFMART10',
    discountType: 'percentage',
    value: 10,
    minOrderValue: 499,
    description: 'Get extra 10% instant discount on orders above ₹499.',
    expiresAt: '2026-12-31'
  },
  {
    code: 'FIRST10',
    discountType: 'percentage',
    value: 15,
    minOrderValue: 299,
    description: 'Welcome Offer! 15% off on your first order at KF Mart Retail.',
    expiresAt: '2026-12-31'
  }
];

export const MOCK_DELIVERY_EXECUTIVES: DeliveryExecutive[] = [
  { 
    id: 'del-1', 
    name: 'Rajesh Kumar (Express Agent)', 
    phone: '+91 98111 22233', 
    email: 'rajesh.delivery@kfmart.in',
    vehicleType: 'Bike / Motorcycle',
    vehicleNumber: 'UP-33-AB-1234',
    assignedZone: 'Pincode 229413 (Lalgopalganj Hub)',
    assignedOrdersCount: 2, 
    completedDeliveries: 428,
    totalEarnings: 21400,
    joinedDate: '2025-01-10',
    status: 'Active' 
  },
  { 
    id: 'del-2', 
    name: 'Amit Verma (Lalgopalganj Rider)', 
    phone: '+91 98222 33344', 
    email: 'amit.rider@kfmart.in',
    vehicleType: 'Scooter',
    vehicleNumber: 'UP-33-CD-5678',
    assignedZone: 'Pincode 229413 (Station Road)',
    assignedOrdersCount: 1, 
    completedDeliveries: 312,
    totalEarnings: 15600,
    joinedDate: '2025-02-14',
    status: 'On Duty' 
  },
  { 
    id: 'del-3', 
    name: 'Mohd. Imran (Kunda Express Hub)', 
    phone: '+91 98333 44455', 
    email: 'imran.delivery@kfmart.in',
    vehicleType: 'Bike / Motorcycle',
    vehicleNumber: 'UP-72-EF-9012',
    assignedZone: 'Pincode 230201 (Kunda)',
    assignedOrdersCount: 0, 
    completedDeliveries: 289,
    totalEarnings: 14450,
    joinedDate: '2025-03-01',
    status: 'Active' 
  },
  { 
    id: 'del-4', 
    name: 'Suresh Patel (Electric Cargo)', 
    phone: '+91 98444 55566', 
    email: 'suresh.cargo@kfmart.in',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'UP-33-ER-4411',
    assignedZone: 'Pincode 229413 (Central Market)',
    assignedOrdersCount: 1, 
    completedDeliveries: 516,
    totalEarnings: 25800,
    joinedDate: '2024-11-20',
    status: 'On Duty' 
  },
  { 
    id: 'del-5', 
    name: 'Vikas Tiwari (Fast Route Rider)', 
    phone: '+91 98555 66677', 
    email: 'vikas.rider@kfmart.in',
    vehicleType: 'Bike / Motorcycle',
    vehicleNumber: 'UP-33-VK-7788',
    assignedZone: 'Pincode 229413 (Highway Sector)',
    assignedOrdersCount: 0, 
    completedDeliveries: 195,
    totalEarnings: 9750,
    joinedDate: '2025-04-05',
    status: 'Active' 
  }
];

// Helper to generate up to 100 Delivery Partner Profiles
export const generate100DeliveryPartners = (): DeliveryExecutive[] => {
  const partners: DeliveryExecutive[] = [...MOCK_DELIVERY_EXECUTIVES];
  const firstNames = ['Anil', 'Deepak', 'Manoj', 'Pooja', 'Sunil', 'Ajay', 'Rohit', 'Sanjay', 'Pawan', 'Kunal', 'Manish', 'Sachin', 'Dharmendra', 'Arun', 'Vinod', 'Pramod', 'Gaurav', 'Ravi', 'Santosh', 'Shyam'];
  const lastNames = ['Yadav', 'Singh', 'Shukla', 'Pandey', 'Gupta', 'Verma', 'Maurya', 'Khan', 'Chaurasia', 'Mishra', 'Tripathi', 'Srivastava', 'Dubey', 'Pal'];
  const vehicles: ('Bike / Motorcycle' | 'Scooter' | 'E-Rickshaw' | 'Van' | 'Bicycle')[] = ['Bike / Motorcycle', 'Scooter', 'Bike / Motorcycle', 'E-Rickshaw', 'Van'];
  const zones = ['Pincode 229413 (Lalgopalganj Central)', 'Pincode 229413 (Main Market)', 'Pincode 230201 (Kunda Sector)', 'Pincode 229413 (Station Road)', 'Pincode 229413 (Highway North)'];

  for (let i = partners.length + 1; i <= 100; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const phoneSuffix = (10000 + i * 87).toString().padStart(5, '0');
    const plateNum = (1000 + i * 19).toString();
    const zone = zones[i % zones.length];
    const vehicle = vehicles[i % vehicles.length];
    const completed = 50 + (i * 7) % 350;

    partners.push({
      id: `del-${i}`,
      name: `${fn} ${ln} (Rider #${i})`,
      phone: `+91 98${phoneSuffix.slice(0, 3)} ${phoneSuffix.slice(3, 5)}${i % 100}`,
      email: `rider${i}@kfmart.in`,
      vehicleType: vehicle,
      vehicleNumber: `UP-33-KFM-${plateNum}`,
      assignedZone: zone,
      assignedOrdersCount: i % 7 === 0 ? 1 : 0,
      completedDeliveries: completed,
      totalEarnings: completed * 50,
      joinedDate: '2025-03-15',
      status: i % 4 === 0 ? 'On Duty' : i % 5 === 0 ? 'Offline' : 'Active'
    });
  }

  return partners;
};

// Helper to generate up to 300 Vendor Hubs
export const generate300Vendors = (): Vendor[] => {
  const vendorsList: Vendor[] = [...INITIAL_VENDORS];
  const categoriesList = ['Apparel & Fashion', 'Electronics & Gadgets', 'Footwear & Bags', 'Grocery & Spices', 'Home & Kitchen', 'Beauty & Cosmetics', 'Handicraft & Wood', 'Sports & Fitness', 'Books & Stationery', 'Mobiles & Audio'];
  const cityLocations = ['Main Bazaar, Lalgopalganj', 'Station Road, Lalgopalganj', 'Cloth Market, Pincode 229413', 'Galla Mandi, Lalgopalganj', 'Kunda Road Hub', 'Central Chowk, UP', 'Highway Plaza, 229413'];
  const businessTypes = ['Handlooms', 'Fashion Hub', 'Enterprises', 'Traders', 'Crafts', 'Super Store', 'Textiles', 'Electronics', 'Footwear', 'Jewels & Boutique', 'Organic Foods', 'Mart Retail'];

  const owners = ['Rajesh', 'Suresh', 'Alok', 'Neeraj', 'Priya', 'Mohan', 'Dinesh', 'Anita', 'Sunita', 'Kamlesh', 'Harish', 'Gopal', 'Kailash', 'Meena', 'Ritu', 'Pradeep', 'Satish', 'Jagdish'];
  const surnames = ['Gupta', 'Sharma', 'Verma', 'Mishra', 'Maurya', 'Singh', 'Tripathi', 'Yadav', 'Srivastava', 'Chaurasia', 'Soni', 'Agrawal'];

  for (let i = vendorsList.length + 1; i <= 300; i++) {
    const ownerFirst = owners[i % owners.length];
    const ownerLast = surnames[(i * 2) % surnames.length];
    const bType = businessTypes[i % businessTypes.length];
    const cat = categoriesList[i % categoriesList.length];
    const loc = cityLocations[i % cityLocations.length];
    const randSales = 45000 + (i * 1230) % 650000;
    const wallet = Math.round(randSales * 0.15);
    const escrow = Math.round(randSales * 0.04);
    const rating = Number((4.5 + ((i % 5) * 0.1)).toFixed(1));

    vendorsList.push({
      id: `v-${i}`,
      businessName: `${ownerFirst}'s ${bType} #${i}`,
      ownerName: `${ownerFirst} ${ownerLast}`,
      phone: `+91 91${(1000 + (i * 29) % 9000).toString()} ${(1000 + (i * 73) % 9000).toString()}`,
      email: `vendor${i}@kfmart.in`,
      gstNumber: i % 3 === 0 ? `09AAACV${(1000 + i).toString()}F1Z${i % 9}` : '',
      panNumber: `KFM${ownerFirst.slice(0, 2).toUpperCase()}${1000 + i}P`,
      aadhaarNumber: `${1000 + (i * 13) % 9000}-${2000 + (i * 17) % 9000}-${3000 + (i * 19) % 9000}`,
      bankDetails: {
        accountNumber: `9180${(10000000 + i * 4921).toString()}`,
        ifscCode: i % 2 === 0 ? 'SBIN0002294' : 'HDFC0002294',
        bankName: i % 2 === 0 ? 'State Bank of India' : 'HDFC Bank',
        accountHolder: `${ownerFirst} ${ownerLast}`
      },
      address: `${loc}, Pincode 229413, Uttar Pradesh`,
      companyProfile: `Verified supplier of ${cat} for retail buyers across Lalgopalganj and regional hubs.`,
      status: 'Approved',
      rating: rating > 5 ? 5.0 : rating,
      joinedDate: `2025-0${1 + (i % 8)}-${10 + (i % 18)}`,
      totalSales: randSales,
      walletBalance: wallet,
      pendingEscrow: escrow
    });
  }

  return vendorsList;
};

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'r1',
    userName: 'Aakash Tripathi',
    rating: 5,
    comment: 'Lalgopalganj me 24 hour me delivery mil gayi! Shirt quality bohot acchi h.',
    date: '2026-07-30',
    verifiedPurchase: true
  },
  {
    id: 'r2',
    userName: 'Sonia Maurya',
    rating: 5,
    comment: 'Handbag exact photo jaisa hai. Easy return and ₹20 delivery fee is super reasonable.',
    date: '2026-07-28',
    verifiedPurchase: true
  }
];
