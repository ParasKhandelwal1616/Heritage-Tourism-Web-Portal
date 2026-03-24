# 🏛️ Heritage Tourism Club Management System

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

A comprehensive, production-ready portal for managing Heritage and Tourism Clubs. This platform facilitates member engagement, event coordination, heritage site documentation, and real-time communication between club staff and students.

---

## 🌟 Key Features

### 🔐 Advanced Authentication & RBAC
- **Secure Auth**: Powered by NextAuth.js with Google OAuth and Email/Password support.
- **Role-Based Access Control**:
  - **Admin**: Full system control, user management, and global settings.
  - **Manager**: Club-level management, event coordination, and blog moderation.
  - **Student/Member**: Access to events, blogs, heritage sites, and community chat.

### 🗺️ Heritage Site Exploration
- **Interactive Maps**: Visualize heritage sites using Leaflet.js with custom markers and popups.
- **Rich Content**: Detailed documentation including historical significance, media galleries, and location data.

### 📝 Content Management
- **Blogs & News**: Dynamic blogging system with support for rich text and media.
- **Event Management**: Create, track, and manage club events with registration capabilities.
- **Media Support**: Seamless image and video uploads powered by **Cloudinary**.

### 💬 Real-time Communication
- **Dual Chat Rooms**: Separate channels for staff-only and general student discussions.
- **Interactive Polls**: Real-time polling system with live results.
- **Socket-Driven**: Instant messaging and updates without page refreshes.

### 🤖 AI-Powered Assistance
- **Gemini AI Integration**: Built-in AI guide to help users learn about heritage sites and club activities.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4.0, Framer Motion (Animations)
- **State/Data**: React Hooks, TanStack Table
- **Icons**: Lucide React
- **Maps**: React Leaflet

### Backend (Server)
- **Runtime**: Node.js with Express 5
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for media storage)
- Google Cloud Console account (for OAuth)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/heritage-tourism-club.git
   cd heritage-tourism-club
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create .env file based on the template below
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   # Create .env.local file based on the template below
   npm run dev
   ```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client (`client/.env.local`)
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_random_secret

# Database & AI
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (Public)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## 📂 Project Structure

```text
├── client/                # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router (Pages & API)
│   │   ├── components/    # Reusable UI Components
│   │   ├── lib/           # Shared Utilities (Auth, DB)
│   │   ├── models/        # Mongoose Models (for serverless/Next API)
│   │   └── types/         # TypeScript Definitions
├── server/                # Express Backend
│   ├── src/
│   │   ├── controllers/   # Request Handlers
│   │   ├── models/        # Mongoose Models
│   │   ├── routes/        # API Endpoints
│   │   └── index.ts       # Server Entry & Socket.io Logic
└── ...
```

---

## 🤝 Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ for Heritage Preservation
</p>
