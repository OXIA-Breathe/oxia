# Firebase Analytics Setup Guide

Firebase Analytics has been integrated into your OXIA app! 🎉

## What's Been Done

1. ✅ Installed `@capacitor-firebase/analytics` plugin
2. ✅ Created `useFirebaseAnalytics` hook for tracking events
3. ✅ Added screen tracking throughout the app
4. ✅ Integrated event tracking for:
   - User authentication (login, sign up)
   - Breathing session completions
   - Achievement unlocks
   - Screen views
5. ✅ Copied `google-services.json` to project root

## Next Steps to Complete Setup

### 1. Transfer Project to GitHub
Export your project to GitHub using the "Export to Github" button in Lovable.

### 2. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd <your-repo-name>
npm install
```

### 3. Add Android Platform
```bash
npx cap add android
```

### 4. Move Config File
```bash
# Move the google-services.json file to the Android app folder
mv google-services.json android/app/
```

### 5. Update Dependencies
```bash
npx cap update android
```

### 6. Build the Project
```bash
npm run build
npx cap sync
```

### 7. Run on Device/Emulator
```bash
npx cap run android
```

## Firebase Events Being Tracked

### Authentication Events
- `login` - When user signs in
- `sign_up` - When user creates account

### Breathing Session Events
- `breathing_session_completed` - Tracks:
  - Exercise name
  - Breath count
  - Duration in seconds
  - Whether it's a custom exercise

### Achievement Events
- `unlock_achievement` - Tracks:
  - Achievement name
  - Achievement category (breath/session/streak/exercise/oxia)

### Screen Events
- `screen_view` - Automatically tracks all page navigation

## Viewing Analytics

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **oxia-app-bb056**
3. Navigate to Analytics → Events
4. You'll see real-time user activity once the app is running on a device

## Optional: Add iOS Support

If you want iOS analytics as well:

1. In Firebase Console, add an iOS app
2. Use bundle ID: `app.lovable.d3590b81c81449329e6d4fbda085725b`
3. Download `GoogleService-Info.plist`
4. Add iOS platform: `npx cap add ios`
5. Move the file to `ios/App/App/GoogleService-Info.plist`
6. Run: `npx cap run ios` (requires Mac with Xcode)

## Notes

- Analytics only works on native platforms (not in web preview)
- Events are batched and may take a few hours to appear in Firebase Console
- Debug view can be enabled for immediate event testing
