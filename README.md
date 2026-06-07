# VTON Platform

AI powered Virtual try-on platform built with Next.js, MongoDB, and FASHN AI.

Users can upload a person image and a garment image, generate virtual try-on results using AI, and manage generated jobs through a personal gallery.

---

## Production URI

https://vton-platformmvp.vercel.app/

---

## Features

- User Registration & Authentication
- JWT-based Authentication
- Secure API Key Management
- Virtual Try-On Generation
- Background Job Processing
- Webhook Integration
- User Gallery
- Image Download
- Dark / Light Theme
- Responsive Design

---

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- GSAP

### Backend

- Next.js Route Handlers
- MongoDB
- Mongoose
- JWT Authentication
- Zod Validation

### AI Integration

- FASHN AI

---

## Screenshots

### VTON Panel

![App Panel Screenshot](/screen-shot/dashboard.png)

Add screenshot here.

### Gallery

![App Gallery Screenshot](/screen-shot/gallery.png)

---

## Installation

Clone repository:

```bash
git clone https://github.com/yagizerdem/vton-platform.git
```

Install dependencies:

```bash
npm install
```

Create environment file:

```env
MONGODB_URI=<MongoDbConnectionString>

JWT_SECRET_KEY=<JwtSecretKey>

NODE_ENV=development

FASHN_API_KEY=<FashnApiKey>

API_KEY_ENCRYPTION_SECRET=<EncryptionSecret>

APP_BASE_URL=http://localhost:3000

NEXT_PUBLIC_API_BASE_URL=/api
```

Start development server:

```bash
npm run dev
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### VTON

```http
POST   /api/vton/try-on
POST   /api/vton/add-api-key
GET    /api/vton/get-job
DELETE /api/vton/delete-job/[id]
POST   /api/vton/webhook
```

---

## Security

- JWT Authentication
- Protected API Routes
- Encrypted API Key Storage
- User Ownership Validation
- Server-side Validation

---

## Future Improvements

- Infinite Gallery Scrolling
- Bulk Image Download
- Image Favorites
- Job Retry Support
- Admin Dashboard
- Social Sharing
- Multiple AI Providers

---

## Author

Yağız Erdem

GitHub:
https://github.com/yagizerdem

LinkedIn:
https://www.linkedin.com/in/erdemyagiz/

---

## License

MIT
