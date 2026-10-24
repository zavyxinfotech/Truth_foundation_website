# Truth Foundation – Full-Stack Project

Registered NGO & Public Charitable Trust (Est. 2010), Redhills, Chennai, Tamil Nadu.

This repository is structured into three clean, independent modules:

```text
Truth_foundation_website/
├── frontend/   # Public Website (React 19 + TypeScript + Vite + Tailwind CSS)
├── backend/    # Express REST API (Node.js + Supabase PostgreSQL + Cloudinary)
└── admin/      # Admin Control Panel (React 19 + Dashboard + Gallery Uploader)
```

---

## 🚀 How to Run the Applications

### 1. Backend Server (Port 5000)
Handles Supabase PostgreSQL database queries, Cloudinary image uploads, Razorpay payment verification, and JWT admin authentication.

```bash
cd backend
npm install
npm run dev
```

### 2. Admin Dashboard (Port 5174)
Admin control panel for managing donations, donor receipts, uploading gallery photos to Cloudinary, and managing visitor inquiries.

```bash
cd admin
npm install
npm run dev
```

* **Default Admin Email:** `zavyxindia@gmail.com`
* **Default Admin Password:** `Truth@2026`

### 3. Public Website Frontend (Port 5173)
The official public donation and information portal with all existing high-res media, campaign data, and organic design.

```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Tech Stack & Integrations

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons
* **Admin:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, JWT Auth Client
* **Backend:** Node.js, Express, TypeScript, Multer, BcryptJS, JWT, Dotenv, CORS
* **Database:** Supabase Managed PostgreSQL (`ap-northeast-1`)
* **Media Storage:** Cloudinary CDN
* **Payment Gateway:** Razorpay
