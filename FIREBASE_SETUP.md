# Firebase Setup Guide for Travel Quest Builder

This guide will help you set up Firebase authentication with Google sign-in for your Travel Quest Builder application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "travel-quest-builder")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:

### Email/Password Authentication
1. Click on "Email/Password"
2. Toggle "Enable" to ON
3. Click "Save"

### Google Authentication
1. Click on "Google"
2. Toggle "Enable" to ON
3. Add your authorized domain (localhost for development)
4. Click "Save"

## Step 3: Get Your Firebase Configuration

1. In your Firebase project dashboard, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "travel-quest-builder-web")
6. Copy the Firebase configuration object

## Step 4: Update Your Firebase Configuration

1. Open `src/config/firebase.ts` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Under "Authorized domains", add:
   - `localhost` (for development)
   - Your production domain (when deployed)

## Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:8080`
3. You should be redirected to the login page
4. Try signing up with email/password or Google

## Features Included

✅ **Email/Password Authentication**
- User registration and login
- Password validation
- Error handling

✅ **Google Authentication**
- One-click Google sign-in
- Automatic profile picture and name import
- Secure OAuth flow

✅ **User Management**
- Persistent login state
- Automatic logout
- User profile display

✅ **Security**
- Protected routes
- Authentication state management
- Secure token handling

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console

2. **"Firebase: Error (auth/popup-closed-by-user)"**
   - User closed the Google sign-in popup (normal behavior)

3. **"Firebase: Error (auth/weak-password)"**
   - Password must be at least 6 characters

4. **"Firebase: Error (auth/email-already-in-use)"**
   - Email is already registered (use login instead)

### Development vs Production:

- **Development**: Use `localhost` in authorized domains
- **Production**: Add your actual domain to authorized domains

## Security Best Practices

1. **Environment Variables**: Store Firebase config in environment variables for production
2. **Domain Restrictions**: Only add necessary domains to authorized domains
3. **Password Requirements**: Enforce strong password policies
4. **Rate Limiting**: Firebase handles this automatically

## Next Steps

After setup, you can:
1. Add more authentication providers (Facebook, Twitter, etc.)
2. Implement password reset functionality
3. Add email verification
4. Set up user roles and permissions
5. Add profile management features

## Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify your configuration values
3. Ensure your domain is authorized
4. Check browser console for detailed error messages

Your Travel Quest Builder now has enterprise-grade authentication! 🚀 