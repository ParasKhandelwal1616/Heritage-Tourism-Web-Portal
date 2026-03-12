# 🔐 Authentication Setup Guide

To complete the "Production-Level" authentication setup for the Heritage & Tourism Club Portal, follow these steps:

### 1. Google Cloud Console Configuration
- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project or select an existing one.
- Go to **APIs & Services** > **OAuth consent screen** and configure it for your project.
- Go to **Credentials** > **Create Credentials** > **OAuth client ID**.
- Select **Web application** as the Application type.
- Add the following **Authorized redirect URIs**:
  - `http://localhost:3000/api/auth/callback/google` (for local development)
  - `https://your-domain.com/api/auth/callback/google` (for production)
- Copy the **Client ID** and **Client Secret**.

### 2. Environment Variables
Create a `.env.local` file in the root of your project (if it doesn't exist) and add the following:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_random_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# Gemini AI (For AI Guide)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Generate NEXTAUTH_SECRET
You can generate a secure secret using the following command in your terminal:
```bash
openssl rand -base64 32
```

### 4. RBAC (Role-Based Access Control)
- By default, new users are assigned the **STUDENT** role.
- To promote a user to **ADMIN** or **MANAGER**, you can manually update their `role` field in the MongoDB `users` collection.
- The portal has protected routes:
  - `/dashboard/manager/*` - Accessible by ADMIN and MANAGER.
  - `/dashboard/admin/*` - Accessible ONLY by ADMIN.

### 5. Custom Sign-In Page
A premium branded sign-in page is already implemented at:
`src/app/auth/signin/page.tsx`
