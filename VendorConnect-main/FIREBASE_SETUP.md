# Firebase Setup Instructions

Your Firebase project is now configured with the following details:

## Project Configuration
- **Project ID**: cervixcheck-5ce65
- **Auth Domain**: cervixcheck-5ce65.firebaseapp.com
- **Storage Bucket**: cervixcheck-5ce65.firebasestorage.app

## Required Firebase Services

### 1. Authentication
Enable the following sign-in methods in Firebase Console:
1. Go to Authentication > Sign-in method
2. Enable **Email/Password** provider
3. Optionally enable **Google** sign-in for easier access

### 2. Firestore Database
Create a Firestore database with the following collections:

#### Collections Structure:
\`\`\`
users/
├── {userId}/
    ├── name: string
    ├── email: string
    ├── phone: string
    ├── userType: "vendor" | "supplier" | "admin"
    ├── businessName?: string
    ├── location?: string
    ├── foodType?: string
    ├── verified: boolean
    └── createdAt: timestamp

suppliers/
├── {supplierId}/
    ├── name: string
    ├── companyName: string
    ├── category: string
    ├── location: string
    ├── rating: number
    ├── verified: boolean
    └── products: array

orders/
├── {orderId}/
    ├── vendorId: string
    ├── supplierId: string
    ├── items: array
    ├── totalAmount: number
    ├── status: string
    ├── orderDate: timestamp
    └── deliveryAddress: string

groups/
├── {groupId}/
    ├── title: string
    ├── organizer: string
    ├── participants: array
    ├── targetAmount: number
    ├── currentAmount: number
    └── status: string
\`\`\`

### 3. Security Rules
Add these Firestore security rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
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
    
    // Group buying
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

## Testing the Setup

### Test Accounts
Create these test accounts in Firebase Authentication:

1. **Admin Account**
   - Email: admin@vendorconnect.com
   - Password: admin123
   - Set userType: "admin" in Firestore

2. **Vendor Account**
   - Email: vendor@test.com
   - Password: vendor123
   - Set userType: "vendor" in Firestore

3. **Supplier Account**
   - Email: supplier@test.com
   - Password: supplier123
   - Set userType: "supplier" in Firestore

## Environment Variables
The Firebase configuration is now hardcoded in the app. For production, consider using environment variables:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDw5Xw40Qcp7HH8qrY1pETZGZ9VBuzHP7Q
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cervixcheck-5ce65.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cervixcheck-5ce65
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cervixcheck-5ce65.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=325620099510
NEXT_PUBLIC_FIREBASE_APP_ID=1:325620099510:web:44d1fc917e5e772eb43917
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WGPF0R2P9Q
\`\`\`

## Next Steps
1. Enable Authentication in Firebase Console
2. Create Firestore database
3. Set up security rules
4. Create test user accounts
5. Test the application functionality
