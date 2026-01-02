# CropAid 🌾
## IoT-Based Monitoring System for Agricultural Calamity Response

A comprehensive web-based application designed to facilitate communication between the Municipal Agriculture Office (MAO) and farmers during agricultural emergencies, specifically for monitoring floods and pest infestations in Norala, South Cotabato.

---

## 🎯 Project Overview

CropAid enables farmers to:
- ✅ Register their farms with comprehensive details
- ✅ Submit real-time reports on floods and pest infestations
- ✅ Upload photos/videos as evidence
- ✅ Track the status of their reports
- ✅ Receive updates from the MAO

CropAid enables MAO personnel to:
- ✅ Monitor all farm conditions in real-time
- ✅ View and manage farmer reports
- ✅ Generate daily summaries
- ✅ Update report statuses (Pending → Verified → Resolved)
- ✅ Export data for documentation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL (via XAMPP recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/shototoy/cropaid.git
cd cropaid
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

4. **Set up the database:**
- Start XAMPP and run MySQL
- Create database: `cropaid_db`
- Import schema: `backend/database/schema.sql`

5. **Configure environment:**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd ..
echo VITE_API_URL=http://localhost:3000/api > .env
```

6. **Start the application:**

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

7. **Access the application:**
- Frontend: http://localhost:5173/CropAid/0.4/
- Backend API: http://localhost:3000/api
- Default Admin: admin@cropaid.com / admin123

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 📋 Features

### Farmer Mobile Application
- **Multi-Step Registration**
  - Basic Information (Name, ID, Contact, etc.)
  - Farm Information (Location, Boundaries, Area)
  - Account Setup (Email, RSBSA, Password)

- **Dashboard**
  - Weather Information
  - Report Statistics
  - Quick Action Buttons
  - Recent Activity

- **Report Submission**
  - Flood Reports
  - Pest Infestation Reports (Rodents, Stem Borer, Black Bug, Brown Plant Hopper)
  - Photo/Video Evidence Upload
  - Location Tracking

- **Report Status**
  - View all submitted reports
  - Track status (Pending/Verified/Resolved)
  - View report details

### Admin Dashboard (PC-Optimized)
- **Dashboard Overview**
  - Total Farmers Statistics
  - Pending/Verified/Resolved Reports
  - Recent Activity Feed
  - Weather Alerts

- **Farmer Management**
  - View all registered farmers
  - Search and filter by barangay
  - View detailed farmer profiles

- **Report Management**
  - View all reports with filters
  - Update report status
  - Daily summaries by date
  - Organized data tables
  - Download functionality

---

## 🛠️ Technology Stack

### Frontend
- React 19.2.0
- Vite 7.2.4
- Tailwind CSS 3.4.1
- React Router DOM 7.11.0
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Bcrypt (Password Hashing)
- Multer (File Uploads)

### Database
- MySQL (XAMPP)

---

## 📁 Project Structure

```
cropaid/
├── backend/                    # Node.js Backend API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth & upload middleware
│   │   ├── routes/            # API routes
│   │   └── server.js          # Main server file
│   ├── database/
│   │   └── schema.sql         # Database schema
│   └── uploads/               # Uploaded media
│
├── src/                       # React Frontend
│   ├── components/            # Reusable components
│   ├── pages/                 # Page components
│   │   ├── admin/            # Admin pages
│   │   ├── FarmerDashboard.jsx
│   │   ├── FloodReport.jsx
│   │   ├── PestReport.jsx
│   │   └── ...
│   ├── context/              # Auth context
│   └── config/               # Mock data
│
├── SETUP_GUIDE.md            # Detailed setup instructions
├── DEVELOPMENT_ROADMAP.md    # Development plan
└── README.md                 # This file
```

---

## 📊 Database Schema

### Tables
- **users** - Farmer and admin accounts
- **farms** - Farm information and boundaries
- **reports** - Flood and pest reports
- **report_media** - Uploaded photos and videos

See `backend/database/schema.sql` for complete schema.

---

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication with role-based access control:
- **Farmer Role**: Can submit and view their own reports
- **Admin Role**: Can view all farmers and reports, update statuses

---

## 🧪 Testing

### Default Credentials

**Admin Account:**
- Email: admin@cropaid.com
- Password: admin123

**Test Farmer Account:**
Create one through the registration flow.

### Testing Workflow
1. Register as a farmer
2. Login and explore the dashboard
3. Submit a flood or pest report
4. Upload photos
5. Check report status
6. Login as admin
7. View the submitted report
8. Update report status

---

## 📖 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    - Register new farmer
POST /api/auth/login       - Login
GET  /api/auth/verify-token - Verify JWT
```

### Farmer Endpoints
```
GET  /api/farmer/me        - Dashboard data
GET  /api/farmer/profile   - Get profile
PUT  /api/farmer/profile   - Update profile
GET  /api/farmer/reports   - Report history
```

### Report Endpoints
```
POST   /api/reports        - Create report
GET    /api/reports/:id    - Get report details
PUT    /api/reports/:id    - Update report
DELETE /api/reports/:id    - Delete report
POST   /api/reports/:id/media - Upload media
```

### Admin Endpoints
```
GET   /api/admin/stats              - Statistics
GET   /api/admin/farmers            - All farmers
GET   /api/admin/farmers/:id        - Farmer details
GET   /api/admin/reports            - All reports
PATCH /api/admin/reports/:id/status - Update status
```

---

## 🗺️ Development Roadmap

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for:
- Current implementation status
- Planned features
- Enhancement priorities
- Technical specifications

---

## 🤝 Contributing

This project is part of a thesis/research study. Contributions are welcome for:
- Bug fixes
- Feature enhancements
- Documentation improvements
- Testing

---

## 📄 License

This project is developed for academic purposes as part of the research study:
**"IOT-BASED MONITORING SYSTEM FOR CALAMITY RESPONSE IN THE MUNICIPAL AGRICULTURE OFFICE IN NORALA"**

---

## 👥 Authors

- Development Team
- Municipal Agriculture Office, Norala
- South Cotabato

---

## 📞 Support

For setup assistance or questions:
1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Check [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md)
3. Review backend logs for errors
4. Check browser console for frontend issues

---

## 🎓 Research Objectives

This system addresses the following research objectives:

1. **Registration Module**: Mobile app for farmers to register farms and personal information
2. **Reporting System**: Real-time submission of farm conditions and damage assessments
3. **Data Management**: Automatic collection and organization of calamity reports
4. **System Evaluation**: Assessment using Technology Acceptance Model (TAM)

---

## 🌟 Key Benefits

✅ **For Farmers:**
- Easy report submission via mobile-friendly interface
- Photo/video evidence upload
- Real-time status tracking
- Direct communication with MAO

✅ **For MAO Personnel:**
- Centralized monitoring dashboard
- Organized data management
- Quick response to emergencies
- Data export for documentation

✅ **For the Community:**
- Improved disaster response
- Better resource allocation
- Data-driven decision making
- Enhanced agricultural resilience

---

**Last Updated:** January 2, 2026

**Version:** 1.0.0

---

Made with ❤️ for the farmers of Norala, South Cotabato
