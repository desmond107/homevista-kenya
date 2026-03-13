# HomeVista Kenya - Kenya's Premier Real Estate Platform

A comprehensive, modern real estate platform built with React, Vite, and Tailwind CSS. Buy, sell, and rent properties across Kenya with verified professionals.

## 🌟 Features

### User Features
- **Property Browsing**: Browse 5+ property categories (Apartment, House, Villa, Commercial, Land)
- **Advanced Filtering**: Filter by location, price range, bedrooms, and property type
- **Hero Carousel**: Animated carousel showcasing featured properties
- **Google Authentication**: Quick sign-up/login with Google
- **Property Details**: Comprehensive property information with up to 10 images
- **Contact Protection**: Phone number and location hidden until payment
- **M-Pesa Integration**: STK prompt for KES 150 payment to unlock contact details
- **Favorites**: Save favorite properties
- **Share Functionality**: Share properties on social media

### Seller Features
- **Property Listing**: Add properties with full details and up to 10 images
- **Property Management**: CRUD operations for listed properties
- **Dashboard**: Track listed properties (approved/pending)
- **Verification Process**: Properties require admin approval before listing
- **Feature Support**: Add amenities like pools, gym, parking, etc.
- **Multiple Property Types**: Apartment, House, Villa, Commercial, Land
- **Flexible Pricing**: Support for sale prices and monthly rent

### Admin Features
- **Property Approval**: Review and approve/reject property listings
- **Popup Adverts**: Create and manage promotional popup adverts
- **User Management**: View and manage platform users
- **Realtor Management**: Manage verified property companies
- **Statistics Dashboard**: View key metrics (properties, users, etc.)
- **Admin Panel**: Full control over platform content

### Realtor Features
- **Business Profile**: Professional business listing with verified badge
- **Property Company Management**: Showcase company properties
- **Contact Management**: Display phone and email for inquiries

## 🎨 Design Features

### Modern Urban Theme
- **Color Scheme**: Slate (primary) with Amber/Orange accents
- **Responsive Design**: Fully mobile-responsive UI
- **Smooth Animations**: Framer Motion animations throughout
- **Professional Layout**: Clean, organized interface
- **Accessibility**: WCAG compliant design

### Technical Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: React Icons

## 💰 Pricing & Currency

- **Default Currency**: Kenyan Shilling (KES)
- **USD Conversion**: Optional conversion to USD (exchange rate: 130 KES = 1 USD)
- **Payment Method**: M-Pesa STK Prompt
- **Contact Unlock Fee**: KES 150

## 🔐 Security Features

- **Protected Contact Info**: Phone numbers and addresses hidden by default
- **Payment Verification**: M-Pesa payment required to access sensitive info
- **Admin Verification**: All properties verified before listing
- **User Authentication**: Secure login with Google OAuth

## 📱 Property Management

### Property Categories
1. **Apartment**: Multi-unit residential buildings
2. **House**: Single-family homes
3. **Villa**: Luxury residential properties
4. **Commercial**: Office and retail spaces
5. **Land**: Vacant land for development

### Listing Types
- **Buy**: Properties for purchase
- **Rent**: Properties for lease
- **Sell**: Properties owner wants to sell

### Property Features
Up to 10 images per listing and amenities including:
- Swimming Pool
- Gym
- Parking
- Security
- Garden
- Balcony
- Air Conditioning
- WiFi Ready

## 📍 Supported Locations

- Karen, Nairobi
- Westlands, Nairobi
- CBD, Nairobi
- Kileleshwa, Nairobi
- Kilimani, Nairobi
- Runda, Nairobi
- Upper Hill, Nairobi
- Kitengela, Kajiado
- Lavington, Nairobi
- Muthaiga, Nairobi
- Nyali, Mombasa
- Kisumu City
- Nakuru Town
- Eldoret Town

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📦 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.tsx      # Navigation bar
│   ├── AuthModal.tsx   # Login/signup modal
│   ├── HeroCarousel.tsx # Animated hero section
│   ├── PropertyCard.tsx # Property listing card
│   ├── FilterSidebar.tsx # Advanced filters
│   ├── MpesaModal.tsx   # M-Pesa payment modal
│   ├── PopupAdvert.tsx  # Promotional popups
│   └── Footer.tsx       # Footer component
├── pages/              # Page components
│   ├── HomePage.tsx              # Landing page
│   ├── PropertiesPage.tsx        # Property listing
│   ├── PropertyDetailPage.tsx    # Property details
│   ├── AddPropertyPage.tsx       # Add property form
│   ├── DashboardPage.tsx         # User dashboard
│   ├── AdminPage.tsx             # Admin panel
│   └── RealtorsPage.tsx          # Realtors directory
├── types/              # TypeScript types
├── store/              # Zustand store
├── utils/              # Utility functions
│   └── formatters.ts   # Formatting utilities
└── data/               # Mock data
```

## 🔧 Key Components

### Navbar
- Responsive navigation with mobile menu
- User authentication state
- Quick links to major sections
- User profile dropdown

### HeroCarousel
- Animated property carousel (5 slides)
- Auto-rotating every 5 seconds
- Search functionality
- Statistics display

### PropertyCard
- Image preview (thumbnail)
- Price display in KES
- Property features (beds, baths, area)
- Badge for featured/category
- Image count display

### FilterSidebar
- Category filter (all, apartment, house, villa, commercial, land)
- Listing type filter (buy, rent, sell)
- Location dropdown
- Bedroom filter
- Price range slider
- Reset filters button

### MpesaModal
- Phone number input for M-Pesa
- Amount display (KES 150)
- STK prompt simulation
- Transaction confirmation
- Success message with transaction ID

## 🌐 Backend Integration (Ruby on Rails)

The frontend is ready for backend integration. Key API endpoints to implement:

### Properties
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/properties/:id/approve` - Admin approval

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/logout` - Logout
- `POST /api/auth/google` - Google OAuth

### Payments
- `POST /api/payments` - Create payment record
- `POST /api/mpesa/stk` - M-Pesa STK prompt

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user

### Realtors
- `GET /api/realtors` - List realtors
- `POST /api/realtors` - Register realtor
- `PUT /api/realtors/:id` - Update realtor

### Adverts
- `GET /api/adverts` - List active adverts
- `POST /api/adverts` - Create advert (admin)
- `DELETE /api/adverts/:id` - Delete advert (admin)

## 🎯 User Workflows

### Browsing Properties
1. Land on homepage with hero carousel
2. Use search or category buttons
3. Navigate to properties page
4. Apply filters
5. Click property for details
6. View images and features
7. Pay KES 150 to see contact info
8. Contact lister via phone/email

### Listing a Property
1. Create account or login
2. Click "List Property" or "Add Property"
3. Fill in property details
4. Select category and listing type
5. Upload up to 10 images
6. Add amenities/features
7. Submit for approval
8. Wait for admin approval
9. Property goes live

### Admin Approval
1. Login as admin
2. Go to admin panel
3. View pending properties
4. Review property details
5. Approve or reject
6. Property becomes visible (if approved)

## 🔐 Authentication Flow

### Google OAuth
1. Click "Continue with Google"
2. Google login popup
3. User authenticated
4. Store user in Zustand
5. Redirect to dashboard

### Email/Password
1. Enter email and password
2. Create account or login
3. Mock authentication
4. Store user in Zustand
5. Redirect to dashboard

## 💳 Payment Flow

### M-Pesa Integration
1. View property details
2. Contact info is hidden
3. Click "Unlock Contact Info"
4. M-Pesa modal opens
5. Enter phone number
6. Click "Proceed to Payment"
7. M-Pesa STK prompt appears
8. User enters M-Pesa PIN
9. Payment confirmed
10. Contact info unlocked
11. Transaction stored in database

## 📊 Admin Dashboard

### Metrics
- Total properties count
- Pending approval count
- Total users count
- Active adverts count

### Property Management
- View pending properties with approval/rejection buttons
- View approved properties with delete option
- See property images and details

### Advert Management
- Create new popup adverts
- Set image URL and link
- View active adverts
- Delete adverts

### User Management
- View all users
- See user roles and status
- Track premium users

### Realtor Management
- View all registered realtors
- See verification status
- Track properties per realtor

## 🎁 Bonus Features

- **Popup Adverts**: Random popup adverts for promotions
- **Favorites System**: Save favorite properties
- **Share Functionality**: Share properties via social media
- **Property Statistics**: View listing trends
- **Transaction History**: Track all payments
- **Verification Badges**: Show verified realtors
- **Featured Properties**: Highlight premium listings
- **Advanced Search**: Full-text search capability

## 📝 Data Validation

- Required fields validation
- Email format validation
- Phone number validation
- Image count validation (max 10)
- Price range validation
- Location validation

## 🎓 Development Notes

- All components use TypeScript for type safety
- Zustand store provides global state management
- Framer Motion for smooth animations
- Tailwind CSS for responsive design
- Mock data used for demonstration
- Ready for backend API integration

## 🚀 Future Enhancements

- Real M-Pesa integration
- Email notifications
- Property comparison tool
- Advanced search with filters
- Virtual property tours
- Video listings
- Reviews and ratings
- Agent marketplace
- Property valuation tool
- Investment calculators
- Mobile app (React Native)
- Push notifications
- Chat system

## 📄 License

This project is provided as-is for educational and commercial purposes.

## 🤝 Support

For questions or support, please contact the development team.

---

**Built by Desmond Kinoti with ❤️ for Kenya's Real Estate Community**
