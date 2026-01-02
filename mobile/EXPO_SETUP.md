# 📱 CropAid Mobile - Expo Setup Guide

## ✨ Why Expo?

**No Android Studio or Xcode needed!** Just your phone and this simple setup.

### Advantages:
- ✅ **Super Easy Setup** - Just install Node.js and you're ready
- ✅ **Test on Real Device** - Scan QR code with Expo Go app
- ✅ **No Emulator Needed** - Use your own phone
- ✅ **Fast Development** - Hot reload, instant updates
- ✅ **Cross-Platform** - Works on Android and iOS
- ✅ **Built-in Features** - Camera, GPS, Storage all configured

---

## 🚀 Quick Start (5 Minutes!)

### Step 1: Install Node.js
Download and install from: https://nodejs.org (LTS version recommended)

### Step 2: Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 3: Install Expo Go on Your Phone
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS**: https://apps.apple.com/app/expo-go/id982107779

### Step 4: Navigate to Project
```bash
cd c:\Users\USER\OneDrive\Desktop\cropaid\cropaid\mobile
```

### Step 5: Install Dependencies
```bash
npm install
```

### Step 6: Start the App
```bash
npm start
```

### Step 7: Scan QR Code
- **Android**: Open Expo Go app → Scan QR code from terminal
- **iOS**: Open Camera app → Scan QR code → Tap notification

**That's it!** The app will load on your phone! 🎉

---

## 📱 Testing on Your Phone

### Android:
1. Install **Expo Go** from Play Store
2. Make sure phone and computer are on **same Wi-Fi**
3. Run `npm start`
4. Press `s` to switch to Expo Go
5. Scan QR code with Expo Go app

### iOS:
1. Install **Expo Go** from App Store
2. Make sure phone and computer are on **same Wi-Fi**
3. Run `npm start`
4. Scan QR code with Camera app
5. Tap notification to open in Expo Go

---

## 🔧 Configuration

### Backend API URL
Update the API URL in `src/services/api.js`:

```javascript
// For testing on physical device
const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';

// Find your IP:
// Windows: ipconfig
// Mac/Linux: ifconfig
```

**Example:**
```javascript
const API_URL = 'http://192.168.1.100:3000/api';
```

### Start Backend Server
Make sure your backend is running:
```bash
cd c:\Users\USER\OneDrive\Desktop\cropaid\cropaid\backend
npm start
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Start with specific platform
npm run android    # Android emulator (if you have one)
npm run ios        # iOS simulator (Mac only)

# Clear cache
expo start -c

# View logs
expo start --dev-client
```

---

## 📂 Project Structure

```
mobile/
├── src/
│   ├── App.js              ← Main app component
│   ├── screens/            ← All screens
│   ├── components/         ← Reusable components
│   ├── navigation/         ← Navigation setup
│   ├── context/            ← State management
│   ├── services/           ← API calls
│   └── utils/              ← Theme, helpers
├── assets/                 ← Images, icons
├── app.json               ← Expo configuration
├── package.json           ← Dependencies
└── babel.config.js        ← Babel configuration
```

---

## 🎨 Using Expo Features

### Camera (Photo Upload)
```javascript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });
  
  if (!result.canceled) {
    console.log(result.assets[0].uri);
  }
};
```

### GPS Location
```javascript
import * as Location from 'expo-location';

const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;
  
  let location = await Location.getCurrentPositionAsync({});
  console.log(location.coords.latitude, location.coords.longitude);
};
```

### Icons
```javascript
import { MaterialCommunityIcons } from '@expo/vector-icons';

<MaterialCommunityIcons name="weather-cloudy" size={24} color="white" />
```

---

## 🐛 Troubleshooting

### "Unable to connect to Metro"
- Make sure phone and computer are on **same Wi-Fi**
- Check your firewall isn't blocking port 8081
- Try running: `expo start --tunnel`

### "Network request failed"
- Update API_URL with your computer's IP address
- Check backend server is running
- Verify port 3000 is accessible

### QR code not working
- Press `s` in terminal to switch connection type
- Try `expo start --tunnel` for tunnel connection
- Make sure Expo Go app is updated

### App crashes on startup
- Clear cache: `expo start -c`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors in code

### Camera/Location not working
- Check app.json permissions are set
- Request permissions in your code
- Test on physical device (not always available in Expo Go)

---

## 🚀 Building APK/IPA (Optional)

### Build Android APK
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

### Build iOS App (Mac only)
```bash
eas build -p ios --profile preview
```

**Note:** Building requires an Expo account (free).

---

## 📊 Expo vs React Native CLI

| Feature | Expo | React Native CLI |
|---------|------|------------------|
| Setup Time | 5 minutes | 1-2 hours |
| Android Studio | Not needed | Required |
| Xcode | Not needed | Required (Mac) |
| Testing | QR code scan | Emulator needed |
| Native Modules | Limited | Full access |
| File Size | Larger | Smaller |
| Ejecting | Possible | Not applicable |

For CropAid, **Expo is perfect** because:
- ✅ Faster development
- ✅ Easy testing
- ✅ All needed features included (camera, GPS, storage)
- ✅ No complex setup

---

## 🔄 Development Workflow

1. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Start Mobile App**
   ```bash
   cd mobile
   npm start
   ```

3. **Open on Phone**
   - Scan QR code with Expo Go

4. **Make Changes**
   - Edit files in `src/`
   - App auto-reloads on save

5. **Test Features**
   - Login, register, reports
   - Camera, GPS, forms

---

## 📝 Next Steps

1. ✅ Install Node.js
2. ✅ Install Expo CLI (`npm install -g expo-cli`)
3. ✅ Install Expo Go on phone
4. ✅ Run `npm install` in mobile folder
5. ✅ Start backend server
6. ✅ Update API_URL with your IP
7. ✅ Run `npm start`
8. ✅ Scan QR code
9. 🎉 Start developing!

---

## 💡 Tips

- **Hot Reload**: Shake phone → Enable Fast Refresh
- **Debug Menu**: Shake phone → Show Developer Menu
- **Console Logs**: Check terminal for console.log output
- **Network Inspector**: Shake phone → Toggle Performance Monitor
- **Restart App**: Shake phone → Reload

---

## 📚 Resources

- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **Expo Vector Icons**: https://icons.expo.fyi
- **Expo Snack** (Online Editor): https://snack.expo.dev

---

## ✨ Summary

**What you need:**
- ✅ Node.js installed
- ✅ Expo CLI installed (`npm i -g expo-cli`)
- ✅ Expo Go app on phone
- ✅ Phone and computer on same Wi-Fi

**Commands:**
```bash
npm install        # Install dependencies
npm start         # Start development server
```

**That's it!** No Android Studio, no emulators, just scan and test! 🚀

---

**Created:** January 2, 2026  
**Setup Time:** ~5 minutes  
**Testing:** Instant on real device
