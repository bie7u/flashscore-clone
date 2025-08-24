# FlashScore Mobile App

A React Native mobile application for live sports scores and fixtures.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Test on device:**
   - Install Expo Go app on your phone
   - Scan QR code from terminal

4. **Test on simulator:**
   ```bash
   npm run ios     # iOS Simulator (macOS only)
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

## Features

- 📱 Live match scores and updates
- 🏆 League standings and statistics
- 📅 Date-based match filtering
- 🌙 Dark/light theme support
- 📊 Match details with events timeline
- 🔄 Pull-to-refresh functionality

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Backend API running on port 3001

## Backend Setup

The mobile app requires the backend API to be running:

```bash
# In project root directory
cd ../api
npm install
npm start
```

## Build for Production

```bash
# Create production builds
npx expo build:ios
npx expo build:android

# Or use EAS Build (recommended)
npm install -g @expo/eas-cli
eas build --platform all
```

## Documentation

See [REACT_NATIVE_MIGRATION.md](../REACT_NATIVE_MIGRATION.md) for complete testing and deployment instructions.