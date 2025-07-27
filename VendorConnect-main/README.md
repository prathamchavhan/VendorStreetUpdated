# VendorConnect - Street Food Vendor Marketplace

A comprehensive web application connecting street food vendors with verified suppliers for affordable raw materials sourcing.

## Features

### For Vendors
- **Registration & Profile Management**: Complete vendor onboarding with business details
- **Supplier Marketplace**: Browse verified suppliers with ratings and reviews
- **Group Buying**: Join bulk purchase groups for better pricing
- **Order Management**: Track orders with real-time delivery updates
- **Inventory Alerts**: Low-stock notifications and auto-reorder suggestions
- **Multi-language Support**: Hindi/English toggle

### For Suppliers
- **Supplier Registration**: Complete verification process
- **Product Management**: Manage inventory and pricing
- **Order Fulfillment**: Process and track deliveries
- **Analytics Dashboard**: Monitor sales and performance

### For Admins
- **User Management**: Approve supplier registrations
- **Platform Analytics**: Monitor platform growth and activity
- **Order Oversight**: Track all platform transactions

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Firebase/Firestore
- **Authentication**: Firebase Auth
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase account
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd vendor-connect
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Get your Firebase configuration

4. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Fill in your Firebase configuration in `.env.local`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Firebase Setup

### Authentication
Enable Email/Password authentication in Firebase Console:
1. Go to Authentication > Sign-in method
2. Enable Email/Password provider

### Firestore Database
Create the following collections:
- `users` - User profiles (vendors, suppliers, admins)
- `suppliers` - Supplier information and products
- `orders` - Order tracking and management
- `groups` - Group buying information
- `products` - Product catalog

### Security Rules
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // All authenticated users can read suppliers
    match /suppliers/{supplierId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin');
    }
    
    // Orders can be read/written by involved parties
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.vendorId == request.auth.uid || 
         resource.data.supplierId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin');
    }
  }
}
\`\`\`

## Deployment

### Vercel Deployment
1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel login
   vercel
   \`\`\`

2. **Set Environment Variables**
   Add all Firebase environment variables in Vercel dashboard

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Alternative: Manual Deployment
1. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to your hosting provider**
   Upload the `.next` folder and run:
   \`\`\`bash
   npm start
   \`\`\`

## Project Structure

\`\`\`
vendor-connect/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── marketplace/      # Marketplace components
│   ├── orders/           # Order management
│   ├── groups/           # Group buying
│   ├── admin/            # Admin dashboard
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## Key Features Implementation

### Multi-language Support
- Context-based language switching
- Complete Hindi/English translations
- Persistent language preference

### Mobile-First Design
- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized for low-end devices

### Real-time Updates
- Firebase real-time listeners
- Live order tracking
- Instant notifications

### Group Buying System
- Create and join buying groups
- Automatic cost splitting
- Progress tracking

### Payment Integration
Ready for Razorpay/UPI integration:
\`\`\`javascript
// Add to your order processing
const razorpayOptions = {
  key: process.env.RAZORPAY_KEY_ID,
  amount: amount * 100, // Amount in paise
  currency: 'INR',
  name: 'VendorConnect',
  description: 'Order Payment',
  handler: function(response) {
    // Handle successful payment
  }
}
\`\`\`

## Demo Data

The application includes comprehensive demo data for testing:
- Sample vendors and suppliers
- Mock orders and transactions
- Group buying examples
- Inventory alerts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions:
- Create an issue in the repository
- Email: support@vendorconnect.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] Payment gateway integration (Razorpay/UPI)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Inventory management system
- [ ] Multi-city expansion
- [ ] AI-powered demand forecasting
