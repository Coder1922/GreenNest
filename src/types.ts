/**
 * Types & Interfaces for the GreenNest Online Nursery & Gardening platform
 */

export type UserRole = 'customer' | 'nursery' | 'gardener' | 'admin';

export interface GardenerService {
  id: string;
  name: string;
  pricePerHour: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  joinedDate: string;
  avatar: string;
  companyName?: string; // For nursery/gardener
  verified?: boolean;   // For nursery/gardener
  balance?: number;     // For earnings
  services?: GardenerService[]; // For gardeners custom service pricing
}

export interface CareInstructions {
  light: string;
  water: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  placement: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Plants' | 'Seeds' | 'Pots' | 'Tools';
  subCategory: 'Indoor' | 'Outdoor' | 'Flowering' | 'Accessories' | 'Organic' | 'Hand Tools';
  price: number;
  stock: number;
  description: string;
  careInstructions: CareInstructions;
  image: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  phone: string;
  orderDate: string;
  sellerId: string; // The nursery ID
}

export interface ServiceBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  gardenerId: string;
  gardenerName: string;
  serviceType: 'Home Gardening' | 'Lawn Maintenance' | 'Plant Care & Pruning';
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Rejected';
  notes: string;
  price: number;
}

export interface Dispute {
  id: string;
  referenceId: string; // Order ID or Booking ID
  referenceType: 'Order' | 'Booking';
  customerName: string;
  vendorName: string;
  subject: string;
  description: string;
  status: 'Open' | 'Resolved';
  date: string;
  resolutionNotes?: string;
}

export interface Review {
  id: string;
  entityId: string; // Product ID or Gardener ID
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppNotification {
  id: string;
  userId?: string; // Optional target user ID
  role?: UserRole; // Optional target role
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert' | 'order' | 'booking' | 'verify' | 'dispute';
  read: boolean;
  date: string;
}
