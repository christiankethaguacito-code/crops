# CropAid Admin Dashboard & Integration Plan

## Phase 1: High-Fidelity Admin Dashboard UI (PC View - Mock Data)

**Objective:** Build a stunning, responsive, PC-optimized Admin Dashboard using React and Tailwind CSS. Focus on enhanced UI/UX, easy navigation, and data visualization.

### 1. Layout & Navigation (`src/layouts/AdminLayout.jsx`)
*   **Sidebar**:
    *   Logo & Branding (CropAid).
    *   Navigation Links: Dashboard, Farmers, Reports, Map View, Settings.
    *   Collapsible state for smaller PC screens.
*   **Top Bar**:
    *   Breadcrumbs.
    *   Global Search (Mock).
    *   Notifications dropdown.
    *   Admin Profile/Logout.
*   **Main Content Area**:
    *   Background with subtle patterns/gradients.
    *   Card-based layout for major sections.

### 2. Dashboard Overview (`src/pages/admin/AdminDashboard.jsx`)
*   **Stats Cards**: Total Farmers, Pending Reports, Resolved Issues, Today's Weather/Alerts.
*   **Charts**:
    *   Reports over time (Bar/Line chart using simple CSS or library if available, otherwise mock visuals).
    *   Reports by Type (Pie chart).
*   **Recent Activity Feed**: List of latest registrations and reports.

### 3. Farmer Management (`src/pages/admin/FarmerList.jsx`)
*   **Data Table**:
    *   Columns: Name, RSBSA ID, Barangay, Status, Actions.
    *   Features: Search bar, Filter by Barangay, Pagination UI.
*   **Farmer Detail Modal**:
    *   View full profile (Personal + Farm Info).
    *   "View on Map" button.

### 4. Report Management (`src/pages/admin/ReportList.jsx`)
*   **Tabs**: Pending, Verified, Resolved.
*   **Kanban or List View**:
    *   Cards showing Report Type, Farmer Name, Date, Severity.
*   **Action Panel**:
    *   Buttons to "Verify", "Resolve", or "Reject" reports (UI only).
    *   Notification sending simulation.

**Deliverable**: A fully clickable, visually polished Admin interface running on localhost with mock data.

---

## Phase 2: Full Stack Integration (Backend & Database)

**Objective**: Connect the Mock Admin Dashboard and the existing Farmer Dashboard to the Node.js/MySQL backend.

### 1. Backend Expansion (`server/index.js`)
*   **Middleware**: Ensure `authenticateToken` checks for `role === 'admin'` for admin routes.
*   **New Endpoints**:
    *   `GET /api/admin/stats`: Aggregate counts for dashboard.
    *   `GET /api/admin/farmers`: Fetch list of farmers with pagination/search.
    *   `GET /api/admin/reports`: Fetch all reports with filters.
    *   `PATCH /api/admin/reports/:id/status`: Update report status (Pending -> Verified -> Resolved).

### 2. Farmer Dashboard Integration (`src/pages/FarmerDashboard.jsx`)
*   **Report Submission**:
    *   Connect "Report Issue" button to `POST /api/reports`.
    *   Form: Type (Pest/Flood/Drought), Details, Location (auto-detect or manual).
    *   Success/Error handling (using new `setError` pattern).
*   **Report History**:
    *   Fetch data from `GET /api/reports/history`.
    *   Display status badges (Pending = Yellow, Verified = Blue, Resolved = Green).

### 3. Admin Dashboard Integration
*   **Wiring Up Pages**:
    *   Replace mock data in `AdminDashboard.jsx` with `useFetch` from `/api/admin/stats`.
    *   Populate `FarmerList.jsx` from `/api/admin/farmers`.
    *   Populate `ReportList.jsx` from `/api/admin/reports`.
*   **Action Handling**:
    *   Implement "Verify" button calling `PATCH` endpoint.
    *   Auto-refresh lists upon action.

**Deliverable**: A fully functional system where a Farmer can submit a report, and an Admin can view and resolve it on their PC dashboard.
