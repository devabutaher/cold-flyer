/**
 * TypeScript type definitions for the ColdFlyer project
 */

// Base entity type
export interface BaseEntity {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product types
export interface Product extends BaseEntity {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  productType?: string;
  description?: string;
  warranty?: string;
  tag?: string;
  onSale?: boolean;
  features?: string[];
  inBox?: string[];
  images?: ProductImage[];
  specs?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
}

export interface ProductImage {
  url: string;
  preview?: string;
  file?: File;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Order types
export interface OrderItem {
  product: string;
  quantity: number;
  name: string;
  price: number;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
}

// Service types
export interface Service extends BaseEntity {
  name: string;
  slug: string;
  category: string;
  serviceType: string;
  description?: string;
  priceType?: string;
  basePrice: number;
  includes?: string;
  exclusions?: string;
  requirements?: string;
  qualifications?: string;
  imageUrl?: string;
}

// Auth types
export interface User {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin";
  photoURL?: string;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
  };
  message?: string;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  productRef: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantity: number;
}

// API response helpers
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}