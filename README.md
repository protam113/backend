# HYBRBASE Technical Challenge: Client–Freelancer Portal

---

**Technical Challenge: Build a Client–Freelancer Portal with Payments & Project Visibility**

This challenge should take no more than 12 hours total to complete.  
Submit your completed challenge via GitHub URL to [toby.bui@hybrbase.com](mailto:toby.bui@hybrbase.com).

---

## 🧩 Overview

This repository contains the **backend service** of the **Client–Freelancer Portal**, built with **NestJS** and **MongoDB**.  
It provides APIs for authentication, project management, and payment integration (Paddle).

Frontend: [Next.js App](https://github.com/protam113/frontend_portal)  
Backend: This repo

---

## ⚙️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** MongoDB (with Mongoose ODM)
- **Language:** TypeScript
- **Auth:** JWT & Cookie-based auth
- **Payments:** Paddle Integration
- **Container:** Docker + Docker Compose

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
yarn install
````

---

### 2️⃣ Development mode

```bash
yarn start:dev
```

or simply

```bash
nest start
```

---

### 3️⃣ Build for production

```bash
nest build
```

---

### 4️⃣ Run with Docker (optional)

```bash
docker compose up -d
```

This will start:

* `MongoDB` container
* `Backend` container on port **8080**

---

## 🧠 Default Credentials (for testing)

| Role       | Email                                                   | Password     |
| ---------- | ------------------------------------------------------- | ------------ |
| Admin      | [admin@admin.com](admin@admin.com)         | Admin123     |

---

## 📂 Project Structure

```
.
├── addons/                 # MongoDB initialization scripts
│   └── init-mongo.js
│
├── docs/
│   └── entity.md           # Database entity documentation
│
├── src/
│   ├── app/                # Root app module and service
│   ├── common/             # Shared decorators, enums, guards
│   ├── configs/            # App & database configuration
│   ├── database/           # Database module & collection definitions
│   ├── entities/           # MongoDB schemas / entities
│   ├── modules/            # Core business modules (auth, user, project, etc.)
│   ├── middlewares/        # JWT cookie, CORS, rate limiter middlewares
│   ├── helpers/            # Helper functions
│   ├── utils/              # Cache/time utilities
│   ├── types/              # Custom TS declarations
│   └── main.ts             # App entry point
│
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=8080
MONGODB_URI=mongodb://localhost:27017/hybrbase_portal
JWT_SECRET=your_jwt_secret
```

---

## 🧾 Notes

* Uses `JWT` authentication with cookie strategy for session management.
* Modular architecture for scalability and reusability.
* Entity models follow consistent naming conventions (`UserEntity`, `ProjectEntity`, etc.).
* Uses `Zod` for DTO validation (via `@nestjs/class-validator` compatible schema).
* Ready for containerized deployment with Docker.

---

**Author:** Hoàng (Lenf)
**Date:** November 2025
**Challenge by:** [HYBRBASE](https://hybrbase.com)

