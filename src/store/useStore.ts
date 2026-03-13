import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Property, User, Advert, Realtor, PaymentRecord, VerificationRequest, Category } from '../types';
import { mockProperties, mockUsers, mockAdverts, mockRealtors, mockCategories } from '../data/mockData';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Properties
  properties: Property[];
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  approveProperty: (id: string) => void;

  // Adverts
  adverts: Advert[];
  addAdvert: (advert: Advert) => void;
  updateAdvert: (id: string, advert: Partial<Advert>) => void;
  deleteAdvert: (id: string) => void;

  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Realtors
  realtors: Realtor[];
  addRealtor: (realtor: Realtor) => void;
  updateRealtor: (id: string, realtor: Partial<Realtor>) => void;
  deleteRealtor: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Payments
  payments: PaymentRecord[];
  addPayment: (payment: PaymentRecord) => void;
  paidPropertyIds: string[];
  addPaidProperty: (propertyId: string) => void;

  // Verifications
  verificationRequests: VerificationRequest[];
  addVerificationRequest: (request: VerificationRequest) => void;
  updateVerificationRequest: (id: string, status: VerificationRequest['status']) => void;
  approveVerifiedLister: (userId: string) => void;

  // Currency Settings
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;

  // Filters
  filters: {
    category: string;
    listingType: string;
    location: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: string;
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;
  resetFilters: () => void;

  // Currency
  currency: 'KES' | 'USD';
  setCurrency: (currency: 'KES' | 'USD') => void;
}

const initialFilters = {
  category: 'all',
  listingType: 'all',
  location: 'all',
  minPrice: 0,
  maxPrice: 500000000,
  bedrooms: 'all',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Properties
      properties: mockProperties,
      addProperty: (property) =>
        set((state) => ({ properties: [...state.properties, property] })),
      updateProperty: (id, property) =>
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? { ...p, ...property } : p
          ),
        })),
      deleteProperty: (id) =>
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
        })),
      approveProperty: (id) =>
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? { ...p, isApproved: true } : p
          ),
        })),

      // Adverts
      adverts: mockAdverts,
      addAdvert: (advert) =>
        set((state) => ({ adverts: [...state.adverts, advert] })),
      updateAdvert: (id, advert) =>
        set((state) => ({
          adverts: state.adverts.map((a) =>
            a.id === id ? { ...a, ...advert } : a
          ),
        })),
      deleteAdvert: (id) =>
        set((state) => ({
          adverts: state.adverts.filter((a) => a.id !== id),
        })),

      // Users
      users: mockUsers,
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
          user: state.user?.id === id ? { ...state.user, ...user } : state.user,
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      // Realtors
      realtors: mockRealtors,
      addRealtor: (realtor) =>
        set((state) => ({ realtors: [...state.realtors, realtor] })),
      updateRealtor: (id, realtor) =>
        set((state) => ({
          realtors: state.realtors.map((r) =>
            r.id === id ? { ...r, ...realtor } : r
          ),
        })),
      deleteRealtor: (id) =>
        set((state) => ({
          realtors: state.realtors.filter((r) => r.id !== id),
        })),

      // Categories
      categories: mockCategories,
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      // Payments
      payments: [],
      addPayment: (payment) =>
        set((state) => ({ payments: [...state.payments, payment] })),
      paidPropertyIds: [],
      addPaidProperty: (propertyId) =>
        set((state) => ({
          paidPropertyIds: [...state.paidPropertyIds, propertyId],
        })),

      // Verifications
      verificationRequests: [],
      addVerificationRequest: (request) =>
        set((state) => ({
          verificationRequests: [...state.verificationRequests, request],
        })),
      updateVerificationRequest: (id, status) =>
        set((state) => ({
          verificationRequests: state.verificationRequests.map((request) =>
            request.id === id ? { ...request, status } : request
          ),
        })),
      approveVerifiedLister: (userId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, isVerifiedLister: true } : user
          ),
        })),

      // Filters
      filters: initialFilters,
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () => set({ filters: initialFilters }),

      // Currency
      currency: 'KES',
      setCurrency: (currency) => set({ currency }),

      // Exchange Rate
      exchangeRate: 130,
      setExchangeRate: (rate) => set({ exchangeRate: rate }),
    }),
    {
      name: 'nyumbani-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        paidPropertyIds: state.paidPropertyIds,
        properties: state.properties,
        verificationRequests: state.verificationRequests,
        categories: state.categories,
        currency: state.currency,
        exchangeRate: state.exchangeRate,
      }),
    }
  )
);
