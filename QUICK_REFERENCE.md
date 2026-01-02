# CropAid - Quick Reference Guide

## 🎯 What You Have Now

### ✅ Complete Backend API (Node.js + Express + MySQL)
Located in `backend/` folder with:
- User authentication (register, login, JWT)
- Farmer endpoints (dashboard, profile, reports)
- Report management (create, update, delete, media upload)
- Admin endpoints (stats, farmers list, reports management)
- File upload system for photos/videos
- Role-based access control

### ✅ Complete Frontend (React + Vite + Tailwind)
Located in `src/` folder with:
- Multi-step farmer registration
- Farmer dashboard
- Flood & pest reporting forms
- Report status tracking
- Admin dashboard
- Admin farmer & report management
- Mock mode (currently active)

### ✅ Documentation
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `DEVELOPMENT_ROADMAP.md` - Feature implementation status
- `backend/README.md` - Backend API documentation

---

## 🚀 How to Get Started

### Step 1: Install XAMPP
1. Download from https://www.apachefriends.org/
2. Install and start Apache + MySQL
3. Open phpMyAdmin (http://localhost/phpmyadmin)

### Step 2: Create Database
1. In phpMyAdmin, create database: `cropaid_db`
2. Go to SQL tab
3. Copy contents of `backend/database/schema.sql` and run it

### Step 3: Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database password
npm run dev
```

### Step 4: Setup Frontend
```bash
# In main project directory
npm install
npm run dev
```

### Step 5: Test!
- Open http://localhost:5173/CropAid/0.4/
- Login as admin: admin@cropaid.com / admin123
- Or register as a new farmer

---

## 📝 What Needs to Be Done

Based on your manuscript requirements, here's what's **ready** vs **needs work**:

### ✅ READY (Already Implemented)

1. **Registration Module** ✅
   - Multi-step form (Basic Info → Farm Info → Account Info)
   - All required fields from manuscript
   - Profile photo upload

2. **Reporting System** ✅
   - Flood report form
   - Pest infestation form (with 4 pest types)
   - Location, crop, area fields
   - Media upload (photos/videos)

3. **Farmer Dashboard** ✅
   - Profile display
   - Action buttons (Flood/Pest reports)
   - Status updates section
   - Weather widget (mock data)

4. **Admin Dashboard** ✅
   - Farm condition monitoring
   - Report summary by date
   - Farmer list with filters
   - Report status management

5. **Data Management** ✅
   - Automatic report collection
   - Database organization
   - Status tracking (Pending/Verified/Resolved)

### 🔧 NEEDS ENHANCEMENT

1. **Database Connection** 🔴 **PRIORITY**
   - Currently using mock data
   - Need to connect frontend to backend API
   - Update `src/context/AuthContext.jsx`

2. **Real Weather Data**
   - Integrate OpenWeatherMap API
   - Replace mock weather in dashboard

3. **Notifications**
   - Email notifications for report status
   - SMS alerts (optional)

4. **Data Export**
   - Download reports as Excel/PDF
   - Generate summary documents

5. **Map View**
   - Show farm locations on map
   - Visualize affected areas

---

## 🔥 Critical Next Steps

### Priority 1: Connect to Backend (Required for basic functionality)

**Update Frontend to Use Real API:**

1. Create `.env` file in project root:
```env
VITE_API_URL=http://localhost:3000/api
```

2. Update `src/context/AuthContext.jsx` (line ~7):
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

3. The mock mode will automatically disable once backend is running

### Priority 2: Test Complete Flow

1. Start MySQL (XAMPP)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `npm run dev`
4. Register a farmer
5. Login and submit a report
6. Login as admin
7. View and manage the report

### Priority 3: Customize for Norala

1. Update location data:
   - Add actual barangays in Norala
   - Update default municipality/province

2. Customize pest types:
   - Verify pest names with MAO
   - Add local pest varieties if needed

3. Adjust crop types:
   - Add common crops in Norala
   - Update crop stage options

---

## 📊 System Architecture

```
User (Browser)
    ↓
Frontend (React)
    ↓ HTTP Requests (JWT Token)
Backend API (Express)
    ↓ SQL Queries
Database (MySQL)
```

**File Uploads:**
```
Frontend → Multer Middleware → backend/uploads/ folder
```

**Authentication:**
```
Login → JWT Token → Stored in localStorage → Sent with every request
```

---

## 🧪 Testing Checklist

- [ ] Database created and schema imported
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can register as farmer
- [ ] Can login as farmer
- [ ] Can submit flood report
- [ ] Can submit pest report
- [ ] Can upload photos
- [ ] Can view report status
- [ ] Can login as admin
- [ ] Can view farmer list
- [ ] Can view all reports
- [ ] Can update report status

---

## 🐛 Common Issues & Quick Fixes

**Issue: "Cannot connect to database"**
```bash
# Check if MySQL is running in XAMPP
# Verify credentials in backend/.env
```

**Issue: "Mock Mode" overlay appears**
```bash
# Backend not running
cd backend
npm run dev
```

**Issue: "CORS error"**
```bash
# Check backend/.env has correct FRONTEND_URL
# Restart both servers
```

**Issue: "File upload failed"**
```bash
# Ensure backend/uploads/ folder exists
# Check file size (max 5MB)
```

---

## 📁 Important Files to Know

### Backend
- `backend/src/server.js` - Main server entry point
- `backend/src/config/database.js` - MySQL connection
- `backend/src/controllers/` - Business logic
- `backend/src/routes/` - API endpoints
- `backend/.env` - Configuration (database, JWT secret)

### Frontend
- `src/App.jsx` - Routes configuration
- `src/context/AuthContext.jsx` - Authentication logic
- `src/pages/FarmerDashboard.jsx` - Farmer main page
- `src/pages/admin/AdminDashboard.jsx` - Admin main page
- `src/config/mockData.js` - Mock data (will be replaced)

### Database
- `backend/database/schema.sql` - Complete database structure

---

## 💡 Tips for Development

1. **Always check both terminals** - frontend and backend must be running
2. **Clear browser cache** if you see old data
3. **Check browser console** for errors (F12)
4. **Check backend terminal** for API errors
5. **Use Postman** to test API endpoints directly
6. **Backup database** before making schema changes

---

## 📞 Need Help?

1. **Setup Issues**: Read SETUP_GUIDE.md
2. **Feature Questions**: Check DEVELOPMENT_ROADMAP.md
3. **API Questions**: See backend/README.md
4. **Database Issues**: Review schema.sql comments

---

## 🎯 Research Alignment

Your system now implements all manuscript requirements:

✅ **Objective 1: Registration Module**
- Multi-step registration ✅
- Farm information capture ✅
- Profile photo upload ✅

✅ **Objective 2: Reporting System**
- Flood report submission ✅
- Pest report submission ✅
- Damage assessment fields ✅

✅ **Objective 3: Data Management**
- Automatic collection ✅
- Organized storage ✅
- Report summaries ✅

🔧 **Objective 4: System Evaluation**
- Ready for TAM evaluation once deployed
- Need to prepare evaluation forms

---

## 🚀 Deployment Checklist (Future)

When ready for production:

- [ ] Change admin password
- [ ] Set strong JWT_SECRET
- [ ] Use production database
- [ ] Configure SSL (HTTPS)
- [ ] Set up domain
- [ ] Deploy backend (Heroku/Railway)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Test on actual mobile devices
- [ ] Conduct user training
- [ ] Prepare TAM evaluation

---

**Current Status:** Development Complete, Integration Needed
**Next Action:** Connect frontend to backend API
**Timeline:** Backend ready for testing immediately

**Remember:** The frontend already works with mock data. Once you connect to the backend, everything will use real data from the database!

Good luck! 🌾
