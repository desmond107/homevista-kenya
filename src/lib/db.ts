import { supabase } from './supabase';
import type {
  Property,
  User,
  Advert,
  Realtor,
  Category,
  PaymentRecord,
  VerificationRequest,
} from '../types';

// ─── Row → TypeScript mappers ─────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function mapProperty(r: Row): Property {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    price: r.price,
    priceType: r.price_type,
    category: r.category,
    listingType: r.listing_type,
    location: r.location,
    address: r.address,
    bedrooms: r.bedrooms ?? undefined,
    bathrooms: r.bathrooms ?? undefined,
    area: r.area,
    images: r.images ?? [],
    features: r.features ?? [],
    ownerName: r.owner_name,
    ownerPhone: r.owner_phone,
    ownerEmail: r.owner_email,
    createdAt: r.created_at,
    userId: r.user_id,
    isApproved: r.is_approved,
    isFeatured: r.is_featured,
    isListerVerified: r.is_lister_verified,
  };
}

function toPropertyRow(d: Partial<Property>): Row {
  const r: Row = {};
  if (d.title !== undefined) r.title = d.title;
  if (d.description !== undefined) r.description = d.description;
  if (d.price !== undefined) r.price = d.price;
  if (d.priceType !== undefined) r.price_type = d.priceType;
  if (d.category !== undefined) r.category = d.category;
  if (d.listingType !== undefined) r.listing_type = d.listingType;
  if (d.location !== undefined) r.location = d.location;
  if (d.address !== undefined) r.address = d.address;
  if (d.bedrooms !== undefined) r.bedrooms = d.bedrooms;
  if (d.bathrooms !== undefined) r.bathrooms = d.bathrooms;
  if (d.area !== undefined) r.area = d.area;
  if (d.images !== undefined) r.images = d.images;
  if (d.features !== undefined) r.features = d.features;
  if (d.ownerName !== undefined) r.owner_name = d.ownerName;
  if (d.ownerPhone !== undefined) r.owner_phone = d.ownerPhone;
  if (d.ownerEmail !== undefined) r.owner_email = d.ownerEmail;
  if (d.userId !== undefined) r.user_id = d.userId;
  if (d.isApproved !== undefined) r.is_approved = d.isApproved;
  if (d.isFeatured !== undefined) r.is_featured = d.isFeatured;
  if (d.isListerVerified !== undefined) r.is_lister_verified = d.isListerVerified;
  return r;
}

function mapProfile(r: Row, email = ''): User {
  return {
    id: r.id,
    name: r.name,
    email: r.email ?? email,
    avatar: r.avatar,
    role: r.role,
    phone: r.phone ?? undefined,
    company: r.company ?? undefined,
    createdAt: r.created_at,
    isPremium: r.is_premium,
    isVerifiedLister: r.is_verified_lister,
  };
}

function mapAdvert(r: Row): Advert {
  return {
    id: r.id,
    title: r.title,
    imageUrl: r.image_url,
    linkUrl: r.link_url,
    isActive: r.is_active,
    createdAt: r.created_at,
  };
}

function mapRealtor(r: Row): Realtor {
  return {
    id: r.id,
    name: r.name,
    company: r.company,
    email: r.email,
    phone: r.phone,
    avatar: r.avatar,
    properties: r.properties,
    isVerified: r.is_verified,
  };
}

function mapCategory(r: Row): Category {
  return { id: r.id, name: r.name, description: r.description, icon: r.icon };
}

function mapPayment(r: Row): PaymentRecord {
  return {
    id: r.id,
    userId: r.user_id,
    propertyId: r.property_id,
    amount: r.amount,
    status: r.status,
    mpesaRef: r.mpesa_ref ?? undefined,
    createdAt: r.created_at,
  };
}

function mapVerification(r: Row): VerificationRequest {
  return {
    id: r.id,
    userId: r.user_id,
    fullName: r.full_name,
    idNumber: r.id_number,
    location: r.location,
    documents: {
      idDocument: r.id_document,
      profilePhoto: r.profile_photo,
      proofDocument: r.proof_document,
      propertyCertificate: r.property_certificate,
    },
    status: r.status,
    paymentMethod: r.payment_method,
    amount: r.amount,
    acceptedTerms: r.accepted_terms,
    createdAt: r.created_at,
  };
}

// ─── Properties ───────────────────────────────────────────────

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapProperty);
}

export async function createProperty(property: Property): Promise<Property> {
  const row = toPropertyRow(property);
  const { data, error } = await supabase
    .from('properties')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return mapProperty(data);
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update(toPropertyRow(updates))
    .eq('id', id);
  if (error) throw error;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

export async function approveProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update({ is_approved: true })
    .eq('id', id);
  if (error) throw error;
}

// ─── Adverts ──────────────────────────────────────────────────

export async function fetchAdverts(): Promise<Advert[]> {
  const { data, error } = await supabase
    .from('adverts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapAdvert);
}

export async function createAdvert(advert: Advert): Promise<Advert> {
  const { data, error } = await supabase
    .from('adverts')
    .insert({
      title: advert.title,
      image_url: advert.imageUrl,
      link_url: advert.linkUrl,
      is_active: advert.isActive,
    })
    .select()
    .single();
  if (error) throw error;
  return mapAdvert(data);
}

export async function deleteAdvert(id: string): Promise<void> {
  const { error } = await supabase.from('adverts').delete().eq('id', id);
  if (error) throw error;
}

// ─── Profiles ─────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<User | null> {
  const [{ data: profile, error }, { data: { user: authUser } }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.auth.getUser(),
  ]);
  if (error || !profile) return null;
  return mapProfile(profile, authUser?.email ?? '');
}

export async function updateProfile(userId: string, updates: Partial<User>): Promise<void> {
  const row: Row = {};
  if (updates.name !== undefined) row.name = updates.name;
  if (updates.avatar !== undefined) row.avatar = updates.avatar;
  if (updates.role !== undefined) row.role = updates.role;
  if (updates.phone !== undefined) row.phone = updates.phone;
  if (updates.company !== undefined) row.company = updates.company;
  if (updates.isPremium !== undefined) row.is_premium = updates.isPremium;
  if (updates.isVerifiedLister !== undefined) row.is_verified_lister = updates.isVerifiedLister;
  const { error } = await supabase.from('profiles').update(row).eq('id', userId);
  if (error) throw error;
}

export async function fetchAllProfiles(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) => mapProfile(p));
}

// ─── Realtors ─────────────────────────────────────────────────

export async function fetchRealtors(): Promise<Realtor[]> {
  const { data, error } = await supabase
    .from('realtors')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRealtor);
}

// ─── Categories ───────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

// ─── Payments ─────────────────────────────────────────────────

export async function createPayment(payment: PaymentRecord): Promise<PaymentRecord> {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: payment.userId,
      property_id: payment.propertyId,
      amount: payment.amount,
      status: payment.status,
      mpesa_ref: payment.mpesaRef,
    })
    .select()
    .single();
  if (error) throw error;
  return mapPayment(data);
}

export async function fetchPaidPropertyIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('property_id')
    .eq('user_id', userId)
    .eq('status', 'completed');
  if (error) throw error;
  return (data ?? []).map((p) => p.property_id as string);
}

// ─── Verification Requests ────────────────────────────────────

export async function createVerificationRequest(
  req: VerificationRequest
): Promise<VerificationRequest> {
  const { data, error } = await supabase
    .from('verification_requests')
    .insert({
      user_id: req.userId,
      full_name: req.fullName,
      id_number: req.idNumber,
      location: req.location,
      id_document: req.documents.idDocument,
      profile_photo: req.documents.profilePhoto,
      proof_document: req.documents.proofDocument,
      property_certificate: req.documents.propertyCertificate,
      status: req.status,
      payment_method: req.paymentMethod,
      amount: req.amount,
      accepted_terms: req.acceptedTerms,
    })
    .select()
    .single();
  if (error) throw error;
  return mapVerification(data);
}

export async function fetchVerificationRequests(): Promise<VerificationRequest[]> {
  const { data, error } = await supabase
    .from('verification_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapVerification);
}

export async function updateVerificationStatus(
  id: string,
  status: VerificationRequest['status']
): Promise<void> {
  const { error } = await supabase
    .from('verification_requests')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}
