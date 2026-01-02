# 🚀 START HERE - Quick Setup Guide

## CropAid Mobile App with Expo

**Super easy setup - no Android Studio needed!**

### 5-Minute Setup:

1. **Install Node.js**
   - Download from: https://nodejs.org
   - Choose LTS version

2. **Install Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

3. **Install Expo Go on Phone**
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

4. **Setup Project**
   ```bash
   cd mobile
   npm install
   ```

5. **Start Development Server**
   ```bash
   npm start
   ```

6. **Open on Phone**
   - Scan QR code with Expo Go app
   - App loads instantly!

### Before Testing:

**Start the backend server:**
```bash
cd backend
npm start
```

**Update API URL** in `mobile/src/services/api.js`:
```javascript
// Find your IP with: ipconfig
const API_URL = 'http://192.168.1.100:3000/api';
```

### That's it! 🎉

Your app is now running on your phone!

---

## Full Documentation:

- **Quick Start**: See [mobile/README.md](mobile/README.md)
- **Detailed Guide**: See [mobile/EXPO_SETUP.md](mobile/EXPO_SETUP.md)
- **Project Overview**: See [MOBILE_SUMMARY.md](MOBILE_SUMMARY.md)

---

## Why Expo?

✅ No Android Studio  
✅ No Xcode  
✅ No emulators  
✅ Test on real phone instantly  
✅ Hot reload  
✅ Camera, GPS, everything works  

**Perfect for CropAid development!**
