export type Role = 'customer' | 'vendor' | 'admin' | 'delivery';

export type Category = 
  | 'Men'
  | 'Women'
  | 'Kids'
  | 'Fashion'
  | 'Footwear'
  | 'Accessories'
  | 'Shoes'
  | 'Electronics'
  | 'Home'
  | 'Kitchen'
  | 'Furniture'
  | 'Beauty'
  | 'Health'
  | 'Sports'
  | 'Books'
  | 'Mobile'
  | 'Laptop'
  | 'Groceries'
  | 'Toys'
  | 'Gift Items'
  | 'Seasonal Products';

export interface Product {
  id: string;
  name: string;
  category: Category;
  subCategory?: string;
  brand: string;
  description: string;
  images: string[];
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  
  // Pricing formula components
  vendorPrice: number;        // Price requested by vendor
  shippingCharge: number;     // Shipping cost
  companyCharge: number;      // KF Mart margin
  sellingPrice: number;       // Vendor Price + Shipping Charge + Company Charge
  mrp: number;                // Original Price for discount display
  
  rating: number;
  reviewsCount: number;
  stock: number;
  specifications: Record<string, string>;
  isFlashSale?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  discountPercentage: number;
  pincodeAvailability: string[]; // default ['229413']
  estimatedDeliveryTime?: string; // Vendor specified delivery duration (e.g. '24 Hours Express', '1-2 Days')
  availableSizes?: string[]; // e.g. ['S', 'M', 'L', 'XL', 'XXL'] for garments/fashion
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 
  | 'Ordered'
  | 'Packed'
  | 'Shipped'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Delayed'
  | 'Cancelled';

export interface TimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  appliedCoupon?: string;
  
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    pincode: string;
    street: string;
    city: string;
    state: string;
    landmark?: string;
  };
  
  status: OrderStatus;
  timeline: TimelineEvent[];
  paymentMethod: 'Razorpay' | 'COD' | 'UPI' | 'Wallet';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  utrNumber?: string;
  deliveryOTP: string;
  deliveryPartnerId?: string;
  
  createdAt: string;
  deliveredAt?: string; // ISO string when delivered
  
  // Cancellation details
  cancelledAt?: string;
  cancellationReason?: string;
  
  // 24 Hour Return & Exchange status
  returnRequested?: boolean;
  exchangeRequested?: boolean;
  returnReason?: string;
  exchangeSize?: string;
  returnExchangeStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Expired';
  
  // Vendor payout hold
  vendorPaymentReleased?: boolean;
  
  // Vendor Custom Delivery Promise & Shipment Tracking
  estimatedDeliveryTime?: string; // Vendor specified delivery promise e.g. "24 Hours Express"
  shipmentTrackingNumber?: string; // e.g. "KFM-TRK-981029"
  courierPartner?: string; // e.g. "KF Express", "Blue Dart", "Delhivery"
  currentShipmentLocation?: string; // e.g. "Lucknow Transit Hub - Out for Rae Bareli"
}

export type VendorStatus = 'Pending Approval' | 'Approved' | 'Rejected';

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  gstNumber?: string;
  panNumber?: string;
  aadhaarNumber: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolder: string;
  };
  address: string;
  companyProfile: string;
  status: VendorStatus;
  rating: number;
  joinedDate: string;
  totalSales: number;
  walletBalance: number;
  pendingEscrow: number; // Funds held until 24h return window expires
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrderValue: number;
  description: string;
  expiresAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'offer' | 'vendor' | 'system';
  timestamp: string;
  read: boolean;
  channelsSent?: ('Website' | 'SMS' | 'Email')[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface DeliveryExecutive {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleType?: 'Bike / Motorcycle' | 'Scooter' | 'E-Rickshaw' | 'Van' | 'Bicycle';
  vehicleNumber?: string;
  assignedZone?: string;
  assignedOrdersCount: number;
  completedDeliveries?: number;
  totalEarnings?: number;
  joinedDate?: string;
  status: 'Active' | 'On Duty' | 'Offline';
}
