# CropAid Backend Implementation Plan

## 1. Architecture & Philosophy
*   **Core Principle**: "Singular Fetch / Load Once". Minimizing HTTP round-trips for mobile data efficiency.
*   **Stack**: Node.js + Express (API), PostgreSQL (Database).
*   **Security**: JWT (JSON Web Tokens) for stateless authentication.
*   **Validation**: Zod or Joi for strict input validation.

## 2. Database Schema (PostgreSQL)
Designed to support both Farmer and future Admin features without structural changes.

### `users`
*   `id` (UUID, PK)
*   `rsbsa_id` (String, Unique) - *Login ID*
*   `password_hash` (String)
*   `full_name` (String)
*   `role` (Enum: `farmer`, `admin`) - *Crucial for Admin scalability*
*   `created_at` (Timestamp)

### `farms`
*   `id` (UUID, PK)
*   `user_id` (UUID, FK -> users.id)
*   `barangay` (String) - *For Admin filtering by location*
*   `land_area` (Float)
*   `crop_type` (String)
*   `coordinates` (JSON/Point) - *Future proofing for Map view*

### `reports`
*   `id` (UUID, PK)
*   `user_id` (UUID, FK -> users.id)
*   `type` (Enum: `pest`, `flood`, `drought`)
*   `status` (Enum: `pending`, `verified`, `resolved`) - *Admin workflow field*
*   `details` (JSONB) - *Stores severity, images, specific notes*
*   `created_at` (Timestamp)

---

## 3. Implementation Batches

### Batch 1: Foundation & Authentication (The Gateway)
**Goal**: Securely register farmers (saving both user and farm data) and log them in.

*   **Setup**: Express server with `cors`, `helmet`, `pg` (node-postgres).
*   **Endpoint 1: `POST /api/auth/register`**
    *   **Input**: Full registration payload (Basic Info + Farm Info + App Info).
    *   **Logic**: Transactional Insert.
        1.  Insert into `users`.
        2.  Insert into `farms` using returned user ID.
    *   **Output**: Success message (No auto-login to force verification flow if needed).
    *   *Admin Note*: Future admins are created manually via DB seed or a hidden invite route.
*   **Endpoint 2: `POST /api/auth/login`**
    *   **Input**: `rsbsa_id`, `password`.
    *   **Logic**: Verify hash. Check role.
    *   **Output**: `{ token, role, user: { name, id } }`.

### Batch 2: The "Singular Fetch" (Dashboard Intelligence)
**Goal**: Load the entire dashboard state in ONE request to save bandwidth and reduce loading states.

*   **Endpoint 3: `GET /api/farmer/me`** (Protected)
    *   **Logic**:
        1.  Fetch User Profile & Farm Details.
        2.  Fetch Active Reports (Count & Latest 3).
        3.  Fetch Global/Barangay Announcements (Mocked or from `announcements` table).
        4.  Fetch Weather (Mocked or proxy to OpenWeatherMap).
    *   **Output (Unified JSON)**:
        ```json
        {
          "profile": { "name": "Juan", "barangay": "San Jose", "rsbsa": "..." },
          "weather": { "temp": 32, "condition": "Sunny" },
          "stats": { "active_reports": 1 },
          "recent_activity": [ ...latest reports... ],
          "latest_advisory": { "title": "Rice Black Bug Alert", "severity": "high" }
        }
        ```
    *   *Why*: Frontend Context (`UserContext`) calls this *once* on mount. Instant UI population.

### Batch 3: Reporting & CRUD (The Core Loop)
**Goal**: Allow farmers to submit data and view their own history.

*   **Endpoint 4: `POST /api/reports`**
    *   **Input**: `{ type, details: { description, damage_level }, location }`.
    *   **Logic**: Insert, default status 'pending'.
    *   *Admin Note*: This immediately populates the Admin's "Incoming Reports" feed.
*   **Endpoint 5: `GET /api/reports/history`**
    *   **Logic**: Fetch all reports for `req.user.id`.
    *   *Efficiency*: Only needed if the user opens the "History" tab. Dashboard uses the "Recent" list from Batch 2.

---

## 4. Frontend Integration Strategy
*   **AuthContext**: Persist JWT in `localStorage`. Decode `role` to protect routes (redirect Admins to `/admin-dashboard`).
*   **Dashboard Loading**:
    *   Show `Skeleton` loader.
    *   `useEffect` -> `fetch('/api/farmer/me')`.
    *   Store result in Global State.
*   **Optimistic UI**: When submitting a report, immediately add it to the local "Recent Activity" list before re-fetching.

## 5. Admin Future-Proofing Checklist
*   [x] **Role Column**: Database already distinguishes Admins vs Farmers.
*   [x] **Status Workflow**: Reports have `status` (pending -> resolved) built-in.
*   [x] **Location Data**: Farms have `barangay` tied to them, making "Heatmap" generation trivial for the Admin dashboard.
*   [x] **Unified API Structure**: The specific `GET /api/farmer/me` can have a sibling `GET /api/admin/overview` later without changing the core auth logic.
