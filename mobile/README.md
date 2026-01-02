# 📱 CropAid Mobile App

Native mobile application for CropAid Agricultural Monitoring System built with **Expo**.

## ✨ Super Quick Start (5 Minutes!)

### Prerequisites
- Node.js 18+
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Installation

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Install dependencies
cd mobile
npm install

# Start the app
npm start

# Scan QR code with Expo Go app on your phone!
```

**No Android Studio or Xcode needed!** 🎉

## 📱 Features

- ✅ Native iOS & Android app
- ✅ Multi-step farmer registration
- ✅ Real-time report submission
- ✅ Photo upload from camera/gallery
- ✅ GPS location capture
- ✅ Offline data caching
- ✅ Push notifications ready

## 📖 Documentation

See [MOBILE_SETUP.md](MOBILE_SETUP.md) for detailed setup instructions.

## 🛠️ Tech Stack

- React Native 0.73
- React Navigation 6
- Axios for API calls
- AsyncStorage for local data
- React Native Paper for UI

## 🔧 Configuration

Update API URL in `src/services/api.js`:

```javascript
// For Android Emulator
const API_URL = 'http://10.0.2.2:3000/api';

// For iOS Simulator
const API_URL = 'http://localhost:3000/api';

// For Physical Device
const API_URL = 'http://YOUR_IP:3000/api';
```

## 📂 Project Structure

```
mobile/
├── src/
│   ├── screens/       # App screens
│   ├── components/    # Reusable components
│   ├── navigation/    # Navigation setup
│   ├── context/       # Global state
│   ├── services/      # API services
│   └── utils/         # Theme & helpers
├── android/           # Android native code
├── ios/               # iOS native code
└── package.json
```

## 🎯 Backend Connection

The mobile app connects to the same backend as the web version:

```
Mobile App → Backend API (localhost:3000) → MySQL Database
```

Ensure the backend is running before testing the mobile app.

## 📝 License

Academic/Research Project
