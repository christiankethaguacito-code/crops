# CropAid - Complete Setup Guide

## 🎯 Project: IoT-Based Monitoring System for Agricultural Calamity Response

This guide will help you set up and run the complete CropAid system.

---

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MySQL Server** via XAMPP or standalone - [Download XAMPP](https://www.apachefriends.org/)
3. **Git** (for cloning the repository)
4. **Code Editor** (VS Code recommended)

---

## 🚀 Step-by-Step Setup

### Step 1: Install XAMPP and Start MySQL

1. Download and install XAMPP
2. Open XAMPP Control Panel
3. Start **Apache** and **MySQL** services
4. Click **Admin** button next to MySQL to open phpMyAdmin

### Step 2: Create Database

**Option A: Using phpMyAdmin**
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click "New" to create a database
3. Name it: `cropaid_db`
4. Click "Create"
5. Select `cropaid_db` from the left sidebar
6. Click "SQL" tab
7. Copy and paste the contents of `backend/database/schema.sql`
8. Click "Go"

**Option B: Using MySQL Command Line**
```bash
# Navigate to backend folder
cd backend

# Run the schema file
mysql -u root -p < database/schema.sql
# When prompted, enter your MySQL password (default is empty for XAMPP)
```

### Step 3: Generate Admin Password Hash

You need to create a proper bcrypt hash for the admin password:

```bash
# Install bcrypt temporarily
npm install -g bcrypt

# Generate hash (replace 'admin123' with your desired password)
node -e "console.log(require('bcrypt').hashSync('admin123', 10))"
```

Copy the output hash and update the admin user in the database:

```sql
UPDATE users 
SET password_hash = 'YOUR_GENERATED_HASH_HERE' 
WHERE email = 'admin@cropaid.com';
```

### Step 4: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your settings
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

Update `.env` file:
```env
NODE_ENV=development
PORT=3000

# Database (XAMPP defaults)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cropaid_db
DB_PORT=3306

# Generate a secure JWT secret (any random string)
JWT_SECRET=cropaid_secret_key_2026_change_me_in_production

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 5: Start Backend Server

```bash
# In backend directory
npm run dev
```

You should see:
```
🌾 CropAid Backend Server
📡 Server running on http://localhost:3000
🔗 API Base URL: http://localhost:3000/api
📁 Environment: development
```

Test the backend:
- Open browser: http://localhost:3000/api/health
- You should see: `{"status":"ok","message":"CropAid Backend API is running"}`

### Step 6: Update Frontend Configuration

```bash
# Open a NEW terminal
# Navigate to project root
cd ..

# Create .env file for frontend
# Create a file named .env in the root directory
```

Create `.env` file in the main project root (not backend):
```env
VITE_API_URL=http://localhost:3000/api
```

### Step 7: Update Frontend to Use Real Backend

Open `src/context/AuthContext.jsx` and update the API_URL:

```javascript
// Find this line (around line 7):
export const API_URL = 'http://localhost:3000/api';

// Or better, use environment variable:
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### Step 8: Start Frontend

```bash
# In the main project directory (not backend)
npm run dev
```

You should see:
```
VITE v7.3.0  ready in 733 ms
➜  Local:   http://localhost:5173/CropAid/0.4/
```

---

## 🎉 Testing the Application

### Test 1: Admin Login

1. Open: http://localhost:5173/CropAid/0.4/
2. Click on "Admin Login" or navigate to: http://localhost:5173/CropAid/0.4/admin-login
3. Login with:
   - Email: `admin@cropaid.com`
   - Password: `admin123` (or whatever you set)
4. You should be redirected to the Admin Dashboard

### Test 2: Farmer Registration

1. Go back to the home page
2. Click "Sign Up" or "Create Account"
3. Fill in the multi-step registration form:
   - **Step 1**: Basic Information
   - **Step 2**: Farm Information
   - **Step 3**: Account Information (Email, RSBSA, Password)
4. Submit the registration
5. You should see a success message

### Test 3: Farmer Login

1. Login with the credentials you just created
2. You should see the Farmer Dashboard

### Test 4: Submit a Report

1. From Farmer Dashboard, click "Flood Report" or "Pest Report"
2. Fill in the form
3. Optionally upload photos
4. Submit
5. Check "Report Status" to see your submitted report

### Test 5: Admin Report Management

1. Login as admin
2. Go to "Reports" section
3. You should see the report submitted by the farmer
4. Try updating the status (Pending → Verified → Resolved)

---

## 📁 Project Structure

```
cropaid/
├── backend/                    # Backend API Server
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── database/
│   │   └── schema.sql
│   ├── uploads/               # Uploaded media files
│   ├── .env                   # Backend environment config
│   └── package.json
│
├── src/                       # Frontend React App
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── config/
│
├── .env                       # Frontend environment config
├── package.json
└── DEVELOPMENT_ROADMAP.md
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Ensure MySQL is running in XAMPP
- Check DB credentials in `backend/.env`
- Verify database `cropaid_db` exists

### Issue: "CORS Error"
**Solution:**
- Ensure backend is running on port 3000
- Check `FRONTEND_URL` in `backend/.env`
- Restart both servers

### Issue: "JWT Token Error"
**Solution:**
- Ensure `JWT_SECRET` is set in `backend/.env`
- Clear browser localStorage
- Try logging in again

### Issue: "File Upload Failed"
**Solution:**
- Check `backend/uploads/` directory exists
- Verify file size (max 5MB)
- Check file format (images: jpg, png; videos: mp4)

### Issue: "Cannot find module"
**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

---

## 🔧 Development Workflow

1. **Always start MySQL first** (via XAMPP)
2. **Start backend** in one terminal: `cd backend && npm run dev`
3. **Start frontend** in another terminal: `npm run dev`
4. **Make changes** to code
5. **Both servers auto-reload** on changes

---

## 📊 Features Implemented

### ✅ Completed
- [x] User Registration (Farmers)
- [x] Login/Logout (Farmers & Admin)
- [x] Farmer Dashboard
- [x] Report Submission (Flood & Pest)
- [x] Report Status Tracking
- [x] Admin Dashboard with Stats
- [x] Admin Report Management
- [x] Media Upload System
- [x] Role-based Access Control

### 🚧 To Be Enhanced
- [ ] Email/SMS Notifications
- [ ] Weather API Integration
- [ ] Map View for Reports
- [ ] Data Export (Excel/PDF)
- [ ] Advanced Search & Filters
- [ ] Analytics Charts
- [ ] Push Notifications

---

## 📝 API Documentation

Once the backend is running, you can test endpoints using:

**Postman Collection** (Create manually):
1. Login: `POST http://localhost:3000/api/auth/login`
2. Register: `POST http://localhost:3000/api/auth/register`
3. Farmer Dashboard: `GET http://localhost:3000/api/farmer/me` (requires token)
4. Submit Report: `POST http://localhost:3000/api/reports` (requires token)

**Example Login Request:**
```json
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "identifier": "admin@cropaid.com",
  "password": "admin123"
}
```

**Example Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "user": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@cropaid.com"
  }
}
```

---

## 🎓 Next Steps

1. **Test all features** thoroughly
2. **Create test farmer accounts** with different barangays
3. **Submit various reports** (floods, different pests)
4. **Test admin workflow** (verify and resolve reports)
5. **Customize** the system based on requirements
6. **Add more features** from DEVELOPMENT_ROADMAP.md

---

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Review this guide carefully
3. Check `DEVELOPMENT_ROADMAP.md` for more details
4. Verify all services are running

---

## 🎯 Production Deployment

For production deployment, you'll need to:
1. Use a production database (not XAMPP)
2. Set up proper domain and SSL
3. Configure environment for production
4. Deploy backend to a hosting service (Heroku, Railway, DigitalOcean)
5. Deploy frontend to Vercel or Netlify
6. Set up email service for notifications
7. Implement proper backup strategy

---

**Last Updated:** January 2, 2026

**Project:** CropAid - IoT-Based Monitoring System for Agricultural Calamity Response in Municipal Agriculture Office, Norala
