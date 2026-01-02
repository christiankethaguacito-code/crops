# CropAid Development Roadmap
## IoT-Based Monitoring System for Calamity Response in Municipal Agriculture Office

---

## 📋 Project Overview

Based on the manuscript requirements, this system facilitates communication between the Municipal Agriculture Office (MAO) and farmers during agricultural emergencies, specifically focusing on **floods** and **pest infestations**.

---

## ✅ Current Implementation Status

### Frontend (React + Vite + Tailwind) - **80% Complete**

#### ✅ **Implemented Features:**

1. **User Authentication**
   - ✅ Login page for farmers
   - ✅ Admin login page
   - ✅ JWT-based authentication (mock mode active)
   - ✅ Role-based routing (farmer vs admin)

2. **Farmer Registration (Multi-Step)**
   - ✅ Step 1: Basic Information (name, ID, address, contact, DOB, sex, tribe, civil status, photo)
   - ✅ Step 2: Farm Information (location, boundaries, area)
   - ✅ Step 3: App Account Info (email, RSBSA, password)
   - ✅ Step 4: Summary & Confirmation

3. **Farmer Dashboard**
   - ✅ Profile display with photo
   - ✅ Weather information widget
   - ✅ Quick action buttons layout
   - ✅ Status updates section
   - ✅ Bottom navigation

4. **Reporting System**
   - ✅ Unified Report page
   - ✅ Separate Flood Report form
   - ✅ Separate Pest Report form
   - ✅ Report Status tracking page
   - ✅ Report Confirmation page

5. **Admin Dashboard**
   - ✅ Admin layout with sidebar navigation
   - ✅ Dashboard overview with stats cards
   - ✅ Farmer management page
   - ✅ Reports management page
   - ✅ Recent activity feed

6. **UI Components**
   - ✅ Responsive layouts
   - ✅ Form inputs and buttons
   - ✅ Bottom navbar for mobile
   - ✅ Admin sidebar
   - ✅ Mock mode overlay

---

## 🚧 Implementation Needed

### Phase 1: Backend Development (0% - **PRIORITY**)

#### 1.1 Backend Setup
- [ ] Create `backend/` folder structure
- [ ] Initialize Node.js project with Express
- [ ] Set up PostgreSQL/MySQL database
- [ ] Configure environment variables (.env)
- [ ] Install dependencies:
  - express
  - cors
  - bcrypt (password hashing)
  - jsonwebtoken (JWT)
  - mysql2 or pg (database driver)
  - multer (file uploads)
  - dotenv

#### 1.2 Database Schema

**Tables Required:**

```sql
-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rsbsa_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(50),
    address TEXT,
    contact_number VARCHAR(20),
    date_of_birth DATE,
    sex ENUM('Male', 'Female'),
    tribe VARCHAR(50),
    civil_status VARCHAR(20),
    profile_photo_url VARCHAR(255),
    role ENUM('farmer', 'admin') DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Farms Table
CREATE TABLE farms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    sitio_purok VARCHAR(100),
    barangay VARCHAR(100) NOT NULL,
    municipality VARCHAR(100),
    province VARCHAR(100),
    boundary_north TEXT,
    boundary_south TEXT,
    boundary_east TEXT,
    boundary_west TEXT,
    farm_area DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    report_type ENUM('flood', 'pest') NOT NULL,
    location VARCHAR(255),
    farm_area DECIMAL(10, 2),
    affected_area DECIMAL(10, 2),
    crop_planted VARCHAR(100),
    crop_stage VARCHAR(50),
    pest_type VARCHAR(100), -- Rodents, Stem Borer, Black Bug, Brown Plant Hopper
    status ENUM('pending', 'verified', 'resolved') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Report Media Table (for photos/videos)
CREATE TABLE report_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    media_type ENUM('photo', 'video') NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);
```

#### 1.3 API Endpoints to Implement

**Authentication Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verify-token
```

**Farmer Endpoints:**
```
GET /api/farmer/me                  - Get farmer profile & dashboard data
GET /api/farmer/profile              - Get detailed profile
PUT /api/farmer/profile              - Update profile
GET /api/farmer/reports              - Get farmer's report history
GET /api/farmer/reports/:id          - Get specific report details
```

**Report Endpoints:**
```
POST /api/reports                    - Submit new report (flood/pest)
GET /api/reports/:id                 - Get report details
PUT /api/reports/:id                 - Update report
DELETE /api/reports/:id              - Delete report
POST /api/reports/:id/media          - Upload media to report
```

**Admin Endpoints:**
```
GET /api/admin/stats                 - Dashboard statistics
GET /api/admin/farmers               - List all farmers (with filters)
GET /api/admin/farmers/:id           - Get farmer details
GET /api/admin/reports               - List all reports (with filters)
GET /api/admin/reports/:id           - Get report details
PATCH /api/admin/reports/:id/status  - Update report status
GET /api/admin/reports/export        - Export reports to CSV/PDF
GET /api/admin/reports/daily-summary - Get daily summary by date
```

#### 1.4 File Upload System
- [ ] Configure multer for image/video uploads
- [ ] Create `uploads/` directory for media storage
- [ ] Implement file validation (size, type)
- [ ] Generate unique filenames
- [ ] Serve static files via Express

---

### Phase 2: Frontend-Backend Integration (0%)

#### 2.1 Update Frontend Configuration
- [ ] Create `.env` file with API URL
- [ ] Update `AuthContext.jsx` API_URL to backend server
- [ ] Remove mock mode dependency once backend is ready

#### 2.2 Connect Registration Flow
- [ ] Update `SignupAppInfo.jsx` to POST to `/api/auth/register`
- [ ] Handle validation errors from backend
- [ ] Display success message and redirect to login

#### 2.3 Connect Login Flow
- [ ] Update `Login.jsx` to POST to `/api/auth/login`
- [ ] Store JWT token in localStorage
- [ ] Redirect based on user role

#### 2.4 Connect Farmer Dashboard
- [ ] Fetch dashboard data from `/api/farmer/me`
- [ ] Display real weather data (integrate OpenWeatherMap API)
- [ ] Show actual report statistics
- [ ] Display recent activity

#### 2.5 Connect Report Submission
- [ ] Update `UnifiedReport.jsx`, `FloodReport.jsx`, `PestReport.jsx`
- [ ] POST report data to `/api/reports`
- [ ] Handle media uploads to `/api/reports/:id/media`
- [ ] Show real-time upload progress
- [ ] Navigate to confirmation on success

#### 2.6 Connect Report Status
- [ ] Fetch reports from `/api/farmer/reports`
- [ ] Display status badges (Pending/Verified/Resolved)
- [ ] Show report timeline
- [ ] Enable viewing report details

#### 2.7 Connect Admin Dashboard
- [ ] Fetch stats from `/api/admin/stats`
- [ ] Display real-time data instead of mock
- [ ] Auto-refresh every 30 seconds

#### 2.8 Connect Admin Reports Management
- [ ] Fetch reports from `/api/admin/reports`
- [ ] Implement filters (date, type, status, barangay)
- [ ] Enable status updates via PATCH endpoint
- [ ] Add download functionality for reports

---

### Phase 3: Enhanced Features (0%)

#### 3.1 Report Features Enhancement
- [ ] Add geolocation capture (latitude/longitude)
- [ ] Implement map view for report locations
- [ ] Add report comments/notes section
- [ ] Enable admin to assign reports to personnel

#### 3.2 Notification System
- [ ] Email notifications for report status changes
- [ ] SMS notifications (via Twilio/similar)
- [ ] In-app notification center
- [ ] Push notifications (Firebase Cloud Messaging)

#### 3.3 Data Analytics & Visualization
- [ ] Charts for reports over time (Chart.js/Recharts)
- [ ] Pie chart for report types distribution
- [ ] Heatmap for affected areas
- [ ] Export reports to Excel/PDF

#### 3.4 Mobile Responsiveness
- [ ] Test on various screen sizes
- [ ] Optimize images for mobile
- [ ] Add touch gestures
- [ ] Progressive Web App (PWA) features

#### 3.5 Search & Filter
- [ ] Global search in admin dashboard
- [ ] Advanced filters (date range, location, crop type)
- [ ] Sort by various fields
- [ ] Pagination for large datasets

---

### Phase 4: Testing & Deployment (0%)

#### 4.1 Testing
- [ ] Unit tests for API endpoints
- [ ] Integration tests for auth flow
- [ ] End-to-end tests for report submission
- [ ] Cross-browser testing
- [ ] Mobile device testing

#### 4.2 Security
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Configure CORS properly
- [ ] Set up HTTPS
- [ ] Implement SQL injection prevention
- [ ] Add XSS protection

#### 4.3 Deployment
- [ ] Set up production database
- [ ] Configure production environment variables
- [ ] Deploy backend to Heroku/Railway/DigitalOcean
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging

---

## 📊 Technology Stack

### Frontend (Current)
- React 19.2.0
- React Router DOM 7.11.0
- Vite 7.2.4
- Tailwind CSS 3.4.1
- Lucide React (icons)

### Backend (To Implement)
- Node.js (v18+)
- Express.js
- MySQL/PostgreSQL
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

### Additional Tools
- Firebase (optional for push notifications)
- OpenWeatherMap API (for weather data)
- XAMPP (for local MySQL server)
- Postman (for API testing)

---

## 🎯 Priority Implementation Order

### **Immediate (Week 1-2)**
1. Set up backend server and database
2. Implement authentication endpoints
3. Connect login and registration to backend
4. Basic report submission functionality

### **Short Term (Week 3-4)**
1. Complete all farmer endpoints
2. Implement media upload system
3. Admin report management
4. Dashboard data integration

### **Medium Term (Week 5-6)**
1. Notification system
2. Data export features
3. Advanced search and filters
4. Analytics and charts

### **Long Term (Week 7-8)**
1. Map integration
2. Mobile app optimization
3. Security hardening
4. Testing and deployment

---

## 📝 Notes

1. **Current Status**: The frontend UI is well-developed with mock data. The primary focus should be on backend development.

2. **Mock Mode**: The app currently runs in mock mode with hardcoded data. This needs to be replaced with real API calls.

3. **Database Choice**: The manuscript mentions MySQL with XAMPP, but PostgreSQL is also recommended for better JSON support (for storing report details).

4. **Media Storage**: Consider using cloud storage (AWS S3, Cloudinary) instead of local storage for production.

5. **Testing**: Test with real farmers to ensure the registration and reporting process is intuitive.

---

## 🔗 Related Documents

- `backend_impl_plan.md` - Detailed backend architecture
- `admin_dashboard_plan.md` - Admin UI/UX plan
- `README.md` - Project setup instructions

---

## 📧 Contact

For questions or clarifications about this roadmap, please coordinate with the development team.

**Last Updated**: January 2, 2026
