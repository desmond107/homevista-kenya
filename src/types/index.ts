export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: 'sale' | 'rent' | 'monthly';
  category: 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
  listingType: 'buy' | 'rent' | 'sell' | 'lease';
  location: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  features: string[];
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  createdAt: string;
  userId: string;
  isApproved: boolean;
  isFeatured: boolean;
  isListerVerified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'viewer' | 'admin' | 'lister';
  phone?: string;
  company?: string;
  createdAt: string;
  isPremium: boolean;
  isVerifiedLister: boolean;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  idNumber: string;
  location: string;
  documents: {
    idDocument: string;
    profilePhoto: string;
    proofDocument: string;
    propertyCertificate: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'mpesa' | 'visa' | 'mastercard';
  amount: number;
  acceptedTerms: boolean;
  createdAt: string;
}
export interface Advert {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Realtor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  properties: number;
  isVerified: boolean;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  propertyId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  mpesaRef?: string;
  createdAt: string;
}
