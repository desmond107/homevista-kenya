-- ============================================================
-- HomeVista Kenya — Property Seed Data
-- Run AFTER creating your admin account in Supabase Auth.
-- Replace 'YOUR_ADMIN_UUID' with your actual admin user UUID
-- (find it in Supabase → Authentication → Users).
-- ============================================================

-- First promote your user to admin:
UPDATE public.profiles SET role = 'admin' WHERE id = '43206640-1e1b-4466-92a0-38866cc02606';

INSERT INTO public.properties
  (title, description, price, price_type, category, listing_type, location, address,
   bedrooms, bathrooms, area, images, features, owner_name, owner_phone, owner_email,
   user_id, is_approved, is_featured, is_lister_verified)
VALUES
  (
    'Luxurious 4 Bedroom Villa in Karen',
    'Stunning villa with modern finishes, spacious rooms, and a beautiful garden.',
    85000000, 'sale', 'villa', 'buy', 'Karen, Nairobi', '123 Karen Road, Nairobi',
    4, 5, 450,
    ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    ARRAY['Swimming Pool','Garden','Security','Parking','Smart Home'],
    'James Mwangi', '+254 712 345 678', 'james@email.com',
    'YOUR_ADMIN_UUID', true, true, true
  ),
  (
    'Modern 2 Bedroom Apartment in Westlands',
    'Contemporary apartment with city views, modern kitchen, and excellent amenities.',
    75000, 'monthly', 'apartment', 'rent', 'Westlands, Nairobi', '456 Westlands Avenue, Nairobi',
    2, 2, 120,
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    ARRAY['Gym','Parking','Security','Elevator','Balcony'],
    'Sarah Kamau', '+254 722 456 789', 'sarah@email.com',
    'YOUR_ADMIN_UUID', true, true, false
  ),
  (
    '3 Bedroom House in Kileleshwa',
    'Beautiful family home with spacious living areas and a well-maintained garden.',
    35000000, 'sale', 'house', 'buy', 'Kileleshwa, Nairobi', '321 Kileleshwa Road, Nairobi',
    3, 3, 280,
    ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    ARRAY['Garden','Parking','Security','Staff Quarters'],
    'Mary Wanjiku', '+254 744 678 901', 'mary@email.com',
    'YOUR_ADMIN_UUID', true, true, true
  ),
  (
    '5 Bedroom Mansion in Runda',
    'Exquisite mansion with premium finishes, extensive gardens, and complete privacy.',
    250000000, 'sale', 'villa', 'buy', 'Runda, Nairobi', '890 Runda Estate, Nairobi',
    5, 7, 800,
    ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    ARRAY['Swimming Pool','Tennis Court','Home Theater','Wine Cellar','Staff Quarters','Generator'],
    'David Ngugi', '+254 777 901 234', 'david@email.com',
    'YOUR_ADMIN_UUID', true, true, true
  );
