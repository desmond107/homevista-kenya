import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { Property, User, Advert, Realtor, PaymentRecord, VerificationRequest, Category } from '../types';
import { mockProperties, mockUsers, mockAdverts, mockRealtors, mockCategories } from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import * as db from '../lib/db';

interface AppState {
  // Loading
  isLoading: boolean;

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
  setPaidPropertyIds: (ids: string[]) => void;

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

  // Data initialization
  initialize: () => Promise<void>;
  loadUserData: (userId: string) => Promise<void>;
  loadAdminData: () => Promise<void>;
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
    (set, get) => ({
      isLoading: false,

      // ── Auth ──────────────────────────────────────────────
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, paidPropertyIds: [] }),

      // ── Properties ────────────────────────────────────────
      properties: [],
      addProperty: (property) => {
        set((state) => ({ properties: [property, ...state.properties] }));
        if (!isSupabaseConfigured) return;
        db.createProperty(property)
          .then((saved) => {
            set((state) => ({
              properties: state.properties.map((p) =>
                p.id === property.id ? saved : p
              ),
            }));
          })
          .catch((err) => {
            console.error('addProperty failed:', err);
            toast.error('Failed to save property. Please try again.');
            set((state) => ({
              properties: state.properties.filter((p) => p.id !== property.id),
            }));
          });
      },
      updateProperty: (id, updates) => {
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
        if (!isSupabaseConfigured) return;
        db.updateProperty(id, updates).catch((err) => {
          console.error('updateProperty failed:', err);
          toast.error('Failed to update property.');
        });
      },
      deleteProperty: (id) => {
        const snapshot = get().properties;
        set((state) => ({ properties: state.properties.filter((p) => p.id !== id) }));
        if (!isSupabaseConfigured) return;
        db.deleteProperty(id).catch((err) => {
          console.error('deleteProperty failed:', err);
          toast.error('Failed to delete property.');
          set({ properties: snapshot });
        });
      },
      approveProperty: (id) => {
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? { ...p, isApproved: true } : p
          ),
        }));
        if (!isSupabaseConfigured) return;
        db.approveProperty(id).catch((err) => {
          console.error('approveProperty failed:', err);
          toast.error('Failed to approve property.');
        });
      },

      // ── Adverts ───────────────────────────────────────────
      adverts: [],
      addAdvert: (advert) => {
        set((state) => ({ adverts: [advert, ...state.adverts] }));
        if (!isSupabaseConfigured) return;
        db.createAdvert(advert)
          .then((saved) => {
            set((state) => ({
              adverts: state.adverts.map((a) => (a.id === advert.id ? saved : a)),
            }));
          })
          .catch((err) => {
            console.error('addAdvert failed:', err);
            toast.error('Failed to save advert.');
            set((state) => ({
              adverts: state.adverts.filter((a) => a.id !== advert.id),
            }));
          });
      },
      updateAdvert: (id, advert) =>
        set((state) => ({
          adverts: state.adverts.map((a) => (a.id === id ? { ...a, ...advert } : a)),
        })),
      deleteAdvert: (id) => {
        const snapshot = get().adverts;
        set((state) => ({ adverts: state.adverts.filter((a) => a.id !== id) }));
        if (!isSupabaseConfigured) return;
        db.deleteAdvert(id).catch((err) => {
          console.error('deleteAdvert failed:', err);
          toast.error('Failed to delete advert.');
          set({ adverts: snapshot });
        });
      },

      // ── Users ─────────────────────────────────────────────
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
          user: state.user?.id === id ? { ...state.user, ...updates } : state.user,
        })),
      deleteUser: (id) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== id) })),

      // ── Realtors ──────────────────────────────────────────
      realtors: [],
      addRealtor: (realtor) =>
        set((state) => ({ realtors: [...state.realtors, realtor] })),
      updateRealtor: (id, realtor) =>
        set((state) => ({
          realtors: state.realtors.map((r) =>
            r.id === id ? { ...r, ...realtor } : r
          ),
        })),
      deleteRealtor: (id) =>
        set((state) => ({ realtors: state.realtors.filter((r) => r.id !== id) })),

      // ── Categories ────────────────────────────────────────
      categories: [],
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),

      // ── Payments ──────────────────────────────────────────
      payments: [],
      addPayment: (payment) => {
        set((state) => ({ payments: [...state.payments, payment] }));
        if (!isSupabaseConfigured) return;
        db.createPayment(payment).catch((err) => {
          console.error('addPayment failed:', err);
        });
      },
      paidPropertyIds: [],
      addPaidProperty: (propertyId) =>
        set((state) => ({
          paidPropertyIds: [...state.paidPropertyIds, propertyId],
        })),
      setPaidPropertyIds: (ids) => set({ paidPropertyIds: ids }),

      // ── Verifications ─────────────────────────────────────
      verificationRequests: [],
      addVerificationRequest: (request) => {
        set((state) => ({
          verificationRequests: [...state.verificationRequests, request],
        }));
        if (!isSupabaseConfigured) return;
        db.createVerificationRequest(request).catch((err) => {
          console.error('addVerificationRequest failed:', err);
        });
      },
      updateVerificationRequest: (id, status) => {
        set((state) => ({
          verificationRequests: state.verificationRequests.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }));
        if (!isSupabaseConfigured) return;
        db.updateVerificationStatus(id, status).catch((err) => {
          console.error('updateVerificationRequest failed:', err);
        });
      },
      approveVerifiedLister: (userId) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, isVerifiedLister: true } : u
          ),
        }));
        if (!isSupabaseConfigured) return;
        db.updateProfile(userId, { isVerifiedLister: true }).catch((err) => {
          console.error('approveVerifiedLister failed:', err);
        });
      },

      // ── Filters ───────────────────────────────────────────
      filters: initialFilters,
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () => set({ filters: initialFilters }),

      // ── Currency ──────────────────────────────────────────
      currency: 'KES',
      setCurrency: (currency) => set({ currency }),
      exchangeRate: 130,
      setExchangeRate: (rate) => set({ exchangeRate: rate }),

      // ── Data initialization ───────────────────────────────
      initialize: async () => {
        if (!isSupabaseConfigured) {
          set({
            properties: mockProperties,
            adverts: mockAdverts,
            realtors: mockRealtors,
            categories: mockCategories,
            users: mockUsers,
          });
          return;
        }

        set({ isLoading: true });
        try {
          const [properties, adverts, realtors, categories] = await Promise.all([
            db.fetchProperties(),
            db.fetchAdverts(),
            db.fetchRealtors(),
            db.fetchCategories(),
          ]);
          set({ properties, adverts, realtors, categories });
        } catch (err) {
          console.error('initialize failed:', err);
          // Graceful degradation to mock data on network failure
          set({
            properties: mockProperties,
            adverts: mockAdverts,
            realtors: mockRealtors,
            categories: mockCategories,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      loadUserData: async (userId: string) => {
        if (!isSupabaseConfigured) return;
        try {
          const paidIds = await db.fetchPaidPropertyIds(userId);
          set({ paidPropertyIds: paidIds });
        } catch (err) {
          console.error('loadUserData failed:', err);
        }
      },

      loadAdminData: async () => {
        if (!isSupabaseConfigured) {
          set({ users: mockUsers });
          return;
        }
        try {
          const [users, verificationRequests] = await Promise.all([
            db.fetchAllProfiles(),
            db.fetchVerificationRequests(),
          ]);
          set({ users, verificationRequests });
        } catch (err) {
          console.error('loadAdminData failed:', err);
        }
      },
    }),
    {
      name: 'homevista-prefs',
      // Only persist local preferences — all server data comes from Supabase
      partialize: (state) => ({
        filters: state.filters,
        currency: state.currency,
        exchangeRate: state.exchangeRate,
        // Cache paid IDs locally for instant UI response; refreshed on login
        paidPropertyIds: state.paidPropertyIds,
      }),
    }
  )
);
